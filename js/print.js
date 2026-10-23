// Print button
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('print-btn') || e.target.closest('.print-btn')) {
      e.preventDefault();
      window.print();
    }
  });
})();
