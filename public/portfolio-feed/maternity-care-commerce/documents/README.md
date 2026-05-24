# Care Commerce Platform

케어 커머스 도메인의 고객 데스크톱 웹, iOS 앱, 관리자 백오피스, Spring Boot API 서버를 분리해 구성한 포트폴리오 프로젝트입니다.

특정 회사나 실제 서비스명을 사용하지 않고, 사용자 주문/상담과 운영자 CS/마케팅/감사 흐름을 일반적인 커머스 운영 도메인으로 재설계했습니다.

## Portfolio Positioning

이 레포는 취업용 포트폴리오에서 **고객 경험과 운영 백오피스를 함께 고려한 백엔드 경계 설계 역량**을 보여주기 위한 프로젝트입니다.

| 평가 포인트 | 이 프로젝트에서 보여주는 내용 |
| --- | --- |
| 실행 단위 분리 | 고객 웹, iOS 앱, 관리자 웹, Spring Boot API를 역할별로 구성 |
| API 경계 설계 | `/client-api/v1/**`, `/admin-api/v1/**`로 권한과 응답 모델 분리 |
| 민감정보 고려 | 케어 프로필, 동의 이력, 관리자 조회 감사 로그 모델링 |
| 운영 데이터 무결성 | 주문 당시 가격 스냅샷과 상담 상태 변경 이력 관리 |
| 포트폴리오 설득력 | 고객 화면과 관리자 화면으로 백엔드 요구사항의 맥락을 시각화 |

## 프로젝트 개요

이 프로젝트는 하나의 백엔드 API를 기준으로 고객 화면과 관리자 화면을 제공합니다.

- `desktop-web`: PC 고객이 상품, 장바구니, 주문, 상담 상태를 확인하는 일반 웹
- `ios-app`: 같은 고객 API를 사용하는 네이티브 iOS SwiftUI 앱
- `admin-web`: 운영자가 회원, 상품, 주문, 상담, 마케팅 동의 고객을 관리하는 백오피스

백엔드는 사용자 API와 관리자 API를 분리하고, 케어 프로필, 동의 이력, 주문 가격 스냅샷, 감사 로그를 별도 도메인으로 관리합니다.

## 실행 단위

```txt
backend       Spring Boot API server
desktop-web   고객용 데스크톱 웹
ios-app       고객용 iOS SwiftUI 앱
admin-web     관리자 백오피스 웹
```

## 기술 스택

```txt
Backend
Java 17, Spring Boot 3, Spring Security, JPA, Flyway, PostgreSQL, H2 Test DB

Frontend
React, TypeScript, Vite

iOS
Swift, SwiftUI, Xcode project

Infra / DevOps
Docker, Docker Compose, Nginx, AWS EC2/RDS/S3/CloudFront/Route53/ACM, GitHub Actions

Test
JUnit 5, Spring Boot Test, MockMvc
```

## 주요 기능

```txt
Customer
- 데스크톱 웹 상품 탐색, 장바구니, 주문 현황, 상담 상태 확인
- iOS SwiftUI 앱 홈, 상품, 장바구니, 프로필, 상담 탭 구성

Admin
- 운영 대시보드 통계
- 회원 목록/상세 조회
- 케어 프로필 조회
- 상품 등록/수정/판매 상태 관리
- 상담/상품 문의 처리
- 마케팅 동의 고객 필터링

Backend
- 사용자/관리자 인증과 권한 분리
- 개인정보 동의 이력 저장
- 민감 정보 조회 감사 로그
- 장바구니 기반 주문 생성
- 주문 시점 상품 가격 스냅샷 저장
```

## API 구분

```txt
/client-api/v1/**   고객 서비스 API
/admin-api/v1/**    관리자 백오피스 API
```

## 로컬 실행

Backend 의존성 실행:

```bash
cd backend
docker compose up -d
```

Backend 테스트:

```bash
cd backend
./gradlew test
```

Backend 실행:

```bash
cd backend
./gradlew bootRun
```

Frontend 실행:

```bash
cd desktop-web
npm install
npm run dev

cd admin-web
npm install
npm run dev
```

로컬 포트:

```txt
Backend:      http://localhost:8080
Desktop Web:  http://localhost:5176
Admin Web:    http://localhost:5174
iOS App:      ios-app/CareCommerceiOS.xcodeproj
iOS Preview:  ios-app/preview
```

## 샘플 계정

로컬 프로필에서는 Flyway가 샘플 데이터를 함께 적재합니다.

```txt
관리자
email: admin@example.com
password: password123!

사용자
email: mother@example.com
password: password123!
```

## 추천 시연 순서

1. `backend/docker-compose.yml`로 PostgreSQL 실행
2. `backend`에서 `./gradlew bootRun` 실행
3. `desktop-web`에서 고객용 데스크톱 화면 확인
4. 상품을 장바구니에 담고 주문 생성 흐름 확인
5. `ios-app`을 Xcode에서 열어 iPhone Simulator 고객 앱 확인
6. Xcode가 없는 환경에서는 `ios-app/preview`로 iOS 화면 구성 확인
7. `admin-web`에서 관리자 로그인
8. 대시보드 통계 확인
9. 회원 상세와 케어 프로필 확인
10. 상품 관리, CS 처리, 마케팅 동의 고객 조회 확인

## 문서

- [포트폴리오 블로그 게시물](blog/article.md)
- [이력서용 포트폴리오](docs/resume-portfolio.md)
- [아키텍처](docs/architecture.md)
- [요구사항](docs/requirements.md)
- [ERD](docs/erd.md)
- [API 요약](docs/api-spec.md)
- [보안 설계](docs/security.md)
- [배포 계획](docs/deployment.md)
- [CI/CD](docs/ci-cd.md)
- [포트폴리오 요약](docs/portfolio-summary.md)

## 포트폴리오 포인트

이 프로젝트는 백엔드 포지션 지원을 목표로 하지만, API만 나열하지 않고 실제 화면에서 API가 어떻게 쓰이는지 보여주기 위해 고객 데스크톱 웹, iOS 고객 앱, 관리자 웹을 함께 구성했습니다.

특히 고객 정보와 케어 프로필처럼 민감하게 다룰 수 있는 데이터를 동의 이력과 감사 로그로 관리하고, CS/운영/마케팅 부서가 같은 백엔드를 서로 다른 목적과 권한으로 사용하는 구조를 표현했습니다.

## 포트폴리오 허브 패키지

포트폴리오 허브에 게시될 본문과 이미지는 `blog/` 아래에 둡니다.

```txt
blog/article.md
blog/images/
.portfolio/manifest.json
```

패키징 명령:

```bash
node scripts/build-portfolio-package.mjs
```

이 명령은 `dist/portfolio-package` 아래에 S3 업로드용 `manifest.json`, `article.md`, `images/`를 생성합니다.
