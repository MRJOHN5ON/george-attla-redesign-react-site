#!/usr/bin/env node
/**
 * Crawls all pages from WordPress sitemaps, downloads images, saves content JSON.
 * Usage: node scripts/crawl-site.mjs
 */
import * as cheerio from "cheerio";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "src/content/pages");
const IMG_ROOT = path.join(ROOT, "public/images/attla");
const FILE_ROOT = path.join(ROOT, "public/files/attla");
const DOMAIN = "https://attlamakingofachampion.com";
const DELAY_MS = 300;

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

const SITEMAPS = [
  `${DOMAIN}/wp-sitemap-posts-page-1.xml`,
  `${DOMAIN}/wp-sitemap-posts-post-1.xml`,
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function urlToPath(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/\/$/, "") || "/";
  return p;
}

function pathToFileSlug(pagePath) {
  if (pagePath === "/") return null;
  return pagePath.replace(/^\//, "");
}

async function fetchSitemapUrls() {
  const urls = new Set();
  for (const sm of SITEMAPS) {
    const res = await fetch(sm);
    const xml = await res.text();
    const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const [, loc] of matches) urls.add(loc);
  }
  return [...urls].sort();
}

const downloadedAssets = new Map();

function localPathForUpload(rel) {
  const ext = path.extname(rel.split("?")[0]).toLowerCase();
  if (FILE_EXTS.has(ext)) return `/files/attla/${rel}`;
  return `/images/attla/${rel}`;
}

async function downloadUpload(absUrl) {
  if (downloadedAssets.has(absUrl)) return downloadedAssets.get(absUrl);

  let url;
  try {
    url = new URL(absUrl, DOMAIN);
  } catch {
    return absUrl;
  }
  if (!url.hostname.includes("attlamakingofachampion.com")) return absUrl;
  if (!url.pathname.startsWith("/wp-content/uploads/")) return absUrl;

  const rel = decodeURIComponent(
    url.pathname.replace(/^\/wp-content\/uploads\//, "")
  );
  const localPath = localPathForUpload(rel);
  const diskPath = path.join(
    FILE_EXTS.has(path.extname(rel).toLowerCase()) ? FILE_ROOT : IMG_ROOT,
    rel
  );

  await mkdir(path.dirname(diskPath), { recursive: true });
  try {
    const res = await fetch(url.href);
    if (res.ok) {
      await pipeline(res.body, createWriteStream(diskPath));
      downloadedAssets.set(absUrl, localPath);
    } else {
      downloadedAssets.set(absUrl, localPath);
    }
  } catch {
    downloadedAssets.set(absUrl, localPath);
  }
  return downloadedAssets.get(absUrl) ?? localPath;
}

function rewriteUrl(href) {
  if (!href) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#"))
    return href;
  try {
    const u = new URL(href, DOMAIN);
    if (u.hostname.replace(/^www\./, "") !== "attlamakingofachampion.com") return href;
    if (u.pathname.startsWith("/wp-content/uploads/")) {
      const rel = decodeURIComponent(
        u.pathname.replace(/^\/wp-content\/uploads\//, "")
      );
      return localPathForUpload(rel);
    }
    return u.pathname.replace(/\/$/, "") || "/";
  } catch {
    /* keep */
  }
  return href;
}

function fullSizeUploadUrl(absUrl) {
  try {
    const u = new URL(absUrl, DOMAIN);
    if (!u.pathname.startsWith("/wp-content/uploads/")) return absUrl;
    const rel = decodeURIComponent(u.pathname.replace(/^\/wp-content\/uploads\//, ""));
    const fullRel = rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
    return new URL(`/wp-content/uploads/${fullRel}`, DOMAIN).href;
  } catch {
    return absUrl;
  }
}

async function processImages($, el) {
  const $el = $(el);
  for (const img of $el.find("img").toArray()) {
    const $img = $(img);
    let src =
      $img.attr("src") ||
      $img.attr("data-tf-not-load") ||
      $img.attr("data-src") ||
      "";
    const lazySrc =
      $img.attr("data-tf-src") ||
      $img.attr("data-tf-not-load") ||
      $img.attr("data-src");
    if (lazySrc && !lazySrc.startsWith("data:")) {
      src = lazySrc;
    }
    if (src && !src.startsWith("data:")) {
      let abs = new URL(src, DOMAIN).href;
      if (abs.includes("/images/attla/")) {
        abs = abs.replace("/images/attla/", "/wp-content/uploads/");
      }
      abs = fullSizeUploadUrl(abs);
      const local = await downloadUpload(abs);
      $img.attr("src", local);
      $img.removeAttr("data-tf-not-load");
      $img.removeAttr("data-src");
      $img.removeAttr("data-tf-src");
      $img.removeAttr("data-tf-srcset");
      $img.removeAttr("data-tf-sizes");
      $img.removeAttr("data-lazy");
      $img.removeAttr("srcset");
      $img.removeAttr("sizes");
      $img.removeAttr("width");
      $img.removeAttr("height");
      $img.removeAttr("loading");
    }
  }
  $el.find("figure.wp-caption, .wp-caption").removeAttr("style");
}

async function scrapePage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "WebsiteCloner/1.0 (educational)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe").remove();

  const title =
    $("h1.post-title, h1.entry-title, .post-title").first().text().trim() ||
    $("title").text().split("–")[0].trim() ||
    "Untitled";

  let $content = $("#content .post").first();
  if (!$content.length) $content = $("#content article").first();
  if (!$content.length) $content = $("#content .type-page").first();
  if (!$content.length) $content = $("#content .type-post").first();
  if (!$content.length) $content = $("#content");

  $content.find("#sidebar, .post-nav, .post-share, .related-posts").remove();

  await processImages($, $content);

  $content.find("a").each((_, a) => {
    const $a = $(a);
    const href = $a.attr("href");
    if (href) $a.attr("href", rewriteUrl(href));
  });

  const contentHtml = $content.html()?.trim() || "";

  return { title, contentHtml };
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemaps\n`);

  await mkdir(CONTENT_DIR, { recursive: true });
  await mkdir(IMG_ROOT, { recursive: true });
  await mkdir(FILE_ROOT, { recursive: true });

  const manifest = { paths: [], pages: {} };

  for (const url of urls) {
    const pagePath = urlToPath(url);
    if (pagePath === "/") {
      manifest.paths.push("/");
      console.log("⊘ / (using custom homepage)");
      continue;
    }

    const slug = pathToFileSlug(pagePath);
    const outFile = path.join(CONTENT_DIR, `${slug}.json`);
    await mkdir(path.dirname(outFile), { recursive: true });

    try {
      const data = await scrapePage(url);
      const payload = {
        path: pagePath,
        sourceUrl: url,
        title: data.title,
        contentHtml: data.contentHtml,
      };
      await writeFile(outFile, JSON.stringify(payload, null, 2));
      manifest.paths.push(pagePath);
      manifest.pages[pagePath] = { title: data.title, file: slug };
      console.log(`✓ ${pagePath}`);
    } catch (e) {
      console.error(`✗ ${pagePath}: ${e.message}`);
    }
    await sleep(DELAY_MS);
  }

  manifest.paths.sort();
  manifest.crawledAt = new Date().toISOString();
  manifest.assetCount = downloadedAssets.size;
  await writeFile(
    path.join(ROOT, "src/content/manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\nDone. ${manifest.paths.length} paths, ${downloadedAssets.size} assets.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
