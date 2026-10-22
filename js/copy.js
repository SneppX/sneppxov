// Copy-to-clipboard for code blocks
(function () {
  'use strict';

  function init() {
    var blocks = document.querySelectorAll('pre code');
    blocks.forEach(function (code) {
      var pre = code.parentElement;
      if (!pre || pre.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var text = code.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); btn.textContent = 'Copied!'; } catch (e) { btn.textContent = 'Failed'; }
          document.body.removeChild(ta);
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        }
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
