import { mkdir, rename, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { PortfolioFeedIndex } from "../src/types/project";

interface KnownProjectsConfig {
  version: string;
  projects: KnownProject[];
}

interface KnownProject {
  id: string;
  packagePath: string;
  repo?: string;
}

const configPath = resolve("config/portfolio-feed-projects.json");
const outputPath = resolve(process.env.PORTFOLIO_FEED_INDEX_OUTPUT ?? "public/portfolio-feed/index.json");
const feedBaseUrl = normalizeFeedBaseUrl(process.env.PORTFOLIO_FEED_BASE_URL);
const config = JSON.parse(await readFile(configPath, "utf8")) as KnownProjectsConfig;

const index: PortfolioFeedIndex = {
  version: config.version,
  generatedAt: new Date().toISOString(),
  projects: config.projects.map((project) => ({
    id: project.id,
    manifestUrl: `${feedBaseUrl}${project.packagePath}`
  }))
};

await writeJson(outputPath, index);

console.log(`Built portfolio feed index: ${index.projects.length} projects -> ${outputPath}`);

function normalizeFeedBaseUrl(value: string | undefined) {
  if (!value) {
    return "./";
  }

  return value.endsWith("/") ? value : `${value}/`;
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(`${path}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  await rename(`${path}.tmp`, path);
}
