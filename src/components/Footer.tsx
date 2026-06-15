// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'var(--black-2)',
      borderTop: '1px solid rgba(245,166,35,0.15)',
      padding: '3rem 2rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            color: 'var(--amber)',
            marginBottom: '0.8rem',
            letterSpacing: '3px',
          }}>
            MFD-FBY's
          </div>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Hikimori Project — Creative Portfolio<br />
            Nganjuk, Indonesia
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ color: 'var(--amber)', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            Navigation
          </h4>
          {[
            { label: 'Home', to: '/' },
            { label: 'About', to: '/about' },
            { label: 'Services', to: '/services' },
            { label: 'Portofolio', to: '/portofolio' },
          ].map((link) => (
            <div key={link.to} style={{ marginBottom: '0.5rem' }}>
              <Link
                to={link.to}
                style={{
                  color: 'var(--white-dim)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-dim)')}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'var(--amber)', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            Kontak
          </h4>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            📍 Nganjuk, Indonesia<br />
            🌐 Hikimori-Project.com<br />
            📧 mahfudfebry@hikimori.web.id
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <p style={{ color: 'var(--white-faint)', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} Mahfudfebry — Hikimori Project. All rights reserved.
        </p>
        <Link to="/admin/login" style={{ color: 'rgba(245,166,35,0.3)', fontSize: '0.75rem', textDecoration: 'none' }}>
          Admin
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
