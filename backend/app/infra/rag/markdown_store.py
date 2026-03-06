from __future__ import annotations

from pathlib import Path


class MarkdownDocumentStore:
    def load_all(self, md_dir: str) -> list[dict[str, str]]:
        base = Path(md_dir)
        if not base.exists():
            return []

        docs: list[dict[str, str]] = []
        for path in sorted(base.glob("*.md")):
            text = path.read_text(encoding="utf-8").strip()
            if not text:
                continue
            docs.append({"file": path.name, "text": text})
        return docs
