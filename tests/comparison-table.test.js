const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'js', 'comparison-table.js'),
  'utf8'
);

function createHarness(fetch) {
  const tbody = {
    children: [],
    replaceChildren(...children) {
      this.children = children;
    }
  };
  const table = {
    querySelector(selector) {
      return selector === 'tbody' ? tbody : null;
    }
  };
  const document = {
    getElementById(id) {
      return id === 'comparisonTable' ? table : null;
    },
    createElement(tagName) {
      return {
        tagName,
        children: [],
        attributes: {},
        className: '',
        textContent: '',
        colSpan: 0,
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
        appendChild(child) {
          this.children.push(child);
        }
      };
    }
  };

  vm.runInNewContext(source, { document, fetch });
  return { tbody };
}

test('comparison renderer reads all three active project columns, including hyphenated keys', async () => {
  const app = createHarness(async () => ({
    ok: true,
    json: async () => [{
      feature: '<script>not markup</script>',
      'sneppx-alg': 'Yes',
      vstodo: 'No',
      sneppxov: 'Yes'
    }]
  }));

  await new Promise(resolve => setImmediate(resolve));

  assert.equal(app.tbody.children.length, 1);
  const row = app.tbody.children[0];
  assert.equal(row.children.length, 4);
  assert.equal(row.children[0].tagName, 'th');
  assert.equal(row.children[0].attributes.scope, 'row');
  assert.equal(row.children[0].textContent, '<script>not markup</script>');

  const values = row.children.slice(1).map(cell => cell.children[0].textContent);
  assert.deepEqual(values, ['Yes', 'No', 'Yes']);
  assert.deepEqual(
    row.children.slice(1).map(cell => cell.children[0].className),
    ['feature-badge yes', 'feature-badge no', 'feature-badge yes']
  );
});

test('comparison renderer shows a safe fallback for malformed data and failed requests', async () => {
  const malformed = createHarness(async () => ({
    ok: true,
    json: async () => [{ feature: 'Missing project values', sneppxov: 'Yes' }]
  }));

  await new Promise(resolve => setImmediate(resolve));
  assert.equal(malformed.tbody.children.length, 1);
  assert.match(malformed.tbody.children[0].children[0].textContent, /could not be loaded/i);
  assert.equal(malformed.tbody.children[0].children[0].colSpan, 4);

  const failed = createHarness(async () => ({ ok: false, status: 503 }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(failed.tbody.children.length, 1);
  assert.match(failed.tbody.children[0].children[0].textContent, /could not be loaded/i);
});

test('comparison renderer rejects empty catalogs and invalid status values without partial output', async () => {
  const empty = createHarness(async () => ({
    ok: true,
    json: async () => []
  }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(empty.tbody.children.length, 1);
  assert.match(empty.tbody.children[0].children[0].textContent, /could not be loaded/i);

  const invalid = createHarness(async () => ({
    ok: true,
    json: async () => [
      {
        feature: 'Valid first row',
        'sneppx-alg': 'No',
        vstodo: 'No',
        sneppxov: 'Yes'
      },
      {
        feature: 'Invalid second row',
        'sneppx-alg': 'No',
        vstodo: 'Maybe',
        sneppxov: 'Yes'
      }
    ]
  }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(invalid.tbody.children.length, 1);
  assert.match(invalid.tbody.children[0].children[0].textContent, /could not be loaded/i);
  assert.equal(invalid.tbody.children[0].children[0].colSpan, 4);
});

test('comparison renderer shows its fallback when the network request rejects', async () => {
  const app = createHarness(async () => {
    throw new Error('Network unavailable');
  });

  await new Promise(resolve => setImmediate(resolve));
  assert.equal(app.tbody.children.length, 1);
  assert.match(app.tbody.children[0].children[0].textContent, /could not be loaded/i);
  assert.equal(app.tbody.children[0].children[0].colSpan, 4);
});

test('comparison renderer rejects missing and blank feature names atomically', async () => {
  for (const feature of [null, '', '   ']) {
    const app = createHarness(async () => ({
      ok: true,
      json: async () => [
        {
          feature: 'Valid row before malformed row',
          'sneppx-alg': 'No',
          vstodo: 'No',
          sneppxov: 'Yes'
        },
        {
          feature,
          'sneppx-alg': 'No',
          vstodo: 'No',
          sneppxov: 'Yes'
        }
      ]
    }));

    await new Promise(resolve => setImmediate(resolve));
    assert.equal(app.tbody.children.length, 1);
    assert.match(app.tbody.children[0].children[0].textContent, /could not be loaded/i);
    assert.equal(app.tbody.children[0].children[0].colSpan, 4);
  }
});

test('comparison renderer exits without fetching when its table structure is absent', () => {
  let requests = 0;
  const fetch = () => {
    requests += 1;
  };

  vm.runInNewContext(source, {
    document: {
      getElementById: () => null
    },
    fetch
  });

  const tableWithoutBody = {
    querySelector: () => null
  };
  vm.runInNewContext(source, {
    document: {
      getElementById: id => id === 'comparisonTable' ? tableWithoutBody : null
    },
    fetch
  });

  assert.equal(requests, 0);
});

test('comparison page exposes an accessible table and a keyboard-scrollable region', () => {
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'comparison.html'),
    'utf8'
  );

  assert.match(html, /<main[\s>]/);
  assert.match(html, /role="region"[^>]*aria-label="Project feature comparison"[^>]*tabindex="0"/);
  assert.match(html, /<table[^>]*id="comparisonTable"[^>]*aria-describedby="comparisonNote"/);
  assert.match(html, /<caption>Verified capabilities across active SneppX projects<\/caption>/);
  assert.match(html, /<th scope="col">SneppX-ALG<\/th>/);
  assert.match(html, /<th scope="col">VSTodo<\/th>/);
  assert.match(html, /<th scope="col">SneppX-OV<\/th>/);
  assert.doesNotMatch(html, /SneppX-Shield|SneppX-Serve/);
  assert.match(html, /<th scope="col">Feature<\/th>/);
  assert.match(html, /<tbody>[\s\S]*Loading comparison data/);
  assert.match(html, /<script src="js\/comparison-table\.js"><\/script>/);
});
