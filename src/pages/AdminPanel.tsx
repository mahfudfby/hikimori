// src/pages/AdminPanel.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolio, PortfolioItem } from '../hooks/usePortfolio';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '',
  category: 'HR',
  description: '',
  imageUrl: '',
  tags: '',
  client: '',
  year: new Date().getFullYear().toString(),
  featured: false,
  order: 0,
};

type Tab = 'dashboard' | 'portfolio' | 'settings';

interface AboutData { name: string; location: string; bio1: string; bio2: string; }
interface ExpItem  { id: string; role: string; company: string; icon: string; tasks: string; }
interface EduItem  { id: string; school: string; year: string; major: string; score: string; icon: string; }
interface CertItem { id: string; title: string; issuer: string; items: string; imageUrl: string; }

const LS_ABOUT       = 'hk_about_data';
const LS_ABOUT_PHOTO = 'hk_about_photo';
const LS_EXPS        = 'hk_exp_data';
const LS_EDU         = 'hk_edu_data';
const LS_CERT        = 'hk_cert_data';
const LS_WA          = 'hk_wa_link';

const defaultAbout: AboutData = {
  name: 'Mahfudfebry',
  location: 'Nganjuk, Indonesia',
  bio1: 'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',
  bio2: 'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',
};

const defaultExps: ExpItem[] = [
  { id: '1', role: 'HR / General Affairs', company: 'UD Duta Pangan', icon: '👥', tasks: 'Vendor Management, Stock Monitoring, Facility Maintenance, Workload Analysis' },
  { id: '2', role: 'Staff Administrasi',   company: 'UD Duta Pangan', icon: '📋', tasks: 'Document Processing, Administrative Support, Filing & Archiving, Reporting' },
  { id: '3', role: 'IT Support',           company: 'UD Duta Pangan', icon: '💻', tasks: 'Hardware Troubleshooting, Software Installation, Network Setup, User Training' },
];

const defaultEdus: EduItem[] = [
  { id: '1', school: 'SMAN 3 Nganjuk', year: '2018', major: 'Ilmu Pengetahuan Sosial (IPS)', score: 'Avg Value: 88', icon: '🏫' },
  { id: '2', school: 'Institut Teknologi dan Bisnis ASIA', year: 'Kota Malang', major: 'S1 – Teknik Informatika', score: 'IPK 3.38', icon: '🎓' },
];

const defaultCerts: CertItem[] = [
  { id: '1', title: 'Certified Human Resource Officer', issuer: 'BNSP', items: 'Analisa Beban Kerja,Menyusun Uraian Jabatan,Payroll & BPJS', imageUrl: '' },
  { id: '2', title: 'Surat Referensi Jabatan Sebelumnya', issuer: 'PT MAJU JAYA', items: 'Vendor Management,Stock Monitoring,Facility Maintenance', imageUrl: '' },
];

const ls = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};
const lsStr = (key: string, fallback = '') => localStorage.getItem(key) ?? fallback;

