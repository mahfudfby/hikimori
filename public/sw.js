// public/sw.js — service worker ringan.
//  - /static/* (JS/CSS ber-hash) → cache-first (nama file berubah tiap build)
//  - halaman HTML → network-first, fallback cache saat offline
//  - gambar Cloudinary → stale-while-revalidate (kunjungan ulang instan)
//  - Firebase/Firestore → TIDAK disentuh
const VERSION = 'hikimori-v2';
const STATIC = VERSION + '-static';
const IMG = VERSION + '-img';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => c.addAll(['/', '/index.html'])).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

const putSafe = (cacheName, req, res) => {
  if (res && (res.ok || res.type === 'opaque')) caches.open(cacheName).then((c) => c.put(req, res)).catch(() => {});
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }

  if (url.hostname === 'res.cloudinary.com') {
    e.respondWith(
      caches.open(IMG).then((c) => c.match(req).then((hit) => {
        const net = fetch(req).then((res) => { putSafe(IMG, req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/static/')) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { putSafe(STATIC, req, res.clone()); return res; })));
  } else if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => { putSafe(STATIC, '/index.html', res.clone()); return res; })
        .catch(() => caches.match('/index.html'))
    );
  }
});
