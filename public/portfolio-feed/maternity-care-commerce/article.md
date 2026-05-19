# Maternity Care Commerce Portfolio

## 프로젝트 한 줄 소개

임산부/산모 사용자 서비스, 산모 전용 커머스, CS·운영·마케팅 관리자 백오피스를 하나의 백엔드 중심 시스템으로 설계한 포트폴리오입니다.

## 지원 포지션과의 연결

이 프로젝트는 백엔드 개발자 포지션을 기준으로 만들었습니다. 단순 API 구현보다 실제 회사 내부에서 백엔드가 담당하는 운영 흐름을 보여주는 데 집중했습니다.

- 사용자 서비스: 산모 프로필, 상품 조회, 장바구니, 주문, 상담 신청
- 관리자 서비스: 회원 조회, 산모 프로필 확인, 상품 관리, CS 처리, 마케팅 동의 고객 필터링
- 백엔드 핵심: 인증/권한, DB 설계, 동의 이력, 감사 로그, 통계 API, 운영 데이터 처리

## 전체 구조

```txt
client-web  -> 사용자용 모바일 웹/PWA
admin-web   -> 관리자 백오피스 웹
backend     -> Spring Boot API server
```

```txt
/client-api/v1/**   사용자 서비스 API
/admin-api/v1/**    관리자 운영 API
```

사용자와 관리자는 같은 회원·상품·주문 데이터를 사용하지만, 목적과 권한이 다르기 때문에 API 계층을 분리했습니다. 공통 도메인 로직은 `domain` 패키지에 두고, 사용자/관리자 진입점만 `client`, `admin` 패키지로 나누었습니다.

## 사용자 화면

### 1. 사용자 홈

![사용자 홈](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/client-home.png)

사용자 홈은 산모가 자신의 상태를 빠르게 확인하는 화면입니다. 임신 주차, 최근 주문 상태처럼 사용자가 반복적으로 확인할 정보를 우선 배치했습니다.

백엔드 연결 포인트:

- `GET /client-api/v1/me`
- `GET /client-api/v1/pregnancy-profile/me`
- `GET /client-api/v1/orders`

설계 의도:

- 산모 프로필을 일반 회원 정보와 분리했습니다.
- 임신 주차, 출산 예정일, 출산 여부 같은 도메인 데이터가 콘텐츠/상품 추천으로 확장될 수 있게 설계했습니다.

### 2. 상품 조회

![사용자 상품 조회](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/client-products.png)

사용자는 판매 중인 상품만 조회할 수 있습니다. 관리자에서 상품 상태를 `ON_SALE`, `DRAFT`, `SOLD_OUT`, `HIDDEN`으로 관리하고, 사용자 API는 `ON_SALE` 상품만 노출합니다.

백엔드 연결 포인트:

- `GET /client-api/v1/products`
- `GET /client-api/v1/products/{productId}`
- `POST /client-api/v1/cart`

설계 의도:

- 일반 커머스의 상품 조회/장바구니 흐름을 구현했습니다.
- 주문 생성 시 상품 가격을 `OrderItem.unitPrice`에 저장해, 이후 상품 가격이 바뀌어도 주문 내역의 금액이 변하지 않게 했습니다.

### 3. 상담 신청

![사용자 상담 신청](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/client-consultation.png)

상담 신청은 단순 게시판이 아니라 CS/운영팀이 처리할 업무 티켓으로 이어집니다. 사용자는 상담을 등록하고, 관리자는 상태와 내부 메모를 관리합니다.

백엔드 연결 포인트:

- `POST /client-api/v1/consultations`
- `GET /client-api/v1/consultations`
- `PATCH /admin-api/v1/consultations/{consultationId}/status`

설계 의도:

- 고객 접점 업무를 운영 데이터로 관리할 수 있게 했습니다.
- 관리자 상태 변경 시 `AuditLog`를 남겨 누가 어떤 사유로 처리했는지 추적할 수 있습니다.

## 관리자 화면

### 1. 운영 대시보드

![관리자 대시보드](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/admin-dashboard.png)

관리자 대시보드는 운영팀이 매일 확인해야 하는 지표를 모아 보여줍니다.

표시 지표:

- 총 회원 수
- 마케팅 동의 회원 수
- 총 주문 수
- 누적 주문금액
- 대기 상담 수
- 대기 상품 문의 수

백엔드 연결 포인트:

- `GET /admin-api/v1/statistics/dashboard`

설계 의도:

- SQL/JPA 집계 쿼리를 활용해 운영 지표를 제공합니다.
- 운영팀, CS팀, 마케팅팀이 같은 백엔드를 통해 각자 필요한 데이터를 확인하는 구조를 만들었습니다.

