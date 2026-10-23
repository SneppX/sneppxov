// Simple bar chart renderer
(function () {
  'use strict';

  var containers = document.querySelectorAll('.bar-chart');

  containers.forEach(function (container) {
    var bars = container.querySelectorAll('.bar');
    var maxHeight = 200;

    bars.forEach(function (bar) {
      var value = parseFloat(bar.getAttribute('data-value') || '0');
      var pct = (value / maxHeight) * 100;
      bar.style.height = Math.min(100, Math.max(0, pct)) + '%';

      var valueEl = document.createElement('span');
      valueEl.className = 'bar-value';
      valueEl.textContent = value;
      bar.appendChild(valueEl);
    });
  });
})();
