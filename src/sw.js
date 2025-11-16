/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'peta-wisata-v2';
const urlsToCache = [
  '/',
  '/index.html',
  // Webpack bundle files akan di-cache saat fetch
  // '/app.bundle.js', // Jangan cache bundle karena nama berubah
];

// ========================================
// INSTALL EVENT - Cache Resources
// ========================================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ========================================
// ACTIVATE EVENT - Clean Old Caches
// ========================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// ========================================
// FETCH EVENT - Network First Strategy
// ========================================
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response karena hanya bisa dibaca sekali
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback ke cache jika offline
        return caches.match(event.request);
      })
  );
});

// ========================================
// PUSH EVENT - Handle Push Notification
// ========================================
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received:', event);

  let notificationData = {
    title: 'Peta Wisata Indonesia',
    body: 'Ada update baru!',
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    data: {
      url: '/',
    },
  };

  // 🎯 SKILLED: Parse dynamic data dari server
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[Service Worker] Push payload:', payload);

      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        image: payload.image, // Optional: Large image
        tag: payload.tag || 'default-tag', // Untuk grouping notifikasi
        requireInteraction: payload.requireInteraction || false,
        data: {
          url: payload.url || '/',
          storyId: payload.storyId,
          ...payload.data,
        },
        // 🎯 ADVANCED: Actions pada notifikasi
        actions: payload.actions || [
          {
            action: 'view',
            title: 'Lihat Detail',
            icon: '/images/icon-192.png',
          },
          {
            action: 'close',
            title: 'Tutup',
            icon: '/images/icon-192.png',
          },
        ],
      };
    } catch (error) {
      console.error('[Service Worker] Error parsing push payload:', error);
    }
  }

  // Tampilkan notifikasi
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      image: notificationData.image,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: notificationData.actions,
      vibrate: [200, 100, 200], // Pola getar
      timestamp: Date.now(),
    })
  );
});

// ========================================
// NOTIFICATION CLICK EVENT
// ========================================
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data;

  notification.close();

  // 🎯 ADVANCED: Handle action buttons
  if (action === 'close') {
    console.log('[Service Worker] User closed notification');
    return;
  }

  // Default action atau action 'view'
  let targetUrl = data.url || '/';

  // Jika ada storyId, arahkan ke detail page
  if (data.storyId) {
    targetUrl = `/#/story/${data.storyId}`;
  }

  console.log('[Service Worker] Opening URL:', targetUrl);

  // Buka atau focus ke window yang ada
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Cek apakah ada window yang sudah terbuka
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tidak ada, buka window baru
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ========================================
// MESSAGE EVENT - Communication dengan Client
// ========================================
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});