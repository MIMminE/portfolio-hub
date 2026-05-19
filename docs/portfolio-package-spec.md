# Portfolio Package Spec

이 문서는 Portfolio Hub가 S3 같은 정적 스토리지에서 프로젝트 게시물을 읽기 위한 패키지 규격을 정의한다.

핵심 원칙은 단순하다.

- 허브는 각 프로젝트 레포의 README나 docs를 직접 해석하지 않는다.
- 각 프로젝트는 정해진 형태의 정적 패키지를 만든다.
- 허브는 `index.json` -> `manifest.json` -> `article.md` 순서로 읽는다.
- 실제 본문은 `article.md`이고, `manifest.json`은 카드와 상세 화면을 위한 메타데이터다.

## Storage Layout

S3 또는 로컬 mock bucket은 아래 구조를 따른다.

```text
portfolio-feed/
├─ index.json
├─ warehouse-ops-suite/
│  ├─ manifest.json
│  ├─ article.md
│  └─ images/
│     ├─ cover.png
│     └─ dashboard.png
└─ maternity-care-commerce/
   ├─ manifest.json
   ├─ article.md
   └─ images/
      ├─ cover.png
      ├─ admin-dashboard.png
      └─ client-home.png
```

현재 로컬 검증용 mock bucket은 `public/portfolio-feed`에 둔다.

## Loading Flow

허브는 아래 순서로 데이터를 읽는다.

```text
1. VITE_PORTFOLIO_FEED_URL 또는 /portfolio-feed/index.json fetch
2. index.json.projects[*].manifestUrl fetch
3. manifest.json.article fetch
4. manifest + article.md를 조합해 카드와 상세 게시물 렌더링
```

본문에 들어가는 이미지와 내부 링크가 상대 경로이면, 허브는 `article.md` 위치 기준의 절대 URL로 변환한다.

예:

```md
![대시보드](./images/dashboard.png)
```

`portfolio-feed/warehouse-ops-suite/article.md` 안에서 위처럼 쓰면 최종적으로 아래 파일을 가리킨다.

```text
portfolio-feed/warehouse-ops-suite/images/dashboard.png
```

## index.json

`index.json`은 허브가 처음 읽는 목록 파일이다. 전체 프로젝트 목록과 각 프로젝트 패키지의 `manifest.json` 위치만 가진다.

```json
{
  "version": "1.0",
  "generatedAt": "2026-05-19T00:00:00.000Z",
  "projects": [
    {
      "id": "warehouse-ops-suite",
      "manifestUrl": "./warehouse-ops-suite/manifest.json"
    },
    {
      "id": "maternity-care-commerce",
      "manifestUrl": "./maternity-care-commerce/manifest.json"
    }
  ]
}
```

### Fields

| Field | Required | Description |
| --- | --- | --- |
| `version` | yes | feed 구조 버전 |
| `generatedAt` | yes | index 생성 시각, ISO string |
| `projects` | yes | 노출할 프로젝트 목록 |
| `projects[].id` | yes | 프로젝트 고유 ID |
| `projects[].manifestUrl` | yes | 해당 프로젝트의 `manifest.json` 경로 |

`manifestUrl`은 `index.json` 위치 기준 상대 경로 또는 절대 URL을 사용할 수 있다.

## manifest.json

`manifest.json`은 카드와 상세 화면의 메타데이터다. 본문 자체를 담지 않는다.

```json
{
  "id": "warehouse-ops-suite",
  "title": "Warehouse Ops Suite",
  "subtitle": "3PL 물류센터 WMS 운영 시스템",
  "category": "실무 도메인형",
  "status": "Portfolio Ready",
  "summary": "입고, 적치, 재고, 출고 지시, 피킹 웨이브, DPS, PDA, 송장 출력까지 하나의 운영 흐름으로 연결한 WMS 포트폴리오입니다.",
  "stacks": ["Kotlin", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Flyway"],
  "repoUrl": "https://github.com/MIMminE/warehouse-ops-suite",
  "article": "./article.md",
  "coverImage": "./images/cover.png",
  "coverAlt": "Warehouse Ops Suite 운영 현황 대시보드",
  "updatedAt": "2026-05-19T00:00:00.000Z"
}
```

### Required Fields

| Field | Used In UI | Description |
| --- | --- | --- |
| `id` | routing | URL query와 index 매칭에 사용하는 프로젝트 ID |
| `title` | main card, detail header | 프로젝트/게시물 제목 |
| `subtitle` | main card | 글 목록에서 제목 위에 보이는 짧은 설명 |
| `summary` | main card, detail header | 프로젝트 요약 문장 |
| `stacks` | main card, detail sidebar | 기술 스택 chip 목록 |
| `repoUrl` | detail nav | GitHub 링크 생성에 사용 |
| `article` | detail body | 실제 본문 Markdown 파일 경로 |

### Current Compatibility Fields

아래 필드는 현재 타입과 기존 패키지 호환을 위해 유지한다.

| Field | Current Use | Note |
| --- | --- | --- |
| `category` | detail header eyebrow | 메인 목록에서는 사용하지 않음 |
| `status` | detail header metadata | 메인 목록에서는 사용하지 않음 |

### Optional Fields

