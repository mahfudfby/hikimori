// src/pages/AdminPanel.tsx — Full CMS: Home, About, Skills, Experience, Portfolio, Contact, Settings
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolio, PortfolioItem } from '../hooks/usePortfolio';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ─── localStorage Keys ─── */
const LS_HOME    = 'hk_home_data';
const LS_ABOUT   = 'hk_home_about_data';
const LS_SKILLS  = 'hk_skills_data';
const LS_EXP     = 'hk_experience_data';
const LS_CONTACT = 'hk_contact_data';
const LS_CERT    = 'hk_cert_data';

/* ─── Types ─── */
interface HomeData    { heroTitle:string; heroSubtitle:string; heroTagline:string; heroCtaSecondary:string; heroCtaSecondaryLink:string; heroCta:string; heroCtaLink:string; heroPhotoUrl:string; heroTagRight:string; }
interface AboutData   { name:string; location:string; bio1:string; bio2:string; photoUrl:string; }
interface SkillItem   { id:string; number:string; title:string; desc:string; }
interface ExpItem     { id:string; position:string; company:string; period:string; icon:string; tags:string; }
interface ContactData { email:string; location:string; website:string; instagram:string; linkedin:string; twitter:string; }
interface CertItem    { id:string; name:string; year:string; issuer:string; subtitle:string; imageUrl:string; }

/* ─── Defaults ─── */
const D_HOME:    HomeData    = { heroTitle:'Shaping tomorrow', heroSubtitle:'with vision and action.', heroTagline:'We back visionaries and craft ventures that define what comes next.', heroCtaSecondary:'Start a Chat', heroCtaSecondaryLink:'#contact', heroCta:'Explore Now', heroCtaLink:'/portofolio', heroPhotoUrl:'', heroTagRight:'Investing. Building. Advisory.' };
const D_ABOUT:   AboutData   = { name:'Mahfudfebry', location:'Nganjuk, Indonesia', bio1:'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia.', bio2:'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik.', photoUrl:'' };
const D_SKILLS:  SkillItem[] = [
  { id:'1', number:'01', title:'Branding & Identity Design', desc:"Crafting memorable logos and visual systems." },
  { id:'2', number:'02', title:'Creativity & Problem-Solving', desc:'Thinking outside the box while solving design challenges.' },
  { id:'3', number:'03', title:'Concept Development', desc:'Skilled in brainstorming and translating abstract ideas.' },
  { id:'4', number:'04', title:'Proper Time Management', desc:'Capable of handling multiple projects and meeting deadlines.' },
];
const D_EXP: ExpItem[] = [
  { id:'1', position:'HR / General Affairs', company:'UD Duta Pangan', period:'2020–2023', icon:'👥', tags:'Vendor Management,Stock Monitoring,Facility Maintenance' },
  { id:'2', position:'Staff Administrasi',   company:'UD Duta Pangan', period:'2020–2023', icon:'📋', tags:'Document Processing,Administrative Support,Filing' },
  { id:'3', position:'IT Support',           company:'UD Duta Pangan', period:'2020–2023', icon:'💻', tags:'Hardware Troubleshooting,Software Installation,Network Setup' },
];
const D_CONTACT: ContactData = { email:'mahfudfebry@hikimori.web.id', location:'Nganjuk, Indonesia', website:'hikimori.web.id', instagram:'', linkedin:'', twitter:'' };
const D_CERT: CertItem[] = [
  { id:'1', name:'Google Digital Marketing', year:'2023', issuer:'Google', subtitle:'Fundamentals of Digital Marketing', imageUrl:'' },
];

