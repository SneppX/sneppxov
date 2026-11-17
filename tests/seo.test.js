const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = ["", "changelog.html", "community.html", "comparison.html", "components.html", "docs.html", "engine.html", "features.html", "security.html"];

test("homepage has canonical, social, and structured metadata", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /<title>[^<]{8,}<\/title>/i);
  assert.match(html, /<meta name="description" content="[^"]{40,}"\s*\/>/i);
  assert.ok(html.includes('<link rel="canonical" href="https://sneppx.github.io/sneppxov/" />'));
  assert.ok(html.includes('property="og:url"'));
  assert.ok(html.includes('name="twitter:card"'));
  assert.ok(html.includes('type="application/ld+json"'));
});

test("robots.txt points to the public XML sitemap", () => {
  const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
  assert.ok(robots.includes("Sitemap: https://sneppx.github.io/sneppxov/sitemap.xml"));
});

test("sitemap lists each public HTML page exactly once", () => {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  for (const page of pages) {
    const url = "https://sneppx.github.io/sneppxov/" + page;
    const entry = "<loc>" + url + "</loc>";
    assert.equal(sitemap.split(entry).length - 1, 1, page || "homepage");
  }
});
