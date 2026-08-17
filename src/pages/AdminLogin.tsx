// src/pages/AdminLogin.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuroraBackground from '../components/AuroraBackground';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Isi username dan password!');
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Login berhasil! Selamat datang, Admin.');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--black-3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="admin-login-grid">

      {/* ── Kiri: Form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem,6vw,5rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}
        >
          <Link to="/" style={{ display: 'inline-block', marginBottom: '2rem' }}>
            <img
              src="https://res.cloudinary.com/dl4pyan8v/image/upload/f_auto,q_auto/v1785800037/Hikimori_logo_02_hkexej.jpg"
              alt="Hikimori"
              style={{ height: '38px', width: 'auto', borderRadius: '8px', display: 'block' }}
            />
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,2.6rem)', lineHeight: 1.05, marginBottom: '1rem' }}>
            Selamat Datang<br />Kembali, Admin
          </h1>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '2.2rem' }}>
            Masuk untuk mengelola konten, pengalaman kerja, dan sertifikasi yang tampil di website Hikimori.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--white-dim)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(0,82,245,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--white-dim)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  style={{ ...inputStyle, padding: '12px 48px 12px 16px' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(0,82,245,0.6)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-dim)', fontSize: '1.1rem', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <motion.button
                type="submit"
                disabled={loading}
                className="text-shadow-onlight"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: '1 1 auto',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: loading ? 'rgba(0,82,245,0.5)' : 'var(--amber)',
                  color: 'var(--black)', border: 'none', borderRadius: '10px',
                  padding: '13px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.3px',
                }}
              >
                {loading ? '⌛ Masuk...' : <>Masuk <span>→</span></>}
              </motion.button>
              <Link
                to="/"
                style={{
                  flex: '1 1 auto',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: 'var(--black-3)', color: 'var(--white)', textDecoration: 'none',
                  border: '1px solid var(--card-border)', borderRadius: '10px',
                  padding: '13px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.95rem',
                }}
              >
                Beranda <span>🏠</span>
              </Link>
            </div>
          </form>

          {/* Badge kepercayaan — pengganti "Sponsored by" */}
          <div style={{ marginTop: '3rem' }}>
            <p style={{ color: 'var(--white-faint)', fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.9rem' }}>Terlindungi</p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', label: 'Akses Aman' },
                { icon: '☁️', label: 'Cloud Sync' },
                { icon: '⚡', label: 'Real-time' },
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--black-2)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0.6rem 0.9rem' }}>
                  <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                  <span style={{ color: 'var(--white-dim)', fontSize: '0.78rem', fontWeight: 600 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: 'var(--white-faint)', fontSize: '0.75rem', marginTop: '2.5rem' }}>
            Hikimori-Project.com © {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>

      {/* ── Kanan: Panel "glass" dekoratif ── */}
      <div className="admin-login-glass-col" style={{ position: 'relative', overflow: 'hidden', background: 'var(--black-2)', borderLeft: '1px solid var(--card-border)' }}>
        <AuroraBackground variant="full" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              width: '100%', maxWidth: '380px',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
          >
            {/* Mockup form field — blur/dekoratif, tidak fungsional */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }}>
              <div>
                <div style={{ height: 8, width: '55%', background: 'rgba(255,255,255,0.25)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 34, background: 'rgba(255,255,255,0.08)', borderRadius: 8 }} />
              </div>
              <div>
                <div style={{ height: 8, width: '55%', background: 'rgba(255,255,255,0.25)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 34, background: 'rgba(255,255,255,0.08)', borderRadius: 8 }} />
              </div>
            </div>
            <div style={{ height: 8, width: '35%', background: 'rgba(255,255,255,0.25)', borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 60, background: 'rgba(255,255,255,0.08)', borderRadius: 8, marginBottom: '1.3rem' }} />

            {/* Mockup stat row — angka asli data CV */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.8rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { v: '21', l: 'Skills' },
                { v: '6', l: 'Sertifikasi' },
                { v: '4', l: 'Posisi' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--accent2)' }}>{s.v}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, var(--amber), var(--accent2))' }} />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-login-grid { grid-template-columns: 1fr !important; }
          .admin-login-glass-col { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
