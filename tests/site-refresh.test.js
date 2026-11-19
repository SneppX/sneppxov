const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.join(__dirname, '..');

test('all HTML pages expose skip navigation and a main landmark', () => {
  const pages = fs.readdirSync(root).filter(file => file.endsWith('.html'));
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.ok(html.includes('class="skip-link" href="#main-content"'), page + ' has a skip link');
    assert.ok(html.includes('id="main-content"'), page + ' has a main landmark target');
  }
});

test('changelog records the published site refresh', () => {
  const html = fs.readFileSync(path.join(root, 'changelog.html'), 'utf8');
  assert.ok(html.includes('v1.1.0'));
  assert.ok(html.includes('Added skip navigation'));
  assert.ok(html.includes('Removed unsupported sponsorship tiers'));
});

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

test('changelog records the active-project comparison refresh', () => {
  const html = fs.readFileSync(path.join(root, 'changelog.html'), 'utf8');
  assert.ok(html.includes('v1.2.0'));
  assert.ok(html.includes('active repositories'));
  assert.ok(html.includes('VSTodo'));
  assert.ok(html.includes('93 components and 134 capabilities'));
});


test('comparison page and its supporting assets are removed from the public site', () => {
  const removed = [
    'comparison.html',
    'css/comparison-table.css',
    'js/comparison-table.js',
    'data/comparison.json',
    'tests/comparison-table.test.js'
  ];
  for (const file of removed) {
    assert.ok(!fs.existsSync(path.join(root, file)), file + ' is removed');
  }

  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const worker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/validate-site.yml'), 'utf8');

  for (const [label, content] of [
    ['index navigation', index],
    ['service worker', worker],
    ['XML sitemap', sitemap],
    ['README', readme],
    ['validation workflow', workflow]
  ]) {
    assert.ok(!content.includes('comparison.html'), label + ' has no comparison page reference');
    assert.ok(!content.includes('data/comparison.json'), label + ' has no comparison data reference');
  }
});
