// System theme detection
(function () {
  'use strict';

  var root = document.documentElement;
  var indicator = document.getElementById('systemThemeIndicator');

  function updateSystemIndicator() {
    if (!indicator) return;
    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    indicator.className = 'system-theme-indicator ' + (isDark ? 'dark' : 'light');
    indicator.setAttribute('title', 'System theme: ' + (isDark ? 'Dark' : 'Light'));
  }

  updateSystemIndicator();

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSystemIndicator);
  }
})();
