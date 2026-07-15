#!/usr/bin/env node
/**
 * set-domain.js — point the whole site at a new URL.
 *
 * Canonical tags, og:image URLs, structured data and the sitemap all need the
 * site's REAL absolute address. If they point somewhere you don't own, Google is
 * told "the real page lives elsewhere" and may not index you at all.
 *
 * Usage:
 *   node set-domain.js https://jaskaran-singh.netlify.app
 *   node set-domain.js https://yourrealdomain.com
 *
 * Re-runnable: it reads the current URL out of robots.txt, so you can switch
 * from the Netlify subdomain to your real domain later with one command.
 * Run it, then re-upload the folder.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

// --- Work out the new URL -------------------------------------------------
let next = process.argv[2];
if (!next) {
  console.error("Usage: node set-domain.js https://your-site.com");
  process.exit(1);
}
next = next.trim().replace(/\/+$/, ""); // drop trailing slash

if (!/^https?:\/\/[^\s/]+\.[^\s/]+$/.test(next)) {
  console.error(`Not a valid site URL: "${next}"`);
  console.error('Expected something like https://jaskaran-singh.netlify.app');
  process.exit(1);
}
if (next.startsWith("http://")) {
  console.warn("! Warning: http:// is insecure and Google prefers https. Continuing anyway.");
}

// --- Find the current URL from robots.txt --------------------------------
const robotsPath = path.join(ROOT, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  console.error("robots.txt not found — run this from the site folder.");
  process.exit(1);
}
const m = fs.readFileSync(robotsPath, "utf8").match(/Sitemap:\s*(https?:\/\/[^\s/]+)/i);
if (!m) {
  console.error("Couldn't read the current URL from robots.txt (no Sitemap: line).");
  process.exit(1);
}
const current = m[1];

if (current === next) {
  console.log(`Already set to ${next} — nothing to do.`);
  process.exit(0);
}

// --- Replace everywhere ---------------------------------------------------
const targets = fs
  .readdirSync(ROOT)
  .filter((f) => /\.(html|xml|txt|webmanifest)$/.test(f));

let files = 0;
let hits = 0;

for (const f of targets) {
  const p = path.join(ROOT, f);
  const before = fs.readFileSync(p, "utf8");
  const count = before.split(current).length - 1;
  if (!count) continue;
  fs.writeFileSync(p, before.split(current).join(next), "utf8");
  console.log(`  ${f.padEnd(28)} ${count} replaced`);
  files++;
  hits += count;
}

// --- Refresh sitemap lastmod ---------------------------------------------
const smPath = path.join(ROOT, "sitemap.xml");
if (fs.existsSync(smPath)) {
  const today = new Date().toISOString().slice(0, 10);
  const sm = fs.readFileSync(smPath, "utf8").replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  fs.writeFileSync(smPath, sm, "utf8");
  console.log(`  sitemap.xml lastmod -> ${today}`);
}

console.log(`\n${current}  ->  ${next}`);
console.log(`${hits} URLs across ${files} files.`);
console.log("\nNext: re-upload the folder, then submit sitemap.xml in Google Search Console.");
