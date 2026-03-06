from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal


Role = Literal["system", "user", "assistant"]


@dataclass(slots=True)
class Message:
    role: Role
    content: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass(slots=True)
class Thread:
    id: str
    messages: list[Message] = field(default_factory=list)


@dataclass(slots=True)
class Chunk:
    text: str
    source_file: str
    header_path: str
    chunk_id: str
    score: float | None = None


@dataclass(slots=True)
class SourceRef:
    source_file: str
    anchor: str
    chunk_id: str
