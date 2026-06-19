// src/pages/Home.tsx
// CRA + TypeScript — NO Tailwind, NO lucide-react, NO react-icons
// Uses only inline styles, CSS vars from index.css, and inline SVGs

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

// ─── Inline SVG Icons (no external icon lib needed) ────────────────────────
const IconTwitter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconCircle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

// ─── Constants ─────────────────────────────────────────────────────────────
const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';
const CONTACT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES = [
  'Website','Mobile App','Web App','E-Commerce',
  'Visual Identity','3D & Motion','Digital Marketing',
  'Growth & Consulting','Other',
];

// ─── Data ──────────────────────────────────────────────────────────────────
const skills = [
  { num:'01', title:'Branding & Identity Design', desc:"Crafting memorable logos and visual systems that reflect a brand's essence and personality." },
  { num:'02', title:'Creativity & Problem-Solving', desc:'Thinking outside the box while solving design challenges with strategic insight.' },
  { num:'03', title:'Concept Development', desc:'Skilled in brainstorming and translating abstract ideas into compelling visual narratives.' },
  { num:'04', title:'Proper Time Management', desc:'Capable of handling multiple projects and meeting tight deadlines consistently.' },
];
const experiences = [
  { role:'HR / General Affairs', company:'UD Duta Pangan', tasks:['Vendor Management','Stock Monitoring','Facility Maintenance','Workload Analysis'], icon:'👥' },
  { role:'Staff Administrasi', company:'UD Duta Pangan', tasks:['Document Processing','Administrative Support','Filing & Archiving','Reporting'], icon:'📋' },
  { role:'IT Support', company:'UD Duta Pangan', tasks:['Hardware Troubleshooting','Software Installation','Network Setup','User Training'], icon:'💻' },
];

// ─── Liquid-glass style object (reusable) ──────────────────────────────────
const liquidGlass: React.CSSProperties = {
  background: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
  position: 'relative',
};

// ─── FadeIn ────────────────────────────────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, duration = 1000, style = {} }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transition: `opacity ${duration}ms ease`, ...style }}>
      {children}
    </div>
  );
};

