from __future__ import annotations

import uuid
from dataclasses import dataclass
from typing import AsyncIterator

from pydantic_ai import Agent
from pydantic_ai.messages import ModelMessage

from app.application.ports.ports import CheckpointerPort, EmbedderPort, VectorStorePort
from app.domain.errors import MissingIndexError
from app.domain.models.entities import SourceRef
from app.domain.services.answer_policy import AnswerPolicy
from app.infra.llm.pydantic_ai_agent import RagDeps


@dataclass(slots=True)
class ChatStreamUseCase:
    agent: Agent[RagDeps, str]
    embedder: EmbedderPort
    vector_store: VectorStorePort
    checkpointer: CheckpointerPort
    answer_policy: AnswerPolicy
    top_k: int
    score_threshold: float

    async def execute(self, thread_id: str | None, user_message: str) -> AsyncIterator[dict]:
        if not self.vector_store.is_loaded():
            raise MissingIndexError("Index is not loaded. Build index first.")

        resolved_thread_id = thread_id or str(uuid.uuid4())
        history: list[ModelMessage] = self.checkpointer.get(resolved_thread_id)

        query_vector = self.embedder.embed([user_message])[0]
        retrieved_chunks = self.vector_store.search(query_vector=query_vector, top_k=self.top_k, score_threshold=self.score_threshold)

        if not retrieved_chunks:
            no_context_msg = (
                "관련 문서를 찾지 못했습니다. "
                "질문을 다르게 표현하거나 더 구체적인 키워드로 질문해 주세요."
            )
            yield {"event": "meta", "data": {"sources": []}}
            yield {"event": "token", "data": no_context_msg}
            yield {
                "event": "done",
                "data": {
                    "thread_id": resolved_thread_id,
                    "summary_card": self.answer_policy.build_summary_card(no_context_msg, []),
                },
            }
            return

        sources = [
            SourceRef(source_file=c.source_file, anchor=c.header_path, chunk_id=c.chunk_id)
            for c in retrieved_chunks
        ]
        source_text = "\n".join(
            [f"- {c.source_file} > {c.header_path}\n{c.text}" for c in retrieved_chunks]
        )

        deps = RagDeps(
            embedder=self.embedder,
            vector_store=self.vector_store,
            top_k=self.top_k,
            source_text=source_text,
            sources=sources,
        )

        yield {
            "event": "meta",
            "data": {
                "sources": [
                    {
                        "source_file": s.source_file,
                        "anchor": s.anchor,
                        "chunk_id": s.chunk_id,
                    }
                    for s in sources
                ]
            },
        }

        collected: list[str] = []
        async with self.agent.run_stream(
            user_message,
            deps=deps,
            message_history=history,
        ) as result:
            async for token in result.stream_text(delta=True):
                collected.append(token)
                yield {"event": "token", "data": token}

            new_history = result.all_messages()

        final_answer = "".join(collected).strip()
        self.checkpointer.put(resolved_thread_id, new_history)

        yield {
            "event": "done",
            "data": {
                "thread_id": resolved_thread_id,
                "summary_card": self.answer_policy.build_summary_card(final_answer, sources),
            },
        }
