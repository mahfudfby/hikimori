// src/hooks/useFirestoreContent.ts
// Hook ini dipakai oleh Home.tsx dan halaman lain
// agar konten selalu real-time dari Firestore, bukan localStorage saja.

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const FS = {
  home:    'siteData/home',
  about:   'siteData/about',
  skills:  'siteData/skills',
  exp:     'siteData/experience',
  contact: 'siteData/contact',
  cert:    'siteData/sertifikasi',
} as const;

// localStorage keys untuk cache fallback
const LS: Record<string, string> = {
  'siteData/home':        'hk_home_data',
  'siteData/about':       'hk_home_about_data',
  'siteData/skills':      'hk_skills_data',
  'siteData/experience':  'hk_experience_data',
  'siteData/contact':     'hk_contact_data',
  'siteData/sertifikasi': 'hk_cert_data',
};

export function useFirestoreDoc<T>(path: string, fallback: T): T {
  const [col, docId] = path.split('/');
  const lsKey = LS[path];

  // Init dari localStorage cache dulu (instant, tanpa flicker)
  const [value, setValue] = useState<T>(() => {
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) return JSON.parse(cached) as T;
    } catch {}
    return fallback;
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, col, docId), (snap) => {
      if (snap.exists()) {
        const data = (snap.data() as { value: T }).value;
        // Update cache
        try { localStorage.setItem(lsKey, JSON.stringify(data)); } catch {}
        // Notify same-tab (AdminPanel preview dll)
        window.dispatchEvent(new CustomEvent('hk-update', {
          detail: { key: lsKey, value: JSON.stringify(data) }
        }));
        setValue(data);
      }
    }, (err) => {
      console.warn('useFirestoreDoc error:', err);
      // fallback ke localStorage cache sudah di-init di useState
    });
    return unsub;
  }, [col, docId, lsKey]);

  return value;
}

export { FS };
