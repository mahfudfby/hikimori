// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
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

  const heroPhoto  = hero.heroPhotoUrl  || FALLBACK_PHOTO;
  const aboutPhoto = about.photoUrl     || FALLBACK_PHOTO;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>

      {/* ══ HERO SECTION ══ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '0 2rem', maxWidth: '1200px', margin: '0 auto',
        paddingTop: '70px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }} className="home-hero-grid">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
              Creative Portfolio
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.88, marginBottom: '0.2rem' }}>
              {hero.heroTitle}
            </h1>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.88, color: 'var(--amber)', marginBottom: '1.5rem' }}>
              {hero.heroSubtitle}
            </h2>
            <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '480px' }}>
              {hero.heroTagline}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(245,166,35,0.4)' }} whileTap={{ scale: 0.97 }}>
                <Link to={hero.heroCtaLink}
                  style={{ display: 'inline-block', background: 'var(--amber)', color: 'var(--black)', textDecoration: 'none', borderRadius: '50px', padding: '14px 36px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                  {hero.heroCta} →
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/about"
                  style={{ display: 'inline-block', background: 'transparent', color: 'var(--white)', textDecoration: 'none', borderRadius: '50px', padding: '14px 36px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Tentang Saya
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="float-hover"
            style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '3/4', maxHeight: '560px' }}>
            <img src={heroPhoto} alt={hero.heroTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)' }} />
          </motion.div>
        </div>
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
