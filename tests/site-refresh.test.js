const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.join(__dirname, '..');

test('landing page uses specific project copy and source-first links', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(html.includes('Understand the system'));
  assert.ok(html.includes('Browse the repository'));
  assert.ok(html.includes('data-count="93"'));
  assert.ok(html.includes('data-count="134"'));
  assert.ok(html.includes('https://github.com/SneppX/sneppx-alg'));
  assert.ok(html.includes('class="skip-link" href="#main-content"'));
});

test('contribution page contains real contribution paths, not invented service tiers', () => {
  const html = fs.readFileSync(path.join(root, 'community.html'), 'utf8');
  assert.ok(html.includes('Report a problem'));
  assert.ok(html.includes('Propose a change'));
  assert.ok(html.includes('contribution guide'));
  assert.ok(!html.includes('Enterprise support and SLA'));
  assert.ok(!html.includes('Commercial license tier'));
  assert.ok(!html.includes('Sponsoring Tiers'));
});

test('shared styles support responsive navigation, keyboard focus, and reduced motion', () => {
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  assert.ok(css.includes('@media(max-width:900px)'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(!css.includes('fonts.googleapis.com'));
});
