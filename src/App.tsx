import { isValidElement, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import generatedStatuses from "./data/generated-status.json";
import { loadPortfolioFeed } from "./data/loadPortfolioFeed";
import { ProjectCard } from "./components/ProjectCard";
import type { GeneratedProjectStatus, Project } from "./types/project";

const statuses = generatedStatuses as GeneratedProjectStatus[];

const hiddenProjectIds = new Set(["settlement-admin-api", "order-service-iac-cicd"]);
const featuredProjectOrder = [
  "devpilot",
  "warehouse-ops-suite",
  "maternity-care-commerce",
  "stock-lock-benchmark",
  "kotlin-commerce-core"
];

const projectOrderById = new Map(featuredProjectOrder.map((id, index) => [id, index]));

const curateProjects = (projectList: Project[]) => (
  projectList
    .filter((project) => !hiddenProjectIds.has(project.id))
    .sort((a, b) => (
      (projectOrderById.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (projectOrderById.get(b.id) ?? Number.MAX_SAFE_INTEGER)
    ))
);

const markdownComponents: Components = {
  img({ alt, src }) {
    return (
      <figure className="markdown-figure">
        <img src={src ?? ""} alt={alt ?? ""} />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  },
  pre({ children }) {
    const child = isValidElement<{ className?: string; children?: unknown }>(children) ? children : null;
    const className = child?.props.className ?? "";

    if (className.includes("language-mermaid")) {
      return <MermaidDiagram source={reactNodeToText(child?.props.children)} />;
    }

    return <pre>{children}</pre>;
  }
};

export function App() {
  const [displayProjects, setDisplayProjects] = useState<Project[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const statusByProject = new Map(statuses.map((status) => [status.id, status]));
  const selectedProjectId = new URLSearchParams(window.location.search).get("project");
  const selectedProject = displayProjects.find((project) => project.id === selectedProjectId);

  useEffect(() => {
    let ignore = false;

    loadPortfolioFeed()
      .then((feedProjects) => {
        if (!ignore && feedProjects.length > 0) {
          setDisplayProjects(curateProjects(feedProjects));
          setFeedError(null);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setFeedError(error instanceof Error ? error.message : "Portfolio feed load failed");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsFeedLoading(false);
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
          <p className="feed-warning">S3 포트폴리오 피드를 불러오지 못했습니다.</p>
        ) : null}

        <section className="home-overview" aria-label="Portfolio hub overview">
          <div className="hub-flow-card">
            <p className="eyebrow">Engineering Portfolio</p>
            <h1>실무 프로젝트를 글처럼 읽을 수 있게 정리했습니다</h1>
            <p>
              각 게시물은 실제 프로젝트의 화면, 기능 흐름, 설계 문서를 함께 묶어
              구현 결과와 문제 해결 방식을 한 번에 볼 수 있도록 구성했습니다.
            </p>
            <div className="home-reading-guide" aria-label="Portfolio reading guide">
              <div>
                <strong>1. 프로젝트 선택</strong>
                <span>관심 있는 시스템을 고르면 상세 게시물로 이동합니다.</span>
              </div>
              <div>
                <strong>2. 화면과 흐름 확인</strong>
                <span>관리자 화면, 기능 설명, 설계 의도를 함께 읽습니다.</span>
              </div>
              <div>
                <strong>3. 문서와 릴리즈 확인</strong>
                <span>필요한 경우 설계 문서와 다운로드 가능한 릴리즈를 함께 제공합니다.</span>
              </div>
            </div>
            <p className="hub-sync-note">
              프로젝트별 <code>manifest</code>, Markdown, 이미지, 릴리즈 파일은 S3 패키지 구조로 동기화됩니다.
            </p>
          </div>

          <DeveloperProfileSummary />
        </section>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2>프로젝트</h2>
          </div>
        </div>

        <div className="project-grid">
          {displayProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
        {isFeedLoading ? <p className="feed-warning">S3 포트폴리오 피드를 불러오는 중입니다.</p> : null}
        {!isFeedLoading && !feedError && displayProjects.length === 0 ? (
          <p className="feed-warning">표시할 S3 포트폴리오 패키지가 없습니다.</p>
        ) : null}
      </section>

    </main>
  );
}

function DeveloperProfileSummary() {
  return (
    <aside className="home-profile-card" aria-label="Developer profile summary">
      <p className="profile-kicker">Developer</p>
      <h2>서동원</h2>
      <p className="home-profile-role">Backend / Full-stack Developer</p>
      <p>
        물류 WMS, 백오피스, 커머스 운영 시스템처럼 실제 업무 흐름이 복잡한 도메인을
        API, 데이터 모델, 관리자 화면으로 정리하는 데 집중합니다.
      </p>
      <a href="https://github.com/MIMminE" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </aside>
  );
}

function ProjectArticle({ project, status }: { project: Project; status?: GeneratedProjectStatus }) {
  const updatedAt = status?.pushedAt ?? project.syncedFromManifestAt;
  const manifestReleaseLink = project.links.find((link) => link.type === "release");
  const releaseUrl = status?.latestReleaseUrl ?? manifestReleaseLink?.url;
  const releaseLabel = status?.latestReleaseName ?? status?.latestReleaseTag ?? manifestReleaseLink?.label;
  const articleMarkdown = useMemo(
    () => removeDuplicateTitleHeading(project.entryDocumentMarkdown, project.title),
    [project.entryDocumentMarkdown, project.title]
  );
  const tocHeadings = useMemo(() => extractTocHeadings(articleMarkdown), [articleMarkdown]);
  const [activeHeadingId, setActiveHeadingId] = useState(tocHeadings[0]?.id ?? "");

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
        <div>
          <a href="/" target="_self">
            메인
          </a>
          <a href="https://github.com/MIMminE" target="_blank" rel="noreferrer">
            Profile
          </a>
          <a href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>

      <article className="project-article">
        <header className="article-header">
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
          {project.coverImage ? (
            <figure className="article-cover-hero">
              <div className="article-cover-backdrop" style={{ backgroundImage: `url(${project.coverImage})` }} />
              <img src={project.coverImage} alt={project.coverAlt ?? `${project.title} 대표 화면`} />
              <figcaption>{project.coverAlt ?? `${project.title} 대표 화면`}</figcaption>
            </figure>
          ) : null}
        </header>

        <div className="article-content-layout">
          <section className="markdown-card">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {articleMarkdown}
            </ReactMarkdown>
          </section>

          <aside className="article-sidebar" aria-label="Project article sidebar">
            <section className="article-sidebar-card sidebar-meta-card" aria-label="Project metadata">
              <div>
                <h2>기술 스택</h2>
                <div className="sidebar-chip-list">
                  {project.stacks.map((stack) => (
                    <span key={stack}>{stack}</span>
                  ))}
                </div>
              </div>
            </section>
            {releaseUrl ? (
              <section className="article-sidebar-card release-card" aria-label="Project release download">
                <h2>릴리즈</h2>
                <p>{releaseLabel ?? "Latest Release"}</p>
                <a href={releaseUrl} target="_blank" rel="noreferrer">
                  릴리즈 다운로드
                </a>
              </section>
            ) : null}
            {tocHeadings.length > 0 ? (
              <section className="article-sidebar-card toc-sidebar-card">
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

function MermaidDiagram({ source }: { source: string }) {
  const diagram = parseMermaidFlowchart(source);

  if (!diagram) {
    return (
      <pre>
        <code className="language-mermaid">{source}</code>
      </pre>
    );
  }

  const nodeWidth = 132;
  const nodeHeight = 54;
  const gap = 46;
  const paddingX = 28;
  const paddingY = 28;
  const width = paddingX * 2 + diagram.nodes.length * nodeWidth + Math.max(diagram.nodes.length - 1, 0) * gap;
  const height = 128;
  const y = paddingY + 12;
  const positions = new Map(
    diagram.nodes.map((node, index) => [
      node.id,
      {
        x: paddingX + index * (nodeWidth + gap),
        y
      }
    ])
  );

  return (
    <figure className="mermaid-diagram" aria-label="Architecture flow diagram">
      <svg role="img" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker id="arrowhead" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0,0 L8,4 L0,8 Z" />
          </marker>
        </defs>
        {diagram.edges.map((edge) => {
          const from = positions.get(edge.from);
          const to = positions.get(edge.to);

          if (!from || !to) {
            return null;
          }

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              markerEnd="url(#arrowhead)"
              x1={from.x + nodeWidth}
              x2={to.x}
              y1={from.y + nodeHeight / 2}
              y2={to.y + nodeHeight / 2}
            />
          );
        })}
        {diagram.nodes.map((node) => {
          const position = positions.get(node.id);

          if (!position) {
            return null;
          }

          return (
            <g key={node.id}>
              <rect height={nodeHeight} rx="8" width={nodeWidth} x={position.x} y={position.y} />
              <text x={position.x + nodeWidth / 2} y={position.y + nodeHeight / 2}>
                {splitDiagramLabel(node.label).map((line, index, lines) => (
                  <tspan dy={index === 0 ? `${-(lines.length - 1) * 8}px` : "16px"} key={line} x={position.x + nodeWidth / 2}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
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

interface DiagramNode {
  id: string;
  label: string;
}

interface DiagramEdge {
  from: string;
  to: string;
}

function parseMermaidFlowchart(source: string): { nodes: DiagramNode[]; edges: DiagramEdge[] } | null {
  const lines = source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("%%"));

  if (!lines[0]?.startsWith("flowchart")) {
    return null;
  }

  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  const edgePattern =
    /^([A-Za-z0-9_]+)(?:\["([^"]+)"\]|\[([^\]]+)\])?\s*-->\s*([A-Za-z0-9_]+)(?:\["([^"]+)"\]|\[([^\]]+)\])?$/;

  for (const line of lines.slice(1)) {
    const match = edgePattern.exec(line);

    if (!match) {
      return null;
    }

    const from = match[1];
    const fromLabel = match[2] ?? match[3] ?? from;
    const to = match[4];
    const toLabel = match[5] ?? match[6] ?? to;

    if (!nodes.has(from)) {
      nodes.set(from, { id: from, label: cleanupDiagramLabel(fromLabel) });
    }

    if (!nodes.has(to)) {
      nodes.set(to, { id: to, label: cleanupDiagramLabel(toLabel) });
    }

    edges.push({ from, to });
  }

  return {
    nodes: Array.from(nodes.values()),
    edges
  };
}

function cleanupDiagramLabel(label: string) {
  return label.replace(/<br\s*\/?>/gi, "\n").replace(/["']/g, "").trim();
}

function splitDiagramLabel(label: string) {
  return label
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function reactNodeToText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(reactNodeToText).join("");
  }

  return "";
}

interface TocHeading {
  id: string;
  level: 1 | 2 | 3;
  text: string;
}

function removeDuplicateTitleHeading(markdown: string, title: string) {
  const normalizedTitle = normalizeHeadingText(title);
  const lines = markdown.split("\n");
  const firstContentLineIndex = lines.findIndex((line) => line.trim().length > 0);

  if (firstContentLineIndex === -1) {
    return markdown;
  }

  const firstContentLine = lines[firstContentLineIndex];
  const match = /^#\s+(.+)$/.exec(firstContentLine.trim());

  if (!match) {
    return markdown;
  }

  const normalizedHeading = normalizeHeadingText(match[1]);

  if (normalizedHeading !== normalizedTitle && !normalizedHeading.startsWith(`${normalizedTitle} `)) {
    return markdown;
  }

  const nextLineIndex = firstContentLineIndex + 1;

  if (lines[nextLineIndex]?.trim() === "") {
    lines.splice(firstContentLineIndex, 2);
  } else {
    lines.splice(firstContentLineIndex, 1);
  }

  return lines.join("\n").trimStart();
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

function normalizeHeadingText(value: string) {
  return cleanupHeadingText(value).toLowerCase().replace(/\s+/g, " ");
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
