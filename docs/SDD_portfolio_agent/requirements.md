
---

## 4. 도메인 설계 (Domain)
### 4.1 모델
- Message
  - role: "system" | "user" | "assistant"
  - content: str
  - created_at: datetime

- Thread
  - id: str
  - messages: list[Message]

- Chunk
  - text: str
  - source_file: str
  - header_path: str  (예: "projects > Aegis Sentinel > Tradeoffs")
  - chunk_id: str
  - score: float | None

- SourceRef
  - source_file: str
  - anchor: str (header_path or slug)
  - chunk_id: str

### 4.2 정책/규칙 (Domain Services)
- AnswerPolicy
  - 근거(retrieved chunks) 없으면 단정 금지
  - 답변에 sources 최소 1개 포함
  - summary_card 규격을 강제

---

## 5. 애플리케이션 설계 (Application)
### 5.1 Ports (interfaces)
- ChatLLMPort
  - stream(messages: list[Message], system_prompt: str) -> Iterator[str]
  - complete(messages: list[Message], system_prompt: str) -> str  (요약 카드 등 단발 호출용)

- EmbedderPort
  - embed(texts: list[str]) -> list[vector]

- VectorStorePort
  - upsert(chunks: list[Chunk], vectors: list[vector]) -> None
  - search(query_vector: vector, top_k: int) -> list[Chunk]
  - save(path: str) -> None
  - load(path: str) -> None

- DocumentStorePort
  - load_all() -> list[{"file": str, "text": str}]

- CheckpointerPort
  - get(thread_id: str) -> Thread | None
  - put(thread_id: str, thread: Thread) -> None

### 5.2 Usecases
#### BuildIndexUseCase
입력:
- md_dir
- index_dir
- chunk_size / chunk_overlap / top_k(기본값은 config)

처리:
1) DocumentStorePort.load_all()
2) chunking (header 기반 + 길이 제한)
3) EmbedderPort.embed(chunk_texts)
4) VectorStorePort.upsert(chunks, vectors)
5) VectorStorePort.save(index_dir)
6) metadata 저장(meta.json 등)

출력:
- 문서 수 / 청크 수 / 인덱스 경로

#### ChatStreamUseCase
입력:
- thread_id(optional)
- user_message

처리(권장 흐름):
1) thread 로드(없으면 생성)
2) thread.messages에 user 메시지 append
3) user_message embedding
4) VectorStorePort.search(top_k)
5) system_prompt에 “너는 박해원 포트폴리오 에이전트” + retrieved 근거 요약을 포함
6) ChatLLMPort.stream()으로 토큰 스트리밍
7) 마지막에 summary_card 생성 (complete 1회 or 규칙 기반)
8) thread.messages에 assistant 답변 append
9) 저장(CheckpointerPort.put)

출력:
- 스트림 token 이벤트
- sources(meta) 이벤트 (초반 1회)
- done 이벤트 (thread_id, summary_card)

---

## 6. RAG 설계 (md + index)
### 6.1 md 문서 규칙(추천)
- 최소 3개:
  - about.md (자기소개/지향점/가치관)
  - projects.md (프로젝트별: 문제-내역할-트레이드오프-성과-교훈)
  - experience.md (경력/기술스택/인프라 경험/운영 사례)

### 6.2 Chunking 전략
- “헤더 기반”으로 섹션을 먼저 나눔
- 섹션이 너무 길면 추가로 길이 기반 분할
- chunk metadata:
  - source_file, header_path, chunk_id
- chunk 크기: (예) 400~800 tokens 상당 / overlap 소량

### 6.3 Retrieval
- top_k = 5 (초기값)
- retrieved 결과는 답변에 출처로 표기
  - 예: `출처: projects.md > Aegis Sentinel > Tradeoffs`

---

## 7. 인터페이스(API) 설계 (FastAPI)
### 7.1 Endpoints
- GET /health
  - 200 OK

- POST /index/build
  - body: { "force": bool? }
  - response: { "docs": n, "chunks": n, "index_path": str }

- POST /chat/stream  (SSE)
  - body: { "thread_id": str?, "message": str }
  - response: text/event-stream

### 7.2 SSE 이벤트 규격
- event: token
  - data: "<partial text>"

- event: meta
  - data: { "sources": [ { "source_file": "...", "anchor": "...", "chunk_id": "..." } ] }

- event: done
  - data: { "thread_id": "...", "summary_card": { ... } }

### 7.3 summary_card 규격 (권장)
```json
{
  "one_liner": "한 줄 요약",
  "key_points": ["핵심1", "핵심2", "핵심3"],
  "evidence": ["projects.md > ...", "experience.md > ..."],
  "next_actions": ["다음 행동1", "다음 행동2"]
}

