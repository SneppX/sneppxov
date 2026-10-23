// Font size adjuster with localStorage persistence
(function () {
  'use strict';

  var root = document.documentElement;
  var currentSize = parseFloat(localStorage.getItem('sx-font-size') || '1');

  function applySize(size) {
    root.style.fontSize = (size * 100) + '%';
    localStorage.setItem('sx-font-size', size);
    var display = document.getElementById('fontSizeValue');
    if (display) display.textContent = size.toFixed(1) + 'x';
  }

  applySize(currentSize);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.font-size-btn');
    if (!btn) return;

    if (btn.classList.contains('font-size-increase')) {
      currentSize = Math.min(currentSize + 0.1, 2);
    } else if (btn.classList.contains('font-size-decrease')) {
      currentSize = Math.max(currentSize - 0.1, 0.5);
    } else if (btn.classList.contains('font-size-reset')) {
      currentSize = 1;
    }
    applySize(currentSize);
  });
})();
