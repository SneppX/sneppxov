// PWA Service Worker
const CACHE_NAME = 'sneppxov-v1';
const ASSETS = [
  './',
  'index.html',
  'components.html',
  'features.html',
  'engine.html',
  'security.html',
  'docs.html',
  'community.html',
  '404.html',
  'style.css',
  'css/nav.css',
  'css/hero.css',
  'css/features.css',
  'css/cards.css',
  'css/breadcrumb.css',
  'css/back-to-top.css',
  'css/reading-progress.css',
  'css/modal.css',
  'css/accordion.css',
  'css/tabs.css',
  'css/tooltip.css',
  'css/dropdown.css',
  'css/syntax-highlight.css',
  'css/font-size.css',
  'css/print.css',
  'css/charts.css',
  'css/search.css',
  'css/comparison-table.css',
  'css/system-theme.css',
  'css/accessibility.css',
  'css/toast.css',
  'css/social-share.css',
  'app.js',
  'js/theme.js',
  'js/nav.js',
  'js/reveal.js',
  'js/countup.js',
  'js/copy.js',
  'js/back-to-top.js',
  'js/reading-progress.js',
  'js/keyboard-shortcuts.js',
  'js/modal.js',
  'js/accordion.js',
  'js/tabs.js',
  'js/dropdown.js',
  'js/syntax-highlight.js',
  'js/font-size.js',
  'js/print.js',
  'js/charts.js',
  'js/search.js',
  'js/comparison-table.js',
  'js/system-theme.js',
  'js/focus-trap.js',
  'js/toast.js',
  'js/social-share.js',
  'js/render.js',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
