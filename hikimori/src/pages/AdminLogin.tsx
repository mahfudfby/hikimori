// src/pages/AdminLogin.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Background decorative */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: 'var(--black-2)',
          border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top amber bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--amber), transparent)',
          borderRadius: '0 0 3px 3px',
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--amber)',
            letterSpacing: '3px',
            marginBottom: '0.5rem',
          }}>
            MFD-FBY's
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
          }}>
            ADMIN PANEL
          </h1>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.88rem' }}>
            Masuk untuk mengelola konten website
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{
              display: 'block',
              color: 'var(--white-dim)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              style={{
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
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              color: 'var(--white-dim)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                style={{
                  width: '100%',
                  background: 'var(--black-3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 48px 12px 16px',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--white-dim)',
                  fontSize: '1.1rem',
                  padding: 0,
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(245,166,35,0.4)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: loading ? 'rgba(245,166,35,0.5)' : 'var(--amber)',
              color: 'var(--black)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.5px',
              marginTop: '0.5rem',
            }}
          >
            {loading ? '⌛ Masuk...' : 'MASUK →'}
          </motion.button>
        </form>

        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.78rem',
          marginTop: '2rem',
        }}>
          Hikimori-Project.com © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
