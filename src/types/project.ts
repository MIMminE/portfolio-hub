export type ProjectCategory =
  | "실무 도메인형"
  | "백엔드 아키텍처형"
  | "성능/동시성 실험형";

export type ProjectStatus = "Portfolio Ready" | "In Progress" | "Needs Cleanup";

export interface ProjectLink {
  label: string;
  url: string;
  type: "github" | "docs" | "release" | "manual" | "demo";
}

export interface ProjectLocalDemo {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  status: ProjectStatus;
  repo: string;
  summary: string;
  stacks: string[];
  coverImage?: string;
  coverAlt?: string;
  entryDocumentPath: string;
  entryDocumentUrl: string;
  entryDocumentMarkdown: string;
  syncedFromManifestAt?: string;
  localDemo?: ProjectLocalDemo;
  links: ProjectLink[];
}

export interface GeneratedProjectStatus {
  id: string;
  repo: string;
  htmlUrl: string;
  description: string | null;
  defaultBranch: string;
  pushedAt: string | null;
  updatedAt: string | null;
  latestCommitSha: string | null;
  latestCommitMessage: string | null;
  latestReleaseTag: string | null;
  latestReleaseUrl: string | null;
  latestReleaseName: string | null;
  openIssues: number;
  stars: number;
  forks: number;
  syncedAt: string;
  error?: string;
}
