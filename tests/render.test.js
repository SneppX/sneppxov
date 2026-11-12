const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'js', 'render.js'),
  'utf8'
);

function createHarness(fetch) {
  let onSearch;
  const grid = {
    children: [],
    _innerHTML: '',
    textContent: '',
    get innerHTML() {
      return this._innerHTML;
    },
    set innerHTML(value) {
      this._innerHTML = value;
      this.children = [];
    },
    appendChild(element) {
      this.children.push(element);
    }
  };
  const filters = {
    children: [],
    _innerHTML: '',
    textContent: '',
    get innerHTML() {
      return this._innerHTML;
    },
    set innerHTML(value) {
      this._innerHTML = value;
      this.children = [];
    },
    appendChild(element) {
      this.children.push(element);
    }
  };
  const search = {
    value: '',
    addEventListener(type, callback) {
      if (type === 'input') onSearch = callback;
    }
  };
  const elements = {
    compGrid: grid,
    compFilters: filters,
    compSearch: search
  };
  const document = {
    getElementById(id) {
      return elements[id] || null;
    },
    createElement(tagName) {
      return {
        tagName,
        listeners: {},
        attributes: {},
        addEventListener(type, callback) {
          this.listeners[type] = callback;
        },
        setAttribute(name, value) {
          this.attributes[name] = value;
        }
      };
    }
  };

  vm.runInNewContext(source, { document, fetch });

  return {
    grid,
    filters,
    search,
    searchNow() {
      assert.equal(typeof onSearch, 'function');
      onSearch();
    }
  };
}

test('component catalog escapes content and only links safe repository paths', async () => {
  const fetch = async () => ({
    ok: true,
    json: async () => [
      null,
      'invalid entry',
      [],
      {
        title: 'Safe <component>',
        description: 'Description & details',
        category: 'Core',
        source: 'src/my file.c',
        test: 'tests/my test.py'
      },
      {
        title: 'Unsafe traversal',
        description: 'Traversal must not become a link',
        category: 'Security',
        source: '../../README.md',
        test: '../outside.py'
      },
      {
        title: 'Unsafe external URL',
        description: 'External hosts are not catalog sources',
        category: 'Security',
        source: 'https://evil.example/payload'
      },
      {
        title: 'Directory source',
        description: 'Directory links use the tree view',
        category: 'Tools',
        source: 'src/include/'
      }
    ]
  });
  const app = createHarness(fetch);
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(app.filters.children.length, 4);
  assert.equal(app.grid.children.length, 4);

  const allChip = app.filters.children.find(chip => chip.textContent === 'All');
  assert.equal(allChip.attributes['aria-pressed'], 'true');
  const toolsChip = app.filters.children.find(chip => chip.textContent === 'Tools');
  assert.equal(toolsChip.attributes['aria-pressed'], 'false');
  toolsChip.listeners.click();
  const activeToolsChip = app.filters.children.find(chip => chip.textContent === 'Tools');
  assert.equal(activeToolsChip.attributes['aria-pressed'], 'true');
  assert.equal(app.grid.children.length, 1);

  const safe = app.grid.children.find(card => card.innerHTML.includes('Safe &lt;component&gt;'));
  assert.ok(safe);
  assert.match(safe.innerHTML, /blob\/main\/src\/my%20file\.c/);
  assert.match(safe.innerHTML, /blob\/main\/tests\/my%20test\.py/);
  assert.match(safe.innerHTML, /rel="noopener noreferrer"/);
  assert.match(safe.innerHTML, /Description &amp; details/);

  const traversal = app.grid.children.find(card => card.innerHTML.includes('Unsafe traversal'));
  assert.ok(traversal);
  assert.doesNotMatch(traversal.innerHTML, /href=/);

  const external = app.grid.children.find(card => card.innerHTML.includes('Unsafe external URL'));
  assert.ok(external);
  assert.doesNotMatch(external.innerHTML, /href=/);

  const directory = app.grid.children.find(card => card.innerHTML.includes('Directory source'));
  assert.ok(directory);
  assert.match(directory.innerHTML, /tree\/main\/src\/include\//);

  app.search.value = 'Directory';
  app.searchNow();
  assert.equal(app.grid.children.length, 1);
  assert.match(app.grid.children[0].innerHTML, /Directory source/);
});

test('component catalog handles failed and malformed data safely', async () => {
  const failed = createHarness(async () => ({ ok: false, status: 503 }));
  await new Promise(resolve => setImmediate(resolve));
  assert.match(failed.grid.textContent, /could not be loaded/i);
  assert.equal(failed.filters.textContent, '');

  const malformed = createHarness(async () => ({
    ok: true,
    json: async () => ({ unexpected: 'object' })
  }));
  await new Promise(resolve => setImmediate(resolve));
  assert.match(malformed.grid.textContent, /could not be loaded/i);
  assert.equal(malformed.grid.children.length, 0);
});
