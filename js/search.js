// Search component JS
(function () {
  'use strict';

  var boxes = document.querySelectorAll('.search-box');

  boxes.forEach(function (box) {
    var input = box.querySelector('input');
    var results = box.querySelector('.search-results');
    var dataAttr = box.getAttribute('data-search');
    var data = [];

    if (!input || !results || !dataAttr) return;

    fetch(dataAttr)
      .then(function (r) { return r.json(); })
      .then(function (json) { data = json; });

    input.addEventListener('input', function () {
      var q = input.value.toLowerCase().trim();
      results.innerHTML = '';

      if (!q) {
        results.classList.remove('open');
        return;
      }

      var matches = data.filter(function (d) {
        return (d.title + ' ' + d.description + ' ' + d.category).toLowerCase().includes(q);
      }).slice(0, 10);

      if (matches.length === 0) {
        results.innerHTML = '<div class="search-empty">No results found</div>';
        results.classList.add('open');
        return;
      }

      matches.forEach(function (m) {
        var item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = '<div class="title">' + escapeHtml(m.title) + '</div>' +
          '<div class="desc">' + escapeHtml(m.description) + '</div>';
        item.addEventListener('click', function () {
          if (m.source) {
            window.open('https://github.com/SneppX/sneppx-alg/blob/main/' + encodeURIComponent(m.source), '_blank');
          }
          results.classList.remove('open');
          input.value = '';
        });
        results.appendChild(item);
      });

      results.classList.add('open');
    });

    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) {
        results.classList.remove('open');
      }
    });
  });

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
