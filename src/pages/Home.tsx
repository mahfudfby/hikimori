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

/* ─── METEOR BACKGROUND ─── */
interface Meteor {
  id: number;
  x: number;       // vw start position
  delay: number;   // seconds before first appearance
  duration: number;
  size: number;    // tail length px
  opacity: number;
}

const MeteorShower: React.FC = () => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const nextId = useRef(0);

  const spawnMeteor = (): Meteor => ({
    id: nextId.current++,
    x: Math.random() * 110,          // 0–110vw
    delay: 0,
    duration: 0.6 + Math.random() * 0.6,
    size: 80 + Math.random() * 120,
    opacity: 0.5 + Math.random() * 0.5,
  });

  useEffect(() => {
    // Initial batch — staggered delays so page doesn't look empty
    const initial: Meteor[] = Array.from({ length: 6 }, (_, i) => ({
      ...spawnMeteor(),
      delay: i * 0.8,
    }));
    setMeteors(initial);

    // Ongoing: add a new meteor every 900–2000 ms
    const interval = setInterval(() => {
      const m = spawnMeteor();
      setMeteors(prev => [...prev.slice(-20), m]); // cap at 20
    }, 900 + Math.random() * 1100);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeMeteor = (id: number) =>
    setMeteors(prev => prev.filter(m => m.id !== id));

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {meteors.map(m => (
        <motion.div
          key={m.id}
          initial={{ x: `${m.x}vw`, y: '-5vh', opacity: m.opacity }}
          animate={{ x: `${m.x + 20}vw`, y: '105vh', opacity: 0 }}
          transition={{ duration: m.duration, delay: m.delay, ease: 'linear' }}
          onAnimationComplete={() => removeMeteor(m.id)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '2px',
            height: `${m.size}px`,
            background: `linear-gradient(180deg, rgba(245,166,35,0) 0%, rgba(245,166,35,0.9) 60%, #fff 100%)`,
            borderRadius: '2px',
            filter: 'blur(0.5px)',
            rotate: '15deg',
            transformOrigin: 'top center',
          }}
        />
      ))}
    </div>
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

const experiences = [
  {
    role: 'HR / General Affairs',
    company: 'UD Duta Pangan',
    icon: '👥',
    tasks: ['Vendor Management', 'Stock Monitoring', 'Facility Maintenance', 'Workload Analysis'],
  },
  {
    role: 'Staff Administrasi',
    company: 'UD Duta Pangan',
    icon: '📋',
    tasks: ['Document Processing', 'Administrative Support', 'Filing & Archiving', 'Reporting'],
  },
  {
    role: 'IT Support',
    company: 'UD Duta Pangan',
    icon: '💻',
    tasks: ['Hardware Troubleshooting', 'Software Installation', 'Network Setup', 'User Training'],
  },
];

const roles = ['HR Professional', 'IT Support', 'Admin Staff', 'Creative Designer'];

/* ─── HOME PAGE ─── */
const Home: React.FC = () => {
  const [typed, setTyped] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

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
              Mahfudfebry
            </span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1rem', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Halo! Nama saya <strong style={{ color: 'var(--white)' }}>Mahfudfebry</strong>, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.
            </p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.
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
                📍 Nganjuk, Indonesia
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
          {experiences.map((exp, i) => (
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
                    {exp.tasks.map((task) => (
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
              href="mailto:mahfudfebry@hikimori.web.id"
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
              Kirim Pesan →
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
