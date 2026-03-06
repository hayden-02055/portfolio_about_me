8. 설정/환경변수

AI_API_KEY: string

AI_MODEL_CHAT: string

AI_MODEL_EMBED: string

MD_DIR: string (예: app/infra/data/md)

INDEX_DIR: string (예: app/infra/data/index)

TOP_K: int

CHUNK_SIZE: int

CHUNK_OVERLAP: int

9. 에러/예외 전략

인덱스 미존재 상태에서 chat 요청 → 409 or 400 (build index 필요)

md 폴더 비어있음 → build 실패

AI API 실패 → 502/503 + 에러 메시지(민감정보 제외)

SSE 스트림 도중 예외 → event: error 로 전송 후 종료

10. 테스트 시나리오 (최소)

 /health OK

 /index/build 성공 → chunks > 0

 /chat/stream 질의 시 token 이벤트가 연속적으로 옴

 meta 이벤트에 sources 포함

 done 이벤트에 summary_card 포함

 근거 부족 질문에 대해 “모른다/추가정보 요청”이 포함되는지

 11. 바이브 코딩 체크리스트 (구현 순서)

 domain 모델/정책부터 작성

 application ports 정의

 infra: md_loader + chunker 구현

 infra: embedder + vector_store 구현(FAISS 권장)

 usecase: BuildIndexUseCase 완성 → /index/build 연결

 usecase: ChatStreamUseCase 완성 (retrieve → stream → summary)

 interface: SSE 헬퍼 + /chat/stream 라우팅

 로컬로 curl로 스트리밍 확인

 (나중에) 프론트 연결