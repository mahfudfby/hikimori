// src/pages/About.tsx
// Data disinkronkan dari Home.tsx via localStorage keys yang sama.
// Layout halaman ini berbeda dari Home, namun semua konten berasal dari data yang sama.
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import LazyMount from '../components/LazyMount';
import { useLang } from '../contexts/LanguageContext';
import {
  EDUCATION, TOOLS, CV_SKILL_TAGS, TRAINING_LICENSE,
  HOBBIES, ORG_EXPERIENCE, REFERENCES,
} from '../data/cvData';
import {
  D_ABOUT, D_ABOUT_EN, D_SKILLS, D_SKILLS_EN, D_EXP, D_EXP_EN,
} from './Home';
import type { AboutData, SkillItem, ExpItem } from './Home';

/* ─── localStorage keys — identik dengan Home.tsx ─── */
const LS_ABOUT  = 'hk_home_about_data';
const LS_GALLERY = 'hk_about_gallery_data';
const LS_SKILLS = 'hk_skills_data';
const LS_EXP    = 'hk_experience_data';
const LS_CERT   = 'hk_cert_data';
const LS_VER    = 'hk_data_version';
const DATA_VERSION = 'v7'; // Harus sama dengan Home.tsx

interface GalleryItem { id: string; url: string; caption?: string; size?: 'small'|'medium'|'large'|'wide'|'tall'; }
interface CertItem  { id: string; name: string; year: string; issuer: string; subtitle: string; imageUrl: string; }

/* Sertifikasi ditampilkan di About.tsx memakai data Training & License asli dari CV */
const D_CERT: CertItem[] = TRAINING_LICENSE.map(t => ({ id: t.id, name: t.name.id, year: t.year, issuer: t.issuer, subtitle: t.subtitle?.id || '', imageUrl: '' }));
const D_CERT_EN: CertItem[] = TRAINING_LICENSE.map(t => ({ id: t.id, name: t.name.en, year: t.year, issuer: t.issuer, subtitle: t.subtitle?.en || '', imageUrl: '' }));

/* ─── Logo Perusahaan: upload manual (logoUrl) atau otomatis cari via Clearbit
   untuk perusahaan/PT besar yang dikenal. Jika tidak ditemukan, fallback ke emoji icon. ─── */
const KNOWN_LOGO_DOMAINS: Record<string, string> = {
  'grab': 'grab.com',
  'richeese': 'richeese.co.id',
  'mie gacoan': 'miegacoan.co.id',
};
const guessLogoDomain = (company: string): string | null => {
  const c = company.toLowerCase();
  for (const key in KNOWN_LOGO_DOMAINS) if (c.includes(key)) return KNOWN_LOGO_DOMAINS[key];
  return null;
};
const resolveLogo = (exp: { company: string; logoUrl?: string }): string | null => {
  if (exp.logoUrl) return exp.logoUrl;
  const domain = guessLogoDomain(exp.company);
  return domain ? `https://logo.clearbit.com/${domain}` : null;
};

const FALLBACK_PHOTO = 'https://res.cloudinary.com/dl4pyan8v/image/upload/f_auto,q_auto/v1783866519/Mahfudfebry_casual_oj8r1d.png';
const D_GALLERY: GalleryItem[] = [];
/* Mapping ukuran → span kolom/baris CSS Grid untuk layout majalah */
const GALLERY_SPAN: Record<string, { col: number; row: number }> = {
  small:  { col: 1, row: 1 },
  medium: { col: 2, row: 1 },
  large:  { col: 2, row: 2 },
  wide:   { col: 4, row: 1 },
  tall:   { col: 1, row: 2 },
};

const ls = <T,>(key: string, fb: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fb; } catch { return fb; }
};
const lsRaw = <T,>(key: string): T | null => {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
};

