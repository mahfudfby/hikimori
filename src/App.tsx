// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portofolio from './pages/Portofolio';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  return (
    <>
      {!isAdmin && !isHome && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/portofolio" element={<PageTransition><Portofolio /></PageTransition>} />
          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          {/* 404 fallback */}
          <Route path="*" element={
            <PageTransition>
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--black)',
                gap: '1rem',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', color: 'var(--amber)', lineHeight: 1 }}>404</div>
                <p style={{ color: 'var(--white-dim)', fontSize: '1.1rem' }}>Halaman tidak ditemukan.</p>
                <a href="/" style={{
                  background: 'var(--amber)',
                  color: 'var(--black)',
                  padding: '10px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  marginTop: '1rem',
                }}>
                  Kembali ke Home
                </a>
              </div>
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            success: {
              iconTheme: { primary: '#F5A623', secondary: '#0a0a0a' },
            },
          }}
        />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
