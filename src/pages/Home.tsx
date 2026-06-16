// src/pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

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
  heroTitle: 'MAHFUD FEBRY', heroSubtitle: 'STYANTO',
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

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80';

const ls = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

/* ═══════════════════════════════════════
   SHOOTING STARS CANVAS
═══════════════════════════════════════ */
const ShootingStarsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Static star field ── */
    interface Star { x: number; y: number; r: number; a: number; da: number; }
    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.4 + 0.3,
      a:  Math.random(),
      da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    }));

    /* ── Shooting star ── */
    interface Shoot {
      x: number; y: number;
      vx: number; vy: number;
      len: number; life: number; maxLife: number; alpha: number;
    }
    const shoots: Shoot[] = [];
    let nextShoot = 0;

    const spawnShoot = () => {
      const angle  = (Math.random() * 20 + 20) * (Math.PI / 180); // 20-40°
      const speed  = Math.random() * 6 + 8;
      const len    = Math.random() * 140 + 100;
      const life   = len / speed;
      shoots.push({
        x: Math.random() * canvas.width * 0.8,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len, life, maxLife: life, alpha: 1,
      });
    };

    let t = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* twinkling stars */
      stars.forEach(s => {
        s.a = Math.max(0.1, Math.min(1, s.a + s.da));
        if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      });

      /* spawn shooting stars */
      t++;
      if (t >= nextShoot) {
        spawnShoot();
        nextShoot = t + Math.floor(Math.random() * 160 + 80); // every 80-240 frames
      }

      /* draw + update shooting stars */
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        const progress = 1 - s.life / s.maxLife;
        s.alpha = s.life < 20 ? s.life / 20 : 1;

        const tailX = s.x - Math.cos(Math.atan2(s.vy, s.vx)) * s.len * Math.min(progress * 2, 1);
        const tailY = s.y - Math.sin(Math.atan2(s.vy, s.vx)) * s.len * Math.min(progress * 2, 1);

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0,   `rgba(245,166,35,0)`);
        grad.addColorStop(0.5, `rgba(255,255,255,${s.alpha * 0.4})`);
        grad.addColorStop(1,   `rgba(255,255,255,${s.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        /* bright head */
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,200,${s.alpha})`;
        ctx.fill();

        s.x += s.vx;
        s.y += s.vy;
        s.life--;
        if (s.life <= 0) shoots.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
};

/* ═══════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════ */
const roles = ['Admin Staff', 'HR Professional', 'IT Support', 'Creative Designer'];

const Typewriter: React.FC = () => {
  const [idx, setIdx]     = useState(0);
  const [text, setText]   = useState('');
  const [del, setDel]     = useState(false);
  const [wait, setWait]   = useState(false);

  useEffect(() => {
    const target = roles[idx];
    if (wait) { const t = setTimeout(() => setWait(false), 1400); return () => clearTimeout(t); }
    if (!del && text === target) { setWait(true); setDel(true); return; }
    if (del && text === '') { setDel(false); setIdx(i => (i + 1) % roles.length); return; }
    const speed = del ? 55 : 90;
    const t = setTimeout(() => {
      setText(del ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, idx, wait]);

  return (
    <span style={{ color: 'var(--amber)', fontWeight: 700 }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--amber)', marginLeft: '2px', verticalAlign: 'text-bottom' }}
      />
    </span>
  );
};

/* ── Squiggle / decorative svgs ── */
const SquiggleLeft: React.FC = () => (
  <motion.svg
    width="28" height="60" viewBox="0 0 28 60" fill="none"
    animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', left: '2rem', top: '38%', opacity: 0.7 }}
  >
    <path d="M14 4 Q24 14 14 24 Q4 34 14 44 Q24 54 14 58" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </motion.svg>
);

const SquiggleRight: React.FC = () => (
  <motion.svg
    width="50" height="30" viewBox="0 0 50 30" fill="none"
    animate={{ x: [0, 10, 0], y: [0, -5, 0], opacity: [0.65, 1, 0.65] }}
    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', right: '2rem', bottom: '22%', opacity: 0.65 }}
  >
    <path d="M4 15 Q14 4 24 15 Q34 26 44 15" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </motion.svg>
);

/* shooting-star diagonal accent line */
const DiagonalAccent: React.FC = () => (
  <motion.svg
    width="140" height="140" viewBox="0 0 140 140" fill="none"
    animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.04, 1] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', right: '8%', top: '14%', opacity: 0.55, pointerEvents: 'none' }}
  >
    <motion.line
      x1="130" y1="10" x2="10" y2="130"
      stroke="url(#dg)" strokeWidth="1.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="10" cy="130" r="3"
      fill="#F5A623"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5, delay: 1.8, ease: 'easeOut' }}
    />
    <defs>
      <linearGradient id="dg" x1="130" y1="10" x2="10" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5A623" stopOpacity="0"/>
        <stop offset="60%" stopColor="white" stopOpacity="1"/>
        <stop offset="100%" stopColor="#F5A623" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
  </motion.svg>
);

