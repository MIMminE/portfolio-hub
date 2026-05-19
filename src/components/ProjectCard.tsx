import type { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
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
        </div>
        <div className="project-title-row">
          <div>
            <p className="project-subtitle">{project.subtitle}</p>
            <h4>{project.title}</h4>
          </div>
        </div>

        <p className="project-description">{project.summary}</p>

        <div className="stack-list" aria-label={`${project.title} tech stack`}>
          {project.stacks.slice(0, 6).map((stack) => (
            <span key={stack}>{stack}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
