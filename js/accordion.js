// Accordion component JS
(function () {
  'use strict';

  var headers = document.querySelectorAll('.accordion-header');

  headers.forEach(function (header) {
    header.addEventListener('click', function () {
      var isExpanded = header.getAttribute('aria-expanded') === 'true';
      var content = document.getElementById(header.getAttribute('aria-controls'));

      // Close all accordions in the same group
      var group = header.closest('.accordion');
      if (group) {
        group.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(function (h) {
          h.setAttribute('aria-expanded', 'false');
          var c = document.getElementById(h.getAttribute('aria-controls'));
          if (c) c.classList.remove('open');
        });
      }

      if (!isExpanded) {
        header.setAttribute('aria-expanded', 'true');
        if (content) content.classList.add('open');
      }
    });
  });
})();
