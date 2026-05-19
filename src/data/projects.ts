import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "warehouse-ops-suite",
    title: "Warehouse Ops Suite",
    subtitle: "3PL 물류센터 WMS 운영 시스템",
    category: "실무 도메인형",
    status: "Portfolio Ready",
    repo: "MIMminE/warehouse-ops-suite",
    description:
      "입고, 적치, 재고, 출고 지시, 피킹 웨이브, DPS, PDA, 송장 출력까지 하나의 운영 흐름으로 연결한 WMS 포트폴리오입니다.",
    problem:
      "물류 운영 시스템은 단순 CRUD가 아니라 고객사별 재고 소유권, 현장 작업, 로컬 장비, 출력 실패까지 함께 관리해야 합니다.",
    solution:
      "Admin Web, API Server, PDA App, DPS Protocol Agent, Print Agent, PDF Renderer를 분리하고 HTTP/WebSocket 기반으로 연결했습니다.",
    impact:
      "운영 화면, 사용자 매뉴얼, 기능 명세, 로컬 에이전트까지 포함해 실무형 백엔드/운영 도메인 역량을 보여줍니다.",
    stacks: ["Kotlin", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Flyway", "Ktor", "Flutter"],
    highlights: [
      "3PL 고객사/창고/SKU/로케이션 모델링",
      "출고 지시 접수와 재고 할당",
      "피킹 웨이브와 DPS WebSocket 연동",
      "송장 PDF 렌더링과 로컬 프린트 에이전트"
    ],
    interviewPoints: [
      "회사 코드를 사용하지 않고 도메인 경험을 일반화해 재설계",
      "중앙 서비스와 로컬 에이전트의 배포 단위 분리",
      "화면 기반 제품 매뉴얼로 운영 흐름 설명 가능"
    ],
    coverImage: "/projects/warehouse-ops-suite/cover.png",
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
    description:
      "판매자별 주문/환불 데이터를 일별로 집계하고, 정산 재계산, 확정, CSV 다운로드, 감사 로그를 제공하는 백오피스 프로젝트입니다.",
    problem:
      "정산 업무는 집계 결과를 다시 검증하고 확정해야 하며, 운영자가 처리 이력을 추적할 수 있어야 합니다.",
    solution:
      "Spring Batch와 관리자 API를 연결해 일별 정산 생성, 재실행, 확정, CSV export, audit log를 구성했습니다.",
    impact:
      "운영 백오피스에서 자주 필요한 배치/확정/추적 흐름을 백엔드 중심으로 설명할 수 있습니다.",
    stacks: ["Java", "Spring Boot", "Spring Batch", "Spring Security", "JPA", "PostgreSQL", "Flyway"],
    highlights: ["정산 배치", "재계산 버전 관리", "CSV Export", "관리자 JWT 인증", "감사 로그"],
    interviewPoints: [
      "단순 관리자 CRUD가 아닌 집계-검증-확정 흐름 구현",
      "운영 이벤트와 감사 로그의 필요성 설명",
      "배치 재실행 시 정산 버전 관리 포인트 설명"
    ],
    coverImage: "/projects/settlement-admin-api/cover.png",
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
    description:
      "주문, 재고, 결제, 상품 서비스를 Kafka 이벤트로 연결하고 Transactional Outbox, Lease, Idempotency를 적용한 커머스 프로젝트입니다.",
    problem:
      "분산 서비스에서는 주문 저장과 메시지 발행, 중복 요청, 재시도 상황에서 데이터 정합성이 흔들릴 수 있습니다.",
    solution:
      "Transactional Outbox와 lease 기반 publisher를 사용해 메시지 유실과 중복 발행 위험을 줄였습니다.",
    impact:
      "주문 도메인의 신뢰성 패턴을 작은 MSA로 구현해 아키텍처 설계 역량을 보여줍니다.",
    stacks: ["Kotlin", "Spring Boot", "Kafka", "PostgreSQL", "Redis", "Docker Compose", "Testcontainers"],
    highlights: ["Transactional Outbox", "Idempotency", "Lease Publisher", "Redis Cache", "Kafka Event Flow"],
    interviewPoints: [
      "DB 트랜잭션과 Kafka 발행을 직접 묶을 수 없는 문제 설명",
      "SKIP LOCKED 기반 publisher 확장성 설명",
      "멱등성 키로 API 재시도를 처리한 이유 설명"
    ],
    coverImage: "/projects/kotlin-commerce-core/cover.png",
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
    description:
      "단일 재고 row에 주문 요청이 몰리는 상황에서 Optimistic Lock과 Pessimistic Lock의 처리량, 지연시간, 재시도 비용을 비교했습니다.",
    problem:
      "재고 차감처럼 쓰기 경합이 집중되는 지점에서는 락 전략 선택이 처리량과 장애 양상에 큰 영향을 줍니다.",
    solution:
      "동시성, 초기 재고, backoff, 목표 성공 건수를 조정할 수 있는 실험 UI와 리포트를 구성했습니다.",
    impact:
      "동시성 이슈를 감으로 말하지 않고 실험 조건과 결과로 설명할 수 있습니다.",
    stacks: ["Java", "Spring Boot", "JPA", "PostgreSQL", "Micrometer", "Prometheus", "Grafana"],
    highlights: ["Optimistic vs Pessimistic Lock", "성능 리포트", "Grafana Dashboard", "Docker Compose 실험 환경"],
    interviewPoints: [
      "비관락/낙관락의 장단점을 트래픽 패턴에 맞춰 설명",
      "재시도 비용이 처리량을 어떻게 잠식하는지 수치 기반 설명",
      "실험 재현성을 위한 Docker Compose 구성"
    ],
    coverImage: "/projects/stock-lock-benchmark/cover.png",
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
    description:
      "Spring Boot 주문 서비스에 Terraform, AWS ECS, GitHub Actions 배포 흐름을 붙인 백엔드/인프라 프로젝트입니다.",
    problem:
      "백엔드 서비스는 코드 구현뿐 아니라 이미지 빌드, 인프라 변경, 배포 승인 흐름까지 재현 가능해야 합니다.",
    solution:
      "Terraform plan/apply와 Docker image build/push workflow를 분리하고 ECS 배포 구조를 문서화했습니다.",
    impact:
      "서비스 구현과 클라우드 배포 파이프라인을 함께 이해하고 있음을 보여줍니다.",
    stacks: ["Kotlin", "Spring Boot", "Terraform", "AWS ECS", "ECR", "GitHub Actions", "PostgreSQL"],
    highlights: ["AWS IaC", "Terraform Plan/Apply", "ECR Image Push", "JWT Auth", "Pessimistic Stock Lock"],
    interviewPoints: [
      "Plan과 Apply를 분리한 이유 설명",
      "ECS/ECR 중심의 컨테이너 배포 흐름 설명",
      "운영 배포에서 수동 승인 지점이 필요한 이유 설명"
    ],
    coverImage: "/projects/order-service-iac-cicd/cover.png",
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
    description:
      "임신·출산·육아 도메인의 사용자 서비스, D2C 커머스, 관리자 운영 시스템을 통합한 백엔드 중심 프로젝트입니다.",
    problem:
      "커머스와 케어 서비스가 결합된 도메인은 개인정보, 상담, 마케팅 동의, 상품 주문 흐름을 함께 관리해야 합니다.",
    solution:
      "사용자 API와 관리자 API를 분리하고, 산모 프로필, 동의 이력, 상담/문의, 주문, 감사 로그를 구성했습니다.",
    impact:
      "현업 부서와 커뮤니케이션하며 요구사항을 구조화하는 백엔드 역량을 보여줄 수 있습니다.",
    stacks: ["Java", "Spring Boot", "Spring Security", "JPA", "PostgreSQL", "React", "TypeScript"],
    highlights: ["사용자/관리자 API 분리", "산모 프로필", "개인정보 동의 이력", "마케팅 대상 조회", "감사 로그"],
    interviewPoints: [
      "현업 요구사항을 API와 운영 화면으로 나눈 방식 설명",
      "개인정보 접근 감사 로그를 둔 이유 설명",
      "커머스 주문과 케어 도메인 데이터를 분리한 설계 설명"
    ],
    links: [
      { label: "GitHub", url: "https://github.com/MIMminE/maternity-care-commerce", type: "github" }
    ]
  }
];
