// src/utils/autosize.ts — semua <textarea> di seluruh situs ikut memanjang ke bawah saat diketik / di-Enter.
const fit = (t: HTMLTextAreaElement) => {
  t.style.height = 'auto'; // tidak pernah lebih pendek dari atribut rows
  t.style.height = `${t.scrollHeight + 2}px`;
};
let queued = false;
const fitAll = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; document.querySelectorAll('textarea').forEach(fit); });
};
document.addEventListener('input', e => { if (e.target instanceof HTMLTextAreaElement) fit(e.target); });
document.addEventListener('focusin', e => { if (e.target instanceof HTMLTextAreaElement) fit(e.target); });
window.addEventListener('resize', fitAll);
new MutationObserver(fitAll).observe(document.documentElement, { childList: true, subtree: true });
export {};
