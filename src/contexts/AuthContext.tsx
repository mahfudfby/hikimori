// src/contexts/AuthContext.tsx
// Login admin lewat Firebase Authentication (email + password, atau Google).
// Tidak ada password yang ditanam di kode/bundle, dan tidak ada "sesi lokal"
// palsu — akses CMS = user Firebase yang valid. SDK auth di-load lazy.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';
import { isAdminClaims, isAdminEmail } from '../config/admins';

/** Username pendek → email akun Firebase admin. */
const USERNAME_ALIAS: Record<string, string> = {
  mahfudfebry: 'mahfudfebry@hikimori.web.id',
};
const HINT_KEY = 'hk_admin_hint';
const NOT_ADMIN = 'Akun ini tidak punya akses CMS.';
export const UNVERIFIED_ADMIN_CODE = 'auth/unverified-admin';
const UNVERIFIED_ADMIN_MSG = 'Email admin belum terverifikasi. Klik "Kirim Email Verifikasi" di bawah untuk mengirim link ke inbox admin.';

/**
 * Akun boleh membuka CMS? Aturannya sama dengan Firestore Rules & /api/* (src/config/admins.ts):
 * custom claim `admin`, atau email di daftar ADMIN_EMAILS yang sudah terverifikasi.
 */
const checkAdmin = async (u: User | null): Promise<boolean> => {
  if (!u) return false;
  let admin: unknown;
  try { admin = (await u.getIdTokenResult()).claims.admin; } catch { /* offline: pakai email saja */ }
  return isAdminClaims({ email: u.email, emailVerified: u.emailVerified, admin });
};

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password: string, remember?: boolean) => Promise<void>;
  loginGoogle: (remember?: boolean) => Promise<void>;
  resetPassword: (usernameOrEmail: string) => Promise<void>;
  sendVerification: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  /** ID token user yang sedang login (untuk memanggil /api/* yang butuh admin). */
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const friendlyError = (code: string) => {
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(code))
    return 'Username/email atau password salah.';
  if (code === 'auth/too-many-requests') return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
  if (code === 'auth/network-request-failed') return 'Koneksi bermasalah. Periksa internet kamu.';
  if (code === 'auth/popup-blocked') return 'Pop-up login diblokir browser. Izinkan pop-up untuk situs ini lalu coba lagi.';
  if (code === 'auth/operation-not-allowed') return 'Login Google belum diaktifkan di Firebase Console (Authentication > Sign-in method).';
  if (code === 'auth/unauthorized-domain') return 'Domain ini belum diizinkan di Firebase Console (Authentication > Settings > Authorized domains).';
  return 'Login gagal (' + code + ').';
};

