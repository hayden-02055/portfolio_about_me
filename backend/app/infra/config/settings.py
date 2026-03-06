from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True, slots=True)
class Settings:
    ai_api_key: str
    ai_model_chat: str
    md_dir: str
    index_dir: str
    top_k: int
    chunk_size: int
    chunk_overlap: int
    chat_max_tokens: int
    embed_batch_size: int


def get_settings() -> Settings:
    return Settings(
        ai_api_key=os.getenv("AI_API_KEY", ""),
        ai_model_chat=os.getenv("AI_MODEL_CHAT", "claude-sonnet-4-6"),
        md_dir=os.getenv("MD_DIR", "app/infra/data/md"),
        index_dir=os.getenv("INDEX_DIR", "app/infra/data/index"),
        top_k=int(os.getenv("TOP_K", "5")),
        chunk_size=int(os.getenv("CHUNK_SIZE", "1200")),
        chunk_overlap=int(os.getenv("CHUNK_OVERLAP", "200")),
        chat_max_tokens=int(os.getenv("CHAT_MAX_TOKENS", "1024")),
        embed_batch_size=int(os.getenv("EMBED_BATCH_SIZE", "32")),
    )
