// src/pages/AdminPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CERT_TEMPLATE_BNSP, CERT_TEMPLATE_REFERENSI, CERT_TEMPLATE_IT } from '../utils/CertTemplates';

/* ─── LocalStorage Keys ─── */
const LS_ABOUT        = 'hk_about_data';
const LS_ABOUT_PHOTO  = 'hk_about_photo';
const LS_EDU          = 'hk_edu_data';
const LS_CERT         = 'hk_cert_data';
const LS_HOME         = 'hk_home_data';
const LS_HOME_ABOUT   = 'hk_home_about_data';   // About Me section di Home
const LS_SKILLS       = 'hk_skills_data';        // Skills & Tools
const LS_EXPERIENCE   = 'hk_experience_data';    // Pengalaman Kerja
const LS_CONTACT      = 'hk_contact_data';
const LS_PORTFOLIO    = 'hk_portfolio_data';
const LS_EXPERTISE    = 'hk_expertise_data';      // Keahlian & Kompetensi (Home)
const LS_TOOLS        = 'hk_tools_data';          // Tools & Technologies (Home)
const LS_VALUES       = 'hk_values_data';         // Kompetensi Inti (Home)
const LS_HOME_PROJECTS = 'hk_home_projects_data'; // Projects & Contributions (Home)

/* ─── Types ─── */
interface StatItem { id: string; value: string; label: string; }

interface HomeData {
  kicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroCta: string;
  heroCtaLink: string;
  heroCta2: string;
  heroCta2Link: string;
  heroPhotoUrl: string;
  stats: StatItem[];
}
// About Me section yang muncul di halaman Home
interface HomeAboutData {
  name: string;
  location: string;
  subtitle: string;
  bio1: string;
  bio2: string;
  photoUrl: string;
  badgeText: string;
  closingQuote: string;
  email: string;
  phone: string;
  linkedinLabel: string;
  linkedinUrl: string;
  githubLabel: string;
  githubUrl: string;
  stats: StatItem[];
}
interface AboutData { name: string; location: string; bio1: string; bio2: string; }
interface EduItem   { id: string; school: string; year: string; major: string; location: string; score: string; icon: string; }
interface CertItem  { id: string; title: string; issuer: string; items: string; imageUrl: string; showBadge?: boolean; }

// Skills & Tools (kartu "Skills & Expertise" di Home)
interface SkillItem {
  id: string;
  icon: string;    // emoji
  title: string;
  desc: string;
}
// Pengalaman Kerja
interface ExpItem {
  id: string;
  position: string;   // HR / GENERAL AFFAIRS
  company: string;    // UD Duta Pangan
  period: string;     // 2020 – 2023
  icon: string;       // emoji
  tags: string;       // koma-separated
  imageUrl: string;   // ilustrasi/foto untuk timeline
}
// Keahlian & Kompetensi (3 kartu Expertise di Home)
interface ExpertiseCard {
  id: string;
  icon: string;
  title: string;
  items: string; // koma-separated
}
// Tools & Technologies / Kompetensi Inti
interface ToolItem { id: string; icon: string; label: string; }
interface ValueItem { id: string; icon: string; label: string; }
// Projects & Contributions di Home
interface HomeProjectItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  category: string;
}

interface ContactData {
  whatsapp: string; instagram: string; linkedin: string;
  tiktok: string;   website: string;  email: string;
  phone: string;    location: string;
  showWhatsapp: boolean; showInstagram: boolean; showLinkedin: boolean;
  showTiktok: boolean;   showWebsite: boolean;   showEmail: boolean;
}
interface PortfolioItem {
  id: string; title: string; description: string; category: string;
  imageUrl: string; tags: string; year: string; client: string; featured: boolean;
}

/* ─── Defaults ─── */
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
const defaultAbout: AboutData = {
  name: 'Mahfudfebry', location: 'Nganjuk, Jawa Timur — Indonesia',
  bio1: 'Saya adalah seorang profesional muda yang berdedikasi dari Nganjuk, Indonesia.',
  bio2: 'Di sepanjang perjalanan karier saya, saya telah mengerjakan berbagai bidang.',
};
const defaultEdus: EduItem[] = [
  { id: '1', school: 'SMAN 3 Nganjuk', year: '2018', major: 'Ilmu Pengetahuan Sosial (IPS)', location: 'Nganjuk, Jawa Timur', score: 'Avg Value: 88', icon: '🏫' },
  { id: '2', school: 'Institut Teknologi dan Bisnis ASIA', year: '2026', major: 'S1 – Teknik Informatika', location: 'Kota Malang', score: 'IPK 3.38', icon: '🎓' },
];
const defaultCerts: CertItem[] = [
  { id: '1', title: 'Certified Human Resource Officer (CHRO)', issuer: 'BNSP', items: 'Analisa Beban Kerja,Menyusun Uraian Jabatan,Payroll & BPJS', imageUrl: CERT_TEMPLATE_BNSP, showBadge: true },
  { id: '2', title: 'Surat Keterangan Kerja', issuer: 'UD Duta Pangan', items: 'Vendor Management,Stock Monitoring,Facility Maintenance', imageUrl: CERT_TEMPLATE_REFERENSI, showBadge: false },
  { id: '3', title: 'IT Support Specialist', issuer: 'Lembaga Sertifikasi Kompetensi TI', items: 'Hardware Troubleshooting,Network Configuration,IT Incident Management', imageUrl: CERT_TEMPLATE_IT, showBadge: false },
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
const defaultExperience: ExpItem[] = [
  { id: '1', position: 'Administrasi Produksi', company: 'UD Duta Pangan', period: 'Jul 2024 – Des 2024', icon: '🏭', tags: 'Administrasi Produksi Pabrik,Monitoring Bahan Baku,Monitoring Hasil Produksi,Penyusunan Laporan Produksi,Pengendalian Dokumen,Manajemen FIFO (First in - First Out)', imageUrl: '' },
  { id: '2', position: 'IT Support', company: 'UD Duta Pangan', period: 'Jan 2025 – Agu 2025', icon: '💻', tags: 'Menangani 30+ perangkat komputer,Troubleshooting Hardware,Troubleshooting Software,Konfigurasi LAN & WiFi,Penanganan Insiden IT,Pemeliharaan Jaringan', imageUrl: '' },
  { id: '3', position: 'Staff HRD & General Affairs', company: 'UD Duta Pangan', period: 'Agu 2025 – Sekarang', icon: '👥', tags: 'Payroll (Gaji, Potongan, Bonus),BPJS Kesehatan,BPJS Ketenagakerjaan,Analisa Beban Kerja,Job Description,Asset Management,Vendor Management,Laporan Harian/Mingguan/Bulanan', imageUrl: '' },
];
const defaultExpertise: ExpertiseCard[] = [
  { id: '1', icon: '👥', title: 'HR General Affairs', items: 'Analisa Beban Kerja,Penyusunan Uraian Jabatan (Jobdesk),Administrasi BPJS Kesehatan & Ketenagakerjaan,Kebijakan MSDM,Penghitungan Gaji Nett/Gross Up,Hubungan Relasi Industri,Koordinasi Operasional,Budget Monitoring,Asset Management,Vendor Management' },
  { id: '2', icon: '💻', title: 'IT Support', items: 'Troubleshooting Hardware & Software,Konfigurasi LAN / WIFI,Pemeliharaan Jaringan,Dukungan Pengguna (User Support),Penanganan Insiden TI,Inventarisasi Perangkat TI' },
  { id: '3', icon: '📋', title: 'Administrasi Produksi', items: 'Administrasi Produksi Pabrik,Monitoring Bahan Baku,Monitoring Hasil Produksi,Penyusunan Laporan Produksi,Pengendalian Dokumen,Manajemen FIFO (First in - First Out)' },
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
const HOME_PROJECT_CATEGORIES = ['Administrasi', 'IT Support', 'Sistem & Network', 'Analisis & Laporan', 'General Affairs'];
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
const defaultContact: ContactData = {
  whatsapp: '6281234567890', instagram: 'mahfudfebry', linkedin: 'mahfudfebry',
  tiktok: 'mahfudfebry',    website: 'https://hikimori-project.com', email: 'mahfudfebry@hikimori.web.id',
  phone: '+62 895-1234-5678', location: 'Jakarta, Indonesia',
  showWhatsapp: true, showInstagram: true, showLinkedin: true,
  showTiktok: false,  showWebsite: true,  showEmail: true,
};

/* ─── Cloudinary Config ─── */
const CLOUDINARY_CLOUD  = 'dl4pyan8v';
const CLOUDINARY_PRESET = 'clouds_hikimori';

const uploadToCloudinary = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: fd }
  );
  if (!res.ok) throw new Error('Upload gagal');
  const json = await res.json();
  return json.secure_url as string;
};

