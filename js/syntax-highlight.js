// Syntax highlighting for code blocks
(function () {
  'use strict';

  function highlight(code) {
    return code
      .replace(/\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|class|new|this|typeof|instanceof|void|delete|in|of|async|await|yield|export|import|default|static|extends|super)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(\w+)(?=\s*\()/g, '<span class="function">$1</span>')
      .replace(/"([^"]*)"|'([^']*)'/g, '<span class="string">$1$2</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/<(\w+)(\s[^>]*)?>/g, '<span class="tag">&lt;$1</span>$2&gt;')
      .replace(/(\w+)=/g, '<span class="attr">$1</span>=');
  }

  document.querySelectorAll('pre code').forEach(function (code) {
    var original = code.textContent;
    code.innerHTML = highlight(original);
  });
})();
