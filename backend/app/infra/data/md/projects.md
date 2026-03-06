# Projects

---

## Project 1: Fingoo Backend Architecture Rebuild

### 1. Context

- 투자 교육 및 게임형 금융 서비스 백엔드
- 초기 단일 API 구조 (NestJS + TypeORM + PostgreSQL)
- AWS EC2 + Docker 기반 배포
- Redis 캐싱 사용
- 프론트엔드: Next.js + React (Vercel 배포)

### 2. Problem Definition

- CQRS 패턴을 도입했으나 경계가 명확하지 않았음
- application / infra 의존성 혼재
- 인증 구조가 JWT와 쿠키 기반으로 혼용됨
- 기능 수정 시 의존성 추적에 수 시간 소요
- 장애 발생 시 원인 추적이 어려움
- 구조 이해를 위해 일부 디렉터리를 분리하여 분석해야 했음

본질:
레거시 아키텍처가 개발 속도보다 유지보수 비용을 증가시키고 있었음.

### 3. Architectural Decision

검토한 선택지:
1. 기존 구조 유지 후 부분 리팩터링
2. CQRS 유지하되 의존성 방향 재정렬
3. MSA 기반 경계 재설정 + 인증 분리

최종 선택:
- 클린 아키텍처 기반 재정렬
- interface → application → domain 단방향 의존성 강제
- infra는 port 구현체로만 존재
- 인증(Auth) 경계 분리
- AI 서버(FastAPI) 분리
- 기능 단위 MSA 전환

### 4. Implementation

- NestJS 구조 재설계
- TypeORM Repository 경계 명확화
- Redis 사용 범위 제한
- Docker Compose 구조 정리
- AWS EC2 환경 변수 관리 개선
- API 응답 구조 표준화

### 5. Result

- 기능 수정 시 영향 범위 예측 가능
- 코드 리뷰 시간 감소
- 장애 추적 시간 단축
- 개발자 온보딩 난이도 감소

### 6. Lessons Learned

- 작동하는 시스템과 이해 가능한 시스템은 다르다
- 아키텍처는 생산성을 늦추는 것이 아니라 미래 속도를 결정한다
- AI 시대일수록 구조적 사고는 더 중요하다

---

## Project 2: Aegis Sentinel – AI 기반 DevOps Agent

### 1. Context

- FastAPI 기반 AI Agent
- 목적: 서버 상태 모니터링 및 자동 대응
- Docker 환경에서 실행
- LangGraph 기반 에이전트 설계
- 로그 분석 및 자동 수정 전략 연구

### 2. Problem Definition

- 서버 장애 원인 추적에 시간 소요
- 로그 분석이 수동적이며 반복적
- DevOps 자동화 부족

### 3. Architectural Decision

- AI Agent를 별도 서비스로 구성
- LangGraph 기반 상태 관리
- 로그 수집 → 구조화 → 분석 → 대응 전략 생성
- Auto logging + fix 전략 설계

### 4. Implementation

- FastAPI 서버 구축
- LangGraph 상태 기반 워크플로우 설계
- 로그 기반 RAG 구조 설계
- Docker 기반 독립 실행 구조

### 5. Result

- 장애 분석 자동화 가능성 확인
- 반복적 로그 분석 작업 감소
- AI 기반 DevOps 가능성 검증

### 6. Lessons Learned

- AI는 단순 자동화 도구가 아니라 구조 설계 문제
- 로그 데이터 구조가 모델 품질을 결정한다
- DevOps와 AI는 긴밀히 연결될 수 있다

---

## Project 3: AI Model Engineering & Data Processing

### 1. Context

- PyTorch 기반 모델 실험
- Pandas / PySpark / Databricks 사용
- 데이터 전처리 중심 접근

### 2. Problem Definition

- 모델 성능이 데이터 품질에 크게 의존
- 전처리 전략에 따라 성능 편차 발생

### 3. Approach

- 정규화 및 Feature Engineering 실험
- 분산 환경에서 데이터 처리 최적화
- Spark shuffle 병목 분석
- 데이터 누수 방지 전략 설계

### 4. Result

- 데이터 품질 개선 시 모델 안정성 증가 확인
- 분산 처리 시 파이프라인 설계 중요성 인식

### 5. Lessons Learned

- 모델보다 데이터가 중요하다
- 확률 모델은 입력 분포에 지배된다
- AI 시스템은 데이터 엔지니어링과 분리될 수 없다