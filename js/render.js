// Render components from data/components.json with filter chips + search
(function () {
  'use strict';

  var grid = document.getElementById('compGrid');
  var filters = document.getElementById('compFilters');
  var search = document.getElementById('compSearch');
  if (!grid) return;

  var data = [];
  var activeCategory = 'All';

  function categories() {
    var set = { 'All': true };
    data.forEach(function (entry) {
      var category = String(entry.category || 'Uncategorized');
      set[category] = true;
    });
    return Object.keys(set);
  }

  function renderChips() {
    if (!filters) return;
    filters.innerHTML = '';
    categories().forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'chip' + (cat === activeCategory ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', function () {
        activeCategory = cat;
        renderChips();
        renderGrid();
      });
      filters.appendChild(btn);
    });
  }

  function renderGrid() {
    var q = (search ? search.value : '').toLowerCase().trim();
    grid.innerHTML = '';
    data.forEach(function (entry) {
      var title = entry.title == null ? '' : String(entry.title);
      var description = entry.description == null ? '' : String(entry.description);
      var category = String(entry.category || 'Uncategorized');
      if (activeCategory !== 'All' && category !== activeCategory) return;
      if (q && (title + ' ' + description + ' ' + category).toLowerCase().indexOf(q) === -1) return;

      var source = safeSourcePath(entry.source);
      var test = safeSourcePath(entry.test);
      var sourceLink = source
        ? ' · <a href="https://github.com/SneppX/sneppx-alg/' +
          (source.directory ? 'tree' : 'blob') + '/main/' + source.path +
          '" target="_blank" rel="noopener noreferrer">source</a>'
        : '';
      var testLink = test && !test.directory
        ? ' · <a href="https://github.com/SneppX/sneppx-alg/blob/main/' +
          test.path + '" target="_blank" rel="noopener noreferrer">test</a>'
        : '';

      var card = document.createElement('div');
      card.className = 'feature-card reveal';
      card.innerHTML = '<h3>' + escapeHtml(title) + '</h3>' +
        '<p>' + escapeHtml(description) + '</p>' +
        '<p style="font-size:0.8rem;margin-top:0.5rem;"><span style="color:var(--accent);">' +
        escapeHtml(category) + '</span>' + sourceLink + testLink + '</p>';
      grid.appendChild(card);
    });
  }


  function safeSourcePath(value) {
    if (typeof value !== 'string') return null;
    var source = value.trim();
    if (!source || source.charAt(0) === '/' || source.indexOf('\\') !== -1 ||
        /[?#:\x00-\x1f]/.test(source)) {
      return null;
    }

    var directory = source.charAt(source.length - 1) === '/';
    var segments = source.split('/');
    if (directory) segments.pop();
    if (segments.some(function (segment) {
      return !segment || segment === '.' || segment === '..';
    })) {
      return null;
    }

    return {
      path: segments.map(encodeURIComponent).join('/') + (directory ? '/' : ''),
      directory: directory
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  fetch('data/components.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Components request failed: ' + response.status);
      }
      return response.json();
    })
    .then(function (json) {
      if (!Array.isArray(json)) {
        throw new TypeError('Components data must be an array');
      }
      data = json.filter(function (entry) {
        return entry && typeof entry === 'object' && !Array.isArray(entry);
      });
      renderChips();
      renderGrid();
    })
    .catch(function () {
      data = [];
      if (filters) filters.textContent = '';
      grid.textContent = 'Components could not be loaded. Please refresh the page.';
    });

  if (search) {
    search.addEventListener('input', renderGrid);
  }
})();
