// src/utils/autoHyphen.ts — pemenggalan otomatis bahasa Indonesia di semua paragraf situs publik (bukan CMS).
// Chrome/Edge belum punya kamus hyphens Indonesia, jadi tanda pisah lunak (&shy;) disisipkan di batas suku kata;
// tanda "-" hanya muncul bila kata benar-benar terpotong di ujung baris. Bahasa Inggris memakai kamus bawaan browser.
import { hyphenate } from './richHtml';

const SHY = String.fromCharCode(173);
let queued = false;
const run = () => {
  queued = false;
  if (document.documentElement.lang !== 'id' || window.location.pathname.startsWith('/admin')) return;
  document.querySelectorAll('#root p, #root li, #root dd').forEach(el => {
    if (el.closest('[contenteditable], .rte, .mag-rich')) return; // editor CMS & artikel (sudah dipenggal sendiri)
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const v = n.nodeValue || '';
      if (v.includes(SHY) || !/[a-zA-Z]{6}/.test(v) || n.parentElement?.closest('a, code')) continue;
      const h = hyphenate(v);
      if (h !== v) n.nodeValue = h; // tulis hanya bila berubah, agar observer tidak berputar terus
    }
  });
};
// Timer (bukan rAF) agar tetap jalan di tab latar
const queue = () => { if (!queued) { queued = true; setTimeout(run, 30); } };
new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['lang'] });
queue();
export {};
