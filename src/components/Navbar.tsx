// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAdmin, logout }       = useAuth();
  const location                  = useLocation();
  const navigate                  = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { label: 'Home',       to: '/'          },
    { label: 'About',      to: '/about'      },
    { label: 'Services',   to: '/services'   },
    { label: 'Portofolio', to: '/portofolio' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 2rem', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(245,166,35,0.15)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* ── Logo ── */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--amber)', letterSpacing: '2px' }}>
            MFD-FBY's
          </span>
        </motion.div>
      </Link>

      {/* ── Desktop Links ── */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
        {links.map(link => (
          <Link key={link.to} to={link.to} style={{ textDecoration: 'none', position: 'relative' }}>
            <motion.span whileHover={{ color: '#F5A623' }}
              style={{ color: isActive(link.to) ? 'var(--amber)' : 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.95rem', letterSpacing: '0.5px', transition: 'color 0.3s ease' }}>
              {link.label}
            </motion.span>
            {isActive(link.to) && (
              <motion.div layoutId="nav-indicator"
                style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: 'var(--amber)', borderRadius: '2px' }} />
            )}
          </Link>
        ))}

        {/* ── Auth buttons ── */}
        {isAdmin ? (
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05, backgroundColor: '#D4891F' }} whileTap={{ scale: 0.97 }}
                style={{ background: 'var(--amber)', color: 'var(--black)', border: 'none', borderRadius: '8px', padding: '8px 18px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.5px' }}>
                ⚙ Admin
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleLogout} disabled={loggingOut}
              style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '7px 14px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              {loggingOut ? '...' : 'Logout'}
            </motion.button>
          </div>
        ) : (
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <motion.button whileHover={{ scale: 1.05, backgroundColor: 'rgba(245,166,35,0.12)' }} whileTap={{ scale: 0.97 }}
              style={{ background: 'transparent', color: 'var(--amber)', border: '1px solid rgba(245,166,35,0.4)', borderRadius: '8px', padding: '8px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.25s' }}>
              🔐 Login
            </motion.button>
          </Link>
        )}
      </div>

      {/* ── Mobile Hamburger ── */}
      <button onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', padding: '4px' }}
        className="hamburger" aria-label="Toggle menu">
        {[0, 1, 2].map(i => (
          <motion.span key={i}
            animate={menuOpen ? i === 1 ? { opacity: 0 } : i === 0 ? { rotate: 45, y: 8 } : { rotate: -45, y: -8 } : { rotate: 0, y: 0, opacity: 1 }}
            style={{ display: 'block', width: '24px', height: '2px', background: 'var(--amber)', borderRadius: '2px' }} />
        ))}
      </button>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'absolute', top: '70px', left: 0, right: 0, background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(245,166,35,0.2)', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {links.map((link, i) => (
              <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={link.to} style={{ textDecoration: 'none', color: isActive(link.to) ? 'var(--amber)' : 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.1rem' }}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {isAdmin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>⚙ Admin Panel</span>
                </Link>
                <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '8px 16px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" style={{ textDecoration: 'none' }}>
                <span style={{ color: 'var(--amber)', fontWeight: 700 }}>🔐 Login Admin</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
