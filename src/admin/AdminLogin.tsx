// src/admin/AdminLogin.tsx
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '../components/ui';
import LogoMark from '../components/LogoMark';

const AdminLogin: React.FC = () => {
  const { login, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { document.title = 'Login CMS — Hikimori'; }, []);

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await login(id, pw); nav('/admin', { replace: true }); }
    catch (x: any) { setErr(x.message); }
    finally { setBusy(false); }
  };

  return (
    <main className="shell page-in" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px 16px' }}>
      <form onSubmit={submit} className="card solid stack gap-16" style={{ width: 'min(420px, 100%)', padding: 28 }}>
        <div className="row gap-12">
          <LogoMark height={34} />
          <div><div className="h-card">Content Manager</div><div className="xs muted">Masuk untuk mengelola isi situs</div></div>
        </div>
        <label className="field"><span>Username atau email</span>
          <input className="input" value={id} onChange={e => setId(e.target.value)} autoComplete="username" required autoFocus />
        </label>
        <label className="field"><span>Password</span>
          <div className="row gap-8">
            <input className="input" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" required />
            <button type="button" className="icon-btn" onClick={() => setShow(s => !s)} aria-label={show ? 'Sembunyikan' : 'Tampilkan'}><Icon name="eye" /></button>
          </div>
        </label>
        {err && <div className="small" role="alert" style={{ color: 'var(--danger)' }}>{err}</div>}
        <button className="pill dark lg" type="submit" disabled={busy}>{busy ? 'Memeriksa…' : 'Masuk'}</button>
        <Link to="/" className="xs muted center">← Kembali ke situs</Link>
      </form>
    </main>
  );
};

export default AdminLogin;
