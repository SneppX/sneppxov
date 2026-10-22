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
    data.forEach(function (d) { set[d.category] = true; });
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
    data.forEach(function (d) {
      if (activeCategory !== 'All' && d.category !== activeCategory) return;
      if (q && (d.title + ' ' + d.description + ' ' + d.category).toLowerCase().indexOf(q) === -1) return;
      var card = document.createElement('div');
      card.className = 'feature-card reveal';
      card.innerHTML = '<h3>' + escapeHtml(d.title) + '</h3>' +
        '<p>' + escapeHtml(d.description) + '</p>' +
        '<p style="font-size:0.8rem;margin-top:0.5rem;"><span style="color:var(--accent);">' + escapeHtml(d.category) + '</span>' +
        (d.source ? ' · <a href="https://github.com/SneppX/sneppx-alg/blob/main/' + encodeURIComponent(d.source) + '" target="_blank" rel="noopener">source</a>' : '') +
        (d.test ? ' · <a href="https://github.com/SneppX/sneppx-alg/blob/main/' + encodeURIComponent(d.test) + '" target="_blank" rel="noopener">test</a>' : '') +
        '</p>';
      grid.appendChild(card);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  fetch('data/components.json')
    .then(function (r) { return r.json(); })
    .then(function (json) { data = json; renderChips(); renderGrid(); })
    .catch(function (e) { grid.textContent = 'Failed to load components: ' + e; });

  if (search) {
    search.addEventListener('input', renderGrid);
  }
})();
