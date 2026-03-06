from __future__ import annotations

from typing import Iterator, Protocol

from app.domain.models.entities import Chunk, Message, Thread


class ChatLLMPort(Protocol):
    def stream(self, messages: list[Message], system_prompt: str) -> Iterator[str]:
        ...

    def complete(self, messages: list[Message], system_prompt: str) -> str:
        ...


class EmbedderPort(Protocol):
    def embed(self, texts: list[str]) -> list[list[float]]:
        ...


class VectorStorePort(Protocol):
    def upsert(self, chunks: list[Chunk], vectors: list[list[float]]) -> None:
        ...

    def search(self, query_vector: list[float], top_k: int) -> list[Chunk]:
        ...

    def save(self, path: str) -> None:
        ...

    def load(self, path: str) -> None:
        ...

    def is_loaded(self) -> bool:
        ...


class DocumentStorePort(Protocol):
    def load_all(self, md_dir: str) -> list[dict[str, str]]:
        ...


class CheckpointerPort(Protocol):
    def get(self, thread_id: str) -> Thread | None:
        ...

    def put(self, thread_id: str, thread: Thread) -> None:
        ...
