from __future__ import annotations

import json
import os
from dataclasses import asdict

import numpy as np

from app.domain.models.entities import Chunk


class LocalVectorStore:
    def __init__(self) -> None:
        self._chunks: list[Chunk] = []
        self._vectors: np.ndarray | None = None

    def upsert(self, chunks: list[Chunk], vectors: list[list[float]]) -> None:
        self._chunks = chunks
        self._vectors = np.array(vectors, dtype=np.float32)

    def search(self, query_vector: list[float], top_k: int, score_threshold: float = 0.0) -> list[Chunk]:
        if self._vectors is None or not self._chunks:
            return []

        q = np.array(query_vector, dtype=np.float32)
        v = self._vectors
        scores = (v @ q) / ((np.linalg.norm(v, axis=1) * np.linalg.norm(q)) + 1e-8)
        idxs = np.argsort(scores)[::-1][:top_k]
        result: list[Chunk] = []
        for idx in idxs:
            score = float(scores[int(idx)])
            if score < score_threshold:
                break
            c = self._chunks[int(idx)]
            c.score = score
            result.append(c)
        return result

    def save(self, path: str) -> None:
        os.makedirs(path, exist_ok=True)
        payload = {
            "chunks": [asdict(c) for c in self._chunks],
            "vectors": self._vectors.tolist() if self._vectors is not None else [],
        }
        with open(os.path.join(path, "vector_store.json"), "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)

    def load(self, path: str) -> None:
        file_path = os.path.join(path, "vector_store.json")
        if not os.path.exists(file_path):
            self._chunks = []
            self._vectors = None
            return

        with open(file_path, "r", encoding="utf-8") as f:
            payload = json.load(f)

        self._chunks = [Chunk(**chunk) for chunk in payload.get("chunks", [])]
        vectors = payload.get("vectors", [])
        self._vectors = np.array(vectors, dtype=np.float32) if vectors else None

    def is_loaded(self) -> bool:
        return bool(self._chunks) and self._vectors is not None
