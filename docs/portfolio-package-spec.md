# Portfolio Package Upload Spec

이 문서는 Portfolio Hub가 S3 같은 정적 스토리지에서 프로젝트 게시물을 읽기 위한 업로드 규격을 정의한다.

현재 허브는 프로젝트 레포를 직접 분석하지 않는다. 각 프로젝트가 정해진 패키지를 업로드하면, 허브는 그 패키지를 읽어 메인 목록과 상세 블로그를 렌더링한다.

## Rendering Model

허브 화면은 아래 입력을 사용한다.

| UI Area | Source |
| --- | --- |
| 메인 케이스 스터디 목록 제목 | `manifest.title` |
| 메인 케이스 스터디 목록 맥락 | `manifest.subtitle` |
| 메인 케이스 스터디 목록 접근 | `manifest.summary` |
| 메인 목록 이미지 | `manifest.coverImage` |
| 메인/상세 기술 스택 | `manifest.stacks` |
| 상세 상단 제목 | `manifest.title` |
| 상세 상단 설명 | `manifest.summary` |
| 상세 본문 | `manifest.article`이 가리키는 Markdown 파일 |
| 상세 목차 | `article.md`의 `#`, `##`, `###` |
| 상세 릴리즈 다운로드 | GitHub Release 동기화 값 또는 `links[].type = "release"` |

중요한 구분:

- `manifest.json`은 게시물 메타데이터다.
- `article.md`가 실제 블로그 본문이다.
- `links`는 본문이 아니라 외부 링크 또는 다운로드 링크다.

## Source Repository Layout

각 프로젝트 레포에서는 포트폴리오 게시물 소스를 `blog/` 패키지 아래에 둔다.

```text
project-repo/
├─ .portfolio/
│  └─ manifest.json
├─ blog/
│  ├─ article.md
│  └─ images/
│     ├─ cover.png
│     └─ admin-dashboard.png
├─ docs/
│  └─ architecture.md
└─ releases/
   └─ project-demo-1.0.0.zip
```

권장 역할:

- `blog/article.md`: 허브 상세 페이지에 렌더링되는 본문
- `blog/images/`: 본문 이미지와 대표 이미지
- `docs/`: 프로젝트 내부 설계, API, 운영 문서
- `.portfolio/manifest.json`: 허브가 읽는 게시물 메타데이터
- `releases/`: 다운로드 가능한 릴리즈 산출물

프로젝트 레포의 source manifest는 아래처럼 `blog/` 경로를 가리킨다.

```json
{
  "article": "blog/article.md",
  "coverImage": "blog/images/cover.png"
}
```

CI는 이 source manifest를 S3 업로드용 manifest로 변환한다.

## S3 Layout

S3에는 아래 구조로 업로드한다.

```text
portfolio-feed/
├─ index.json
├─ warehouse-ops-suite/
│  ├─ manifest.json
│  ├─ article.md
│  ├─ images/
│  │  ├─ cover.png
│  │  └─ dashboard.png
│  └─ releases/
│     └─ warehouse-ops-suite-1.0.0.zip
└─ maternity-care-commerce/
   ├─ manifest.json
   ├─ article.md
   ├─ images/
   │  ├─ cover.png
   │  └─ admin-dashboard.png
   └─ releases/
      └─ maternity-care-commerce-1.0.0.zip
```

`releases/`는 선택이다. 설치 파일, 데모 빌드, PDF 묶음처럼 다운로드 가능한 산출물이 있을 때만 둔다.

현재 로컬 검증용 mock bucket은 `public/portfolio-feed`다.

## Loading Flow

허브는 아래 순서로 읽는다.

```text
1. /portfolio-feed/index.json 또는 VITE_PORTFOLIO_FEED_URL fetch
2. index.json.projects[*].manifestUrl fetch
3. manifest.json.article fetch
4. manifest + article.md + release metadata로 화면 렌더링
```

상대 경로 규칙:

- `index.json.projects[].manifestUrl`은 `index.json` 위치 기준이다.
- `manifest.article`과 `manifest.coverImage`는 `manifest.json` 위치 기준이다.
- `article.md` 안의 상대 이미지와 상대 링크는 `article.md` 위치 기준이다.
- `links[].url`은 절대 URL 또는 `manifest.json` 위치 기준 상대 경로를 권장한다.