// Pengunjung biasa (belum pernah login) tidak perlu memuat SDK auth sama sekali.
const needsAuth = () => {
  try { return localStorage.getItem(HINT_KEY) === '1' || window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/cv'); } catch { return false; }
};

const authMod = () => Promise.all([getAuthInstance(), import('firebase/auth')]);

// Ingat saya = sesi tetap setelah browser ditutup; tanpa centang = keluar saat tab/browser ditutup.
const begin = async (remember: boolean) => {
  const [auth, a] = await authMod();
  await a.setPersistence(auth, remember ? a.browserLocalPersistence : a.browserSessionPersistence);
  return { auth, a };
};

const toEmail = (id: string) => { const key = id.trim().toLowerCase(); return USERNAME_ALIAS[key] || key; };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(needsAuth);

  useEffect(() => {
    if (!needsAuth()) return;
    let unsub: (() => void) | undefined;
    let alive = true;
    authMod().then(([auth, a]) => {
      unsub = a.onAuthStateChanged(auth, async u => {
        const ok = await checkAdmin(u);
        if (!alive) return;
        setUser(ok ? u : null);
        setIsAdmin(ok);
        setLoading(false);
        try { ok ? localStorage.setItem(HINT_KEY, '1') : localStorage.removeItem(HINT_KEY); } catch {}
      });
    }).catch(() => setLoading(false));
    return () => { alive = false; unsub?.(); };
  }, []);

  // Akun di luar daftar admin (atau email belum terverifikasi) langsung dikeluarkan lagi.
  const accept = useCallback(async (u: User) => {
    const [auth, a] = await authMod();
    try { await u.reload(); } catch { /* abaikan bila gagal reload */ }
    if (!(await checkAdmin(u))) {
      // HANYA beri status unverified-admin bila email memang ada di daftar ADMIN_EMAILS:
      // email random milik orang lain selalu ditolak dengan NOT_ADMIN dan tidak pernah ditawari tombol verifikasi.
      const unverifiedAdmin = isAdminEmail(u.email) && !u.emailVerified;
      await a.signOut(auth);
      setUser(null);
      setIsAdmin(false);
      const err: any = new Error(unverifiedAdmin ? UNVERIFIED_ADMIN_MSG : NOT_ADMIN);
      if (unverifiedAdmin) err.code = UNVERIFIED_ADMIN_CODE;
      throw err;
    }
    try { await u.getIdToken(true); } catch { /* segarkan token agar email_verified terbaru ikut */ }
    setUser(u);
    setIsAdmin(true);
    try { localStorage.setItem(HINT_KEY, '1'); } catch {}
  }, []);

  const login = useCallback(async (id: string, password: string, remember = true) => {
    const { auth, a } = await begin(remember);
    let u: User;
    try { u = (await a.signInWithEmailAndPassword(auth, toEmail(id), password)).user; }
    catch (err: any) { throw new Error(friendlyError(err?.code || 'unknown')); }
    await accept(u);
  }, [accept]);

  const loginGoogle = useCallback(async (remember = true) => {
    const { auth, a } = await begin(remember);
    let u: User;
    try { u = (await a.signInWithPopup(auth, new a.GoogleAuthProvider())).user; }
    catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') throw new Error('');
      throw new Error(friendlyError(err?.code || 'unknown'));
    }
    await accept(u);
  }, [accept]);

  const resetPassword = useCallback(async (id: string) => {
    const email = toEmail(id);
    if (!email.includes('@')) throw new Error('Isi email akun dulu, lalu klik Lupa kata sandi.');
    // Jangan izinkan pengiriman email reset ke alamat di luar daftar admin
    if (!isAdminEmail(email)) return;
    const [auth, a] = await authMod();
    try { await a.sendPasswordResetEmail(auth, email); }
    catch (err: any) {
      if (['auth/invalid-email', 'auth/network-request-failed', 'auth/too-many-requests'].includes(err?.code)) throw new Error(friendlyError(err.code));
    }
  }, []);

  /**
   * Kirim link verifikasi HANYA untuk email yang ada di whitelist ADMIN_EMAILS DAN setelah password-nya terbukti benar.
   * Mengembalikan `true` bila ternyata email sudah terverifikasi (langsung login), atau `false` bila email verifikasi dikirim.
   */
  const sendVerification = useCallback(async (id: string, password: string): Promise<boolean> => {
    const email = toEmail(id);
    if (!email.includes('@') || !password) throw new Error('Isi email dan password admin dulu.');
    // Tolak keras email selain whitelist admin sebelum menyentuh Firebase
    if (!isAdminEmail(email)) throw new Error(NOT_ADMIN);
    const [auth, a] = await authMod();
    let u: User;
    try { u = (await a.signInWithEmailAndPassword(auth, email, password)).user; }
    catch (err: any) { throw new Error(friendlyError(err?.code || 'unknown')); }
    if (!isAdminEmail(u.email)) {
      await a.signOut(auth);
      throw new Error(NOT_ADMIN);
    }
    try {
      await u.reload();
      if (u.emailVerified) {
        await accept(u);
        return true;
      }
      await a.sendEmailVerification(u);
    } catch (err: any) {
      await a.signOut(auth);
      setUser(null);
      setIsAdmin(false);
      if (err?.code === 'auth/too-many-requests') {
        throw new Error('Link verifikasi baru saja dikirim. Cek kotak masuk / folder Spam, atau tunggu beberapa menit.');
      }
      throw new Error(err?.message || 'Gagal mengirim email verifikasi.');
    }
    await a.signOut(auth);
    setUser(null);
    setIsAdmin(false);
    return false;
  }, [accept]);

  const logout = useCallback(async () => {
    const [auth, a] = await authMod();
    await a.signOut(auth);
    setUser(null);
    setIsAdmin(false);
    try { localStorage.removeItem(HINT_KEY); localStorage.removeItem('hk_admin_session'); } catch {}
  }, []);

  const getIdToken = useCallback(async () => {
    const [auth] = await authMod();
    return auth.currentUser ? auth.currentUser.getIdToken() : null;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, loginGoogle, resetPassword, sendVerification, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
