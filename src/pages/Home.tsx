// src/pages/Home.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/AnimatedSection';

/* ══════════════════════════════════════════════════════
   LocalStorage Keys — SAMA dengan AdminPanel.tsx, jangan diubah
   sembarangan karena datanya dipakai bersama.
══════════════════════════════════════════════════════ */
const LS_HOME           = 'hk_home_data';
const LS_HOME_ABOUT     = 'hk_home_about_data';
const LS_SKILLS         = 'hk_skills_data';
const LS_EXPERIENCE     = 'hk_experience_data';
const LS_CONTACT        = 'hk_contact_data';
const LS_EXPERTISE      = 'hk_expertise_data';
const LS_TOOLS          = 'hk_tools_data';
const LS_VALUES         = 'hk_values_data';
const LS_HOME_PROJECTS  = 'hk_home_projects_data';
const LS_EDU            = 'hk_edu_data';
const LS_CERT           = 'hk_cert_data';

/* ── Types (cermin dari AdminPanel.tsx) ── */
interface StatItem { id: string; value: string; label: string; }
interface HomeData {
  kicker: string; heroTitle: string; heroSubtitle: string; heroTagline: string;
  heroCta: string; heroCtaLink: string; heroCta2: string; heroCta2Link: string;
  heroPhotoUrl: string; stats: StatItem[];
}
interface HomeAboutData {
  name: string; location: string; subtitle: string; bio1: string; bio2: string;
  photoUrl: string; badgeText: string; closingQuote: string;
  email: string; phone: string; linkedinLabel: string; linkedinUrl: string;
  githubLabel: string; githubUrl: string; stats: StatItem[];
}
interface SkillItem      { id: string; icon: string; title: string; desc: string; }
interface ExpertiseCard  { id: string; icon: string; title: string; items: string; }
interface ToolItem       { id: string; icon: string; label: string; }
interface ValueItem      { id: string; icon: string; label: string; }
interface ExpItem        { id: string; position: string; company: string; period: string; icon: string; tags: string; imageUrl: string; }
interface HomeProjectItem{ id: string; icon: string; title: string; desc: string; category: string; }
interface EduItem        { id: string; school: string; year: string; major: string; location: string; score: string; icon: string; }
interface CertItem       { id: string; title: string; issuer: string; items: string; imageUrl: string; }
interface ContactData {
  whatsapp: string; instagram: string; linkedin: string; tiktok: string; website: string; email: string;
  phone: string; location: string;
  showWhatsapp: boolean; showInstagram: boolean; showLinkedin: boolean;
  showTiktok: boolean; showWebsite: boolean; showEmail: boolean;
}

const HOME_PROJECT_CATEGORIES = ['Administrasi', 'IT Support', 'Sistem & Network', 'Analisis & Laporan', 'General Affairs'];

