/**
 * Builds public/search-index.json from crawled page content.
 * Run: npm run build:search
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const root = process.cwd();
const manifest = JSON.parse(
  await readFile(path.join(root, "src/content/manifest.json"), "utf8")
);

function stripHtml(html) {
  const $ = cheerio.load(html);
  $("script, style").remove();
  return $.text().replace(/\s+/g, " ").trim();
}

const index = [];

for (const [pagePath, entry] of Object.entries(manifest.pages)) {
  if (pagePath === "/" || !entry?.file) continue;

  const filePath = path.join(root, "src/content/pages", `${entry.file}.json`);
  const page = JSON.parse(await readFile(filePath, "utf8"));
  const text = stripHtml(page.contentHtml);

  index.push({
    title: page.title,
    path: page.path,
    excerpt: text.slice(0, 280),
  });
}

index.sort((a, b) => a.title.localeCompare(b.title));

const outPath = path.join(root, "public/search-index.json");
await writeFile(outPath, JSON.stringify(index, null, 0));
console.log(`Wrote ${index.length} entries to public/search-index.json`);
