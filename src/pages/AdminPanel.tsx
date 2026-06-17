// src/pages/AdminPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

/* ─── Types ─── */
interface HomeData {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroCta: string;
  heroCtaLink: string;
  heroPhotoUrl: string;
}
// About Me section yang muncul di halaman Home
interface HomeAboutData {
  name: string;
  location: string;
  bio1: string;
  bio2: string;
  photoUrl: string;
}
interface AboutData { name: string; location: string; bio1: string; bio2: string; }
interface EduItem   { id: string; school: string; year: string; major: string; score: string; icon: string; }
interface CertItem  { id: string; title: string; issuer: string; items: string; imageUrl: string; }

// Skills & Tools
interface SkillItem {
  id: string;
  number: string;   // "01", "02", dst
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
}

interface ContactData {
  whatsapp: string; instagram: string; linkedin: string;
  tiktok: string;   website: string;  email: string;
  showWhatsapp: boolean; showInstagram: boolean; showLinkedin: boolean;
  showTiktok: boolean;   showWebsite: boolean;   showEmail: boolean;
}
interface PortfolioItem {
  id: string; title: string; description: string; category: string;
  imageUrl: string; tags: string; year: string; client: string; featured: boolean;
}

/* ─── Defaults ─── */
const defaultHome: HomeData = {
  heroTitle: 'MAHFUD FEBRY', heroSubtitle: 'STYANTO',
  heroTagline: 'HR Professional · Admin · IT Support · Creative Designer',
  heroCta: 'Lihat Portfolio', heroCtaLink: '/portofolio', heroPhotoUrl: '',
};
const defaultHomeAbout: HomeAboutData = {
  name: 'Mahfudfebry',
  location: 'Nganjuk, Indonesia',
  bio1: 'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',
  bio2: 'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',
  photoUrl: '',
};
const defaultAbout: AboutData = {
  name: 'Mahfudfebry', location: 'Nganjuk, Jawa Timur — Indonesia',
  bio1: 'Saya adalah seorang profesional muda yang berdedikasi dari Nganjuk, Indonesia.',
  bio2: 'Di sepanjang perjalanan karier saya, saya telah mengerjakan berbagai bidang.',
};
const defaultEdus: EduItem[] = [
  { id: '1', school: 'SMAN 3 Nganjuk', year: '2018', major: 'Ilmu Pengetahuan Sosial (IPS)', score: 'Avg Value: 88', icon: '🏫' },
  { id: '2', school: 'Institut Teknologi dan Bisnis ASIA', year: 'Kota Malang', major: 'S1 – Teknik Informatika', score: 'IPK 3.38', icon: '🎓' },
];
const defaultCerts: CertItem[] = [
  { id: '1', title: 'Certified Human Resource Officer', issuer: 'BNSP', items: 'Analisa Beban Kerja,Menyusun Uraian Jabatan,Payroll & BPJS', imageUrl: '' },
  { id: '2', title: 'Surat Referensi Jabatan Sebelumnya', issuer: 'PT MAJU JAYA', items: 'Vendor Management,Stock Monitoring,Facility Maintenance', imageUrl: '' },
];
const defaultSkills: SkillItem[] = [
  { id: '1', number: '01', title: 'Branding & Identity Design', desc: 'Crafting memorable logos and visual systems that reflect a brand\'s essence and personality.' },
  { id: '2', number: '02', title: 'Creativity & Problem-Solving', desc: 'Thinking outside the box while solving design challenges with strategic insight.' },
  { id: '3', number: '03', title: 'Concept Development', desc: 'Skilled in brainstorming and translating abstract ideas into compelling visual narratives.' },
  { id: '4', number: '04', title: 'Proper Time Management', desc: 'Capable of handling multiple projects and meeting tight deadlines consistently.' },
];
const defaultExperience: ExpItem[] = [
  { id: '1', position: 'HR / General Affairs', company: 'UD Duta Pangan', period: '2020 – 2023', icon: '👥', tags: 'Vendor Management,Stock Monitoring,Facility Maintenance,Workload Analysis' },
  { id: '2', position: 'Staff Administrasi',   company: 'UD Duta Pangan', period: '2020 – 2023', icon: '📋', tags: 'Document Processing,Administrative Support,Filing & Archiving,Reporting' },
  { id: '3', position: 'IT Support',            company: 'UD Duta Pangan', period: '2020 – 2023', icon: '💻', tags: 'Hardware Troubleshooting,Software Installation,Network Setup,User Training' },
];
const defaultContact: ContactData = {
  whatsapp: '6281234567890', instagram: 'mahfudfebry', linkedin: 'mahfudfebry',
  tiktok: 'mahfudfebry',    website: 'https://hikimori-project.com', email: 'mahfudfebry@hikimori.web.id',
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
  const [activeTab, setActiveTab] = useState<'hero'|'homeabout'|'skills'|'experience'>('hero');

  const tabs: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: 'hero',       label: 'Hero Section',     icon: '✨' },
    { id: 'homeabout',  label: 'About Me (Home)',  icon: '👤' },
    { id: 'skills',     label: 'Skills & Tools',   icon: '🛠️' },
    { id: 'experience', label: 'Pengalaman Kerja', icon: '💼' },
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
          {activeTab === 'skills'     && <SkillsForm />}
          {activeTab === 'experience' && <ExperienceForm />}
        </motion.div>
      </AnimatePresence>
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
      {field('Nama Besar (Hero Title)', 'heroTitle', 'MAHFUD FEBRY')}
      {field('Nama Kecil (Hero Subtitle)', 'heroSubtitle', 'STYANTO')}
      {field('Tagline / Profesi', 'heroTagline', 'HR · Admin · IT Support · Designer')}
      {field('Teks Tombol CTA', 'heroCta', 'Lihat Portfolio')}
      {field('Link Tombol CTA', 'heroCtaLink', '/portofolio')}
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
        { key: 'location' as const, label: 'Lokasi', ph: 'Nganjuk, Indonesia' },
      ].map(({ key, label, ph }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>{label}</label>
          <input style={inputStyle} value={data[key]} placeholder={ph}
            onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      ))}
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
      <SaveButton onClick={() => { save(LS_HOME_ABOUT, data); toast.success('About Me (Home) disimpan!'); }} />
    </div>
  );
};