## index.json

허브가 처음 읽는 feed 목록 파일이다.

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

| Field | Required | Description |
| --- | --- | --- |
| `version` | yes | feed 구조 버전 |
| `generatedAt` | yes | index 생성 시각, ISO string |
| `projects` | yes | 노출할 프로젝트 목록 |
| `projects[].id` | yes | 프로젝트 고유 ID |
| `projects[].manifestUrl` | yes | 해당 프로젝트의 `manifest.json` 경로 |

## Uploaded manifest.json

S3 패키지 안에 업로드되는 중심 메타데이터다.
프로젝트 레포의 `.portfolio/manifest.json`을 그대로 올리지 않고, CI가 패키지 기준 상대 경로로 변환한다.

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
  "updatedAt": "2026-05-19T00:00:00.000Z",
  "links": [
    {
      "label": "v1.0.0 demo package",
      "url": "./releases/warehouse-ops-suite-1.0.0.zip",
      "type": "release"
    }
  ]
}
```

### Required Fields

| Field | Used In UI | Description |
| --- | --- | --- |
| `id` | routing | URL query와 index 매칭에 사용하는 프로젝트 ID |
| `title` | main/detail | 프로젝트 제목 |
| `subtitle` | main | 케이스 스터디의 `맥락` |
| `summary` | main/detail | 케이스 스터디의 `접근`, 상세 상단 설명 |
| `stacks` | main/detail sidebar | 기술 스택 chip 목록 |
| `repoUrl` | detail nav | GitHub 버튼 URL |
| `article` | detail body | 실제 본문 Markdown 파일 경로 |

### Compatibility Fields

아래 필드는 기존 패키지 호환 때문에 유지한다.

| Field | Current Use |
| --- | --- |
| `category` | 현재 메인/상세 UI에서는 노출하지 않음 |
| `status` | 상세 상단 metadata에 표시 |

### Optional Fields

| Field | Current Use | Description |
| --- | --- | --- |
| `coverImage` | main image | 대표 이미지 |
| `coverAlt` | main image alt | 대표 이미지 대체 텍스트 |
| `updatedAt` | detail metadata | 최근 업데이트 표시용 ISO string |
| `localDemo` | reserved | 로컬 데모 링크 |
| `links` | release fallback | 외부 링크, 문서 링크, 릴리즈 다운로드 링크 |

## Main List Rules

메인 화면은 프로젝트를 분류하지 않고 하나의 케이스 스터디 목록으로 보여준다.

각 row는 아래처럼 해석된다.

```text
01. {title}
맥락: {subtitle}
접근: {summary}
기술: {stacks}
```

`coverImage`는 row 왼쪽 썸네일로 표시된다. 허브는 썸네일 높이를 고정해서 이미지 원본 비율 때문에 row 높이가 달라지지 않도록 한다.

권장:

- `title`: 20자 안팎
- `subtitle`: 한 줄 설명
- `summary`: 한 문장, 너무 길면 읽기 어려움
- `stacks`: 4~8개
- `coverImage`: 화면 캡처 또는 실제 산출물 이미지

## blog/article.md

프로젝트 레포에서는 `blog/article.md`가 실제 상세 블로그 본문이다.
CI가 이 파일을 S3 패키지의 `article.md`로 복사한다.

```md
# Warehouse Ops Suite

3PL 물류센터의 입고, 적치, 재고, 출고, 피킹 흐름을 하나로 연결한 WMS 포트폴리오입니다.

## 운영 흐름

![운영 현황 대시보드](./images/dashboard.png)

| 영역 | 설명 |
| --- | --- |
| 입고 | PDA 검수 후 로케이션 적치 |
| 출고 | 출고 지시 접수 후 피킹 웨이브 생성 |
```

지원 문법:

- `#`, `##`, `###`
- paragraph
- list
- fenced code block
- GFM table
- image
- link

### Heading Rules

상세 우측 목차는 `#`, `##`, `###`에서 자동 생성한다.

