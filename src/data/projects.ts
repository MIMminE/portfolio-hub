import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "maternity-care-commerce",
    title: "Care Commerce Platform",
    subtitle: "고객 데스크톱 웹, iOS 앱, 관리자 백오피스를 분리한 케어 커머스 운영 시스템",
    category: "실무 도메인형",
    status: "Portfolio Ready",
    repo: "MIMminE/maternity-care-commerce",
    summary:
      "케어 커머스 도메인의 고객 데스크톱 웹, iOS SwiftUI 앱, 관리자 백오피스, Spring Boot API 서버를 분리해 구성한 포트폴리오입니다.",
    stacks: ["Java", "Spring Boot", "Spring Security", "JPA", "PostgreSQL", "React", "TypeScript", "SwiftUI"],
    entryDocumentPath: "blog/article.md",
    entryDocumentUrl: "/portfolio-feed/maternity-care-commerce/article.md",
    entryDocumentMarkdown: "# Care Commerce Platform\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/maternity-care-commerce", type: "github" }
    ]
  },
  {
    id: "warehouse-ops-suite",
    title: "Warehouse Ops Suite",
    subtitle: "3PL 물류센터 WMS 운영 시스템",
    category: "실무 도메인형",
    status: "Portfolio Ready",
    repo: "MIMminE/warehouse-ops-suite",
    summary:
      "입고, 적치, 재고, 출고 지시, 피킹 웨이브, DPS, PDA, 송장 출력까지 하나의 운영 흐름으로 연결한 WMS 포트폴리오입니다.",
    stacks: ["Kotlin", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Flyway", "Ktor", "Flutter"],
    coverImage: "/projects/warehouse-ops-suite/cover.png",
    entryDocumentPath: "docs/resume-portfolio.md",
    entryDocumentUrl: "https://github.com/MIMminE/warehouse-ops-suite/blob/main/docs/resume-portfolio.md",
    entryDocumentMarkdown: "# Warehouse Ops Suite\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/warehouse-ops-suite", type: "github" },
      {
        label: "이력서용 요약",
        url: "https://github.com/MIMminE/warehouse-ops-suite/blob/main/docs/resume-portfolio.md",
        type: "docs"
      },
      {
        label: "제품 매뉴얼",
        url: "https://github.com/MIMminE/warehouse-ops-suite/blob/main/docs/product-manual.md",
        type: "manual"
      }
    ]
  },
  {
    id: "stock-lock-benchmark",
    title: "Stock Lock Benchmark",
    subtitle: "재고 핫스팟 락 전략 성능 비교",
    category: "성능/동시성 실험형",
    status: "Needs Cleanup",
    repo: "MIMminE/stock-lock-benchmark",
    summary:
      "단일 재고 row에 주문 요청이 몰리는 상황에서 Optimistic Lock과 Pessimistic Lock의 처리량, 지연시간, 재시도 비용을 비교했습니다.",
    stacks: ["Java", "Spring Boot", "JPA", "PostgreSQL", "Micrometer", "Prometheus", "Grafana"],
    coverImage: "/projects/stock-lock-benchmark/cover.png",
    entryDocumentPath: "docs/benchmark-report.md",
    entryDocumentUrl: "https://github.com/MIMminE/stock-lock-benchmark/blob/master/docs/benchmark-report.md",
    entryDocumentMarkdown: "# Stock Lock Benchmark\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/stock-lock-benchmark", type: "github" }
    ]
  },
  {
    id: "kotlin-commerce-core",
    title: "Kotlin Commerce Core",
    subtitle: "Kafka 이벤트 기반 커머스 MSA",
    category: "백엔드 아키텍처형",
    status: "Needs Cleanup",
    repo: "MIMminE/kotlin-commerce-core",
    summary:
      "주문, 재고, 결제, 상품 서비스를 Kafka 이벤트로 연결하고 Transactional Outbox, Lease, Idempotency를 적용한 커머스 프로젝트입니다.",
    stacks: ["Kotlin", "Spring Boot", "Kafka", "PostgreSQL", "Redis", "Docker Compose", "Testcontainers"],
    coverImage: "/projects/kotlin-commerce-core/cover.png",
    entryDocumentPath: "README.md",
    entryDocumentUrl: "https://github.com/MIMminE/kotlin-commerce-core/blob/master/README.md",
    entryDocumentMarkdown: "# Kotlin Commerce Core\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/kotlin-commerce-core", type: "github" }
    ]
  },
  {
    id: "devpilot",
    title: "DevPilot",
    subtitle: "Jira, Git 저장소, Codex, 보고서를 연결하는 macOS 개인 업무 자동화 앱",
    category: "실무 도메인형",
    status: "Portfolio Ready",
    repo: "MIMminE/devpilot",
    summary:
      "개발자의 하루 업무 흐름을 Jira 일감, 로컬 Git 저장소, Codex 작업 요청, 보고서, 기록으로 연결한 SwiftUI macOS 앱과 Python CLI 기반 자동화 프로젝트입니다.",
    stacks: ["SwiftUI", "macOS", "Python", "Jira API", "GitHub CLI", "Slack API", "Codex CLI", "GitHub Actions"],
    coverImage: "/portfolio-feed/devpilot/images/cover.png",
    coverAlt: "DevPilot 대시보드",
    entryDocumentPath: "blog/article.md",
    entryDocumentUrl: "/portfolio-feed/devpilot/article.md",
    entryDocumentMarkdown: "# DevPilot\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/devpilot", type: "github" }
    ]
  }
];
