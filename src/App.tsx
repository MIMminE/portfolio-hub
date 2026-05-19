import generatedStatuses from "./data/generated-status.json";
import { projects } from "./data/projects";
import { ProjectCard } from "./components/ProjectCard";
import type { GeneratedProjectStatus, ProjectCategory } from "./types/project";

const statuses = generatedStatuses as GeneratedProjectStatus[];

const categories: ProjectCategory[] = ["실무 도메인형", "백엔드 아키텍처형", "성능/동시성 실험형"];

const categoryDescriptions: Record<ProjectCategory, string> = {
  "실무 도메인형": "실제 운영 조직과 도메인 흐름을 기준으로 설계한 프로젝트",
  "백엔드 아키텍처형": "분산 처리, 이벤트, 인프라, 배포 구조를 강조하는 프로젝트",
  "성능/동시성 실험형": "락, 처리량, 재시도 비용을 실험과 수치로 설명하는 프로젝트"
};

export function App() {
  const statusByProject = new Map(statuses.map((status) => [status.id, status]));
  const syncedAt = statuses[0]?.syncedAt;
  const portfolioReadyCount = projects.filter((project) => project.status === "Portfolio Ready").length;

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Backend Portfolio Hub</p>
          <h1>운영 도메인, 백엔드 아키텍처, 인프라 프로젝트를 한 곳에서 봅니다.</h1>
          <p className="hero-description">
            서로 다른 Git 프로젝트를 하나로 합치지 않고, 각 레포의 문서와 릴리즈를 공개 카탈로그로 연결하는
            포트폴리오 허브입니다.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="primary-link">
              프로젝트 보기
            </a>
            <a href="https://github.com/MIMminE" className="secondary-link" target="_blank" rel="noreferrer">
              GitHub 프로필
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Portfolio summary">
          <div>
            <strong>{projects.length}</strong>
            <span>linked projects</span>
          </div>
          <div>
            <strong>{portfolioReadyCount}</strong>
            <span>portfolio ready</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>focus areas</span>
          </div>
          <div>
            <strong>{syncedAt ? formatDate(syncedAt) : "manual"}</strong>
            <span>last GitHub sync</span>
          </div>
        </div>
      </section>

      <section className="intro-grid" aria-label="Hub strategy">
        <article>
          <h2>허브의 역할</h2>
          <p>
            이 사이트는 프로젝트 소스코드를 복사하지 않습니다. 각 GitHub 레포의 README, 제품 문서, 릴리즈,
            화면 캡처를 연결해 면접관이 빠르게 맥락을 잡도록 돕습니다.
          </p>
        </article>
        <article>
          <h2>동기화 방식</h2>
          <p>
            소개 문구와 강점은 수동으로 큐레이션하고, 최신 커밋과 릴리즈 상태는 GitHub API 기반
            `generated-status.json`으로 갱신합니다.
          </p>
        </article>
        <article>
          <h2>AWS 배포 방향</h2>
          <p>
            첫 배포는 정적 사이트만 S3와 CloudFront에 올립니다. 각 백엔드 프로젝트는 필요할 때만 별도 데모로
            확장합니다.
          </p>
        </article>
      </section>

      <section id="projects" className="projects-section">
        <div className="section-heading">
          <p className="eyebrow">Project Catalog</p>
          <h2>프로젝트 릴리즈 카탈로그</h2>
        </div>

        {categories.map((category) => {
          const categoryProjects = projects.filter((project) => project.category === category);

          return (
            <section className="category-section" key={category}>
              <div className="category-heading">
                <h3>{category}</h3>
                <p>{categoryDescriptions[category]}</p>
              </div>
              <div className="project-grid">
                {categoryProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    status={statusByProject.get(project.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
