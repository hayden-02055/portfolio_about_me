# Portfolio AI Agent Backend

## 1) 설치
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

`.env`에 Anthropic `AI_API_KEY`를 입력하세요.

## 2) 실행
```bash
uvicorn main:app --reload
```

## 3) API
- `GET /health`
- `POST /index/build`
- `POST /chat/stream` (SSE)

## 모델 설정
- Chat: Claude (Anthropic API)
- Embedding: 로컬 임베더(외부 임베딩 API 미사용)
- 인덱스 빌드 시 임베딩은 배치 처리 (`EMBED_BATCH_SIZE`, 기본 32)

## 4) 테스트 예시
```bash
curl -X POST http://127.0.0.1:8000/index/build -H "Content-Type: application/json" -d "{}"
```

```bash
curl -N -X POST http://127.0.0.1:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"당신의 강점은 뭐야?"}'
```