첫 번째 본문 H1이 `manifest.title`과 같거나 `manifest.title`로 시작하면 허브가 자동으로 제거한다. 상세 상단에 이미 제목이 있기 때문이다.

예:

```md
# Warehouse Ops Suite
```

또는

```md
# Warehouse Ops Suite 이력서용 포트폴리오
```

위 두 경우는 상세 본문과 목차에서 제거된다.

본문은 바로 `## 프로젝트 한 줄 소개`처럼 시작해도 된다.

### Image Rules

본문 이미지는 Markdown image 문법을 사용한다.

```md
![관리자 대시보드](./images/admin-dashboard.png)
```

권장:

- 본문 이미지는 프로젝트 레포의 `blog/images/` 아래에 둔다.
- 파일명은 소문자 kebab-case를 사용한다.
- 화면 캡처는 민감 정보와 실제 고객사 데이터를 제거한다.
- 외부 이미지 URL도 가능하지만, 장기 보존을 위해 S3 패키지 내부 업로드를 권장한다.

## Release Download Rules

상세 게시물에서 다운로드 버튼을 보여주는 방법은 두 가지다.

### 1. GitHub Release 기반

허브의 GitHub 상태 동기화가 `latestReleaseUrl`을 가져오면, 해당 URL을 우선 사용한다.

이 방식은 별도 manifest 설정 없이 GitHub Releases를 기준으로 동작한다.

### 2. manifest links 기반

S3에 직접 산출물을 올리고 싶으면 `links`에 `type: "release"`를 넣는다.

```json
{
  "links": [
    {
      "label": "v1.0.0 macOS build",
      "url": "./releases/warehouse-ops-suite-1.0.0.dmg",
      "type": "release"
    }
  ]
}
```

허브는 GitHub Release URL이 없을 때 `links` 중 첫 번째 `release` 링크를 다운로드 버튼으로 사용한다.

릴리즈 파일 권장 위치:

```text
portfolio-feed/{projectId}/releases/
```

권장 파일명:

```text
{projectId}-{version}.{ext}
```

예:

```text
warehouse-ops-suite-1.0.0.zip
print-agent-0.1.0.dmg
pda-app-0.1.0.apk
```

## links Field

`links`는 본문이 아니다.

현재 UI에서 직접 쓰는 링크 타입:

| Type | Current Behavior |
| --- | --- |
| `release` | GitHub Release가 없을 때 상세 사이드바 다운로드 버튼으로 사용 |

예약된 링크 타입:

| Type | Note |
| --- | --- |
| `docs` | README, 보고서, API 문서 |
| `manual` | 사용자 매뉴얼 |
| `demo` | 배포 데모 |
| `github` | 허브가 `repoUrl`로 자동 생성하므로 manifest에 직접 넣을 필요 없음 |

## Upload Contract

각 프로젝트 레포 CI는 자기 프로젝트 패키지만 업로드한다.

```text
s3://{PORTFOLIO_FEED_BUCKET}/portfolio-feed/{projectId}/
├─ manifest.json
├─ article.md
├─ images/
│  └─ ...
└─ releases/
   └─ ...
```

각 프로젝트 CI는 `portfolio-feed/index.json`을 직접 수정하지 않는다.

전체 index는 Portfolio Hub 레포가 관리한다.

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

기본 feed URL:

```text
/portfolio-feed/index.json
```

AWS 연결 후:

```text
VITE_PORTFOLIO_FEED_URL=https://portfolio.example.com/portfolio-feed/index.json
```

## Validation Checklist

업로드 전 아래를 확인한다.

- `index.json.projects[].manifestUrl`이 실제 존재한다.
- `manifest.json.article`이 실제 존재한다.
- `coverImage`가 있으면 이미지가 실제 존재한다.
- `article.md` 내부 상대 이미지 경로가 실제 존재한다.
- `links[].type = "release"`를 쓰는 경우 release 파일이 실제 존재한다.
- `title`, `subtitle`, `summary`가 너무 길지 않다.
- `stacks`는 4~8개 정도로 제한한다.
- 본문 heading은 `#`, `##`, `###` 중심으로 작성한다.
- 고객사명, 실서비스 운영 로그, 내부 API 경로, 민감 정보가 포함되지 않는다.
