import type { GeneratedProjectStatus, Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  status?: GeneratedProjectStatus;
}

export function ProjectCard({ project, status }: ProjectCardProps) {
  const latestReleaseUrl = status?.latestReleaseUrl;
  const releaseLink = latestReleaseUrl
    ? [{ label: status.latestReleaseTag ?? "Latest Release", url: latestReleaseUrl, type: "release" as const }]
    : [];
  const links = [...project.links, ...releaseLink];
  const articleUrl = `/?project=${encodeURIComponent(project.id)}`;
  const openArticle = () => {
    window.location.href = articleUrl;
  };

  return (
    <article
      className="project-card"
      id={project.id}
      role="link"
      tabIndex={0}
      onClick={openArticle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openArticle();
        }
      }}
    >
      {project.coverImage ? (
        <img className="project-cover" src={project.coverImage} alt={project.coverAlt ?? `${project.title} preview`} />
      ) : (
        <div className="project-cover project-cover-empty">{project.title}</div>
      )}

      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span className={`status-pill ${statusClass(project.status)}`}>{project.status}</span>
        </div>
        <div className="project-title-row">
          <div>
            <p className="project-subtitle">{project.subtitle}</p>
            <h4>{project.title}</h4>
          </div>
        </div>

        <p className="project-description">{project.summary}</p>

        <dl className="project-facts">
          <div>
            <dt>최근 작업</dt>
            <dd>{status?.latestReleaseTag ?? status?.latestCommitMessage ?? "sync pending"}</dd>
          </div>
          <div>
            <dt>갱신일</dt>
            <dd>{status?.pushedAt ? formatDate(status.pushedAt) : "not synced"}</dd>
          </div>
        </dl>

        <div className="stack-list" aria-label={`${project.title} tech stack`}>
          {project.stacks.slice(0, 6).map((stack) => (
            <span key={stack}>{stack}</span>
          ))}
        </div>

        <div className="document-box">
          <strong>상세 글</strong>
          <p>{project.entryDocumentPath}</p>
        </div>

        {project.localDemo ? (
          <p className="local-demo-note">
            화면/콘솔: <span>{project.localDemo.label}</span>
          </p>
        ) : null}

        <div className="link-row">
          {links.map((link) => (
            <a
              className={`link-${link.type}`}
              key={`${link.type}-${link.label}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function statusClass(status: Project["status"]) {
  if (status === "Portfolio Ready") {
    return "status-ready";
  }

  if (status === "In Progress") {
    return "status-progress";
  }

  return "status-cleanup";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
