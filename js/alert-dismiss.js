// Alert dismiss
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.alert-close');
    if (!btn) return;
    var alert = btn.closest('.alert');
    if (alert) alert.style.display = 'none';
  });
})();
