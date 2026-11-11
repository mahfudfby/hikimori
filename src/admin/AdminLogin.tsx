// src/admin/AdminLogin.tsx
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UNVERIFIED_ADMIN_CODE } from '../contexts/AuthContext';
import { Icon } from '../components/ui';
import LogoMark from '../components/LogoMark';

const REMEMBER_KEY = 'hk_admin_remember';

const AdminLogin: React.FC = () => {
  const { login, loginGoogle, resetPassword, sendVerification, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  // Halaman tujuan setelah login (hanya jalur internal), mis. /cv dari tombol Unduh CV
  const from = (useLocation().state as { from?: string } | null)?.from;
  const back = from && from.startsWith('/') && !from.startsWith('//') ? from : '/admin';
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(() => { try { return localStorage.getItem(REMEMBER_KEY) !== '0'; } catch { return true; } });
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [needVerify, setNeedVerify] = useState(false);
  const [busy, setBusy] = useState<'' | 'pw' | 'google' | 'reset' | 'verify'>('');
  useEffect(() => { document.title = 'Login CMS — Hikimori'; }, []);
  useEffect(() => { try { localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0'); } catch {} }, [remember]);

  if (!loading && isAdmin) return <Navigate to={back} replace />;

  const run = async (kind: 'pw' | 'google' | 'reset' | 'verify', fn: () => Promise<void>, ok?: () => void) => {
    setErr(''); setInfo(''); setBusy(kind);
    if (kind !== 'verify') setNeedVerify(false);
    try { await fn(); ok?.(); }
    catch (x: any) {
      if (x?.code === UNVERIFIED_ADMIN_CODE) setNeedVerify(true);
      if (x?.message) setErr(x.message);
    }
    finally { setBusy(''); }
  };
  const done = () => nav(back, { replace: true });
  const submit = (e: React.FormEvent) => { e.preventDefault(); run('pw', () => login(id, pw, remember), done); };

  const handleVerify = () => run('verify', async () => {
    const alreadyVerified = await sendVerification(id, pw);
    if (alreadyVerified) {
      setNeedVerify(false);
      done();
    } else {
      setInfo('Link verifikasi sudah dikirim ke email admin. Buka link di kotak masuk / folder Spam, lalu klik Masuk.');
    }
  });

  return (
    <div className="login-bg">
      <form onSubmit={submit} className="card solid stack gap-16" style={{ width: 'min(420px, 100%)', padding: 28 }}>
        <div className="row wrap gap-12">
          <LogoMark height={32} />
          <div style={{ minWidth: 0 }}><div className="h-card">Content Manager</div><div className="xs muted">Masuk untuk mengelola isi situs</div></div>
        </div>
        <label className="field"><span>Username atau email</span>
          <input className="input" value={id} onChange={e => { setId(e.target.value); setNeedVerify(false); }} autoComplete="username" required autoFocus />
        </label>
        <label className="field"><span>Password</span>
          <div className="row gap-8">
            <input className="input" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" required />
            <button type="button" className="icon-btn" onClick={() => setShow(s => !s)} aria-label={show ? 'Sembunyikan' : 'Tampilkan'}><Icon name="eye" /></button>
          </div>
        </label>
        <div className="row between wrap gap-8">
          <label className="row gap-8 small" style={{ cursor: 'pointer', minHeight: 32 }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 18, height: 18 }} />
            Ingat saya
          </label>
          <button type="button" className="small" disabled={!!busy} onClick={() => run('reset', () => resetPassword(id), () => setInfo('Bila email terdaftar sebagai admin, link atur ulang kata sandi sudah dikirim. Cek kotak masuk / spam.'))}
            style={{ border: 0, background: 'none', padding: 0, textDecoration: 'underline', color: 'var(--text-2)', cursor: 'pointer' }}>
            {busy === 'reset' ? 'Mengirim…' : 'Lupa kata sandi?'}
          </button>
        </div>
        {err && <div className="small" role="alert" style={{ color: 'var(--danger)' }}>{err}</div>}
        {needVerify && (
          <button type="button" className="pill lg" disabled={!!busy} onClick={handleVerify}
            style={{ justifyContent: 'center', borderColor: 'var(--accent, var(--ink-2))' }}>
            <Icon name="mail" size={16} />
            {busy === 'verify' ? 'Mengirim link verifikasi…' : 'Kirim Email Verifikasi'}
          </button>
        )}
        {info && <div className="small" role="status" style={{ color: 'var(--text-2)' }}>{info}</div>}
        <button className="pill dark lg" type="submit" disabled={!!busy} style={{ justifyContent: 'center' }}>{busy === 'pw' ? 'Memeriksa…' : 'Masuk'}</button>
        <div className="row gap-8 xs faint" style={{ alignItems: 'center' }}><span style={{ flex: 1, height: 1, background: 'var(--line)' }} />atau<span style={{ flex: 1, height: 1, background: 'var(--line)' }} /></div>
        <button type="button" className="pill lg" disabled={!!busy} onClick={() => run('google', () => loginGoogle(remember), done)} style={{ justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
          {busy === 'google' ? 'Membuka Google…' : 'Masuk dengan Google'}
        </button>
        <Link to="/" className="xs muted center">← Kembali ke situs</Link>
      </form>
    </div>
  );
};

export default AdminLogin;
