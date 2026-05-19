# AWS 정적 배포 초안

Portfolio Hub는 정적 사이트이므로 첫 배포 대상은 S3 + CloudFront가 적합합니다.

## 목표 구조

```text
GitHub Actions
  -> pnpm build
  -> dist/
  -> S3 sync
  -> CloudFront invalidation
```

## 필요한 AWS 리소스

| 리소스 | 역할 |
| --- | --- |
| S3 Bucket | 정적 파일 저장 |
| CloudFront Distribution | HTTPS CDN 제공 |
| ACM Certificate | 사용자 도메인 연결 시 TLS 인증서 |
| Route 53 | 사용자 도메인 연결 시 DNS |
| IAM Role/User | GitHub Actions 배포 권한 |

## 1차 배포 범위

- 허브 정적 사이트만 배포
- 각 프로젝트 백엔드/API는 상시 배포하지 않음
- 각 프로젝트는 GitHub, README, 문서, 릴리즈 링크로 연결

## GitHub Actions Secret

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
AWS_CLOUDFRONT_DISTRIBUTION_ID
```

## 다음 단계

1. AWS S3 버킷 생성
2. CloudFront 배포 생성
3. GitHub Actions deploy workflow 추가
4. `main` push 시 자동 배포
5. 필요 시 Route 53 도메인 연결
