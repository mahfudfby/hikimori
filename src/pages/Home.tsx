// src/pages/Home.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

/* ─── SQUIGGLE DECORATION ─── */
const Squiggle: React.FC<{ size?: number; rotate?: number; style?: React.CSSProperties }> = ({
  size = 60, rotate = 0, style
}) => (
  <svg
    width={size} height={size * 0.5}
    viewBox="0 0 60 30"
    style={{ color: 'var(--amber)', transform: `rotate(${rotate}deg)`, ...style }}
  >
    <path
      d="M0 15 Q10 0 20 15 Q30 30 40 15 Q50 0 60 15"
      fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
    />
  </svg>
);

/* ─── METEOR BACKGROUND (Canvas — smooth 60fps) ─── */
interface StarMeteor {
  x: number;        // current head x (px)
  y: number;        // current head y (px)
  vx: number;       // velocity x per frame
  vy: number;       // velocity y per frame
  tailLen: number;  // max tail length (px)
  life: number;     // 0 → 1, fraction of life spent
  speed: number;    // px per frame (diagonal)
  alpha: number;    // base opacity
  headR: number;    // head glow radius
  spawnDelay: number; // frames to wait before active
  delayLeft: number;
}

const MeteorShower: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteorsRef = useRef<StarMeteor[]>([]);
  const rafRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const nextSpawnRef = useRef<number>(0); // frame number of next spawn

  const spawnOne = (W: number, H: number, delay = 0): StarMeteor => {
    // angle: mostly going down-right, 20°–45°
    const angleDeg = 25 + Math.random() * 20;
    const angleRad = (angleDeg * Math.PI) / 180;
    const speed = 6 + Math.random() * 8;
    return {
      x: Math.random() * W * 1.1,
      y: -60 - Math.random() * 200,
      vx: Math.sin(angleRad) * speed,
      vy: Math.cos(angleRad) * speed,
      tailLen: 120 + Math.random() * 180,
      life: 0,
      speed,
      alpha: 0.75 + Math.random() * 0.25,
      headR: 1.8 + Math.random() * 1.6,
      spawnDelay: delay,
      delayLeft: delay,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed 5 staggered meteors on load
    const W = () => canvas.width;
    const H = () => canvas.height;
    meteorsRef.current = Array.from({ length: 5 }, (_, i) =>
      spawnOne(W(), H(), i * 28)
    );
    nextSpawnRef.current = 90; // first auto-spawn after ~1.5s

    const draw = () => {
      frameRef.current++;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Spawn new meteor on schedule
      if (frameRef.current >= nextSpawnRef.current && meteorsRef.current.length < 12) {
        meteorsRef.current.push(spawnOne(w, h));
        // next spawn in 50–110 frames (~0.8–1.8s at 60fps)
        nextSpawnRef.current = frameRef.current + 50 + Math.floor(Math.random() * 60);
      }

      meteorsRef.current = meteorsRef.current.filter(m => {
        // Countdown delay
        if (m.delayLeft > 0) { m.delayLeft--; return true; }

        // Move
        m.x += m.vx;
        m.y += m.vy;

        // Life: fraction of tail that's fully emerged (0→1 as it enters, stays 1 mid-flight)
        m.life = Math.min(1, m.life + 0.018);

        // Remove when off-screen
        if (m.x > w + 100 || m.y > h + 100) return false;

        // ── Draw tail (gradient line from tail-end → head) ──
        const tx = m.x - m.vx / m.speed * m.tailLen;
        const ty = m.y - m.vy / m.speed * m.tailLen;

        const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
        // Tail end: fully transparent
        grad.addColorStop(0, `rgba(245,166,35,0)`);
        // Mid-tail: amber glow fading in
        grad.addColorStop(0.55, `rgba(245,166,35,${0.18 * m.alpha * m.life})`);
        // Near head: bright amber
        grad.addColorStop(0.82, `rgba(255,200,80,${0.75 * m.alpha * m.life})`);
        // Just behind head: near-white hot
        grad.addColorStop(0.96, `rgba(255,240,180,${0.95 * m.alpha * m.life})`);
        // Head itself: pure white
        grad.addColorStop(1, `rgba(255,255,255,0)`); // blended by head glow

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(245,166,35,0.6)';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();

        // ── Draw head glow (bright nucleus) ──
        ctx.save();
        // Outer amber halo
        const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.headR * 5);
        halo.addColorStop(0, `rgba(255,255,255,${0.95 * m.alpha * m.life})`);
        halo.addColorStop(0.3, `rgba(255,220,100,${0.7 * m.alpha * m.life})`);
        halo.addColorStop(0.7, `rgba(245,166,35,${0.25 * m.alpha * m.life})`);
        halo.addColorStop(1, `rgba(245,166,35,0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headR * 5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Inner white core
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${m.alpha * m.life})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

/* ─── DATA ─── */
const skills = [
  {
    num: '01',
    title: 'Branding & Identity Design',
    desc: 'Crafting memorable logos and visual systems that reflect a brand\'s essence and personality.',
  },
  {
    num: '02',
    title: 'Creativity & Problem-Solving',
    desc: 'Thinking outside the box while solving design challenges with strategic insight.',
  },
  {
    num: '03',
    title: 'Concept Development',
    desc: 'Skilled in brainstorming and translating abstract ideas into compelling visual narratives.',
  },
  {
    num: '04',
    title: 'Proper Time Management',
    desc: 'Capable of handling multiple projects and meeting tight deadlines consistently.',
  },
];

const LS_ABOUT = 'hk_about_data';
const LS_EXPS  = 'hk_exp_data';
const LS_WA    = 'hk_wa_link';

const defaultAbout = {
  name: 'Mahfudfebry',
  location: 'Nganjuk, Indonesia',
  bio1: 'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',
  bio2: 'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',
};

const defaultExps = [
  { id: '1', role: 'HR / General Affairs', company: 'UD Duta Pangan', icon: '👥', tasks: 'Vendor Management, Stock Monitoring, Facility Maintenance, Workload Analysis' },
  { id: '2', role: 'Staff Administrasi',   company: 'UD Duta Pangan', icon: '📋', tasks: 'Document Processing, Administrative Support, Filing & Archiving, Reporting' },
  { id: '3', role: 'IT Support',           company: 'UD Duta Pangan', icon: '💻', tasks: 'Hardware Troubleshooting, Software Installation, Network Setup, User Training' },
];

const readLS = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; }
};

const roles = ['HR Professional', 'IT Support', 'Admin Staff', 'Creative Designer'];

/* ─── HOME PAGE ─── */
const Home: React.FC = () => {
  const [typed, setTyped] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  // Dynamic About / Experience / WA from localStorage (updated by AdminPanel)
  const [about, setAbout] = useState(() => readLS(LS_ABOUT, defaultAbout));
  const [experiences, setExperiences] = useState(() => readLS(LS_EXPS, defaultExps));
  const [waLink, setWaLink] = useState(() => localStorage.getItem(LS_WA) || 'https://wa.me/6281234567890');

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_ABOUT && e.newValue) setAbout(JSON.parse(e.newValue));
      if (e.key === LS_EXPS  && e.newValue) setExperiences(JSON.parse(e.newValue));
      if (e.key === LS_WA    && e.newValue) setWaLink(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const role = roles[roleIdx];
    let i = 0;
    let forward = true;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (forward) {
        i++;
        setTyped(role.substring(0, i));
        if (i >= role.length) {
          forward = false;
          timer = setTimeout(tick, 1500);
          return;
        }
      } else {
        i--;
        setTyped(role.substring(0, i));
        if (i <= 0) {
          setRoleIdx((prev) => (prev + 1) % roles.length);
          return;
        }
      }
      timer = setTimeout(tick, forward ? 80 : 40);
    };
    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [roleIdx]);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', position: 'relative' }}>

      {/* ─── METEOR BACKGROUND ─── */}
      <MeteorShower />

      {/* ─── HERO ─── */}
      <motion.section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(80px, 15vw, 120px) clamp(1rem, 5vw, 2rem) 4rem',
          y: heroY,
          zIndex: 1,
        }}
      >
        {/* Decorative squiggles — hidden on very small screens */}
        <motion.div
          className="squiggle-left"
          initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ position: 'absolute', left: '3%', top: '20%' }}
        >
          <Squiggle size={50} rotate={90} />
        </motion.div>
        <motion.div
          className="squiggle-right"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ position: 'absolute', right: '3%', bottom: '30%' }}
        >
          <Squiggle size={70} rotate={-20} />
        </motion.div>

        {/* Dot decorations */}
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          style={{ position: 'absolute', bottom: '8%', left: '3%', display: 'flex', gap: '8px' }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--amber)' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--white)' }} />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.3, type: 'spring', stiffness: 200 }}
          style={{ position: 'absolute', bottom: '8%', right: '3%', display: 'flex', gap: '8px' }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--amber)' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--white)' }} />
        </motion.div>

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--white-dim)',
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Creative Portfolio Presentation
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--white-dim)',
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            letterSpacing: '1px',
          }}>
            NGANJUK, Indonesia
          </span>
        </motion.div>

        {/* Big display name */}
        <div style={{ position: 'relative', textAlign: 'center', width: '100%' }}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 11vw, 10rem)',
              color: 'var(--white)',
              lineHeight: 0.9,
              letterSpacing: 'clamp(-1px, -0.5vw, -2px)',
              userSelect: 'none',
            }}
          >
            MAHFUDFEBRY'S
          </motion.h1>

          {/* HIKIMORI overlay in amber script */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translateX(-50%) rotate(-3deg)',
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.6rem, 6vw, 6rem)',
              color: 'var(--amber)',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              textShadow: '0 4px 30px rgba(245,166,35,0.4)',
              zIndex: 2,
            }}
          >
            Hikimori
          </motion.div>
        </div>

        {/* Role typewriter */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{ marginTop: 'clamp(2.5rem, 6vw, 3.5rem)', textAlign: 'center', padding: '0 1rem' }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--white-dim)',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
          }}>
            Saya seorang{' '}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--amber)',
            fontWeight: 700,
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            borderRight: '2px solid var(--amber)',
            paddingRight: '4px',
          }}>
            {typed}
          </span>
        </motion.div>

        {/* CTA badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(245,166,35,0.3)' }}
          style={{
            marginTop: '2rem',
            border: '2px solid var(--white)',
            borderRadius: '50px',
            padding: 'clamp(10px, 2vw, 14px) clamp(20px, 5vw, 40px)',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 'clamp(0.75rem, 2vw, 1rem)',
            letterSpacing: '0.5px',
            cursor: 'default',
            textAlign: 'center',
            maxWidth: '90vw',
          }}
        >
          A Curated Portfolio of Purpose-Driven and Visually Engaging Work
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ color: 'var(--white-dim)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '1px', height: '30px', background: 'var(--amber)' }}
          />
        </motion.div>
      </motion.section>

      {/* ─── ABOUT SECTION ─── */}
      <section
        className="about-grid"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem)',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AnimatedSection direction="left">
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--amber)',
                fontSize: '0.85rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                About Me
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              lineHeight: 1,
              marginBottom: '0.3rem',
            }}>
              ABOUT ME !
            </h2>
            <span style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--amber)',
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '1.5rem',
            }}>
              {about.name}
            </span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              {about.bio1}
            </p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              {about.bio2}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right">
          <div className="float-hover" style={{
            position: 'relative',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--black-3)',
            aspectRatio: '4/3',
          }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
              alt="Mahfudfebry"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(245,166,35,0.2) 0%, transparent 60%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              background: 'rgba(10,10,10,0.9)',
              borderRadius: '12px',
              padding: '0.8rem 1.2rem',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem' }}>
                📍 {about.location}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── SKILLS SECTION ─── */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem)',
        background: 'var(--black-2)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 4rem)', position: 'relative' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 7vw, 6rem)',
                lineHeight: 0.9,
                position: 'relative',
                display: 'inline-block',
              }}>
                SKILLS &{' '}
                <span style={{ position: 'relative' }}>
                  TOOLS
                  <span style={{
                    position: 'absolute',
                    top: '40%',
                    left: '10%',
                    fontFamily: 'var(--font-script)',
                    color: 'var(--amber)',
                    fontSize: '55%',
                    transform: 'rotate(-3deg)',
                    whiteSpace: 'nowrap',
                  }}>
                    Signature
                  </span>
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1rem, 3vw, 1.5rem)',
          }}>
            {skills.map((skill, i) => (
              <AnimatedSection key={skill.num} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div
                  className="float-hover"
                  style={{
                    background: 'var(--black-3)',
                    border: '1px solid rgba(245,166,35,0.12)',
                    borderRadius: 'var(--radius)',
                    padding: 'clamp(1.25rem, 3vw, 2rem)',
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '5rem',
                    color: 'rgba(245,166,35,0.06)',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}>
                    {skill.num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    color: 'var(--amber)',
                    marginBottom: '0.8rem',
                  }}>
                    {skill.num}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    color: 'var(--amber)',
                    fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '0.7rem',
                  }}>
                    {skill.title}
                  </h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', lineHeight: 1.7 }}>
                    {skill.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE SECTION ─── */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem)',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              lineHeight: 0.9,
            }}>
              HR / GENERAL{' '}
              <span style={{
                fontFamily: 'var(--font-script)',
                color: 'var(--amber)',
                fontSize: '60%',
              }}>
                Affairs
              </span>
            </h2>
            <p style={{ color: 'var(--white-dim)', marginTop: '1rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Pengalaman Profesional & Riwayat Kerja
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
          {experiences.map((exp: any, i: number) => (
            <AnimatedSection key={exp.role} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
              <div
                className="float-hover exp-card"
                style={{
                  background: 'var(--black-2)',
                  border: '1px solid rgba(245,166,35,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 4vw, 2.5rem)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                    marginBottom: '0.3rem',
                  }}>
                    {exp.role}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-script)',
                    color: 'var(--amber)',
                    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}>
                    {exp.company}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(Array.isArray(exp.tasks) ? exp.tasks : exp.tasks.split(',').map((t: string) => t.trim())).map((task: string) => (
                      <span key={task} style={{
                        background: 'rgba(245,166,35,0.1)',
                        border: '1px solid rgba(245,166,35,0.3)',
                        color: 'var(--amber)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                        fontWeight: 600,
                      }}>
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    width: 'clamp(44px, 8vw, 60px)',
                    height: 'clamp(44px, 8vw, 60px)',
                    borderRadius: '50%',
                    border: '2px solid rgba(245,166,35,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  }}>
                    {exp.icon}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── CTA CONTACT SECTION ─── */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem)',
        background: 'var(--black-2)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <AnimatedSection direction="scale">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 8vw, 6rem)',
              lineHeight: 0.9,
              marginBottom: '0.5rem',
            }}>
              HUBUNGI SAYA !
            </h2>
            <div style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--amber)',
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}>
              24/7 ready
            </div>
            <p style={{
              color: 'var(--white-dim)',
              lineHeight: 1.8,
              marginBottom: '2rem',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              padding: '0 0.5rem',
            }}>
              Siap berkolaborasi untuk project Anda. Hubungi saya kapan saja, saya selalu siap memberikan yang terbaik.
            </p>
            <motion.a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(245,166,35,0.4)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-block',
                background: 'var(--amber)',
                color: 'var(--black)',
                textDecoration: 'none',
                borderRadius: '50px',
                padding: 'clamp(12px, 2.5vw, 16px) clamp(28px, 6vw, 48px)',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                letterSpacing: '1px',
              }}
            >
              💬 Hubungi via WhatsApp →
            </motion.a>
          </div>
        </AnimatedSection>
      </section>

      <style>{`
        /* ── Mobile: stack about grid ── */
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          /* Hide decorative squiggles on narrow screens to avoid overflow */
          .squiggle-left,
          .squiggle-right {
            display: none;
          }
          /* Experience card: stack icon below content on tiny screens */
          .exp-card {
            grid-template-columns: 1fr !important;
          }
          .exp-card > div:last-child {
            text-align: left !important;
          }
        }

        /* ── Reduced motion: disable meteors via CSS layer ── */
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
