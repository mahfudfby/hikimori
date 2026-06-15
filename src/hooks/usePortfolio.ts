// src/hooks/usePortfolio.ts
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  client: string;
  year: string;
  featured: boolean;
  order: number;
  createdAt: Timestamp | null;
}

export const usePortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PortfolioItem));
        setItems(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'portfolio'), { ...item, createdAt: serverTimestamp() });
  };

  const updateItem = async (id: string, data: Partial<PortfolioItem>) => {
    await updateDoc(doc(db, 'portfolio', id), data);
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'portfolio', id));
  };

  return { items, loading, error, addItem, updateItem, deleteItem };
};
