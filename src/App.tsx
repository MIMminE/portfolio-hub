import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const selectedProjectId = new URLSearchParams(window.location.search).get("project");
  const selectedProject = displayProjects.find((project) => project.id === selectedProjectId);

  if (selectedProject) {
    return <ProjectArticle project={selectedProject} status={statusByProject.get(selectedProject.id)} />;
  }

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

      <section className="page-intro">
        <div>
          <p className="eyebrow">Project Document Hub</p>
          <h1>프로젝트 문서 인덱스</h1>
        </div>
        <p>
          독립 레포의 README와 docs를 동기화해 게시물처럼 보여줍니다.
        </p>
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
        <span>README/docs sync</span>
        <span>GitHub release status</span>
        <span>Screen captures</span>
        <span>Static deploy ready</span>
      </section>

      <section id="projects" className="projects-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project Catalog</p>
            <h2>프로젝트 카탈로그</h2>
          </div>
          <p>카드를 누르면 해당 레포의 대표 문서를 읽는 게시물 페이지로 이동합니다.</p>
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
          허브는 각 프로젝트를 직접 포함하지 않고 GitHub API로 최신 커밋, 릴리즈, 문서 manifest를 읽습니다.
          프로젝트 레포의 README나 docs 문서가 바뀌면 다음 동기화 때 이 게시물 본문도 함께 갱신됩니다.
        </p>
      </section>
    </main>
  );
}

function ProjectArticle({ project, status }: { project: Project; status?: GeneratedProjectStatus }) {
  const externalLinks = status?.latestReleaseUrl
    ? [
        ...project.links,
        {
          label: status.latestReleaseTag ?? "Latest Release",
          url: status.latestReleaseUrl,
          type: "release" as const
        }
      ]
    : project.links;

  return (
    <main className="article-shell">
      <nav className="top-nav article-nav" aria-label="Project article navigation">
        <a className="brand-mark" href="/">
          Portfolio Hub
        </a>
        <div>
          <a href="/" target="_self">
            Index
          </a>
          <a href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer">
            Repository
          </a>
        </div>
      </nav>

      <article className="project-article">
        <header className="article-header">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </header>

        {project.coverImage ? (
          <img className="article-cover" src={project.coverImage} alt={project.coverAlt ?? project.title} />
        ) : null}

        <section className="article-summary">
          <div>
            <span>Status</span>
            <strong>{project.status}</strong>
          </div>
          <div>
            <span>Updated</span>
            <strong>{status?.pushedAt ? formatDate(status.pushedAt) : "not synced"}</strong>
          </div>
          <div>
            <span>Document</span>
            <strong>{project.entryDocumentPath}</strong>
          </div>
        </section>

        <div className="article-layout">
          <aside className="article-sidebar" aria-label="Project metadata">
            <section>
              <h2>기술 스택</h2>
              <div className="stack-list article-stacks">
                {project.stacks.map((stack) => (
                  <span key={stack}>{stack}</span>
                ))}
              </div>
            </section>
            <section>
              <h2>동기화 기준</h2>
              <p>{project.entryDocumentPath}</p>
              <p>{project.syncedFromManifestAt ? formatDateTime(project.syncedFromManifestAt) : "local fallback"}</p>
            </section>
          </aside>

          <section className="markdown-card">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.entryDocumentMarkdown}</ReactMarkdown>
          </section>
        </div>

        <section className="article-links">
          {externalLinks.map((link) => (
            <a className={`link-${link.type}`} key={`${link.type}-${link.label}`} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </section>
      </article>
    </main>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
