# 프로젝트 UI/문서 점검표

이 문서는 Portfolio Hub에 연결된 프로젝트들이 이력서 포트폴리오 관점에서 어떤 화면을 제공하고, 어떤 문서를 함께 봐야 하는지 정리한다.

## 점검 기준

- 첫 화면에서 프로젝트의 목적이 바로 보이는가
- 단순 API 호출 화면이 아니라 사용자의 업무 흐름을 보여주는가
- README에서 실행 URL, 시연 순서, 데모 계정, 핵심 어필 포인트를 찾을 수 있는가
- 화면 캡처 기반 포트폴리오 문서가 있는가
- 허브에서 연결했을 때 최신 커밋 상태가 GitHub 기준으로 동기화되는가

## 로컬 UI 목록

| 프로젝트 | 로컬 UI | 화면 성격 | 문서 상태 | 포트폴리오 관점 |
| --- | --- | --- | --- | --- |
| Warehouse Ops Suite | `http://localhost:5173` | WMS 운영자 Admin Web | `docs/resume-portfolio.md`, `docs/product-manual.md` | 가장 완성도 높은 제품형 사례 |
| Maternity Care Commerce | `http://localhost:5174`, `http://localhost:5175` | 관리자 백오피스, 사용자 웹 | `docs/resume-portfolio.md` | 현업 부서 요구사항과 개인정보/감사 로그 설명에 적합 |
| Kotlin Commerce Core | `http://localhost:5183` | 커머스 주문 흐름 데모 UI | `README.md` 중심 | Kafka/Outbox 구조를 사용자가 누를 수 있는 흐름으로 설명 |
| Stock Lock Benchmark | `http://localhost:18081` | 락 전략 실험 콘솔 | `README.md`, `docs/benchmark-report.md`, `docs/runbook.md` | 동시성 선택을 수치와 실험으로 설명 |

## 현재 판단

### 강한 프로젝트

- `warehouse-ops-suite`: 화면, 사용자 매뉴얼, 기능 명세, 실행 단위 설명이 가장 잘 연결되어 있다.
- `maternity-care-commerce`: 사용자/관리자 화면과 도메인 요구사항 설명이 균형 있게 정리되어 있다.
- `stock-lock-benchmark`: 실험 결과가 수치와 화면으로 같이 제시되어 설계 판단의 근거가 잘 보인다.

### 보강하면 좋은 지점

- `kotlin-commerce-core`: README는 충분하지만 별도 사용자 매뉴얼보다는 아키텍처 설명 중심이다. Outbox/Idempotency 흐름을 먼저 보여주는 편이 좋다.
- `settlement-admin-api`: 정산 도메인 설명은 가능하지만 현재 허브에서는 완성도 높은 대표 프로젝트에 집중하기 위해 노출하지 않는다.
- `order-service-iac-cicd`: IaC/CD 역량은 의미 있지만 현재 허브에서는 별도 카드로 노출하지 않고, 필요 시 보조 소재로만 사용한다.

## 시연 순서 추천

1. `warehouse-ops-suite`: 실제 업무 도메인과 제품형 완성도
2. `stock-lock-benchmark`: 동시성 문제를 실험으로 검증한 사례
3. `kotlin-commerce-core`: 이벤트 기반 아키텍처와 신뢰성 패턴
4. `maternity-care-commerce`: 현업 요구사항 분석과 개인정보/감사 로그 설계

## 허브 운영 메모

- 각 프로젝트의 최신 커밋/릴리즈 정보는 `pnpm sync:github`로 갱신한다.
- 각 프로젝트의 공개 설명, 대표 이미지, 문서 링크는 S3 `portfolio-feed/{projectId}/manifest.json`에서 읽는다.
- 상태 갱신은 `pnpm sync:all`을 실행한다.
- 허브 화면은 빌드 시점 더미 데이터가 아니라 S3 `portfolio-feed/index.json`의 프로젝트 목록을 기준으로 표시한다.
- GitHub Release가 있는 프로젝트는 허브 카드에 릴리즈 링크가 자동 노출된다.
- 로컬 시연 포트가 겹칠 경우 Maternity Client는 `5175`로 띄운다.
