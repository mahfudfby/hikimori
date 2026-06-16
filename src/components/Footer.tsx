// src/components/Footer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── LocalStorage Key ─── */
const LS_CONTACT = 'hk_contact_data';

/* ─── Types ─── */
interface ContactData {
  whatsapp: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  website: string;
  email: string;
  showWhatsapp: boolean;
  showInstagram: boolean;
  showLinkedin: boolean;
  showTiktok: boolean;
  showWebsite: boolean;
  showEmail: boolean;
}

const defaultContact: ContactData = {
  whatsapp: '6281234567890',
  instagram: 'mahfudfebry',
  linkedin: 'mahfudfebry',
  tiktok: 'mahfudfebry',
  website: 'https://hikimori-project.com',
  email: 'mahfudfebry@hikimori.web.id',
  showWhatsapp: true,
  showInstagram: true,
  showLinkedin: true,
  showTiktok: false,
  showWebsite: true,
  showEmail: true,
};

const ls = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

/* ─── Social Button Config ─── */
interface SocialBtn {
  key: keyof ContactData;
  toggle: keyof ContactData;
  label: string;
  icon: string;
  getUrl: (val: string) => string;
  color: string;
  bg: string;
}

const SOCIAL_BTNS: SocialBtn[] = [
  {
    key: 'whatsapp', toggle: 'showWhatsapp', label: 'WhatsApp', icon: '💬',
    getUrl: v => `https://wa.me/${v.replace(/\D/g, '')}`,
    color: '#25D366', bg: 'rgba(37,211,102,0.1)',
  },
  {
    key: 'instagram', toggle: 'showInstagram', label: 'Instagram', icon: '📸',
    getUrl: v => `https://instagram.com/${v.replace('@', '')}`,
    color: '#E1306C', bg: 'rgba(225,48,108,0.1)',
  },
  {
    key: 'linkedin', toggle: 'showLinkedin', label: 'LinkedIn', icon: '💼',
    getUrl: v => `https://linkedin.com/in/${v.replace('@', '')}`,
    color: '#0A66C2', bg: 'rgba(10,102,194,0.1)',
  },
  {
    key: 'tiktok', toggle: 'showTiktok', label: 'TikTok', icon: '🎵',
    getUrl: v => `https://tiktok.com/@${v.replace('@', '')}`,
    color: '#EE1D52', bg: 'rgba(238,29,82,0.1)',
  },
  {
    key: 'website', toggle: 'showWebsite', label: 'Website', icon: '🌐',
    getUrl: v => v.startsWith('http') ? v : `https://${v}`,
    color: '#F5A623', bg: 'rgba(245,166,35,0.1)',
  },
  {
    key: 'email', toggle: 'showEmail', label: 'Email', icon: '📧',
    getUrl: v => `mailto:${v}`,
    color: '#A78BFA', bg: 'rgba(167,139,250,0.1)',
  },
];

/* ─── Contact Us Bar Component ─── */
export const ContactUsBar: React.FC = () => {
  const [contact, setContact] = useState<ContactData>(() => ls(LS_CONTACT, defaultContact));
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_CONTACT && e.newValue) {
        try { setContact(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const activeButtons = SOCIAL_BTNS.filter(btn => contact[btn.toggle] && String(contact[btn.key]).trim() !== '');

  if (activeButtons.length === 0) return null;

  return (
    <div style={{
      background: 'var(--black-3)',
      borderTop: '1px solid rgba(245,166,35,0.1)',
      borderBottom: '1px solid rgba(245,166,35,0.1)',
      padding: '1.4rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        flexWrap: 'wrap',
      }}>
        {/* Label */}
        <div style={{
          color: 'var(--white-dim)',
          fontSize: '0.78rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 600,
          flexShrink: 0,
          paddingRight: '0.5rem',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}>
          📲 Hubungi
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {activeButtons.map(btn => {
            const val = String(contact[btn.key]);
            const isHovered = hovered === btn.key;
            return (
              <a
                key={btn.key}
                href={btn.getUrl(val)}
                target={btn.key === 'email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(btn.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: isHovered ? btn.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHovered ? btn.color + '55' : 'rgba(255,255,255,0.1)'}`,
                  color: isHovered ? btn.color : 'var(--white-dim)',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 6px 18px ${btn.color}22` : 'none',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{btn.icon}</span>
                {btn.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Footer ─── */
const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--black-2)', borderTop: '1px solid rgba(245,166,35,0.15)', marginTop: 'auto' }}>

      {/* ── Contact Us Bar (muncul di semua halaman) ── */}
      <ContactUsBar />

      {/* ── Footer Body ── */}
      <div style={{ padding: '3rem 2rem 2rem' }}>
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
              { label: 'Home',       to: '/' },
              { label: 'About',      to: '/about' },
              { label: 'Services',   to: '/services' },
              { label: 'Portofolio', to: '/portofolio' },
            ].map(link => (
              <div key={link.to} style={{ marginBottom: '0.5rem' }}>
                <Link
                  to={link.to}
                  style={{ color: 'var(--white-dim)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-dim)')}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact Info (dinamis dari LS) */}
          <FooterContactInfo />
        </div>

        {/* Bottom bar */}
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
          <Link
            to="/admin/login"
            style={{ color: 'rgba(245,166,35,0.3)', fontSize: '0.75rem', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,166,35,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,166,35,0.3)')}
          >
            Admin ⚙️
          </Link>
        </div>
      </div>
    </footer>
  );
};

/* ─── Footer Contact Info Block (sync dengan LS) ─── */
const FooterContactInfo: React.FC = () => {
  const [contact, setContact] = useState<ContactData>(() => ls(LS_CONTACT, defaultContact));

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_CONTACT && e.newValue) {
        try { setContact(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const lines: { show: boolean; icon: string; text: string; href?: string }[] = [
    { show: contact.showWhatsapp,  icon: '💬', text: `+${contact.whatsapp}`,  href: `https://wa.me/${contact.whatsapp}` },
    { show: contact.showEmail,     icon: '📧', text: contact.email,           href: `mailto:${contact.email}` },
    { show: contact.showWebsite,   icon: '🌐', text: contact.website,         href: contact.website.startsWith('http') ? contact.website : `https://${contact.website}` },
    { show: contact.showInstagram, icon: '📸', text: `@${contact.instagram}`, href: `https://instagram.com/${contact.instagram}` },
    { show: contact.showLinkedin,  icon: '💼', text: contact.linkedin,        href: `https://linkedin.com/in/${contact.linkedin}` },
    { show: contact.showTiktok,    icon: '🎵', text: `@${contact.tiktok}`,    href: `https://tiktok.com/@${contact.tiktok}` },
  ];

  const visible = lines.filter(l => l.show && l.text.trim() && l.text !== '+' && l.text !== '@');

  return (
    <div>
      <h4 style={{ color: 'var(--amber)', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
        Kontak
      </h4>
      {visible.map((line, i) => (
        <div key={i} style={{ marginBottom: '0.45rem' }}>
          {line.href ? (
            <a
              href={line.href}
              target={line.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              style={{ color: 'var(--white-dim)', fontSize: '0.88rem', lineHeight: 1.8, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-dim)')}
            >
              {line.icon} {line.text}
            </a>
          ) : (
            <span style={{ color: 'var(--white-dim)', fontSize: '0.88rem', lineHeight: 1.8 }}>
              {line.icon} {line.text}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Footer;
