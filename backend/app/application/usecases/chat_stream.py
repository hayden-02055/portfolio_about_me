from __future__ import annotations

import uuid
from dataclasses import dataclass
from typing import Iterator

from app.application.ports.ports import ChatLLMPort, CheckpointerPort, EmbedderPort, VectorStorePort
from app.domain.errors import MissingIndexError
from app.domain.models.entities import Message, SourceRef, Thread
from app.domain.services.answer_policy import AnswerPolicy


@dataclass(slots=True)
class ChatStreamUseCase:
    llm: ChatLLMPort
    embedder: EmbedderPort
    vector_store: VectorStorePort
    checkpointer: CheckpointerPort
    answer_policy: AnswerPolicy
    top_k: int

    def execute(self, thread_id: str | None, user_message: str) -> Iterator[dict]:
        if not self.vector_store.is_loaded():
            raise MissingIndexError("Index is not loaded. Build index first.")

        resolved_thread_id = thread_id or str(uuid.uuid4())
        thread = self.checkpointer.get(resolved_thread_id) or Thread(id=resolved_thread_id)

        user_msg = Message(role="user", content=user_message)
        thread.messages.append(user_msg)

        query_vector = self.embedder.embed([user_message])[0]
        retrieved_chunks = self.vector_store.search(query_vector=query_vector, top_k=self.top_k)
        sources = [
            SourceRef(source_file=c.source_file, anchor=c.header_path, chunk_id=c.chunk_id)
            for c in retrieved_chunks
        ]
        source_text = "\n".join(
            [f"- {c.source_file} > {c.header_path}\n{c.text}" for c in retrieved_chunks]
        )

        system_prompt = (
            "너는 박해원 포트폴리오 에이전트다. 반드시 제공된 근거 문맥 안에서만 답변하라. "
            "근거가 부족하면 모른다고 말하고 추가 정보를 요청하라.\n\n"
            f"[근거 문맥]\n{source_text}"
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
        for token in self.llm.stream(messages=thread.messages, system_prompt=system_prompt):
            collected.append(token)
            yield {"event": "token", "data": token}

        draft_answer = "".join(collected).strip()
        final_answer = self.answer_policy.require_grounded_answer(draft_answer, sources)
        if final_answer != draft_answer:
            yield {"event": "token", "data": "\n\n" + final_answer}

        assistant_msg = Message(role="assistant", content=final_answer)
        thread.messages.append(assistant_msg)
        self.checkpointer.put(resolved_thread_id, thread)

        summary_card = self.answer_policy.build_summary_card(final_answer, sources)
        yield {
            "event": "done",
            "data": {"thread_id": resolved_thread_id, "summary_card": summary_card},
        }
