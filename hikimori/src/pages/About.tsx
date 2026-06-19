// src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

const education = [
  {
    school: 'SMAN 3 Nganjuk',
    year: '2018',
    major: 'Ilmu Pengetahuan Sosial (IPS)',
    score: 'Avg Value: 88',
    icon: '🏫',
  },
  {
    school: 'Institut Teknologi dan Bisnis ASIA',
    year: 'Kota Malang',
    major: 'S1 – Teknik Informatika',
    score: 'IPK 3.38',
    icon: '🎓',
  },
];

const certifications = [
  {
    title: 'Certified Human Resource Officer',
    issuer: 'BNSP',
    items: ['Analisa Beban Kerja', 'Menyusun Uraian Jabatan', 'Payroll & BPJS'],
    color: '#F5A623',
  },
  {
    title: 'Surat Referensi Jabatan Sebelumnya',
    issuer: 'PT MAJU JAYA',
    items: ['Vendor Management', 'Stock Monitoring', 'Facility Maintenance'],
    color: '#FFB84D',
  },
];

const softSkills = [
  { label: 'Komunikasi', pct: 90 },
  { label: 'Teamwork', pct: 88 },
  { label: 'Problem Solving', pct: 85 },
  { label: 'Time Management', pct: 92 },
  { label: 'Adaptabilitas', pct: 87 },
];

const About: React.FC = () => {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '70px' }}>

      {/* Hero */}
      <section style={{
        padding: '5rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
      }}
      className="about-hero-grid"
      >
        <div>
          <AnimatedSection direction="left">
            <motion.span
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--amber)',
                fontSize: '0.85rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Tentang Saya
            </motion.span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              lineHeight: 0.9,
              marginBottom: '0.3rem',
            }}>
              ABOUT ME !
            </h1>
            <span style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--amber)',
              fontSize: '2.5rem',
              fontWeight: 700,
              display: 'block',
              marginBottom: '2rem',
            }}>
              Mahfudfebry
            </span>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
              Saya adalah seorang profesional muda yang berdedikasi dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan dari karya-karya terbaik dan proyek-proyek penting yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional saya.
            </p>
            <p style={{ color: 'var(--white-dim)', lineHeight: 1.8, fontSize: '1rem' }}>
              Di sepanjang perjalanan karier saya, saya telah mengerjakan berbagai bidang mulai dari HR, administrasi, IT support, hingga desain kreatif. Setiap proyek dipilih dengan cermat untuk menunjukkan kompetensi terbaik saya.
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Tahun Pengalaman', value: '3+' },
                { label: 'Proyek Selesai', value: '20+' },
                { label: 'Kepuasan Klien', value: '100%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--amber)',
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--white-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection direction="right">
          <div className="float-hover" style={{
            position: 'relative',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            aspectRatio: '3/4',
            maxHeight: '500px',
          }}>
            <img
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80"
              alt="About Mahfudfebry"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
            }}>
              <div style={{
                background: 'rgba(245,166,35,0.9)',
                borderRadius: '12px',
                padding: '0.8rem 1.2rem',
                color: 'var(--black)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}>
                📍 Nganjuk, Jawa Timur — Indonesia
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
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              }}>
                EDUCATION{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>
                  history
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {education.map((edu, i) => (
              <AnimatedSection key={edu.school} direction={i === 0 ? 'left' : 'right'} delay={i * 0.15}>
                <div className="float-hover" style={{
                  background: 'var(--black-3)',
                  border: '1px solid rgba(245,166,35,0.15)',
                  borderRadius: 'var(--radius)',
                  padding: '2.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'rgba(245,166,35,0.15)',
                    border: '2px solid var(--amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}>
                    {edu.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      color: 'var(--amber)',
                      fontSize: '1rem',
                      marginBottom: '0.3rem',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}>
                      {edu.school} — {edu.year}
                    </h3>
                    <p style={{ color: 'var(--white)', fontWeight: 500, marginBottom: '0.3rem' }}>
                      {edu.major}
                    </p>
                    <span style={{
                      background: 'rgba(245,166,35,0.15)',
                      color: 'var(--amber)',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}>
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
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            }}>
              SERTIFIKASI{' '}
              <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>
                Competensi
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {certifications.map((cert, i) => (
            <AnimatedSection key={cert.title} direction={i === 0 ? 'left' : 'right'} delay={i * 0.15}>
              <div className="float-hover" style={{
                background: 'var(--black-2)',
                border: `1px solid rgba(245,166,35,0.2)`,
                borderTop: `3px solid var(--amber)`,
                borderRadius: 'var(--radius)',
                padding: '2.5rem',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  color: 'var(--amber)',
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}>
                  {cert.title}
                </h3>
                <p style={{ color: 'var(--white)', fontWeight: 600, marginBottom: '1.2rem' }}>
                  {cert.issuer}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {cert.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--amber)',
                        flexShrink: 0,
                      }} />
                      <span style={{ color: 'var(--white-dim)', fontSize: '0.9rem' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Soft Skills / Progress bars */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              textAlign: 'center',
              marginBottom: '3rem',
            }}>
              SOFT SKILLS
            </h2>
          </AnimatedSection>

          {softSkills.map((skill, i) => (
            <AnimatedSection key={skill.label} direction="left" delay={i * 0.1}>
              <div style={{ marginBottom: '1.8rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>{skill.label}</span>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{skill.pct}%</span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--amber-dark), var(--amber-light))',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            </AnimatedSection>
          ))}
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
