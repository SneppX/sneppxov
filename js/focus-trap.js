// Focus trap for modals
(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;

    var openModal = document.querySelector('.modal-overlay.open');
    if (!openModal) return;

    var focusable = openModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
