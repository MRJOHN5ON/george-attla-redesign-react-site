#!/usr/bin/env node
/**
 * Fix image sizing issues in crawled content:
 * - Prefer full-size images over WordPress thumbnails (-300x200 etc.)
 * - Download missing full-size + PDF assets from live site
 * - Strip hardcoded width/height/sizes that cause pixelation
 */
import * as cheerio from "cheerio";
import { readdir, readFile, writeFile, mkdir, access } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "src/content/pages");
const IMG_ROOT = path.join(ROOT, "public/images/attla");
const FILE_ROOT = path.join(ROOT, "public/files/attla");
const DOMAIN = "https://attlamakingofachampion.com";

const FILE_EXTS = new Set([".pdf", ".doc", ".docx", ".zip", ".ppt", ".pptx"]);

function sanitizePath(p) {
  return p
    .replace(/\\/g, "")
    .replace(/&amp;/g, "&")
    .split("?")[0]
    .trim();
}

/** WordPress: photo-300x200.jpg → photo.jpg */
function fullSizeRel(rel) {
  return rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
}

function relFromPublic(src) {
  if (src.startsWith("/files/attla/")) return { kind: "file", rel: src.slice("/files/attla/".length) };
  if (src.startsWith("/images/attla/")) return { kind: "image", rel: src.slice("/images/attla/".length) };
  return null;
}

function publicPath(kind, rel) {
  return kind === "file" ? `/files/attla/${rel}` : `/images/attla/${rel}`;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadUpload(rel) {
  const ext = path.extname(rel).toLowerCase();
  const isFile = FILE_EXTS.has(ext);
  const diskRoot = isFile ? FILE_ROOT : IMG_ROOT;
  const diskPath = path.join(diskRoot, rel);
  const url = new URL(`/wp-content/uploads/${rel}`, DOMAIN).href;

  await mkdir(path.dirname(diskPath), { recursive: true });
  if (await exists(diskPath)) return publicPath(isFile ? "file" : "image", rel);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "WebsiteCloner/1.0 (educational)" },
    });
    if (!res.ok) return null;
    await pipeline(res.body, createWriteStream(diskPath));
    return publicPath(isFile ? "file" : "image", rel);
  } catch {
    return null;
  }
}

async function resolveBestImageSrc(src) {
  const clean = sanitizePath(src);
  const parsed = relFromPublic(clean);
  if (!parsed || parsed.kind !== "image") return clean;

  let rel = parsed.rel;
  const fullRel = fullSizeRel(rel);
  const diskFull = path.join(IMG_ROOT, fullRel);
  const diskCurrent = path.join(IMG_ROOT, rel);

  if (fullRel !== rel) {
    if (await exists(diskFull)) rel = fullRel;
    else {
      const downloaded = await downloadUpload(fullRel);
      if (downloaded) rel = fullRel;
      else if (!(await exists(diskCurrent))) {
        await downloadUpload(rel);
      }
    }
  } else if (!(await exists(diskCurrent))) {
    await downloadUpload(rel);
  }

  return publicPath("image", rel);
}

async function resolveAssetHref(href) {
  const clean = sanitizePath(href);
  if (clean.startsWith("/files/attla/")) {
    const rel = clean.slice("/files/attla/".length);
    await downloadUpload(rel);
    return clean;
  }
  if (clean.startsWith("/images/attla/")) {
    const ext = path.extname(clean).toLowerCase();
    if (FILE_EXTS.has(ext)) {
      const rel = clean.slice("/images/attla/".length);
      const filePath = `/files/attla/${rel}`;
      await downloadUpload(rel);
      return filePath;
    }
    return resolveBestImageSrc(clean);
  }
  return clean;
}

function cleanHtml(html) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const $root = $("#root");

  $root.find("img").each((_, el) => {
    const $img = $(el);
    $img.removeAttr("width");
    $img.removeAttr("height");
    $img.removeAttr("sizes");
    $img.removeAttr("srcset");
    $img.removeAttr("importance");
    $img.removeAttr("fetchpriority");
    $img.removeAttr("loading");
    $img.removeAttr("decoding");
    $img.addClass("attla-content-img");
  });

  $root.find("figure.wp-caption, .wp-caption").each((_, el) => {
    const $fig = $(el);
    $fig.removeAttr("style");
    $fig.css("max-width", "100%");
  });

  $root.find("[style*='width']").each((_, el) => {
    const $el = $(el);
    const style = $el.attr("style") || "";
    const next = style
      .split(";")
      .filter((s) => !/^\s*width\s*:/i.test(s))
      .join(";")
      .trim();
    if (next) $el.attr("style", next);
    else $el.removeAttr("style");
  });

  return $root.html() || "";
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

async function processHtml(html) {
  let out = html;
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const $root = $("#root");

  for (const el of $root.find("img").toArray()) {
    const src = $(el).attr("src");
    if (!src?.startsWith("/")) continue;
    const best = await resolveBestImageSrc(src);
    if (best) $(el).attr("src", best);
  }

  for (const el of $root.find("a[href]").toArray()) {
    const href = $(el).attr("href");
    if (!href?.startsWith("/images/attla/") && !href?.startsWith("/files/attla/")) continue;
    const best = await resolveAssetHref(href);
    if (best) $(el).attr("href", best);
  }

  out = $root.html() || "";
  return cleanHtml(out);
}

async function main() {
  const files = await collectJsonFiles(CONTENT_DIR);
  console.log(`Processing ${files.length} pages...\n`);

  let upgraded = 0;
  for (const file of files) {
    const data = JSON.parse(await readFile(file, "utf8"));
    const before = data.contentHtml;
    data.contentHtml = await processHtml(before);
    if (data.contentHtml !== before) upgraded++;
    await writeFile(file, JSON.stringify(data, null, 2));
    console.log(`✓ ${data.path}`);
  }

  console.log(`\nDone. Updated ${upgraded} pages.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
