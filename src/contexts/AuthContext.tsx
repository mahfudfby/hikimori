// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL    = "mahfudfebrys@gmail.com";
const ADMIN_PASSWORD = "120200";
const ADMIN_USERNAME = "Mahfudfebry";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(!!user);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Restore sesi lokal saat reload
  useEffect(() => {
    if (!loading && !currentUser) {
      if (localStorage.getItem('hk_admin_session') === 'true') {
        setIsAdmin(true);
      }
    }
  }, [loading, currentUser]);

  const login = async (username: string, password: string) => {
    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      throw new Error("Username atau password salah!");
    }
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        } catch {
          // Firebase tidak terima domain custom — gunakan sesi lokal
          setIsAdmin(true);
          localStorage.setItem('hk_admin_session', 'true');
          return;
        }
      } else {
        // Fallback ke sesi lokal
        setIsAdmin(true);
        localStorage.setItem('hk_admin_session', 'true');
        return;
      }
    }
  };

  const logout = async () => {
    try { await signOut(auth); } catch {}
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('hk_admin_session');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