### 2. 회원 상세와 산모 프로필

![관리자 회원 상세](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/admin-members.png)

회원 상세 화면은 CS/운영 담당자가 고객 응대 시 확인하는 화면입니다. 회원 정보와 산모 프로필을 함께 보여주지만, 이 정보는 민감할 수 있으므로 조회 시 감사 로그를 저장합니다.

백엔드 연결 포인트:

- `GET /admin-api/v1/members`
- `GET /admin-api/v1/members/{memberId}`

감사 로그:

- `VIEW_MEMBER`
- `VIEW_PREGNANCY_PROFILE`

설계 의도:

- 산모 프로필은 임신/출산 관련 데이터이므로 관리자 조회를 추적 가능하게 만들었습니다.
- `X-Audit-Reason` 헤더로 조회 사유를 받아 감사 로그에 남깁니다.

### 3. 상품 관리

![관리자 상품 관리](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/admin-products.png)

관리자는 상품을 등록하고 판매 상태를 관리할 수 있습니다. 사용자 화면에는 판매 중인 상품만 노출됩니다.

백엔드 연결 포인트:

- `GET /admin-api/v1/products`
- `POST /admin-api/v1/products`
- `PATCH /admin-api/v1/products/{productId}`

설계 의도:

- 관리자 상품 상태와 사용자 노출 정책을 분리했습니다.
- 재고 수량은 주문 생성 시 차감되며, 재고가 0이 되면 `SOLD_OUT`으로 전환됩니다.

### 4. 마케팅 동의 고객 필터

![마케팅 동의 고객](https://raw.githubusercontent.com/MIMminE/maternity-care-commerce/main/docs/assets/portfolio/admin-marketing.png)

마케팅팀은 마케팅 수신 동의 고객만 조회할 수 있습니다. 이 조회는 개인정보 활용 가능성이 있는 업무이므로 감사 로그를 남깁니다.

백엔드 연결 포인트:

- `GET /admin-api/v1/marketing/members`

감사 로그:

- `EXPORT_MARKETING_TARGETS`

설계 의도:

- 마케팅 동의는 회원 테이블의 단일 컬럼이 아니라 `ConsentHistory`로 이력 관리합니다.
- 단순 고객 목록 조회가 아니라 “목적 있는 개인정보 활용”으로 보고 감사 로그를 저장합니다.

## 백엔드 패키지 구조

```txt
com.portfolio.maternity
├── client       # 사용자 API
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
Product.price      현재 상품 가격
OrderItem.unitPrice 주문 당시 상품 가격
```

이를 통해 상품 가격 변경 후에도 과거 주문 금액이 변하지 않습니다.

## 기술 스택

```txt
Backend
Java 17, Spring Boot 3, Spring Security, JPA, Flyway, PostgreSQL, H2

Frontend
React, TypeScript, Vite

Infra
Docker, Docker Compose, Nginx, AWS EC2/RDS/S3/CloudFront, GitHub Actions

Test
JUnit 5, Spring Boot Test, MockMvc
```

## 테스트와 CI

백엔드 통합 테스트:

- 사용자 회원가입/로그인
- 산모 프로필 등록/조회
- 동의 이력 조회
- 상품 조회
- 장바구니 담기
- 주문 생성
- 상담/상품 문의 생성
- 관리자 통계 조회
- 마케팅 동의 고객 조회

GitHub Actions:

```txt
backend-ci
client-web-ci
admin-web-ci
```

최신 CI는 모두 성공 상태입니다.

## 배포 설계

```txt
client-web  -> S3 + CloudFront
admin-web   -> S3 + CloudFront
backend     -> EC2 + Docker + Nginx
database    -> RDS PostgreSQL
domain/ssl  -> Route53 + ACM
```

1차 포트폴리오에서는 AWS 인프라를 수동 구성하고, GitHub Actions로 배포를 자동화하는 전략을 문서화했습니다. Terraform은 후속 개선 과제로 분리했습니다.

## 시연 계정

로컬 프로필에서는 데모 데이터가 자동 적재됩니다.

```txt
관리자
admin@example.com / password123!

사용자
mother@example.com / password123!
```

## 구현을 통해 보여주고 싶은 역량

- 도메인을 이해하고 DB 모델로 정리하는 능력
- 사용자 API와 관리자 API를 분리하는 설계 감각
- 현업 부서의 요구사항을 백엔드 기능으로 바꾸는 능력
- 개인정보/민감정보 접근에 대한 감사 로그 설계
- 커머스 주문/재고/가격 스냅샷 처리
- 테스트와 CI를 포함한 실무형 개발 흐름
- 화면을 통해 API가 실제 서비스 흐름에서 어떻게 쓰이는지 검증하는 태도

