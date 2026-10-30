// src/components/Layout.tsx — Navbar (pill ala dashboard), Footer, tombol mengambang.
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from './ui';
import LogoMark from './LogoMark';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { pick } from '../content/derive';

export const NAV = [
  { to: '/', id: 'Dashboard', en: 'Dashboard' },
  { to: '/profil', id: 'Profil', en: 'Profile' },
  { to: '/pengalaman', id: 'Pengalaman', en: 'Experience' },
  { to: '/pendidikan', id: 'Pendidikan', en: 'Education' },
  { to: '/sertifikat', id: 'Sertifikat', en: 'Certificates' },
  { to: '/keahlian', id: 'Keahlian', en: 'Skills' },
  { to: '/layanan', id: 'Layanan', en: 'Services' },
  { to: '/portofolio', id: 'Portofolio', en: 'Portfolio' },
  { to: '/kontak', id: 'Kontak', en: 'Contact' },
];

export const Navbar: React.FC = () => {
  const { content } = useContent();
  const { lang, toggle: toggleLang } = useLang();
  const { mode, toggle: toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header className="nav no-print">
      <div className="shell nav-inner">
        <Link to="/" className="brand">
          <LogoMark height={24} />
          <span>{content.profile.shortName || 'Hikimori'}</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {({ isActive }) => <>{isActive && <i className="nav-bg" />}<span>{lang === 'en' ? n.en : n.id}</span></>}
            </NavLink>
          ))}
        </nav>

        <div className="nav-tools">
          <button className="pill white" onClick={toggleLang} aria-label={`${lang.toUpperCase()} — ${lang === 'en' ? 'ganti ke Bahasa Indonesia' : 'switch to English'}`} title="ID / EN">
            <Icon name="globe" size={16} />{lang.toUpperCase()}
          </button>
          <button className="icon-btn nav-opt" onClick={toggleTheme} aria-label={mode === 'dark' ? (lang === 'en' ? 'Light mode' : 'Mode terang') : (lang === 'en' ? 'Dark mode' : 'Mode gelap')}>
            <Icon name={mode === 'dark' ? 'sun' : 'moon'} />
          </button>
          <Link to={isAdmin ? '/admin' : '/admin/login'} className="icon-btn nav-opt" aria-label="Admin" title={isAdmin ? 'CMS' : 'Login'}>
            <Icon name={isAdmin ? 'gear' : 'user'} />
          </Link>
          <button className="icon-btn dark nav-burger" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Menu">
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="nav-sheet" aria-label="Mobile">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {pick({ id: n.id, en: n.en }, lang)}
            </NavLink>
          ))}
          {/* Layar sempit: tema & admin pindah ke sini supaya navbar muat */}
          <div className="nav-sheet-tools">
            <button className="pill" onClick={toggleTheme}><Icon name={mode === 'dark' ? 'sun' : 'moon'} size={16} />{mode === 'dark' ? (lang === 'en' ? 'Light mode' : 'Mode terang') : (lang === 'en' ? 'Dark mode' : 'Mode gelap')}</button>
            <Link to={isAdmin ? '/admin' : '/admin/login'} className="pill"><Icon name={isAdmin ? 'gear' : 'user'} size={16} />{isAdmin ? 'CMS' : 'Login'}</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLang();
  const p = content.profile;
  return (
    <footer className="footer no-print">
      <div className="shell">
        <div className="row between wrap gap-16" style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
          <div className="row gap-12">
            <LogoMark height={20} />
            <span>© {new Date().getFullYear()} {p.name}</span>
          </div>
          <div className="row wrap gap-16">
            {NAV.slice(1).map(n => <Link key={n.to} to={n.to}>{lang === 'en' ? n.en : n.id}</Link>)}
          </div>
          <div className="row gap-8">
            {p.email && <a className="icon-btn sm" href={`mailto:${p.email}`} aria-label="Email"><Icon name="mail" size={15} /></a>}
            {p.whatsapp && <a className="icon-btn sm" href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="chat" size={15} /></a>}
            {p.socials.linkedin && <a className="icon-btn sm" href={`https://linkedin.com/in/${p.socials.linkedin}`} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="link" size={15} /></a>}
          </div>
        </div>
      </div>
    </footer>
  );
};

/** Tombol kembali ke atas — muncul setelah scroll. */
export const Floaters: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (!show) return null;
  return (
    <div className="floaters no-print">
      <button className="icon-btn dark" onClick={() => window.scrollTo({ top: 0 })} aria-label="Back to top"><Icon name="up" /></button>
    </div>
  );
};

export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="shell page-in">{children}</main>
);