/* ── Defaults (sinkron dengan AdminPanel.tsx) ── */
const defaultHome: HomeData = {
  kicker: 'Welcome To My Journey',
  heroTitle: 'MAHFUDFEBRY',
  heroSubtitle: 'HR General Affairs  •  IT Support  •  Administrative Specialist',
  heroTagline: 'Membantu organisasi berkembang melalui pengelolaan SDM, operasional perusahaan, dan dukungan teknologi yang efektif.',
  heroCta: 'Hubungi Saya', heroCtaLink: '#contact',
  heroCta2: 'Download CV', heroCta2Link: '',
  heroPhotoUrl: '',
  stats: [
    { id: '1', value: '3+',  label: 'Posisi Profesional' },
    { id: '2', value: '30+', label: 'Perangkat IT Ditangani' },
    { id: '3', value: '1+',  label: 'Sertifikasi BNSP' },
    { id: '4', value: '7+',  label: 'Bidang Kompetensi' },
  ],
};
const defaultHomeAbout: HomeAboutData = {
  name: 'Mahfudfebry',
  location: 'Nganjuk, Jawa Timur',
  subtitle: 'Menghubungkan SDM, Operasional, dan Teknologi',
  bio1: 'Saya adalah profesional yang memiliki pengalaman di bidang **Human Resource, General Affairs, IT Support,** dan **Administrasi Operasional.**',
  bio2: 'Saya percaya bahwa kombinasi antara manajemen SDM yang baik, operasional yang terstruktur, dan teknologi yang tepat dapat membantu perusahaan berkembang secara berkelanjutan.',
  photoUrl: '',
  badgeText: 'Berkomitmen pada kualitas, integritas, dan kolaborasi.',
  closingQuote: 'Terus belajar, beradaptasi, dan memberikan dampak positif adalah cara saya berkembang setiap hari.',
  email: 'mahfudfebrys@gmail.com',
  phone: '+62 822-3465-1413',
  linkedinLabel: 'linkedin.com/in/mahfud-febry-styanto',
  linkedinUrl: 'https://linkedin.com/in/mahfud-febry-styanto',
  githubLabel: 'github.com/Mahfudfby',
  githubUrl: 'https://github.com/Mahfudfby',
  stats: [
    { id: '1', value: '1+',  label: 'Tahun Pengalaman' },
    { id: '2', value: '3',   label: 'Posisi Profesional' },
    { id: '3', value: '30+', label: 'Perangkat IT Ditangani' },
    { id: '4', value: '7+',  label: 'Bidang Kompetensi' },
  ],
};
const defaultExpertise: ExpertiseCard[] = [
  { id: '1', icon: '👥', title: 'HR General Affairs', items: 'Analisa Beban Kerja,Penyusunan Uraian Jabatan (Jobdesk),Administrasi BPJS Kesehatan & Ketenagakerjaan,Kebijakan MSDM,Penghitungan Gaji Nett/Gross Up,Hubungan Relasi Industri,Koordinasi Operasional,Budget Monitoring,Asset Management,Vendor Management' },
  { id: '2', icon: '💻', title: 'IT Support', items: 'Troubleshooting Hardware & Software,Konfigurasi LAN / WIFI,Pemeliharaan Jaringan,Dukungan Pengguna (User Support),Penanganan Insiden TI,Inventarisasi Perangkat TI' },
  { id: '3', icon: '📋', title: 'Administrasi Produksi', items: 'Administrasi Produksi Pabrik,Monitoring Bahan Baku,Monitoring Hasil Produksi,Penyusunan Laporan Produksi,Pengendalian Dokumen,Manajemen FIFO (First in - First Out)' },
];
const defaultSkills: SkillItem[] = [
  { id: '1', icon: '📋', title: 'Manajemen Administrasi', desc: 'Mampu mengelola data, dokumen, dan proses administrasi secara sistematis dan efisien.' },
  { id: '2', icon: '🎧', title: 'IT Support', desc: 'Berpengalaman dalam troubleshooting hardware, software, jaringan, dan memberikan solusi teknis.' },
  { id: '3', icon: '📈', title: 'Analisis & Pelaporan', desc: 'Terampil dalam menganalisis data dan menyusun laporan yang akurat dan informatif.' },
  { id: '4', icon: '👥', title: 'Komunikasi & Kolaborasi', desc: 'Mampu berkomunikasi dengan jelas dan bekerja sama efektif dalam tim maupun lintas divisi.' },
  { id: '5', icon: '🛡️', title: 'Problem Solving', desc: 'Mampu mengidentifikasi masalah, menganalisis akar penyebab, dan menemukan solusi yang tepat.' },
  { id: '6', icon: '⚙️', title: 'Manajemen Proyek', desc: 'Berpengalaman merencanakan, melaksanakan, dan memantau proyek hingga selesai tepat waktu.' },
  { id: '7', icon: '📖', title: 'Pembelajaran Berkelanjutan', desc: 'Selalu belajar hal baru untuk meningkatkan kompetensi dan mengikuti perkembangan teknologi.' },
  { id: '8', icon: '🎯', title: 'Orientasi Hasil', desc: 'Fokus pada pencapaian target dengan kualitas terbaik dan memberikan nilai tambah.' },
];
const defaultTools: ToolItem[] = [
  { id: '1', icon: '🗂️', label: 'Microsoft Office' },
  { id: '2', icon: '🔍', label: 'Google Workspace' },
  { id: '3', icon: '🔌', label: 'Jaringan & LAN' },
  { id: '4', icon: '💾', label: 'Database Dasar' },
  { id: '5', icon: '🎨', label: 'Canva Design' },
  { id: '6', icon: '📌', label: 'Trello Project' },
];
const defaultValues: ValueItem[] = [
  { id: '1', icon: '👤', label: 'Profesional' },
  { id: '2', icon: '💡', label: 'Inovatif' },
  { id: '3', icon: '🤝', label: 'Integritas' },
  { id: '4', icon: '⏰', label: 'Disiplin' },
  { id: '5', icon: '🏆', label: 'Bertanggung Jawab' },
];
const defaultExperience: ExpItem[] = [
  { id: '1', position: 'Administrasi Produksi', company: 'UD Duta Pangan', period: 'Jul 2024 – Des 2024', icon: '🏭', tags: 'Administrasi Produksi Pabrik,Monitoring Bahan Baku,Monitoring Hasil Produksi,Penyusunan Laporan Produksi,Pengendalian Dokumen,Manajemen FIFO (First in - First Out)', imageUrl: '' },
  { id: '2', position: 'IT Support', company: 'UD Duta Pangan', period: 'Jan 2025 – Agu 2025', icon: '💻', tags: 'Menangani 30+ perangkat komputer,Troubleshooting Hardware,Troubleshooting Software,Konfigurasi LAN & WiFi,Penanganan Insiden IT,Pemeliharaan Jaringan', imageUrl: '' },
  { id: '3', position: 'Staff HRD & General Affairs', company: 'UD Duta Pangan', period: 'Agu 2025 – Sekarang', icon: '👥', tags: 'Payroll (Gaji, Potongan, Bonus),BPJS Kesehatan,BPJS Ketenagakerjaan,Analisa Beban Kerja,Job Description,Asset Management,Vendor Management,Laporan Harian/Mingguan/Bulanan', imageUrl: '' },
];
const defaultHomeProjects: HomeProjectItem[] = [
  { id: '1', icon: '📋', title: 'Implementasi Administrasi BPJS', desc: 'Mengelola administrasi BPJS Kesehatan dan Ketenagakerjaan karyawan secara akurat dan tepat waktu.', category: 'Administrasi' },
  { id: '2', icon: '💰', title: 'Pengelolaan Payroll Karyawan', desc: 'Mengelola perhitungan gaji, potongan, bonus, BPJS, dan laporan payroll secara rutin dan akurat.', category: 'Administrasi' },
  { id: '3', icon: '💻', title: 'Troubleshooting Infrastruktur IT', desc: 'Menangani troubleshooting hardware, software, jaringan LAN, dan WiFi dengan downtime minimal.', category: 'IT Support' },
  { id: '4', icon: '📈', title: 'Analisa Beban Kerja Divisi', desc: 'Melakukan analisa beban kerja untuk penyesuaian SDM dan peningkatan efisiensi operasional.', category: 'Analisis & Laporan' },
  { id: '5', icon: '📄', title: 'Administrasi Produksi & Stok', desc: 'Monitoring bahan baku, hasil produksi, penyusunan laporan produksi dan dokumentasi secara berkala.', category: 'Administrasi' },
  { id: '6', icon: '🛡️', title: 'Konfigurasi & Pemeliharaan Jaringan', desc: 'Konfigurasi LAN, WiFi, dan perangkat jaringan untuk mendukung kelancaran operasional perusahaan.', category: 'Sistem & Network' },
  { id: '7', icon: '📝', title: 'Penyusunan Laporan Operasional', desc: 'Menyusun laporan operasional bulanan sebagai dasar pengambilan keputusan dan evaluasi kinerja.', category: 'Analisis & Laporan' },
  { id: '8', icon: '👥', title: 'Koordinasi & Support Kegiatan Internal', desc: 'Berkoordinasi dengan berbagai divisi untuk mendukung kelancaran kegiatan internal perusahaan.', category: 'General Affairs' },
];
const defaultEdus: EduItem[] = [
  { id: '1', school: 'Institut Teknologi dan Bisnis ASIA', year: '2026', major: 'S1 Teknik Informatika (S.Kom.)', location: 'Kota Malang', score: '', icon: '🎓' },
  { id: '2', school: 'SMAN 3 Nganjuk', year: '2018', major: 'Jurusan IPS (Ilmu Pengetahuan Sosial)', location: 'Nganjuk, Jawa Timur', score: '', icon: '🏫' },
];
const defaultCerts: CertItem[] = [
  { id: '1', title: 'Certified Human Resource Officer (CHRO)', issuer: 'BNSP – Badan Nasional Sertifikasi Profesi', items: 'Analisa Beban Kerja,Menyusun Uraian Jabatan,Payroll & BPJS', imageUrl: '' },
];
const defaultContact: ContactData = {
  whatsapp: '6281234567890', instagram: 'mahfudfebry', linkedin: 'mahfudfebry',
  tiktok: 'mahfudfebry', website: 'https://hikimori-project.com', email: 'mahfudfebry@hikimori.web.id',
  phone: '+62 895-1234-5678', location: 'Jakarta, Indonesia',
  showWhatsapp: true, showInstagram: true, showLinkedin: true,
  showTiktok: false, showWebsite: true, showEmail: true,
};

