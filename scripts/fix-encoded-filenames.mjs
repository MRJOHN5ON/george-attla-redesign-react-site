#!/usr/bin/env node
/**
 * Rename files saved with literal %XX in the filename and update content links.
 */
import { readdir, rename, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIRS = [
  path.join(ROOT, "public/files/attla"),
  path.join(ROOT, "public/images/attla"),
];
const CONTENT_DIR = path.join(ROOT, "src/content/pages");

function decodeFilename(name) {
  try {
    return decodeURIComponent(name);
  } catch {
    return name.replace(/%E2%80%93/gi, "-").replace(/%E2%80%99/gi, "'").replace(/%22/g, "");
  }
}

async function walkFiles(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(full, files);
    else files.push(full);
  }
  return files;
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
  const renames = [];

  for (const base of PUBLIC_DIRS) {
    try {
      const files = await walkFiles(base);
      for (const filePath of files) {
        const dir = path.dirname(filePath);
        const oldName = path.basename(filePath);
        if (!oldName.includes("%")) continue;
        const newName = decodeFilename(oldName);
        if (newName === oldName) continue;
        const newPath = path.join(dir, newName);
        await rename(filePath, newPath);
        const oldPublic = filePath.replace(path.join(ROOT, "public"), "");
        const newPublic = newPath.replace(path.join(ROOT, "public"), "");
        renames.push({ from: oldPublic, to: newPublic });
        console.log(`rename: ${oldName} → ${newName}`);
      }
    } catch {
      /* dir missing */
    }
  }

  if (renames.length === 0) {
    console.log("No encoded filenames found.");
    return;
  }

  const jsonFiles = await collectJsonFiles(CONTENT_DIR);
  for (const file of jsonFiles) {
    let text = await readFile(file, "utf8");
    let changed = false;
    for (const { from, to } of renames) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
      const fromEnc = from.replace(/%/g, "%25");
      if (text.includes(fromEnc)) {
        text = text.split(fromEnc).join(to);
        changed = true;
      }
    }
    if (changed) await writeFile(file, text);
  }

  console.log(`\nUpdated ${renames.length} files and content links.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
