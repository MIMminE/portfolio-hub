import type { PortfolioFeedIndex, PortfolioPackageManifest, Project, ProjectLink } from "../types/project";

const defaultFeedUrl = "/portfolio-feed/index.json";

export async function loadPortfolioFeed(feedUrl = import.meta.env.VITE_PORTFOLIO_FEED_URL ?? defaultFeedUrl) {
  const indexUrl = new URL(feedUrl, window.location.origin);
  const index = await requestJson<PortfolioFeedIndex>(indexUrl);

  return Promise.all(
    index.projects.map(async (entry) => {
      const manifestUrl = new URL(entry.manifestUrl, indexUrl);
      const manifest = await requestJson<PortfolioPackageManifest>(manifestUrl);
      const articleUrl = new URL(manifest.article, manifestUrl);
      const articleMarkdown = await requestText(articleUrl);

      return manifestToProject(manifest, manifestUrl, articleUrl, articleMarkdown);
    })
  );
}

async function requestJson<T>(url: URL): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url.toString()}`);
  }

  return (await response.json()) as T;
}

async function requestText(url: URL) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url.toString()}`);
  }

  return response.text();
}

function manifestToProject(
  manifest: PortfolioPackageManifest,
  manifestUrl: URL,
  articleUrl: URL,
  articleMarkdown: string
): Project {
  const repoName = manifest.repoUrl.replace(/^https:\/\/github\.com\//, "");
  const links: ProjectLink[] = [
    { label: "GitHub", url: manifest.repoUrl, type: "github" },
    ...(manifest.links ?? [])
  ];

  return {
    id: manifest.id,
    title: manifest.title,
    subtitle: manifest.subtitle,
    category: manifest.category,
    status: manifest.status,
    repo: repoName,
    summary: manifest.summary,
    stacks: manifest.stacks,
    coverImage: manifest.coverImage ? new URL(manifest.coverImage, manifestUrl).toString() : undefined,
    coverAlt: manifest.coverAlt,
    entryDocumentPath: manifest.article,
    entryDocumentUrl: articleUrl.toString(),
    entryDocumentMarkdown: rewriteRelativeMarkdownAssets(articleMarkdown, articleUrl),
    syncedFromManifestAt: manifest.updatedAt,
    localDemo: manifest.localDemo,
    links
  };
}

function rewriteRelativeMarkdownAssets(markdown: string, articleUrl: URL) {
  const rewrittenImages = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, href) => {
    const cleanHref = String(href).trim();

    if (isExternalUrl(cleanHref)) {
      return match;
    }

    return `![${alt}](${new URL(cleanHref, articleUrl).toString()})`;
  });

  return rewrittenImages.replace(/(^|[^!])\[([^\]]+)\]\(([^)]+)\)/g, (match, prefix, label, href) => {
    const cleanHref = String(href).trim();

    if (isExternalUrl(cleanHref)) {
      return match;
    }

    return `${prefix}[${label}](${new URL(cleanHref, articleUrl).toString()})`;
  });
}

function isExternalUrl(url: string) {
  return /^(https?:|mailto:|tel:|#)/i.test(url);
}
