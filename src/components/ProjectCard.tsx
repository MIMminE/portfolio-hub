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

  return (
    <article className="project-card" id={project.id}>
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

        <p className="project-description">{project.description}</p>

        <dl className="project-facts">
          <div>
            <dt>Latest</dt>
            <dd>{status?.latestReleaseTag ?? status?.latestCommitMessage ?? "sync pending"}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{status?.pushedAt ? formatDate(status.pushedAt) : "not synced"}</dd>
          </div>
        </dl>

        <div className="stack-list" aria-label={`${project.title} tech stack`}>
          {project.stacks.slice(0, 6).map((stack) => (
            <span key={stack}>{stack}</span>
          ))}
        </div>

        <div className="impact-box">
          <strong>Portfolio Point</strong>
          <p>{project.impact}</p>
        </div>

        {project.localDemo ? (
          <p className="local-demo-note">
            Local demo: <span>{project.localDemo.label}</span>
          </p>
        ) : null}

        <details className="project-detail">
          <summary>핵심 설계 보기</summary>
          <div>
            <h5>문제</h5>
            <p>{project.problem}</p>
            <h5>해결</h5>
            <p>{project.solution}</p>
            <h5>면접 포인트</h5>
            <ul>
              {project.interviewPoints.slice(0, 3).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </details>

        <div className="link-row">
          <a className="link-article" href={articleUrl} target="_blank" rel="noreferrer">
            상세 글 보기
          </a>
          {links.map((link) => (
            <a className={`link-${link.type}`} key={`${link.type}-${link.label}`} href={link.url} target="_blank" rel="noreferrer">
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
