# Project Package CI Guide

각 프로젝트 레포는 포트폴리오 허브를 수정하지 않고 자기 게시물 패키지만 S3에 업로드한다. 허브는 별도 설정 파일로 전체 목록을 만들고, 각 프로젝트 패키지를 읽어 블로그 카드와 상세 게시물을 렌더링한다.

## Recommended Repository Layout

```text
project-repo/
├─ .portfolio/
│  └─ manifest.json
├─ docs/
│  ├─ resume-portfolio.md
│  └─ assets/
│     └─ portfolio/
├─ releases/
│  └─ warehouse-ops-suite-1.0.0.zip
└─ .github/
   └─ workflows/
      └─ publish-portfolio-package.yml
```

## .portfolio/manifest.json

프로젝트 안에서는 기존 문서 경로를 그대로 참조한다.

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
  "article": "docs/resume-portfolio.md",
  "coverImage": "docs/assets/portfolio/01-dashboard.png",
  "coverAlt": "운영 현황 대시보드",
  "links": [
    {
      "label": "v1.0.0 demo package",
      "url": "releases/warehouse-ops-suite-1.0.0.zip",
      "type": "release"
    }
  ]
}
```

## S3 Package Output

CI는 위 manifest를 S3용 패키지로 변환해 아래 위치에 업로드한다.

```text
s3://{PORTFOLIO_FEED_BUCKET}/portfolio-feed/{projectId}/
├─ manifest.json
├─ article.md
├─ images/
└─ releases/
```

업로드 후 manifest의 `article`, `coverImage`, release 링크는 패키지 기준 상대 경로가 된다.

```json
{
  "article": "./article.md",
  "coverImage": "./images/cover.png",
  "links": [
    {
      "label": "v1.0.0 demo package",
      "url": "./releases/warehouse-ops-suite-1.0.0.zip",
      "type": "release"
    }
  ]
}
```

## GitHub Actions Example

```yaml
name: Publish Portfolio Package

on:
  push:
    branches: [main, master]
    paths:
      - ".portfolio/**"
      - "docs/**"
      - "README.md"
      - ".github/workflows/publish-portfolio-package.yml"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Build portfolio package
        run: |
          node <<'NODE'
          const fs = require("node:fs");
          const path = require("node:path");

          const manifest = JSON.parse(fs.readFileSync(".portfolio/manifest.json", "utf8"));
          const outDir = "dist/portfolio-package";
          const imagesDir = path.join(outDir, "images");
          const releasesDir = path.join(outDir, "releases");

          fs.rmSync(outDir, { recursive: true, force: true });
          fs.mkdirSync(imagesDir, { recursive: true });
          fs.mkdirSync(releasesDir, { recursive: true });

          fs.copyFileSync(manifest.article, path.join(outDir, "article.md"));

          const packageManifest = {
            ...manifest,
            article: "./article.md",
            updatedAt: new Date().toISOString(),
            links: Array.isArray(manifest.links) ? [...manifest.links] : []
          };

          if (manifest.coverImage) {
            const ext = path.extname(manifest.coverImage) || ".png";
            const coverName = `cover${ext}`;
            fs.copyFileSync(manifest.coverImage, path.join(imagesDir, coverName));
            packageManifest.coverImage = `./images/${coverName}`;
          }

          packageManifest.links = packageManifest.links.map((link) => {
            if (link.type !== "release" || /^https?:\/\//.test(link.url)) {
              return link;
            }

            const releaseName = path.basename(link.url);
            fs.copyFileSync(link.url, path.join(releasesDir, releaseName));

            return {
              ...link,
              url: `./releases/${releaseName}`
            };
          });

          fs.writeFileSync(
            path.join(outDir, "manifest.json"),
            `${JSON.stringify(packageManifest, null, 2)}\n`
          );
          NODE

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload portfolio package
        run: |
          PROJECT_ID=$(node -e "console.log(require('./.portfolio/manifest.json').id)")
          aws s3 sync dist/portfolio-package \
            "s3://${{ secrets.PORTFOLIO_FEED_BUCKET }}/portfolio-feed/${PROJECT_ID}/" \
            --delete
```

## Required Secrets

각 프로젝트 레포에 아래 Secrets를 설정한다.

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
PORTFOLIO_FEED_BUCKET
```

허브 레포만 `portfolio-feed/index.json`을 생성하고 업로드한다. 프로젝트 레포는 `index.json`을 직접 수정하지 않는다.
