// src/utils/autoHyphen.ts — pemenggalan otomatis bahasa Indonesia di semua paragraf situs publik (bukan CMS).
// Chrome/Edge belum punya kamus hyphens Indonesia, jadi tanda pisah lunak (&shy;) disisipkan di batas suku kata;
// tanda "-" hanya muncul bila kata benar-benar terpotong di ujung baris. Bahasa Inggris memakai kamus bawaan browser.
import { hyphenate } from './richHtml';

const SHY = String.fromCharCode(173);
// Hemat tanda pisah: hanya kata >= 9 huruf yang dipenggal, minimal 3 huruf sebelum & 4 huruf sesudah titik penggal
const MIN_WORD = 9, BEFORE = 3, AFTER = 4;
const siteHyphenate = (text: string) => text.replace(/[a-zA-Z]{9,}/g, (w) => {
  let out = '', pos = 0;
  for (const ch of hyphenate(w)) {
    if (ch === SHY) { if (pos >= BEFORE && w.length - pos >= AFTER) out += ch; } else { out += ch; pos++; }
  }
  return out;
});
{ // self-check: kata pendek utuh; penggalan kata panjang menyisakan >= 3 huruf di depan & >= 4 di belakang
  const parts = siteHyphenate('operasional').split(SHY);
  console.assert(siteHyphenate('kerja kantor') === 'kerja kantor' && parts.length > 1 && parts[0].length >= BEFORE && parts[parts.length - 1].length >= AFTER, 'siteHyphenate');
}
let queued = false;
const run = () => {
  queued = false;
  if (document.documentElement.lang !== 'id' || window.location.pathname.startsWith('/admin')) return;
  document.querySelectorAll('#root p, #root li, #root dd').forEach(el => {
    if (el.closest('[contenteditable], .rte, .mag-rich, [data-page], .share-sheet')) return; // editor CMS, artikel (sudah dipenggal sendiri), dan halaman CV (teks PDF harus bersih)
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const v = n.nodeValue || '';
      if (v.includes(SHY) || !new RegExp(`[a-zA-Z]{${MIN_WORD}}`).test(v) || n.parentElement?.closest('a, code')) continue;
      const h = siteHyphenate(v);
      if (h !== v) n.nodeValue = h; // tulis hanya bila berubah, agar observer tidak berputar terus
    }
  });
};
// Timer (bukan rAF) agar tetap jalan di tab latar
const queue = () => { if (!queued) { queued = true; setTimeout(run, 30); } };
new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['lang'] });
queue();
export {};
