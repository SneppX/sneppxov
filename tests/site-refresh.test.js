const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('all public HTML pages provide skip navigation and a main landmark', () => {
  for (const page of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
    const html = read(page);
    assert.ok(html.includes('class="skip-link" href="#main-content"'), page);
    assert.ok(html.includes('id="main-content"'), page);
  }
});

test('SneppXOV identity is used by the homepage, manifest, and README', () => {
  assert.match(read('index.html'), /<title>SneppX/);
  assert.ok(read('index.html').includes('property="og:site_name" content="SneppX"'));
  assert.equal(JSON.parse(read('manifest.json')).name, 'SneppX');
  assert.match(read('README.md'), /^# SneppXOV/m);
});

test('homepage describes the organization and links to verified public repositories', () => {
  const html = read('index.html');
  assert.ok(html.includes('Projects, source code, and the people building them.'));
  assert.ok(html.includes('https://github.com/SneppX/sneppx-alg'));
  assert.ok(html.includes('https://github.com/SneppX/vstodo'));
  assert.ok(!html.includes('data-count='));
  assert.ok(!html.includes('SneppX-ALG | Open-source AI'));
});

test('project directory lists verified public repositories', () => {
  const html = read('projects.html');
  assert.ok(html.includes('https://github.com/SneppX/sneppx-alg'));
  assert.ok(html.includes('https://github.com/SneppX/vstodo'));
  assert.ok(html.includes('verified as public'));
});

test('theme modes include light, dark, and system', () => {
  assert.match(
    read('js/theme.js'),
    /modes\s*=\s*\[\s*['"]system['"]\s*,\s*['"]light['"]\s*,\s*['"]dark['"]\s*\]/,
  );
  assert.ok(read('js/theme.js').includes('localStorage'));
  assert.match(read('css/sneppxov-v2.css'), /prefers-color-scheme\s*:\s*dark/);
});

test('command palette is keyboard accessible and uses a local page index', () => {
  const js = read('js/site.js');
  assert.match(js, /e\.key\.toLowerCase\(\)\s*===\s*['"]k['"]/);
  assert.ok(js.includes('showModal'));
  assert.ok(!js.includes('fetch('));
});

test('contribution guidance contains practical contribution paths', () => {
  const html = read('community.html');
  assert.ok(html.includes('Report a problem'));
  assert.ok(html.includes('Propose a change'));
  assert.ok(!html.includes('Enterprise support and SLA'));
  assert.ok(!html.includes('Sponsoring Tiers'));
});

test('no public page links to a retired comparison destination', () => {
  for (const page of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
    const html = read(page);
    assert.doesNotMatch(html, /href=["'][^"']*compar[^"']*\.html/i, page);
  }
});

test('project records expose only verified public repositories and source links', () => {
  const records = JSON.parse(read('data/projects.json'));
  assert.deepEqual(records.map(item => item.id).sort(), ['sneppx-alg', 'vstodo']);
  for (const item of records) {
    assert.ok(item.repository.startsWith('https://github.com/SneppX/'));
    assert.ok(item.name && item.category && item.description);
  }
});

test('project detail page renders a selected record without injecting HTML', () => {
  const html = read('project.html');
  const js = read('js/project-detail.js');
  assert.ok(html.includes('js/project-detail.js'));
  assert.ok(js.includes('URLSearchParams'));
  assert.ok(js.includes('textContent'));
  assert.ok(!js.includes('innerHTML'));
});

test('project detail record is included in the offline shell and sitemap', () => {
  assert.ok(read('sw.js').includes("'project.html'"));
  assert.ok(read('sw.js').includes("'data/projects.json'"));
  assert.ok(read('sitemap.xml').includes('https://sneppx.github.io/sneppxov/project.html'));
});
