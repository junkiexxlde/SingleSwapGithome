// Increment SW_VERSION with every deployment.
// Keep in sync with APP_VERSION in app-version.js.
const SW_VERSION = '018';
const CACHE_NAME = `mdwmt-v${SW_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './singleswap.html',
  './overview.html',
  './assetmanagement.html',
  './monthlyinventory.html',
  './styles.css',
  './app-version.js',
  './navigation.js',
  './scripts.js',
  './overview.js',
  './assetmanagement.js',
  './monthlyinventory.js',
  './manifest.json'
];

// Install: pre-cache app shell and activate immediately (no waiting for old tabs)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Pre-cache failed:', err))
  );
});

// Activate: delete all stale cache generations and claim all open tabs immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting stale cache:', name);
            return caches.delete(name);
          })
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => {
        // Notify all open tabs that a new version is active
        clients.forEach(client =>
          client.postMessage({ type: 'SW_UPDATED', version: SW_VERSION })
        );
      })
  );
});

// Fetch: network-first for same-origin requests so fresh JS/CSS is always served.
// Falls back to cache when offline.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Pass through non-same-origin requests (CDN assets, external APIs) unmodified
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Update cache with fresh response
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Offline fallback: serve from cache if available
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          console.warn('[SW] Offline – no cached response for:', event.request.url);
          return new Response('Offline – please reconnect and reload.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        })
      )
  );
});
