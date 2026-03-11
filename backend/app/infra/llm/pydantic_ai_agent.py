from __future__ import annotations

from dataclasses import dataclass, field

from pydantic_ai import Agent, RunContext
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.providers.anthropic import AnthropicProvider

from app.application.ports.ports import EmbedderPort, VectorStorePort
from app.domain.models.entities import SourceRef


@dataclass
class RagDeps:
    embedder: EmbedderPort
    vector_store: VectorStorePort
    top_k: int
    source_text: str = ""
    sources: list[SourceRef] = field(default_factory=list)


def build_agent(model_name: str, max_tokens: int, api_key: str) -> Agent[RagDeps, str]:
    agent: Agent[RagDeps, str] = Agent(
        AnthropicModel(model_name, provider=AnthropicProvider(api_key=api_key)),
        result_type=str,
        model_settings={"max_tokens": max_tokens},
    )

    @agent.system_prompt
    def rag_system_prompt(ctx: RunContext[RagDeps]) -> str:
        return (
            "당신은 박해원의 포트폴리오를 소개하는 AI 에이전트입니다.\n"
            "방문자의 질문에 대해 박해원의 개발 철학, 경험, 프로젝트를 바탕으로 구체적이고 설득력 있게 답변하세요.\n\n"
            "## 답변 원칙\n"
            "- 아래 [근거 문맥]에 있는 내용을 바탕으로 답변합니다.\n"
            "- 여러 섹션의 내용을 종합해서 자연스러운 문장으로 설명하세요. 단순 나열보다 맥락을 연결하세요.\n"
            "- 박해원을 3인칭(\"박해원은 ...\")으로 소개하되, 그의 관점과 목소리를 살려 답변하세요.\n"
            "- 기술 용어는 그대로 사용하되, 왜 그 선택을 했는지 이유와 트레이드오프를 함께 설명하세요.\n"
            "- 근거 문맥에 없는 내용은 추측하거나 지어내지 마세요. 확인되지 않으면 솔직하게 말하세요.\n\n"
            "## 자주 받는 질문 유형\n"
            "- 어떤 개발자인가 / 강점이 무엇인가 → 철학과 경험을 종합해서 답변\n"
            "- 특정 프로젝트에 대해 → 문제 정의 → 결정 → 결과 순으로 설명\n"
            "- 기술 선택 이유 → 트레이드오프와 함께 설명\n\n"
            f"[근거 문맥]\n{ctx.deps.source_text}"
        )

    return agent
