// Search component JS
(function () {
  'use strict';

  var boxes = document.querySelectorAll('.search-box');

  boxes.forEach(function (box) {
    var input = box.querySelector('input');
    var results = box.querySelector('.search-results');
    var dataAttr = box.getAttribute('data-search');
    var data = [];
    var loadFailed = false;

    if (!input || !results || !dataAttr) return;

    fetch(dataAttr)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Search data request failed: ' + response.status);
        }
        return response.json();
      })
      .then(function (json) {
        if (!Array.isArray(json)) {
          throw new TypeError('Search data must be an array');
        }
        data = json.filter(function (entry) {
          return entry && typeof entry === 'object' && !Array.isArray(entry);
        });
      })
      .catch(function () {
        loadFailed = true;
        data = [];
      });

    input.addEventListener('input', function () {
      var q = String(input.value || '').toLowerCase().trim();
      results.innerHTML = '';

      if (!q) {
        results.classList.remove('open');
        return;
      }

      if (loadFailed) {
        results.innerHTML = '<div class="search-empty">Search data is unavailable</div>';
        results.classList.add('open');
        return;
      }

      var matches = data.filter(function (entry) {
        var searchable = [
          entry.title,
          entry.description,
          entry.category
        ].map(function (value) {
          return value == null ? '' : String(value);
        }).join(' ').toLowerCase();
        return searchable.includes(q);
      }).slice(0, 10);

      if (matches.length === 0) {
        results.innerHTML = '<div class="search-empty">No results found</div>';
        results.classList.add('open');
        return;
      }

      matches.forEach(function (entry) {
        var source = safeSourcePath(entry.source);
        var item = document.createElement(source ? 'a' : 'div');
        item.className = 'search-result-item';
        if (source) {
          item.href = 'https://github.com/SneppX/sneppx-alg/blob/main/' + source;
          item.target = '_blank';
          item.rel = 'noopener noreferrer';
          item.addEventListener('click', function () {
            results.classList.remove('open');
            input.value = '';
          });
        }
        item.innerHTML = '<div class="title">' + escapeHtml(entry.title || '') + '</div>' +
          '<div class="desc">' + escapeHtml(entry.description || '') + '</div>';
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


  function safeSourcePath(value) {
    if (typeof value !== 'string') return null;
    var source = value.trim();
    if (!source || source.charAt(0) === '/' || source.indexOf('\\') !== -1 ||
        /[?#:\\u0000-\\u001f]/.test(source)) {
      return null;
    }
    var segments = source.split('/');
    if (segments.some(function (segment) {
      return !segment || segment === '.' || segment === '..';
    })) {
      return null;
    }
    return segments.map(encodeURIComponent).join('/');
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
