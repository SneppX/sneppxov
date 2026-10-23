// Tabs component JS
(function () {
  'use strict';

  var tablists = document.querySelectorAll('.tablist');

  tablists.forEach(function (tablist) {
    var tabs = tablist.querySelectorAll('button');
    var tabId = tablist.getAttribute('id');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Deactivate all tabs in this tablist
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', 'false');
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.classList.remove('active');
        });

        // Activate clicked tab
        tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.classList.add('active');
      });
    });
  });
})();
