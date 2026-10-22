// Theme toggle with localStorage persistence
(function () {
  'use strict';

  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('sx-theme', theme); } catch (e) { /* ignore */ }
  }

  // Restore saved theme on load
  try {
    var saved = localStorage.getItem('sx-theme');
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  } catch (e) { /* ignore */ }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
