from __future__ import annotations

from dataclasses import dataclass

from app.application.usecases.build_index import BuildIndexUseCase
from app.application.usecases.chat_stream import ChatStreamUseCase
from app.domain.services.answer_policy import AnswerPolicy
from app.infra.config.settings import Settings, get_settings
from app.infra.embeddings.local_embedder import LocalEmbedder
from app.infra.llm.anthropic_chat_llm import AnthropicChatLLM
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

    embedder = LocalEmbedder()
    llm = AnthropicChatLLM(
        api_key=settings.ai_api_key,
        model=settings.ai_model_chat,
        max_tokens=settings.chat_max_tokens,
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
        llm=llm,
        embedder=embedder,
        vector_store=vector_store,
        checkpointer=InMemoryCheckpointer(),
        answer_policy=AnswerPolicy(),
        top_k=settings.top_k,
    )
    return Container(
        settings=settings,
        build_index_usecase=build_index,
        chat_stream_usecase=chat_stream,
        vector_store=vector_store,
    )
