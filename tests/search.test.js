const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'js', 'search.js'),
  'utf8'
);

test('search results are keyboard-accessible safe external links', async () => {
  let onInput;
  const children = [];
  const input = {
    value: 'test',
    addEventListener(type, callback) {
      if (type === 'input') onInput = callback;
    }
  };
  const results = {
    classList: {
      add() {},
      remove() {}
    },
    appendChild(element) {
      children.push(element);
    },
    innerHTML: ''
  };
  const box = {
    querySelector(selector) {
      if (selector === 'input') return input;
      if (selector === '.search-results') return results;
      return null;
    },
    getAttribute(name) {
      return name === 'data-search' ? 'data/components.json' : null;
    },
    contains() {
      return true;
    }
  };
  const document = {
    querySelectorAll(selector) {
      return selector === '.search-box' ? [box] : [];
    },
    createElement(tagName) {
      return {
        tagName,
        listeners: {},
        addEventListener(type, callback) {
          this.listeners[type] = callback;
        }
      };
    },
    addEventListener() {}
  };
  const fetch = async () => ({
    ok: true,
    json: async () => [{
      title: 'Test <img src=x>',
      description: 'A & B',
      category: 'tools',
      source: 'src/my file.c'
    }]
  });

  vm.runInNewContext(source, { document, fetch });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(typeof onInput, 'function');

  onInput();

  assert.equal(children.length, 1);
  const link = children[0];
  assert.equal(link.tagName, 'a');
  assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener noreferrer');
  assert.equal(
    link.href,
    'https://github.com/SneppX/sneppx-alg/blob/main/src/my%20file.c'
  );
  assert.match(link.innerHTML, /Test &lt;img src=x&gt;/);
  assert.match(link.innerHTML, /A &amp; B/);
  assert.equal(typeof link.listeners.click, 'function');
});

test('search results without a source are not fake clickable links', async () => {
  let onInput;
  const children = [];
  const input = {
    value: 'test',
    addEventListener(type, callback) {
      if (type === 'input') onInput = callback;
    }
  };
  const results = {
    classList: { add() {}, remove() {} },
    appendChild(element) { children.push(element); },
    innerHTML: ''
  };
  const box = {
    querySelector(selector) {
      return selector === 'input' ? input :
        selector === '.search-results' ? results : null;
    },
    getAttribute() { return 'data/components.json'; },
    contains() { return true; }
  };
  const document = {
    querySelectorAll() { return [box]; },
    createElement(tagName) {
      return { tagName, addEventListener() {} };
    },
    addEventListener() {}
  };
  const fetch = async () => ({
    ok: true,
    json: async () => [{
      title: 'Local item',
      description: 'No source link',
      category: 'tools'
    }]
  });

  vm.runInNewContext(source, { document, fetch });
  await new Promise(resolve => setImmediate(resolve));
  onInput();

  assert.equal(children.length, 1);
  assert.equal(children[0].tagName, 'div');
  assert.equal(children[0].href, undefined);
});
