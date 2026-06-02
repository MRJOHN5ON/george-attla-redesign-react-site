#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/images/attla");

const assets = [
  ["slideshow-ashof-900x300.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/slideshow-ashof-900x300.jpg"],
  ["youth_program.gif", "https://attlamakingofachampion.com/wp-content/uploads/2016/05/youth_program.gif"],
  ["1980-slideshow1-900x300.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/1980-slideshow1-900x300.jpg"],
  ["sandall-900x300.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2012/01/sandall-900x300.jpg"],
  ["1988-900x300.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2012/02/1988-900x300.jpg"],
  ["1950-slideshow2-900x300.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/1950-slideshow2-900x300.jpg"],
  ["youth-day-400x200.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2016/04/xsmall-Huslia-YOUTH-DAY-Races-Jackie-Wholescheese-and-JHS-students-help-musher-Tony-Sam-III-at-the-start1-1024x514-400x200.jpg"],
  ["the-race-400x228.png", "https://attlamakingofachampion.com/wp-content/uploads/2012/06/Screen-shot-2012-06-01-at-8.46.12-AM-400x228.png"],
  ["mindset-400x145.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/1980-slideshow1-400x145.jpg"],
  ["mush-400x286.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2012/03/mush-400x286.jpg"],
  ["visit.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2022/10/visit.jpg"],
  ["thumb-speedakmag2.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/thumb-speedakmag2.jpg"],
  ["thumbnail-asof-book.gif", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/thumbnail-asof-book.gif"],
  ["sprint-racing.jpg", "https://attlamakingofachampion.com/wp-content/uploads/2011/12/thumb-speedakmag2.jpg"],
];

async function download(name, url) {
  const dest = path.join(OUT, name);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
  console.log("✓", name);
}

await mkdir(OUT, { recursive: true });
for (const [name, url] of assets) {
  try {
    await download(name, url);
  } catch (e) {
    console.error("✗", name, e.message);
  }
}
