import generatedStatuses from "./data/generated-status.json";
import generatedProjects from "./data/generated-projects.json";
import { projects } from "./data/projects";
import { ProjectCard } from "./components/ProjectCard";
import type { GeneratedProjectStatus, Project, ProjectCategory } from "./types/project";

const statuses = generatedStatuses as GeneratedProjectStatus[];
const syncedProjects = generatedProjects as Project[];

const displayProjects = syncedProjects.length > 0 ? syncedProjects : projects;
const categories = Array.from(new Set(displayProjects.map((project) => project.category))) as ProjectCategory[];

const categoryDescriptions: Record<ProjectCategory, string> = {
  "실무 도메인형": "실제 운영 조직과 도메인 흐름을 기준으로 설계한 프로젝트",
  "백엔드 아키텍처형": "분산 처리, 이벤트, 인프라, 배포 구조를 강조하는 프로젝트",
  "성능/동시성 실험형": "락, 처리량, 재시도 비용을 실험과 수치로 설명하는 프로젝트"
};

export function App() {
  const statusByProject = new Map(statuses.map((status) => [status.id, status]));
  const syncedAt = statuses[0]?.syncedAt;
  const portfolioReadyCount = displayProjects.filter((project) => project.status === "Portfolio Ready").length;
  const featuredProject = displayProjects.find((project) => project.id === "warehouse-ops-suite") ?? displayProjects[0];

  return (
    <main className="app-shell">
      <nav className="top-nav" aria-label="Portfolio navigation">
        <a className="brand-mark" href="#">
          Portfolio Hub
        </a>
        <div>
          <a href="#projects">Projects</a>
          <a href="https://github.com/MIMminE" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Backend Portfolio Hub</p>
          <h1>운영 도메인과 백엔드 설계를 케이스 스터디로 보여줍니다.</h1>
          <p className="hero-description">
            각 프로젝트는 독립 Git 레포로 유지하고, 허브는 화면 이미지, 문서, 최신 릴리즈 상태를 동기화해
            이력서용 공개 페이지로 정리합니다.
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
        {featuredProject ? (
          <a className="hero-preview" href={`#${featuredProject.id}`}>
            <img src={featuredProject.coverImage} alt={featuredProject.coverAlt ?? featuredProject.title} />
            <div>
              <span>Featured Case Study</span>
              <strong>{featuredProject.title}</strong>
              <p>{featuredProject.subtitle}</p>
            </div>
          </a>
        ) : null}
      </section>

      <section className="hero-panel" aria-label="Portfolio summary">
        <div>
          <strong>{displayProjects.length}</strong>
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
      </section>

      <section className="sync-strip" aria-label="Hub strategy">
        <span>Project manifest sync</span>
        <span>GitHub release status</span>
        <span>Screen-based case studies</span>
        <span>S3 + CloudFront ready</span>
      </section>

      {featuredProject ? (
        <section className="featured-section" aria-label="Featured project">
          <div className="featured-copy">
            <p className="eyebrow">Recommended First Read</p>
            <h2>{featuredProject.title}</h2>
            <p>{featuredProject.description}</p>
            <ul>
              {featuredProject.highlights.slice(0, 4).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div className="featured-links">
            {featuredProject.links.slice(0, 4).map((link) => (
              <a key={`${link.type}-${link.label}`} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section id="projects" className="projects-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project Catalog</p>
            <h2>프로젝트 카탈로그</h2>
          </div>
          <p>각 카드의 내용은 프로젝트 레포의 `.portfolio/project.json`에서 동기화됩니다.</p>
        </div>

        {categories.map((category) => {
          const categoryProjects = displayProjects.filter((project) => project.category === category);

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

      <section className="ops-note">
        <h2>운영 방식</h2>
        <p>
          허브는 각 프로젝트를 직접 포함하지 않고, GitHub API로 최신 커밋/릴리즈와 포트폴리오 manifest를
          읽습니다. 프로젝트를 업데이트하고 `.portfolio/project.json`을 함께 수정하면 허브의 설명, 문서 링크,
          대표 이미지가 다음 동기화 때 자동으로 갱신됩니다.
        </p>
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
