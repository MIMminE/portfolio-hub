# Portfolio Hub

Portfolio Hub는 여러 프로젝트 레포의 소스코드를 직접 분석하지 않고, S3에 업로드된 포트폴리오 게시물 패키지를 읽어 블로그형 포스터로 렌더링하는 정적 사이트입니다.

각 프로젝트는 독립 레포로 유지합니다. 블로그에 게시하고 싶은 프로젝트만 GitHub Actions의 수동 게시 워크플로우를 실행해 S3의 `portfolio-feed/{projectId}/` 경로에 게시물 패키지를 올립니다. 허브는 자신이 바라보는 `portfolio-feed/index.json`을 기준으로 어떤 게시물을 렌더링할지 결정합니다.

## Architecture

```text
project repo
  -> blog/article.md
  -> blog/images/*
  -> .portfolio/manifest.json
  -> GitHub Actions publish workflow
  -> s3://{PORTFOLIO_FEED_BUCKET}/portfolio-feed/{projectId}/

portfolio-hub repo
  -> config/portfolio-feed-projects.json
  -> portfolio-feed/index.json 생성
  -> S3 + CloudFront 정적 사이트 배포
  -> index.json과 각 package manifest를 읽어 게시물 렌더링
```

## Feed Contract

허브가 읽는 S3 구조는 아래 규격을 따른다.

```text
portfolio-feed/
├─ index.json
├─ maternity-care-commerce/
│  ├─ manifest.json
│  ├─ article.md
│  └─ images/
│     └─ cover.png
└─ warehouse-ops-suite/
   ├─ manifest.json
   ├─ article.md
   └─ images/
      └─ cover.png
```

허브 로딩 순서:

```text
1. VITE_PORTFOLIO_FEED_URL 또는 /portfolio-feed/index.json 조회
2. index.json.projects[*].manifestUrl 조회
3. manifest.article이 가리키는 Markdown 본문 조회
4. manifest metadata, article.md, images, release link로 화면 렌더링
```

`index.json` 예시:

```json
{
  "version": "1.0",
  "generatedAt": "2026-05-20T00:00:00.000Z",
  "projects": [
    {
      "id": "maternity-care-commerce",
      "manifestUrl": "./maternity-care-commerce/manifest.json"
    }
  ]
}
```

`manifest.json` 예시:

```json
{
  "id": "maternity-care-commerce",
  "title": "Care Commerce Platform",
  "subtitle": "고객 웹, iOS 앱, 관리자 백오피스를 분리한 케어 커머스 운영 시스템",
  "category": "실무 도메인형",
  "status": "Portfolio Ready",
  "summary": "모성 케어 커머스 도메인의 API, 관리자 운영, 고객 경험을 함께 구성한 포트폴리오입니다.",
  "stacks": ["Java", "Spring Boot", "React", "TypeScript", "SwiftUI"],
  "repoUrl": "https://github.com/MIMminE/maternity-care-commerce",
  "article": "./article.md",
  "coverImage": "./images/cover.png",
  "coverAlt": "Care Commerce Platform 관리자 화면",
  "updatedAt": "2026-05-20T00:00:00.000Z"
}
```

자세한 필드 정의, 상대 경로 규칙, 이미지/릴리즈 규칙은 [docs/portfolio-package-spec.md](docs/portfolio-package-spec.md)에 정리되어 있습니다.

## Publishing Model

게시 책임은 두 레포로 나뉩니다.

| Owner | Responsibility |
| --- | --- |
| Project repo | `blog/article.md`, `blog/images/*`, `.portfolio/manifest.json` 관리 |
| Project repo GitHub Actions | 수동 실행 시 게시물 패키지를 빌드하고 S3 `portfolio-feed/{projectId}/`에 업로드 |
| Portfolio Hub repo | `config/portfolio-feed-projects.json`으로 노출할 프로젝트 목록과 순서 관리 |
| Portfolio Hub GitHub Actions | `portfolio-feed/index.json` 생성, 허브 정적 빌드, S3/CloudFront 배포 |

각 프로젝트 레포는 자기 패키지만 업로드합니다. `portfolio-feed/index.json`은 허브 레포가 소유하며, 어떤 프로젝트가 블로그에 노출될지는 허브 설정이 결정합니다.

프로젝트별 게시 워크플로우 가이드는 [docs/project-package-ci.md](docs/project-package-ci.md)를 참고합니다.

## Selected Posts

현재 허브에 노출하는 게시물은 최신 생성 레포 순서 기준으로 정리합니다.

1. Care Commerce Platform
2. Warehouse Ops Suite
3. Stock Lock Benchmark
4. Kotlin Commerce Core

정산 백오피스와 AWS 배포 CI/CD 프로젝트는 레포는 유지하지만, 현재 허브 게시물 목록에서는 제외합니다.

## Local Run

```bash
pnpm install
pnpm dev
```

기본 feed는 `/portfolio-feed/index.json`을 읽습니다. 운영에서는 CloudFront가 이 경로를 S3 artifacts bucket으로 라우팅합니다.

## Feed Build

허브가 소유한 노출 목록으로 index를 생성합니다.

```bash
pnpm feed:index
```

절대 URL 기반 index가 필요하면 `PORTFOLIO_FEED_BASE_URL`을 지정합니다.

```bash
PORTFOLIO_FEED_BASE_URL=https://portfolio.example.com/portfolio-feed pnpm feed:index
```

GitHub 레포 상태를 동기화하려면 아래 명령을 사용합니다.

```bash
pnpm sync:all
```

## Build

```bash
pnpm build
```

운영 배포에서는 `VITE_PORTFOLIO_FEED_URL`로 허브가 읽을 feed index URL을 지정할 수 있습니다.

```bash
VITE_PORTFOLIO_FEED_URL=https://portfolio.example.com/portfolio-feed/index.json pnpm build
```

## AWS Deployment

허브는 정적 빌드 산출물 `dist/`를 S3 + CloudFront로 배포하는 구조를 목표로 합니다.

필수 Secrets:

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

배포 초안과 AWS 구성은 [docs/deployment-aws.md](docs/deployment-aws.md)에 정리되어 있습니다.

## Documentation

- [Portfolio package upload spec](docs/portfolio-package-spec.md)
- [Project package CI guide](docs/project-package-ci.md)
- [AWS deployment guide](docs/deployment-aws.md)
- [Project UI review](docs/project-ui-review.md)
