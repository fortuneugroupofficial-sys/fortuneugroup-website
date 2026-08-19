/* ============================================================
   Fortune U Group — Service Worker (offline-first PWA)
   - Pre-caches the app shell (HTML, manifest, icons)
   - Cache-first for static assets (stale-while-revalidate)
   - Network-first for page navigations, with offline fallback
     to the cached app shell so the SPA still loads offline.
============================================================ */

const CACHE_VERSION = "fortuneugroup-v1";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

/* Assets to pre-cache on install. Keep the list aligned with the
   files served from /public. */
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/favicon-32x32.png",
  "/favicon-48x48.png",
  "/favicon.ico",
];

/* Install: pre-cache the app shell and take control immediately. */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* Activate: clean up old cache versions. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("fortuneugroup-") && ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* Fetch: route requests appropriately. */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests on http(s).
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Do not intercept cross-origin requests (fonts, analytics, images).
  if (url.origin !== self.location.origin) return;

  // Page navigations: network-first, fall back to the cached app shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() =>
          caches
            .match("/index.html")
            .then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  // Static assets: cache-first with stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
