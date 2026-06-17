// src/pages/About.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

const LS_ABOUT       = 'hk_about_data';
const LS_ABOUT_PHOTO = 'hk_about_photo';
const LS_EDU         = 'hk_edu_data';
const LS_CERT        = 'hk_cert_data';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80';

interface AboutData { name: string; location: string; bio1: string; bio2: string; }
interface EduItem   { id: string; school: string; year: string; major: string; score: string; icon: string; }
interface CertItem  { id: string; title: string; issuer: string; items: string; imageUrl: string; }

const ls = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

const defaultAbout: AboutData = {
  name: 'Mahfudfebry',
  location: 'Nganjuk, Jawa Timur — Indonesia',
  bio1: 'Saya adalah seorang profesional muda yang berdedikasi dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan dari karya-karya terbaik dan proyek-proyek penting yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional saya.',
  bio2: 'Di sepanjang perjalanan karier saya, saya telah mengerjakan berbagai bidang mulai dari HR, administrasi, IT support, hingga desain kreatif. Setiap proyek dipilih dengan cermat untuk menunjukkan kompetensi terbaik saya.',
};

const defaultEdus: EduItem[] = [
  { id: '1', school: 'SMAN 3 Nganjuk', year: '2018', major: 'Ilmu Pengetahuan Sosial (IPS)', score: 'Avg Value: 88', icon: '🏫' },
  { id: '2', school: 'Institut Teknologi dan Bisnis ASIA', year: 'Kota Malang', major: 'S1 – Teknik Informatika', score: 'IPK 3.38', icon: '🎓' },
];

const defaultCerts: CertItem[] = [
  { id: '1', title: 'Certified Human Resource Officer', issuer: 'BNSP', items: 'Analisa Beban Kerja,Menyusun Uraian Jabatan,Payroll & Jaminan Soaial ( BPJS )', imageUrl: '' },
  { id: '2', title: 'Surat Referensi Jabatan Sebelumnya', issuer: 'UD DUTA PANGAN', items: 'Administrasi Produksi,Stock Monitoring,Facility Maintenance', imageUrl: '' },
];

const softSkills = [
  { label: 'Komunikasi',      pct: 90 },
  { label: 'Teamwork',        pct: 88 },
  { label: 'Problem Solving', pct: 85 },
  { label: 'Time Management', pct: 92 },
  { label: 'Adaptabilitas',   pct: 87 },
];

/* ── Modal Gambar Sertifikat ── */
const CertImageModal: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}
  >
    <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '900px', width: '100%' }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '-2.5rem', right: 0,
          background: 'none', border: 'none', color: 'white',
          fontSize: '1.5rem', cursor: 'pointer', fontWeight: 700,
        }}
      >✕</button>
      <img
        src={src}
        alt="Sertifikat"
        style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', objectFit: 'contain', maxHeight: '80vh' }}
      />
    </div>
  </div>
);

const About: React.FC = () => {
  const [about, setAbout]       = useState<AboutData>(() => ls(LS_ABOUT, defaultAbout));
  const [photo, setPhoto]       = useState<string>(() => localStorage.getItem(LS_ABOUT_PHOTO) || '');
  const [edus, setEdus]         = useState<EduItem[]>(() => ls(LS_EDU, defaultEdus));
  const [certs, setCerts]       = useState<CertItem[]>(() => ls(LS_CERT, defaultCerts));
  const [certModalSrc, setCertModalSrc] = useState<string | null>(null);

  /* Sync on storage change (real-time from admin) */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_ABOUT && e.newValue)       setAbout(JSON.parse(e.newValue));
      if (e.key === LS_ABOUT_PHOTO && e.newValue) setPhoto(e.newValue.replace(/^"|"$/g, ''));
      if (e.key === LS_EDU && e.newValue)         setEdus(JSON.parse(e.newValue));
      if (e.key === LS_CERT && e.newValue)        setCerts(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const photoSrc = photo || FALLBACK_PHOTO;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '70px' }}>

      {/* Hero */}
      <section
        style={{ padding: '5rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
        className="about-hero-grid"
      >
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
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>{about.bio1}</p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: '1rem' }}>{about.bio2}</p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[{ label: 'Tahun Pengalaman', value: '3+' }, { label: 'Proyek Selesai', value: '20+' }, { label: 'Kepuasan Klien', value: '100%' }].map(stat => (
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
            <img src={photoSrc} alt={`About ${about.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <div style={{ background: 'rgba(245,166,35,0.9)', borderRadius: '12px', padding: '0.8rem 1.2rem', color: 'var(--black)', fontWeight: 700, fontSize: '0.9rem' }}>
                📍 {about.location}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Education */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                EDUCATION{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>history</span>
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {edus.map((edu, i) => (
              <AnimatedSection key={edu.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
                <div className="float-hover" style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: 'var(--radius)', padding: '2.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(245,166,35,0.15)', border: '2px solid var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    {edu.icon}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '1rem', marginBottom: '0.3rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {edu.school} — {edu.year}
                    </h3>
                    <p style={{ color: 'var(--white)', fontWeight: 500, marginBottom: '0.3rem' }}>{edu.major}</p>
                    <span style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--amber)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.82rem', fontWeight: 700 }}>
                      {edu.score}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              SERTIFIKASI{' '}
              <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>Competensi</span>
            </h2>
          </div>
        </AnimatedSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {certs.map((cert, i) => (
            <AnimatedSection key={cert.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.15}>
              <div className="float-hover" style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.2)', borderTop: '3px solid var(--amber)', borderRadius: 'var(--radius)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {cert.title}
                  </h3>
                  <p style={{ color: 'var(--white)', fontWeight: 600 }}>{cert.issuer}</p>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {cert.items.split(',').map(item => item.trim()).filter(Boolean).map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--white-dim)', fontSize: '0.9rem' }}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Gambar Sertifikat */}
                {cert.imageUrl && (
                  <div
                    onClick={() => setCertModalSrc(cert.imageUrl)}
                    style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(245,166,35,0.2)', position: 'relative' }}
                    title="Klik untuk perbesar"
                  >
                    <img src={cert.imageUrl} alt={`Sertifikat ${cert.title}`} style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.4)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'; }}
                    >
                      <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(245,166,35,0.8)', padding: '6px 14px', borderRadius: '20px' }}>🔍 Lihat Sertifikat</span>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Soft Skills */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', textAlign: 'center', marginBottom: '3rem' }}>SOFT SKILLS</h2>
          </AnimatedSection>
          {softSkills.map((skill, i) => (
            <AnimatedSection key={skill.label} direction="left" delay={i * 0.1}>
              <div style={{ marginBottom: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>{skill.label}</span>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{skill.pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--amber-dark), var(--amber-light))', borderRadius: '3px' }}
                  />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Cert Image Modal */}
      {certModalSrc && <CertImageModal src={certModalSrc} onClose={() => setCertModalSrc(null)} />}

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