/* Dot pair — both dots pulse independently */
const DotPair: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: 'flex', gap: '6px', ...style }}>
    <motion.div
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }}
    />
    <motion.div
      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }}
    />
  </div>
);

/* ── Floating amber ring ── */
const FloatingRing: React.FC<{ style?: React.CSSProperties; size?: number; delay?: number }> = ({ style, size = 60, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -18, 0], rotate: [0, 180, 360], opacity: [0.15, 0.35, 0.15] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{
      position: 'absolute',
      width: size, height: size,
      borderRadius: '50%',
      border: '1.5px solid rgba(245,166,35,0.4)',
      pointerEvents: 'none',
      ...style,
    }}
  />
);

/* ── Floating amber plus/cross ── */
const FloatingPlus: React.FC<{ style?: React.CSSProperties; delay?: number }> = ({ style, delay = 0 }) => (
  <motion.svg
    width="20" height="20" viewBox="0 0 20 20"
    animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'linear', delay }}
    style={{ position: 'absolute', pointerEvents: 'none', ...style }}
  >
    <line x1="10" y1="2" x2="10" y2="18" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="2" y1="10" x2="18" y2="10" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
  </motion.svg>
);

/* ── Floating dot ── */
const FloatingDot: React.FC<{ style?: React.CSSProperties; delay?: number; color?: string }> = ({ style, delay = 0, color = '#F5A623' }) => (
  <motion.div
    animate={{ y: [0, -20, 0], x: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 4.5 + delay * 0.7, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{
      position: 'absolute',
      width: 6, height: 6,
      borderRadius: '50%',
      background: color,
      pointerEvents: 'none',
      ...style,
    }}
  />
);

/* ── Floating small squiggle (reusable, randomized) ── */
const MiniWave: React.FC<{ style?: React.CSSProperties; delay?: number; flip?: boolean }> = ({ style, delay = 0, flip = false }) => (
  <motion.svg
    width="40" height="16" viewBox="0 0 40 16" fill="none"
    animate={{
      x: flip ? [0, -8, 0] : [0, 8, 0],
      y: [0, -6, 0],
      opacity: [0.4, 0.8, 0.4],
    }}
    transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', pointerEvents: 'none', ...style }}
  >
    <path d="M2 8 Q10 2 20 8 Q30 14 38 8" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </motion.svg>
);

/* ── Global always-moving decorations overlay ── (rendered at page level, fixed) */
const GlobalDecorations: React.FC = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {/* Rings */}
    <FloatingRing size={80}  delay={0}   style={{ top: '12%',  left: '5%'   }} />
    <FloatingRing size={40}  delay={1.2} style={{ top: '60%',  left: '3%'   }} />
    <FloatingRing size={55}  delay={2}   style={{ top: '30%',  right: '4%'  }} />
    <FloatingRing size={30}  delay={0.7} style={{ bottom: '18%', right: '8%' }} />
    <FloatingRing size={20}  delay={1.8} style={{ bottom: '35%', left: '8%' }} />

    {/* Plus crosses */}
    <FloatingPlus delay={0}   style={{ top: '22%',  left: '14%' }} />
    <FloatingPlus delay={1}   style={{ top: '70%',  left: '10%' }} />
    <FloatingPlus delay={0.5} style={{ top: '18%',  right: '14%' }} />
    <FloatingPlus delay={1.5} style={{ bottom: '22%', right: '18%' }} />
    <FloatingPlus delay={2.2} style={{ top: '45%',  left: '92%'  }} />

    {/* Mini waves */}
    <MiniWave delay={0}   style={{ top: '8%',   left: '20%'  }} />
    <MiniWave delay={1.2} style={{ top: '55%',  left: '2%'   }} flip />
    <MiniWave delay={0.6} style={{ bottom: '12%', right: '5%' }} flip />
    <MiniWave delay={1.8} style={{ top: '80%',  left: '60%'  }} />
    <MiniWave delay={2.5} style={{ top: '35%',  right: '2%'  }} flip />

    {/* Floating dots scattered */}
    <FloatingDot delay={0}   style={{ top: '15%',  left: '50%' }} />
    <FloatingDot delay={0.8} style={{ top: '42%',  left: '1%'  }} />
    <FloatingDot delay={1.4} style={{ top: '75%',  left: '96%' }} />
    <FloatingDot delay={2}   style={{ bottom: '8%', left: '30%' }} color="rgba(255,255,255,0.6)" />
    <FloatingDot delay={0.5} style={{ top: '6%',   right: '25%' }} color="rgba(255,255,255,0.5)" />
    <FloatingDot delay={1.9} style={{ bottom: '30%', left: '50%' }} />
    <FloatingDot delay={3}   style={{ top: '90%',  right: '45%' }} color="rgba(255,255,255,0.4)" />

    {/* Amber vertical bar accent (right side) */}
    <motion.div
      animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', right: 0, top: '10%',
        width: '3px', height: '25vh',
        background: 'linear-gradient(to bottom, transparent, var(--amber), transparent)',
        borderRadius: '2px',
      }}
    />

    {/* Amber vertical bar accent (left side) */}
    <motion.div
      animate={{ scaleY: [1, 0.4, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      style={{
        position: 'absolute', left: 0, bottom: '15%',
        width: '3px', height: '20vh',
        background: 'linear-gradient(to bottom, transparent, var(--amber), transparent)',
        borderRadius: '2px',
      }}
    />
  </div>
);

/* ══════════════════════════════════
   HOME PAGE
══════════════════════════════════ */
const Home: React.FC = () => {
  const [hero, setHero]         = useState<HomeData>(() => ls(LS_HOME, defaultHome));
  const [about, setAbout]       = useState<HomeAboutData>(() => ls(LS_HOME_ABOUT, defaultHomeAbout));
  const [skills, setSkills]     = useState<SkillItem[]>(() => ls(LS_SKILLS, defaultSkills));
  const [exps, setExps]         = useState<ExpItem[]>(() => ls(LS_EXPERIENCE, defaultExperience));

  /* Real-time sync dari admin panel */
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
  const heroPhoto  = hero.heroPhotoUrl  || '';

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', position: 'relative' }}>

      {/* ══ GLOBAL ALWAYS-MOVING DECORATIONS ══ */}
      <GlobalDecorations />

      {/* ══ HERO SECTION ══ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        paddingTop: '70px', padding: '70px 2rem 0',
      }}>
        {/* Animated canvas background — stars + shooting stars */}
        <ShootingStarsCanvas />

        {/* Decorative elements */}
        <SquiggleLeft />
        <SquiggleRight />
        <DiagonalAccent />
        <DotPair style={{ position: 'absolute', left: '2rem', bottom: '5.5%' }} />
        <DotPair style={{ position: 'absolute', right: '2rem', bottom: '5.5%' }} />

        {/* Pulsing amber glow radial behind text */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />

        {/* Hero content — centered like screenshot */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px', width: '100%' }}>

          {/* Sub-label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span style={{
              fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem', letterSpacing: '5px', textTransform: 'uppercase',
              fontWeight: 600, display: 'block', marginBottom: '1.4rem',
            }}>
              CREATIVE PORTFOLIO PRESENTATION &nbsp;·&nbsp; NGANJUK, Indonesia
            </span>
          </motion.div>

          {/* Giant title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 11vw, 9rem)',
              lineHeight: 0.88,
              letterSpacing: '-2px',
              marginBottom: '0',
              whiteSpace: 'nowrap',
            }}>
              {hero.heroTitle || 'MAHFUD FEBRY'}'S
            </h1>
          </motion.div>

          {/* Script subtitle */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--amber)',
              fontSize: 'clamp(2.2rem, 6vw, 5rem)',
              fontWeight: 700,
              display: 'block',
              marginTop: '-0.2rem',
              marginBottom: '1.6rem',
            }}>
              {hero.heroSubtitle || 'Hikimori'}
            </span>
          </motion.div>

          {/* Typewriter role */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '2.4rem',
              letterSpacing: '0.5px',
            }}
          >
            Saya seorang <Typewriter />
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            <motion.div
              whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(245,166,35,0.35)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={hero.heroCtaLink}
                style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: 'var(--white)',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  padding: '15px 42px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  border: '1.5px solid rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {hero.heroCta || 'A Curated Portfolio of Purpose-Driven and Visually Engaging Work'}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Photo — tampil jika diisi di admin panel */}
        {heroPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}
          >
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%',
              overflow: 'hidden', border: '3px solid var(--amber)',
              boxShadow: '0 0 40px rgba(245,166,35,0.25)',
            }}>
              <img src={heroPhoto} alt={hero.heroTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            zIndex: 1,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(245,166,35,0.8), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ══ ABOUT ME SECTION (di Home) ══ */}
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
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              About Me
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.9, marginBottom: '0.3rem' }}>
              ABOUT ME !
            </h2>
            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '2rem', fontWeight: 700, display: 'block', marginBottom: '1.8rem' }}>
              {about.name}
            </span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1.2rem', fontSize: '1rem' }}>{about.bio1}</p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: '1rem' }}>{about.bio2}</p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/about"
                style={{ display: 'inline-block', background: 'transparent', color: 'var(--amber)', textDecoration: 'none', borderRadius: '50px', padding: '12px 28px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', border: '1px solid rgba(245,166,35,0.4)', transition: 'all 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(245,166,35,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                Selengkapnya →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ SKILLS & TOOLS SECTION ══ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--black)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 0.9 }}>
                SKILLS &{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  TOOLS
                  <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '45%', position: 'absolute', bottom: '-0.5rem', right: '-2rem', whiteSpace: 'nowrap' }}>
                    Signature
                  </span>
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
            {skills.map((skill, i) => (
              <AnimatedSection key={skill.id} direction="up" delay={i * 0.1}>
                <motion.div
                  className="float-hover"
                  whileHover={{ borderColor: 'rgba(245,166,35,0.35)' }}
                  style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.12)', borderRadius: 'var(--radius)', padding: '2rem', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                  {/* Besar nomor di background */}
                  <div style={{ position: 'absolute', top: '8px', right: '16px', fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'rgba(245,166,35,0.06)', lineHeight: 1, userSelect: 'none' }}>
                    {skill.number}
                  </div>
                  <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.6rem', position: 'relative', zIndex: 1 }}>
                    {skill.number}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.7rem', position: 'relative', zIndex: 1 }}>
                    {skill.title}
                  </h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.88rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
                    {skill.desc}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PENGALAMAN KERJA SECTION ══ */}
      <section style={{ padding: '6rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 0.9 }}>
                PENGALAMAN{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '50%' }}>Kerja</span>
              </h2>
              <p style={{ color: 'var(--white-dim)', marginTop: '1rem', fontSize: '0.95rem' }}>
                Pengalaman Profesional &amp; Riwayat Kerja
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
            {exps.map((exp, i) => (
              <AnimatedSection key={exp.id} direction="up" delay={i * 0.12}>
                <motion.div
                  className="float-hover"
                  whileHover={{ borderColor: 'rgba(245,166,35,0.35)', x: 6 }}
                  style={{
                    background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.1)',
                    borderRadius: 'var(--radius)', padding: '1.8rem 2rem',
                    display: 'flex', alignItems: 'flex-start', gap: '1.5rem',
                    transition: 'border-color 0.3s, transform 0.3s',
                    position: 'relative',
                  }}>
                  {/* Glow dot kiri */}
                  <div style={{
                    position: 'absolute', left: '-1px', top: '50%', transform: 'translateY(-50%)',
                    width: '4px', height: '60%', background: 'linear-gradient(to bottom, transparent, var(--amber), transparent)',
                    borderRadius: '0 4px 4px 0',
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'rgba(245,166,35,0.1)', border: '2px solid rgba(245,166,35,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                  }}>
                    {exp.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', lineHeight: 1.1 }}>
                        {exp.position}
                      </h3>
                      {exp.period && (
                        <span style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--amber)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0 }}>
                          {exp.period}
                        </span>
                      )}
                    </div>
                    {exp.company && (
                      <div style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '1.1rem', marginBottom: '0.8rem' }}>
                        {exp.company}
                      </div>
                    )}
                    {exp.tags && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {exp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                          <span key={tag} style={{
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                            color: 'var(--white-dim)', borderRadius: '6px', padding: '4px 12px',
                            fontSize: '0.78rem', fontWeight: 500,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right icon circle */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}>
                    {exp.icon}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <AnimatedSection direction="scale">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '1rem' }}>
            SIAP BERKOLABORASI?
          </h2>
          <p style={{ color: 'var(--white-dim)', marginBottom: '2.5rem', fontSize: '1rem' }}>
            Hubungi saya dan kita mulai wujudkan ide Anda bersama.
          </p>
          <motion.a
            href={`mailto:${ls<string>('hk_contact_email', 'mahfudfebry@hikimori.web.id')}`}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(245,166,35,0.4)' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-block', background: 'var(--amber)', color: 'var(--black)', textDecoration: 'none', borderRadius: '50px', padding: '16px 48px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', letterSpacing: '1px' }}>
            Mulai Sekarang →
          </motion.a>
        </AnimatedSection>
      </section>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .home-hero-grid  { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .home-about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
