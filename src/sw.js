// ========================================
// CACHE CONFIGURATION
// ========================================
const CACHE_VERSION = 'v2.0.2';
const CACHE_PREFIX = 'peta-wisata';

const CACHES = {
  STATIC: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  DYNAMIC: `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`,
  IMAGES: `${CACHE_PREFIX}-images-${CACHE_VERSION}`,
  API: `${CACHE_PREFIX}-api-${CACHE_VERSION}`,
};

// Static assets yang akan di-cache saat install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
];

// API endpoints yang akan di-cache
const API_BASE_URL = 'https://story-api.dicoding.dev/v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// ========================================
// INSTALL EVENT - Cache Static Assets
// ========================================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 📦 Installing v2.0.2...');

  event.waitUntil(
    caches
      .open(CACHES.STATIC)
      .then((cache) => {
        console.log('[Service Worker] 💾 Caching static assets');
        // Cache assets one by one untuk avoid blocking
        return Promise.all(
          STATIC_ASSETS.map((url) => {
            return cache.add(url).catch((error) => {
              console.warn(`[Service Worker] ⚠️ Failed to cache ${url}:`, error);
            });
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] ✅ Static assets cached');
      })
      .catch((error) => {
        console.error('[Service Worker] ❌ Install failed:', error);
      })
  );

  // Activate immediately
  self.skipWaiting();
});

// ========================================
// ACTIVATE EVENT - Clean Old Caches
// ========================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 🚀 Activating v2.0.2...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName.startsWith(CACHE_PREFIX) && !Object.values(CACHES).includes(cacheName)) {
              console.log('[Service Worker] 🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] ✅ Old caches cleaned');
      })
  );

  return self.clients.claim();
});

// ========================================
// FETCH EVENT - Advanced Caching Strategies
// ========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // 🎯 Strategy 1: Network First (Static Assets)
  if (isStaticAsset(url)) {
    event.respondWith(networkFirstWithCache(request, CACHES.STATIC));
    return;
  }

  // 🎯 Strategy 2: Network First (API Data)
  if (isApiRequest(url)) {
    event.respondWith(networkFirstWithCache(request, CACHES.API));
    return;
  }

  // 🎯 Strategy 3: Network First with Cache Fallback (Images)
  if (isImageRequest(url)) {
    event.respondWith(networkFirstWithCache(request, CACHES.IMAGES));
    return;
  }

  // 🎯 Strategy 4: Network First (Dynamic Content)
  event.respondWith(networkFirstWithCache(request, CACHES.DYNAMIC));
});

// ========================================
// CACHING STRATEGIES
// ========================================

// Strategy 1: Cache First
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);

  if (cached) {
    console.log('[Service Worker] 📦 From cache:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log('[Service Worker] 🌐 From network (cached):', request.url);
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] ❌ Fetch failed:', error);
    return getOfflineFallback(request);
  }
}

// Strategy 2: Stale While Revalidate (ADVANCED)
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);

  // Return cache immediately (stale)
  const fetchPromise = fetch(request)
    .then((response) => {
      const cache = caches.open(cacheName);

      // Update cache in background (revalidate)
      cache.then((c) => {
        if (request.method === 'GET') {
          c.put(request, response.clone());
          console.log('[Service Worker] 🔄 Cache updated:', request.url);
        }
      });

      return response;
    })
    .catch((error) => {
      console.error('[Service Worker] ❌ Network failed:', error);
      // Return offline fallback if no cache
      if (!cached) {
        return getOfflineFallback(request);
      }
    });

  // Return cache or wait for network
  return cached || fetchPromise;
}

// Strategy 3: Network First with Cache Fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    console.log('[Service Worker] 🌐 Fetching:', request.method, request.url);
    const response = await fetch(request);

    // Only cache successful responses and GET requests
    if (response && response.status === 200 && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log('[Service Worker] 💾 Cached:', request.url);
    }

    return response;
  } catch (error) {
    console.log('[Service Worker] ❌ Network failed:', request.method, request.url);

    // For non-GET requests (POST, PUT, DELETE), don't return fallback
    // Let the error propagate to the application
    if (request.method !== 'GET') {
      console.log('[Service Worker] ⚠️ Non-GET request failed, throwing error');
      throw error;
    }

    // For GET requests, try cache fallback
    const cached = await caches.match(request);

    if (cached) {
      console.log('[Service Worker] 📦 Returning cached response');
      return cached;
    }

    return getOfflineFallback(request);
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function isStaticAsset(url) {
  return (
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.startsWith('/images/icons/')
  );
}

function isApiRequest(url) {
  return url.href.includes(API_BASE_URL);
}

function isImageRequest(url) {
  return (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg')
  );
}

async function getOfflineFallback(request) {
  // Return offline page untuk navigation requests
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }

  // Return placeholder image untuk image requests
  if (isImageRequest(new URL(request.url))) {
    return new Response(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#e2e8f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b">Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  // Return offline JSON untuk API requests
  if (isApiRequest(new URL(request.url))) {
    return new Response(
      JSON.stringify({
        error: true,
        message: 'Offline - Data dari cache',
        offline: true,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 503,
      }
    );
  }

  return new Response('Offline', { status: 503 });
}

// ========================================
// PUSH NOTIFICATION
// ========================================
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 🔔 Push received');

  let notificationData = {
    title: 'Peta Wisata Indonesia',
    body: 'Ada update baru!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-192x192.png',
    data: { url: '/' },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        image: payload.image,
        tag: payload.tag || 'default',
        data: {
          url: payload.url || '/',
          storyId: payload.storyId,
        },
        actions: payload.actions || [
          { action: 'view', title: '👁️ Lihat' },
          { action: 'close', title: '❌ Tutup' },
        ],
      };
    } catch (error) {
      console.error('[Service Worker] Push parse error:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      image: notificationData.image,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const url = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus().then(() => {
            return client.postMessage({ type: 'NAVIGATE', url });
          });
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ========================================
// MESSAGE HANDLER
// ========================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] 🚀 Loaded v2.0.2');