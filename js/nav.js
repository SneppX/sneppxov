// Accessible mobile navigation toggle.
(function () {
  'use strict';

  var hamburger = document.getElementById('hamburger');
  var nav = document.querySelector('.site-nav');

  if (!hamburger || !nav) return;

  function setOpen(open) {
    hamburger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  hamburger.setAttribute('aria-controls', nav.id || 'siteNav');
  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', function () {
    setOpen(hamburger.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      hamburger.focus();
    }
  });
})();
