#!/usr/bin/env node
/**
 * Themify lazy-load leaves placeholder SVG in src; real URL is in data-tf-src.
 * This script resolves those to downloaded full-size images.
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
const DOMAIN = "https://attlamakingofachampion.com";

function fullSizeRel(rel) {
  return rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
}

function toWpRel(urlOrPath) {
  let s = urlOrPath.trim();
  if (s.startsWith("data:")) return null;
  try {
    if (s.startsWith("http")) {
      const u = new URL(s);
      if (u.pathname.startsWith("/wp-content/uploads/")) {
        return decodeURIComponent(u.pathname.replace(/^\/wp-content\/uploads\//, ""));
      }
      if (u.pathname.startsWith("/images/attla/")) {
        return decodeURIComponent(u.pathname.replace(/^\/images\/attla\//, ""));
      }
    }
    if (s.startsWith("/wp-content/uploads/")) {
      return decodeURIComponent(s.replace(/^\/wp-content\/uploads\//, ""));
    }
    if (s.startsWith("/images/attla/")) {
      return decodeURIComponent(s.replace(/^\/images\/attla\//, ""));
    }
  } catch {
    return null;
  }
  return null;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureImage(rel) {
  const fullRel = fullSizeRel(rel);
  const tryRels = fullRel !== rel ? [fullRel, rel] : [rel];

  for (const r of tryRels) {
    const disk = path.join(IMG_ROOT, r);
    if (await exists(disk)) return `/images/attla/${r}`;
  }

  for (const r of tryRels) {
    const disk = path.join(IMG_ROOT, r);
    await mkdir(path.dirname(disk), { recursive: true });
    const url = new URL(`/wp-content/uploads/${r}`, DOMAIN).href;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "WebsiteCloner/1.0 (educational)" },
      });
      if (res.ok) {
        await pipeline(res.body, createWriteStream(disk));
        console.log(`  ↓ ${r}`);
        return `/images/attla/${r}`;
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

function pickRealUrl($img) {
  const candidates = [
    $img.attr("data-tf-src"),
    $img.attr("data-tf-not-load"),
    $img.attr("data-src"),
    $img.attr("src"),
    $img.parent("a").attr("href"),
  ].filter(Boolean);

  for (const c of candidates) {
    if (c.startsWith("data:image/svg")) continue;
    const rel = toWpRel(c);
    if (rel) return rel;
  }
  return null;
}

async function processHtml(html) {
  const $ = cheerio.load(`<div id="root">${html}</div>`, null, false);
  const $root = $("#root");
  let fixed = 0;

  for (const el of $root.find("img").toArray()) {
    const $img = $(el);
    const src = $img.attr("src") || "";
    const needsFix =
      src.startsWith("data:image/svg") ||
      $img.attr("data-tf-src") ||
      $img.attr("data-tf-not-load");

    if (!needsFix) continue;

    const rel = pickRealUrl($img);
    if (!rel) continue;

    const local = await ensureImage(rel);
    if (!local) continue;

    $img.attr("src", local);
    $img.removeAttr("data-tf-src");
    $img.removeAttr("data-tf-not-load");
    $img.removeAttr("data-src");
    $img.removeAttr("data-tf-srcset");
    $img.removeAttr("data-tf-sizes");
    $img.removeAttr("data-lazy");
    $img.removeAttr("width");
    $img.removeAttr("height");
    $img.removeAttr("srcset");
    $img.removeAttr("sizes");
    $img.addClass("attla-content-img");
    fixed++;
  }

  return { html: $root.html() || "", fixed };
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
  let total = 0;

  for (const file of files) {
    const data = JSON.parse(await readFile(file, "utf8"));
    const { html, fixed } = await processHtml(data.contentHtml);
    if (fixed > 0) {
      data.contentHtml = html;
      await writeFile(file, JSON.stringify(data, null, 2));
      console.log(`✓ ${data.path} (${fixed} images)`);
      total += fixed;
    }
  }

  console.log(`\nResolved ${total} lazy-load placeholders.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
