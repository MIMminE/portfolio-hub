# Care Commerce Platform Portfolio

## 프로젝트 한 줄 소개

고객 데스크톱 웹, iOS SwiftUI 앱, 관리자 백오피스, Spring Boot API 서버를 분리해 구성한 케어 커머스 운영 시스템입니다.

## 지원 포지션과의 연결

이 프로젝트는 백엔드 개발자 포지션을 기준으로 만들었습니다. 단순 API 구현보다 실제 회사 내부에서 백엔드가 담당하는 운영 흐름을 보여주는 데 집중했습니다.

- 고객 서비스: 상품 탐색, 장바구니, 주문, 상담, 케어 프로필
- 관리자 서비스: 회원 조회, 케어 프로필 확인, 상품 관리, CS 처리, 마케팅 동의 고객 필터링
- 백엔드 핵심: 인증/권한, DB 설계, 동의 이력, 감사 로그, 통계 API, 운영 데이터 처리

## 전체 구조

```txt
desktop-web  -> 고객용 데스크톱 웹
ios-app      -> 고객용 iOS SwiftUI 앱
admin-web    -> 관리자 백오피스 웹
backend      -> Spring Boot API server
```

```txt
/client-api/v1/**   고객 서비스 API
/admin-api/v1/**    관리자 운영 API
```

고객과 관리자는 같은 회원·상품·주문 데이터를 사용하지만, 목적과 권한이 다르기 때문에 API 계층을 분리했습니다. 공통 도메인 로직은 `domain` 패키지에 두고, 고객/관리자 진입점은 `client`, `admin` 패키지로 나누었습니다.

## 화면 구성

### 1. 고객 데스크톱 웹

![고객 데스크톱 웹](assets/portfolio/desktop-web.png)

PC 고객이 상품을 비교하고 장바구니, 주문 현황, 상담 상태를 한 화면에서 확인하는 화면입니다.

백엔드 연결 포인트:

- `GET /client-api/v1/products`
- `POST /client-api/v1/cart`
- `POST /client-api/v1/orders`
- `GET /client-api/v1/orders`
- `GET /client-api/v1/consultations`

설계 의도:

- iOS 앱과 같은 고객 API를 사용하지만, PC 환경에서는 더 많은 정보를 동시에 볼 수 있게 별도 화면으로 분리했습니다.
- 상품 탐색과 장바구니가 같은 화면에서 연결되도록 구성했습니다.

### 2. iOS 고객 앱

![iOS 고객 앱](assets/portfolio/ios-app.png)

iOS 고객 앱은 홈, 프로필, 상품, 장바구니, 상담을 탭으로 분리했습니다. 작은 화면에서 반복 작업을 빠르게 처리하는 데 초점을 맞췄습니다.

백엔드 연결 포인트:

- `GET /client-api/v1/me`
- `GET /client-api/v1/pregnancy-profile/me`
- `PUT /client-api/v1/pregnancy-profile/me`
- `GET /client-api/v1/products`
- `POST /client-api/v1/consultations`

설계 의도:

- 케어 프로필을 일반 회원 정보와 분리했습니다.
- 데스크톱 웹과 iOS 앱이 같은 고객 API를 공유하도록 설계했습니다.

### 3. 관리자 백오피스

![관리자 백오피스](assets/portfolio/admin-web.png)

관리자 화면은 운영팀이 매일 확인해야 하는 회원, 상품, 주문, 상담, 마케팅 동의 고객 정보를 모아 보여줍니다.

백엔드 연결 포인트:

- `GET /admin-api/v1/statistics/dashboard`
- `GET /admin-api/v1/members`
- `GET /admin-api/v1/members/{memberId}`
- `GET /admin-api/v1/products`
- `POST /admin-api/v1/products`
- `PATCH /admin-api/v1/consultations/{consultationId}/status`
- `GET /admin-api/v1/marketing/members`

설계 의도:

- 운영팀, CS팀, 마케팅팀이 같은 백엔드를 통해 각자 필요한 데이터를 확인하는 구조를 만들었습니다.
- 회원 상세와 케어 프로필 조회는 감사 로그를 남기도록 설계했습니다.

### 4. iOS 고객 앱

`ios-app`은 같은 `/client-api/v1` 고객 API를 사용할 수 있는 SwiftUI 클라이언트입니다. 현재는 포트폴리오 확인을 위해 로컬 샘플 데이터와 API 클라이언트 골격을 함께 구성했습니다.

구성 화면:

- 홈 요약
- 상품 목록과 카테고리 필터
- 장바구니와 주문 생성
- 케어 프로필
- 상담 접수와 상담 상태

## 백엔드 패키지 구조

```txt
com.portfolio.maternity
├── client       # 고객 API
├── admin        # 관리자 API
├── domain       # 핵심 도메인 모델
├── global       # 보안, 예외, 공통 설정
└── infra        # 외부 연동 확장 영역
```

주요 도메인:

```txt
member
pregnancy
consent
product
cart
order
consultation
inquiry
audit
adminuser
statistics
```

## 데이터 설계 포인트

### 동의 이력

`ConsentHistory`는 약관, 개인정보, 민감정보, 마케팅 동의를 이력으로 저장합니다.

```txt
TERMS
PRIVACY
SENSITIVE_INFORMATION
MARKETING
```

최신 상태만 덮어쓰는 방식이 아니라, 사용자가 언제 어떤 항목에 동의했는지 추적할 수 있게 했습니다.

### 감사 로그

관리자 업무 중 개인정보 접근 또는 운영 상태 변경이 발생하는 경우 `AuditLog`를 저장합니다.

```txt
VIEW_MEMBER
VIEW_PREGNANCY_PROFILE
UPDATE_CONSULTATION
UPDATE_INQUIRY
EXPORT_MARKETING_TARGETS
```

이 설계는 CS, 운영, 마케팅, 법무 부서가 같은 시스템을 사용한다는 전제를 반영합니다.

### 주문 가격 스냅샷

상품 가격은 변경될 수 있으므로 주문 시점의 가격을 `OrderItem.unitPrice`에 저장합니다.

```txt
Product.price       현재 상품 가격
OrderItem.unitPrice 주문 당시 상품 가격
```

이를 통해 상품 가격 변경 후에도 과거 주문 금액이 변하지 않습니다.

## 기술 스택

```txt
Backend
Java 17, Spring Boot 3, Spring Security, JPA, Flyway, PostgreSQL, H2

Frontend
React, TypeScript, Vite

iOS
Swift, SwiftUI, Xcode project

Infra
Docker, Docker Compose, Nginx, AWS EC2/RDS/S3/CloudFront, GitHub Actions

Test
JUnit 5, Spring Boot Test, MockMvc
```

## 테스트와 CI

백엔드 통합 테스트:

- 사용자 회원가입/로그인
- 케어 프로필 등록/조회
- 동의 이력 조회
- 상품 조회
- 장바구니 담기
- 주문 생성
- 상담/상품 문의 생성
- 관리자 통계 조회
- 회원 상세 조회 감사 로그
- 마케팅 대상 조회 감사 로그

프론트엔드 검증:

- `desktop-web` Vite build
- `admin-web` Vite build
- `ios-app` Swift typecheck

포트폴리오 패키징:

- `node scripts/build-portfolio-package.mjs`
