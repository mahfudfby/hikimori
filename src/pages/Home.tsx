// src/pages/Home.tsx — FINAL
// Hero & ContactSection: dipertahankan dari implementasi sekarang
// Sections lain (About, Skills, Experience, CTA): diambil dari Home.tsx baru (localStorage-driven)
// Navbar: src/components/Navbar.tsx (fixed, dirender dari App.tsx)
// Footer: src/components/Footer.tsx (dirender di bawah ContactSection)

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Footer from '../components/Footer';

/* ─── LocalStorage Keys ─── */
const LS_HOME       = 'hk_home_data';
const LS_HOME_ABOUT = 'hk_home_about_data';
const LS_SKILLS     = 'hk_skills_data';
const LS_EXPERIENCE = 'hk_experience_data';

/* ─── Types ─── */
interface HomeData {
  heroTitle: string; heroSubtitle: string; heroTagline: string;
  heroCta: string;   heroCtaLink: string;  heroPhotoUrl: string;
}
interface HomeAboutData {
  name: string; location: string; bio1: string; bio2: string; photoUrl: string;
}
interface SkillItem  { id: string; number: string; title: string; desc: string; }
interface ExpItem    { id: string; position: string; company: string; period: string; icon: string; tags: string; }

/* ─── Defaults ─── */
const defaultHome: HomeData = {
  heroTitle: 'MAHFUDFEBRY', heroSubtitle: 'STYANTO',
  heroTagline: 'HR Professional · Admin · IT Support · Creative Designer',
  heroCta: 'Lihat Portfolio', heroCtaLink: '/portofolio', heroPhotoUrl: '',
};
const defaultHomeAbout: HomeAboutData = {
  name: 'Mahfudfebry', location: 'Nganjuk, Indonesia',
  bio1: 'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',
  bio2: 'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',
  photoUrl: '',
};
const defaultSkills: SkillItem[] = [
  { id: '1', number: '01', title: 'Branding & Identity Design', desc: "Crafting memorable logos and visual systems that reflect a brand's essence and personality." },
  { id: '2', number: '02', title: 'Creativity & Problem-Solving', desc: 'Thinking outside the box while solving design challenges with strategic insight.' },
  { id: '3', number: '03', title: 'Concept Development', desc: 'Skilled in brainstorming and translating abstract ideas into compelling visual narratives.' },
  { id: '4', number: '04', title: 'Proper Time Management', desc: 'Capable of handling multiple projects and meeting tight deadlines consistently.' },
];
const defaultExperience: ExpItem[] = [
  { id: '1', position: 'HR / General Affairs', company: 'UD Duta Pangan', period: '2020 – 2023', icon: '👥', tags: 'Vendor Management,Stock Monitoring,Facility Maintenance,Workload Analysis' },
  { id: '2', position: 'Staff Administrasi', company: 'UD Duta Pangan', period: '2020 – 2023', icon: '📋', tags: 'Document Processing,Administrative Support,Filing & Archiving,Reporting' },
  { id: '3', position: 'IT Support', company: 'UD Duta Pangan', period: '2020 – 2023', icon: '💻', tags: 'Hardware Troubleshooting,Software Installation,Network Setup,User Training' },
];

const FALLBACK_PHOTO = 'https://res.cloudinary.com/dl4pyan8v/image/upload/WhatsApp_Image_2026-06-16_at_03.45.15_axvhg3';

const ls = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

/* ─── Constants ─── */
const HERO_VIDEO    = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';
const CONTACT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES_LIST = ['Website','Mobile App','Web App','E-Commerce','Visual Identity','3D & Motion','Digital Marketing','Growth & Consulting','Other'];

