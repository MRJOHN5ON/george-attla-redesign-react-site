#!/usr/bin/env node
/**
 * Downloads PDFs and other wp-content assets missed by the initial crawl,
 * then rewrites links in src/content/pages/*.json
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "src/content/pages");
const IMG_ROOT = path.join(ROOT, "public/images/attla");
const FILE_ROOT = path.join(ROOT, "public/files/attla");
const DOMAIN = "https://attlamakingofachampion.com";

const FILE_EXTS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".zip",
  ".mp3",
  ".mp4",
  ".mov",
]);

function wpPathToLocal(wpPath) {
  const rel = wpPath.replace(/^\/wp-content\/uploads\//, "");
  const ext = path.extname(rel.split("?")[0]).toLowerCase();
  if (FILE_EXTS.has(ext)) return `/files/attla/${rel}`;
  return `/images/attla/${rel}`;
}

async function downloadWpAsset(wpPath) {
  const rel = wpPath.replace(/^\/wp-content\/uploads\//, "");
  const ext = path.extname(rel.split("?")[0]).toLowerCase();
  const isFile = FILE_EXTS.has(ext);
  const localPublic = wpPathToLocal(wpPath);
  const diskPath = path.join(isFile ? FILE_ROOT : IMG_ROOT, rel);
  const url = `${DOMAIN}/wp-content/uploads/${rel}`;

  await mkdir(path.dirname(diskPath), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "WebsiteCloner/1.0 (educational)" },
    });
    if (!res.ok) {
      console.error(`✗ ${res.status} ${rel}`);
      return localPublic;
    }
    await pipeline(res.body, createWriteStream(diskPath));
    console.log(`✓ ${rel}`);
    return localPublic;
  } catch (e) {
    console.error(`✗ ${rel}: ${e.message}`);
    return localPublic;
  }
}

async function collectJsonFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectJsonFiles(full)));
    else if (entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

async function main() {
  const files = await collectJsonFiles(CONTENT_DIR);
  const wpPaths = new Set();

  for (const file of files) {
    const text = await readFile(file, "utf8");
    const re = /\/wp-content\/uploads\/[^"'\s<>]+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      wpPaths.add(m[0].replace(/&amp;/g, "&"));
    }
  }

  console.log(`Found ${wpPaths.size} unique wp-content asset paths\n`);

  const replacements = new Map();
  let i = 0;
  for (const wpPath of [...wpPaths].sort()) {
    const local = await downloadWpAsset(wpPath);
    replacements.set(wpPath, local);
    i++;
    if (i % 10 === 0) await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\nRewriting ${files.length} content files...`);
  for (const file of files) {
    let text = await readFile(file, "utf8");
    for (const [from, to] of replacements) {
      text = text.split(from).join(to);
      text = text.split(from.replace(/&/g, "&amp;")).join(to);
    }
    await writeFile(file, text);
  }

  const pdfCount = [...replacements.keys()].filter((p) =>
    p.toLowerCase().endsWith(".pdf")
  ).length;
  console.log(`Done. ${pdfCount} PDFs, ${replacements.size} assets total.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
