// src/utils/track.ts — custom event Vercel Analytics untuk klik penting (CV, kontak, portofolio).
// Satu pendengar klik global, jadi tombol tidak perlu diubah satu per satu. Tombol CV diberi data-track="CV".
import { track } from '@vercel/analytics';

/** Nama event + properti dari link yang diklik, atau null bila bukan klik yang dihitung. */
export const classifyClick = (a: HTMLAnchorElement): { name: string; data?: Record<string, string> } | null => {
  if (a.dataset.track) return { name: a.dataset.track };
  const href = a.getAttribute('href') || '';
  const from = window.location.pathname;
  if (/^https:\/\/wa\.me\//i.test(href)) return { name: 'Kontak', data: { via: 'WhatsApp', from } };
  if (/^mailto:/i.test(href)) return { name: 'Kontak', data: { via: 'Email', from } };
  if (/linkedin\.com\//i.test(href)) return { name: 'Kontak', data: { via: 'LinkedIn', from } };
  const m = href.match(/^\/portofolio\/([^/?#]+)/);
  if (m) return { name: 'Buka Portofolio', data: { id: m[1], from } };
  return null;
};

export const startClickTracking = () => {
  document.addEventListener('click', e => {
    if (e.defaultPrevented || window.location.pathname.startsWith('/admin')) return;
    const a = (e.target as Element | null)?.closest?.('a');
    const ev = a && classifyClick(a);
    if (ev) track(ev.name, ev.data);
  });
};
