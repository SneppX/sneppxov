const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = [
  "",
  "about.html",
  "projects.html",
  "project.html",
  "developers.html",
  "updates.html",
  "changelog.html",
  "community.html",
  "components.html",
  "docs.html",
  "engine.html",
  "features.html",
  "security.html",
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasTagWithAttributes(html, tagName, attributes) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
  return tags.some((tag) =>
    Object.entries(attributes).every(([name, value]) =>
      new RegExp(`\\b${name}=["']${escapeRegExp(value)}["']`, "i").test(tag),
    ),
  );
}

function hasSocialMetadata(html, url) {
  return (
    hasTagWithAttributes(html, "link", { rel: "canonical", href: url }) &&
    hasTagWithAttributes(html, "meta", { property: "og:url", content: url }) &&
    hasTagWithAttributes(html, "meta", { name: "twitter:card" })
  );
}

test("homepage has canonical, social, and structured metadata", () => {
  const html = read("index.html");
  assert.match(html, /<title>[^<]{8,}<\\/title>/i);

  const description = (
    html.match(/<meta\\b(?=[^>]*\\bname=["']description["'])[^>]*>/is) || []
  )[0] || "";
  assert.match(description, /\\bcontent=["'][^"']{40,}["']/i);
  assert.ok(hasSocialMetadata(html, "https://sneppx.github.io/sneppxov/"));
  assert.ok(html.includes('type="application/ld+json"'));
});

test("robots.txt points to the public XML sitemap", () => {
  assert.ok(read("robots.txt").includes("Sitemap: https://sneppx.github.io/sneppxov/sitemap.xml"));
});

test("sitemap lists each public HTML page exactly once", () => {
  const sitemap = read("sitemap.xml");
  for (const page of pages) {
    const url = "https://sneppx.github.io/sneppxov/" + page;
    const entry = "<loc>" + url + "</loc>";
    assert.equal(sitemap.split(entry).length - 1, 1, page || "homepage");
  }
});

test("editorial pages have canonical and social metadata", () => {
  for (const page of ["changelog.html", "community.html", "components.html"]) {
    const html = read(page);
    const url = "https://sneppx.github.io/sneppxov/" + page;
    assert.ok(hasSocialMetadata(html, url), page);
  }
});

test("reference pages have canonical and social metadata", () => {
  for (const page of ["docs.html", "engine.html", "features.html", "security.html"]) {
    const html = read(page);
    const url = "https://sneppx.github.io/sneppxov/" + page;
    assert.ok(hasSocialMetadata(html, url), page);
  }
});

test("organization pages have canonical and social metadata", () => {
  for (const page of ["about.html", "projects.html", "project.html", "developers.html", "updates.html"]) {
    const html = read(page);
    const url = "https://sneppx.github.io/sneppxov/" + page;
    assert.ok(hasSocialMetadata(html, url), page);
  }
});

test("structured data identifies SneppX as the organization website", () => {
  const schema = JSON.parse(read("schema.json"));
  assert.equal(schema["@type"], "WebSite");
  assert.equal(schema.name, "SneppX");
  assert.equal(schema.publisher.name, "SneppX");
  assert.match(schema.description, /organization website/i);
  assert.doesNotMatch(schema.description, /93 catalogued|134 documented/i);
});
