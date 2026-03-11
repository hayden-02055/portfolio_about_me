from __future__ import annotations

from pydantic_ai.messages import ModelMessage


class InMemoryCheckpointer:
    def __init__(self) -> None:
        self._store: dict[str, list[ModelMessage]] = {}

    def get(self, thread_id: str) -> list[ModelMessage]:
        return self._store.get(thread_id, [])

    def put(self, thread_id: str, messages: list[ModelMessage]) -> None:
        self._store[thread_id] = messages
