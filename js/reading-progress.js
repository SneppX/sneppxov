// Reading progress bar
(function () {
  'use strict';

  var bar = document.getElementById('readingProgress');
  if (!bar) return;

  function update() {
    var winHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight - winHeight;
    var scrolled = window.scrollY;
    var pct = (scrolled / docHeight) * 100;
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }

  window.addEventListener('scroll', update);
  update();
})();
