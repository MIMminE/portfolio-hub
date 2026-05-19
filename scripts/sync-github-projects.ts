import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { projects } from "../src/data/projects";
import type { GeneratedProjectStatus } from "../src/types/project";

interface GitHubRepoResponse {
  html_url: string;
  description: string | null;
  default_branch: string;
  pushed_at: string | null;
  updated_at: string | null;
  open_issues_count: number;
  stargazers_count: number;
  forks_count: number;
}

interface GitHubCommitResponse {
  sha: string;
  commit: {
    message: string;
  };
}

interface GitHubReleaseResponse {
  tag_name: string;
  html_url: string;
  name: string | null;
}

const outputPath = resolve("src/data/generated-status.json");
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

async function syncProject(project: (typeof projects)[number]): Promise<GeneratedProjectStatus> {
  const syncedAt = new Date().toISOString();

  try {
    const repo = await requestJson<GitHubRepoResponse>(`https://api.github.com/repos/${project.repo}`);
    const commits = await requestJson<GitHubCommitResponse[]>(
      `https://api.github.com/repos/${project.repo}/commits?per_page=1`
    );

    let latestRelease: GitHubReleaseResponse | null = null;
    try {
      latestRelease = await requestJson<GitHubReleaseResponse>(
        `https://api.github.com/repos/${project.repo}/releases/latest`
      );
    } catch {
      latestRelease = null;
    }

    const latestCommit = commits[0];

    return {
      id: project.id,
      repo: project.repo,
      htmlUrl: repo.html_url,
      description: repo.description,
      defaultBranch: repo.default_branch,
      pushedAt: repo.pushed_at,
      updatedAt: repo.updated_at,
      latestCommitSha: latestCommit?.sha ?? null,
      latestCommitMessage: latestCommit?.commit.message?.split("\n")[0] ?? null,
      latestReleaseTag: latestRelease?.tag_name ?? null,
      latestReleaseUrl: latestRelease?.html_url ?? null,
      latestReleaseName: latestRelease?.name ?? null,
      openIssues: repo.open_issues_count,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      syncedAt
    };
  } catch (error) {
    return {
      id: project.id,
      repo: project.repo,
      htmlUrl: `https://github.com/${project.repo}`,
      description: null,
      defaultBranch: "main",
      pushedAt: null,
      updatedAt: null,
      latestCommitSha: null,
      latestCommitMessage: null,
      latestReleaseTag: null,
      latestReleaseUrl: null,
      latestReleaseName: null,
      openIssues: 0,
      stars: 0,
      forks: 0,
      syncedAt,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

const statuses = await Promise.all(projects.map(syncProject));

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(`${outputPath}.tmp`, `${JSON.stringify(statuses, null, 2)}\n`);
await rename(`${outputPath}.tmp`, outputPath);

const okCount = statuses.filter((status) => !status.error).length;
const errorCount = statuses.length - okCount;

console.log(`Synced ${okCount}/${statuses.length} projects`);
if (errorCount > 0) {
  console.log(`Failed ${errorCount} projects. Check generated-status.json for details.`);
}
