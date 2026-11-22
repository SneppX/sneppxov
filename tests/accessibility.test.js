const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = [
  'index.html',
  'about.html',
  'projects.html',
  'project.html',
  'developers.html',
  'community.html',
  'updates.html',
  'vstodo.html',
  'vstodo-architecture.html',
];

test('key public pages provide language, skip navigation, main, and named navigation landmarks', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /<html\b[^>]*\blang=["']en["']/i, page);
    assert.ok(html.includes('class="skip-link" href="#main-content"'), page);
    assert.ok(html.includes('<main id="main-content">'), page);
    assert.match(html, /<nav\b[^>]*aria-label=["'][^"']+["']/i, page);
  }
});

test('images and interactive controls have accessible names', () => {
  for (const page of pages) {
    const html = read(page);
    const images = html.match(/<img\b[^>]*>/gi) || [];
    for (const image of images) assert.match(image, /\balt=["'][^"']*["']/i, page);
    const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) || [];
    for (const button of buttons) {
      const named =
        /\baria-label=/.test(button) ||
        /\btitle=/.test(button) ||
        />(?:\s|<[^>]+>)*[^<\s][\s\S]*?<\/button>/i.test(button);
      assert.ok(named, page + ' contains an unnamed button: ' + button.slice(0, 120));
    }
  }
  assert.match(read('projects.html'), /<label[^>]*for="projectSearch"/);
  assert.match(read('js/site.js'), /aria-label', 'Search pages and resources'/);
  assert.match(read('updates.html'), /role="status" aria-live="polite"/);
});

test('keyboard focus and reduced-motion styles are present', () => {
  const css = read('style.css') + read('css/sneppxov-v2.css');
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
