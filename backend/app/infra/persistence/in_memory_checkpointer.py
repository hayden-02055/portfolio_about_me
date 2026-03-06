from __future__ import annotations

from app.domain.models.entities import Thread


class InMemoryCheckpointer:
    def __init__(self) -> None:
        self._threads: dict[str, Thread] = {}

    def get(self, thread_id: str) -> Thread | None:
        return self._threads.get(thread_id)

    def put(self, thread_id: str, thread: Thread) -> None:
        self._threads[thread_id] = thread
