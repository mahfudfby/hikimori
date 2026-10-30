#!/usr/bin/env node
// scripts/serve-local.js — server lokal untuk hasil build (tanpa dependensi tambahan).
//   npm run local     → build lalu buka http://localhost:5050
//   npm run preview   → sajikan folder build yang sudah ada
// Fitur: SPA fallback (semua URL → index.html), gzip, cache seperti di Vercel.
// Uji mode HP di browser desktop: http://localhost:5050/?lite=1
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(process.argv[2] || path.join(__dirname, '..', 'build'));
const port = Number(process.env.PORT || process.argv[3] || 5050);

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`\n  Folder build belum ada: ${root}\n  Jalankan dulu:  npm run build\n`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.map': 'application/json',
};
const COMPRESS = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.map', '.xml']);

http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent((req.url || '/').split('?')[0]); } catch { rel = '/'; }
  let file = path.join(root, path.normalize(rel));
  if (!file.startsWith(root)) file = path.join(root, 'index.html'); // cegah path traversal
  // Meniru vercel.json: redirect URL lama, folder → index.html, /admin → aplikasi, sisanya 404.html (status 404)
  const REDIRECT = { '/about': '/profil', '/services': '/layanan', '/portfolio': '/portofolio' };
  if (REDIRECT[rel]) { res.writeHead(308, { Location: REDIRECT[rel] }); return res.end(); }
  let isFallback = false, status = 200;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    isFallback = true;
    const notFound = path.join(root, '404.html');
    if (rel.startsWith('/admin') || path.extname(rel) || !fs.existsSync(notFound)) file = path.join(root, 'index.html');
    else { file = notFound; status = 404; }
  }

  const ext = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': rel.startsWith('/static/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  };
  const gzip = COMPRESS.has(ext) && /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));
  if (gzip) { headers['Content-Encoding'] = 'gzip'; headers['Vary'] = 'Accept-Encoding'; }
  res.writeHead(status, headers);
  const stream = fs.createReadStream(file);
  (gzip ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
  if (process.env.VERBOSE) console.log(req.method, rel, isFallback ? '→ index.html' : '');
}).listen(port, () => {
  console.log(`\n  Hikimori lokal siap:  http://localhost:${port}`);
  console.log(`  Uji mode HP (lite):   http://localhost:${port}/?lite=1\n`);
});
