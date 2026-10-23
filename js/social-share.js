// Social share buttons JS
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.share-btn');
    if (!btn) return;

    e.preventDefault();

    var url = btn.getAttribute('data-url') || window.location.href;
    var text = btn.getAttribute('data-text') || document.title;
    var type = btn.classList.contains('twitter') ? 'twitter' :
               btn.classList.contains('facebook') ? 'facebook' :
               btn.classList.contains('linkedin') ? 'linkedin' :
               btn.classList.contains('reddit') ? 'reddit' :
               'hackernews';

    var shareUrl = '';
    switch (type) {
      case 'twitter':
        shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
        break;
      case 'facebook':
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
        break;
      case 'linkedin':
        shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
        break;
      case 'reddit':
        shareUrl = 'https://www.reddit.com/submit?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(text);
        break;
      case 'hackernews':
        shareUrl = 'https://news.ycombinator.com/submitlink?u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(text);
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  });
})();