// ─── AnimatedHeading ───────────────────────────────────────────────────────
interface AnimatedHeadingProps {
  text: string;
  initialDelay?: number;
  charDelay?: number;
  style?: React.CSSProperties;
}
const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ text, initialDelay = 200, charDelay = 30, style = {} }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), initialDelay); return () => clearTimeout(t); }, [initialDelay]);
  const lines = text.split('\n');
  return (
    <h1 style={{ margin: 0, ...style }}>
      {lines.map((line, li) => {
        const prevChars = lines.slice(0, li).reduce((a, l) => a + l.length, 0);
        return (
          <span key={li} style={{ display: 'block' }}>
            {line.split('').map((char, ci) => {
              const delay = (initialDelay + (prevChars + ci) * charDelay) / 1000;
              return (
                <span key={ci} style={{
                  display: 'inline-block',
                  opacity: animated ? 1 : 0,
                  transform: animated ? 'translateX(0)' : 'translateX(-18px)',
                  transition: `opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s`,
                }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

// ─── SocialBtn ─────────────────────────────────────────────────────────────
interface SocialBtnProps { icon: React.ReactNode; bg: string; color: string; }
const SocialBtn: React.FC<SocialBtnProps> = ({ icon, bg, color }) => (
  <button type="button" style={{
    width: 32, height: 32, borderRadius: 12, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg, color, flexShrink: 0,
  }}>{icon}</button>
);

// ─── ContactSection ────────────────────────────────────────────────────────
const ContactSection: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggle = (s: string) =>
    setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
  };

  const inp: React.CSSProperties = {
    flex: 1, minWidth: 0, fontSize: '0.875rem', padding: '10px 12px',
    borderRadius: 12, border: '1px solid #e5e7eb', background: 'transparent',
    outline: 'none', fontFamily: "'Inter','Space Grotesk',sans-serif", color: '#111',
  };

  return (
    <section style={{ width: '100%', padding: '12px', background: '#fff', boxSizing: 'border-box', fontFamily: "'Inter','Space Grotesk',sans-serif" }}>
      {/* Outer card */}
      <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 'calc(100vh - 24px)', display: 'flex', flexDirection: 'column' }}>
        {/* Video */}
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={CONTACT_VIDEO} type="video/mp4" />
        </video>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', gap: 24, minHeight: 'calc(100vh - 24px)', boxSizing: 'border-box' }}>

          {/* Navbar */}
          <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '8px 8px 8px 16px', display: 'flex', alignItems: 'center', gap: 24 }}>
            <svg viewBox="0 0 256 256" width={32} height={32} style={{ flexShrink: 0 }}>
              <path fill="#000" d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
              <path fill="#000" d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <div style={{ display: 'flex', gap: 24, flex: 1 }}>
              {['Our story','Expertise','Our work','Journal'].map(l => (
                <a key={l} href="#" style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>{l}</a>
              ))}
            </div>
            <button style={{ background: '#000', color: '#fff', fontSize: '0.875rem', fontWeight: 500, padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0, fontFamily: "'Inter',sans-serif" }}>
              Start a project
            </button>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, minHeight: 32 }} />

          {/* Bottom row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} id="contact-bottom">
            {/* Headline */}
            <p style={{ color: '#fff', fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 500, lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.3)', margin: 0 }}>
              We craft bold ideas<br />
              and ship them as{' '}
              <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontWeight: 400 }}>products</span>
            </p>

            {/* Form card */}
            <div style={{ width: '100%', maxWidth: 480 }} id="contact-form-col">
              <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.25)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sent ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✓</div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111', margin: 0 }}>You're all set!</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Expect a reply within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#000', letterSpacing: '-0.02em', margin: 0 }}>Say hello! 👋</h2>

                    {/* Email + socials */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#f9fafb', borderRadius: 16, padding: '10px 16px' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 2px 0' }}>Drop us a line</p>
                        <a href="mailto:hello@forma.co" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>hello@forma.co</a>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <SocialBtn icon={<IconTwitter />} bg="#f3f4f6" color="#1f2937" />
                        <SocialBtn icon={<IconCircle />} bg="#fce7f3" color="#ec4899" />
                        <SocialBtn icon={<IconInstagram />} bg="#ffedd5" color="#fb923c" />
                        <SocialBtn icon={<IconLinkedin />} bg="#dbeafe" color="#2563eb" />
                      </div>
                    </div>

                    {/* OR divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 500 }}>OR</span>
                      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}>Tell us about your vision</label>

                      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                        <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={inp} />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
                      </div>

                      <textarea rows={4} placeholder="What are you looking to build or improve..." value={message} onChange={e => setMessage(e.target.value)} style={{ ...inp, resize: 'none', width: '100%', boxSizing: 'border-box' }} />

                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#000', marginBottom: 8 }}>I need help with...</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {SERVICES.map(s => (
                            <button key={s} type="button" onClick={() => toggle(s)} style={{
                              fontSize: '0.75rem', fontWeight: 500, padding: '8px 12px', borderRadius: 8,
                              border: selected.includes(s) ? '1px solid #000' : '1px solid #e5e7eb',
                              background: selected.includes(s) ? '#f3f4f6' : '#fff',
                              color: selected.includes(s) ? '#000' : '#374151',
                              cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                            }}>{s}</button>
                          ))}
                        </div>
                      </div>

                      <button type="submit" disabled={sending} style={{
                        width: '100%', background: '#000', color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                        padding: '12px 0', borderRadius: 16, border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
                        opacity: sending ? 0.6 : 1, fontFamily: "'Inter',sans-serif",
                      }}>
                        {sending ? 'Sending...' : 'Send my message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          #contact-bottom {
            flex-direction: row !important;
            align-items: flex-end !important;
            justify-content: space-between !important;
          }
          #contact-form-col {
            width: min(480px, 45%) !important;
          }
        }
      `}</style>
    </section>
  );
};

// ─── Home ──────────────────────────────────────────────────────────────────
const Home: React.FC = () => {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff', fontFamily: "'Inter','Space Grotesk',sans-serif" }}>

        {/* Video background — NO overlay */}
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {/* Content layer */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(1.5rem,4vw,1.5rem) clamp(1.5rem,4vw,4rem) 0' }}>

          {/* ── Navbar ── */}
          <nav>
            <div style={{ ...liquidGlass, borderRadius: 12, padding: '8px 8px 8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <span style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: '#fff', fontFamily: "'Inter',sans-serif" }}>
                Hikimori
              </span>
              {/* Center links — hidden on mobile, shown via CSS */}
              <div id="hero-nav-links" style={{ display: 'none', gap: '2rem', fontSize: '0.875rem' }}>
                {['Home','About Me','Sertifikasi','Portofolio'].map(link => (
                  <a key={link} href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.875rem' }}>{link}</a>
                ))}
              </div>
              {/* CTA */}
              <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '8px 24px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                Start a Chat
              </button>
            </div>
          </nav>

          {/* ── Hero content pushed to bottom ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 'clamp(3rem,4vw,4rem)' }}>
            <div id="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'flex-end', gap: '2rem' }}>

              {/* Left column */}
              <div>
                <AnimatedHeading
                  text={"Shaping tomorrow\nwith vision and action."}
                  initialDelay={200}
                  charDelay={30}
                  style={{
                    fontSize: 'clamp(2.5rem,7vw,4.5rem)',
                    fontWeight: 400,
                    marginBottom: '1rem',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.1,
                    color: '#fff',
                    fontFamily: "'Inter',sans-serif",
                  }}
                />
                <FadeIn delay={800} duration={1000}>
                  <p style={{ fontSize: 'clamp(1rem,1.5vw,1.125rem)', color: '#d1d5db', marginBottom: '1.25rem', fontWeight: 400, margin: '0 0 1.25rem 0' }}>
                    We back visionaries and craft ventures that define what comes next.
                  </p>
                </FadeIn>
                <FadeIn delay={1200} duration={1000}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                      Start a Chat
                    </button>
                    <button id="explore-btn" style={{ ...liquidGlass, border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                      Explore Now
                    </button>
                  </div>
                </FadeIn>
              </div>

              {/* Right column — tag */}
              <div id="hero-tag-col" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <FadeIn delay={1400} duration={1000}>
                  <div style={{ ...liquidGlass, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '12px 24px', display: 'inline-block' }}>
                    <span style={{ fontSize: 'clamp(1.125rem,2.5vw,1.5rem)', fontWeight: 300, color: '#fff', fontFamily: "'Inter',sans-serif" }}>
                      Investing. Building. Advisory.
                    </span>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Responsive hero CSS */}
      <style>{`
        #hero-nav-links { display: none; }
        @media (min-width: 768px) {
          #hero-nav-links { display: flex !important; }
        }
        @media (min-width: 1024px) {
          #hero-grid { grid-template-columns: 1fr 1fr !important; }
          #hero-tag-col { justify-content: flex-end !important; }
        }
      `}</style>

      {/* ═══════════════ ABOUT SECTION ═══════════════ */}
      <section id="about-grid" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <AnimatedSection direction="left">
          <div>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--amber)', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>About Me</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', lineHeight: 1, marginBottom: '0.3rem' }}>ABOUT ME !</h2>
            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '2.2rem', fontWeight: 700, display: 'block', marginBottom: '1.5rem' }}>Mahfudfebry</span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Halo! Nama saya <strong style={{ color: 'var(--white)' }}>Mahfudfebry</strong>, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.
            </p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8 }}>Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.</p>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right">
          <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--black-3)', aspectRatio: '4/3' }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="Mahfudfebry" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(245,166,35,0.2) 0%,transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(10,10,10,0.9)', borderRadius: 12, padding: '0.8rem 1.2rem', backdropFilter: 'blur(10px)' }}>
              <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem' }}>📍 Nganjuk, Indonesia</div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══════════════ SKILLS SECTION ═══════════════ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 0.9, display: 'inline-block', position: 'relative' }}>
                SKILLS &{' '}
                <span style={{ position: 'relative' }}>
                  TOOLS
                  <span style={{ position: 'absolute', top: '40%', left: '10%', fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%', transform: 'rotate(-3deg)', whiteSpace: 'nowrap' }}>Signature</span>
                </span>
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {skills.map((skill, i) => (
              <AnimatedSection key={skill.num} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.12)', borderRadius: 'var(--radius)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -10, right: -10, fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'rgba(245,166,35,0.06)', lineHeight: 1, userSelect: 'none' }}>{skill.num}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--amber)', marginBottom: '0.8rem' }}>{skill.num}</div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.7rem' }}>{skill.title}</h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>{skill.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPERIENCE SECTION ═══════════════ */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 0.9 }}>
              HR / GENERAL{' '}
              <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '60%' }}>Affairs</span>
            </h2>
            <p style={{ color: 'var(--white-dim)', marginTop: '1rem', fontSize: '1rem' }}>Pengalaman Profesional & Riwayat Kerja</p>
          </div>
        </AnimatedSection>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experiences.map((exp, i) => (
            <AnimatedSection key={exp.role} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
              <div style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.12)', borderRadius: 'var(--radius)', padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.3rem' }}>{exp.role}</h3>
                  <p style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{exp.company}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {exp.tasks.map(task => (
                      <span key={task} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', color: 'var(--amber)', borderRadius: 6, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>{task}</span>
                    ))}
                  </div>
                </div>
                <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(245,166,35,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{exp.icon}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════ CONTACT SECTION ═══════════════ */}
      <ContactSection />

      {/* Global responsive fixes */}
      <style>{`
        @media (max-width: 768px) {
          #about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
