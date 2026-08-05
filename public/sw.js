// public/sw.js
// Service worker ringan (tanpa perlu eject CRA / Workbox).
// Strategi:
//  - Aset statis di /static/ (JS/CSS ter-hash) → cache-first. Aman karena
//    nama filenya berubah tiap build baru, jadi cache lama otomatis basi.
//  - HTML/dokumen → network-first, fallback ke cache kalau offline/lemot.
//  - Request cross-origin (Firebase, Cloudinary, dst) dibiarkan lewat
//    langsung — tidak ikut di-cache di sini.
const CACHE_NAME = 'hikimori-v1';
const PRECACHE_URLS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch { return; }
  if (url.origin !== self.location.origin) return; // biarkan CDN/Firebase/Cloudinary lewat network normal

  if (url.pathname.startsWith('/static/')) {
    // Cache-first untuk JS/CSS ter-hash
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => cached);
      })
    );
  } else if (request.mode === 'navigate' || request.destination === 'document') {
    // Network-first untuk halaman HTML supaya konten selalu ter-update,
    // tapi tetap bisa dibuka offline/jaringan mati lewat cache.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match('/index.html')))
    );
  }
});
