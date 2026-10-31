#!/usr/bin/env node
// scripts/prerender-meta.js — dijalankan otomatis setelah `npm run build` (postbuild).
// Membuat salinan index.html per halaman (build/pengalaman/index.html, dst.) dengan
// <title>, description, canonical & Open Graph yang sesuai halaman itu — supaya preview
// link di WhatsApp/LinkedIn/Google benar walaupun situsnya SPA (crawler tidak menjalankan JS).
// Juga membuat 404.html (noindex) serta robots.txt & sitemap.xml dari daftar yang sama.
// Artikel portofolio dibaca dari Firestore (REST publik) → build/portofolio/<id>/index.html + sitemap.
// shortcut: artikel yang disimpan setelah build baru ikut saat deploy berikutnya (halamannya tetap terbuka lewat SPA).
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
  const image = meta.image || seo.image;
  const url = SITE + (route === '/' ? '' : route);
  let doc = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(meta.title)}</title>`);
  doc = setMeta(doc, 'name', 'description', meta.description);
  doc = setMeta(doc, 'property', 'og:title', meta.title);
  doc = setMeta(doc, 'property', 'og:description', meta.description);
  doc = setMeta(doc, 'property', 'og:url', url);
  doc = setMeta(doc, 'property', 'og:image', image);
  if (meta.type) doc = setMeta(doc, 'property', 'og:type', meta.type);
  if (meta.keywords) doc = setMeta(doc, 'name', 'keywords', meta.keywords);
  doc = setMeta(doc, 'name', 'twitter:title', meta.title);
  doc = setMeta(doc, 'name', 'twitter:description', meta.description);
  doc = setCanonical(doc, url);
  if (extraHead) doc = doc.replace('</head>', `${extraHead}</head>`);
  return doc;
};

// ---------- Artikel portofolio dari Firestore ----------
const FIRESTORE = 'https://firestore.googleapis.com/v1/projects/hikimori-18d47/databases/(default)/documents/portfolio?pageSize=300';
const val = v => v == null ? undefined : 'stringValue' in v ? v.stringValue : 'integerValue' in v ? Number(v.integerValue)
  : 'booleanValue' in v ? v.booleanValue : 'arrayValue' in v ? (v.arrayValue.values || []).map(val)
    : 'mapValue' in v ? Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, val(x)])) : undefined;
const clip = (t, n) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };

/** Dokumen Firestore → meta halaman artikel (null bila tidak layak). */
function articleMeta(doc) {
  const id = String(doc.name || '').split('/').pop();
  if (!/^[\w-]{1,100}$/.test(id)) return null; // dipakai sebagai nama folder
  const f = val({ mapValue: { fields: doc.fields || {} } });
  if (!f.title) return null;
  let image = /^https:\/\//.test(f.imageUrl || '') ? f.imageUrl : '';
  // pratinjau share ideal 1200×630
  if (image.includes('res.cloudinary.com/') && image.includes('/upload/')) image = image.replace('/upload/', '/upload/c_fill,w_1200,h_630,f_jpg,q_auto/');
  return {
    id,
    lastmod: String(doc.updateTime || '').slice(0, 10),
    meta: {
      title: `${clip(f.seoTitle || f.title, 70)} — Hikimori`,
      description: clip(f.seoDesc || f.description || f.subtitle || seo.routes['/portofolio'].description, 200),
      image,
      keywords: (f.keywords || []).join(', '),
      type: 'article',
    },
  };
}
async function loadArticles() {
  try {
    const res = await fetch(FIRESTORE, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.documents || []).map(articleMeta).filter(Boolean);
  } catch (e) {
    console.warn(`prerender-meta: artikel portofolio dilewati (${e.message})`); // build tetap jalan
    return [];
  }
}

async function main() {
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

const articles = await loadArticles();
for (const a of articles) {
  const out = path.join(build, 'portofolio', a.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(`/portofolio/${a.id}`, a.meta));
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(build, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...Object.keys(seo.routes).map(r => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : '0.8'}</priority></url>`),
    ...articles.map(a => `  <url><loc>${SITE}/portofolio/${a.id}</loc><lastmod>${a.lastmod || today}</lastmod><priority>0.7</priority></url>`)].join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(build, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerender-meta: ${count} halaman + ${articles.length} artikel + 404.html + sitemap.xml + robots.txt (${SITE})`);
}

main().catch(e => { console.error(e); process.exit(1); });

