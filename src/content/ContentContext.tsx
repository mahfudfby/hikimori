// src/content/ContentContext.tsx
// Satu sumber konten untuk seluruh situs:
//   1. tampil instan dari cache localStorage (atau default bawaan),
//   2. lalu berlangganan real-time ke Firestore `siteContent/main`.
// CMS (/admin) menyimpan ke dokumen yang sama lewat saveContent().
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_CONTENT, SCHEMA_VERSION } from './defaults';
import type { SiteContent } from './types';
import { getDb } from '../config/firebase';
import { getDocRest } from './firestoreRest';

const LS_KEY = 'hk_content_v1';
const DOC = ['siteContent', 'main'] as const;
export const HISTORY = 'siteContentHistory';

/** Daftar versi yang pernah dipublikasikan (terbaru dulu) — hanya untuk CMS (butuh login). */
export const listHistory = async (max = 15): Promise<{ id: string; savedAt: string; value: SiteContent }[]> => {
  const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);
  const snap = await fs.getDocs(fs.query(fs.collection(db, HISTORY), fs.orderBy('savedAt', 'desc'), fs.limit(max)));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

/** Versi yang sedang live sekarang (dibaca ulang dari server) — untuk deteksi bentrok saat publikasi. */
export const fetchLiveUpdatedAt = async (): Promise<string> => {
  const doc = await getDocRest(DOC.join('/'));
  return (doc?.value?.updatedAt as string) || '';
};
// HP / mode lite: koneksi Firestore ditunda sedikit lebih lama supaya render awal diprioritaskan
const LITE = typeof document !== 'undefined' && document.documentElement.classList.contains('lite');

/** Gabungkan data tersimpan dengan default supaya field baru tidak undefined. */
export const mergeContent = (saved: any, base: any = DEFAULT_CONTENT): any => {
  if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
  if (base && typeof base === 'object') {
    const out: any = { ...base };
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const k of Object.keys(saved)) out[k] = k in base ? mergeContent(saved[k], base[k]) : saved[k];
    }
    return out;
  }
  return saved === undefined || saved === null ? base : saved;
};

const readCache = (): SiteContent => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return mergeContent(JSON.parse(raw));
  } catch {}
  return DEFAULT_CONTENT;
};

interface Ctx {
  content: SiteContent;
  /** true setelah snapshot Firestore pertama diterima */
  synced: boolean;
  saveContent: (c: SiteContent) => Promise<void>;
}

const ContentContext = createContext<Ctx | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(readCache);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    // Baca konten via Firestore REST (fetch JSON, tanpa SDK ±330 KB) saat browser idle.
    // Diulang saat tab kembali aktif supaya perubahan dari CMS ikut terbawa.
    const load = () => {
      getDocRest(DOC.join('/'), ctrl.signal).then(doc => {
        setSynced(true);
        const v = doc?.value;
        if (!v) return;
        const merged = mergeContent(v) as SiteContent;
        setContent(prev => (JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged));
        try { localStorage.setItem(LS_KEY, JSON.stringify(merged)); } catch {}
      }).catch(err => { if (err?.name !== 'AbortError') { console.warn('[content] Firestore:', err.message); setSynced(true); } });
    };
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: LITE ? 3000 : 2000 }) : setTimeout(load, LITE ? 1200 : 600);
    let last = Date.now();
    const onVisible = () => { if (document.visibilityState === 'visible' && Date.now() - last > 60000) { last = Date.now(); load(); } };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      ctrl.abort();
      document.removeEventListener('visibilitychange', onVisible);
      w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id);
    };
  }, []);

  const saveContent = useCallback(async (c: SiteContent) => {
    const next: SiteContent = { ...c, schema: SCHEMA_VERSION, updatedAt: new Date().toISOString() };
    const [db, fs] = await Promise.all([getDb(), import('firebase/firestore')]);
    // JSON round-trip membuang undefined (Firestore menolak nilai undefined).
    const value = JSON.parse(JSON.stringify(next));
    await fs.setDoc(fs.doc(db, ...DOC), { value });
    // Riwayat versi: setiap publikasi disimpan juga ke siteContentHistory (bisa dipulihkan dari CMS).
    // Gagal menyimpan riwayat tidak boleh menggagalkan publikasi.
    try { await fs.setDoc(fs.doc(db, HISTORY, next.updatedAt), { value, savedAt: next.updatedAt }); }
    catch (e) { console.warn('[content] riwayat gagal disimpan:', e); }
    setContent(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  }, []);

  return <ContentContext.Provider value={{ content, synced, saveContent }}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent() harus di dalam <ContentProvider>');
  return ctx;
};