/* ═══════════════════════════════════════
   SHOOTING STARS CANVAS
═══════════════════════════════════════ */
const ShootingStarsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    interface Star { x: number; y: number; r: number; a: number; da: number; }
    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3, a: Math.random(),
      da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    }));
    interface Shoot { x: number; y: number; vx: number; vy: number; len: number; life: number; maxLife: number; alpha: number; }
    const shoots: Shoot[] = [];
    let nextShoot = 0, t = 0;
    const spawnShoot = () => {
      const angle = (Math.random() * 20 + 20) * (Math.PI / 180);
      const speed = Math.random() * 6 + 8;
      const len = Math.random() * 140 + 100;
      const life = len / speed;
      shoots.push({ x: Math.random() * canvas.width * 0.8, y: Math.random() * canvas.height * 0.4, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, len, life, maxLife: life, alpha: 1 });
    };
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a = Math.max(0.1, Math.min(1, s.a + s.da));
        if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill();
      });
      t++;
      if (t >= nextShoot) { spawnShoot(); nextShoot = t + Math.floor(Math.random() * 160 + 80); }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        const progress = 1 - s.life / s.maxLife;
        s.alpha = s.life < 20 ? s.life / 20 : 1;
        const ang = Math.atan2(s.vy, s.vx);
        const tailX = s.x - Math.cos(ang) * s.len * Math.min(progress * 2, 1);
        const tailY = s.y - Math.sin(ang) * s.len * Math.min(progress * 2, 1);
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(245,166,35,0)`);
        grad.addColorStop(0.5, `rgba(255,255,255,${s.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,200,${s.alpha})`; ctx.fill();
        s.x += s.vx; s.y += s.vy; s.life--;
        if (s.life <= 0) shoots.splice(i, 1);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

/* ═══════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════ */
const roles = ['Admin Staff', 'HR Professional', 'IT Support', 'Creative Designer'];
const Typewriter: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [del, setDel] = useState(false);
  const [wait, setWait] = useState(false);
  useEffect(() => {
    const target = roles[idx];
    if (wait) { const t = setTimeout(() => setWait(false), 1400); return () => clearTimeout(t); }
    if (!del && text === target) { setWait(true); setDel(true); return; }
    if (del && text === '') { setDel(false); setIdx(i => (i + 1) % roles.length); return; }
    const speed = del ? 55 : 90;
    const t = setTimeout(() => { setText(del ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1)); }, speed);
    return () => clearTimeout(t);
  }, [text, del, idx, wait]);
  return (
    <span style={{ color: 'var(--amber)', fontWeight: 700 }}>
      {text}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--amber)', marginLeft: '2px', verticalAlign: 'text-bottom' }} />
    </span>
  );
};

/* ─── Decorative SVG elements ─── */
const SquiggleLeft: React.FC = () => (
  <motion.svg width="28" height="60" viewBox="0 0 28 60" fill="none"
    animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', left: '2rem', top: '38%', opacity: 0.7 }}>
    <path d="M14 4 Q24 14 14 24 Q4 34 14 44 Q24 54 14 58" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </motion.svg>
);
const SquiggleRight: React.FC = () => (
  <motion.svg width="50" height="30" viewBox="0 0 50 30" fill="none"
    animate={{ x: [0, 10, 0], y: [0, -5, 0], opacity: [0.65, 1, 0.65] }}
    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', right: '2rem', bottom: '22%', opacity: 0.65 }}>
    <path d="M4 15 Q14 4 24 15 Q34 26 44 15" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </motion.svg>
);
const DiagonalAccent: React.FC = () => (
  <motion.svg width="140" height="140" viewBox="0 0 140 140" fill="none"
    animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.04, 1] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', right: '8%', top: '14%', opacity: 0.55, pointerEvents: 'none' }}>
    <motion.line x1="130" y1="10" x2="10" y2="130" stroke="url(#dg)" strokeWidth="1.5"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0,1,1,0], opacity: [0,1,1,0] }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }} />
    <motion.circle cx="10" cy="130" r="3" fill="#F5A623"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0,2,0], opacity: [0,1,0] }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5, delay: 1.8, ease: 'easeOut' }} />
    <defs>
      <linearGradient id="dg" x1="130" y1="10" x2="10" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5A623" stopOpacity="0"/>
        <stop offset="60%" stopColor="white" stopOpacity="1"/>
        <stop offset="100%" stopColor="#F5A623" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
  </motion.svg>
);
const DotPair: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: 'flex', gap: '6px', ...style }}>
    <motion.div animate={{ scale: [1,1.5,1], opacity: [1,0.5,1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }} />
    <motion.div animate={{ scale: [1,1.5,1], opacity: [0.4,1,0.4] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
  </div>
);
const FloatingRing: React.FC<{ style?: React.CSSProperties; size?: number; delay?: number }> = ({ style, size = 60, delay = 0 }) => (
  <motion.div animate={{ y: [0,-18,0], rotate: [0,180,360], opacity: [0.15,0.35,0.15] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: '1.5px solid rgba(245,166,35,0.4)', pointerEvents: 'none', ...style }} />
);
const FloatingPlus: React.FC<{ style?: React.CSSProperties; delay?: number }> = ({ style, delay = 0 }) => (
  <motion.svg width="20" height="20" viewBox="0 0 20 20"
    animate={{ rotate: [0,90,180,270,360], scale: [1,1.3,1], opacity: [0.4,0.8,0.4] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'linear', delay }}
    style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
    <line x1="10" y1="2" x2="10" y2="18" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2" y1="10" x2="18" y2="10" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
  </motion.svg>
);
const FloatingDot: React.FC<{ style?: React.CSSProperties; delay?: number; color?: string }> = ({ style, delay = 0, color = '#F5A623' }) => (
  <motion.div animate={{ y: [0,-20,0], x: [0,8,0], opacity: [0.3,0.7,0.3] }}
    transition={{ duration: 4.5 + delay * 0.7, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: color, pointerEvents: 'none', ...style }} />
);
const MiniWave: React.FC<{ style?: React.CSSProperties; delay?: number; flip?: boolean }> = ({ style, delay = 0, flip = false }) => (
  <motion.svg width="40" height="16" viewBox="0 0 40 16" fill="none"
    animate={{ x: flip ? [0,-8,0] : [0,8,0], y: [0,-6,0], opacity: [0.4,0.8,0.4] }}
    transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
    <path d="M2 8 Q10 2 20 8 Q30 14 38 8" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </motion.svg>
);
const GlobalDecorations: React.FC = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    <FloatingRing size={80}  delay={0}   style={{ top: '12%',   left: '5%'   }} />
    <FloatingRing size={40}  delay={1.2} style={{ top: '60%',   left: '3%'   }} />
    <FloatingRing size={55}  delay={2}   style={{ top: '30%',   right: '4%'  }} />
    <FloatingRing size={30}  delay={0.7} style={{ bottom: '18%',right: '8%'  }} />
    <FloatingRing size={20}  delay={1.8} style={{ bottom: '35%',left: '8%'  }} />
    <FloatingPlus delay={0}   style={{ top: '22%',  left: '14%'  }} />
    <FloatingPlus delay={1}   style={{ top: '70%',  left: '10%'  }} />
    <FloatingPlus delay={0.5} style={{ top: '18%',  right: '14%' }} />
    <FloatingPlus delay={1.5} style={{ bottom: '22%',right: '18%'}} />
    <FloatingPlus delay={2.2} style={{ top: '45%',  left: '92%'  }} />
    <MiniWave delay={0}   style={{ top: '8%',    left: '20%'  }} />
    <MiniWave delay={1.2} style={{ top: '55%',   left: '2%'   }} flip />
    <MiniWave delay={0.6} style={{ bottom: '12%',right: '5%'  }} flip />
    <MiniWave delay={1.8} style={{ top: '80%',   left: '60%'  }} />
    <MiniWave delay={2.5} style={{ top: '35%',   right: '2%'  }} flip />
    <FloatingDot delay={0}   style={{ top: '15%',  left: '50%'  }} />
    <FloatingDot delay={0.8} style={{ top: '42%',  left: '1%'   }} />
    <FloatingDot delay={1.4} style={{ top: '75%',  left: '96%'  }} />
    <FloatingDot delay={2}   style={{ bottom: '8%',left: '30%'  }} color="rgba(255,255,255,0.6)" />
    <FloatingDot delay={0.5} style={{ top: '6%',   right: '25%' }} color="rgba(255,255,255,0.5)" />
    <FloatingDot delay={1.9} style={{ bottom: '30%',left: '50%' }} />
    <FloatingDot delay={3}   style={{ top: '90%',  right: '45%' }} color="rgba(255,255,255,0.4)" />
    <motion.div animate={{ scaleY: [0.4,1,0.4], opacity: [0.4,0.8,0.4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', right: 0, top: '10%', width: '3px', height: '25vh', background: 'linear-gradient(to bottom, transparent, var(--amber), transparent)', borderRadius: '2px' }} />
    <motion.div animate={{ scaleY: [1,0.4,1], opacity: [0.3,0.6,0.3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      style={{ position: 'absolute', left: 0, bottom: '15%', width: '3px', height: '20vh', background: 'linear-gradient(to bottom, transparent, var(--amber), transparent)', borderRadius: '2px' }} />
  </div>
);

/* ─── Liquid-glass style ─── */
const liquidGlass: React.CSSProperties = {
  background: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
  position: 'relative',
};

/* ─── FadeIn ─── */
interface FadeInProps { children: React.ReactNode; delay?: number; duration?: number; style?: React.CSSProperties; }
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, duration = 1000, style = {} }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: visible ? 1 : 0, transition: `opacity ${duration}ms ease`, ...style }}>{children}</div>;
};

/* ─── AnimatedHeading ─── */
interface AHProps { text: string; initialDelay?: number; charDelay?: number; style?: React.CSSProperties; }
const AnimatedHeading: React.FC<AHProps> = ({ text, initialDelay = 200, charDelay = 30, style = {} }) => {
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
                <span key={ci} style={{ display: 'inline-block', opacity: animated ? 1 : 0, transform: animated ? 'translateX(0)' : 'translateX(-18px)', transition: `opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s` }}>
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

/* ─── Inline SVG Icons ─── */
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
const SocialBtn: React.FC<{ icon: React.ReactNode; bg: string; color: string }> = ({ icon, bg, color }) => (
  <button type="button" style={{ width: 32, height: 32, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color, flexShrink: 0 }}>{icon}</button>
);

/* ═══════════════════════════════════════
   CONTACT SECTION (dipertahankan)
═══════════════════════════════════════ */
const ContactSection: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false); setSent(true);
  };
  const inp: React.CSSProperties = {
    flex: 1, minWidth: 0, fontSize: '0.875rem', padding: '10px 12px',
    borderRadius: 12, border: '1px solid #e5e7eb', background: 'transparent',
    outline: 'none', fontFamily: "'Space Grotesk',sans-serif", color: '#111',
  };

  return (
    <section style={{ width: '100%', padding: '12px', background: '#fff', boxSizing: 'border-box', fontFamily: "'Space Grotesk',sans-serif" }}>
      <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', minHeight: 'calc(100vh - 24px)', display: 'flex', flexDirection: 'column' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={CONTACT_VIDEO} type="video/mp4" />
        </video>
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', gap: 24, minHeight: 'calc(100vh - 24px)', boxSizing: 'border-box' }}>
          {/* Navbar inside contact */}
          <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '8px 8px 8px 16px', display: 'flex', alignItems: 'center', gap: 24 }}>
            <svg viewBox="0 0 256 256" width={32} height={32} style={{ flexShrink: 0 }}>
              <path fill="#000" d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
              <path fill="#000" d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <div style={{ display: 'flex', gap: 24, flex: 1 }} id="contact-nav-inner">
              {['Our story','Expertise','Our work','Journal'].map(l => (
                <a key={l} href="#" style={{ color: '#1f2937', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>{l}</a>
              ))}
            </div>
            <button style={{ background: '#000', color: '#fff', fontSize: '0.875rem', fontWeight: 500, padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Start a project
            </button>
          </div>
          <div style={{ flex: 1, minHeight: 32 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} id="contact-bottom">
            <p style={{ color: '#fff', fontSize: 'clamp(1.75rem,4vw,3rem)', fontWeight: 500, lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.3)', margin: 0 }} id="contact-headline">
              We craft bold ideas<br />
              and ship them as{' '}
              <span style={{ fontFamily: "'Georgia',serif", fontStyle: 'italic', fontWeight: 400 }}>products</span>
            </p>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#f9fafb', borderRadius: 16, padding: '10px 16px' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 2px 0' }}>Drop us a line</p>
                        <a href="mailto:hello@forma.co" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>hello@forma.co</a>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <SocialBtn icon={<IconTwitter />} bg="#f3f4f6" color="#1f2937" />
                        <SocialBtn icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>} bg="#fce7f3" color="#ec4899" />
                        <SocialBtn icon={<IconInstagram />} bg="#ffedd5" color="#fb923c" />
                        <SocialBtn icon={<IconLinkedin />} bg="#dbeafe" color="#2563eb" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 500 }}>OR</span>
                      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    </div>
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
                          {SERVICES_LIST.map(s => (
                            <button key={s} type="button" onClick={() => toggle(s)} style={{ fontSize: '0.75rem', fontWeight: 500, padding: '8px 12px', borderRadius: 8, border: selected.includes(s) ? '1px solid #000' : '1px solid #e5e7eb', background: selected.includes(s) ? '#f3f4f6' : '#fff', color: selected.includes(s) ? '#000' : '#374151', cursor: 'pointer' }}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <button type="submit" disabled={sending} style={{ width: '100%', background: '#000', color: '#fff', fontSize: '0.875rem', fontWeight: 600, padding: '12px 0', borderRadius: 16, border: 'none', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.6 : 1 }}>
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
        @media (max-width: 767px) { #contact-nav-inner { display: none !important; } }
        @media (min-width: 1024px) {
          #contact-bottom { flex-direction: row !important; align-items: flex-end !important; justify-content: space-between !important; }
          #contact-headline { max-width: 32rem; }
          #contact-form-col { width: min(480px, 45%) !important; }
        }
      `}</style>
    </section>
  );
};

