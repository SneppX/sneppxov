// Keyboard shortcuts
(function () {
  'use strict';

  var shortcuts = {
    'h': 'index.html',
    'c': 'components.html',
    'f': 'features.html',
    'e': 'engine.html',
    's': 'security.html',
    'd': 'docs.html',
    'm': 'community.html',
    '?': null
  };

  var helpShown = false;

  function showHelp() {
    if (helpShown) return;
    helpShown = true;
    var help = document.createElement('div');
    help.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--card-bg);border:1px solid var(--border);padding:2rem;border-radius:12px;z-index:1000;color:var(--fg);max-width:400px;';
    help.innerHTML = '<h3 style="color:var(--accent);">Keyboard Shortcuts</h3><ul style="margin:0;padding-left:1rem;">' +
      Object.entries(shortcuts).map(function ([key, page]) {
        return '<li><kbd style="background:var(--bg);border:1px solid var(--border);padding:0.2rem 0.4rem;border-radius:4px;">' + key + '</kbd> ' + (page ? page : 'Help') + '</li>';
      }).join('') +
      '</ul><button onclick="this.parentElement.remove()" style="background:var(--accent);color:#fff;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;">Close</button>';
    document.body.appendChild(help);
    setTimeout(function () { helpShown = false; }, 3000);
  }

  document.addEventListener('keydown', function (e) {
    var key = e.key.toLowerCase();
    if (key === '?') {
      e.preventDefault();
      showHelp();
      return;
    }
    if (shortcuts[key]) {
      e.preventDefault();
      window.location.href = shortcuts[key];
    }
  });
})();
