import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import generatedStatuses from "./data/generated-status.json";
import generatedProjects from "./data/generated-projects.json";
import { projects } from "./data/projects";
import { loadPortfolioFeed } from "./data/loadPortfolioFeed";
import { ProjectCard } from "./components/ProjectCard";
import type { GeneratedProjectStatus, Project, ProjectCategory } from "./types/project";

const statuses = generatedStatuses as GeneratedProjectStatus[];
const syncedProjects = generatedProjects as Project[];

const fallbackProjects = syncedProjects.length > 0 ? syncedProjects : projects;

const categoryDescriptions: Record<ProjectCategory, string> = {
  "실무 도메인형": "운영 조직, 업무 흐름, 화면 사용성을 함께 설계한 프로젝트",
  "백엔드 아키텍처형": "서비스 신뢰성, 이벤트 흐름, 배포 구조를 다룬 프로젝트",
  "성능/동시성 실험형": "동시성 문제를 실험과 결과로 검증한 프로젝트"
};

export function App() {
  const [displayProjects, setDisplayProjects] = useState<Project[]>(fallbackProjects);
  const [feedError, setFeedError] = useState<string | null>(null);
  const statusByProject = new Map(statuses.map((status) => [status.id, status]));
  const categories = useMemo(
    () => Array.from(new Set(displayProjects.map((project) => project.category))) as ProjectCategory[],
    [displayProjects]
  );
  const selectedProjectId = new URLSearchParams(window.location.search).get("project");
  const selectedProject = displayProjects.find((project) => project.id === selectedProjectId);

  useEffect(() => {
    let ignore = false;

    loadPortfolioFeed()
      .then((feedProjects) => {
        if (!ignore && feedProjects.length > 0) {
          setDisplayProjects(feedProjects);
          setFeedError(null);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setFeedError(error instanceof Error ? error.message : "Portfolio feed load failed");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (selectedProject) {
    return <ProjectArticle project={selectedProject} status={statusByProject.get(selectedProject.id)} />;
  }

  return (
    <main className="app-shell">
      <FloatingTools />

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

      <section id="projects" className="projects-section">
        {feedError ? (
          <p className="feed-warning">포트폴리오 패키지를 불러오지 못해 빌드 시점 데이터를 표시합니다.</p>
        ) : null}

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

function ProjectArticle({ project, status }: { project: Project; status?: GeneratedProjectStatus }) {
  const updatedAt = status?.pushedAt ?? project.syncedFromManifestAt;
  const tocHeadings = useMemo(() => extractTocHeadings(project.entryDocumentMarkdown), [project.entryDocumentMarkdown]);
  const [activeHeadingId, setActiveHeadingId] = useState(tocHeadings[0]?.id ?? "");
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

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(".markdown-card h1, .markdown-card h2, .markdown-card h3")
    );

    headingElements.forEach((element, index) => {
      const heading = tocHeadings[index];

      if (heading) {
        element.id = heading.id;
      }
    });

    setActiveHeadingId(tocHeadings[0]?.id ?? "");
  }, [tocHeadings]);

  useEffect(() => {
    if (tocHeadings.length === 0) {
      return;
    }

    const headingElements = tocHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          setActiveHeadingId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 1]
      }
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [tocHeadings]);

  const moveToHeading = (id: string) => {
    setActiveHeadingId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

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
          <p className="article-summary-text">{project.summary}</p>
          <dl className="article-meta-inline">
            <div>
              <dt>상태</dt>
              <dd>{project.status}</dd>
            </div>
            <div>
              <dt>최근 업데이트</dt>
              <dd>{updatedAt ? formatDate(updatedAt) : "not synced"}</dd>
            </div>
            <div>
              <dt>문서</dt>
              <dd>{project.entryDocumentPath}</dd>
            </div>
          </dl>
        </header>

        <div className="article-content-layout">
          <section className="markdown-card">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.entryDocumentMarkdown}</ReactMarkdown>
          </section>

          <aside className="article-sidebar" aria-label="Project article sidebar">
            <section className="article-sidebar-card">
              <DeveloperProfilePanel />
            </section>
            <section className="article-sidebar-card sidebar-meta-card" aria-label="Project metadata">
              <div>
                <h2>기술 스택</h2>
                <div className="sidebar-chip-list">
                  {project.stacks.map((stack) => (
                    <span key={stack}>{stack}</span>
                  ))}
                </div>
              </div>
              <div>
                <h2>문서 링크</h2>
                <div className="sidebar-link-list">
                  {externalLinks.map((link) => (
                    <a
                      className={`link-${link.type}`}
                      href={link.url}
                      key={`${link.type}-${link.label}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </section>
            {tocHeadings.length > 0 ? (
              <section className="article-sidebar-card toc-sidebar-card">
                <h2>목차</h2>
                <FloatingTocPanel
                  activeHeadingId={activeHeadingId}
                  headings={tocHeadings}
                  onSelect={moveToHeading}
                />
              </section>
            ) : null}
          </aside>
        </div>
      </article>
    </main>
  );
}

function FloatingTools({
  toc
}: {
  toc?: {
    activeHeadingId: string;
    headings: TocHeading[];
    onSelect: (id: string) => void;
  };
}) {
  const [activeTool, setActiveTool] = useState<"profile" | "toc" | null>(null);

  useEffect(() => {
    if (activeTool === "toc" && !toc) {
      setActiveTool(null);
    }
  }, [activeTool, toc]);

  const toggleTool = (tool: "profile" | "toc") => {
    setActiveTool((currentTool) => (currentTool === tool ? null : tool));
  };

  return (
    <aside className={`floating-tools ${activeTool ? "is-open" : ""}`} aria-label="Portfolio reading tools">
      <div className="floating-tool-bar" role="group" aria-label="Reading tools">
        <button
          aria-expanded={activeTool === "profile"}
          className={activeTool === "profile" ? "is-active" : ""}
          onClick={() => toggleTool("profile")}
          type="button"
        >
          Profile
        </button>
        {toc ? (
          <button
            aria-expanded={activeTool === "toc"}
            className={activeTool === "toc" ? "is-active" : ""}
            onClick={() => toggleTool("toc")}
            type="button"
          >
            목차
          </button>
        ) : null}
      </div>
      {activeTool ? (
        <div className="floating-tool-panel">
          {activeTool === "profile" ? <DeveloperProfilePanel /> : null}
          {activeTool === "toc" && toc ? (
            <FloatingTocPanel
              activeHeadingId={toc.activeHeadingId}
              headings={toc.headings}
              onSelect={toc.onSelect}
            />
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}

function FloatingTocPanel({
  activeHeadingId,
  headings,
  onSelect
}: {
  activeHeadingId: string;
  headings: TocHeading[];
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="floating-toc-panel" aria-label="Article table of contents">
      {headings.map((heading) => (
        <a
          className={`toc-link toc-level-${heading.level} ${
            activeHeadingId === heading.id ? "toc-link-active" : ""
          }`}
          href={`#${heading.id}`}
          key={heading.id}
          onClick={(event) => {
            event.preventDefault();
            onSelect(heading.id);
          }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}

function DeveloperProfilePanel() {
  return (
    <div className="profile-panel">
      <div>
        <p className="profile-kicker">Developer</p>
        <h2>서동원</h2>
        <p>Backend / Full-stack Developer</p>
      </div>
      <p>
        운영 도메인, 백오피스, 커머스, 물류 WMS 프로젝트를 중심으로 실무 문제를 제품과 시스템으로
        정리합니다.
      </p>
      <ul>
        <li>Java/Kotlin Spring Boot</li>
        <li>React, TypeScript</li>
        <li>PostgreSQL, Redis, Docker</li>
        <li>AWS, GitHub Actions</li>
      </ul>
      <a href="https://github.com/MIMminE" target="_blank" rel="noreferrer">
        GitHub 보기
      </a>
    </div>
  );
}

interface TocHeading {
  id: string;
  level: 1 | 2 | 3;
  text: string;
}

function extractTocHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();
  let inCodeBlock = false;

  markdown.split("\n").forEach((line) => {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      return;
    }

    const match = /^(#{1,3})\s+(.+)$/.exec(line);

    if (!match) {
      return;
    }

    const level = match[1].length as 1 | 2 | 3;
    const text = cleanupHeadingText(match[2]);
    const baseId = slugifyHeading(text);
    const count = seen.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    seen.set(baseId, count + 1);

    headings.push({ id, level, text });
  });

  return headings;
}

function cleanupHeadingText(value: string) {
  return value
    .replace(/#+$/, "")
    .replace(/\*\*|__|`/g, "")
    .trim();
}

function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug || "section";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
