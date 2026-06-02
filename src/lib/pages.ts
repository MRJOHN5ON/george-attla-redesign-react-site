import { readFile } from "node:fs/promises";
import path from "node:path";
import manifest from "@/content/manifest.json";

export interface PageData {
  path: string;
  sourceUrl: string;
  title: string;
  contentHtml: string;
}

export function getAllPagePaths(): string[] {
  return manifest.paths.filter((p) => p !== "/");
}

export function pathToSlug(pagePath: string): string[] {
  return pagePath.replace(/^\//, "").split("/").filter(Boolean);
}

export async function getPageBySlug(slug: string[]): Promise<PageData | null> {
  const pagePath = "/" + slug.join("/");
  const entry = manifest.pages[pagePath as keyof typeof manifest.pages];
  if (!entry || typeof entry !== "object" || !("file" in entry)) return null;

  const filePath = path.join(
    process.cwd(),
    "src/content/pages",
    `${entry.file}.json`
  );
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as PageData;
}
