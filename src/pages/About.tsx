// src/pages/About.tsx
// Data disinkronkan dari Home.tsx via localStorage keys yang sama.
// Layout halaman ini berbeda dari Home, namun semua konten berasal dari data yang sama.
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

/* ─── localStorage keys — identik dengan Home.tsx ─── */
const LS_ABOUT  = 'hk_home_about_data';
const LS_SKILLS = 'hk_skills_data';
const LS_EXP    = 'hk_experience_data';
const LS_CERT   = 'hk_cert_data';
const LS_VER    = 'hk_data_version';
const DATA_VERSION = 'v7'; // Harus sama dengan Home.tsx

interface AboutData {
  name: string; location: string; bio1: string; bio2: string; photoUrl: string;
  instagram?: string; linkedin?: string; whatsapp?: string; threads?: string; tiktok?: string; email?: string;
}
interface SkillItem { id: string; number: string; title: string; desc: string; }
interface ExpItem   { id: string; position: string; company: string; period: string; icon: string; tags: string; desc?: string; }
interface CertItem  { id: string; name: string; year: string; issuer: string; subtitle: string; imageUrl: string; }

/* Default data — sama persis dengan D_ABOUT, D_SKILLS, D_EXP, D_CERT di Home.tsx */
const D_ABOUT: AboutData = {
  name: 'Mahfudfebry', location: 'Nganjuk, Indonesia',
  bio1: 'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',
  bio2: 'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',
  photoUrl: '', instagram: 'mahfudfebry', linkedin: 'mahfud-febry-styanto',
  whatsapp: '6282234651413', threads: 'mahfudfebry', tiktok: 'mahfudfebry', email: 'Mahfudfebrys@gmail.com',
};
const D_SKILLS: SkillItem[] = [
  { id: '1', number: '01', title: 'Branding & Identity Design', desc: "Crafting memorable logos and visual systems that reflect a brand's essence." },
  { id: '2', number: '02', title: 'Creativity & Problem-Solving', desc: 'Thinking outside the box while solving design challenges with strategic insight.' },
  { id: '3', number: '03', title: 'Concept Development', desc: 'Skilled in brainstorming and translating abstract ideas into visual narratives.' },
  { id: '4', number: '04', title: 'Proper Time Management', desc: 'Capable of handling multiple projects and meeting tight deadlines.' },
];
const D_EXP: ExpItem[] = [
  { id: '1', position: 'Administrasi Produksi', company: 'UD Duta Pangan', period: 'Juli 2024 – Desember 2024', icon: '🏭', tags: 'Administrasi Produksi Pabrik,Monitoring Bahan Baku,Monitoring Hasil Produksi,Penyusunan Laporan Produksi,Pengendalian Dokumen,Manajemen FiFO' },
  { id: '2', position: 'IT Support', company: 'UD Duta Pangan', period: 'Januari 2025 – Agustus 2025', icon: '💻', tags: 'Troubleshooting Hardware & Software,Konfigurasi LAN/WiFi,Pemeliharaan Jaringan,Dukungan Pengguna (User Support),Penanganan Insiden TI,Inventarisasi Perangkat TI' },
  { id: '3', position: 'Staff HRD & General Affairs', company: 'UD Duta Pangan', period: 'Agustus 2025 – April 2026', icon: '👥', tags: 'Pengelolaan Fasilitas & Aset,Koordinasi Lintas Divisi,Payroll & Penghitungan Gaji,Jaminan Sosial BPJS & BPJS-Tk,Penyusunan Jobdesk,Analisa Beban Kerja,Laporan Harian Mingguan Bulanan' },
];
const D_CERT: CertItem[] = [
  { id: '1', name: 'Google Digital Marketing', year: '2023', issuer: 'Google', subtitle: 'Fundamentals of Digital Marketing', imageUrl: '' },
  { id: '2', name: 'HR Management Professional', year: '2022', issuer: 'BNSP Indonesia', subtitle: 'Sertifikasi Kompetensi SDM', imageUrl: '' },
];

const FALLBACK_PHOTO = 'https://res.cloudinary.com/dl4pyan8v/image/upload/WhatsApp_Image_2026-06-16_at_03.45.15_axvhg3';

const ls = <T,>(key: string, fb: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fb; } catch { return fb; }
};

