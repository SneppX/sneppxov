// Toast API convenience methods
(function () {
  'use strict';

  window.showSuccess = function (msg, duration) {
    window.showToast(msg, 'success', duration);
  };

  window.showError = function (msg, duration) {
    window.showToast(msg, 'error', duration);
  };

  window.showInfo = function (msg, duration) {
    window.showToast(msg, 'info', duration);
  };

  window.showWarning = function (msg, duration) {
    window.showToast(msg, 'warning', duration);
  };
})();
