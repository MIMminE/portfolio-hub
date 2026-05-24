# Architecture

## 실행 단위

```txt
desktop-web -> 고객용 데스크톱 웹
ios-app     -> 고객용 iOS SwiftUI 앱
admin-web   -> 관리자 백오피스 웹
backend     -> Spring Boot API server
```

## API 분리

```txt
/client-api/v1/**
/admin-api/v1/**
```

사용자와 관리자는 같은 도메인을 사용하지만 권한, 응답 데이터, 처리 흐름이 다르기 때문에 API 계층을 분리합니다.

## 백엔드 패키지

```txt
com.portfolio.maternity
├── client       # 고객 서비스 API
├── admin        # 관리자 백오피스 API
├── domain       # 핵심 도메인 모델
├── infra        # 외부 연동, 파일, 푸시, 결제 어댑터
└── global       # 보안, 예외, 공통 응답, 설정
```

## 1차 도메인 모델

```txt
domain
├── member
├── pregnancy
├── consent
├── content
├── product
├── cart
├── order
├── payment
├── delivery
├── review
├── inquiry
├── consultation
├── coupon
├── notification
├── adminuser
└── audit
```

커머스의 기본 흐름인 상품-장바구니-주문-결제-배송에, 케어 서비스에 필요한 프로필, 동의 이력, 상담, 개인정보 접근 로그를 추가합니다.

## 감사 로그 흐름

```txt
Admin Web
  -> GET /admin-api/v1/members/{memberId}
  -> AdminMemberService
  -> AuditLog 저장
  -> 회원 상세 + 케어 프로필 응답
```

민감한 케어 프로필을 관리자 화면에서 조회하는 경우, 조회 사유와 관리자 식별자를 함께 저장합니다.

## 커머스 주문 흐름

```txt
Admin Web
  -> 상품 등록/판매 상태 변경

Desktop Web / iOS App
  -> 판매 중 상품 조회
  -> 장바구니 담기
  -> 주문 생성
  -> 주문 항목 가격 스냅샷 저장
  -> 상품 재고 차감
  -> 장바구니 비우기
```

주문 생성 시점의 상품 가격을 `OrderItem.unitPrice`에 저장해서 이후 상품 가격이 변경되어도 주문 내역의 금액이 변하지 않게 합니다.

## CS/운영 처리 흐름

```txt
Desktop Web / iOS App
  -> 상담 신청 / 상품 문의 등록

Admin Web
  -> 상담/문의 목록 조회
  -> 상태 변경
  -> 내부 메모 또는 처리 상태 저장
  -> AuditLog 저장
```

상담과 문의는 CS/운영팀이 처리하는 반복 업무를 가정해 설계했습니다. 상태 변경 시 관리자와 대상 회원, 변경 사유를 감사 로그로 남깁니다.

## 운영/마케팅 데이터 흐름

```txt
Admin Web
  -> 운영 대시보드 통계 조회
  -> 총 회원 수 / 마케팅 동의 회원 수 / 주문 수 / 매출 / 대기 상담 / 대기 문의 표시

Marketing
  -> 마케팅 동의 고객 목록 조회
  -> AuditLog(EXPORT_MARKETING_TARGETS) 저장
```

마케팅 대상 조회는 단순 검색이 아니라 개인정보 활용 가능성이 있는 업무로 보고 감사 로그를 남깁니다.
