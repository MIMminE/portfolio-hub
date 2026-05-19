# Portfolio Hub

서로 다른 Git 프로젝트의 README, 문서, 릴리즈, 화면 캡처를 한 곳에서 탐색할 수 있게 만든 공개 포트폴리오 허브입니다.

이 레포는 각 프로젝트의 소스코드를 소유하지 않고, GitHub 공개 레포와 릴리즈를 큐레이션하는 정적 사이트입니다.

## Projects

- Warehouse Ops Suite
- Settlement Admin API
- Kotlin Commerce Core
- Stock Lock Benchmark
- Order Service IaC/CD
- Maternity Care Commerce

## Local Run

```bash
pnpm install
pnpm sync:github
pnpm dev
```

## Build

```bash
pnpm build
```

## Sync

`src/data/projects.ts`는 사람이 작성하는 소개/강점/문서 링크를 관리합니다.
`src/data/generated-status.json`은 GitHub API로 동기화되는 최신 커밋, 릴리즈, 업데이트 정보를 담습니다.

```bash
pnpm sync:github
```

## Portfolio Review

프로젝트별 로컬 UI, 문서 상태, 이력서 포트폴리오 관점의 시연 순서는
[docs/project-ui-review.md](docs/project-ui-review.md)에 정리했습니다.

## Deployment Target

정적 빌드 산출물인 `dist/`를 AWS S3 + CloudFront로 배포하는 것을 목표로 합니다.

자세한 초안은 [docs/deployment-aws.md](docs/deployment-aws.md)를 참고하세요.
