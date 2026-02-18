self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('zen-notes-v1').then((cache) => cache.addAll([
      './',
      './index.html',
      './style.css',
      './script.js',
      './icon.jpg'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
