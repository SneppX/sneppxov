// SneppX-Alg website — app.js
(function () {
  'use strict';

  // Theme toggle
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('sx-theme', next); } catch (e) { /* ignore */ }
    });
  }

  // Restore theme
  try {
    var saved = localStorage.getItem('sx-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) { /* ignore */ }

  // Mobile menu toggle (placeholder)
  // Scroll-reveal (placeholder)
  // Stat count-up (placeholder)
  // Search (placeholder)

  console.log('sneppxov loaded');
})();
