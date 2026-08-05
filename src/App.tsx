// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import LanguageToggle from './components/LanguageToggle';
import { useLang } from './contexts/LanguageContext';

import Home from './pages/Home';
// Halaman selain Home di-lazy-load juga: pengunjung yang cuma buka landing
// page tidak perlu download kode About/Services/Portofolio sama sekali.
const About      = React.lazy(() => import('./pages/About'));
const Services   = React.lazy(() => import('./pages/Services'));
const Portofolio = React.lazy(() => import('./pages/Portofolio'));
// Admin hanya dipakai pemilik situs — di-lazy-load supaya tidak membengkakkan
// bundle JS utama yang didownload oleh setiap pengunjung publik.
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

const AdminFallback: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', color: 'var(--amber)', fontFamily: 'var(--font-body)' }}>
    Loading…
  </div>
);

/* ─── Floating Gear Button ─── */
const FloatingGear: React.FC = () => {
  // Read admin state from localStorage directly — avoids coupling to AuthContext
  const [isAdmin, setIsAdmin] = React.useState(
    () => localStorage.getItem('hk_admin_session') === 'true'
  );
  const location = useLocation();
  const [hovered, setHovered] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const { t } = useLang();

  // Sync with storage changes (login/logout in other tab)
  React.useEffect(() => {
    const sync = () =>
      setIsAdmin(localStorage.getItem('hk_admin_session') === 'true');
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  const handleClick = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
    window.location.href = isAdmin ? '/admin' : '/admin/login';
  };

  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: hovered
      ? 'linear-gradient(135deg, #F5A623, #D4891F)'
      : 'linear-gradient(135deg, rgba(245,166,35,0.85), rgba(212,137,31,0.85))',
    boxShadow: hovered
      ? '0 8px 32px rgba(245,166,35,0.6), 0 0 0 3px rgba(245,166,35,0.2)'
      : '0 4px 20px rgba(245,166,35,0.4), 0 0 0 1px rgba(245,166,35,0.15)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'all 0.25s ease',
    transform: hovered ? 'scale(1.1)' : 'scale(1)',
    overflow: 'hidden',
  };

  const ringStyle: React.CSSProperties = {
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    border: '2px solid rgba(245,166,35,0.4)',
    animation: 'gear-pulse 2s ease-in-out infinite',
    pointerEvents: 'none',
  };

  const svgStyle: React.CSSProperties = {
    transition: 'transform 0.6s ease',
    transform: spinning ? 'rotate(180deg)' : hovered ? 'rotate(60deg)' : 'rotate(0deg)',
    flexShrink: 0,
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isAdmin ? t('Buka Admin Panel', 'Open Admin Panel') : t('Login Admin', 'Admin Login')}
      style={btnStyle}
      aria-label="Admin Panel"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={svgStyle}>
        <path
          d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.92s-.03-.63-.07-.93l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.3-.07.63-.07.94s.03.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z"
          fill="#0a0a0a"
        />
      </svg>
      <span style={ringStyle} />
      <style>{`
        @keyframes gear-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.18); opacity: 0; }
        }
      `}</style>
    </button>
  );
};

/* ─── Animated Routes ─── */
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isHome  = location.pathname === '/';
  const { t } = useLang();

  return (
    <>
      {!isAdmin && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"            element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about"       element={
            <React.Suspense fallback={<AdminFallback />}>
              <PageTransition><About /></PageTransition>
            </React.Suspense>
          } />
          <Route path="/services"    element={
            <React.Suspense fallback={<AdminFallback />}>
              <PageTransition><Services /></PageTransition>
            </React.Suspense>
          } />
          <Route path="/portofolio"  element={
            <React.Suspense fallback={<AdminFallback />}>
              <PageTransition><Portofolio /></PageTransition>
            </React.Suspense>
          } />
          <Route path="/admin/login" element={
            <React.Suspense fallback={<AdminFallback />}>
              <PageTransition><AdminLogin /></PageTransition>
            </React.Suspense>
          } />
          <Route path="/admin" element={
            <React.Suspense fallback={<AdminFallback />}>
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            </React.Suspense>
          } />
          <Route path="*" element={
            <PageTransition>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', gap: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', color: 'var(--amber)', lineHeight: 1 }}>404</div>
                <p style={{ color: 'var(--white-dim)', fontSize: '1.1rem' }}>{t('Halaman tidak ditemukan.', 'Page not found.')}</p>
                <a href="/" style={{ background: 'var(--amber)', color: 'var(--black)', padding: '10px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, marginTop: '1rem' }}>
                  {t('Kembali ke Home', 'Back to Home')}
                </a>
              </div>
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>

      {!isAdmin && !isHome && <Footer />}
      <FloatingGear />
      {!isAdmin && <LanguageToggle />}
    </>
  );
};

/* ─── App ─── */
const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <LanguageProvider>
      <CursorGlow />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--black-2)',
            color: 'var(--white)',
            border: '1px solid rgba(245,166,35,0.3)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#F5A623', secondary: '#0a0a0a' } },
        }}
      />
      <AnimatedRoutes />
      </LanguageProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