/* ── Skills & Tools Form ── */
const SkillsForm: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>(() => ls(LS_SKILLS, defaultSkills));

  const update = (id: string, key: keyof SkillItem, val: string) =>
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));

  const add = () => {
    const next = (skills.length + 1).toString().padStart(2, '0');
    setSkills(prev => [...prev, { id: Date.now().toString(), number: next, title: '', desc: '' }]);
  };

  return (
    <div>
      <SubTitle>Skills & Tools — Kartu Keahlian di Home</SubTitle>
      {skills.map((skill, i) => (
        <div key={skill.id} style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '1.1rem' }}>{skill.number}</span>
            <button onClick={() => setSkills(prev => prev.filter(s => s.id !== skill.id))} style={deleteBtnStyle}>✕ Hapus</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div>
              <label style={labelSmStyle}>Nomor</label>
              <input style={inputStyle} value={skill.number} placeholder="01"
                onChange={e => update(skill.id, 'number', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelSmStyle}>Judul Skill</label>
              <input style={inputStyle} value={skill.title} placeholder="Branding & Identity Design"
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
      <button onClick={add} style={addBtnStyle}>+ Tambah Skill / Tool</button>

      {/* Preview */}
      {skills.length > 0 && (
        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <SubTitle>Preview Kartu</SubTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
            {skills.map(s => (
              <div key={s.id} style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '12px', padding: '1.2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '8px', right: '12px', fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'rgba(245,166,35,0.08)', lineHeight: 1 }}>{s.number}</div>
                <div style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{s.number}</div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>{s.title || '—'}</div>
                <div style={{ color: 'var(--white-dim)', fontSize: '0.78rem', lineHeight: 1.5 }}>{s.desc || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SaveButton onClick={() => { save(LS_SKILLS, skills); toast.success('Skills & Tools disimpan!'); }} />
    </div>
  );
};

/* ── Pengalaman Kerja Form ── */
const ExperienceForm: React.FC = () => {
  const [exps, setExps] = useState<ExpItem[]>(() => ls(LS_EXPERIENCE, defaultExperience));

  const update = (id: string, key: keyof ExpItem, val: string) =>
    setExps(prev => prev.map(e => e.id === id ? { ...e, [key]: val } : e));

  const add = () => setExps(prev => [...prev, {
    id: Date.now().toString(), position: '', company: '', period: '', icon: '💼', tags: '',
  }]);

  return (
    <div>
      <SubTitle>Pengalaman Kerja</SubTitle>
      <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '10px', padding: '0.9rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: 'var(--white-dim)' }}>
        💡 Judul section besar di halaman Home sudah diubah menjadi <strong style={{ color: 'var(--amber)' }}>"Pengalaman Kerja"</strong>. Tambah, edit, atau hapus riwayat kerja di bawah ini.
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
              <input style={inputStyle} value={exp.period} placeholder="2020 – 2023"
                onChange={e => update(exp.id, 'period', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>

          <div>
            <label style={labelSmStyle}>Tag Keahlian (pisah koma)</label>
            <input style={inputStyle} value={exp.tags} placeholder="Vendor Management,Stock Monitoring,Facility Maintenance"
              onChange={e => update(exp.id, 'tags', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Preview Tags */}
          {exp.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.7rem' }}>
              {exp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                <span key={tag} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', color: 'var(--amber)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      <button onClick={add} style={addBtnStyle}>+ Tambah Pengalaman Kerja</button>
      <SaveButton onClick={() => { save(LS_EXPERIENCE, exps); toast.success('Pengalaman Kerja disimpan!'); }} />
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
          {(['school', 'year', 'major', 'score', 'icon'] as const).map(k => (
            <div key={k} style={{ marginBottom: '0.7rem' }}>
              <label style={labelSmStyle}>{k === 'school' ? 'Nama Sekolah/Kampus' : k === 'year' ? 'Tahun / Kota' : k === 'major' ? 'Jurusan' : k === 'score' ? 'Nilai/IPK' : 'Icon Emoji'}</label>
              <input style={inputStyle} value={edu[k]}
                onChange={e => setEdus(prev => prev.map(ed => ed.id === edu.id ? { ...ed, [k]: e.target.value } : ed))}
                onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => setEdus(prev => [...prev, { id: Date.now().toString(), school: '', year: '', major: '', score: '', icon: '🎓' }])} style={addBtnStyle}>+ Tambah Pendidikan</button>

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
          <div style={{ marginBottom: '0.7rem' }}>
            <label style={labelSmStyle}>Gambar Sertifikat</label>
            {cert.imageUrl && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <img src={cert.imageUrl} alt="cert" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                <button onClick={() => setCerts(prev => prev.map(c => c.id === cert.id ? { ...c, imageUrl: '' } : c))} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,38,38,0.9)', border: 'none', color: 'white', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
              </div>
            )}
            <div onClick={() => uploadingCert !== cert.id && certRefs.current[cert.id]?.click()}
              style={{ ...uploadBoxStyle, cursor: uploadingCert === cert.id ? 'not-allowed' : 'pointer', padding: '0.7rem', opacity: uploadingCert === cert.id ? 0.6 : 1 }}>
              {uploadingCert === cert.id ? '⏳ Mengupload...' : '📎 Upload gambar sertifikat'}
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
