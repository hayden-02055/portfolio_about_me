# Portfolio — AI Agent

개발자 박해원의 포트폴리오 사이트입니다.
포트폴리오 정보를 RAG 기반 AI 에이전트와 대화로 탐색할 수 있습니다.

---

## 주요 기능

- **포트폴리오 소개** — 개발 철학, 경험, 프로젝트를 정적 페이지로 제공
- **AI 챗 에이전트** — Markdown 문서 기반 RAG로 질문에 근거 있는 답변 스트리밍
- **대화 컨텍스트 유지** — Thread 단위 인메모리 체크포인터로 멀티턴 대화 지원
- **근거 기반 응답 강제** — 문서 근거가 부족하면 모른다고 명시하는 AnswerPolicy 적용

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, TypeScript, TailwindCSS |
| Backend | FastAPI, Python |
| LLM | Claude (Anthropic API, SSE 스트리밍) |
| Embedding | 로컬 임베더 (numpy 기반) |
| Vector Store | 로컬 JSON 벡터 스토어 |

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

---

## 프로젝트 구조

```
.
├── backend/
│   ├── app/
│   │   ├── domain/          # Entity, DomainService, Error
│   │   ├── application/     # UseCase, Port 인터페이스
│   │   ├── infra/           # LLM, Embedder, VectorStore, RAG, Config
│   │   └── interface/       # FastAPI 라우터, 스키마, SSE
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router
    │   └── components/      # UI 컴포넌트
    └── package.json
```

---

## 시작하기

### 환경 변수 설정

```bash
cp backend/.env.example backend/.env
# .env에 Anthropic API 키 입력
```

### 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
python main.py
```

서버가 실행되면 `http://localhost:8000/docs`에서 API 문서를 확인할 수 있습니다.

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000`에서 확인합니다.
