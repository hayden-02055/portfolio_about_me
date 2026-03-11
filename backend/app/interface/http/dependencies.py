from __future__ import annotations

from dataclasses import dataclass

from app.application.usecases.build_index import BuildIndexUseCase
from app.application.usecases.chat_stream import ChatStreamUseCase
from app.domain.services.answer_policy import AnswerPolicy
from app.infra.config.settings import Settings, get_settings
from app.infra.embeddings.sentence_transformer_embedder import SentenceTransformerEmbedder
from app.infra.llm.pydantic_ai_agent import build_agent
from app.infra.persistence.in_memory_checkpointer import InMemoryCheckpointer
from app.infra.rag.chunker import chunk_markdown
from app.infra.rag.local_vector_store import LocalVectorStore
from app.infra.rag.markdown_store import MarkdownDocumentStore


@dataclass(slots=True)
class Container:
    settings: Settings
    build_index_usecase: BuildIndexUseCase
    chat_stream_usecase: ChatStreamUseCase
    vector_store: LocalVectorStore


def build_container() -> Container:
    settings = get_settings()

    embedder = SentenceTransformerEmbedder()
    agent = build_agent(
        model_name=settings.ai_model_chat,
        max_tokens=settings.chat_max_tokens,
        api_key=settings.ai_api_key,
    )
    vector_store = LocalVectorStore()
    vector_store.load(settings.index_dir)

    build_index = BuildIndexUseCase(
        document_store=MarkdownDocumentStore(),
        embedder=embedder,
        vector_store=vector_store,
        chunker=chunk_markdown,
    )
    chat_stream = ChatStreamUseCase(
        agent=agent,
        embedder=embedder,
        vector_store=vector_store,
        checkpointer=InMemoryCheckpointer(),
        answer_policy=AnswerPolicy(),
        top_k=settings.top_k,
        score_threshold=settings.score_threshold,
    )
    return Container(
        settings=settings,
        build_index_usecase=build_index,
        chat_stream_usecase=chat_stream,
        vector_store=vector_store,
    )
