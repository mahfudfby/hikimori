// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

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

// Service worker (cache aset statis) — hanya di production build.
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
