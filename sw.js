// PWA service worker. Bump the cache key whenever the offline shell changes.
const CACHE_NAME = 'sneppxov-v5';
const ASSETS = [
  './','index.html','components.html','features.html','comparison.html','engine.html','security.html','docs.html','community.html','404.html','changelog.html','sitemap.html',
  'style.css','css/nav.css','css/hero.css','css/features.css','css/cards.css','css/comparison-table.css',
  'app.js','js/theme.js','js/nav.js','js/reveal.js','js/countup.js','js/copy.js','js/comparison-table.js','js/render.js','js/sw-register.js',
  'favicon.svg','data/comparison.json','data/components.json','data/features.json','manifest.json'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('fetch',event=>{event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));});
