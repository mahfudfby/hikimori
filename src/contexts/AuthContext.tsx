// src/contexts/AuthContext.tsx
// Login admin murni lewat Firebase Authentication (email + password).
// Tidak ada password yang ditanam di kode/bundle, dan tidak ada "sesi lokal"
// palsu — akses CMS = user Firebase yang valid. SDK auth di-load lazy.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';

/** Username pendek → email akun Firebase admin. */
const USERNAME_ALIAS: Record<string, string> = {
  mahfudfebry: 'mahfudfebry@hikimori.web.id',
};
const HINT_KEY = 'hk_admin_hint';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const friendlyError = (code: string) => {
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(code))
    return 'Username/email atau password salah.';
  if (code === 'auth/too-many-requests') return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
  if (code === 'auth/network-request-failed') return 'Koneksi bermasalah. Periksa internet kamu.';
  return 'Login gagal (' + code + ').';
};

// Pengunjung biasa (belum pernah login) tidak perlu memuat SDK auth sama sekali.
const needsAuth = () => {
  try { return localStorage.getItem(HINT_KEY) === '1' || window.location.pathname.startsWith('/admin'); } catch { return false; }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(needsAuth);

  useEffect(() => {
    if (!needsAuth()) return;
    let unsub: (() => void) | undefined;
    Promise.all([getAuthInstance(), import('firebase/auth')]).then(([auth, a]) => {
      unsub = a.onAuthStateChanged(auth, u => {
        setUser(u);
        setLoading(false);
        try { u ? localStorage.setItem(HINT_KEY, '1') : localStorage.removeItem(HINT_KEY); } catch {}
      });
    }).catch(() => setLoading(false));
    return () => unsub?.();
  }, []);

  const login = useCallback(async (id: string, password: string) => {
    const key = id.trim().toLowerCase();
    const email = USERNAME_ALIAS[key] || key;
    const [auth, a] = await Promise.all([getAuthInstance(), import('firebase/auth')]);
    try {
      const cred = await a.signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      try { localStorage.setItem(HINT_KEY, '1'); } catch {}
    } catch (err: any) {
      throw new Error(friendlyError(err?.code || 'unknown'));
    }
  }, []);

  const logout = useCallback(async () => {
    const [auth, a] = await Promise.all([getAuthInstance(), import('firebase/auth')]);
    await a.signOut(auth);
    setUser(null);
    try { localStorage.removeItem(HINT_KEY); localStorage.removeItem('hk_admin_session'); } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
