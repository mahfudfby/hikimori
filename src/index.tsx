// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './utils/autosize';
import './utils/autoHyphen';
import App from './App';
import { inject } from '@vercel/analytics';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Tutup intro (public/index.html) setelah frame pertama aplikasi siap.
// rAF = saat frame pertama tergambar; timer = cadangan bila rAF ditahan browser (tab latar / pane tersembunyi).
const introDone = () => (window as any).__hkIntroDone?.();
requestAnimationFrame(() => requestAnimationFrame(introDone));
setTimeout(introDone, 300);

// Vercel Web Analytics (tanpa cookie): hitung kunjungan & halaman yang dibaca. Hanya production; halaman CMS tidak dihitung.
if (import.meta.env.PROD) inject({ mode: 'production', beforeSend: e => (new URL(e.url).pathname.startsWith('/admin') ? null : e) });

// Service worker (cache aset statis) — hanya di production build.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