/* ─── Hook: auto-reset version & load from localStorage ─── */
const useHomeData = () => {
  // Auto-reset jika versi berubah (sama logikanya dengan Home.tsx)
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_VER) !== DATA_VERSION) {
        [LS_ABOUT, LS_SKILLS, LS_EXP, LS_CERT].forEach(k => localStorage.removeItem(k));
        localStorage.setItem(LS_VER, DATA_VERSION);
      }
    } catch {}
  }, []);

  const [about,  setAbout]  = useState<AboutData> (() => ls(LS_ABOUT,  D_ABOUT));
  const [skills, setSkills] = useState<SkillItem[]>(() => ls(LS_SKILLS, D_SKILLS));
  const [exps,   setExps]   = useState<ExpItem[]>  (() => ls(LS_EXP,   D_EXP));
  const [certs,  setCerts]  = useState<CertItem[]> (() => ls(LS_CERT,  D_CERT));

  useEffect(() => {
    /* Dengarkan perubahan dari tab lain (storage event) */
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_ABOUT  && e.newValue) try { setAbout(JSON.parse(e.newValue));  } catch {}
      if (e.key === LS_SKILLS && e.newValue) try { setSkills(JSON.parse(e.newValue)); } catch {}
      if (e.key === LS_EXP    && e.newValue) try { setExps(JSON.parse(e.newValue));   } catch {}
      if (e.key === LS_CERT   && e.newValue) try { setCerts(JSON.parse(e.newValue));  } catch {}
    };
    /* Dengarkan perubahan dari AdminPanel di tab yang sama (custom event) */
    const onCustom = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      try {
        if (key === LS_ABOUT)  setAbout(JSON.parse(value));
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

  return { about, skills, exps, certs };
};

/* ─── ExpCardAbout: tiap card punya state sendiri (valid hooks) ─── */
const ExpCardAbout: React.FC<{ exp: ExpItem; index: number }> = ({ exp, index: i }) => {
  const [open, setOpen] = useState(false);
  return (
    <AnimatedSection direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.12}>
      <div className="float-hover" style={{
        background: 'var(--black-3)',
        border: '1px solid rgba(245,166,35,0.15)',
        borderLeft: '3px solid var(--amber)',
        borderRadius: 'var(--radius)',
        padding: '1.8rem 2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{exp.icon}</span>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '1rem' }}>
              {exp.position}
            </h3>
          </div>
          {exp.period && (
            <span style={{
              background: 'rgba(245,166,35,0.12)', color: 'var(--amber)',
              borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700,
              border: '1px solid rgba(245,166,35,0.25)', whiteSpace: 'nowrap',
            }}>
              {exp.period}
            </span>
          )}
        </div>
        {exp.company && (
          <div style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '1rem', marginBottom: '0.8rem' }}>
            {exp.company}
          </div>
        )}
        {exp.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.8rem' }}>
            {exp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
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
              {open ? '▲ Tutup Rincian' : '▼ Lihat Rincian'}
            </button>
            <motion.div
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.32, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '0.8rem', padding: '1rem', background: 'rgba(245,166,35,0.04)', borderRadius: '8px', borderLeft: '2px solid rgba(245,166,35,0.3)' }}>
                {exp.desc.split('\n').map((line, li) => (
                  <div key={li} style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.8 }}>{line}</div>
                ))}
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
  const { about, skills, exps, certs } = useHomeData();
  const photo = about.photoUrl || FALLBACK_PHOTO;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '70px' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '5rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="about-hero-grid">
        <div>
          <AnimatedSection direction="left">
            <motion.span style={{ fontFamily: 'var(--font-body)', color: 'var(--amber)', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Tentang Saya
            </motion.span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 0.9, marginBottom: '0.3rem' }}>
              ABOUT ME !
            </h1>
            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '2.5rem', fontWeight: 700, display: 'block', marginBottom: '2rem' }}>
              {about.name}
            </span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
              {about.bio1}
            </p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: '1rem' }}>
              {about.bio2}
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Tahun Pengalaman', value: '3+' },
                { label: 'Proyek Selesai', value: '20+' },
                { label: 'Kepuasan Klien', value: '100%' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--amber)', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'var(--white-dim)', fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection direction="right">
          <div className="float-hover" style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '3/4', maxHeight: '500px' }}>
            <img src={photo} alt={about.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <div style={{ background: 'rgba(245,166,35,0.9)', borderRadius: '12px', padding: '0.8rem 1.2rem', color: 'var(--black)', fontWeight: 700, fontSize: '0.9rem' }}>
                📍 {about.location}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Skills ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                KEAHLIAN{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>skills</span>
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {skills.map((skill, i) => (
              <AnimatedSection key={skill.id} direction="up" delay={i * 0.1}>
                <div className="float-hover" style={{
                  background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)',
                  borderRadius: 'var(--radius)', padding: '2rem',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'rgba(245,166,35,0.2)', lineHeight: 1, marginBottom: '0.5rem' }}>
                    {skill.number}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.95rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {skill.title}
                  </h3>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.88rem', lineHeight: 1.7 }}>{skill.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sertifikasi ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              SERTIFIKASI{' '}
              <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>Competensi</span>
            </h2>
          </div>
        </AnimatedSection>
        {certs.length === 0 ? (
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,166,35,0.4)', border: '1px dashed rgba(245,166,35,0.2)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>📜</div>
              <p>Belum ada sertifikasi.</p>
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
                    <img src={cert.imageUrl} alt={cert.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
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

      {/* ── Pengalaman Kerja ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                PENGALAMAN{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>Kerja</span>
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

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
