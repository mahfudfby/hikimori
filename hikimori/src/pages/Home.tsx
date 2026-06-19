// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

// ─── Sub-components for hero ───────────────────────────────────────────────

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 1000,
  className = '',
  style = {},
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface AnimatedHeadingProps {
  text: string;
  initialDelay?: number;
  charDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  initialDelay = 200,
  charDelay = 30,
  className = '',
  style = {},
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split('\n');

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const prevLineChars = lines
          .slice(0, lineIndex)
          .reduce((acc, l) => acc + l.length, 0);

        return (
          <span key={lineIndex} style={{ display: 'block' }}>
            {line.split('').map((char, charIndex) => {
              const globalIndex = prevLineChars + charIndex;
              const delay = (initialDelay + globalIndex * charDelay) / 1000;
              return (
                <span
                  key={charIndex}
                  style={{
                    display: 'inline-block',
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateX(0)' : 'translateX(-18px)',
                    transition: `opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s`,
                  }}
                >
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

// ─── Data ──────────────────────────────────────────────────────────────────

const skills = [
  {
    num: '01',
    title: 'Branding & Identity Design',
    desc: "Crafting memorable logos and visual systems that reflect a brand's essence and personality.",
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
    tasks: ['Vendor Management', 'Stock Monitoring', 'Facility Maintenance', 'Workload Analysis'],
  },
  {
    role: 'Staff Administrasi',
    company: 'UD Duta Pangan',
    tasks: ['Document Processing', 'Administrative Support', 'Filing & Archiving', 'Reporting'],
  },
  {
    role: 'IT Support',
    company: 'UD Duta Pangan',
    tasks: ['Hardware Troubleshooting', 'Software Installation', 'Network Setup', 'User Training'],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: '#000',
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
            type="video/mp4"
          />
        </video>

        {/* Content layer (above video, no overlay) */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            paddingLeft: 'clamp(1.5rem, 4vw, 4rem)',
            paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
            paddingTop: '1.5rem',
          }}
        >
          {/* ── Navbar ── */}
          <nav>
            <div
              className="liquid-glass"
              style={{
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Logo */}
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  color: '#fff',
                }}
              >
                VEX
              </span>

              {/* Center links */}
              <div
                style={{
                  display: 'none',
                  gap: '2rem',
                  fontSize: '0.875rem',
                  color: '#fff',
                }}
                className="hero-nav-links"
              >
                {['Story', 'Investing', 'Building', 'Advisory'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      color: '#fff',
                      textDecoration: 'none',
                      transition: 'color 150ms',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#d1d5db')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#fff')}
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* CTA Button */}
              <button
                style={{
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f3f4f6')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#fff')}
              >
                Start a Chat
              </button>
            </div>
          </nav>

          {/* ── Hero Content (pushed to bottom) ── */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              paddingBottom: 'clamp(3rem, 4vw, 4rem)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                alignItems: 'flex-end',
                gap: '2rem',
              }}
              className="hero-grid"
            >
              {/* Left: main content */}
              <div>
                {/* Animated heading */}
                <AnimatedHeading
                  text={"Shaping tomorrow\nwith vision and action."}
                  initialDelay={200}
                  charDelay={30}
                  style={{
                    fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                    fontWeight: 400,
                    marginBottom: '1rem',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.1,
                    color: '#fff',
                  }}
                />

                {/* Subheading */}
                <FadeIn delay={800} duration={1000}>
                  <p
                    style={{
                      fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                      color: '#d1d5db',
                      marginBottom: '1.25rem',
                      fontWeight: 400,
                    }}
                  >
                    We back visionaries and craft ventures that define what comes next.
                  </p>
                </FadeIn>

                {/* Buttons */}
                <FadeIn delay={1200} duration={1000}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <button
                      style={{
                        background: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 32px',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Start a Chat
                    </button>
                    <button
                      className="liquid-glass explore-btn"
                      style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '12px 32px',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        transition: 'background 200ms, color 200ms',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.target as HTMLElement;
                        el.style.background = '#fff';
                        el.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.target as HTMLElement;
                        el.style.background = '';
                        el.style.color = '#fff';
                      }}
                    >
                      Explore Now
                    </button>
                  </div>
                </FadeIn>
              </div>

              {/* Right: tag */}
              <div
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}
                className="hero-tag-col"
              >
                <FadeIn delay={1400} duration={1000}>
                  <div
                    className="liquid-glass"
                    style={{
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      display: 'inline-block',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                        fontWeight: 300,
                        color: '#fff',
                      }}
                    >
                      Investing. Building. Advisory.
                    </span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive styles for hero */}
      <style>{`
        @media (min-width: 768px) {
          .hero-nav-links {
            display: flex !important;
          }
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-tag-col {
            justify-content: flex-end !important;
          }
        }
        .explore-btn:hover {
          background: #fff !important;
          color: #000 !important;
        }
      `}</style>

      {/* ─── ABOUT SECTION ─── */}
      <section style={{
        padding: '6rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}
      className="about-grid"
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
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1,
              marginBottom: '0.3rem',
            }}>
              ABOUT ME !
            </h2>
            <span style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--amber)',
              fontSize: '2.2rem',
              fontWeight: 700,
              display: 'block',
              marginBottom: '1.5rem',
            }}>
              Mahfudfebry
            </span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Halo! Nama saya <strong style={{ color: 'var(--white)' }}>Mahfudfebry</strong>, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.
            </p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8 }}>
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
        padding: '6rem 2rem',
        background: 'var(--black-2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {skills.map((skill, i) => (
              <AnimatedSection key={skill.num} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div
                  className="float-hover"
                  style={{
                    background: 'var(--black-3)',
                    border: '1px solid rgba(245,166,35,0.12)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
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
                    fontSize: '2.5rem',
                    color: 'var(--amber)',
                    marginBottom: '0.8rem',
                  }}>
                    {skill.num}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    color: 'var(--amber)',
                    fontSize: '0.95rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '0.7rem',
                  }}>
                    {skill.title}
                  </h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {skill.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE SECTION ─── */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
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
            <p style={{ color: 'var(--white-dim)', marginTop: '1rem', fontSize: '1rem' }}>
              Pengalaman Profesional & Riwayat Kerja
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experiences.map((exp, i) => (
            <AnimatedSection key={exp.role} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
              <div
                className="float-hover exp-card"
                style={{
                  background: 'var(--black-2)',
                  border: '1px solid rgba(245,166,35,0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '2rem 2.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.8rem',
                    marginBottom: '0.3rem',
                  }}>
                    {exp.role}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-script)',
                    color: 'var(--amber)',
                    fontSize: '1.2rem',
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
                        padding: '4px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}>
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid rgba(245,166,35,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>
                    {i === 0 ? '👥' : i === 1 ? '📋' : '💻'}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─── CTA CONTACT SECTION ─── */}
      <section style={{
        padding: '6rem 2rem',
        background: 'var(--black-2)',
        textAlign: 'center',
      }}>
        <AnimatedSection direction="scale">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 0.9,
              marginBottom: '0.5rem',
            }}>
              HUBUNGI SAYA !
            </h2>
            <div style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--amber)',
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '2rem',
            }}>
              24/7 ready
            </div>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
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
                padding: '16px 48px',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '1px',
              }}
            >
              Kirim Pesan →
            </motion.a>
          </div>
        </AnimatedSection>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