/* ══════════════════════════════════
   HOME PAGE
══════════════════════════════════ */
const Home: React.FC = () => {
  const [hero, setHero]     = useState<HomeData>(() => ls(LS_HOME, defaultHome));
  const [about, setAbout]   = useState<HomeAboutData>(() => ls(LS_HOME_ABOUT, defaultHomeAbout));
  const [skills, setSkills] = useState<SkillItem[]>(() => ls(LS_SKILLS, defaultSkills));
  const [exps, setExps]     = useState<ExpItem[]>(() => ls(LS_EXPERIENCE, defaultExperience));

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_HOME       && e.newValue) try { setHero(JSON.parse(e.newValue));   } catch {}
      if (e.key === LS_HOME_ABOUT && e.newValue) try { setAbout(JSON.parse(e.newValue));  } catch {}
      if (e.key === LS_SKILLS     && e.newValue) try { setSkills(JSON.parse(e.newValue)); } catch {}
      if (e.key === LS_EXPERIENCE && e.newValue) try { setExps(JSON.parse(e.newValue));   } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const aboutPhoto = about.photoUrl || FALLBACK_PHOTO;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', position: 'relative' }}>
      <GlobalDecorations />

      {/* ══ HERO — VIDEO BACKGROUND (dipertahankan) ══ */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '70px clamp(1.5rem,4vw,4rem) 0' }}>
          {/* hero content pushed to bottom */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 'clamp(3rem,4vw,4rem)' }}>
            <div id="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', alignItems: 'flex-end', gap: '2rem' }}>
              <div>
                <AnimatedHeading text={"Shaping tomorrow\nwith vision and action."}
                  style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)', fontWeight: 400, marginBottom: '1rem', letterSpacing: '-0.04em', lineHeight: 1.1, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }} />
                <FadeIn delay={800} duration={1000}>
                  <p style={{ fontSize: 'clamp(1rem,1.5vw,1.125rem)', color: '#d1d5db', marginBottom: '1.25rem', fontWeight: 400, margin: '0 0 1.25rem 0' }}>
                    We back visionaries and craft ventures that define what comes next.
                  </p>
                </FadeIn>
                <FadeIn delay={1200} duration={1000}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <button style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}>
                      Start a Chat
                    </button>
                    <button id="explore-btn" style={{ ...liquidGlass, border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}>
                      Explore Now
                    </button>
                  </div>
                </FadeIn>
              </div>
              <div id="hero-tag-col" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <FadeIn delay={1400} duration={1000}>
                  <div style={{ ...liquidGlass, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '12px 24px', display: 'inline-block' }}>
                    <span style={{ fontSize: 'clamp(1.125rem,2.5vw,1.5rem)', fontWeight: 300, color: '#fff' }}>Investing. Building. Advisory.</span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ME SECTION (localStorage-driven) ══ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="home-about-grid">
          <AnimatedSection direction="left">
            <div className="float-hover" style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '3/4', maxHeight: '500px' }}>
              <img src={aboutPhoto} alt={`About ${about.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                <div style={{ background: 'rgba(245,166,35,0.9)', borderRadius: '12px', padding: '0.8rem 1.2rem', color: 'var(--black)', fontWeight: 700, fontSize: '0.9rem' }}>
                  📍 {about.location}
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>About Me</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 0.9, marginBottom: '0.3rem' }}>ABOUT ME !</h2>
            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '2rem', fontWeight: 700, display: 'block', marginBottom: '1.8rem' }}>{about.name}</span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1.2rem', fontSize: '1rem' }}>{about.bio1}</p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: '1rem' }}>{about.bio2}</p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/about" style={{ display: 'inline-block', background: 'transparent', color: 'var(--amber)', textDecoration: 'none', borderRadius: '50px', padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', border: '1px solid rgba(245,166,35,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(245,166,35,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                Selengkapnya →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ SKILLS & TOOLS (localStorage-driven) ══ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--black)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,6rem)', lineHeight: 0.9 }}>
                SKILLS &{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  TOOLS
                  <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '45%', position: 'absolute', bottom: '-0.5rem', right: '-2rem', whiteSpace: 'nowrap' }}>Signature</span>
                </span>
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.2rem' }}>
            {skills.map((skill, i) => (
              <AnimatedSection key={skill.id} direction="up" delay={i * 0.1}>
                <motion.div className="float-hover" whileHover={{ borderColor: 'rgba(245,166,35,0.35)' }}
                  style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.12)', borderRadius: 'var(--radius)', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                  <div style={{ position: 'absolute', top: '8px', right: '16px', fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'rgba(245,166,35,0.06)', lineHeight: 1, userSelect: 'none' }}>{skill.number}</div>
                  <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.6rem', position: 'relative', zIndex: 1 }}>{skill.number}</div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.7rem', position: 'relative', zIndex: 1 }}>{skill.title}</h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.88rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>{skill.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PENGALAMAN KERJA (localStorage-driven) ══ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,6rem)', lineHeight: 0.9 }}>
                PENGALAMAN{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '50%' }}>Kerja</span>
              </h2>
              <p style={{ color: 'var(--white-dim)', marginTop: '1rem', fontSize: '0.95rem' }}>Pengalaman Profesional &amp; Riwayat Kerja</p>
            </div>
          </AnimatedSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
            {exps.map((exp, i) => (
              <AnimatedSection key={exp.id} direction="up" delay={i * 0.12}>
                <motion.div className="float-hover" whileHover={{ borderColor: 'rgba(245,166,35,0.35)', x: 6 }}
                  style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.1)', borderRadius: 'var(--radius)', padding: '1.8rem 2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem', transition: 'border-color 0.3s, transform 0.3s', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-1px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', background: 'linear-gradient(to bottom, transparent, var(--amber), transparent)', borderRadius: '0 4px 4px 0' }} />
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245,166,35,0.1)', border: '2px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{exp.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', lineHeight: 1.1 }}>{exp.position}</h3>
                      {exp.period && <span style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--amber)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0 }}>{exp.period}</span>}
                    </div>
                    {exp.company && <div style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '1.1rem', marginBottom: '0.8rem' }}>{exp.company}</div>}
                    {exp.tags && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {exp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                          <span key={tag} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--white-dim)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 500 }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{exp.icon}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <AnimatedSection direction="scale">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', marginBottom: '1rem' }}>SIAP BERKOLABORASI?</h2>
          <p style={{ color: 'var(--white-dim)', marginBottom: '2.5rem', fontSize: '1rem' }}>Hubungi saya dan kita mulai wujudkan ide Anda bersama.</p>
          <motion.a href={`mailto:${ls<string>('hk_contact_email','mahfudfebry@hikimori.web.id')}`}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(245,166,35,0.4)' }} whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-block', background: 'var(--amber)', color: 'var(--black)', textDecoration: 'none', borderRadius: '50px', padding: '16px 48px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px' }}>
            Mulai Sekarang →
          </motion.a>
        </AnimatedSection>
      </section>

      {/* ══ CONTACT SECTION (dipertahankan) ══ */}
      <ContactSection />

      {/* ══ FOOTER ══ */}
      <Footer />

      <style>{`
        @media (min-width: 1024px) {
          #hero-grid { grid-template-columns: 1fr 1fr !important; }
          #hero-tag-col { justify-content: flex-end !important; }
        }
        @media (max-width: 768px) {
          .home-about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