const ls = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
const save = (key: string, val: any) => {
  const json = JSON.stringify(val);
  localStorage.setItem(key, json);
  // Same-tab update via CustomEvent (StorageEvent only fires cross-tab)
  window.dispatchEvent(new CustomEvent('hk-update', { detail: { key, value: json } }));
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

type Tab = 'dashboard'|'home'|'about'|'skills'|'experience'|'sertifikasi'|'portfolio'|'contact'|'settings';

/* ─── Styles ─── */
const inp: React.CSSProperties = { width:'100%', background:'#111', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'var(--white)', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
const lbl: React.CSSProperties = { display:'block', color:'var(--white-dim)', fontSize:'0.75rem', fontWeight:600, marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' };
const card: React.CSSProperties = { background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.1)', borderRadius:14, padding:'1.5rem', marginBottom:'1rem' };
const btn = (primary?: boolean): React.CSSProperties => ({ background: primary ? 'var(--amber)' : 'transparent', color: primary ? 'var(--black)' : 'var(--white-dim)', border: primary ? 'none' : '1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'10px 20px', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.88rem', cursor:'pointer' });

const EMPTY_PORT = { title:'', category:'HR', description:'', imageUrl:'', tags:'', client:'', year:new Date().getFullYear().toString(), featured:false, order:0 };

/* ─── ImageUploader helper ─── */
const ImageUploader: React.FC<{ value:string; onChange:(url:string)=>void; label?:string }> = ({ value, onChange, label='Foto / Gambar' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  useEffect(() => { setPreview(value); }, [value]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url); setPreview(url);
      toast.success('Gambar berhasil diupload!');
    } catch { toast.error('Gagal upload gambar.'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label style={lbl}>{label}</label>
      {preview && <img src={preview} alt="preview" style={{ width:'100%', maxHeight:160, objectFit:'cover', borderRadius:8, marginBottom:8 }} />}
      <input type="file" accept="image/*" onChange={handleFile} style={{ ...inp, padding:'8px' }} />
      {uploading && <p style={{ color:'var(--amber)', fontSize:'0.8rem', marginTop:4 }}>⌛ Mengupload...</p>}
      <input type="text" placeholder="Atau paste URL gambar" value={preview !== value ? '' : value} onChange={e => { onChange(e.target.value); setPreview(e.target.value); }} style={{ ...inp, marginTop:6, fontSize:'0.82rem' }} />
    </div>
  );
};

/* ══════════════════════════════════
   ADMIN PANEL
══════════════════════════════════ */
const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const { items, loading, addItem, updateItem, deleteItem } = usePortfolio();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');

  /* Home */
  const [home, setHome] = useState<HomeData>(() => ls(LS_HOME, D_HOME));
  const [homeSaving, setHomeSaving] = useState(false);

  /* About */
  const [about, setAbout] = useState<AboutData>(() => ls(LS_ABOUT, D_ABOUT));
  const [aboutSaving, setAboutSaving] = useState(false);

  /* Skills */
  const [skills, setSkills] = useState<SkillItem[]>(() => ls(LS_SKILLS, D_SKILLS));
  const [skillForm, setSkillForm] = useState<SkillItem|null>(null);

  /* Experience */
  const [exps, setExps] = useState<ExpItem[]>(() => ls(LS_EXP, D_EXP));
  const [expForm, setExpForm] = useState<ExpItem|null>(null);

  /* Portfolio */
  const [portForm, setPortForm] = useState({ ...EMPTY_PORT });
  const [portEditId, setPortEditId] = useState<string|null>(null);
  const [portModal, setPortModal] = useState(false);
  const [portImgFile, setPortImgFile] = useState<File|null>(null);
  const [portImgPreview, setPortImgPreview] = useState('');
  const [portSubmitting, setPortSubmitting] = useState(false);
  const [delConfirm, setDelConfirm] = useState<string|null>(null);

  /* Sertifikasi */
  const [certs, setCerts] = useState<CertItem[]>(() => ls(LS_CERT, D_CERT));
  const [certForm, setCertForm] = useState<CertItem|null>(null);

  /* Contact */
  const [contact, setContact] = useState<ContactData>(() => ls(LS_CONTACT, D_CONTACT));
  const [contactSaving, setContactSaving] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/admin/login'); toast.success('Berhasil logout.'); };

  /* ── SAVE helpers ── */
  const saveHome = () => { setHomeSaving(true); save(LS_HOME, home); setTimeout(() => { setHomeSaving(false); toast.success('Halaman Hero disimpan!'); }, 400); };
  const saveAbout = () => { setAboutSaving(true); save(LS_ABOUT, about); setTimeout(() => { setAboutSaving(false); toast.success('About Me disimpan!'); }, 400); };
  /* ── Cert CRUD ── */
  const saveCert = () => {
    if (!certForm) return;
    const updated = certForm.id && certs.find(c => c.id === certForm.id)
      ? certs.map(c => c.id === certForm.id ? certForm : c)
      : [...certs, { ...certForm, id: uid() }];
    setCerts(updated); save(LS_CERT, updated); setCertForm(null); toast.success('Sertifikasi disimpan!');
  };
  const deleteCert = (id: string) => { const u = certs.filter(c => c.id !== id); setCerts(u); save(LS_CERT, u); toast.success('Sertifikasi dihapus.'); };

  const saveContact = () => { setContactSaving(true); save(LS_CONTACT, contact); setTimeout(() => { setContactSaving(false); toast.success('Info Kontak disimpan!'); }, 400); };

  /* ── Skills CRUD ── */
  const saveSkill = () => {
    if (!skillForm) return;
    const updated = skillForm.id && skills.find(s => s.id === skillForm.id)
      ? skills.map(s => s.id === skillForm.id ? skillForm : s)
      : [...skills, { ...skillForm, id: uid() }];
    setSkills(updated); save(LS_SKILLS, updated); setSkillForm(null); toast.success('Skill disimpan!');
  };
  const deleteSkill = (id: string) => { const u = skills.filter(s => s.id !== id); setSkills(u); save(LS_SKILLS, u); toast.success('Skill dihapus.'); };

  /* ── Experience CRUD ── */
  const saveExp = () => {
    if (!expForm) return;
    const updated = expForm.id && exps.find(e => e.id === expForm.id)
      ? exps.map(e => e.id === expForm.id ? expForm : e)
      : [...exps, { ...expForm, id: uid() }];
    setExps(updated); save(LS_EXP, updated); setExpForm(null); toast.success('Pengalaman disimpan!');
  };
  const deleteExp = (id: string) => { const u = exps.filter(e => e.id !== id); setExps(u); save(LS_EXP, u); toast.success('Pengalaman dihapus.'); };

  /* ── Portfolio CRUD ── */
  const openPortAdd = () => { setPortForm({ ...EMPTY_PORT }); setPortEditId(null); setPortImgPreview(''); setPortImgFile(null); setPortModal(true); };
  const openPortEdit = (item: PortfolioItem) => { setPortForm({ title:item.title, category:item.category, description:item.description, imageUrl:item.imageUrl, tags:item.tags?.join(', ')||'', client:item.client, year:item.year, featured:item.featured, order:item.order }); setPortImgPreview(item.imageUrl); setPortImgFile(null); setPortEditId(item.id); setPortModal(true); };
  const handlePortSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!portForm.title) { toast.error('Judul wajib diisi!'); return; }
    setPortSubmitting(true);
    try {
      let imageUrl = portForm.imageUrl;
      if (portImgFile) { imageUrl = await uploadToCloudinary(portImgFile); }
      const payload = { ...portForm, imageUrl, tags: portForm.tags.split(',').map(t=>t.trim()).filter(Boolean), order: Number(portForm.order) };
      if (portEditId) { await updateItem(portEditId, payload); toast.success('Project diperbarui!'); }
      else { await addItem(payload); toast.success('Project ditambahkan!'); }
      setPortModal(false);
    } catch (err: any) { toast.error('Gagal: ' + err.message); }
    finally { setPortSubmitting(false); }
  };
  const handleDelete = async (id: string) => { try { await deleteItem(id); toast.success('Dihapus.'); setDelConfirm(null); } catch { toast.error('Gagal menghapus.'); } };

  const stats = [
    { label:'Total Portfolio', value:items.length, icon:'📁' },
    { label:'Featured', value:items.filter(i=>i.featured).length, icon:'⭐' },
    { label:'Skills', value:skills.length, icon:'💡' },
    { label:'Pengalaman', value:exps.length, icon:'🏢' },
  ];

  const tabs: { id:Tab; icon:string; label:string }[] = [
    { id:'dashboard',  icon:'📊', label:'Dashboard'    },
    { id:'home',       icon:'🏠', label:'Hero Home'    },
    { id:'about',      icon:'👤', label:'About Me'     },
    { id:'skills',     icon:'💡', label:'Skills'       },
    { id:'experience', icon:'🏢', label:'Pengalaman'   },
    { id:'portfolio',  icon:'📁', label:'Portfolio'    },
    { id:'sertifikasi', icon:'🎓', label:'Sertifikasi'  },
    { id:'contact',    icon:'📬', label:'Kontak'       },
    { id:'settings',   icon:'⚙️', label:'Settings'     },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--black)', fontFamily:'var(--font-body)' }}>
      {/* Mobile top bar */}
      <div id="admin-topbar" style={{ display:'none', background:'var(--black-2)', borderBottom:'1px solid rgba(245,166,35,0.15)', padding:'12px 16px', position:'sticky', top:0, zIndex:100, alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:'var(--font-display)', color:'var(--amber)', fontSize:'1.2rem', letterSpacing:'2px' }}>MFD-FBY's Admin</span>
        <button onClick={handleLogout} style={{ background:'rgba(255,60,60,0.15)', border:'none', borderRadius:8, color:'#ff6b6b', padding:'6px 12px', cursor:'pointer', fontWeight:600, fontSize:'0.8rem' }}>Logout</button>
      </div>

      {/* Mobile Tab Bar */}
      <div id="admin-tabbar" style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:'var(--black-2)', borderTop:'1px solid rgba(245,166,35,0.15)', overflowX:'auto', WebkitOverflowScrolling:'touch' as any }}>
        <div style={{ display:'flex', minWidth:'max-content', padding:'4px 8px', gap:2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab===t.id ? 'rgba(245,166,35,0.15)' : 'none', border:'none', borderRadius:8, padding:'8px 10px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:2, minWidth:56 }}>
              <span style={{ fontSize:'1.1rem' }}>{t.icon}</span>
              <span style={{ fontSize:'0.6rem', color: tab===t.id ? 'var(--amber)' : 'var(--white-dim)', fontWeight:600, whiteSpace:'nowrap' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', minHeight:'100vh' }}>
        {/* ── Desktop Sidebar ── */}
        <aside id="admin-sidebar" style={{ width:220, background:'var(--black-2)', borderRight:'1px solid rgba(245,166,35,0.1)', padding:'1.5rem 0.8rem', position:'sticky', top:0, height:'100vh', overflowY:'auto', flexShrink:0 }}>
          <div style={{ marginBottom:'1.5rem', paddingLeft:'0.4rem' }}>
            <div style={{ fontFamily:'var(--font-display)', color:'var(--amber)', fontSize:'1.2rem', letterSpacing:'2px' }}>MFD-FBY's</div>
            <p style={{ color:'var(--white-dim)', fontSize:'0.72rem' }}>Admin Panel</p>
          </div>
          <div style={{ background:'var(--black-3)', borderRadius:10, padding:'0.8rem', marginBottom:'1.2rem', border:'1px solid rgba(245,166,35,0.1)' }}>
            <div style={{ fontSize:'1.2rem', marginBottom:'0.2rem' }}>👤</div>
            <div style={{ fontWeight:700, fontSize:'0.82rem' }}>Mahfudfebry</div>
            <div style={{ color:'var(--amber)', fontSize:'0.72rem' }}>Administrator</div>
          </div>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width:'100%', background: tab===t.id ? 'rgba(245,166,35,0.15)' : 'none', border: tab===t.id ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent', borderRadius:9, padding:'9px 12px', color: tab===t.id ? 'var(--amber)' : 'var(--white-dim)', display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.83rem', marginBottom:3, textAlign:'left' }}>
              {t.icon} {t.label}
            </button>
          ))}
          <div style={{ marginTop:'1.5rem' }}>
            <button onClick={handleLogout} style={{ width:'100%', background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.2)', borderRadius:9, padding:'9px 12px', color:'#ff6b6b', display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.83rem' }}>🚪 Logout</button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex:1, padding:'clamp(1rem,3vw,2rem)', overflowY:'auto', paddingBottom:80 }}>

          {/* ── Dashboard ── */}
          {tab === 'dashboard' && (
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.3rem' }}>DASHBOARD</h1>
              <p style={{ color:'var(--white-dim)', marginBottom:'2rem', fontSize:'0.9rem' }}>Selamat datang, <span style={{ color:'var(--amber)' }}>Mahfudfebry</span>!</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'0.8rem', marginBottom:'2rem' }}>
                {stats.map(s => (
                  <div key={s.label} style={{ background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:12, padding:'1.2rem', textAlign:'center' }}>
                    <div style={{ fontSize:'1.8rem', marginBottom:'0.3rem' }}>{s.icon}</div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--amber)', lineHeight:1 }}>{s.value}</div>
                    <div style={{ color:'var(--white-dim)', fontSize:'0.75rem', marginTop:3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={card}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:'1rem' }}>MENU CEPAT</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'0.6rem' }}>
                  {tabs.filter(t => t.id !== 'dashboard').map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.15)', borderRadius:10, padding:'12px 8px', color:'var(--amber)', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.8rem', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:'1.4rem' }}>{t.icon}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HERO HOME ── */}
          {tab === 'home' && (
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.3rem' }}>HERO HOME</h1>
              <p style={{ color:'var(--white-dim)', marginBottom:'1.5rem', fontSize:'0.88rem' }}>Edit konten utama halaman beranda.</p>
              {/* Live preview hint */}
              <div style={{ background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:'1rem', fontSize:'0.82rem', color:'var(--amber)' }}>
                ⚡ Perubahan langsung tampil di halaman Home setelah klik Simpan.
              </div>
              <div style={card}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:'1rem', color:'var(--amber)' }}>✏️ TEKS HEADING</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <div>
                    <label style={lbl}>Judul Baris 1 — tampil di baris pertama heading</label>
                    <input style={inp} value={home.heroTitle} onChange={e => setHome({ ...home, heroTitle:e.target.value })} placeholder="Shaping tomorrow" />
                    <p style={{ color:'var(--white-dim)', fontSize:'0.75rem', marginTop:4 }}>Preview: <em style={{ color:'var(--amber)' }}>{home.heroTitle || 'Shaping tomorrow'}</em></p>
                  </div>
                  <div>
                    <label style={lbl}>Judul Baris 2 — tampil di baris kedua heading</label>
                    <input style={inp} value={home.heroSubtitle} onChange={e => setHome({ ...home, heroSubtitle:e.target.value })} placeholder="with vision and action." />
                    <p style={{ color:'var(--white-dim)', fontSize:'0.75rem', marginTop:4 }}>Preview: <em style={{ color:'var(--amber)' }}>{home.heroSubtitle || 'with vision and action.'}</em></p>
                  </div>
                  <div>
                    <label style={lbl}>Tagline / Deskripsi di bawah heading</label>
                    <textarea style={{ ...inp, minHeight:70, resize:'vertical' }} value={home.heroTagline} onChange={e => setHome({ ...home, heroTagline:e.target.value })} placeholder="We back visionaries..." />
                  </div>
                  <div>
                    <label style={lbl}>Teks Tag Kanan (pojok kanan bawah hero)</label>
                    <input style={inp} value={home.heroTagRight} onChange={e => setHome({ ...home, heroTagRight:e.target.value })} placeholder="Investing. Building. Advisory." />
                    <p style={{ color:'var(--white-dim)', fontSize:'0.75rem', marginTop:4 }}>Ini teks di dalam card glass pojok kanan bawah.</p>
                  </div>
                </div>
              </div>
              <div style={card}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:'1rem', color:'var(--amber)' }}>🔘 TOMBOL CTA</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
                    <div>
                      <label style={lbl}>Tombol Kiri (putih) — Teks</label>
                      <input style={inp} value={home.heroCtaSecondary} onChange={e => setHome({ ...home, heroCtaSecondary:e.target.value })} placeholder="Start a Chat" />
                    </div>
                    <div>
                      <label style={lbl}>Tombol Kiri — Link / Anchor</label>
                      <input style={inp} value={home.heroCtaSecondaryLink} onChange={e => setHome({ ...home, heroCtaSecondaryLink:e.target.value })} placeholder="#contact" />
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
                    <div>
                      <label style={lbl}>Tombol Kanan (glass) — Teks</label>
                      <input style={inp} value={home.heroCta} onChange={e => setHome({ ...home, heroCta:e.target.value })} placeholder="Explore Now" />
                    </div>
                    <div>
                      <label style={lbl}>Tombol Kanan — Link</label>
                      <input style={inp} value={home.heroCtaLink} onChange={e => setHome({ ...home, heroCtaLink:e.target.value })} placeholder="/portofolio" />
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={saveHome} disabled={homeSaving} style={{ ...btn(true), width:'100%', padding:'14px', fontSize:'1rem' }}>{homeSaving ? '⌛ Menyimpan...' : '💾 Simpan Semua Perubahan Hero'}</button>
            </div>
          )}

          {/* ── ABOUT ME ── */}
          {tab === 'about' && (
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.3rem' }}>ABOUT ME</h1>
              <p style={{ color:'var(--white-dim)', marginBottom:'1.5rem', fontSize:'0.88rem' }}>Edit profil dan foto About Me.</p>
              <div style={card}>
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <ImageUploader label="Foto Profil" value={about.photoUrl} onChange={url => setAbout({ ...about, photoUrl:url })} />
                  <div>
                    <label style={lbl}>Nama</label>
                    <input style={inp} value={about.name} onChange={e => setAbout({ ...about, name:e.target.value })} />
                  </div>
                  <div>
                    <label style={lbl}>Lokasi</label>
                    <input style={inp} value={about.location} onChange={e => setAbout({ ...about, location:e.target.value })} />
                  </div>
                  <div>
                    <label style={lbl}>Bio Paragraf 1</label>
                    <textarea style={{ ...inp, minHeight:90, resize:'vertical' }} value={about.bio1} onChange={e => setAbout({ ...about, bio1:e.target.value })} />
                  </div>
                  <div>
                    <label style={lbl}>Bio Paragraf 2</label>
                    <textarea style={{ ...inp, minHeight:90, resize:'vertical' }} value={about.bio2} onChange={e => setAbout({ ...about, bio2:e.target.value })} />
                  </div>
                  <button onClick={saveAbout} disabled={aboutSaving} style={btn(true)}>{aboutSaving ? '⌛ Menyimpan...' : '💾 Simpan About'}</button>
                </div>
              </div>
            </div>
          )}

          {/* ── SKILLS ── */}
          {tab === 'skills' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.2rem' }}>SKILLS & TOOLS</h1>
                  <p style={{ color:'var(--white-dim)', fontSize:'0.88rem' }}>{skills.length} skill tersimpan</p>
                </div>
                <button onClick={() => setSkillForm({ id:'', number:(skills.length+1).toString().padStart(2,'0'), title:'', desc:'' })} style={btn(true)}>+ Tambah Skill</button>
              </div>
              {skills.map((sk, i) => (
                <div key={sk.id} style={{ ...card, display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'0.6rem' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--amber)', flexShrink:0 }}>{sk.number}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.2rem', wordBreak:'break-word' }}>{sk.title}</div>
                    <div style={{ color:'var(--white-dim)', fontSize:'0.82rem', lineHeight:1.5 }}>{sk.desc}</div>
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <button onClick={() => setSkillForm({ ...sk })} style={{ ...btn(), fontSize:'0.78rem', padding:'6px 12px' }}>✏️</button>
                    <button onClick={() => deleteSkill(sk.id)} style={{ background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.2)', color:'#ff6b6b', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:'0.78rem' }}>🗑️</button>
                  </div>
                </div>
              ))}
              {skills.length === 0 && <div style={{ textAlign:'center', color:'var(--white-dim)', padding:'3rem' }}>Belum ada skill.</div>}
            </div>
          )}

          {/* ── EXPERIENCE ── */}
          {tab === 'experience' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.2rem' }}>PENGALAMAN KERJA</h1>
                  <p style={{ color:'var(--white-dim)', fontSize:'0.88rem' }}>{exps.length} pengalaman tersimpan</p>
                </div>
                <button onClick={() => setExpForm({ id:'', position:'', company:'', period:'', icon:'💼', tags:'' })} style={btn(true)}>+ Tambah</button>
              </div>
              {exps.map(exp => (
                <div key={exp.id} style={{ ...card, display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                  <div style={{ fontSize:'1.5rem', flexShrink:0 }}>{exp.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, marginBottom:'0.2rem', wordBreak:'break-word' }}>{exp.position}</div>
                    <div style={{ color:'var(--amber)', fontSize:'0.82rem', fontFamily:'var(--font-script)' }}>{exp.company}</div>
                    {exp.period && <div style={{ color:'var(--white-dim)', fontSize:'0.78rem', marginTop:'0.2rem' }}>{exp.period}</div>}
                    {exp.tags && <div style={{ color:'var(--white-dim)', fontSize:'0.75rem', marginTop:'0.3rem' }}>{exp.tags}</div>}
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <button onClick={() => setExpForm({ ...exp })} style={{ ...btn(), fontSize:'0.78rem', padding:'6px 12px' }}>✏️</button>
                    <button onClick={() => deleteExp(exp.id)} style={{ background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.2)', color:'#ff6b6b', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:'0.78rem' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PORTFOLIO CMS ── */}
          {tab === 'portfolio' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.2rem' }}>PORTFOLIO CMS</h1>
                  <p style={{ color:'var(--white-dim)', fontSize:'0.88rem' }}>{items.length} project</p>
                </div>
                <button onClick={openPortAdd} style={btn(true)}>+ Tambah Project</button>
              </div>
              {loading ? <p style={{ color:'var(--white-dim)' }}>Memuat...</p> : items.length === 0 ? (
                <div style={{ ...card, textAlign:'center', padding:'3rem', color:'var(--white-dim)' }}><div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📂</div><p>Belum ada project.</p></div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ ...card, display:'flex', gap:'0.8rem', alignItems:'center', marginBottom:0 }}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width:60, height:44, objectFit:'cover', borderRadius:7, flexShrink:0 }} />}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:'0.15rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div>
                        <span style={{ color:'var(--amber)', fontSize:'0.75rem', background:'rgba(245,166,35,0.08)', borderRadius:4, padding:'1px 8px' }}>{item.category}</span>
                      </div>
                      <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                        <button onClick={() => openPortEdit(item)} style={{ ...btn(), fontSize:'0.75rem', padding:'5px 10px' }}>✏️</button>
                        <button onClick={() => setDelConfirm(item.id)} style={{ background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.2)', color:'#ff6b6b', borderRadius:7, padding:'5px 10px', cursor:'pointer', fontSize:'0.75rem' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* ── SERTIFIKASI ── */}
          {tab === 'sertifikasi' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.2rem' }}>SERTIFIKASI</h1>
                  <p style={{ color:'var(--white-dim)', fontSize:'0.88rem' }}>{certs.length} sertifikat tersimpan</p>
                </div>
                <button onClick={() => setCertForm({ id:'', name:'', year:new Date().getFullYear().toString(), issuer:'', subtitle:'', imageUrl:'' })} style={btn(true)}>+ Tambah</button>
              </div>
              {certs.length === 0 && <div style={{ ...card, textAlign:'center', padding:'3rem', color:'var(--white-dim)' }}><div style={{ fontSize:'3rem', marginBottom:'0.8rem' }}>🎓</div><p>Belum ada sertifikasi.</p></div>}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {certs.map(cert => (
                  <div key={cert.id} style={{ ...card, display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:0 }}>
                    {/* Image thumbnail */}
                    <div style={{ width:72, height:52, borderRadius:8, overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(245,166,35,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {cert.imageUrl
                        ? <img src={cert.imageUrl} alt={cert.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        : <span style={{ fontSize:'1.4rem' }}>🎓</span>}
                    </div>
                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.15rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cert.name}</div>
                      <div style={{ color:'var(--amber)', fontSize:'0.78rem', marginBottom:'0.1rem' }}>{cert.issuer} · {cert.year}</div>
                      <div style={{ color:'var(--white-dim)', fontSize:'0.75rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cert.subtitle}</div>
                    </div>
                    {/* Actions */}
                    <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                      <button onClick={() => setCertForm({ ...cert })} style={{ ...btn(), fontSize:'0.78rem', padding:'6px 12px' }}>✏️</button>
                      <button onClick={() => deleteCert(cert.id)} style={{ background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.2)', color:'#ff6b6b', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:'0.78rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CONTACT INFO ── */}
          {tab === 'contact' && (
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'0.3rem' }}>INFO KONTAK</h1>
              <p style={{ color:'var(--white-dim)', marginBottom:'1.5rem', fontSize:'0.88rem' }}>Ditampilkan di Footer dan Contact Section.</p>
              <div style={card}>
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  {([['email','📧 Email','mahfudfebry@hikimori.web.id'],['location','📍 Lokasi','Nganjuk, Indonesia'],['website','🌐 Website','hikimori.web.id'],['instagram','📸 Instagram (username)',''],['linkedin','💼 LinkedIn (username)',''],['twitter','🐦 Twitter/X (username)','']] as [keyof ContactData, string, string][]).map(([key, label, ph]) => (
                    <div key={key}>
                      <label style={lbl}>{label}</label>
                      <input style={inp} value={(contact as any)[key]} onChange={e => setContact({ ...contact, [key]:e.target.value })} placeholder={ph} />
                    </div>
                  ))}
                  <button onClick={saveContact} disabled={contactSaving} style={btn(true)}>{contactSaving ? '⌛ Menyimpan...' : '💾 Simpan Kontak'}</button>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.5rem)', marginBottom:'1.5rem' }}>SETTINGS</h1>
              <div style={card}>
                <h3 style={{ marginBottom:'0.5rem', fontWeight:700 }}>Informasi Akun</h3>
                <p style={{ color:'var(--white-dim)', fontSize:'0.88rem', lineHeight:1.8 }}>
                  Username: <strong style={{ color:'var(--amber)' }}>Mahfudfebry</strong><br />
                  Email: <strong style={{ color:'var(--amber)' }}>mahfudfebry@hikimori.web.id</strong><br />
                  Role: <strong style={{ color:'var(--amber)' }}>Administrator</strong>
                </p>
              </div>
              <div style={card}>
                <h3 style={{ marginBottom:'0.5rem', fontWeight:700 }}>Reset Data</h3>
                <p style={{ color:'var(--white-dim)', fontSize:'0.85rem', marginBottom:'1rem' }}>Hapus semua data localStorage dan kembalikan ke default.</p>
                <button onClick={() => { if (window.confirm('Reset semua data?')) { [LS_HOME,LS_ABOUT,LS_SKILLS,LS_EXP,LS_CONTACT,LS_CERT].forEach(k => localStorage.removeItem(k)); toast.success('Data direset!'); window.location.reload(); } }} style={{ background:'rgba(255,60,60,0.1)', border:'1px solid rgba(255,60,60,0.25)', color:'#ff6b6b', borderRadius:8, padding:'10px 20px', cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>🔄 Reset Data</button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── Skill Modal ─── */}
      <AnimatePresence>
        {skillForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={e => { if (e.target===e.currentTarget) setSkillForm(null); }}>
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} style={{ background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:18, padding:'1.5rem', width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>{skillForm.id ? 'EDIT SKILL' : 'TAMBAH SKILL'}</h2>
                <button onClick={() => setSkillForm(null)} style={{ background:'none', border:'none', color:'var(--white-dim)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'0.8rem' }}>
                  <div><label style={lbl}>Nomor</label><input style={inp} value={skillForm.number} onChange={e => setSkillForm({ ...skillForm, number:e.target.value })} placeholder="01" /></div>
                  <div><label style={lbl}>Judul</label><input style={inp} value={skillForm.title} onChange={e => setSkillForm({ ...skillForm, title:e.target.value })} placeholder="Nama skill" /></div>
                </div>
                <div><label style={lbl}>Deskripsi</label><textarea style={{ ...inp, minHeight:80, resize:'vertical' }} value={skillForm.desc} onChange={e => setSkillForm({ ...skillForm, desc:e.target.value })} /></div>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={saveSkill} style={{ ...btn(true), flex:1 }}>💾 Simpan</button>
                  <button onClick={() => setSkillForm(null)} style={{ ...btn(), padding:'10px 16px' }}>Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Experience Modal ─── */}
      <AnimatePresence>
        {expForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={e => { if (e.target===e.currentTarget) setExpForm(null); }}>
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} style={{ background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:18, padding:'1.5rem', width:'100%', maxWidth:500, maxHeight:'85vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>{expForm.id ? 'EDIT PENGALAMAN' : 'TAMBAH PENGALAMAN'}</h2>
                <button onClick={() => setExpForm(null)} style={{ background:'none', border:'none', color:'var(--white-dim)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div><label style={lbl}>Posisi / Jabatan</label><input style={inp} value={expForm.position} onChange={e => setExpForm({ ...expForm, position:e.target.value })} /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
                  <div><label style={lbl}>Perusahaan</label><input style={inp} value={expForm.company} onChange={e => setExpForm({ ...expForm, company:e.target.value })} /></div>
                  <div><label style={lbl}>Periode</label><input style={inp} value={expForm.period} onChange={e => setExpForm({ ...expForm, period:e.target.value })} placeholder="2020–2023" /></div>
                </div>
                <div><label style={lbl}>Emoji Icon</label><input style={inp} value={expForm.icon} onChange={e => setExpForm({ ...expForm, icon:e.target.value })} placeholder="👥" /></div>
                <div><label style={lbl}>Tags (pisahkan koma)</label><textarea style={{ ...inp, minHeight:70, resize:'vertical' }} value={expForm.tags} onChange={e => setExpForm({ ...expForm, tags:e.target.value })} placeholder="Vendor Management,HR,Training" /></div>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={saveExp} style={{ ...btn(true), flex:1 }}>💾 Simpan</button>
                  <button onClick={() => setExpForm(null)} style={{ ...btn(), padding:'10px 16px' }}>Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Portfolio Modal ─── */}
      <AnimatePresence>
        {portModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto' }} onClick={e => { if (e.target===e.currentTarget) setPortModal(false); }}>
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} style={{ background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:18, padding:'1.5rem', width:'100%', maxWidth:580, maxHeight:'90vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>{portEditId ? 'EDIT PROJECT' : 'TAMBAH PROJECT'}</h2>
                <button onClick={() => setPortModal(false)} style={{ background:'none', border:'none', color:'var(--white-dim)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
              </div>
              <form onSubmit={handlePortSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div><label style={lbl}>Judul Project *</label><input style={inp} value={portForm.title} onChange={e => setPortForm({ ...portForm, title:e.target.value })} required /></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
                  <div><label style={lbl}>Kategori</label>
                    <select style={{ ...inp }} value={portForm.category} onChange={e => setPortForm({ ...portForm, category:e.target.value })}>
                      {['HR','Administrasi','IT Support','Desain','Branding'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={lbl}>Tahun</label><input style={inp} value={portForm.year} onChange={e => setPortForm({ ...portForm, year:e.target.value })} /></div>
                </div>
                <div><label style={lbl}>Deskripsi *</label><textarea style={{ ...inp, minHeight:90, resize:'vertical' }} value={portForm.description} onChange={e => setPortForm({ ...portForm, description:e.target.value })} required /></div>
                <div><label style={lbl}>Client</label><input style={inp} value={portForm.client} onChange={e => setPortForm({ ...portForm, client:e.target.value })} /></div>
                <div><label style={lbl}>Tags (pisahkan koma)</label><input style={inp} value={portForm.tags} onChange={e => setPortForm({ ...portForm, tags:e.target.value })} /></div>
                <ImageUploader label="Gambar Project" value={portImgPreview || portForm.imageUrl} onChange={url => { setPortForm({ ...portForm, imageUrl:url }); setPortImgPreview(url); }} />
                <div style={{ display:'flex', alignItems:'center', gap:'0.7rem' }}>
                  <input type="checkbox" id="pfeat" checked={portForm.featured} onChange={e => setPortForm({ ...portForm, featured:e.target.checked })} style={{ width:18, height:18, accentColor:'var(--amber)' }} />
                  <label htmlFor="pfeat" style={{ color:'var(--white-dim)', cursor:'pointer', fontWeight:600, fontSize:'0.88rem' }}>Featured</label>
                </div>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button type="submit" disabled={portSubmitting} style={{ ...btn(true), flex:1 }}>{portSubmitting ? '⌛ Menyimpan...' : portEditId ? '💾 Update' : '➕ Tambah'}</button>
                  <button type="button" onClick={() => setPortModal(false)} style={{ ...btn(), padding:'10px 16px' }}>Batal</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirm ─── */}
      <AnimatePresence>
        {delConfirm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
            <motion.div initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }} style={{ background:'var(--black-2)', border:'1px solid rgba(255,60,60,0.3)', borderRadius:16, padding:'2rem', textAlign:'center', maxWidth:340, width:'100%' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.8rem' }}>⚠️</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:'0.5rem' }}>HAPUS?</h3>
              <p style={{ color:'var(--white-dim)', marginBottom:'1.2rem', fontSize:'0.88rem' }}>Tindakan ini tidak dapat dibatalkan.</p>
              <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center' }}>
                <button onClick={() => handleDelete(delConfirm)} style={{ background:'#ff4444', color:'white', border:'none', borderRadius:8, padding:'10px 22px', cursor:'pointer', fontWeight:700 }}>Ya, Hapus</button>
                <button onClick={() => setDelConfirm(null)} style={{ ...btn(), padding:'10px 18px' }}>Batal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ─── Cert Modal ─── */}
      <AnimatePresence>
        {certForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto' }} onClick={e => { if (e.target===e.currentTarget) setCertForm(null); }}>
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }} style={{ background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:18, padding:'1.5rem', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>{certForm.id ? 'EDIT SERTIFIKASI' : 'TAMBAH SERTIFIKASI'}</h2>
                <button onClick={() => setCertForm(null)} style={{ background:'none', border:'none', color:'var(--white-dim)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div>
                  <label style={lbl}>Nama Sertifikasi *</label>
                  <input style={inp} value={certForm.name} onChange={e => setCertForm({ ...certForm, name:e.target.value })} placeholder="Google Digital Marketing" />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem' }}>
                  <div>
                    <label style={lbl}>Tahun</label>
                    <input style={inp} value={certForm.year} onChange={e => setCertForm({ ...certForm, year:e.target.value })} placeholder="2023" />
                  </div>
                  <div>
                    <label style={lbl}>Lembaga Penerbit</label>
                    <input style={inp} value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer:e.target.value })} placeholder="Google" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Sub-Title Lembaga</label>
                  <input style={inp} value={certForm.subtitle} onChange={e => setCertForm({ ...certForm, subtitle:e.target.value })} placeholder="Fundamentals of Digital Marketing" />
                </div>
                <ImageUploader label="Gambar Sertifikat" value={certForm.imageUrl} onChange={url => setCertForm({ ...certForm, imageUrl:url })} />
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <button onClick={saveCert} style={{ ...btn(true), flex:1 }}>💾 Simpan</button>
                  <button onClick={() => setCertForm(null)} style={{ ...btn(), padding:'10px 16px' }}>Batal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width:768px) {
          #admin-sidebar  { display:none !important; }
          #admin-topbar   { display:flex !important; }
          #admin-tabbar   { display:block !important; }
          main            { padding-bottom: 90px !important; }
        }
        select option { background: #111; color: #fff; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