const dispatch = (key: string, val: string) =>
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: val }));

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const { items, loading, addItem, updateItem, deleteItem } = usePortfolio();
  const [tab, setTab] = useState<Tab>('dashboard');
  const navigate = useNavigate();

  /* ── Portfolio ── */
  const [showForm, setShowForm]         = useState(false);
  const [editId, setEditId]             = useState<string | null>(null);
  const [form, setForm]                 = useState({ ...EMPTY_FORM });
  const [uploading, setUploading]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── About Me ── */
  const [about, setAbout]           = useState<AboutData>(() => ls(LS_ABOUT, defaultAbout));
  const [aboutSaving, setAboutSaving] = useState(false);
  const [aboutPhoto, setAboutPhoto]   = useState<string>(() => lsStr(LS_ABOUT_PHOTO));
  const [aboutPhotoFile, setAboutPhotoFile] = useState<File | null>(null);
  const [aboutPhotoPreview, setAboutPhotoPreview] = useState('');
  const [aboutPhotoUploading, setAboutPhotoUploading] = useState(false);

  /* ── Experience ── */
  const [exps, setExps]                   = useState<ExpItem[]>(() => ls(LS_EXPS, defaultExps));
  const [expForm, setExpForm]             = useState<ExpItem | null>(null);
  const [expEditId, setExpEditId]         = useState<string | null>(null);
  const [expDeleteConfirm, setExpDeleteConfirm] = useState<string | null>(null);

  /* ── Education ── */
  const [edus, setEdus]                   = useState<EduItem[]>(() => ls(LS_EDU, defaultEdus));
  const [eduForm, setEduForm]             = useState<EduItem | null>(null);
  const [eduEditId, setEduEditId]         = useState<string | null>(null);
  const [eduDeleteConfirm, setEduDeleteConfirm] = useState<string | null>(null);

  /* ── Sertifikasi ── */
  const [certs, setCerts]                 = useState<CertItem[]>(() => ls(LS_CERT, defaultCerts));
  const [certForm, setCertForm]           = useState<CertItem | null>(null);
  const [certEditId, setCertEditId]       = useState<string | null>(null);
  const [certDeleteConfirm, setCertDeleteConfirm] = useState<string | null>(null);
  const [certImageFile, setCertImageFile] = useState<File | null>(null);
  const [certImagePreview, setCertImagePreview] = useState('');
  const [certUploading, setCertUploading] = useState(false);

  /* ── WhatsApp ── */
  const [waLink, setWaLink]   = useState<string>(() => lsStr(LS_WA, 'https://wa.me/6281234567890'));
  const [waSaving, setWaSaving] = useState(false);

  /* ═══ HELPERS ═══ */
  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '10px 14px', color: 'var(--white)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', color: 'var(--white-dim)', fontSize: '0.78rem', fontWeight: 600,
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
  };
  const btnAmber: React.CSSProperties = {
    background: 'var(--amber)', color: 'var(--black)', border: 'none', borderRadius: '10px',
    padding: '10px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
  };
  const btnGhost: React.CSSProperties = {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--white-dim)',
    borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
  };
  const sectionCard: React.CSSProperties = {
    background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '16px', padding: '2rem',
  };
  const sectionHead = (icon: string, title: string, action?: React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{title}</h2>
      </div>
      {action}
    </div>
  );

  const saveLS = (key: string, data: unknown) => {
    const val = JSON.stringify(data);
    localStorage.setItem(key, val);
    dispatch(key, val);
  };

  /* ── About ── */
  const saveAbout = () => {
    setAboutSaving(true);
    saveLS(LS_ABOUT, about);
    setTimeout(() => { setAboutSaving(false); toast.success('Profil disimpan!'); }, 400);
  };

  const handleAboutPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAboutPhotoFile(file);
    setAboutPhotoPreview(URL.createObjectURL(file));
  };

  const uploadAboutPhoto = async () => {
    if (!aboutPhotoFile) return;
    setAboutPhotoUploading(true);
    try {
      toast.loading('Mengupload foto...');
      const url = await uploadToCloudinary(aboutPhotoFile);
      toast.dismiss();
      setAboutPhoto(url);
      setAboutPhotoPreview('');
      setAboutPhotoFile(null);
      localStorage.setItem(LS_ABOUT_PHOTO, url);
      dispatch(LS_ABOUT_PHOTO, url);
      toast.success('Foto berhasil diupload!');
    } catch {
      toast.dismiss();
      toast.error('Gagal upload foto.');
    } finally {
      setAboutPhotoUploading(false);
    }
  };

  /* ── Experience ── */
  const openAddExp = () => { setExpEditId(null); setExpForm({ id: Date.now().toString(), role: '', company: '', icon: '💼', tasks: '' }); };
  const openEditExp = (exp: ExpItem) => { setExpEditId(exp.id); setExpForm({ ...exp }); };
  const saveExp = () => {
    if (!expForm?.role.trim()) { toast.error('Role wajib diisi!'); return; }
    const updated = expEditId ? exps.map(e => e.id === expEditId ? expForm! : e) : [...exps, expForm!];
    setExps(updated); saveLS(LS_EXPS, updated); setExpForm(null); setExpEditId(null);
    toast.success(expEditId ? 'Experience diperbarui!' : 'Experience ditambahkan!');
  };
  const deleteExp = (id: string) => {
    const updated = exps.filter(e => e.id !== id);
    setExps(updated); saveLS(LS_EXPS, updated); setExpDeleteConfirm(null); toast.success('Experience dihapus.');
  };

  /* ── Education ── */
  const openAddEdu = () => { setEduEditId(null); setEduForm({ id: Date.now().toString(), school: '', year: '', major: '', score: '', icon: '🏫' }); };
  const openEditEdu = (edu: EduItem) => { setEduEditId(edu.id); setEduForm({ ...edu }); };
  const saveEdu = () => {
    if (!eduForm?.school.trim()) { toast.error('Nama sekolah wajib diisi!'); return; }
    const updated = eduEditId ? edus.map(e => e.id === eduEditId ? eduForm! : e) : [...edus, eduForm!];
    setEdus(updated); saveLS(LS_EDU, updated); setEduForm(null); setEduEditId(null);
    toast.success(eduEditId ? 'Education diperbarui!' : 'Education ditambahkan!');
  };
  const deleteEdu = (id: string) => {
    const updated = edus.filter(e => e.id !== id);
    setEdus(updated); saveLS(LS_EDU, updated); setEduDeleteConfirm(null); toast.success('Education dihapus.');
  };

  /* ── Sertifikasi ── */
  const openAddCert = () => {
    setCertEditId(null);
    setCertImageFile(null); setCertImagePreview('');
    setCertForm({ id: Date.now().toString(), title: '', issuer: '', items: '', imageUrl: '' });
  };
  const openEditCert = (cert: CertItem) => {
    setCertEditId(cert.id);
    setCertImageFile(null); setCertImagePreview(cert.imageUrl || '');
    setCertForm({ ...cert });
  };
  const handleCertImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertImageFile(file); setCertImagePreview(URL.createObjectURL(file));
  };
  const saveCert = async () => {
    if (!certForm?.title.trim()) { toast.error('Judul sertifikat wajib diisi!'); return; }
    let imageUrl = certForm.imageUrl;
    if (certImageFile) {
      setCertUploading(true);
      toast.loading('Mengupload gambar sertifikat...');
      try {
        imageUrl = await uploadToCloudinary(certImageFile);
        toast.dismiss();
      } catch {
        toast.dismiss(); toast.error('Gagal upload gambar.'); setCertUploading(false); return;
      }
      setCertUploading(false);
    }
    const updated = certEditId
      ? certs.map(c => c.id === certEditId ? { ...certForm!, imageUrl } : c)
      : [...certs, { ...certForm!, imageUrl }];
    setCerts(updated); saveLS(LS_CERT, updated); setCertForm(null); setCertEditId(null);
    setCertImageFile(null); setCertImagePreview('');
    toast.success(certEditId ? 'Sertifikasi diperbarui!' : 'Sertifikasi ditambahkan!');
  };
  const deleteCert = (id: string) => {
    const updated = certs.filter(c => c.id !== id);
    setCerts(updated); saveLS(LS_CERT, updated); setCertDeleteConfirm(null); toast.success('Sertifikasi dihapus.');
  };

  /* ── WhatsApp ── */
  const saveWa = () => {
    setWaSaving(true);
    localStorage.setItem(LS_WA, waLink); dispatch(LS_WA, waLink);
    setTimeout(() => { setWaSaving(false); toast.success('Link WhatsApp disimpan!'); }, 400);
  };

  /* ── Portfolio ── */
  const handleLogout = async () => { await logout(); navigate('/admin/login'); toast.success('Berhasil logout.'); };
  const openAdd = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setImagePreview(''); setImageFile(null); setShowForm(true); };
  const openEdit = (item: PortfolioItem) => {
    setForm({ title: item.title, category: item.category, description: item.description, imageUrl: item.imageUrl, tags: item.tags?.join(', ') || '', client: item.client, year: item.year, featured: item.featured, order: item.order });
    setImagePreview(item.imageUrl); setImageFile(null); setEditId(item.id); setShowForm(true);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Judul dan deskripsi wajib diisi!'); return; }
    setSubmitting(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) { setUploading(true); toast.loading('Mengupload gambar...'); imageUrl = await uploadToCloudinary(imageFile); toast.dismiss(); setUploading(false); }
      const payload = { title: form.title, category: form.category, description: form.description, imageUrl, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), client: form.client, year: form.year, featured: form.featured, order: Number(form.order) };
      if (editId) { await updateItem(editId, payload); toast.success('Project diperbarui!'); }
      else { await addItem(payload); toast.success('Project ditambahkan!'); }
      setShowForm(false);
    } catch (err: any) { toast.error('Gagal menyimpan: ' + err.message); }
    finally { setSubmitting(false); setUploading(false); }
  };
  const handleDelete = async (id: string) => {
    try { await deleteItem(id); toast.success('Project dihapus.'); setDeleteConfirm(null); }
    catch { toast.error('Gagal menghapus project.'); }
  };

  const stats = [
    { label: 'Total Project', value: items.length, icon: '📁' },
    { label: 'Featured',      value: items.filter(i => i.featured).length, icon: '⭐' },
    { label: 'Kategori',      value: Array.from(new Set(items.map(i => i.category))).length, icon: '🏷️' },
    { label: 'Status',        value: 'Aktif', icon: '✅' },
  ];

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'grid', gridTemplateColumns: '240px 1fr', fontFamily: 'var(--font-body)' }} className="admin-grid">

      {/* ── Sidebar ── */}
      <aside style={{ background: 'var(--black-2)', borderRight: '1px solid rgba(245,166,35,0.1)', padding: '2rem 1rem', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--amber)', fontSize: '1.3rem', letterSpacing: '2px', marginBottom: '0.2rem' }}>MFD-FBY's</div>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.75rem' }}>Admin Panel</p>
        </div>
        <div style={{ background: 'var(--black-3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(245,166,35,0.1)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>👤</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Mahfudfebry</div>
          <div style={{ color: 'var(--amber)', fontSize: '0.75rem' }}>Administrator</div>
        </div>
        {([
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'portfolio', icon: '📁', label: 'Portfolio CMS' },
          { id: 'settings', icon: '⚙️', label: 'Pengaturan' },
        ] as { id: Tab; icon: string; label: string }[]).map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            width: '100%', background: tab === item.id ? 'rgba(245,166,35,0.15)' : 'none',
            border: tab === item.id ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
            borderRadius: '10px', padding: '10px 14px', color: tab === item.id ? 'var(--amber)' : 'var(--white-dim)',
            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px', textAlign: 'left', transition: 'all 0.2s',
          }}>{item.icon} {item.label}</button>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '10px', padding: '10px 14px', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem' }}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ padding: '2rem', overflowY: 'auto' }}>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.3rem' }}>DASHBOARD</h1>
            <p style={{ color: 'var(--white-dim)', marginBottom: '2.5rem' }}>Selamat datang kembali, <span style={{ color: 'var(--amber)' }}>Mahfudfebry</span>!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {stats.map(stat => (
                <motion.div key={stat.label} whileHover={{ scale: 1.03 }} style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--amber)' }}>{stat.value}</div>
                  <div style={{ color: 'var(--white-dim)', fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio CMS */}
        {tab === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>PORTFOLIO CMS</h1>
              <motion.button onClick={openAdd} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={btnAmber}>+ Tambah Project</motion.button>
            </div>
            {loading ? (
              <p style={{ color: 'var(--white-dim)' }}>Memuat data...</p>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--white-dim)' }}>
                <p>Belum ada project. Klik "Tambah Project" untuk mulai.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {items.map(item => (
                  <motion.div key={item.id} layout style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.1)', borderRadius: '12px', padding: '1.2rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</span>
                        {item.featured && <span style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--amber)', borderRadius: '4px', padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700 }}>⭐ Featured</span>}
                      </div>
                      <span style={{ color: 'var(--amber)', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(245,166,35,0.08)', borderRadius: '4px', padding: '1px 8px' }}>{item.category}</span>
                      {item.client && <span style={{ color: 'var(--white-dim)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>— {item.client}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(item)} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', color: 'var(--amber)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>✏️ Edit</button>
                      <button onClick={() => setDeleteConfirm(item.id)} style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', color: '#ff6b6b', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>🗑️</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>PENGATURAN</h1>

            {/* ── 1. ABOUT ME ── */}
            <div style={sectionCard}>
              {sectionHead('👤', 'EDIT ABOUT ME')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Foto Upload */}
                <div style={{ background: 'var(--black-3)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(245,166,35,0.1)' }}>
                  <label style={{ ...labelStyle, marginBottom: '1rem', fontSize: '0.85rem' }}>📸 Foto Profil About Me</label>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Preview current/new */}
                    <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(245,166,35,0.3)', flexShrink: 0, background: '#111' }}>
                      {(aboutPhotoPreview || aboutPhoto) ? (
                        <img src={aboutPhotoPreview || aboutPhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white-dim)', fontSize: '2rem' }}>👤</div>
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div>
                        <label style={labelStyle}>Pilih Foto Baru</label>
                        <input type="file" accept="image/*" onChange={handleAboutPhotoChange} style={{ ...inputStyle, padding: '8px' }} />
                        <p style={{ color: 'var(--white-dim)', fontSize: '0.75rem', marginTop: '5px' }}>Format: JPG, PNG, WEBP. Akan diupload ke Cloudinary.</p>
                      </div>
                      <motion.button
                        onClick={uploadAboutPhoto}
                        disabled={!aboutPhotoFile || aboutPhotoUploading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        style={{ ...btnAmber, opacity: (!aboutPhotoFile || aboutPhotoUploading) ? 0.5 : 1, cursor: (!aboutPhotoFile || aboutPhotoUploading) ? 'not-allowed' : 'pointer', alignSelf: 'flex-start' }}
                      >
                        {aboutPhotoUploading ? '⌛ Mengupload...' : '☁️ Upload Foto'}
                      </motion.button>
                      {aboutPhoto && !aboutPhotoPreview && (
                        <p style={{ color: '#4ade80', fontSize: '0.78rem' }}>✅ Foto aktif tersimpan di Cloudinary</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Nama</label>
                    <input style={inputStyle} value={about.name} onChange={e => setAbout({ ...about, name: e.target.value })} placeholder="Nama lengkap" />
                  </div>
                  <div>
                    <label style={labelStyle}>Lokasi</label>
                    <input style={inputStyle} value={about.location} onChange={e => setAbout({ ...about, location: e.target.value })} placeholder="Kota, Negara" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Bio Paragraf 1</label>
                  <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={about.bio1} onChange={e => setAbout({ ...about, bio1: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Bio Paragraf 2</label>
                  <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={about.bio2} onChange={e => setAbout({ ...about, bio2: e.target.value })} />
                </div>
                <motion.button onClick={saveAbout} disabled={aboutSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ ...btnAmber, alignSelf: 'flex-start', opacity: aboutSaving ? 0.5 : 1, cursor: aboutSaving ? 'not-allowed' : 'pointer' }}>
                  {aboutSaving ? '⌛ Menyimpan...' : '💾 Simpan Profil'}
                </motion.button>
              </div>
            </div>

            {/* ── 2. EDUCATION ── */}
            <div style={sectionCard}>
              {sectionHead('🎓', 'EDUCATION',
                <motion.button onClick={openAddEdu} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={btnAmber}>+ Tambah</motion.button>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {edus.map(edu => (
                  <div key={edu.id} style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.1)', borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{edu.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{edu.school} — {edu.year}</div>
                      <div style={{ color: 'var(--amber)', fontSize: '0.82rem', fontWeight: 600 }}>{edu.major}</div>
                      <div style={{ color: 'var(--white-dim)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{edu.score}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => openEditEdu(edu)} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', color: 'var(--amber)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>✏️ Edit</button>
                      <button onClick={() => setEduDeleteConfirm(edu.id)} style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', color: '#ff6b6b', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                {edus.length === 0 && <p style={{ color: 'var(--white-dim)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>Belum ada data education.</p>}
              </div>
            </div>

            {/* ── 3. SERTIFIKASI ── */}
            <div style={sectionCard}>
              {sectionHead('📜', 'SERTIFIKASI',
                <motion.button onClick={openAddCert} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={btnAmber}>+ Tambah</motion.button>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {certs.map(cert => (
                  <div key={cert.id} style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.1)', borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {cert.imageUrl ? (
                      <img src={cert.imageUrl} alt={cert.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: '1px solid rgba(245,166,35,0.2)' }} />
                    ) : (
                      <div style={{ width: '60px', height: '45px', background: 'rgba(245,166,35,0.08)', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📜</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{cert.title}</div>
                      <div style={{ color: 'var(--amber)', fontSize: '0.82rem', fontWeight: 600 }}>{cert.issuer}</div>
                      <div style={{ color: 'var(--white-dim)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{cert.items}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => openEditCert(cert)} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', color: 'var(--amber)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>✏️ Edit</button>
                      <button onClick={() => setCertDeleteConfirm(cert.id)} style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', color: '#ff6b6b', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                {certs.length === 0 && <p style={{ color: 'var(--white-dim)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>Belum ada data sertifikasi.</p>}
              </div>
            </div>

            {/* ── 4. EXPERIENCE ── */}
            <div style={sectionCard}>
              {sectionHead('💼', 'EXPERIENCE',
                <motion.button onClick={openAddExp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={btnAmber}>+ Tambah</motion.button>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {exps.map(exp => (
                  <div key={exp.id} style={{ background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.1)', borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{exp.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{exp.role}</div>
                      <div style={{ color: 'var(--amber)', fontSize: '0.82rem', fontWeight: 600 }}>{exp.company}</div>
                      <div style={{ color: 'var(--white-dim)', fontSize: '0.78rem', marginTop: '0.3rem' }}>{exp.tasks}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => openEditExp(exp)} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', color: 'var(--amber)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>✏️ Edit</button>
                      <button onClick={() => setExpDeleteConfirm(exp.id)} style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)', color: '#ff6b6b', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                {exps.length === 0 && <p style={{ color: 'var(--white-dim)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>Belum ada data experience.</p>}
              </div>
            </div>

            {/* ── 5. WHATSAPP ── */}
            <div style={sectionCard}>
              {sectionHead('📱', 'KONTAK WHATSAPP')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Link WhatsApp (wa.me/62xxxxxxx)</label>
                  <input style={inputStyle} value={waLink} onChange={e => setWaLink(e.target.value)} placeholder="https://wa.me/6281234567890" />
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.78rem', marginTop: '6px' }}>Format: <code style={{ color: 'var(--amber)' }}>https://wa.me/62xxxxxxxxxx</code></p>
                </div>
                {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontSize: '0.85rem', fontWeight: 600 }}>✅ Preview link →</a>}
                <motion.button onClick={saveWa} disabled={waSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ ...btnAmber, alignSelf: 'flex-start', opacity: waSaving ? 0.5 : 1, cursor: waSaving ? 'not-allowed' : 'pointer' }}>
                  {waSaving ? '⌛ Menyimpan...' : '💾 Simpan Link WA'}
                </motion.button>
              </div>
            </div>

            {/* ── 6. INFO AKUN ── */}
            <div style={{ ...sectionCard, border: '1px solid rgba(245,166,35,0.1)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Informasi Akun</h3>
              <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Username: <strong style={{ color: 'var(--amber)' }}>Mahfudfebry</strong><br />
                Email: <strong style={{ color: 'var(--amber)' }}>mahfudfebry@hikimori.web.id</strong><br />
                Role: <strong style={{ color: 'var(--amber)' }}>Administrator</strong>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ════ MODALS ════ */}

      {/* Portfolio Add/Edit */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto' }}
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{editId ? 'EDIT PROJECT' : 'TAMBAH PROJECT'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--white-dim)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={labelStyle}>Judul Project *</label><input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nama project" required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>Kategori</label>
                    <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {['HR', 'Administrasi', 'IT Support', 'Desain', 'Branding'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Tahun</label><input style={inputStyle} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                </div>
                <div><label style={labelStyle}>Deskripsi *</label><textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
                <div><label style={labelStyle}>Client / Perusahaan</label><input style={inputStyle} value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></div>
                <div><label style={labelStyle}>Tags (pisahkan dengan koma)</label><input style={inputStyle} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
                <div>
                  <label style={labelStyle}>Gambar Upload (Cloudinary)</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ ...inputStyle, padding: '8px' }} />
                  {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div><label style={labelStyle}>Urutan Tampil</label><input type="number" style={inputStyle} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: '1.5rem' }}>
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--amber)' }} />
                    <label htmlFor="featured" style={{ color: 'var(--white-dim)', cursor: 'pointer', fontWeight: 600 }}>Featured</label>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <motion.button type="submit" disabled={submitting || uploading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ ...btnAmber, flex: 1, padding: '13px', fontSize: '0.95rem', opacity: submitting ? 0.5 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? '⌛ Menyimpan...' : editId ? '💾 Update' : '➕ Tambah'}
                  </motion.button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ ...btnGhost, padding: '13px 20px' }}>Batal</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', maxWidth: '380px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.6rem' }}>HAPUS PROJECT?</h3>
              <p style={{ color: 'var(--white-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tindakan ini tidak dapat dibatalkan.</p>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button onClick={() => handleDelete(deleteConfirm!)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)' }}>Ya, Hapus</button>
                <button onClick={() => setDeleteConfirm(null)} style={{ ...btnGhost, borderRadius: '8px', padding: '10px 24px' }}>Batal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Add/Edit Modal */}
      <AnimatePresence>
        {eduForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={e => { if (e.target === e.currentTarget) setEduForm(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{eduEditId ? 'EDIT EDUCATION' : 'TAMBAH EDUCATION'}</h2>
                <button onClick={() => setEduForm(null)} style={{ background: 'none', border: 'none', color: 'var(--white-dim)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
                  <div><label style={labelStyle}>Nama Sekolah / Universitas *</label><input style={inputStyle} value={eduForm.school} onChange={e => setEduForm({ ...eduForm, school: e.target.value })} placeholder="Contoh: ITB ASIA Malang" /></div>
                  <div><label style={labelStyle}>Icon (emoji)</label><input style={{ ...inputStyle, width: '70px' }} value={eduForm.icon} onChange={e => setEduForm({ ...eduForm, icon: e.target.value })} maxLength={4} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label style={labelStyle}>Tahun / Kota</label><input style={inputStyle} value={eduForm.year} onChange={e => setEduForm({ ...eduForm, year: e.target.value })} placeholder="2024" /></div>
                  <div><label style={labelStyle}>Nilai / IPK</label><input style={inputStyle} value={eduForm.score} onChange={e => setEduForm({ ...eduForm, score: e.target.value })} placeholder="IPK 3.5" /></div>
                </div>
                <div><label style={labelStyle}>Jurusan / Program Studi</label><input style={inputStyle} value={eduForm.major} onChange={e => setEduForm({ ...eduForm, major: e.target.value })} placeholder="S1 – Teknik Informatika" /></div>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <motion.button onClick={saveEdu} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...btnAmber, flex: 1, padding: '13px' }}>{eduEditId ? '💾 Update' : '➕ Tambah'}</motion.button>
                  <button onClick={() => setEduForm(null)} style={{ ...btnGhost, padding: '13px 20px' }}>Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Delete Confirm */}
      <AnimatePresence>
        {eduDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 3100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', maxWidth: '360px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.6rem' }}>HAPUS EDUCATION?</h3>
              <p style={{ color: 'var(--white-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tindakan ini tidak dapat dibatalkan.</p>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button onClick={() => deleteEdu(eduDeleteConfirm!)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)' }}>Ya, Hapus</button>
                <button onClick={() => setEduDeleteConfirm(null)} style={{ ...btnGhost, borderRadius: '8px', padding: '10px 24px' }}>Batal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sertifikasi Add/Edit Modal */}
      <AnimatePresence>
        {certForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={e => { if (e.target === e.currentTarget) setCertForm(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{certEditId ? 'EDIT SERTIFIKASI' : 'TAMBAH SERTIFIKASI'}</h2>
                <button onClick={() => setCertForm(null)} style={{ background: 'none', border: 'none', color: 'var(--white-dim)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={labelStyle}>Judul Sertifikat *</label><input style={inputStyle} value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })} placeholder="Certified Human Resource Officer" /></div>
                <div><label style={labelStyle}>Penerbit / Issuer</label><input style={inputStyle} value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="BNSP, LSP, Coursera, dll." /></div>
                <div>
                  <label style={labelStyle}>Kompetensi (pisahkan dengan koma)</label>
                  <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={certForm.items} onChange={e => setCertForm({ ...certForm, items: e.target.value })} placeholder="Analisa Beban Kerja, Payroll, BPJS, ..." />
                </div>

                {/* Upload Gambar Sertifikat */}
                <div style={{ background: 'var(--black-3)', borderRadius: '10px', padding: '1.2rem', border: '1px solid rgba(245,166,35,0.1)' }}>
                  <label style={{ ...labelStyle, marginBottom: '0.8rem' }}>📎 Upload Gambar Sertifikat</label>
                  {(certImagePreview || certForm.imageUrl) && (
                    <div style={{ marginBottom: '0.8rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(245,166,35,0.2)', maxHeight: '160px' }}>
                      <img src={certImagePreview || certForm.imageUrl} alt="Preview sertifikat" style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', background: '#0a0a0a' }} />
                    </div>
                  )}
                  <input type="file" accept="image/*,.pdf" onChange={handleCertImageChange} style={{ ...inputStyle, padding: '8px' }} />
                  <p style={{ color: 'var(--white-dim)', fontSize: '0.75rem', marginTop: '6px' }}>Format: JPG, PNG, WEBP. Diupload ke Cloudinary dan ditampilkan di halaman About.</p>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <motion.button onClick={saveCert} disabled={certUploading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ ...btnAmber, flex: 1, padding: '13px', opacity: certUploading ? 0.5 : 1, cursor: certUploading ? 'not-allowed' : 'pointer' }}>
                    {certUploading ? '⌛ Mengupload...' : certEditId ? '💾 Update' : '➕ Tambah'}
                  </motion.button>
                  <button onClick={() => setCertForm(null)} style={{ ...btnGhost, padding: '13px 20px' }}>Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sertifikasi Delete Confirm */}
      <AnimatePresence>
        {certDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 3100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', maxWidth: '360px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.6rem' }}>HAPUS SERTIFIKASI?</h3>
              <p style={{ color: 'var(--white-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tindakan ini tidak dapat dibatalkan.</p>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button onClick={() => deleteCert(certDeleteConfirm!)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)' }}>Ya, Hapus</button>
                <button onClick={() => setCertDeleteConfirm(null)} style={{ ...btnGhost, borderRadius: '8px', padding: '10px 24px' }}>Batal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Add/Edit Modal */}
      <AnimatePresence>
        {expForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={e => { if (e.target === e.currentTarget) setExpForm(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{expEditId ? 'EDIT EXPERIENCE' : 'TAMBAH EXPERIENCE'}</h2>
                <button onClick={() => setExpForm(null)} style={{ background: 'none', border: 'none', color: 'var(--white-dim)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={labelStyle}>Role / Jabatan *</label><input style={inputStyle} value={expForm.role} onChange={e => setExpForm({ ...expForm, role: e.target.value })} placeholder="HR / General Affairs" /></div>
                <div><label style={labelStyle}>Perusahaan</label><input style={inputStyle} value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} /></div>
                <div><label style={labelStyle}>Icon (emoji)</label><input style={{ ...inputStyle, width: '80px' }} value={expForm.icon} onChange={e => setExpForm({ ...expForm, icon: e.target.value })} maxLength={4} /></div>
                <div><label style={labelStyle}>Tasks (pisahkan dengan koma)</label><textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={expForm.tasks} onChange={e => setExpForm({ ...expForm, tasks: e.target.value })} /></div>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <motion.button onClick={saveExp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ ...btnAmber, flex: 1, padding: '13px' }}>{expEditId ? '💾 Update' : '➕ Tambah'}</motion.button>
                  <button onClick={() => setExpForm(null)} style={{ ...btnGhost, padding: '13px 20px' }}>Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Delete Confirm */}
      <AnimatePresence>
        {expDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 3100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', maxWidth: '360px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.6rem' }}>HAPUS EXPERIENCE?</h3>
              <p style={{ color: 'var(--white-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tindakan ini tidak dapat dibatalkan.</p>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button onClick={() => deleteExp(expDeleteConfirm!)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)' }}>Ya, Hapus</button>
                <button onClick={() => setExpDeleteConfirm(null)} style={{ ...btnGhost, borderRadius: '8px', padding: '10px 24px' }}>Batal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          aside { position: relative !important; height: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
