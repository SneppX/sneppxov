// Dropdown menu JS
(function () {
  'use strict';

  var toggles = document.querySelectorAll('.dropdown-toggle');

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var dropdown = toggle.closest('.dropdown');
      var isOpen = dropdown.classList.contains('open');

      // Close all open dropdowns
      document.querySelectorAll('.dropdown.open').forEach(function (d) {
        d.classList.remove('open');
      });

      if (!isOpen) {
        dropdown.classList.add('open');
      }
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  });
})();
