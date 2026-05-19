import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Buffer } from "node:buffer";
import { projects } from "../src/data/projects";
import type { Project, ProjectCategory, ProjectLink, ProjectStatus } from "../src/types/project";

interface GitHubRepoResponse {
  default_branch: string;
}

interface GitHubContentResponse {
  content: string;
  encoding: string;
}

interface ManifestDocument {
  label: string;
  path: string;
  type?: ProjectLink["type"];
}

interface ManifestImage {
  path: string;
  alt?: string;
}

interface ProjectManifest {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  stacks: string[];
  highlights: string[];
  interviewPoints: string[];
  coverImage?: ManifestImage;
  documents?: ManifestDocument[];
  localDemo?: {
    label: string;
    url: string;
  };
}

const outputPath = resolve("src/data/generated-projects.json");
const token = process.env.GITHUB_TOKEN;

async function requestJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

function toBlobUrl(repo: string, branch: string, path: string) {
  return `https://github.com/${repo}/blob/${branch}/${path}`;
}

function toRawUrl(repo: string, branch: string, path: string) {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
}

async function readManifest(repoName: string): Promise<ProjectManifest | null> {
  const repo = await requestJson<GitHubRepoResponse>(`https://api.github.com/repos/${repoName}`);
  const branch = repo.default_branch;
  const content = await requestJson<GitHubContentResponse>(
    `https://api.github.com/repos/${repoName}/contents/.portfolio/project.json?ref=${branch}`
  );

  if (content.encoding !== "base64") {
    throw new Error(`Unsupported content encoding: ${content.encoding}`);
  }

  const json = Buffer.from(content.content, "base64").toString("utf8");
  const manifest = JSON.parse(json) as ProjectManifest;

  return {
    ...manifest,
    coverImage: manifest.coverImage
      ? {
          ...manifest.coverImage,
          path: toRawUrl(repoName, branch, manifest.coverImage.path)
        }
      : undefined,
    documents: manifest.documents?.map((document) => ({
      ...document,
      path: toBlobUrl(repoName, branch, document.path)
    }))
  };
}

function manifestToProject(repoName: string, manifest: ProjectManifest): Project {
  const documentLinks: ProjectLink[] =
    manifest.documents?.map((document) => ({
      label: document.label,
      url: document.path,
      type: document.type ?? "docs"
    })) ?? [];

  return {
    id: manifest.id,
    title: manifest.title,
    subtitle: manifest.subtitle,
    category: manifest.category,
    status: manifest.status,
    repo: repoName,
    description: manifest.description,
    problem: manifest.problem,
    solution: manifest.solution,
    impact: manifest.impact,
    stacks: manifest.stacks,
    highlights: manifest.highlights,
    interviewPoints: manifest.interviewPoints,
    coverImage: manifest.coverImage?.path,
    coverAlt: manifest.coverImage?.alt,
    localDemo: manifest.localDemo,
    links: [
      { label: "GitHub", url: `https://github.com/${repoName}`, type: "github" },
      ...documentLinks
    ]
  };
}

const syncedProjects = await Promise.all(
  projects.map(async (project) => {
    try {
      const manifest = await readManifest(project.repo);
      return manifest ? manifestToProject(project.repo, manifest) : project;
    } catch (error) {
      console.log(
        `Failed to sync manifest for ${project.repo}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return project;
    }
  })
);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(`${outputPath}.tmp`, `${JSON.stringify(syncedProjects, null, 2)}\n`);
await rename(`${outputPath}.tmp`, outputPath);

console.log(`Synced ${syncedProjects.length}/${projects.length} project manifests`);
