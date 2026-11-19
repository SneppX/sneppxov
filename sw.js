// PWA service worker. Bump the cache name when the offline shell changes.
const CACHE_NAME = 'sneppxov-v8';
const ASSETS = [
  './',
  'index.html',
  'about.html',
  'projects.html',
  'developers.html',
  'updates.html',
  'community.html',
  'components.html',
  'features.html',
  'engine.html',
  'security.html',
  'docs.html',
  '404.html',
  'changelog.html',
  'sitemap.html',
  'style.css',
  'css/sneppxov-v2.css',
  'css/nav.css',
  'css/hero.css',
  'css/features.css',
  'css/cards.css',
  'js/theme.js',
  'js/nav.js',
  'js/site.js',
  'js/sw-register.js',
  'favicon.svg',
  'manifest.json',
  'data/components.json',
  'data/features.json'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  })));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
