import type { Project } from "../types/project";

export const projects: Project[] = [
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
    id: "settlement-admin-api",
    title: "Settlement Admin API",
    subtitle: "정산 백오피스 API와 배치 운영",
    category: "실무 도메인형",
    status: "Needs Cleanup",
    repo: "MIMminE/settlement-admin-api",
    summary:
      "판매자별 주문/환불 데이터를 일별로 집계하고, 정산 재계산, 확정, CSV 다운로드, 감사 로그를 제공하는 백오피스 프로젝트입니다.",
    stacks: ["Java", "Spring Boot", "Spring Batch", "Spring Security", "JPA", "PostgreSQL", "Flyway"],
    coverImage: "/projects/settlement-admin-api/cover.png",
    entryDocumentPath: "README.md",
    entryDocumentUrl: "https://github.com/MIMminE/settlement-admin-api/blob/master/README.md",
    entryDocumentMarkdown: "# Settlement Admin API\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/settlement-admin-api", type: "github" }
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
    id: "order-service-iac-cicd",
    title: "Order Service IaC/CD",
    subtitle: "주문 서비스와 AWS 배포 파이프라인",
    category: "백엔드 아키텍처형",
    status: "Needs Cleanup",
    repo: "MIMminE/order-service-iac-cicd",
    summary:
      "Spring Boot 주문 서비스에 Terraform, AWS ECS, GitHub Actions 배포 흐름을 붙인 백엔드/인프라 프로젝트입니다.",
    stacks: ["Kotlin", "Spring Boot", "Terraform", "AWS ECS", "ECR", "GitHub Actions", "PostgreSQL"],
    coverImage: "/projects/order-service-iac-cicd/cover.png",
    entryDocumentPath: "README.md",
    entryDocumentUrl: "https://github.com/MIMminE/order-service-iac-cicd/blob/master/README.md",
    entryDocumentMarkdown: "# Order Service IaC/CD\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/order-service-iac-cicd", type: "github" }
    ]
  },
  {
    id: "maternity-care-commerce",
    title: "Maternity Care Commerce",
    subtitle: "모성 케어 커머스와 운영 백오피스",
    category: "실무 도메인형",
    status: "Portfolio Ready",
    repo: "MIMminE/maternity-care-commerce",
    summary:
      "임신·출산·육아 도메인의 사용자 서비스, D2C 커머스, 관리자 운영 시스템을 통합한 백엔드 중심 프로젝트입니다.",
    stacks: ["Java", "Spring Boot", "Spring Security", "JPA", "PostgreSQL", "React", "TypeScript"],
    entryDocumentPath: "docs/resume-portfolio.md",
    entryDocumentUrl: "https://github.com/MIMminE/maternity-care-commerce/blob/main/docs/resume-portfolio.md",
    entryDocumentMarkdown: "# Maternity Care Commerce\n\n프로젝트 문서는 manifest 동기화 후 표시됩니다.",
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/maternity-care-commerce", type: "github" }
    ]
  }
];
