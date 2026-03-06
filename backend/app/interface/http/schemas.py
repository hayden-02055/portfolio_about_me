from __future__ import annotations

from pydantic import BaseModel


class BuildIndexRequest(BaseModel):
    force: bool = False


class ChatStreamRequest(BaseModel):
    thread_id: str | None = None
    message: str
