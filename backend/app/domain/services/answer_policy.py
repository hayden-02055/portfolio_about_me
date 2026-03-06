from __future__ import annotations

from dataclasses import dataclass

from app.domain.models.entities import SourceRef


@dataclass(slots=True)
class AnswerPolicy:
    min_sources: int = 1

    def require_grounded_answer(self, draft: str, sources: list[SourceRef]) -> str:
        if len(sources) >= self.min_sources:
            return draft
        return (
            "현재 제공된 근거 문서에서 확실히 확인되지 않아 단정적으로 답하기 어렵습니다. "
            "질문 범위를 조금 더 구체화해 주시거나 관련 정보를 문서에 추가해 주세요."
        )

    def build_summary_card(self, answer_text: str, sources: list[SourceRef]) -> dict:
        trimmed = answer_text.strip()
        one_liner = trimmed.split("\n")[0][:120] if trimmed else "근거 기반 응답을 생성했습니다."
        evidence = [f"{s.source_file} > {s.anchor}" for s in sources[:3]]
        return {
            "one_liner": one_liner,
            "key_points": [
                "문서 근거를 바탕으로 답변을 생성했습니다.",
                "답변과 함께 출처를 제공했습니다.",
                "근거가 부족하면 단정 표현을 피합니다.",
            ],
            "evidence": evidence or ["근거 없음"],
            "next_actions": [
                "자주 받는 질문을 md 문서에 추가하세요.",
                "프로젝트별 트레이드오프를 더 구체적으로 작성하세요.",
            ],
        }
