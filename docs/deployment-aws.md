# AWS 배포 가이드

Portfolio Hub는 정적 사이트이며, 프로젝트 게시물은 S3의 `portfolio-feed` 패키지에서 읽는다. 허브 자체와 feed 패키지는 같은 버킷을 써도 되고, 별도 버킷을 써도 된다.

## 목표 구조

```text
project repos
  -> s3://{PORTFOLIO_FEED_BUCKET}/portfolio-feed/{projectId}/

portfolio-hub repo
  -> config/portfolio-feed-projects.json
  -> portfolio-feed/index.json 생성
  -> pnpm build
  -> s3://{AWS_S3_BUCKET}/
  -> CloudFront invalidation
```

## 필요한 AWS 리소스

| 리소스 | 역할 |
| --- | --- |
| S3 Bucket | 허브 정적 파일 저장 |
| S3 Bucket or Prefix | `portfolio-feed` 패키지 저장 |
| CloudFront Distribution | HTTPS CDN 제공 |
| ACM Certificate | 사용자 도메인 연결 시 TLS 인증서 |
| Route 53 | 사용자 도메인 연결 시 DNS |
| IAM Role/User | GitHub Actions 배포 권한 |

## 1차 배포 범위

- 허브 정적 사이트 배포
- 허브가 관리하는 `portfolio-feed/index.json` 배포
- 각 프로젝트 패키지는 각 프로젝트 CI가 `portfolio-feed/{projectId}/`에 업로드
- 각 프로젝트 백엔드/API는 상시 배포하지 않음

## GitHub Actions Secret

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
PORTFOLIO_FEED_BUCKET
PORTFOLIO_FEED_BASE_URL
VITE_PORTFOLIO_FEED_URL
AWS_CLOUDFRONT_DISTRIBUTION_ID
```

예시:

```text
AWS_S3_BUCKET=portfolio-hub-site
PORTFOLIO_FEED_BUCKET=portfolio-hub-site
PORTFOLIO_FEED_BASE_URL=https://portfolio.example.com/portfolio-feed
VITE_PORTFOLIO_FEED_URL=https://portfolio.example.com/portfolio-feed/index.json
```

같은 CloudFront 도메인 아래에 feed를 둘 경우 `VITE_PORTFOLIO_FEED_URL=/portfolio-feed/index.json`도 가능하다.

## Feed Index 생성

허브 레포는 전체 프로젝트 목록을 `config/portfolio-feed-projects.json`에 둔다.

```bash
pnpm feed:index
```

절대 URL 기반 index를 생성하려면:

```bash
PORTFOLIO_FEED_BASE_URL=https://portfolio.example.com/portfolio-feed pnpm feed:index
```

생성 결과:

```text
public/portfolio-feed/index.json
```

## 다음 단계

1. AWS S3 버킷 생성
2. CloudFront 배포 생성
3. GitHub Actions Secrets 설정
4. 각 프로젝트 레포에 패키지 업로드 workflow 추가
5. 허브 레포에서 deploy workflow 실행
6. 필요 시 Route 53 도메인 연결