/* ── Placeholder photo (akan otomatis terganti begitu foto asli diupload lewat Admin) ── */
const FALLBACK_HERO_PHOTO  = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=80';
const FALLBACK_ABOUT_PHOTO = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80';

/* ── Helpers ── */
const ls = <T,>(key: string, fallback: T): T => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored === null) return fallback;
    // Kalau fallback adalah array, kembalikan stored langsung (atau fallback jika null)
    if (Array.isArray(fallback)) return (stored ?? fallback) as T;
    // Kalau object, merge dengan fallback agar field baru tetap ada (misal: 'stats')
    return { ...(fallback as object), ...(stored as object) } as T;
  } catch { return fallback; }
};
/** Render teks dengan dukungan **bold** sederhana (tanpa library markdown). */
const renderBold = (text: string): React.ReactNode => {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>));
};
const splitList = (s: string) => (s ?? '').split(',').map(t => t.trim()).filter(Boolean);

/* ══════════════════════════════════════════════════════
   PALET WARNA & STYLE BERSAMA — tema nature/green, lepas
   dari tema gelap+amber yang dipakai halaman lain.
══════════════════════════════════════════════════════ */
const C = {
  bg: '#fbfaf4',
  bgAlt: '#f3f3e8',
  bgSoft: '#edf1e3',
  card: '#ffffff',
  ink: '#1d2b18',
  text: '#42513c',
  textMuted: '#74816c',
  green: '#3f6b35',
  greenDark: '#2a4823',
  greenLight: '#74a35a',
  border: 'rgba(63,107,53,0.16)',
  borderSoft: 'rgba(63,107,53,0.09)',
};

const cardStyle: React.CSSProperties = {
  background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px',
  boxShadow: '0 6px 28px rgba(40,60,30,0.07)',
};
const kickerLineStyle: React.CSSProperties = { width: '30px', height: '1px', background: 'rgba(63,107,53,0.4)' };
const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  background: C.greenDark, color: '#fff', textDecoration: 'none',
  borderRadius: '10px', padding: '13px 26px', fontFamily: 'var(--font-body)',
  fontWeight: 700, fontSize: '0.92rem', letterSpacing: '0.3px',
};
const secondaryBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  background: '#fff', color: C.greenDark, textDecoration: 'none',
  border: `1px solid ${C.border}`, borderRadius: '10px', padding: '13px 26px',
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.92rem',
};

/* ══════════════════════════════════════════════════════
   EFEK ALAM: Daun Berterbangan + Ranting Bergoyang
   (motion ambient, fixed di viewport, tidak ganggu klik)
══════════════════════════════════════════════════════ */
const LEAF_PATH = 'M20 2C30 9 35 23 31 36C28 47 22 54 20 58C18 54 12 47 9 36C5 23 10 9 20 2Z';

const LeafSVG: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size * 1.45} viewBox="0 0 40 60" style={{ display: 'block' }}>
    <path d={LEAF_PATH} fill={color} opacity={0.85} />
    <path d="M20 8 L20 53" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
  </svg>
);

interface LeafSpec { id: number; top: string; left: string; size: number; color: string; duration: number; delay: number; drift: number; rotate: number; }
const LEAF_COLORS = ['#5a8c4a', '#7fae5a', '#3f6b35', '#9bc47a', '#4f7d3f'];

const FloatingLeaf: React.FC<{ spec: LeafSpec }> = ({ spec }) => (
  <motion.div
    style={{ position: 'absolute', top: spec.top, left: spec.left, willChange: 'transform' }}
    animate={{
      y: [0, -22, 4, -14, 0],
      x: [0, spec.drift, spec.drift * 0.4, spec.drift * 1.15, 0],
      rotate: [spec.rotate, spec.rotate + 18, spec.rotate - 12, spec.rotate + 10, spec.rotate],
      opacity: [0.55, 0.85, 0.6, 0.8, 0.55],
    }}
    transition={{ duration: spec.duration, repeat: Infinity, ease: 'easeInOut', delay: spec.delay }}
  >
    <LeafSVG color={spec.color} size={spec.size} />
  </motion.div>
);

const BranchCluster: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg width="170" height="170" viewBox="0 0 170 170" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}>
    <path d="M4 4C46 22 78 54 96 100C106 126 102 148 96 164" stroke={C.greenDark} strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.55} />
    <path d="M30 14C50 30 64 46 74 64" stroke={C.greenDark} strokeWidth="2" fill="none" strokeLinecap="round" opacity={0.4} />
    {[
      { x: 18, y: 10, s: 22, r: -20 }, { x: 44, y: 26, s: 26, r: 10 }, { x: 66, y: 46, s: 20, r: -30 },
      { x: 84, y: 72, s: 24, r: 25 }, { x: 96, y: 100, s: 18, r: -10 }, { x: 56, y: 16, s: 16, r: 40 },
    ].map((l, i) => (
      <g key={i} transform={`translate(${l.x - l.s / 2}, ${l.y - (l.s * 1.45) / 2}) rotate(${l.r} ${l.s / 2} ${(l.s * 1.45) / 2}) scale(${l.s / 40})`}>
        <path d={LEAF_PATH} fill={LEAF_COLORS[i % LEAF_COLORS.length]} opacity={0.8} />
      </g>
    ))}
  </svg>
);

