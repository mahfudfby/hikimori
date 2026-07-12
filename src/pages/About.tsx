// src/pages/About.tsx
// Data disinkronkan dari Home.tsx via localStorage keys yang sama.
// Layout halaman ini berbeda dari Home, namun semua konten berasal dari data yang sama.
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

/* ─── localStorage keys — identik dengan Home.tsx ─── */
const LS_ABOUT  = 'hk_home_about_data';
const LS_GALLERY = 'hk_about_gallery_data';
const LS_SKILLS = 'hk_skills_data';
const LS_EXP    = 'hk_experience_data';
const LS_CERT   = 'hk_cert_data';
const LS_VER    = 'hk_data_version';
const DATA_VERSION = 'v7'; // Harus sama dengan Home.tsx

interface AboutData {
  name: string; location: string; bio1: string; bio2: string; photoUrl: string;
  instagram?: string; linkedin?: string; whatsapp?: string; threads?: string; tiktok?: string; email?: string;
}
interface SkillItem { id: string; number: string; title: string; desc: string; category?: 'hard'|'soft'; }
interface GalleryItem { id: string; url: string; caption?: string; size?: 'small'|'medium'|'large'|'wide'|'tall'; }
interface ExpItem   { id: string; position: string; company: string; period: string; icon: string; tags: string; desc?: string; logoUrl?: string; }
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
  { id: '1', number: '01', title: 'Payroll & Administrasi Penggajian', desc: 'Menghitung gaji, potongan, bonus, serta iuran BPJS & BPJS-Tk karyawan (UD Duta Pangan).', category: 'hard' },
  { id: '2', number: '02', title: 'HR & General Affairs Management', desc: 'Mengelola fasilitas, aset operasional, uraian jabatan (jobdesk), dan analisa beban kerja tiap divisi.', category: 'hard' },
  { id: '3', number: '03', title: 'IT Technical Support', desc: 'Troubleshooting hardware/software dan dukungan pengguna untuk operasional kantor sehari-hari.', category: 'hard' },
  { id: '4', number: '04', title: 'Food Production & Food Safety (SOP)', desc: 'Food preparation, kontrol kualitas bahan baku, dan kepatuhan standar food safety di dapur produksi.', category: 'hard' },
  { id: '5', number: '05', title: 'Welding & Fabrication', desc: 'Pengelasan dan pemasangan pagar, tralis, kanopi, hingga rolling door di lapangan.', category: 'hard' },
  { id: '6', number: '06', title: 'Sales, Marketing & Administrasi Operasional', desc: 'Penjualan lapangan, dokumentasi administrasi, dan koordinasi operasional harian perusahaan.', category: 'hard' },
  { id: '7', number: '01', title: 'Pelayanan Pelanggan (Customer Service)', desc: 'Menjaga kepuasan dan rating pelanggan lewat interaksi ramah dan responsif di berbagai peran layanan.', category: 'soft' },
  { id: '8', number: '02', title: 'Kerja Tim & Koordinasi Lintas Divisi', desc: 'Terbiasa berkoordinasi dengan tim dapur, kasir, hingga divisi lain untuk kelancaran operasional.', category: 'soft' },
  { id: '9', number: '03', title: 'Disiplin & Keselamatan Kerja', desc: 'Konsisten mematuhi SOP dan standar keselamatan, baik di jalan raya maupun lokasi kerja lapangan.', category: 'soft' },
  { id: '10', number: '04', title: 'Manajemen Waktu & Target Kerja', desc: 'Mampu bekerja dengan target service time dan tenggat penjualan tanpa mengorbankan kualitas.', category: 'soft' },
  { id: '11', number: '05', title: 'Adaptasi & Fleksibilitas Lintas Industri', desc: 'Terbukti mampu beradaptasi cepat di berbagai bidang berbeda — F&B, IT, HR, hingga manufaktur.', category: 'soft' },
  { id: '12', number: '06', title: 'Kepedulian Sosial & Tanggung Jawab Komunitas', desc: 'Berpengalaman menyusun program sosialisasi kesehatan dan perlindungan anak bersama instansi pemerintah.', category: 'soft' },
];
const D_EXP: ExpItem[] = [
  { id: '1', position: 'HR / General Affairs', company: 'UD Duta Pangan (Food Manufacturing)', period: 'Agustus 2025 – April 2026 · 9 bln · Full-time', icon: '👥', tags: 'Payroll & Penggajian,BPJS & BPJS-Tk,Pengelolaan Fasilitas & Aset,Koordinasi Lintas Divisi,Penyusunan Jobdesk,Analisa Beban Kerja', desc: '• Mengelola fasilitas dan aset operasional perusahaan\n• Menangani koordinasi lintas divisi untuk kelancaran operasional harian\n• Penghitungan Gaji, Potongan, & Bonus (Payroll)\n• Penghitungan Jaminan Sosial (BPJS & BPJS-Tk)\n• Menyusun Uraian Jabatan (Jobdesk)\n• Analisa Beban Kerja setiap Divisi' },
  { id: '2', position: 'Human Resources Generalist', company: 'UD Duta Pangan (Food Manufacturing)', period: 'Agustus 2025 – April 2026 · 9 bln · Full-time', icon: '🧑\u200d💼', tags: 'BPJS,Analisa Beban Kerja', desc: '' },
  { id: '3', position: 'Information Technology Support Specialist', company: 'UD Duta Pangan (Food Manufacturing)', period: 'Januari 2025 – Agustus 2025 · 8 bln · Full-time', icon: '💻', tags: 'Technical Support,General Office Work', desc: '' },
  { id: '4', position: 'Administrative', company: 'UD Duta Pangan (Food Manufacturing)', period: 'Agustus 2024 – Mei 2025 · 10 bln · Contract', icon: '📋', tags: 'Administrasi', desc: '• Menangani Administrasi' },
  { id: '5', position: 'Sales Marketing Positions', company: 'UD Duta Pangan (Food Manufacturing)', period: 'April 2024 – Juli 2024 · 4 bln · Contract', icon: '📈', tags: 'Marketing,Sales Operations', desc: '• Sales Lapangan\n• Menjual Produk Premix Tepung Bakso' },
  { id: '6', position: 'Driver Bike', company: 'Grab', period: 'Februari 2022 – Desember 2025 · 3 thn 11 bln · Part-time', icon: '🏍️', tags: '', desc: '• Mengantar penumpang dengan aman dan tepat waktu\n• Mengantar pesanan makanan (GrabFood)\n• Mengantar paket/barang (GrabExpress)\n• Melayani titip belanja (GrabMart)\n• Menjaga rating dan kepuasan pelanggan\n• Mematuhi standar keselamatan berkendara' },
  { id: '7', position: 'Crew', company: 'PT. Richeese Kuliner Indonesia', period: 'Oktober 2023 – Maret 2024 · 6 bln · Contract', icon: '🍗', tags: 'Cooking,Platting', desc: '• Memasak ayam goreng crispy sesuai SOP dan standar resep\n• Meracik sauce/saus sesuai standar rasa perusahaan\n• Melakukan food preparation harian (marinasi, potong, susun stok)\n• Menjaga kualitas dan kebersihan bahan baku (food safety)\n• Merekap inventory harian (stok masuk, terpakai, sisa stok)\n• Melaporkan kebutuhan restock ke supervisor/leader shift\n• Berkoordinasi dengan tim dapur dan kasir untuk kelancaran operasional\n• Menjaga kecepatan penyajian sesuai target service time' },
  { id: '8', position: 'Kitchen Staff', company: 'Mikane Gepuktular', period: 'Januari 2023 – November 2023 · 11 bln · Part-time', icon: '👨\u200d🍳', tags: '', desc: '• Sebagai Juru Masak Dan Persiapan Bahan Mentah' },
  { id: '9', position: 'Crew', company: 'Mie Gacoan', period: 'Oktober 2022 – Desember 2022 · 3 bln · Contract', icon: '🍜', tags: 'Hospitality Industry,Food and Beverage Operations', desc: '• Hospitality Customer' },
  { id: '10', position: 'Welding Operator', company: 'Lancar Jaya Kota Malang', period: 'Agustus 2018 – Januari 2021 · 2 thn 6 bln · Freelance', icon: '🔩', tags: 'Welding,Project Planning', desc: '• Operator welder pembuatan pagar, tralis, kanopi, rolling door, dll hingga finishing serta pemasangan di lapangan' },
  { id: '11', position: 'Human Resources Assistant', company: 'Dinas Sosial PPPA Kab Nganjuk', period: 'Mei 2017 – Juni 2018 · 1 thn 2 bln · Full-time', icon: '🏛️', tags: 'Sumber Daya Manusia (SDM),Project Management', desc: '• Staff SDM bertugas dalam menyiapkan materi untuk anggota Forum Perlindungan Anak Nganjuk untuk mewujudkan nganjuk kabupaten layak anak' },
  { id: '12', position: 'Human Resources Assistant', company: 'Dinas Kesehatan Nganjuk', period: 'Maret 2016 – Mei 2017 · 1 thn 3 bln · Full-time', icon: '🏛️', tags: 'Sumber Daya Manusia (SDM),Project Management', desc: '• Sebagai staff yang menangani perencanaan kegiatan dan agenda program kerja dalam mensosialisasikan kesehatan remaja di kabupaten nganjuk' },
];

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
const D_CERT: CertItem[] = [
  { id: '1', name: 'Google Digital Marketing', year: '2023', issuer: 'Google', subtitle: 'Fundamentals of Digital Marketing', imageUrl: '' },
  { id: '2', name: 'HR Management Professional', year: '2022', issuer: 'BNSP Indonesia', subtitle: 'Sertifikasi Kompetensi SDM', imageUrl: '' },
];

