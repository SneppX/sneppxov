// Modal dialog controller
(function () {
  'use strict';

  var triggers = document.querySelectorAll('[data-modal]');
  var closes = document.querySelectorAll('.modal-close');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var id = trigger.getAttribute('data-modal');
      var modal = document.getElementById(id);
      if (modal) modal.classList.add('open');
    });
  });

  closes.forEach(function (close) {
    close.addEventListener('click', function () {
      var modal = close.closest('.modal-overlay');
      if (modal) modal.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
        m.classList.remove('open');
      });
    }
  });
})();