/* ─── Hook: auto-reset version & load from localStorage ─── */
const useHomeData = () => {
  const { lang } = useLang();
  // Auto-reset jika versi berubah (sama logikanya dengan Home.tsx)
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_VER) !== DATA_VERSION) {
        [LS_ABOUT, LS_SKILLS, LS_EXP, LS_CERT].forEach(k => localStorage.removeItem(k));
        localStorage.setItem(LS_VER, DATA_VERSION);
      }
    } catch {}
  }, []);

  const [aboutCustom,  setAbout]  = useState<AboutData | null> (() => lsRaw<AboutData>(LS_ABOUT));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => ls(LS_GALLERY, D_GALLERY));
  const [skillsCustom, setSkills] = useState<SkillItem[] | null>(() => lsRaw<SkillItem[]>(LS_SKILLS));
  const [expsCustom,   setExps]   = useState<ExpItem[] | null>  (() => lsRaw<ExpItem[]>(LS_EXP));
  const [certsCustom,  setCerts]  = useState<CertItem[] | null> (() => lsRaw<CertItem[]>(LS_CERT));

  /* Data admin selalu diprioritaskan; jika belum ada override, pakai default sesuai bahasa aktif */
  const about  = aboutCustom  ?? (lang === 'en' ? D_ABOUT_EN  : D_ABOUT);
  const skills = skillsCustom ?? (lang === 'en' ? D_SKILLS_EN : D_SKILLS);
  const exps   = expsCustom   ?? (lang === 'en' ? D_EXP_EN    : D_EXP);
  const certs  = certsCustom  ?? (lang === 'en' ? D_CERT_EN   : D_CERT);

  useEffect(() => {
    /* Dengarkan perubahan dari tab lain (storage event) */
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_ABOUT  && e.newValue) try { setAbout(JSON.parse(e.newValue));  } catch {}
      if (e.key === LS_GALLERY && e.newValue) try { setGallery(JSON.parse(e.newValue)); } catch {}
      if (e.key === LS_SKILLS && e.newValue) try { setSkills(JSON.parse(e.newValue)); } catch {}
      if (e.key === LS_EXP    && e.newValue) try { setExps(JSON.parse(e.newValue));   } catch {}
      if (e.key === LS_CERT   && e.newValue) try { setCerts(JSON.parse(e.newValue));  } catch {}
    };
    /* Dengarkan perubahan dari AdminPanel di tab yang sama (custom event) */
    const onCustom = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      try {
        if (key === LS_ABOUT)  setAbout(JSON.parse(value));
        if (key === LS_GALLERY) setGallery(JSON.parse(value));
        if (key === LS_SKILLS) setSkills(JSON.parse(value));
        if (key === LS_EXP)    setExps(JSON.parse(value));
        if (key === LS_CERT)   setCerts(JSON.parse(value));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('hk-update', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('hk-update', onCustom);
    };
  }, []);

  return { about, gallery, skills, exps, certs };
};

