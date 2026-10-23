// Toast notification system
(function () {
  'use strict';

  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  window.showToast = function (message, type, duration) {
    if (type === undefined) type = 'info';
    if (duration === undefined) duration = 3000;

    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span>' + escapeHtml(message) + '</span>' +
      '<button class="toast-close" aria-label="Dismiss">×</button>';

    container.appendChild(toast);

    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function () {
      removeToast(toast);
    });

    setTimeout(function () {
      removeToast(toast);
    }, duration);
  };

  function removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
