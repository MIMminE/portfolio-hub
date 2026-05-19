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
  "실무 도메인형": "운영 조직, 업무 흐름, 화면 사용성을 함께 설계한 프로젝트",
  "백엔드 아키텍처형": "서비스 신뢰성, 이벤트 흐름, 배포 구조를 다룬 프로젝트",
  "성능/동시성 실험형": "동시성 문제를 실험과 결과로 검증한 프로젝트"
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
          Engineering Portfolio
        </a>
        <div>
          <a href="#projects">프로젝트</a>
          <a href="https://github.com/MIMminE" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>

      <section className="page-intro">
        <div>
          <p className="eyebrow">Software Engineering Portfolio</p>
          <h1>실무 문제를 제품과 시스템으로 풀어낸 기록</h1>
        </div>
        <p>
          각 프로젝트의 화면, 설계 문서, 실행 단위를 함께 확인할 수 있도록 정리했습니다.
        </p>
      </section>

      <section className="hero-panel" aria-label="Portfolio summary">
        <div>
          <strong>{displayProjects.length}</strong>
          <span>프로젝트</span>
        </div>
        <div>
          <strong>{portfolioReadyCount}</strong>
          <span>정리 완료</span>
        </div>
        <div>
          <strong>{categories.length}</strong>
          <span>분야</span>
        </div>
        <div>
          <strong>{syncedAt ? formatDate(syncedAt) : "manual"}</strong>
          <span>최근 갱신</span>
        </div>
      </section>

      <section className="focus-strip" aria-label="Portfolio focus">
        <span>운영 도메인</span>
        <span>백엔드 설계</span>
        <span>관리자 화면</span>
        <span>성능 검증</span>
      </section>

      <section id="projects" className="projects-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2>프로젝트</h2>
          </div>
          <p>카드를 선택하면 기능 설명, 화면 캡처, 설계 문서를 하나의 글처럼 볼 수 있습니다.</p>
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

      <section className="closing-note">
        <h2>읽는 순서</h2>
        <p>
          먼저 실무 도메인형 프로젝트에서 화면과 업무 흐름을 확인하고, 이어서 백엔드 아키텍처형과
          성능 실험형 프로젝트를 보면 설계 범위를 자연스럽게 따라갈 수 있습니다.
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
          Engineering Portfolio
        </a>
        <div>
          <a href="/" target="_self">
            목록
          </a>
          <a href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>

      <article className="project-article">
        <header className="article-header">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </header>

        <section className="article-summary">
          <div>
            <span>상태</span>
            <strong>{project.status}</strong>
          </div>
          <div>
            <span>최근 업데이트</span>
            <strong>{status?.pushedAt ? formatDate(status.pushedAt) : "not synced"}</strong>
          </div>
          <div>
            <span>문서</span>
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
              <h2>문서 링크</h2>
              <a className="sidebar-link" href={project.entryDocumentUrl} target="_blank" rel="noreferrer">
                원문 보기
              </a>
              <a className="sidebar-link" href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer">
                레포지토리
              </a>
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
