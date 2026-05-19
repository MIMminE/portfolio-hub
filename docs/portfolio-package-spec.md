# Portfolio Package Spec

포트폴리오 허브는 각 프로젝트 레포를 직접 해석하지 않는다. 각 프로젝트의 CI/CD가 정해진 구조의 정적 패키지를 만들어 S3 같은 오브젝트 스토리지에 업로드하고, 허브는 그 패키지를 읽어 카드와 게시물을 렌더링한다.

## Storage Layout

```text
portfolio-feed/
├─ index.json
├─ warehouse-ops-suite/
│  ├─ manifest.json
│  ├─ article.md
│  └─ images/
│     └─ cover.png
└─ stock-lock-benchmark/
   ├─ manifest.json
   ├─ article.md
   └─ images/
      └─ benchmark-summary.svg
```

## index.json

허브가 처음 읽는 진입점이다.

```json
{
  "version": "1.0",
  "generatedAt": "2026-05-19T00:00:00.000Z",
  "projects": [
    {
      "id": "warehouse-ops-suite",
      "manifestUrl": "./warehouse-ops-suite/manifest.json"
    }
  ]
}
```

## manifest.json

프로젝트 카드와 상세 페이지의 기본 메타데이터다.

```json
{
  "id": "warehouse-ops-suite",
  "title": "Warehouse Ops Suite",
  "subtitle": "3PL 물류센터 WMS 운영 시스템",
  "category": "실무 도메인형",
  "status": "Portfolio Ready",
  "summary": "입고, 적치, 재고, 출고 지시, 피킹 웨이브를 연결한 WMS 프로젝트입니다.",
  "stacks": ["Kotlin", "Spring Boot", "React", "PostgreSQL"],
  "repoUrl": "https://github.com/MIMminE/warehouse-ops-suite",
  "article": "./article.md",
  "coverImage": "./images/cover.png",
  "coverAlt": "Warehouse Ops Suite 운영 화면",
  "updatedAt": "2026-05-19T00:00:00.000Z",
  "links": [
    {
      "label": "제품 매뉴얼",
      "url": "https://github.com/MIMminE/warehouse-ops-suite/blob/main/docs/product-manual.md",
      "type": "manual"
    }
  ]
}
```

## article.md

상세 게시물 본문이다. Markdown과 GFM table을 지원한다. 이미지와 내부 링크는 manifest 위치 기준 상대 경로로 작성할 수 있다.

```markdown
# Warehouse Ops Suite

![운영 화면](./images/dashboard.png)

## 핵심 흐름

| 영역 | 설명 |
| --- | --- |
| 입고 | PDA 검수 후 로케이션 적치 |
```

## CI/CD Contract

각 프로젝트 레포는 배포 시점에 아래 작업을 수행한다.

1. 프로젝트 내부 README/docs/이미지를 기반으로 `portfolio-package` 디렉터리를 만든다.
2. `manifest.json`, `article.md`, `images/`를 패키지 규격에 맞춰 생성한다.
3. S3의 `portfolio-feed/{projectId}/` 경로에 업로드한다.

각 프로젝트는 자기 패키지 디렉터리만 업로드한다. 전체 목록인 `portfolio-feed/index.json`은 허브 레포가 `config/portfolio-feed-projects.json`을 기준으로 생성한다.

## Hub Contract

허브는 `VITE_PORTFOLIO_FEED_URL` 또는 기본값 `/portfolio-feed/index.json`을 읽는다. 이후 각 manifest와 article을 fetch해서 카드와 상세 게시물을 만든다.

로컬 검증용 mock bucket은 `public/portfolio-feed`에 둔다.

## Option 1: Hub-Owned Index

이 프로젝트는 허브가 전체 index를 관리하는 방식을 사용한다.

```text
project repo CI
  -> s3://bucket/portfolio-feed/{projectId}/manifest.json
  -> s3://bucket/portfolio-feed/{projectId}/article.md
  -> s3://bucket/portfolio-feed/{projectId}/images/*

portfolio-hub CI
  -> config/portfolio-feed-projects.json 읽기
  -> s3://bucket/portfolio-feed/index.json 생성/업로드
  -> hub static site build/deploy
```

허브 레포의 `config/portfolio-feed-projects.json` 예시는 아래와 같다.

```json
{
  "version": "1.0",
  "projects": [
    {
      "id": "warehouse-ops-suite",
      "packagePath": "warehouse-ops-suite/manifest.json"
    }
  ]
}
```

`portfolio-feed/index.json` 생성 명령:

```bash
pnpm feed:index
```

절대 URL 기반 index가 필요하면 `PORTFOLIO_FEED_BASE_URL`을 지정한다.

```bash
PORTFOLIO_FEED_BASE_URL=https://cdn.example.com/portfolio-feed pnpm feed:index
```