/* ─── ExpCardAbout: tiap card punya state sendiri (valid hooks) ─── */
const ExpCardAbout: React.FC<{ exp: ExpItem; index: number }> = ({ exp, index: i }) => {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = resolveLogo(exp);
  const { t, lang } = useLang();
  return (
    <AnimatedSection direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.12}>
      <div className="float-hover" style={{
        background: 'var(--black-3)',
        border: '1px solid rgba(245,166,35,0.15)',
        borderLeft: '3px solid var(--amber)',
        borderRadius: 'var(--radius)',
        padding: '1.8rem 2rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
          {logo && !logoFailed ? (
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              <img src={logo} alt={exp.company} loading="lazy" decoding="async" onError={() => setLogoFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 5 }} />
            </div>
          ) : (
            <span style={{ fontSize: '1.8rem', flexShrink: 0 }} aria-hidden="true">{exp.icon}</span>
          )}
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '1rem', lineHeight: 1.3, minWidth: 0 }}>
            {exp.position}
          </h3>
        </div>
        {exp.company && (
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--amber)', fontSize: '0.92rem', lineHeight: 1.4, marginBottom: '0.45rem' }}>
            {exp.company}
          </div>
        )}
        {exp.period && (() => {
          const [dateRange, duration, type] = exp.period.split('·').map(p => p.trim());
          return (
            <div style={{
              display: 'inline-flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start',
              background: 'rgba(245,166,35,0.12)', color: 'var(--amber)',
              borderRadius: '6px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700,
              border: '1px solid rgba(245,166,35,0.25)', marginBottom: '0.8rem',
            }}>
              <span><span aria-hidden="true">🕐</span> {dateRange}</span>
              <span>[ {duration} ]{type ? ` · ${type}` : ''}</span>
            </div>
          );
        })()}
        {exp.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.8rem' }}>
            {exp.tags.split(',').map(tg => tg.trim()).filter(Boolean).map(tag => (
              <span key={tag} style={{
                background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.18)',
                color: 'rgba(245,166,35,0.85)', borderRadius: '4px', padding: '2px 9px', fontSize: '0.72rem',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {exp.desc && (
          <>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)',
                color: 'var(--amber)', borderRadius: '6px', padding: '5px 14px', fontSize: '0.75rem',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              {open ? t('▲ Tutup Rincian', '▲ Close Details') : t('▼ Lihat Rincian', '▼ View Details')}
            </button>
            <motion.div
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.32, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '0.8rem', padding: '1rem', background: 'rgba(245,166,35,0.04)', borderRadius: '8px', borderLeft: '2px solid rgba(245,166,35,0.3)' }} lang={lang}>
                <div className="bullet-list">
                  {exp.desc.split('\n').map((line, li) => {
                    const isBullet = line.trim().startsWith('•');
                    const text = isBullet ? line.trim().slice(1).trim() : line;
                    return isBullet ? (
                      <div key={li} className="bullet-line">
                        <span className="bullet-dot" style={{ color: 'var(--amber)' }}>•</span>
                        <span className="bullet-text text-justify-auto" style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.8 }}>{text}</span>
                      </div>
                    ) : (
                      <div key={li} className="text-justify-auto para-indent" style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.8 }}>{line}</div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AnimatedSection>
  );
};

/* ══════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════ */
const About: React.FC = () => {
  const { about, gallery, skills, exps, certs } = useHomeData();
  const { t, lang } = useLang();
  const photo = about.photoUrl || FALLBACK_PHOTO;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '70px' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '5rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="about-hero-grid">
        <div>
          <AnimatedSection direction="left">
            <motion.span style={{ fontFamily: 'var(--font-body)', color: 'var(--amber)', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              {t('Tentang Saya', 'About Me')}
            </motion.span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 0.9, marginBottom: '0.3rem' }}>
              ABOUT ME !
            </h1>
            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '2.5rem', fontWeight: 700, display: 'block', marginBottom: '2rem' }}>
              {about.name}
            </span>
            <p lang={lang} className="text-justify-auto para-indent" style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: '1rem' }}>
              {about.bio1}
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { label: t('Tahun Pengalaman', 'Years of Experience'), value: '3+' },
                { label: t('Proyek Selesai', 'Projects Completed'), value: '20+' },
                { label: t('Kepuasan Klien', 'Client Satisfaction'), value: '100%' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--amber)', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'var(--white-dim)', fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <a
              href="/CV-Mahfud-Febry-Styanto.pdf"
              download="CV-Mahfud-Febry-Styanto.pdf"
              className="text-shadow-onlight"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginTop: '2rem',
                background: 'var(--amber)', color: 'var(--black)', fontWeight: 700, fontSize: '0.9rem',
                padding: '0.8rem 1.6rem', borderRadius: '999px', textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(245,166,35,0.25)',
              }}
            >
              ⬇ {t('Unduh CV (PDF)', 'Download CV (PDF)')}
            </a>
          </AnimatedSection>
        </div>

        <AnimatedSection direction="right">
          <div className="float-hover" style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '3/4', maxHeight: '500px' }}>
            <img src={photo} alt={about.name} decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <div className="text-shadow-onlight" style={{ background: 'rgba(245,166,35,0.9)', borderRadius: '12px', padding: '0.8rem 1.2rem', color: 'var(--black)', fontWeight: 700, fontSize: '0.9rem' }}>
                📍 {about.location}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Galeri Foto — Layout Majalah ── */}
      {gallery.length > 0 && (
      <LazyMount minHeight={500}>
        <section style={{ padding: '1rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                {t('GALERI', 'GALLERY')}{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>{t('Momen', 'Moments')}</span>
              </h2>
            </div>
          </AnimatedSection>
          <div className="magazine-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px', gap: '1rem' }}>
            {gallery.map((g, i) => {
              const span = GALLERY_SPAN[g.size || 'small'];
              return (
                <div
                  key={g.id}
                  className={`magazine-item mag-${g.size || 'small'}`}
                  style={{ gridColumn: `span ${span.col}`, gridRow: `span ${span.row}`, height: '100%' }}
                >
                  <AnimatedSection direction="up" delay={i * 0.06}>
                    <div className="float-hover" style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', height: '100%' }}>
                      <img src={g.url} alt={g.caption || about.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {g.caption && (
                        <>
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)' }} />
                          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', color: 'var(--white)', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4 }}>
                            {g.caption}
                          </div>
                        </>
                      )}
                    </div>
                  </AnimatedSection>
                </div>
              );
            })}
          </div>
        </section>
      </LazyMount>
      )}
      {/* ── Info Tambahan (Education, Tools, Hobby, Organizational Experience, References) — Layout Majalah ── */}
      <LazyMount minHeight={700}>
      <section style={{ padding: '1rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              {t('INFO', 'ADDITIONAL')}{' '}
              <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>{t('Tambahan', 'Info')}</span>
            </h2>
          </div>
        </AnimatedSection>
        <div
          className="magazine-grid info-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'minmax(150px, auto)', gap: '1rem' }}
        >
          {/* Education */}
          <AnimatedSection direction="left" delay={0}>
            <div className="float-hover magazine-item" style={{ gridColumn: 'span 2', gridRow: 'span 1', height: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.18)', borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🎓</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t('Pendidikan', 'Education')}</h3>
              <p style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.15rem' }}>{t(EDUCATION.degree.id, EDUCATION.degree.en)}</p>
              <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>{EDUCATION.school}<br />{EDUCATION.gpa} · {t(EDUCATION.note.id, EDUCATION.note.en)}</p>
            </div>
          </AnimatedSection>

          {/* Tools & Apps */}
          <AnimatedSection direction="right" delay={0.08}>
            <div className="float-hover magazine-item" style={{ gridColumn: 'span 2', gridRow: 'span 2', height: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.18)', borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1.6rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🛠️</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.7rem' }}>{t('Tools & Aplikasi', 'Tools and Apps')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {TOOLS.map(tool => (
                  <span key={tool} className="info-chip" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', color: 'rgba(245,166,35,0.9)', borderRadius: '5px', padding: '4px 10px', fontSize: '0.75rem' }}>{tool}</span>
                ))}
              </div>
              <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', margin: '1.1rem 0 0.6rem' }}>{t('Keahlian Inti (CV)', 'Skills & Expertise (CV)')}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {CV_SKILL_TAGS.map(tag => (
                  <span key={tag.id} className="info-chip" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--white-dim)', borderRadius: '5px', padding: '4px 10px', fontSize: '0.75rem' }}>{t(tag.id, tag.en)}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Hobby */}
          <AnimatedSection direction="left" delay={0.16}>
            <div className="float-hover magazine-item" style={{ gridColumn: 'span 2', gridRow: 'span 1', height: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.18)', borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1.6rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🎯</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{t('Hobi', 'Hobby')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {HOBBIES.map(h => (
                  <span key={h.id} className="info-chip" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', color: 'rgba(245,166,35,0.9)', borderRadius: '5px', padding: '4px 10px', fontSize: '0.78rem' }}>{t(h.id, h.en)}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Organizational Experience */}
          <AnimatedSection direction="up" delay={0.24}>
            <div className="float-hover magazine-item" style={{ gridColumn: 'span 2', gridRow: 'span 2', height: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.18)', borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1.6rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🏯</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t('Pengalaman Organisasi', 'Organizational Experience')}</h3>
              <p style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.1rem' }}>{ORG_EXPERIENCE.role}</p>
              <p style={{ color: 'var(--white-dim)', fontSize: '0.82rem', marginBottom: '0.2rem' }}>{t(ORG_EXPERIENCE.org.id, ORG_EXPERIENCE.org.en)}</p>
              <p style={{ color: 'var(--amber)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.7rem' }}>{t(ORG_EXPERIENCE.position.id, ORG_EXPERIENCE.position.en)}</p>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--white-dim)', fontSize: '0.82rem', lineHeight: 1.7 }}>
                {ORG_EXPERIENCE.points.map(p => <li key={p.id}>{t(p.id, p.en)}</li>)}
              </ul>
            </div>
          </AnimatedSection>

          {/* References */}
          <AnimatedSection direction="right" delay={0.32}>
            <div className="float-hover magazine-item" style={{ gridColumn: 'span 2', gridRow: 'span 1', height: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.18)', borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '1.6rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>📇</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{t('Referensi', 'References')}</h3>
              {REFERENCES.map(r => (
                <div key={r.id} style={{ marginBottom: '0.4rem' }}>
                  <p style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.1rem' }}>{r.name}</p>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.82rem', marginBottom: '0.1rem' }}>{t(r.role.id, r.role.en)} · {r.company}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{t(r.note.id, r.note.en)}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
        <style>{`
          @media (max-width: 860px) {
            .info-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .info-grid .magazine-item { grid-column: span 2 !important; }
          }
        `}</style>
      </section>
      </LazyMount>

      <LazyMount minHeight={600}>
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                {t('KEAHLIAN', 'SKILLS')}{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>{t('skills', 'keahlian')}</span>
              </h2>
            </div>
          </AnimatedSection>
          <div className="skills-columns-about" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* ── Hard Skill ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.3rem' }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(245,166,35,0.4))' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', color: 'var(--amber)', letterSpacing: '1px', whiteSpace: 'nowrap' }}>HARD <span style={{ color: 'var(--white)' }}>SKILL</span></h3>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(245,166,35,0.4))' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {skills.filter(sk => sk.category !== 'soft').map((skill, i) => (
                  <AnimatedSection key={skill.id} direction="left" delay={i * 0.1}>
                    <div className="float-hover" style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: 'var(--radius)', padding: '1.6rem' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(245,166,35,0.2)', lineHeight: 1, marginBottom: '0.4rem' }}>{skill.number}</div>
                      <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{skill.title}</h4>
                      <p lang={lang} className="text-justify-auto" style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.65 }}>{skill.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
            {/* ── Soft Skill ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.3rem' }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', color: 'var(--white)', letterSpacing: '1px', whiteSpace: 'nowrap' }}>SOFT <span style={{ color: 'var(--amber)' }}>SKILL</span></h3>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {skills.filter(sk => sk.category === 'soft').map((skill, i) => (
                  <AnimatedSection key={skill.id} direction="right" delay={i * 0.1}>
                    <div className="float-hover" style={{ background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '1.6rem' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1, marginBottom: '0.4rem' }}>{skill.number}</div>
                      <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{skill.title}</h4>
                      <p lang={lang} className="text-justify-auto" style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.65 }}>{skill.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
          <style>{`
            @media (max-width: 860px) {
              .skills-columns-about { grid-template-columns: 1fr !important; gap: 3rem !important; }
            }
          `}</style>
        </div>
      </section>
      </LazyMount>

      {/* ── Sertifikasi ── */}
      <LazyMount minHeight={500}>
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              {t('SERTIFIKASI', 'TRAINING &')}{' '}
              <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>{t('& Lisensi', 'License')}</span>
            </h2>
          </div>
        </AnimatedSection>
        {certs.length === 0 ? (
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,166,35,0.4)', border: '1px dashed rgba(245,166,35,0.2)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>📜</div>
              <p>{t('Belum ada sertifikasi.', 'No certifications yet.')}</p>
            </div>
          </AnimatedSection>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {certs.map((cert, i) => (
              <AnimatedSection key={cert.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
                <div className="float-hover" style={{
                  background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.2)',
                  borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '2.5rem',
                }}>
                  {cert.imageUrl && (
                    <img src={cert.imageUrl} alt={cert.name} loading="lazy" decoding="async" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                  )}
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {cert.name}
                  </h3>
                  <p style={{ color: 'var(--white)', fontWeight: 600, marginBottom: '0.2rem' }}>{cert.issuer}</p>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{cert.subtitle}</p>
                  <span style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--amber)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {cert.year}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>
      </LazyMount>

      {/* ── Pengalaman Kerja ── */}
      <LazyMount minHeight={500}>
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                {t('PENGALAMAN', 'WORK')}{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>{t('Kerja', 'Experience')}</span>
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {exps.map((exp, i) => (
              <ExpCardAbout key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </section>
      </LazyMount>

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .magazine-grid { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 160px !important; }
          .magazine-item { grid-column: span 1 !important; grid-row: span 1 !important; }
          .magazine-item.mag-wide, .magazine-item.mag-large { grid-column: span 2 !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
