# SDD — Portfolio AI Agent (FastAPI + LangGraph + RAG) / Clean Architecture

## 0. 목표
- 포트폴리오 사이트에 탑재할 “근거 기반” AI Agent 백엔드 구축
- FastAPI + LangGraph + AI API + RAG(md + index)
- 클린 아키텍처(application/domain/infra/interface) 준수
- 프론트는 추후 작업, 백엔드 API는 안정적으로 유지

---

## 1. 핵심 요구사항 (MVP)
### 1.1 기능
- [ ] MD 문서로부터 인덱스 생성 (chunk → embedding → vector index 저장)
- [ ] 질문 입력 → 관련 근거 검색(top-k) → 답변 생성
- [ ] 답변은 스트리밍(SSE) 지원
- [ ] 답변에 “출처(sources)” 포함
- [ ] 답변 종료 시 “요약 카드(summary_card)” 생성

### 1.2 비기능
- [ ] 클린 아키텍처 의존 방향 유지
  - interface → application → domain
  - infra → application (port 구현)
  - domain은 외부 프레임워크 의존 금지
- [ ] 환경변수로 설정/키 관리 (키는 절대 코드에 하드코딩 금지)
- [ ] 인덱스 파일은 로컬 저장(추후 S3/DB로 교체 가능하게 설계)

---

## 2. 시스템 아키텍처
### 2.1 계층별 책임
#### Domain
- 대화/문서청크/출처 등의 핵심 모델과 규칙
- “근거 없는 추측 금지”, “출처 최소 1개 포함” 같은 정책

#### Application
- 유스케이스 단위로 흐름 조립 (ChatStream, BuildIndex)
- Port(인터페이스) 정의 (LLM, Embedder, VectorStore, DocStore, Checkpointer)

#### Infra
- Port 구현체
- AI API(OpenAI 등), Embedding, FAISS/Chroma, 파일시스템(md 로딩), 저장소 구현

#### Interface
- FastAPI 라우터, Request/Response DTO
- SSE 스트리밍 응답 포맷

---

## 3. 폴더 구조 (권장)
backend/
app/
domain/
models/
services/
errors.py

application/
  ports/
  usecases/
  dto/

infra/
  config/
  llm/
  embeddings/
  rag/
  persistence/
  data/
    md/
    index/

interface/
  http/
    routes/
    sse.py
    fastapi_app.py

main.py