/* ─── Helper ─── */
const ls = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};
const save = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(value) }));
};

/* ─── Sidebar Menu Items ─── */
const MENUS = [
  { id: 'home',       label: 'Setting Home',       icon: '🏠' },
  { id: 'about',      label: 'Setting About',      icon: '👤' },
  { id: 'portfolio',  label: 'Setting Portfolio',  icon: '🗂️' },
  { id: 'contact',    label: 'Contact Us',         icon: '📲' },
];

/* ══════════════════════════════════════════════════════
   SUB-PANEL: SETTING HOME
   Berisi: Hero + About Me di Home + Skills & Tools + Pengalaman Kerja
══════════════════════════════════════════════════════ */
const SettingHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero'|'homeabout'|'expertise'|'skills'|'tools'|'experience'|'projects'>('hero');

  const tabs: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: 'hero',       label: 'Hero Section',         icon: '✨' },
    { id: 'homeabout',  label: 'About Me (Home)',       icon: '👤' },
    { id: 'expertise',  label: 'Keahlian & Kompetensi', icon: '🧩' },
    { id: 'skills',     label: 'Skills & Expertise',    icon: '🛠️' },
    { id: 'tools',      label: 'Tools & Kompetensi Inti', icon: '🧰' },
    { id: 'experience', label: 'Pengalaman Kerja',      icon: '💼' },
    { id: 'projects',   label: 'Projects & Contributions', icon: '🗂️' },
  ];

  return (
    <div>
      <SectionTitle icon="🏠" title="Setting Home" desc="Kelola semua section di halaman utama website" />

      {/* Tab Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontFamily: 'var(--font-body)',
              fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', border: '1px solid',
              transition: 'all 0.2s',
              background: activeTab === t.id ? 'var(--amber)' : 'transparent',
              color: activeTab === t.id ? 'var(--black)' : 'var(--white-dim)',
              borderColor: activeTab === t.id ? 'var(--amber)' : 'rgba(255,255,255,0.12)',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'hero'       && <HeroForm />}
          {activeTab === 'homeabout'  && <HomeAboutForm />}
          {activeTab === 'expertise'  && <ExpertiseForm />}
          {activeTab === 'skills'     && <SkillsForm />}
          {activeTab === 'tools'      && <ToolsValuesForm />}
          {activeTab === 'experience' && <ExperienceForm />}
          {activeTab === 'projects'   && <HomeProjectsForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ── Shared: Stats List Editor (4 angka statistik) ── */
const StatsEditor: React.FC<{ stats: StatItem[]; onChange: (next: StatItem[]) => void }> = ({ stats, onChange }) => {
  const update = (id: string, key: keyof StatItem, val: string) =>
    onChange(stats.map(s => s.id === id ? { ...s, [key]: val } : s));
  const add = () => onChange([...stats, { id: Date.now().toString(), value: '', label: '' }]);
  const remove = (id: string) => onChange(stats.filter(s => s.id !== id));

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={labelStyle}>Statistik (angka pencapaian)</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.7rem', marginBottom: '0.6rem' }}>
        {stats.map(s => (
          <div key={s.id} style={{ ...cardBoxStyle, padding: '0.9rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem' }}>
              <button onClick={() => remove(s.id)} style={deleteBtnStyle}>✕</button>
            </div>
            <input style={{ ...inputStyle, marginBottom: '0.5rem' }} value={s.value} placeholder="3+"
              onChange={e => update(s.id, 'value', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            <input style={inputStyle} value={s.label} placeholder="Posisi Profesional"
              onChange={e => update(s.id, 'label', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
        ))}
      </div>
      <button onClick={add} style={{ ...addBtnStyle, marginBottom: '0.4rem' }}>+ Tambah Statistik</button>
    </div>
  );
};

/* ── Hero Form ── */
const HeroForm: React.FC = () => {
  const [data, setData]       = useState<HomeData>(() => ls(LS_HOME, defaultHome));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const field = (label: string, key: keyof HomeData, ph = '') => (
    <div style={{ marginBottom: '1.2rem' }}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={data[key] as string} placeholder={ph}
        onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
        onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
    </div>
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const tid = toast.loading('Mengupload foto ke Cloudinary...');
    try {
      const url = await uploadToCloudinary(f);
      setData(d => ({ ...d, heroPhotoUrl: url }));
      toast.success('Foto berhasil diupload!', { id: tid });
    } catch {
      toast.error('Gagal upload foto. Coba lagi.', { id: tid });
    } finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <div>
      <SubTitle>Hero Utama</SubTitle>
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: 'var(--white-dim)' }}>
        💡 Catatan: foto hero saat ini masih placeholder bergaya ilustrasi. Upload fotomu sendiri di sini kapan saja — efek "melayang" di Hero otomatis menyesuaikan foto baru.
      </div>
      {field('Kicker (teks kecil di atas judul)', 'kicker', 'Welcome To My Journey')}
      {field('Nama Besar (Hero Title)', 'heroTitle', 'MAHFUDFEBRY')}
      {field('Tagline Profesi', 'heroSubtitle', 'HR General Affairs  •  IT Support  •  Administrative Specialist')}
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={labelStyle}>Paragraf Deskripsi</label>
        <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={data.heroTagline}
          onChange={e => setData(d => ({ ...d, heroTagline: e.target.value }))}
          onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {field('Teks Tombol CTA Utama', 'heroCta', 'Hubungi Saya')}
        {field('Link Tombol CTA Utama', 'heroCtaLink', '#contact')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {field('Teks Tombol CTA Kedua', 'heroCta2', 'Download CV')}
        {field('Link File CV (PDF)', 'heroCta2Link', 'https://...')}
      </div>
      <StatsEditor stats={data.stats} onChange={next => setData(d => ({ ...d, stats: next }))} />
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={labelStyle}>Foto Hero</label>
        {data.heroPhotoUrl && (
          <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
            <img src={data.heroPhotoUrl} alt="Hero" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px' }} />
            <button onClick={() => setData(d => ({ ...d, heroPhotoUrl: '' }))} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>✕ Hapus</button>
          </div>
        )}
        <div onClick={() => !uploading && fileRef.current?.click()}
          style={{ ...uploadBoxStyle, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
          {uploading ? '⏳ Mengupload ke Cloudinary...' : '📷 Klik untuk upload foto hero'}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
      </div>
      <SaveButton onClick={() => { save(LS_HOME, data); toast.success('Hero section disimpan!'); }} />
    </div>
  );
};

/* ── Home About Me Form ── */
const HomeAboutForm: React.FC = () => {
  const [data, setData]           = useState<HomeAboutData>(() => ls(LS_HOME_ABOUT, defaultHomeAbout));
  const [uploading, setUploading] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const tid = toast.loading('Mengupload foto ke Cloudinary...');
    try {
      const url = await uploadToCloudinary(f);
      setData(d => ({ ...d, photoUrl: url }));
      toast.success('Foto berhasil diupload!', { id: tid });
    } catch {
      toast.error('Gagal upload foto. Coba lagi.', { id: tid });
    } finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <div>
      <SubTitle>About Me — Tampil di Halaman Home</SubTitle>
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: 'var(--white-dim)' }}>
        💡 Section ini adalah blok "About Me" yang muncul di halaman Home (bukan halaman About). Foto, nama, lokasi, dan bio bisa diisi berbeda.
      </div>

      {/* Foto */}
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={labelStyle}>Foto (About Me di Home)</label>
        {data.photoUrl && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.8rem' }}>
            <img src={data.photoUrl} alt="About" style={{ width: '120px', height: '150px', objectFit: 'cover', borderRadius: '12px', display: 'block', border: '2px solid var(--amber)' }} />
            <button onClick={() => setData(d => ({ ...d, photoUrl: '' }))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
          </div>
        )}
        <div onClick={() => !uploading && photoRef.current?.click()}
          style={{ ...uploadBoxStyle, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
          {uploading ? '⏳ Mengupload ke Cloudinary...' : '📷 Upload foto About Me (Home)'}
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
      </div>

      {[
        { key: 'name' as const, label: 'Nama Tampil', ph: 'Mahfudfebry' },
        { key: 'location' as const, label: 'Lokasi', ph: 'Nganjuk, Jawa Timur' },
        { key: 'subtitle' as const, label: 'Subjudul', ph: 'Menghubungkan SDM, Operasional, dan Teknologi' },
      ].map(({ key, label, ph }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{label}</label>
          <input style={inputStyle} value={data[key]} placeholder={ph}
            onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--white-dim)' }}>
        ✍️ Tip: bungkus kata dengan <strong style={{ color: 'var(--amber)' }}>**dua bintang**</strong> untuk menebalkan, contoh: <em>"**Human Resource**, IT Support"</em>.
      </div>
      {[
        { key: 'bio1' as const, label: 'Bio Paragraf 1' },
        { key: 'bio2' as const, label: 'Bio Paragraf 2' },
      ].map(({ key, label }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{label}</label>
          <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} value={data[key]}
            onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}
      {[
        { key: 'badgeText' as const, label: 'Teks Badge Kecil (dekat foto)', ph: 'Berkomitmen pada kualitas, integritas, dan kolaborasi.' },
        { key: 'closingQuote' as const, label: 'Quote Penutup Section', ph: 'Terus belajar, beradaptasi...' },
      ].map(({ key, label, ph }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{label}</label>
          <textarea style={{ ...inputStyle, height: '64px', resize: 'vertical' }} value={data[key]} placeholder={ph}
            onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}

      <SubTitle style={{ marginTop: '1.5rem' }}>Info Kontak (tampil di sisi kanan Section About)</SubTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { key: 'email' as const, label: 'Email', ph: 'nama@email.com' },
          { key: 'phone' as const, label: 'Telepon', ph: '+62 8xx-xxxx-xxxx' },
          { key: 'linkedinLabel' as const, label: 'LinkedIn (teks tampil)', ph: 'linkedin.com/in/username' },
          { key: 'linkedinUrl' as const, label: 'LinkedIn (URL lengkap)', ph: 'https://linkedin.com/in/username' },
          { key: 'githubLabel' as const, label: 'GitHub (teks tampil)', ph: 'github.com/username' },
          { key: 'githubUrl' as const, label: 'GitHub (URL lengkap)', ph: 'https://github.com/username' },
        ].map(({ key, label, ph }) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label style={labelSmStyle}>{label}</label>
            <input style={inputStyle} value={data[key]} placeholder={ph}
              onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
        ))}
      </div>

      <SubTitle style={{ marginTop: '1rem' }}>Statistik di Section About</SubTitle>
      <StatsEditor stats={data.stats} onChange={next => setData(d => ({ ...d, stats: next }))} />

      <SaveButton onClick={() => { save(LS_HOME_ABOUT, data); toast.success('About Me (Home) disimpan!'); }} />
    </div>
  );
};

/* ── Skills & Tools Form ── */
const SkillsForm: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>(() => ls(LS_SKILLS, defaultSkills));

  const update = (id: string, key: keyof SkillItem, val: string) =>
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));

  const add = () => setSkills(prev => [...prev, { id: Date.now().toString(), icon: '⭐', title: '', desc: '' }]);

  return (
    <div>
      <SubTitle>Skills & Expertise — 8 Kartu Keahlian di Home</SubTitle>
      {skills.map(skill => (
        <div key={skill.id} style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.6rem' }}>
            <button onClick={() => setSkills(prev => prev.filter(s => s.id !== skill.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div>
              <label style={labelSmStyle}>Icon</label>
              <input style={{ ...inputStyle, textAlign: 'center', fontSize: '1.3rem' }} value={skill.icon} placeholder="🛠️"
                onChange={e => update(skill.id, 'icon', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelSmStyle}>Judul Skill</label>
              <input style={inputStyle} value={skill.title} placeholder="Manajemen Administrasi"
                onChange={e => update(skill.id, 'title', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>
          <div>
            <label style={labelSmStyle}>Deskripsi</label>
            <textarea style={{ ...inputStyle, height: '72px', resize: 'vertical' }} value={skill.desc}
              placeholder="Deskripsi singkat tentang keahlian ini..."
              onChange={e => update(skill.id, 'desc', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
        </div>
      ))}
      <button onClick={add} style={addBtnStyle}>+ Tambah Skill</button>

      {/* Preview */}
      {skills.length > 0 && (
        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <SubTitle>Preview Kartu</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
            {skills.map(s => (
              <div key={s.id} style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '12px', padding: '1.2rem' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--amber)', marginBottom: '0.4rem' }}>{s.title || '—'}</div>
                <div style={{ color: 'var(--white-dim)', fontSize: '0.78rem', lineHeight: 1.5 }}>{s.desc || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SaveButton onClick={() => { save(LS_SKILLS, skills); toast.success('Skills & Expertise disimpan!'); }} />
    </div>
  );
};

/* ── Keahlian & Kompetensi (Expertise Cards) Form ── */
const ExpertiseForm: React.FC = () => {
  const [cards, setCards] = useState<ExpertiseCard[]>(() => ls(LS_EXPERTISE, defaultExpertise));

  const update = (id: string, key: keyof ExpertiseCard, val: string) =>
    setCards(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c));
  const add = () => setCards(prev => [...prev, { id: Date.now().toString(), icon: '🧩', title: '', items: '' }]);

  return (
    <div>
      <SubTitle>Keahlian & Kompetensi — 3 Kartu di Home</SubTitle>
      {cards.map((card, i) => (
        <div key={card.id} style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem' }}>Kartu #{i + 1}</span>
            <button onClick={() => setCards(prev => prev.filter(c => c.id !== card.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '0.8rem', marginBottom: '0.7rem' }}>
            <div>
              <label style={labelSmStyle}>Icon</label>
              <input style={{ ...inputStyle, textAlign: 'center', fontSize: '1.3rem' }} value={card.icon}
                onChange={e => update(card.id, 'icon', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelSmStyle}>Judul Kartu</label>
              <input style={inputStyle} value={card.title} placeholder="HR General Affairs"
                onChange={e => update(card.id, 'title', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>
          <div>
            <label style={labelSmStyle}>Daftar Poin (pisah koma)</label>
            <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} value={card.items}
              placeholder="Analisa Beban Kerja,Penyusunan Uraian Jabatan,..."
              onChange={e => update(card.id, 'items', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
        </div>
      ))}
      <button onClick={add} style={addBtnStyle}>+ Tambah Kartu Keahlian</button>
      <SaveButton onClick={() => { save(LS_EXPERTISE, cards); toast.success('Keahlian & Kompetensi disimpan!'); }} />
    </div>
  );
};

/* ── Tools & Technologies + Kompetensi Inti Form ── */
const ToolsValuesForm: React.FC = () => {
  const [tools, setTools]   = useState<ToolItem[]>(() => ls(LS_TOOLS, defaultTools));
  const [values, setValues] = useState<ValueItem[]>(() => ls(LS_VALUES, defaultValues));

  const miniListEditor = <T extends { id: string; icon: string; label: string }>(
    items: T[], setItems: React.Dispatch<React.SetStateAction<T[]>>, placeholder: string
  ) => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.7rem', marginBottom: '0.7rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ ...cardBoxStyle, padding: '0.8rem', marginBottom: 0, display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
            <input style={{ ...inputStyle, textAlign: 'center', fontSize: '1.1rem', padding: '8px' }} value={item.icon}
              onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, icon: e.target.value } : p))} />
            <input style={inputStyle} value={item.label} placeholder={placeholder}
              onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, label: e.target.value } : p))} />
            <button onClick={() => setItems(prev => prev.filter(p => p.id !== item.id))} style={deleteBtnStyle}>✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => setItems(prev => [...prev, { id: Date.now().toString(), icon: '✨', label: '' } as T])} style={{ ...addBtnStyle, marginBottom: '1.5rem' }}>+ Tambah</button>
    </>
  );

  return (
    <div>
      <SubTitle>Tools & Technologies</SubTitle>
      {miniListEditor(tools, setTools, 'Microsoft Office')}

      <SubTitle>Kompetensi Inti (Core Values)</SubTitle>
      {miniListEditor(values, setValues, 'Profesional')}

      <SaveButton onClick={() => {
        save(LS_TOOLS, tools); save(LS_VALUES, values);
        toast.success('Tools & Kompetensi Inti disimpan!');
      }} />
    </div>
  );
};

/* ── Pengalaman Kerja Form ── */
const ExperienceForm: React.FC = () => {
  const [exps, setExps] = useState<ExpItem[]>(() => ls(LS_EXPERIENCE, defaultExperience));
  const [uploadingImg, setUploadingImg] = useState<string | null>(null);
  const imgRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const update = (id: string, key: keyof ExpItem, val: string) =>
    setExps(prev => prev.map(e => e.id === id ? { ...e, [key]: val } : e));

  const add = () => setExps(prev => [...prev, {
    id: Date.now().toString(), position: '', company: '', period: '', icon: '💼', tags: '', imageUrl: '',
  }]);

  const handleImgUpload = async (expId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingImg(expId);
    const tid = toast.loading('Mengupload gambar...');
    try {
      const url = await uploadToCloudinary(f);
      setExps(prev => prev.map(x => x.id === expId ? { ...x, imageUrl: url } : x));
      toast.success('Gambar berhasil diupload!', { id: tid });
    } catch {
      toast.error('Gagal upload. Coba lagi.', { id: tid });
    } finally { setUploadingImg(null); e.target.value = ''; }
  };

  return (
    <div>
      <SubTitle>Pengalaman Kerja</SubTitle>
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: 'var(--white-dim)' }}>
        💡 Tampil sebagai timeline di Home. Tambah, edit, atau hapus riwayat kerja di bawah ini.
      </div>

      {exps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--white-dim)', background: 'var(--black-3)', borderRadius: '12px', marginBottom: '1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💼</div>
          <p>Belum ada data pengalaman kerja.</p>
        </div>
      )}

      {exps.map((exp, i) => (
        <div key={exp.id} style={{ ...cardBoxStyle, marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700 }}>Pengalaman #{i + 1}</span>
            <button onClick={() => setExps(prev => prev.filter(e => e.id !== exp.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div>
              <label style={labelSmStyle}>Icon Emoji</label>
              <input style={{ ...inputStyle, textAlign: 'center', fontSize: '1.3rem' }} value={exp.icon}
                onChange={e => update(exp.id, 'icon', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelSmStyle}>Jabatan / Posisi</label>
              <input style={inputStyle} value={exp.position} placeholder="HR / General Affairs"
                onChange={e => update(exp.id, 'position', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div>
              <label style={labelSmStyle}>Nama Perusahaan</label>
              <input style={inputStyle} value={exp.company} placeholder="UD Duta Pangan"
                onChange={e => update(exp.id, 'company', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelSmStyle}>Periode Kerja</label>
              <input style={inputStyle} value={exp.period} placeholder="Jul 2024 – Des 2024"
                onChange={e => update(exp.id, 'period', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <label style={labelSmStyle}>Tag Keahlian / Tugas (pisah koma)</label>
            <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={exp.tags} placeholder="Vendor Management,Stock Monitoring,Facility Maintenance"
              onChange={e => update(exp.id, 'tags', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Preview Tags */}
          {exp.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.8rem' }}>
              {exp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                <span key={tag} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', color: 'var(--amber)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <label style={labelSmStyle}>Gambar / Ilustrasi (opsional)</label>
            {exp.imageUrl && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <img src={exp.imageUrl} alt="exp" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                <button onClick={() => update(exp.id, 'imageUrl', '')} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
              </div>
            )}
            <div onClick={() => uploadingImg !== exp.id && imgRefs.current[exp.id]?.click()}
              style={{ ...uploadBoxStyle, cursor: uploadingImg === exp.id ? 'not-allowed' : 'pointer', opacity: uploadingImg === exp.id ? 0.6 : 1 }}>
              {uploadingImg === exp.id ? '⏳ Mengupload...' : '🖼️ Upload gambar untuk timeline ini'}
            </div>
            <input ref={el => { imgRefs.current[exp.id] = el; }} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleImgUpload(exp.id, e)} />
          </div>
        </div>
      ))}

      <button onClick={add} style={addBtnStyle}>+ Tambah Pengalaman Kerja</button>
      <SaveButton onClick={() => { save(LS_EXPERIENCE, exps); toast.success('Pengalaman Kerja disimpan!'); }} />
    </div>
  );
};

/* ── Projects & Contributions (Home) Form ── */
const HomeProjectsForm: React.FC = () => {
  const [items, setItems] = useState<HomeProjectItem[]>(() => ls(LS_HOME_PROJECTS, defaultHomeProjects));

  const update = (id: string, key: keyof HomeProjectItem, val: string) =>
    setItems(prev => prev.map(p => p.id === id ? { ...p, [key]: val } : p));
  const add = () => setItems(prev => [...prev, { id: Date.now().toString(), icon: '📌', title: '', desc: '', category: HOME_PROJECT_CATEGORIES[0] }]);

  return (
    <div>
      <SubTitle>Projects & Contributions — Grid di Home</SubTitle>
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: 'var(--white-dim)' }}>
        💡 Berbeda dari "Setting Portfolio" (yang menampilkan galeri lengkap di halaman /portofolio), ini adalah daftar ringkas proyek yang muncul langsung di halaman Home.
      </div>
      {items.map((item, i) => (
        <div key={item.id} style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem' }}>Proyek #{i + 1}</span>
            <button onClick={() => setItems(prev => prev.filter(p => p.id !== item.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '0.8rem', marginBottom: '0.7rem' }}>
            <div>
              <label style={labelSmStyle}>Icon</label>
              <input style={{ ...inputStyle, textAlign: 'center', fontSize: '1.3rem' }} value={item.icon}
                onChange={e => update(item.id, 'icon', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelSmStyle}>Judul Proyek</label>
              <input style={inputStyle} value={item.title} placeholder="Implementasi Administrasi BPJS"
                onChange={e => update(item.id, 'title', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>
          <div style={{ marginBottom: '0.7rem' }}>
            <label style={labelSmStyle}>Deskripsi</label>
            <textarea style={{ ...inputStyle, height: '64px', resize: 'vertical' }} value={item.desc}
              onChange={e => update(item.id, 'desc', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
          <div>
            <label style={labelSmStyle}>Kategori</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={item.category}
              onChange={e => update(item.id, 'category', e.target.value)}>
              {HOME_PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      ))}
      <button onClick={add} style={addBtnStyle}>+ Tambah Proyek</button>
      <SaveButton onClick={() => { save(LS_HOME_PROJECTS, items); toast.success('Projects & Contributions disimpan!'); }} />
    </div>
  );
};

/* ══════════════════════════════════
   SUB-PANEL: SETTING ABOUT
══════════════════════════════════ */
const SettingAbout: React.FC = () => {
  const [about, setAbout]         = useState<AboutData>(() => ls(LS_ABOUT, defaultAbout));
  const [photo, setPhoto]         = useState<string>(() => localStorage.getItem(LS_ABOUT_PHOTO) || '');
  const [edus, setEdus]           = useState<EduItem[]>(() => ls(LS_EDU, defaultEdus));
  const [certs, setCerts]         = useState<CertItem[]>(() => ls(LS_CERT, defaultCerts));
  const [uploadingPhoto, setUploadingPhoto]           = useState(false);
  const [uploadingCert, setUploadingCert]             = useState<string | null>(null);
  const [expandedCertId, setExpandedCertId]           = useState<string | null>(null);
  const photoRef  = useRef<HTMLInputElement>(null);
  const certRefs  = useRef<Record<string, HTMLInputElement | null>>({});

  const handleSave = () => {
    save(LS_ABOUT, about);
    if (photo) localStorage.setItem(LS_ABOUT_PHOTO, photo);
    save(LS_EDU, edus);
    save(LS_CERT, certs);
    toast.success('Setting About disimpan!');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingPhoto(true);
    const tid = toast.loading('Mengupload foto profil...');
    try {
      const url = await uploadToCloudinary(f);
      setPhoto(url);
      toast.success('Foto profil berhasil diupload!', { id: tid });
    } catch {
      toast.error('Gagal upload. Coba lagi.', { id: tid });
    } finally { setUploadingPhoto(false); e.target.value = ''; }
  };

  const handleCertUpload = async (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingCert(certId);
    const tid = toast.loading('Mengupload gambar sertifikat...');
    try {
      const url = await uploadToCloudinary(f);
      setCerts(prev => prev.map(c => c.id === certId ? { ...c, imageUrl: url } : c));
      toast.success('Gambar sertifikat berhasil diupload!', { id: tid });
    } catch {
      toast.error('Gagal upload. Coba lagi.', { id: tid });
    } finally { setUploadingCert(null); e.target.value = ''; }
  };

  return (
    <div>
      <SectionTitle icon="👤" title="Setting About" desc="Kelola halaman About (profil, pendidikan, sertifikasi)" />

      {/* Foto Profil */}
      <SubTitle>Foto Profil</SubTitle>
      <div style={{ marginBottom: '1.4rem' }}>
        {photo && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.8rem' }}>
            <img src={photo} alt="Profil" style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '50%', display: 'block', border: '3px solid var(--amber)' }} />
            <button onClick={() => setPhoto('')} style={{ position: 'absolute', top: '0', right: '0', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
          </div>
        )}
        <div onClick={() => !uploadingPhoto && photoRef.current?.click()}
          style={{ ...uploadBoxStyle, cursor: uploadingPhoto ? 'not-allowed' : 'pointer', opacity: uploadingPhoto ? 0.6 : 1 }}>
          {uploadingPhoto ? '⏳ Mengupload ke Cloudinary...' : '📷 Upload foto profil (halaman About)'}
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
      </div>

      {/* Bio */}
      <SubTitle>Informasi Diri</SubTitle>
      {[
        { key: 'name' as const, label: 'Nama' },
        { key: 'location' as const, label: 'Lokasi' },
      ].map(({ key, label }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{label}</label>
          <input style={inputStyle} value={about[key]}
            onChange={e => setAbout(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}
      {['bio1', 'bio2'].map(key => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{key === 'bio1' ? 'Bio Paragraf 1' : 'Bio Paragraf 2'}</label>
          <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} value={about[key as keyof AboutData]}
            onChange={e => setAbout(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}

      {/* Education */}
      <SubTitle style={{ marginTop: '1.5rem' }}>Pendidikan</SubTitle>
      {edus.map((edu, i) => (
        <div key={edu.id} style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem' }}>Pendidikan #{i + 1}</span>
            <button onClick={() => setEdus(prev => prev.filter(e => e.id !== edu.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          {(['school', 'year', 'major', 'location', 'score', 'icon'] as const).map(k => (
            <div key={k} style={{ marginBottom: '0.7rem' }}>
              <label style={labelSmStyle}>{k === 'school' ? 'Nama Sekolah/Kampus' : k === 'year' ? 'Tahun Lulus' : k === 'major' ? 'Jurusan' : k === 'location' ? 'Lokasi' : k === 'score' ? 'Nilai/IPK (opsional)' : 'Icon Emoji'}</label>
              <input style={inputStyle} value={edu[k]}
                onChange={e => setEdus(prev => prev.map(ed => ed.id === edu.id ? { ...ed, [k]: e.target.value } : ed))}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => setEdus(prev => [...prev, { id: Date.now().toString(), school: '', year: '', major: '', location: '', score: '', icon: '🎓' }])} style={addBtnStyle}>+ Tambah Pendidikan</button>

      {/* Certifications */}
      <SubTitle style={{ marginTop: '1.5rem' }}>Sertifikasi</SubTitle>
      {certs.map((cert, i) => (
        <div key={cert.id} style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem' }}>Sertifikat #{i + 1}</span>
            <button onClick={() => setCerts(prev => prev.filter(c => c.id !== cert.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          {(['title', 'issuer', 'items'] as const).map(k => (
            <div key={k} style={{ marginBottom: '0.7rem' }}>
              <label style={labelSmStyle}>{k === 'title' ? 'Judul Sertifikat' : k === 'issuer' ? 'Penerbit' : 'Kompetensi (pisah koma)'}</label>
              <input style={inputStyle} value={cert[k]}
                onChange={e => setCerts(prev => prev.map(c => c.id === cert.id ? { ...c, [k]: e.target.value } : c))}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          ))}

          {/* Show Badge Toggle */}
          <div style={{ marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: 'rgba(245,166,35,0.05)', borderRadius: '8px', border: '1px solid rgba(245,166,35,0.15)' }}>
            <input
              type="checkbox"
              id={`badge-${cert.id}`}
              checked={cert.showBadge ?? false}
              onChange={e => setCerts(prev => prev.map(c => c.id === cert.id ? { ...c, showBadge: e.target.checked } : c))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--amber)', cursor: 'pointer', flexShrink: 0 }}
            />
            <label htmlFor={`badge-${cert.id}`} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.83rem', cursor: 'pointer', userSelect: 'none' as const }}>
              Tampilkan badge di <strong style={{ color: 'var(--amber)' }}>Hero Home</strong>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.74rem', marginTop: '1px' }}>
                Badge 🏅 {cert.title || '—'} {cert.showBadge ? '→ aktif di hero' : '→ tersembunyi'}
              </span>
            </label>
          </div>
          <div style={{ marginBottom: '0.7rem' }}>
            <label style={labelSmStyle}>Gambar Sertifikat</label>
            {cert.imageUrl && (
              <div style={{ marginBottom: '0.5rem' }}>
                {/* Toggle preview button */}
                <button
                  onClick={() => setExpandedCertId(expandedCertId === cert.id ? null : cert.id)}
                  style={{
                    background: expandedCertId === cert.id ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(245,166,35,0.3)',
                    color: 'var(--amber)', borderRadius: '8px',
                    padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700,
                    cursor: 'pointer', marginBottom: '0.5rem', width: '100%',
                    textAlign: 'left' as const,
                  }}
                >
                  {expandedCertId === cert.id ? '▲ Tutup Preview' : '🖼 Preview Sertifikat'}
                </button>
                {/* Expandable full image */}
                <AnimatePresence>
                  {expandedCertId === cert.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden', marginBottom: '0.5rem' }}
                    >
                      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(245,166,35,0.2)' }}>
                        <img
                          src={cert.imageUrl}
                          alt="cert"
                          style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', display: 'block', background: 'rgba(255,255,255,0.04)' }}
                        />
                        <button
                          onClick={() => { setCerts(prev => prev.map(c => c.id === cert.id ? { ...c, imageUrl: '' } : c)); setExpandedCertId(null); }}
                          style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          ✕ Hapus
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <div onClick={() => uploadingCert !== cert.id && certRefs.current[cert.id]?.click()}
              style={{ ...uploadBoxStyle, cursor: uploadingCert === cert.id ? 'not-allowed' : 'pointer', padding: '0.7rem', opacity: uploadingCert === cert.id ? 0.6 : 1 }}>
              {uploadingCert === cert.id ? '⏳ Mengupload ke Cloudinary...' : cert.imageUrl ? '🔄 Ganti gambar sertifikat (Cloudinary)' : '📎 Upload gambar sertifikat (Cloudinary)'}
            </div>
            <input ref={el => { certRefs.current[cert.id] = el; }} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleCertUpload(cert.id, e)} />
          </div>
        </div>
      ))}
      <button onClick={() => setCerts(prev => [...prev, { id: Date.now().toString(), title: '', issuer: '', items: '', imageUrl: '' }])} style={addBtnStyle}>+ Tambah Sertifikasi</button>

      <SaveButton onClick={handleSave} />
    </div>
  );
};

/* ══════════════════════════════════
   SUB-PANEL: SETTING PORTFOLIO
══════════════════════════════════ */
const CATEGORIES = ['HR', 'Administrasi', 'IT Support', 'Desain', 'Branding'];

const SettingPortfolio: React.FC = () => {
  const [items, setItems]             = useState<PortfolioItem[]>(() => ls(LS_PORTFOLIO, []));
  const [uploadingImg, setUploadingImg] = useState<string | null>(null);
  const imgRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addItem = () => setItems(prev => [...prev, {
    id: Date.now().toString(), title: '', description: '', category: 'HR',
    imageUrl: '', tags: '', year: new Date().getFullYear().toString(), client: '', featured: false,
  }]);

  const handleImgUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingImg(itemId);
    const tid = toast.loading('Mengupload gambar project...');
    try {
      const url = await uploadToCloudinary(f);
      setItems(prev => prev.map(p => p.id === itemId ? { ...p, imageUrl: url } : p));
      toast.success('Gambar berhasil diupload!', { id: tid });
    } catch {
      toast.error('Gagal upload. Coba lagi.', { id: tid });
    } finally { setUploadingImg(null); e.target.value = ''; }
  };

  return (
    <div>
      <SectionTitle icon="🗂️" title="Setting Portfolio" desc="Kelola daftar proyek dan karya" />
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--white-dim)', background: 'var(--black-3)', borderRadius: '12px', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📂</div>
          <p>Belum ada portfolio. Klik tombol di bawah untuk menambah.</p>
        </div>
      )}
      {items.map((item, i) => (
        <div key={item.id} style={{ ...cardBoxStyle, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700 }}>Project #{i + 1}</span>
            <button onClick={() => setItems(prev => prev.filter(p => p.id !== item.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          {[
            { k: 'title' as const, l: 'Judul Project' },
            { k: 'description' as const, l: 'Deskripsi' },
            { k: 'tags' as const, l: 'Tags (pisah koma)' },
            { k: 'year' as const, l: 'Tahun' },
            { k: 'client' as const, l: 'Nama Klien' },
          ].map(({ k, l }) => (
            <div key={k} style={{ marginBottom: '0.7rem' }}>
              <label style={labelSmStyle}>{l}</label>
              <input style={inputStyle} value={item[k] as string}
                onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, [k]: e.target.value } : p))}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          ))}
          <div style={{ marginBottom: '0.7rem' }}>
            <label style={labelSmStyle}>Kategori</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={item.category}
              onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, category: e.target.value } : p))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <input type="checkbox" id={`feat-${item.id}`} checked={item.featured}
              onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, featured: e.target.checked } : p))}
              style={{ accentColor: 'var(--amber)', width: '16px', height: '16px' }} />
            <label htmlFor={`feat-${item.id}`} style={{ color: 'var(--white-dim)', fontSize: '0.85rem', cursor: 'pointer' }}>Tandai sebagai Featured ⭐</label>
          </div>
          <div>
            <label style={labelSmStyle}>Gambar Project</label>
            {item.imageUrl && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <img src={item.imageUrl} alt="project" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                <button onClick={() => setItems(prev => prev.map(p => p.id === item.id ? { ...p, imageUrl: '' } : p))} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
              </div>
            )}
            <div onClick={() => uploadingImg !== item.id && imgRefs.current[item.id]?.click()}
              style={{ ...uploadBoxStyle, cursor: uploadingImg === item.id ? 'not-allowed' : 'pointer', opacity: uploadingImg === item.id ? 0.6 : 1 }}>
              {uploadingImg === item.id ? '⏳ Mengupload ke Cloudinary...' : '🖼️ Upload gambar project'}
            </div>
            <input ref={el => { imgRefs.current[item.id] = el; }} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleImgUpload(item.id, e)} />
          </div>
        </div>
      ))}
      <button onClick={addItem} style={addBtnStyle}>+ Tambah Project</button>
      <SaveButton onClick={() => { save(LS_PORTFOLIO, items); toast.success('Portfolio disimpan!'); }} />
    </div>
  );
};

/* ══════════════════════════════════
   SUB-PANEL: CONTACT US
══════════════════════════════════ */
const SOCIAL_FIELDS: { key: keyof ContactData; label: string; icon: string; ph: string; toggle: keyof ContactData }[] = [
  { key: 'whatsapp',  label: 'WhatsApp (nomor tanpa +)',  icon: '💬', ph: '6281234567890',      toggle: 'showWhatsapp'  },
  { key: 'instagram', label: 'Instagram (username)',       icon: '📸', ph: 'namaakun',           toggle: 'showInstagram' },
  { key: 'linkedin',  label: 'LinkedIn (username)',        icon: '💼', ph: 'namaakun',           toggle: 'showLinkedin'  },
  { key: 'tiktok',    label: 'TikTok (username)',          icon: '🎵', ph: 'namaakun',           toggle: 'showTiktok'    },
  { key: 'website',   label: 'Website (URL lengkap)',      icon: '🌐', ph: 'https://mysite.com', toggle: 'showWebsite'   },
  { key: 'email',     label: 'Email',                      icon: '📧', ph: 'kamu@email.com',     toggle: 'showEmail'     },
];

const ContactSetting: React.FC = () => {
  const [data, setData] = useState<ContactData>(() => ls(LS_CONTACT, defaultContact));

  return (
    <div>
      <SectionTitle icon="📲" title="Contact Us" desc="Kelola link sosial media & kontak yang tampil di semua footer halaman" />
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '1rem 1.2rem', marginBottom: '1.8rem', fontSize: '0.85rem', color: 'var(--white-dim)', lineHeight: 1.6 }}>
        💡 <strong style={{ color: 'var(--amber)' }}>Info:</strong> Link yang diaktifkan akan muncul sebagai tombol di footer semua halaman.
      </div>

      {SOCIAL_FIELDS.map(({ key, label, icon, ph, toggle }) => (
        <div key={key} style={{ ...cardBoxStyle, marginBottom: '1rem', padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{icon} {label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              onClick={() => setData(d => ({ ...d, [toggle]: !d[toggle] }))}>
              <span style={{ color: 'var(--white-dim)', fontSize: '0.8rem' }}>{data[toggle] ? 'Tampil' : 'Sembunyikan'}</span>
              <div style={{ width: '42px', height: '22px', borderRadius: '11px', transition: 'background 0.3s', background: data[toggle] ? 'var(--amber)' : 'rgba(255,255,255,0.15)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '3px', left: data[toggle] ? '22px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.3s' }} />
              </div>
            </div>
          </div>
          <input style={{ ...inputStyle, opacity: data[toggle] ? 1 : 0.4 }} placeholder={ph}
            value={data[key] as string} disabled={!data[toggle]}
            onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}

      <SubTitle style={{ marginTop: '1.5rem' }}>Info Tambahan (Section "Contact" di Home)</SubTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={labelSmStyle}>📞 Telepon</label>
          <input style={inputStyle} value={data.phone} placeholder="+62 8xx-xxxx-xxxx"
            onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
        <div>
          <label style={labelSmStyle}>📍 Lokasi</label>
          <input style={inputStyle} value={data.location} placeholder="Jakarta, Indonesia"
            onChange={e => setData(d => ({ ...d, location: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      </div>

      <SubTitle style={{ marginTop: '1.5rem' }}>Preview Tombol Footer</SubTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', padding: '1.2rem', background: 'var(--black-3)', borderRadius: '12px', marginBottom: '1.5rem' }}>
        {SOCIAL_FIELDS.filter(f => data[f.toggle]).map(f => (
          <div key={f.key} style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', color: 'var(--amber)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600 }}>
            {f.icon} {f.label.split(' ')[0]}
          </div>
        ))}
        {SOCIAL_FIELDS.filter(f => data[f.toggle]).length === 0 && (
          <span style={{ color: 'var(--white-dim)', fontSize: '0.85rem' }}>Tidak ada tombol aktif</span>
        )}
      </div>

      <SaveButton onClick={() => { save(LS_CONTACT, data); toast.success('Contact Us disimpan!'); }} />
    </div>
  );
};

/* ─── Shared Sub-Components ─── */
const SectionTitle: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{ marginBottom: '2rem', paddingBottom: '1.2rem', borderBottom: '1px solid rgba(245,166,35,0.15)' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{icon}</div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.3rem' }}>{title}</h2>
    <p style={{ color: 'var(--white-dim)', fontSize: '0.88rem' }}>{desc}</p>
  </div>
);
const SubTitle: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--amber)', fontSize: '0.82rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.9rem', marginTop: '0.2rem', ...style }}>{children}</h3>
);
const SaveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button onClick={onClick}
    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(245,166,35,0.35)' }}
    whileTap={{ scale: 0.97 }}
    style={{ background: 'var(--amber)', color: 'var(--black)', border: 'none', borderRadius: '10px', padding: '14px 36px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1.5rem', letterSpacing: '0.5px' }}>
    💾 Simpan Perubahan
  </motion.button>
);

/* ─── Shared Styles ─── */
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '11px 14px', color: 'var(--white)', fontFamily: 'var(--font-body)',
  fontSize: '0.92rem', outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', color: 'var(--white-dim)', fontSize: '0.8rem', fontWeight: 600,
  marginBottom: '0.4rem', letterSpacing: '0.5px', textTransform: 'uppercase',
};
const labelSmStyle: React.CSSProperties = { ...labelStyle, fontSize: '0.72rem' };
const cardBoxStyle: React.CSSProperties = {
  background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.12)',
  borderRadius: '12px', padding: '1.4rem', marginBottom: '1rem',
};
const uploadBoxStyle: React.CSSProperties = {
  border: '2px dashed rgba(245,166,35,0.3)', borderRadius: '10px', padding: '1rem',
  textAlign: 'center', color: 'var(--white-dim)', fontSize: '0.88rem', transition: 'border-color 0.2s',
};
const deleteBtnStyle: React.CSSProperties = {
  background: 'rgba(255,80,80,0.12)', border: '1px solid rgba(255,80,80,0.25)',
  color: '#ff6060', borderRadius: '6px', padding: '4px 10px', fontSize: '0.78rem',
  cursor: 'pointer', fontWeight: 600,
};
const addBtnStyle: React.CSSProperties = {
  background: 'rgba(245,166,35,0.1)', border: '1px dashed rgba(245,166,35,0.4)',
  color: 'var(--amber)', borderRadius: '8px', padding: '10px 22px', fontSize: '0.88rem',
  cursor: 'pointer', fontWeight: 600, width: '100%', marginBottom: '1.5rem',
};

/* ══════════════════════════════════
   MAIN AdminPanel COMPONENT
══════════════════════════════════ */
const AdminPanel: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate            = useNavigate();
  const [activeMenu, setActiveMenu]   = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { if (!isAdmin) navigate('/admin/login'); }, [isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logout berhasil.');
    navigate('/admin/login');
  };

  const panels: Record<string, React.ReactNode> = {
    home:      <SettingHome />,
    about:     <SettingAbout />,
    portfolio: <SettingPortfolio />,
    contact:   <ContactSetting />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font-body)' }}>

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? '260px' : '72px' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: 'var(--black-2)', borderRight: '1px solid rgba(245,166,35,0.12)',
          display: 'flex', flexDirection: 'column', position: 'sticky', top: 0,
          height: '100vh', overflow: 'hidden', flexShrink: 0, zIndex: 100,
        }}
      >
        {/* Header */}
        <div style={{ padding: sidebarOpen ? '1.6rem 1.4rem 1rem' : '1.6rem 0 1rem', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', borderBottom: '1px solid rgba(245,166,35,0.1)' }}>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--amber)', fontSize: '1.3rem', letterSpacing: '2px', lineHeight: 1 }}>MFD-FBY's</div>
                <div style={{ color: 'var(--white-dim)', fontSize: '0.72rem', letterSpacing: '1.5px', marginTop: '2px', textTransform: 'uppercase' }}>Admin Panel</div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', color: 'var(--amber)', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {MENUS.map(menu => {
            const active = activeMenu === menu.id;
            return (
              <motion.button key={menu.id} onClick={() => setActiveMenu(menu.id)} whileHover={{ x: 4 }}
                title={!sidebarOpen ? menu.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.9rem',
                  padding: sidebarOpen ? '12px 14px' : '12px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: active ? 'rgba(245,166,35,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(245,166,35,0.3)' : 'transparent'}`,
                  borderRadius: '10px', cursor: 'pointer', width: '100%',
                  color: active ? 'var(--amber)' : 'var(--white-dim)',
                  fontFamily: 'var(--font-body)', fontWeight: active ? 700 : 400,
                  fontSize: '0.9rem', transition: 'all 0.25s', textAlign: 'left', position: 'relative',
                }}>
                {active && <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '3px', background: 'var(--amber)', borderRadius: '0 3px 3px 0' }} />}
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{menu.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {menu.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div style={{ padding: '1rem 0.6rem', borderTop: '1px solid rgba(245,166,35,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => navigate('/')}
            title={!sidebarOpen ? 'Lihat Website' : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'var(--white-dim)', padding: '10px 14px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
            <span>🌐</span>{sidebarOpen && <span>Lihat Website</span>}
          </button>
          <button onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: '10px', color: '#ff6060', padding: '10px 14px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
            <span>🚪</span>{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: 'clamp(1.5rem, 3vw, 2.5rem)', overflowY: 'auto', maxWidth: '860px' }}>
        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(245,166,35,0.1)' }}>
          <div>
            <div style={{ color: 'var(--amber)', fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
              {MENUS.find(m => m.id === activeMenu)?.icon} {MENUS.find(m => m.id === activeMenu)?.label}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>Dashboard Admin</h1>
          </div>
          <div style={{ color: 'var(--white-dim)', fontSize: '0.82rem', textAlign: 'right' }}>
            <div>Hikimori Project</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>© {new Date().getFullYear()}</div>
          </div>
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={activeMenu}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
            {panels[activeMenu]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanel;

/* ─── Export LS keys untuk dipakai di halaman Home ─── */
export { LS_HOME_ABOUT, LS_SKILLS, LS_EXPERIENCE };
export type { HomeAboutData, SkillItem, ExpItem };
