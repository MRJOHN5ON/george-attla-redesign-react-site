/**
 * Regenerate src/data/page-audit.json using the real content processor.
 * Run: npm run audit:pages
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { processContentHtml } = await import(
  pathToFileURL(path.join(root, "src/lib/process-content.ts")).href
);
const { resolvePageLayout } = await import(
  pathToFileURL(path.join(root, "src/lib/page-layout.ts")).href
);

const files = readdirSync(path.join(root, "src/content/pages")).filter((f) =>
  f.endsWith(".json")
);
const audit = [];

for (const f of files) {
  const j = JSON.parse(readFileSync(path.join(root, "src/content/pages", f), "utf8"));
  const processed = processContentHtml(j.contentHtml, j.title, j.path);
  const layout = resolvePageLayout(processed, j.path);
  audit.push({
    path: j.path,
    title: j.title,
    layout,
    bodyLen: processed.bodyHtml.length,
    videos: (processed.bodyHtml.match(/attla-video/g) || []).length,
    hero: Boolean(processed.heroImage),
  });
}

audit.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(
  path.join(root, "src/data/page-audit.json"),
  JSON.stringify(audit, null, 2)
);

const counts = {};
for (const a of audit) counts[a.layout] = (counts[a.layout] || 0) + 1;
console.log("Layouts:", counts);
console.log(
  "Sparse:",
  audit.filter((a) => a.layout === "sparse").map((a) => a.path).join(", ") || "none"
);
