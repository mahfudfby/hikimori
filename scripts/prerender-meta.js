#!/usr/bin/env node
// scripts/prerender-meta.js — dijalankan otomatis setelah `npm run build` (postbuild).
// Membuat salinan index.html per halaman (build/pengalaman/index.html, dst.) dengan
// <title>, description, canonical & Open Graph yang sesuai halaman itu — supaya preview
// link di WhatsApp/LinkedIn/Google benar walaupun situsnya SPA (crawler tidak menjalankan JS).
// Juga membuat 404.html (noindex) serta robots.txt & sitemap.xml dari daftar yang sama.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const build = path.join(root, 'build');
const seo = require(path.join(root, 'src', 'seo', 'routes.json'));
const SITE = (process.env.SITE_URL || seo.site).replace(/\/$/, '');

const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Ganti/isi tag meta; CRA meminifikasi HTML jadi atribut bisa tanpa kutip — tangani dua bentuk.
const setMeta = (doc, attr, key, value) => {
  const re = new RegExp(`<meta\\s+${attr}=["']?${key.replace(/[.:]/g, m => '\\' + m)}["']?\\s+content=(?:"[^"]*"|'[^']*'|[^\\s>]+)\\s*/?>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${esc(value)}">`;
  return re.test(doc) ? doc.replace(re, tag) : doc.replace('</head>', `${tag}</head>`);
};
const setCanonical = (doc, href) => {
  const re = /<link\s+rel=["']?canonical["']?\s+href=(?:"[^"]*"|'[^']*'|[^\s>]+)\s*\/?>/i;
  const tag = `<link rel="canonical" href="${esc(href)}">`;
  return re.test(doc) ? doc.replace(re, tag) : doc.replace('</head>', `${tag}</head>`);
};
const page = (route, meta, extraHead = '') => {
  const url = SITE + (route === '/' ? '' : route);
  let doc = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(meta.title)}</title>`);
  doc = setMeta(doc, 'name', 'description', meta.description);
  doc = setMeta(doc, 'property', 'og:title', meta.title);
  doc = setMeta(doc, 'property', 'og:description', meta.description);
  doc = setMeta(doc, 'property', 'og:url', url);
  doc = setMeta(doc, 'property', 'og:image', seo.image);
  doc = setMeta(doc, 'name', 'twitter:title', meta.title);
  doc = setMeta(doc, 'name', 'twitter:description', meta.description);
  doc = setCanonical(doc, url);
  if (extraHead) doc = doc.replace('</head>', `${extraHead}</head>`);
  return doc;
};

let count = 0;
for (const [route, meta] of Object.entries(seo.routes)) {
  const out = route === '/' ? path.join(build, 'index.html') : path.join(build, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(route, meta));
  count++;
}

// 404: tetap memuat aplikasi (menampilkan halaman 404 React) tapi tidak diindeks Google
fs.writeFileSync(path.join(build, '404.html'), page('/404', {
  title: 'Halaman tidak ditemukan — Hikimori',
  description: 'Halaman yang Anda cari tidak ditemukan.',
}, '<meta name="robots" content="noindex">'));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(build, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  Object.keys(seo.routes).map(r => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(build, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerender-meta: ${count} halaman + 404.html + sitemap.xml + robots.txt (${SITE})`);
