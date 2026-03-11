from __future__ import annotations

from typing import Protocol

from pydantic_ai.messages import ModelMessage

from app.domain.models.entities import Chunk


class EmbedderPort(Protocol):
    def embed(self, texts: list[str]) -> list[list[float]]:
        ...


class VectorStorePort(Protocol):
    def upsert(self, chunks: list[Chunk], vectors: list[list[float]]) -> None:
        ...

    def search(self, query_vector: list[float], top_k: int, score_threshold: float = 0.0) -> list[Chunk]:
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
    def get(self, thread_id: str) -> list[ModelMessage]:
        ...

    def put(self, thread_id: str, messages: list[ModelMessage]) -> None:
        ...
