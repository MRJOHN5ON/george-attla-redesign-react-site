#!/usr/bin/env node
/**
 * Scans public/images and writes src/data/image-metadata.json
 * (dimensions + suggested display). Run after adding photos: npm run build:image-meta
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public/images");
const OUT = path.join(process.cwd(), "src/data/image-metadata.json");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(jpe?g|png|gif|webp)$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

function probe(filePath) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight ${JSON.stringify(filePath)}`, {
    encoding: "utf8",
  });
  const w = Number(/pixelWidth: (\d+)/.exec(out)?.[1]);
  const h = Number(/pixelHeight: (\d+)/.exec(out)?.[1]);
  if (!w || !h) return null;
  const aspect = w / h;
  let category = "landscape";
  let focal = "50% 35%";
  let preferContain = false;

  if (aspect >= 2.2) {
    category = "banner";
    focal = "50% 45%";
    preferContain = true;
  } else if (aspect < 0.85) {
    category = "portrait";
    focal = "50% 40%";
    preferContain = true;
  } else if (aspect < 1.15) {
    category = "square";
    focal = "50% 38%";
  } else if (aspect >= 1.65) {
    focal = "50% 28%";
    preferContain = true;
  } else {
    focal = "50% 32%";
  }

  return { w, h, aspect: Math.round(aspect * 1000) / 1000, category, focal, preferContain };
}

const files = walk(ROOT);
const meta = {};

for (const file of files) {
  const info = probe(file);
  if (!info) continue;
  const webPath = `/${path.relative(path.join(process.cwd(), "public"), file).replace(/\\/g, "/")}`;
  meta[webPath] = info;
}

fs.writeFileSync(OUT, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`Wrote ${Object.keys(meta).length} entries to ${path.relative(process.cwd(), OUT)}`);
