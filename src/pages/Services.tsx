// src/pages/Services.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

const services = [
  {
    icon: '👥',
    title: 'Human Resource Management',
    subtitle: 'HR Professional',
    desc: 'Pengelolaan sumber daya manusia secara menyeluruh — dari rekrutmen, onboarding, evaluasi kinerja, hingga pengembangan organisasi.',
    features: [
      'Analisa Beban Kerja',
      'Menyusun Uraian Jabatan',
      'Payroll & BPJS Ketenagakerjaan',
      'Rekrutmen & Seleksi',
      'Employee Relations',
      'Performance Evaluation',
    ],
    color: '#F5A623',
  },
  {
    icon: '📋',
    title: 'Staff Administrasi',
    subtitle: 'Administration',
    desc: 'Layanan administrasi profesional yang efisien — pengelolaan dokumen, pelaporan, dan koordinasi operasional harian perusahaan.',
    features: [
      'Document Management',
      'Vendor Coordination',
      'Stock Monitoring',
      'Facility Maintenance',
      'Laporan Operasional',
      'Arsip & Filing',
    ],
    color: '#FFB84D',
  },
  {
    icon: '💻',
    title: 'IT Support & Technical',
    subtitle: 'Technology',
    desc: 'Dukungan teknis komprehensif untuk kebutuhan IT perusahaan — dari hardware, software, jaringan, hingga pelatihan pengguna.',
    features: [
      'Hardware Troubleshooting',
      'Software Installation',
      'Network Setup & Config',
      'Data Backup & Recovery',
      'User Training',
      'IT Documentation',
    ],
    color: '#D4891F',
  },
  {
    icon: '🎨',
    title: 'Branding & Creative Design',
    subtitle: 'Creative',
    desc: 'Solusi desain kreatif yang membangun identitas brand yang kuat — logo, visual identity, dan materi pemasaran yang berkesan.',
    features: [
      'Logo & Brand Identity',
      'Visual System Design',
      'Marketing Collateral',
      'Social Media Graphics',
      'Presentation Design',
      'Concept Development',
    ],
    color: '#F5A623',
  },
];

const process = [
  { step: '01', title: 'Konsultasi', desc: 'Diskusi mendalam tentang kebutuhan dan tujuan Anda.' },
  { step: '02', title: 'Perencanaan', desc: 'Menyusun strategi dan roadmap yang terstruktur.' },
  { step: '03', title: 'Eksekusi', desc: 'Implementasi dengan standar kualitas tertinggi.' },
  { step: '04', title: 'Evaluasi', desc: 'Review dan penyempurnaan untuk hasil optimal.' },
];

const Services: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '70px' }}>

      {/* Hero */}
      <section style={{
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--amber)',
            fontSize: '0.85rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'block',
            marginBottom: '1rem',
          }}>
            Apa yang Bisa Saya Lakukan
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            lineHeight: 0.9,
            marginBottom: '0.4rem',
          }}>
            LAYANAN
          </h1>
          <span style={{
            fontFamily: 'var(--font-script)',
            color: 'var(--amber)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '2rem',
          }}>
            Kami
          </span>
          <p style={{
            color: 'var(--white-dim)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.8,
            fontSize: '1.05rem',
          }}>
            Solusi profesional lengkap dari HR, administrasi, IT support, hingga desain kreatif — semua dalam satu tempat.
          </p>
        </motion.div>
      </section>

      {/* Service Cards */}
      <section style={{ padding: '3rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {services.map((svc, i) => (
            <AnimatedSection key={svc.title} direction="up" delay={i * 0.1}>
              <motion.div
                className="float-hover"
                onHoverStart={() => setActiveCard(i)}
                onHoverEnd={() => setActiveCard(null)}
                style={{
                  background: activeCard === i ? 'var(--black-3)' : 'var(--black-2)',
                  border: `1px solid ${activeCard === i ? 'rgba(245,166,35,0.4)' : 'rgba(245,166,35,0.1)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '2.5rem',
                  cursor: 'default',
                  transition: 'background 0.3s, border-color 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow bg on hover */}
                {activeCard === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, var(--amber-dark), var(--amber-light))',
                    }}
                  />
                )}

                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{svc.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--amber)',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}>
                  {svc.subtitle}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  marginBottom: '1rem',
                  lineHeight: 1.1,
                }}>
                  {svc.title}
                </h3>
                <p style={{
                  color: 'var(--white-dim)',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                }}>
                  {svc.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {svc.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--amber)',
                        flexShrink: 0,
                      }} />
                      <span style={{ color: 'var(--white-dim)', fontSize: '0.85rem' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Process section */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black-2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              }}>
                CARA KERJA{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>
                  Kami
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {process.map((p, i) => (
              <AnimatedSection key={p.step} direction="up" delay={i * 0.12}>
                <div className="float-hover" style={{
                  textAlign: 'center',
                  padding: '2.5rem 1.5rem',
                  background: 'var(--black-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(245,166,35,0.1)',
                  position: 'relative',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '4rem',
                    color: 'rgba(245,166,35,0.15)',
                    lineHeight: 1,
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}>
                    {p.step}
                  </div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid var(--amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--amber)',
                    fontSize: '1.3rem',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {p.step}
                  </div>
                  <h4 style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    marginBottom: '0.6rem',
                    color: 'var(--white)',
                  }}>
                    {p.title}
                  </h4>
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <AnimatedSection direction="scale">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            marginBottom: '1rem',
          }}>
            SIAP BERKOLABORASI?
          </h2>
          <p style={{ color: 'var(--white-dim)', marginBottom: '2.5rem', fontSize: '1rem' }}>
            Hubungi saya dan kita mulai wujudkan ide Anda bersama.
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
            Mulai Sekarang →
          </motion.a>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Services;
