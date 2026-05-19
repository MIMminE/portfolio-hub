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
          <h1>프로젝트별 문서와 릴리즈를 한 화면에서 탐색합니다.</h1>
          <p className="hero-description">
            서로 다른 Git 레포는 그대로 유지하고, 공개 문서와 최신 상태만 허브에서 연결합니다.
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
            <span>Projects</span>
          </div>
          <div>
            <strong>{portfolioReadyCount}</strong>
            <span>Ready</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>Areas</span>
          </div>
          <div>
            <strong>{syncedAt ? formatDate(syncedAt) : "manual"}</strong>
            <span>Synced</span>
          </div>
        </div>
      </section>

      <section className="sync-strip" aria-label="Hub strategy">
        <span>Manual curation</span>
        <span>GitHub API sync</span>
        <span>S3 + CloudFront ready</span>
      </section>

      <section id="projects" className="projects-section">
        <div className="section-heading">
          <h2>프로젝트 카탈로그</h2>
          <p>카드는 요약 중심으로 보고, 필요한 프로젝트만 상세를 펼쳐 확인합니다.</p>
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
