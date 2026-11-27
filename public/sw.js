/*
 * Better Botolan — service worker (hand-rolled, no build dependency).
 *
 * Goal: keep the portal usable with a weak signal or none at all — which is
 * exactly when Botolan residents need the hotlines, evacuation centers and
 * preparedness guide (typhoons, Pinatubo lahars). Because all curated content
 * is bundled into the app's JavaScript, caching the app shell makes those
 * pages work offline; only live features (weather, exchange rates, the
 * Facebook feed, the national budget API) need a connection and degrade
 * gracefully on their own.
 *
 * Strategy:
 *  - Precache a tiny shell: "/", offline.html, manifest, icons.
 *  - Navigations  -> network-first, fall back to cached "/" (SPA shell),
 *                    then offline.html. Keeps the app fresh when online.
 *  - Hashed assets (/assets/*) -> cache-first (filenames are immutable).
 *  - Same-origin images (/images/*, /icons/*) -> stale-while-revalidate.
 *  - Cross-origin (APIs, map tiles, fonts) -> left to the network.
 *
 * Bump CACHE_VERSION on any change here to retire old caches.
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `bb-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `bb-assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `bb-images-${CACHE_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE, IMAGE_CACHE];

const SHELL_URLS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/botolan.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
];

const IMAGE_CACHE_LIMIT = 80;

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // addAll fails whole if one URL 404s; add individually and ignore misses.
      .then(cache =>
        Promise.all(
          SHELL_URLS.map(url =>
            cache
              .add(new Request(url, { cache: 'reload' }))
              .catch(() => undefined)
          )
        )
      )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k.startsWith('bb-') && !CURRENT_CACHES.includes(k))
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Let the page tell a waiting worker to take over immediately.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isHashedAsset(url) {
  return url.pathname.startsWith('/assets/');
}

function isCacheableImage(url) {
  return (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/barangays/') ||
    url.pathname.startsWith('/leaders/') ||
    url.pathname === '/botolan.png'
  );
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  for (let i = 0; i < keys.length - maxItems; i++) {
    await cache.delete(keys[i]);
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(request);
    // Keep the shell copy current for offline boots.
    cache.put('/', fresh.clone()).catch(() => undefined);
    return fresh;
  } catch {
    return (
      (await cache.match('/')) ||
      (await cache.match(request)) ||
      (await cache.match('/offline.html')) ||
      Response.error()
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const fresh = await fetch(request);
  if (fresh && fresh.ok)
    cache.put(request, fresh.clone()).catch(() => undefined);
  return fresh;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const network = fetch(request)
    .then(fresh => {
      if (fresh && fresh.ok) {
        cache.put(request, fresh.clone()).catch(() => undefined);
        trimCache(cacheName, IMAGE_CACHE_LIMIT);
      }
      return fresh;
    })
    .catch(() => undefined);
  return hit || network || fetch(request);
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle our own origin; let cross-origin (APIs, tiles, fonts) pass.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (isCacheableImage(url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }
});