| Field | Used In UI | Description |
| --- | --- | --- |
| `coverImage` | main card | 대표 이미지. 상대 경로 또는 절대 URL 가능 |
| `coverAlt` | main card image alt | 대표 이미지 대체 텍스트 |
| `updatedAt` | detail header | 최근 업데이트 표시용 ISO string |
| `localDemo` | reserved | 로컬 데모 링크. 현재 UI에서는 직접 노출하지 않음 |
| `links` | reserved | README, 문서, 릴리즈 같은 외부 링크. 현재 상세 사이드바에서는 노출하지 않음 |

## article.md

`article.md`가 실제 블로그 본문이다. `links`가 본문이 아니다.

허브는 `article.md`를 Markdown으로 렌더링한다.

지원하는 주요 문법:

- `#`, `##`, `###` heading
- paragraph
- unordered/ordered list
- fenced code block
- table, GFM
- image
- link

예시:

```md
# Warehouse Ops Suite

3PL 물류센터의 입고, 적치, 재고, 출고, 피킹 흐름을 하나로 연결한 WMS 포트폴리오입니다.

## 운영 흐름

![운영 현황 대시보드](./images/dashboard.png)

| 영역 | 설명 |
| --- | --- |
| 입고 | PDA 검수 후 로케이션 적치 |
| 출고 | 출고 지시 접수 후 피킹 웨이브 생성 |

## 설계 포인트

- 관리자 웹, PDA 앱, 로컬 에이전트를 분리했다.
- HTTP와 WebSocket으로 실행 단위 간 통신을 구성했다.
```

### Heading Rules

상세 페이지 우측 목차는 `article.md`의 heading에서 자동 생성된다.

| Markdown | Used In TOC |
| --- | --- |
| `#` | yes |
| `##` | yes |
| `###` | yes |
| `####` 이하 | no |

본문 첫 heading은 보통 프로젝트 제목으로 둔다.

```md
# Maternity Care Commerce
```

### Image Rules

본문 이미지는 Markdown image 문법을 사용한다.

```md
![관리자 대시보드](./images/admin-dashboard.png)
```

권장 규칙:

- 본문 이미지는 `images/` 아래에 둔다.
- 이미지 파일명은 소문자 kebab-case를 사용한다.
- 화면 캡처 이미지는 넓은 화면 기준 1200px 안팎을 권장한다.
- 민감 정보, 실제 고객사명, 실제 운영 데이터는 제거한다.

외부 이미지 URL도 가능하지만, 장기적으로는 S3 패키지 안에 복사해 두는 것을 권장한다.

## links Field

`links`는 본문이 아니라 외부 참고 링크 목록이다.

```json
{
  "links": [
    {
      "label": "README",
      "url": "https://github.com/MIMminE/warehouse-ops-suite/blob/main/README.md",
      "type": "docs"
    }
  ]
}
```

현재 UI에서는 상세 사이드바의 문서 링크를 제거했기 때문에 `links`를 직접 노출하지 않는다.

다만 추후 아래 기능을 붙일 수 있도록 필드는 예약해 둔다.

- 릴리즈 파일 다운로드
- GitHub README 링크
- 배포 데모 링크
- PDF 보고서 링크

## S3 Upload Contract

각 프로젝트 레포 CI는 자기 프로젝트 패키지만 업로드한다.

```text
s3://{PORTFOLIO_FEED_BUCKET}/portfolio-feed/{projectId}/
├─ manifest.json
├─ article.md
└─ images/
   └─ ...
```

각 프로젝트 CI는 `portfolio-feed/index.json`을 직접 수정하지 않는다.

전체 index는 Portfolio Hub 레포가 관리한다.

```text
portfolio-hub
├─ config/portfolio-feed-projects.json
└─ scripts/build-portfolio-feed-index.ts
```

## Hub-Owned Index

허브 레포는 아래 설정을 기준으로 `index.json`을 만든다.

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

로컬 index 생성:

```bash
pnpm feed:index
```

절대 URL 기반 index 생성:

```bash
PORTFOLIO_FEED_BASE_URL=https://cdn.example.com/portfolio-feed pnpm feed:index
```

## Local Mock Feed

AWS 연결 전에는 로컬 mock feed로 같은 구조를 검증한다.

```text
public/portfolio-feed/
├─ index.json
├─ warehouse-ops-suite/
│  ├─ manifest.json
│  └─ article.md
└─ ...
```

허브의 기본 feed URL은 아래와 같다.

```text
/portfolio-feed/index.json
```

AWS 연결 후에는 `.env` 또는 배포 환경변수에 아래 값을 넣는다.

```text
VITE_PORTFOLIO_FEED_URL=https://portfolio.example.com/portfolio-feed/index.json
```

## Validation Checklist

각 프로젝트 패키지는 업로드 전 아래를 확인한다.

- `index.json`의 `manifestUrl`이 실제 존재한다.
- `manifest.json.article`이 실제 존재한다.
- `coverImage`가 있으면 이미지가 실제 존재한다.
- `article.md` 내부 상대 이미지 경로가 실제 존재한다.
- `title`, `subtitle`, `summary`가 너무 길지 않다.
- `stacks`는 4~8개 정도로 제한한다.
- 본문 heading은 `#`, `##`, `###` 중심으로 작성한다.
- 고객사명, 실서비스 운영 로그, 내부 API 경로, 민감 정보가 포함되지 않는다.
