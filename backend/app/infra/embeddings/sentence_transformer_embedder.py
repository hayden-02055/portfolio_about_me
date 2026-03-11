from __future__ import annotations

from sentence_transformers import SentenceTransformer


class SentenceTransformerEmbedder:
    def __init__(self, model_name: str = "paraphrase-multilingual-MiniLM-L12-v2") -> None:
        self._model = SentenceTransformer(model_name)

    def embed(self, texts: list[str]) -> list[list[float]]:
        vectors = self._model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
        return vectors.tolist()
