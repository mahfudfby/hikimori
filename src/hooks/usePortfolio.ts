// src/hooks/usePortfolio.ts — koleksi Firestore `portfolio` (CRUD), SDK di-load lazy.
import { useState, useEffect, useCallback } from 'react';
import { getDb } from '../config/firebase';
import { listCollectionRest } from '../content/firestoreRest';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  client: string;
  year: string;
  link?: string;
  featured: boolean;
  order: number;
}

const fsMod = () => import('firebase/firestore');

const normalize = (v: any, id: string): PortfolioItem =>
  ({ tags: [], featured: false, order: 0, link: '', ...v, id } as PortfolioItem);

/**
 * Publik (default): sekali baca via Firestore REST — tanpa SDK, ringan di HP.
 * CMS (`live: true`): SDK + onSnapshot supaya daftar langsung ter-update saat diedit.
 */
export const usePortfolio = ({ live = false }: { live?: boolean } = {}) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (live) return;
    const ctrl = new AbortController();
    listCollectionRest('portfolio', ctrl.signal)
      .then(docs => { setItems(docs.map(d => normalize(d, d.id)).sort((a, b) => a.order - b.order)); setLoading(false); })
      .catch(e => { if (e?.name !== 'AbortError') { setError(String(e.message || e)); setLoading(false); } });
    return () => ctrl.abort();
  }, [live]);

  useEffect(() => {
    if (!live) return;
    let unsub: (() => void) | undefined;
    let cancelled = false;
    Promise.all([getDb(), fsMod()]).then(([db, fs]) => {
      if (cancelled) return;
      const q = fs.query(fs.collection(db, 'portfolio'), fs.orderBy('order', 'asc'));
      unsub = fs.onSnapshot(q, snap => {
        setItems(snap.docs.map(d => normalize(d.data(), d.id)));
        setLoading(false);
      }, err => { setError(err.message); setLoading(false); });
    }).catch(e => { setError(String(e)); setLoading(false); });
    return () => { cancelled = true; unsub?.(); };
  }, [live]);

  const addItem = useCallback(async (item: Omit<PortfolioItem, 'id'>) => {
    const [db, fs] = await Promise.all([getDb(), fsMod()]);
    await fs.addDoc(fs.collection(db, 'portfolio'), { ...item, createdAt: fs.serverTimestamp() });
  }, []);

  const updateItem = useCallback(async (id: string, data: Partial<PortfolioItem>) => {
    const [db, fs] = await Promise.all([getDb(), fsMod()]);
    const { id: _ignore, ...rest } = data as any;
    await fs.updateDoc(fs.doc(db, 'portfolio', id), rest);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const [db, fs] = await Promise.all([getDb(), fsMod()]);
    await fs.deleteDoc(fs.doc(db, 'portfolio', id));
  }, []);

  return { items, loading, error, addItem, updateItem, deleteItem };
};
