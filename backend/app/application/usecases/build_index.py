from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Callable

from app.application.ports.ports import DocumentStorePort, EmbedderPort, VectorStorePort
from app.domain.errors import EmptyMarkdownError
from app.domain.models.entities import Chunk


ChunkerFn = Callable[[str, str, int, int], list[Chunk]]


@dataclass(slots=True)
class BuildIndexUseCase:
    document_store: DocumentStorePort
    embedder: EmbedderPort
    vector_store: VectorStorePort
    chunker: ChunkerFn

    def execute(
        self,
        md_dir: str,
        index_dir: str,
        chunk_size: int,
        chunk_overlap: int,
        embed_batch_size: int = 32,
    ) -> dict:
        documents = self.document_store.load_all(md_dir)
        if not documents:
            raise EmptyMarkdownError("No markdown documents were found.")

        chunks: list[Chunk] = []
        for doc in documents:
            chunks.extend(
                self.chunker(
                    source_file=doc["file"],
                    text=doc["text"],
                    chunk_size=chunk_size,
                    chunk_overlap=chunk_overlap,
                )
            )

        if not chunks:
            raise EmptyMarkdownError("Chunking result is empty.")

        vectors: list[list[float]] = []
        safe_batch_size = max(1, embed_batch_size)
        for i in range(0, len(chunks), safe_batch_size):
            batch = chunks[i : i + safe_batch_size]
            vectors.extend(self.embedder.embed([c.text for c in batch]))
        self.vector_store.upsert(chunks, vectors)
        self.vector_store.save(index_dir)

        os.makedirs(index_dir, exist_ok=True)
        meta = {
            "docs": len(documents),
            "chunks": len(chunks),
            "index_path": index_dir,
            "files": [d["file"] for d in documents],
        }
        with open(os.path.join(index_dir, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        return meta