const FALLBACK_PHOTO = 'https://res.cloudinary.com/dl4pyan8v/image/upload/v1783866519/Mahfudfebry_casual_oj8r1d.png';
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
  const [gallery, setGallery] = useState<GalleryItem[]>(() => ls(LS_GALLERY, D_GALLERY));
  const [skills, setSkills] = useState<SkillItem[]>(() => ls(LS_SKILLS, D_SKILLS));
  const [exps,   setExps]   = useState<ExpItem[]>  (() => ls(LS_EXP,   D_EXP));
  const [certs,  setCerts]  = useState<CertItem[]> (() => ls(LS_CERT,  D_CERT));

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
  return (
    <AnimatedSection direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.12}>
      <div className="float-hover" style={{
        background: 'var(--black-3)',
        border: '1px solid rgba(245,166,35,0.15)',
        borderLeft: '3px solid var(--amber)',
        borderRadius: 'var(--radius)',
        padding: '1.8rem 2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          {logo && !logoFailed ? (
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              <img src={logo} alt={exp.company} onError={() => setLogoFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
            </div>
          ) : (
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{exp.icon}</span>
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
        {exp.period && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            background: 'rgba(245,166,35,0.12)', color: 'var(--amber)',
            borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700,
            border: '1px solid rgba(245,166,35,0.25)', marginBottom: '0.8rem',
          }}>
            <span>🕐</span>{exp.period}
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
  const { about, gallery, skills, exps, certs } = useHomeData();
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

      {/* ── Galeri Foto — Layout Majalah ── */}
      {gallery.length > 0 && (
        <section style={{ padding: '1rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                GALERI{' '}
                <span style={{ fontFamily: 'var(--font-script)', color: 'var(--amber)', fontSize: '55%' }}>Momen</span>
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
                      <img src={g.url} alt={g.caption || about.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
      )}
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
                      <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.65 }}>{skill.desc}</p>
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
                      <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', lineHeight: 1.65 }}>{skill.desc}</p>
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
          .magazine-grid { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 160px !important; }
          .magazine-item { grid-column: span 1 !important; grid-row: span 1 !important; }
          .magazine-item.mag-wide, .magazine-item.mag-large { grid-column: span 2 !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
