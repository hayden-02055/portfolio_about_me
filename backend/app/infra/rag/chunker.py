from __future__ import annotations

import re

from app.domain.models.entities import Chunk


HEADER_PATTERN = re.compile(r"^(#{1,6})\s+(.*)$")


def chunk_markdown(
    source_file: str,
    text: str,
    chunk_size: int,
    chunk_overlap: int,
) -> list[Chunk]:
    sections = _split_by_headers(text)
    chunks: list[Chunk] = []
    seq = 0
    for header_path, section_text in sections:
        if not section_text.strip():
            continue
        for piece in _split_by_length(section_text, chunk_size, chunk_overlap):
            chunk_id = f"{source_file}:{seq}"
            chunks.append(
                Chunk(
                    text=piece,
                    source_file=source_file,
                    header_path=header_path,
                    chunk_id=chunk_id,
                )
            )
            seq += 1
    return chunks


def _split_by_headers(text: str) -> list[tuple[str, str]]:
    lines = text.splitlines()
    stack: list[str] = []
    current_header = "root"
    current: list[str] = []
    out: list[tuple[str, str]] = []

    def flush() -> None:
        if current:
            out.append((current_header, "\n".join(current).strip()))
            current.clear()

    for line in lines:
        match = HEADER_PATTERN.match(line.strip())
        if match:
            flush()
            level = len(match.group(1))
            title = match.group(2).strip()
            stack[:] = stack[: level - 1]
            stack.append(title)
            current_header = " > ".join(stack) if stack else "root"
            continue
        current.append(line)

    flush()
    return out


def _split_by_length(text: str, size: int, overlap: int) -> list[str]:
    if len(text) <= size:
        return [text]

    chunks: list[str] = []
    step = max(1, size - overlap)
    start = 0
    while start < len(text):
        end = min(len(text), start + size)
        chunks.append(text[start:end])
        if end == len(text):
            break
        start += step
    return chunks
