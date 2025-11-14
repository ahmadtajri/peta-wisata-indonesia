/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'story-app-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles/styles.css',
  './scripts/index.js',
  './images/logo.png',
]

// Instalasi Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
      .then((cache) => {
        console.log('[SW] Caching app shell...');
        return Promise.all(
          urlsToCache.map((url) =>
            cache.add(url).catch((err) =>
              console.warn(`[SW] Failed to cache ${url}:`, err)
            )
          )
        );
      })
  );
});

// Aktivasi dan hapus cache lama
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
