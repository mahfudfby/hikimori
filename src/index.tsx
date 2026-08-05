// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service worker: cache aset statis + halaman supaya kunjungan berikutnya
// (atau saat jaringan lemot/putus) tetap bisa load dari cache. Hanya
// diaktifkan di production build — di dev server malah bikin bingung (stale cache).
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Diam-diam gagal — situs tetap jalan normal tanpa cache offline.
    });
  });
}
