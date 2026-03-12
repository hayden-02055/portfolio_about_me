# Portfolio — AI Agent

개발자 박해원의 포트폴리오 사이트입니다.
포트폴리오 정보를 RAG 기반 AI 에이전트와 대화로 탐색할 수 있습니다.

---

## 사이트 소개

이 사이트는 단순한 포트폴리오 페이지가 아닙니다.

방문자는 AI 에이전트에게 질문을 던지는 방식으로 박해원의 개발 철학, 경험, 프로젝트를 탐색할 수 있습니다.
에이전트는 Markdown 문서를 청킹·임베딩한 벡터 인덱스를 기반으로 관련 문맥을 검색하고,
Claude API를 통해 근거 있는 답변을 스트리밍으로 제공합니다.

질문 예시:
- "박해원의 개발 철학이 뭔가요?"
- "어떤 프로젝트를 했나요?"
- "클린 아키텍처를 왜 선택했나요?"

---

## 주요 기능

- **포트폴리오 소개** — 개발 철학, 경험, 프로젝트를 정적 페이지로 제공
- **AI 챗 에이전트** — Markdown 문서 기반 RAG로 질문에 근거 있는 답변 스트리밍
- **대화 컨텍스트 유지** — Thread 단위 인메모리 체크포인터로 멀티턴 대화 지원
- **의미 기반 응답 합성** — 질문 단어와 문서 단어가 달라도 의미상 관련 내용을 종합해서 답변. 문서에 전혀 근거가 없을 때만 모른다고 명시

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, TypeScript, TailwindCSS |
| Backend | FastAPI, Python 3.12 |
| AI Agent | PydanticAI, Claude Sonnet (Anthropic API) |
| Embedding | sentence-transformers (`paraphrase-multilingual-MiniLM-L12-v2`) |
| Vector Store | 로컬 JSON 벡터 스토어 (코사인 유사도) |
| Streaming | SSE (Server-Sent Events) |

---

## 아키텍처

백엔드는 **클린 아키텍처** 원칙을 따릅니다.

```
interface (HTTP/FastAPI)
    ↓
application (UseCase, Port 정의)
    ↓
domain (Entity, DomainService, Error)

infra (Port 구현체: LLM, Embedder, VectorStore, Checkpointer)
```

의존성 방향은 `interface → application → domain` 단방향으로 유지되며,
`infra`는 `application`의 Port 인터페이스를 구현하는 어댑터 역할만 합니다.

RAG 흐름:

```
[사용자 질문]
    ↓ embed (sentence-transformers)
[쿼리 벡터]
    ↓ cosine similarity search (score_threshold: 0.2, top_k: 5)
[관련 청크]
    ↓ 시스템 프롬프트에 [근거 문맥]으로 주입
[Claude API] → SSE 스트리밍 응답
```

---

## 프로젝트 구조

```
.
├── backend/
│   ├── app/
│   │   ├── domain/          # Entity, DomainService, Error
│   │   ├── application/     # UseCase, Port 인터페이스
│   │   ├── infra/
│   │   │   ├── llm/         # PydanticAI 에이전트, 시스템 프롬프트
│   │   │   ├── embeddings/  # SentenceTransformer 임베더
│   │   │   ├── rag/         # 벡터 스토어, 청커, Markdown 로더
│   │   │   ├── data/
│   │   │   │   ├── md/      # 포트폴리오 원본 Markdown 문서
│   │   │   │   └── index/   # 빌드된 벡터 인덱스 (JSON)
│   │   │   └── config/      # Settings
│   │   └── interface/       # FastAPI 라우터, 스키마, SSE
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router
    │   └── components/      # UI 컴포넌트
    └── package.json
```
