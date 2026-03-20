// LeStar Z Pool Suite — Service Worker
// Bump VERSION with every GitHub push to force update on all devices
const VERSION = 'lz-pool-v1.0.0';

const FILES = [
  '/aimer.html',
  '/banker.html',
  '/kicker.html',
];

// Install — cache all files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(VERSION).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
