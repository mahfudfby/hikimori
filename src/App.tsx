// src/App.tsx — routing. Home di bundle utama; semua halaman lain & CMS di-lazy-load.
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLang } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ContentProvider } from './content/ContentContext';
import { Navbar, Footer, Floaters } from './components/Layout';
import { useCursorFx } from './components/ui';
import Home from './pages/Home';
import seo from './seo/routes.json';

/** Meta description / canonical / Open Graph per halaman (sumber sama dengan scripts/prerender-meta.js). */
const setHeadMeta = (pathname: string) => {
  const meta = (seo.routes as Record<string, { title: string; description: string }>)[pathname];
  if (!meta) return;
  const url = seo.site + (pathname === '/' ? '' : pathname);
  const upsert = (sel: string, make: () => HTMLElement, attr: string, value: string) => {
    let el = document.head.querySelector(sel) as HTMLElement | null;
    if (!el) { el = make(); document.head.appendChild(el); }
    el.setAttribute(attr, value);
  };
  const meta_ = (key: string, attr = 'name') => () => { const m = document.createElement('meta'); m.setAttribute(attr, key); return m; };
  upsert('meta[name="description"]', meta_('description'), 'content', meta.description);
  upsert('meta[property="og:title"]', meta_('og:title', 'property'), 'content', meta.title);
  upsert('meta[property="og:description"]', meta_('og:description', 'property'), 'content', meta.description);
  upsert('meta[property="og:url"]', meta_('og:url', 'property'), 'content', url);
  upsert('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }, 'href', url);
};

const Profile = lazy(() => import('./pages/Profile'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminPanel = lazy(() => import('./admin/AdminPanel'));

const Loading: React.FC = () => (
  <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><div className="spinner" aria-label="Loading" /></div>
);

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Loading />;
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const NotFound: React.FC = () => {
  const { t } = useLang();
  return (
    <main className="shell page-in">
      <div className="frame center" style={{ padding: '80px 20px' }}>
        <div className="num-xl" style={{ fontSize: 'clamp(5rem,16vw,9rem)' }}>404</div>
        <p className="muted mt-16">{t('Halaman yang kamu cari tidak ditemukan.', "The page you're looking for doesn't exist.")}</p>
        <div className="row gap-8 mt-24" style={{ justifyContent: 'center' }}>
          <Link to="/" className="pill dark lg">{t('Ke Dashboard', 'To Dashboard')}</Link>
          <Link to="/kontak" className="pill lg">{t('Kontak', 'Contact')}</Link>
        </div>
      </div>
    </main>
  );
};

const Shell: React.FC = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  useCursorFx(!isAdmin);
  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); setHeadMeta(pathname); }, [pathname]);
  return (
    <>
      {!isAdmin && <Navbar />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/pengalaman" element={<ExperiencePage />} />
          <Route path="/pendidikan" element={<EducationPage />} />
          <Route path="/sertifikat" element={<CertificatesPage />} />
          <Route path="/keahlian" element={<SkillsPage />} />
          <Route path="/layanan" element={<ServicesPage />} />
          <Route path="/portofolio" element={<PortfolioPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          {/* URL lama tetap jalan */}
          <Route path="/about" element={<Navigate to="/profil" replace />} />
          <Route path="/services" element={<Navigate to="/layanan" replace />} />
          <Route path="/portfolio" element={<Navigate to="/portofolio" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<Protected><AdminPanel /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && <Floaters />}
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ContentProvider>
            <Shell />
          </ContentProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
