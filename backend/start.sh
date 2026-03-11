#!/bin/bash
set -e

echo "=== Building RAG index ==="
python - <<'EOF'
from app.infra.config.settings import get_settings
from app.infra.embeddings.sentence_transformer_embedder import SentenceTransformerEmbedder
from app.infra.rag.chunker import chunk_markdown
from app.infra.rag.local_vector_store import LocalVectorStore
from app.infra.rag.markdown_store import MarkdownDocumentStore
from app.application.usecases.build_index import BuildIndexUseCase

settings = get_settings()
use_case = BuildIndexUseCase(
    document_store=MarkdownDocumentStore(),
    embedder=SentenceTransformerEmbedder(),
    vector_store=LocalVectorStore(),
    chunker=chunk_markdown,
)
meta = use_case.execute(
    md_dir=settings.md_dir,
    index_dir=settings.index_dir,
    chunk_size=settings.chunk_size,
    chunk_overlap=settings.chunk_overlap,
    embed_batch_size=settings.embed_batch_size,
)
print(f"Index built: {meta['docs']} docs, {meta['chunks']} chunks -> {meta['index_path']}")
EOF

echo "=== Starting server ==="
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
