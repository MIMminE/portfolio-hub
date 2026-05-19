import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import generatedProjects from "../src/data/generated-projects.json";
import type { PortfolioFeedIndex, PortfolioPackageManifest, Project } from "../src/types/project";

const outputRoot = resolve("public/portfolio-feed");
const projects = generatedProjects as Project[];
const generatedAt = new Date().toISOString();

await mkdir(outputRoot, { recursive: true });

const index: PortfolioFeedIndex = {
  version: "1.0",
  generatedAt,
  projects: projects.map((project) => ({
    id: project.id,
    manifestUrl: `./${project.id}/manifest.json`
  }))
};

await writeJson(resolve(outputRoot, "index.json"), index);

await Promise.all(
  projects.map(async (project) => {
    const projectDir = resolve(outputRoot, project.id);
    await mkdir(projectDir, { recursive: true });

    const manifest: PortfolioPackageManifest = {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      status: project.status,
      summary: project.summary,
      stacks: project.stacks,
      repoUrl: `https://github.com/${project.repo}`,
      article: "./article.md",
      coverImage: project.coverImage,
      coverAlt: project.coverAlt,
      updatedAt: project.syncedFromManifestAt ?? generatedAt,
      localDemo: project.localDemo,
      links: project.links.filter((link) => link.type !== "github")
    };

    await writeJson(resolve(projectDir, "manifest.json"), manifest);
    await writeFileAtomic(resolve(projectDir, "article.md"), project.entryDocumentMarkdown);
  })
);

console.log(`Built local portfolio feed: ${projects.length} packages`);

async function writeJson(path: string, value: unknown) {
  await writeFileAtomic(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeFileAtomic(path: string, contents: string) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(`${path}.tmp`, contents);
  await rename(`${path}.tmp`, path);
}
