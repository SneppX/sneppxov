// Code playground JS
(function () {
  'use strict';

  var playgrounds = document.querySelectorAll('.playground');

  playgrounds.forEach(function (pg) {
    var runBtn = pg.querySelector('.playground-run');
    var output = pg.querySelector('.playground-output');
    var editor = pg.querySelector('textarea, pre code');

    if (!runBtn || !output) return;

    runBtn.addEventListener('click', function () {
      var code = editor ? editor.textContent : '';
      output.textContent = 'Executing...\n';
      
      try {
        // Safe eval for demo purposes only
        var result = eval(code);
        output.textContent += 'Result: ' + String(result) + '\n';
        output.style.color = '#0f0';
      } catch (err) {
        output.textContent += 'Error: ' + err.message + '\n';
        output.style.color = '#f44';
      }
    });
  });
})();