const SwayingBranch: React.FC<{ corner: 'tl' | 'tr'; }> = ({ corner }) => (
  <motion.div
    style={{
      position: 'fixed', top: '-22px', [corner === 'tl' ? 'left' : 'right']: '-24px',
      transformOrigin: corner === 'tl' ? 'top left' : 'top right', zIndex: 1, pointerEvents: 'none',
    }}
    animate={{ rotate: corner === 'tl' ? [-3, 3, -2, 3, -3] : [3, -3, 2, -3, 3] }}
    transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <BranchCluster flip={corner === 'tr'} />
  </motion.div>
);

const GlobalNatureDecor: React.FC = () => {
  const leaves = useMemo<LeafSpec[]>(() => {
    const positions: Array<[string, string]> = [
      ['6%', '4%'], ['14%', '9%'], ['22%', '3%'], ['4%', '16%'], ['30%', '6%'],
      ['8%', '88%'], ['16%', '93%'], ['26%', '85%'], ['38%', '92%'], ['48%', '87%'],
      ['62%', '5%'], ['70%', '91%'], ['80%', '7%'], ['86%', '90%'], ['52%', '95%'],
      ['58%', '2%'], ['92%', '20%'], ['2%', '55%'],
    ];
    return positions.map(([top, left], i) => ({
      id: i, top, left,
      size: 16 + (i % 4) * 6,
      color: LEAF_COLORS[i % LEAF_COLORS.length],
      duration: 7 + (i % 5) * 1.6,
      delay: (i % 6) * 0.5,
      drift: i % 2 === 0 ? 24 : -24,
      rotate: (i % 3) * 20 - 20,
    }));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }} aria-hidden="true">
      <SwayingBranch corner="tl" />
      <SwayingBranch corner="tr" />
      {leaves.map(spec => <FloatingLeaf key={spec.id} spec={spec} />)}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   HERO ILLUSTRATION — efek melayang + parallax kursor,
   supaya foto/ilustrasi terasa "hidup".
══════════════════════════════════════════════════════ */
const HeroIllustration: React.FC<{ src: string }> = ({ src }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x, y });
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ position: 'relative', perspective: '1200px' }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative' }}
      >
        <motion.div
          animate={{ rotateX: tilt.y * -6, rotateY: tilt.x * 8 }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          style={{ transformStyle: 'preserve-3d', borderRadius: '28px', overflow: 'hidden', position: 'relative', aspectRatio: '4/5', boxShadow: '0 30px 70px rgba(40,60,30,0.22)' }}
        >
          <img src={src} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 20%, rgba(255,255,255,0.18), transparent 60%)` }} />
        </motion.div>
      </motion.div>
      {/* lingkaran dekor di belakang foto */}
      <div style={{ position: 'absolute', top: '8%', right: '-8%', width: '70%', height: '70%', borderRadius: '50%', background: 'rgba(116,163,90,0.16)', zIndex: -1 }} />
    </div>
  );
};

/* ── Section heading kecil (kicker + judul + subjudul) ── */
const SectionHeading: React.FC<{ label: string; title: string; subtitle?: string }> = ({ label, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', marginBottom: '0.9rem' }}>
      <span style={kickerLineStyle} />
      <span style={{ fontFamily: 'var(--font-body)', color: C.green, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>🍃 {label}</span>
      <span style={kickerLineStyle} />
    </div>
    <h2 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: 'clamp(2rem, 5vw, 3.2rem)', margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ color: C.textMuted, maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.7 }}>{subtitle}</p>}
  </div>
);

const StatGrid: React.FC<{ stats: StatItem[] }> = ({ stats }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(stats ?? []).length}, 1fr)`, gap: '1.2rem' }} className="stat-grid">
    {(stats ?? []).map(s => (
      <div key={s.id} style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: C.green, lineHeight: 1 }}>{s.value}</div>
        <div style={{ color: C.textMuted, fontSize: '0.76rem', marginTop: '4px' }}>{s.label}</div>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════
   HOME — komponen utama
══════════════════════════════════════════════════════ */
const Home: React.FC = () => {
  const [home, setHome]           = useState<HomeData>(() => ls(LS_HOME, defaultHome));
  const [about, setAbout]         = useState<HomeAboutData>(() => ls(LS_HOME_ABOUT, defaultHomeAbout));
  const [expertise, setExpertise] = useState<ExpertiseCard[]>(() => ls(LS_EXPERTISE, defaultExpertise));
  const [skills, setSkills]       = useState<SkillItem[]>(() => ls(LS_SKILLS, defaultSkills));
  const [tools, setTools]         = useState<ToolItem[]>(() => ls(LS_TOOLS, defaultTools));
  const [values, setValues]       = useState<ValueItem[]>(() => ls(LS_VALUES, defaultValues));
  const [exps, setExps]           = useState<ExpItem[]>(() => ls(LS_EXPERIENCE, defaultExperience));
  const [certs, setCerts]         = useState<CertItem[]>(() => ls(LS_CERT, defaultCerts));
  const [projects, setProjects]   = useState<HomeProjectItem[]>(() => ls(LS_HOME_PROJECTS, defaultHomeProjects));
  const [edus, setEdus]           = useState<EduItem[]>(() => ls(LS_EDU, defaultEdus));
  const [contact, setContact]     = useState<ContactData>(() => ls(LS_CONTACT, defaultContact));

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  /* Sinkron real-time kalau Admin menyimpan perubahan */
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === LS_HOME) setHome(JSON.parse(e.newValue));
        if (e.key === LS_HOME_ABOUT) setAbout(JSON.parse(e.newValue));
        if (e.key === LS_EXPERTISE) setExpertise(JSON.parse(e.newValue));
        if (e.key === LS_SKILLS) setSkills(JSON.parse(e.newValue));
        if (e.key === LS_TOOLS) setTools(JSON.parse(e.newValue));
        if (e.key === LS_VALUES) setValues(JSON.parse(e.newValue));
        if (e.key === LS_EXPERIENCE) setExps(JSON.parse(e.newValue));
        if (e.key === LS_CERT) setCerts(JSON.parse(e.newValue));
        if (e.key === LS_HOME_PROJECTS) setProjects(JSON.parse(e.newValue));
        if (e.key === LS_EDU) setEdus(JSON.parse(e.newValue));
        if (e.key === LS_CONTACT) setContact(JSON.parse(e.newValue));
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const filteredProjects = activeCategory === 'Semua' ? projects : projects.filter(p => p.category === activeCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Mohon isi nama, email, dan pesan terlebih dahulu.');
      return;
    }
    const body = `Dari: ${form.name} (${form.email})%0D%0A%0D%0A${form.message}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(form.subject || 'Pesan dari Website')}&body=${body}`;
    toast.success('Membuka aplikasi email kamu...');
  };

  return (
    <div style={{ background: C.bg, position: 'relative', overflow: 'hidden' }}>
      <GlobalNatureDecor />

      {/* ── Sub-nav anchor (di bawah Navbar utama) ── */}
      <div style={{
        position: 'sticky', top: '70px', zIndex: 50, background: 'rgba(251,250,244,0.92)',
        backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}`,
      }}>
        <div className="home-subnav" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0.7rem 1.5rem', display: 'flex', gap: '0.4rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {[
            ['Home', '#home'], ['About', '#about'], ['Expertise', '#expertise'], ['Skills', '#skills'],
            ['Experience', '#experience'], ['Certification', '#certification'], ['Projects', '#projects'],
            ['Education', '#education'], ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a key={href} href={href} style={{
              color: C.greenDark, textDecoration: 'none', fontFamily: 'var(--font-body)',
              fontWeight: 600, fontSize: '0.82rem', padding: '6px 14px', borderRadius: '20px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.bgSoft)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section id="home" style={{ position: 'relative', zIndex: 2, padding: '4.5rem 2rem 3.5rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="home-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <AnimatedSection direction="left">
              <div style={{ color: C.green, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>
                {home.kicker} 🍃
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: 'clamp(2.6rem, 7vw, 5rem)', lineHeight: 1, marginBottom: '1.1rem' }}>
                {home.heroTitle}
              </h1>
              <div style={{ color: C.green, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                {home.heroSubtitle}
              </div>
              <p style={{ color: C.text, lineHeight: 1.85, fontSize: '1.02rem', marginBottom: '2.2rem', maxWidth: '520px' }}>
                {home.heroTagline}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.6rem' }}>
                <a href={home.heroCtaLink} style={primaryBtnStyle}>👤 {home.heroCta} →</a>
                {home.heroCta2Link && (
                  <a href={home.heroCta2Link} target="_blank" rel="noopener noreferrer" style={secondaryBtnStyle}>⬇ {home.heroCta2}</a>
                )}
              </div>
            </AnimatedSection>
            <AnimatedSection direction="up" delay={0.2}>
              <div style={{ ...cardStyle, padding: '1.5rem 1.7rem' }}>
                <StatGrid stats={home.stats} />
              </div>
            </AnimatedSection>
          </div>
          <AnimatedSection direction="right">
            <HeroIllustration src={home.heroPhotoUrl || FALLBACK_HERO_PHOTO} />
          </AnimatedSection>
        </div>
      </section>

      {/* ══ ABOUT ME ══ */}
      <section id="about" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="home-about-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: '3.5rem', alignItems: 'center' }}>
          <AnimatedSection direction="left">
            <div className="about-photo-wrap" style={{ position: 'relative' }}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 24px 60px rgba(40,60,30,0.18)' }}>
                <img src={about.photoUrl || FALLBACK_ABOUT_PHOTO} alt={about.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {about.badgeText && (
                <div style={{
                  position: 'absolute', bottom: '-1.2rem', left: '1.2rem', right: '1.2rem',
                  background: '#fff', borderRadius: '14px', padding: '0.9rem 1.1rem',
                  boxShadow: '0 12px 30px rgba(40,60,30,0.16)', display: 'flex', gap: '0.7rem', alignItems: 'flex-start',
                  border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: '1.1rem' }}>🍃</span>
                  <span style={{ color: C.text, fontSize: '0.85rem', lineHeight: 1.5 }}>{about.badgeText}</span>
                </div>
              )}
              <div style={{ position: 'absolute', top: '-10%', left: '-12%', width: '55%', height: '55%', borderRadius: '50%', background: 'rgba(116,163,90,0.14)', zIndex: -1 }} />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.9rem' }}>
              <span style={kickerLineStyle} />
              <span style={{ fontFamily: 'var(--font-body)', color: C.green, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>🍃 About Me</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '0.6rem' }}>Tentang Saya</h2>
            <p style={{ color: C.green, fontWeight: 600, marginBottom: '1.3rem', fontSize: '1.02rem' }}>{about.subtitle}</p>
            <p style={{ color: C.text, lineHeight: 1.85, marginBottom: '1rem', fontSize: '1rem' }}>{renderBold(about.bio1)}</p>
            <p style={{ color: C.text, lineHeight: 1.85, marginBottom: '1.6rem', fontSize: '1rem' }}>{renderBold(about.bio2)}</p>

            <div style={{ ...cardStyle, padding: '1.4rem 1.6rem', marginBottom: '1.6rem' }}>
              <StatGrid stats={about.stats} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem' }}>
              {[
                ['📍', 'Lokasi', about.location],
                ['📧', 'Email', about.email],
                ['📞', 'Telepon', about.phone],
                ['💼', 'LinkedIn', about.linkedinLabel, about.linkedinUrl],
                ['🐙', 'GitHub', about.githubLabel, about.githubUrl],
              ].filter(row => row[2]).map(([icon, label, value, url], i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.05rem' }}>{icon}</span>
                  <div>
                    <div style={{ color: C.textMuted, fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: C.ink, fontSize: '0.88rem', textDecoration: 'none' }}>{value}</a>
                    ) : (
                      <div style={{ color: C.ink, fontSize: '0.88rem' }}>{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {about.closingQuote && (
          <AnimatedSection direction="up">
            <div style={{ ...cardStyle, marginTop: '3.5rem', padding: '1.5rem 2rem', textAlign: 'center', maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>
              <span style={{ color: C.green, fontSize: '1.4rem' }}>“</span>
              <span style={{ color: C.text, fontStyle: 'italic', lineHeight: 1.7 }}> {about.closingQuote} </span>
              <span style={{ color: C.green, fontSize: '1.4rem' }}>🍃</span>
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* ══ KEAHLIAN & KOMPETENSI (EXPERTISE) ══ */}
      <section id="expertise" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', background: C.bgAlt }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <SectionHeading label="Expertise" title="Keahlian & Kompetensi"
              subtitle="Kombinasi keahlian di bidang SDM, Teknologi, dan Administrasi Operasional untuk mendukung pertumbuhan organisasi." />
          </AnimatedSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.6rem' }}>
            {expertise.map((card, i) => (
              <AnimatedSection key={card.id} direction="up" delay={i * 0.12}>
                <div style={{ ...cardStyle, padding: '2.2rem' }}>
                  <div style={{
                    width: '58px', height: '58px', borderRadius: '50%', background: C.bgSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem',
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.3rem', marginBottom: '1rem' }}>{card.title}</h3>
                  <div style={{ height: '2px', width: '32px', background: C.green, marginBottom: '1rem' }} />
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: 0, padding: 0 }}>
                    {splitList(card.items).map(item => (
                      <li key={item} style={{ display: 'flex', gap: '0.6rem', color: C.text, fontSize: '0.88rem', lineHeight: 1.5 }}>
                        <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS & EXPERTISE (8 kartu) + TOOLS + VALUES ══ */}
      <section id="skills" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', maxWidth: '1300px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <SectionHeading label="Skills" title="Skills & Expertise"
            subtitle="Keterampilan yang saya miliki merupakan hasil dari pembelajaran berkelanjutan dan pengalaman praktik di berbagai bidang profesional." />
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.4rem', marginBottom: '2.5rem' }}>
          {skills.map((s, i) => (
            <AnimatedSection key={s.id} direction="up" delay={i * 0.07}>
              <div style={{ ...cardStyle, padding: '1.7rem' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%', background: C.bgSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem',
                }}>
                  {s.icon}
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{s.title}</h4>
                <p style={{ color: C.textMuted, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection direction="up">
          <div style={{ ...cardStyle, background: C.bgSoft, border: 'none', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="tools-values-grid">
            <div>
              <h4 style={{ fontFamily: 'var(--font-body)', color: C.greenDark, fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.5px', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⭐ Kompetensi Inti
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.4rem' }}>
                {values.map(v => (
                  <div key={v.id} style={{ textAlign: 'center', width: '74px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.4rem' }}>{v.icon}</div>
                    <div style={{ color: C.text, fontSize: '0.74rem' }}>{v.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-body)', color: C.greenDark, fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.5px', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🖥️ Tools & Technologies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.4rem' }}>
                {tools.map(t => (
                  <div key={t.id} style={{ textAlign: 'center', width: '74px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.4rem' }}>{t.icon}</div>
                    <div style={{ color: C.text, fontSize: '0.74rem' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ══ PENGALAMAN KERJA (EXPERIENCE) ══ */}
      <section id="experience" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', background: C.bgAlt }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <SectionHeading label="Experience" title="Perjalanan Profesional"
              subtitle="Setiap pengalaman adalah langkah menuju pertumbuhan dan kontribusi yang lebih besar." />
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            {exps.map((exp, i) => (
              <AnimatedSection key={exp.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div style={{ ...cardStyle, padding: '1.8rem 2rem', display: 'grid', gridTemplateColumns: exp.imageUrl ? '1fr 200px' : '1fr', gap: '1.6rem', alignItems: 'center' }} className="exp-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{exp.icon}</div>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.2rem', margin: 0 }}>{i + 1}. {exp.position}</h3>
                        <div style={{ color: C.textMuted, fontSize: '0.82rem' }}>{exp.company} • {exp.period}</div>
                      </div>
                    </div>
                    <div className="exp-tags-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                      {splitList(exp.tags).map(tag => (
                        <div key={tag} style={{ display: 'flex', gap: '0.5rem', color: C.text, fontSize: '0.84rem' }}>
                          <span style={{ color: C.green }}>✓</span>{tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  {exp.imageUrl && (
                    <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '4/3' }}>
                      <img src={exp.imageUrl} alt={exp.position} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection direction="up">
            <div style={{ ...cardStyle, marginTop: '2.5rem', padding: '1.4rem 2rem', textAlign: 'center' }}>
              <span style={{ color: C.text, fontStyle: 'italic' }}>“Pengalaman bukan hanya tentang bekerja, tetapi tentang memberi nilai dan membuat perbedaan.”</span> <span>🍃</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══ PROFESSIONAL CERTIFICATION ══ */}
      <section id="certification" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <SectionHeading label="Certification" title="Professional Certification"
            subtitle="Sertifikasi profesional yang saya miliki sebagai bukti kompetensi dan komitmen dalam pengembangan diri secara berkelanjutan." />
        </AnimatedSection>

        {certs.map((cert, i) => (
          <AnimatedSection key={cert.id} direction="up" delay={i * 0.1}>
            <div style={{ ...cardStyle, padding: '2.2rem', marginBottom: '1.4rem', display: 'grid', gridTemplateColumns: '160px 1fr', gap: '2rem', alignItems: 'center' }} className="cert-card">
              <div style={{
                width: '140px', height: '140px', borderRadius: '50%', background: C.bgSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto',
              }}>
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '3rem' }}>🏅</span>
                )}
              </div>
              <div>
                <span style={{ background: C.bgSoft, color: C.greenDark, borderRadius: '6px', padding: '4px 12px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Sertifikasi</span>
                <h3 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.6rem', margin: '0.8rem 0 0.4rem' }}>{cert.title}</h3>
                <p style={{ color: C.textMuted, marginBottom: '1rem' }}>{cert.issuer}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {splitList(cert.items).map(item => (
                    <span key={item} style={{ background: C.bgSoft, color: C.greenDark, borderRadius: '20px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 600 }}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.4rem', marginTop: '1.5rem' }}>
          {[
            ['🏆', 'Kompetensi Teruji', 'Dinyatakan kompeten oleh asesor profesional BNSP'],
            ['🛡️', 'Standar Nasional', 'Sesuai dengan standar kompetensi kerja nasional'],
            ['📈', 'Pengembangan Berkelanjutan', 'Terus belajar dan meningkatkan kompetensi secara konsisten'],
            ['💼', 'Profesional & Terpercaya', 'Komitmen untuk memberikan kinerja terbaik'],
          ].map(([icon, title, desc], i) => (
            <AnimatedSection key={title} direction="up" delay={i * 0.08}>
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.7rem' }}>{icon}</div>
                <div style={{ color: C.ink, fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>{title}</div>
                <div style={{ color: C.textMuted, fontSize: '0.78rem', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ══ PROJECTS & CONTRIBUTIONS ══ */}
      <section id="projects" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', background: C.bgAlt }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <AnimatedSection direction="up">
            <SectionHeading label="Projects" title="Projects & Contributions"
              subtitle="Beberapa proyek dan kontribusi yang telah saya lakukan sebagai bentuk dedikasi dalam mendukung efisiensi, efektivitas, dan kemajuan organisasi." />
          </AnimatedSection>

          <AnimatedSection direction="up">
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
              {['Semua', ...HOME_PROJECT_CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  background: activeCategory === cat ? C.greenDark : '#fff',
                  color: activeCategory === cat ? '#fff' : C.text,
                  border: `1px solid ${activeCategory === cat ? C.greenDark : C.border}`,
                  borderRadius: '24px', padding: '8px 18px', fontFamily: 'var(--font-body)',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.4rem' }}>
            {filteredProjects.map((p, i) => (
              <AnimatedSection key={p.id} direction="up" delay={(i % 4) * 0.08}>
                <div style={{ ...cardStyle, padding: '1.8rem' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>{p.icon}</div>
                  <h4 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{p.title}</h4>
                  <p style={{ color: C.textMuted, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.9rem' }}>{p.desc}</p>
                  <span style={{ color: C.green, fontSize: '0.78rem', fontWeight: 700 }}>🏷️ {p.category}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: C.textMuted }}>Belum ada proyek di kategori ini.</div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/portofolio" style={{ ...secondaryBtnStyle, textDecoration: 'none' }}>Lihat Semua Portofolio →</Link>
          </div>
        </div>
      </section>

      {/* ══ EDUCATION & LEARNING ══ */}
      <section id="education" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up">
          <SectionHeading label="Education" title="Education & Learning"
            subtitle="Perjalanan akademik yang membentuk fondasi pengetahuan, keterampilan, dan pola pikir profesional." />
        </AnimatedSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '720px', margin: '0 auto 3rem' }}>
          {edus.map((edu, i) => (
            <AnimatedSection key={edu.id} direction="left" delay={i * 0.1}>
              <div style={{ ...cardStyle, padding: '1.4rem 1.7rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{edu.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: C.greenDark, color: '#fff', borderRadius: '6px', padding: '2px 10px', fontSize: '0.74rem', fontWeight: 700 }}>{edu.year}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.05rem', margin: 0 }}>{edu.school}</h4>
                  </div>
                  {edu.major && <div style={{ color: C.text, fontSize: '0.88rem', marginTop: '0.3rem' }}>{edu.major}</div>}
                  {edu.location && <div style={{ color: C.textMuted, fontSize: '0.8rem', marginTop: '0.2rem' }}>📍 {edu.location}</div>}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection direction="up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.4rem' }}>
            {[
              ['📚', 'Self Development', 'Membaca buku, jurnal, dan artikel profesional.'],
              ['🖥️', 'Online Courses', 'Mengikuti pelatihan dan sertifikasi untuk meningkatkan kompetensi.'],
              ['🤝', 'Knowledge Sharing', 'Berbagi pengalaman dan pembelajaran dengan rekan kerja maupun komunitas.'],
              ['🎯', 'Stay Updated', 'Mengikuti perkembangan teknologi, HR, administrasi, dan dunia industri.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ textAlign: 'center', padding: '0.5rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.7rem' }}>{icon}</div>
                <div style={{ color: C.ink, fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>{title}</div>
                <div style={{ color: C.textMuted, fontSize: '0.78rem', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem 6rem', background: C.bgAlt }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="home-contact-grid" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '3rem', alignItems: 'start' }}>
            <AnimatedSection direction="left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.9rem' }}>
                <span style={kickerLineStyle} />
                <span style={{ fontFamily: 'var(--font-body)', color: C.green, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>🍃 Contact</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', lineHeight: 1.05, marginBottom: '1.2rem' }}>
                Let's Build Something Together
              </h2>
              <p style={{ color: C.text, lineHeight: 1.8, marginBottom: '2rem', maxWidth: '440px' }}>
                Saya terbuka untuk peluang kolaborasi, proyek baru, atau sekadar berdiskusi mengenai ide dan solusi terbaik untuk organisasi Anda.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '2rem' }}>
                {[
                  ['📧', 'Email', contact.showEmail ? contact.email : '', `mailto:${contact.email}`],
                  ['📞', 'Phone', contact.phone, `tel:${contact.phone.replace(/\s/g, '')}`],
                  ['📍', 'Location', contact.location, ''],
                  ['💼', 'LinkedIn', contact.showLinkedin ? contact.linkedin : '', `https://linkedin.com/in/${contact.linkedin}`],
                ].filter(row => row[2]).map(([icon, label, value, href], i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ color: C.textMuted, fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: C.ink, fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>{value}</a>
                      ) : (
                        <div style={{ color: C.ink, fontWeight: 600, fontSize: '0.95rem' }}>{value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...cardStyle, padding: '1.2rem 1.4rem', display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem' }}>🍃</span>
                <span style={{ color: C.text, fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Mari ciptakan dampak positif bersama melalui kolaborasi dan solusi yang tepat.
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <form onSubmit={handleContactSubmit} style={{ ...cardStyle, padding: '2.2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: C.ink, fontSize: '1.3rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  ✈️ Send Me a Message
                </h3>
                <p style={{ color: C.textMuted, fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Isi formulir di bawah ini dan saya akan segera menghubungi Anda kembali.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="contact-form-grid">
                  {(['name', 'email'] as const).map(field => (
                    <div key={field}>
                      <label style={{ display: 'block', color: C.ink, fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                        {field === 'name' ? '👤 Your Name' : '📧 Email Address'}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        placeholder={field === 'name' ? 'Masukkan nama Anda' : 'Masukkan email Anda'}
                        style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: C.ink, fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.4rem' }}>📝 Subject</label>
                  <input
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Tuliskan topik pesan Anda"
                    style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '1.4rem' }}>
                  <label style={{ display: 'block', color: C.ink, fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.4rem' }}>✏️ Your Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tulis pesan Anda di sini..."
                    rows={5}
                    style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...primaryBtnStyle, border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                  ✈️ Send Message →
                </motion.button>
                <p style={{ color: C.textMuted, fontSize: '0.72rem', marginTop: '0.8rem', textAlign: 'center' }}>
                  *Tombol ini akan membuka aplikasi email kamu (belum terhubung ke server pengiriman otomatis).
                </p>
              </form>
            </AnimatedSection>
          </div>

          <AnimatedSection direction="up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginTop: '3rem', background: '#fff', borderRadius: '20px', padding: '1.8rem', border: `1px solid ${C.border}` }}>
              {[
                ['⚡', 'Fast Response', 'Saya akan merespons pesan Anda secepat mungkin.'],
                ['🛡️', 'Professional', 'Komitmen penuh dalam setiap kolaborasi dan proyek.'],
                ['🤝', 'Collaborative', 'Terbuka untuk ide, diskusi, dan peluang baru.'],
                ['🎯', 'Result Oriented', 'Berfokus pada solusi yang memberikan hasil terbaik.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: C.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ color: C.ink, fontWeight: 700, fontSize: '0.86rem', marginBottom: '0.2rem' }}>{title}</div>
                    <div style={{ color: C.textMuted, fontSize: '0.76rem', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        /* ── Sembunyikan scrollbar sub-nav ── */
        .home-subnav { -ms-overflow-style: none; scrollbar-width: none; }
        .home-subnav::-webkit-scrollbar { display: none; }

        /* ════════════════════════════════════
           TABLET LANDSCAPE  (≤ 1024 px)
        ════════════════════════════════════ */
        @media (max-width: 1024px) {
          .home-hero-grid   { gap: 2.5rem !important; }
          .home-about-grid  { gap: 2.5rem !important; }
          .home-contact-grid { gap: 2rem !important; }
        }

        /* ════════════════════════════════════
           TABLET PORTRAIT  (≤ 900 px)
        ════════════════════════════════════ */
        @media (max-width: 900px) {
          /* Collapse semua multi-column grid */
          .home-hero-grid, .home-about-grid, .home-contact-grid,
          .tools-values-grid, .exp-card, .cert-card {
            grid-template-columns: 1fr !important;
          }
          .home-hero-grid   { gap: 2.5rem !important; }
          .home-about-grid  { gap: 0 !important; }
          .home-contact-grid { gap: 2.5rem !important; }
          .cert-card > div:first-child { margin-bottom: 1.5rem !important; }

          /* Space untuk badge yang menggantung di bawah foto */
          .about-photo-wrap { padding-bottom: 2.5rem !important; }

          /* Section padding dikurangi */
          #home            { padding: 3.5rem 1.5rem 2.5rem !important; }
          #about, #expertise, #skills, #experience,
          #certification, #projects, #education { padding: 3.5rem 1.5rem !important; }
          #contact         { padding: 3.5rem 1.5rem 4rem !important; }

          /* Experience card inner */
          .exp-card { padding: 1.4rem 1.2rem !important; }

          /* Cert card */
          .cert-card { padding: 1.6rem !important; text-align: center !important; }
          .cert-card > div:last-child { text-align: left !important; }
        }

        /* ════════════════════════════════════
           LARGE PHONE  (≤ 640 px)
        ════════════════════════════════════ */
        @media (max-width: 640px) {
          .stat-grid         { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
          .exp-tags-grid     { grid-template-columns: 1fr 1fr !important; gap: 0.4rem !important; }

          #home            { padding: 3rem 1.2rem 2rem !important; }
          #about, #expertise, #skills, #experience,
          #certification, #projects, #education { padding: 3rem 1.2rem !important; }
          #contact         { padding: 3rem 1.2rem 3.5rem !important; }

          /* Sub-nav tombol lebih kecil */
          .home-subnav a   { padding: 5px 10px !important; font-size: 0.78rem !important; }

          /* Tools & values agar tidak terlalu lebar */
          .tools-values-grid { padding: 1.4rem !important; gap: 1.4rem !important; }
        }

        /* ════════════════════════════════════
           SMALL PHONE  (≤ 420 px)
        ════════════════════════════════════ */
        @media (max-width: 420px) {
          .exp-tags-grid     { grid-template-columns: 1fr !important; }

          #home            { padding: 2.5rem 1rem 1.8rem !important; }
          #about, #expertise, #skills, #experience,
          #certification, #projects, #education { padding: 2.5rem 1rem !important; }
          #contact         { padding: 2.5rem 1rem 3rem !important; }

          /* Stat grid tetap 2 kolom tapi lebih ketat */
          .stat-grid         { gap: 0.7rem !important; }

          /* About photo badge tidak overflow */
          .about-photo-wrap  { padding-bottom: 3rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
