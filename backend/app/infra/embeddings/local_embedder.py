from __future__ import annotations

import hashlib
import re

import numpy as np


class LocalEmbedder:
    def __init__(self, dim: int = 384) -> None:
        self._dim = dim
        self._token_pattern = re.compile(r"[A-Za-z0-9가-힣_]+")

    def embed(self, texts: list[str]) -> list[list[float]]:
        return [self._embed_one(text) for text in texts]

    def _embed_one(self, text: str) -> list[float]:
        vec = np.zeros(self._dim, dtype=np.float32)
        tokens = self._token_pattern.findall(text.lower())
        if not tokens:
            return vec.tolist()

        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            idx = int.from_bytes(digest[:4], "big") % self._dim
            sign = 1.0 if digest[4] % 2 == 0 else -1.0
            vec[idx] += sign

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()
