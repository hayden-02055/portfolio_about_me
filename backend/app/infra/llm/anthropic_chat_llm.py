from __future__ import annotations

from typing import Iterator

from anthropic import Anthropic

from app.domain.models.entities import Message


class AnthropicChatLLM:
    def __init__(self, api_key: str, model: str, max_tokens: int = 1024) -> None:
        self._client = Anthropic(api_key=api_key)
        self._model = model
        self._max_tokens = max_tokens

    def _to_payload(self, messages: list[Message]) -> list[dict[str, str]]:
        payload: list[dict[str, str]] = []
        for m in messages:
            if m.role == "system":
                continue
            payload.append({"role": m.role, "content": m.content})
        return payload or [{"role": "user", "content": "안녕하세요."}]

    def stream(self, messages: list[Message], system_prompt: str) -> Iterator[str]:
        with self._client.messages.stream(
            model=self._model,
            system=system_prompt,
            max_tokens=self._max_tokens,
            messages=self._to_payload(messages),
        ) as stream:
            for text in stream.text_stream:
                yield text

    def complete(self, messages: list[Message], system_prompt: str) -> str:
        res = self._client.messages.create(
            model=self._model,
            system=system_prompt,
            max_tokens=self._max_tokens,
            messages=self._to_payload(messages),
        )
        texts = [block.text for block in res.content if getattr(block, "type", "") == "text"]
        return "".join(texts)
