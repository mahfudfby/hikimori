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

const AdminPanel: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const { items, loading, addItem, updateItem, deleteItem } = usePortfolio();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
    toast.success('Berhasil logout.');
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setImagePreview('');
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      tags: item.tags?.join(', ') || '',
      client: item.client,
      year: item.year,
      featured: item.featured,
      order: item.order,
    });
    setImagePreview(item.imageUrl);
    setImageFile(null);
    setEditId(item.id);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Judul dan deskripsi wajib diisi!');
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        setUploading(true);
        toast.loading('Mengupload gambar...');
        imageUrl = await uploadToCloudinary(imageFile);
        toast.dismiss();
        setUploading(false);
      }

      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        imageUrl,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        client: form.client,
        year: form.year,
        featured: form.featured,
        order: Number(form.order),
      };

      if (editId) {
        await updateItem(editId, payload);
        toast.success('Project berhasil diperbarui!');
      } else {
        await addItem(payload);
        toast.success('Project berhasil ditambahkan!');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success('Project dihapus.');
      setDeleteConfirm(null);
    } catch {
      toast.error('Gagal menghapus project.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#111',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'var(--white-dim)',
    fontSize: '0.78rem',
    fontWeight: 600,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const stats = [
    { label: 'Total Project', value: items.length, icon: '📁' },
    { label: 'Featured', value: items.filter((i) => i.featured).length, icon: '⭐' },
    { label: 'Kategori', value: Array.from(new Set(items.map((i) => i.category))).length, icon: '🏷️' },
    { label: 'Status', value: 'Aktif', icon: '✅' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      fontFamily: 'var(--font-body)',
    }}
    className="admin-grid"
    >
      {/* Sidebar */}
      <aside style={{
        background: 'var(--black-2)',
        borderRight: '1px solid rgba(245,166,35,0.1)',
        padding: '2rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--amber)',
            fontSize: '1.3rem',
            letterSpacing: '2px',
            marginBottom: '0.2rem',
          }}>
            MFD-FBY's
          </div>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.75rem' }}>Admin Panel</p>
        </div>

        {/* User info */}
        <div style={{
          background: 'var(--black-3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(245,166,35,0.1)',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>👤</div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Mahfudfebry</div>
          <div style={{ color: 'var(--amber)', fontSize: '0.75rem' }}>Administrator</div>
        </div>

        {/* Nav */}
        {([
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'portfolio', icon: '📁', label: 'Portfolio CMS' },
          { id: 'settings', icon: '⚙️', label: 'Pengaturan' },
        ] as { id: Tab; icon: string; label: string }[]).map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              width: '100%',
              background: tab === item.id ? 'rgba(245,166,35,0.15)' : 'none',
              border: tab === item.id ? '1px solid rgba(245,166,35,0.3)' : '1px solid transparent',
              borderRadius: '10px',
              padding: '10px 14px',
              color: tab === item.id ? 'var(--amber)' : 'var(--white-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.88rem',
              marginBottom: '4px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(255,60,60,0.1)',
              border: '1px solid rgba(255,60,60,0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#ff6b6b',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '2rem', overflowY: 'auto' }}>
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.3rem' }}>
              DASHBOARD
            </h1>
            <p style={{ color: 'var(--white-dim)', marginBottom: '2.5rem' }}>
              Selamat datang kembali, <span style={{ color: 'var(--amber)' }}>Mahfudfebry</span>!
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}>
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: 'var(--black-2)',
                    border: '1px solid rgba(245,166,35,0.15)',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    color: 'var(--amber)',
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--white-dim)', fontSize: '0.82rem', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{
              background: 'var(--black-2)',
              border: '1px solid rgba(245,166,35,0.1)',
              borderRadius: '14px',
              padding: '1.5rem',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                PROJECT TERBARU
              </h3>
              {items.slice(0, 5).map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ color: 'var(--amber)', fontSize: '0.78rem' }}>{item.category}</div>
                  </div>
                  <button
                    onClick={() => { setTab('portfolio'); openEdit(item); }}
                    style={{
                      background: 'rgba(245,166,35,0.1)',
                      border: '1px solid rgba(245,166,35,0.2)',
                      color: 'var(--amber)',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <p style={{ color: 'var(--white-dim)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>
                  Belum ada project. Tambahkan di tab Portfolio CMS.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Portfolio CMS */}
        {tab === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.2rem' }}>
                  PORTFOLIO CMS
                </h1>
                <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem' }}>
                  Kelola konten portfolio Anda ({items.length} project)
                </p>
              </div>
              <motion.button
                onClick={openAdd}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--amber)',
                  color: 'var(--black)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                + Tambah Project
              </motion.button>
            </div>

            {/* Item list */}
            {loading ? (
              <p style={{ color: 'var(--white-dim)' }}>Memuat...</p>
            ) : items.length === 0 ? (
              <div style={{
                background: 'var(--black-2)',
                borderRadius: '14px',
                padding: '4rem',
                textAlign: 'center',
                color: 'var(--white-dim)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                <p>Belum ada project. Klik "Tambah Project" untuk mulai.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    style={{
                      background: 'var(--black-2)',
                      border: '1px solid rgba(245,166,35,0.1)',
                      borderRadius: '12px',
                      padding: '1.2rem 1.5rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          width: '70px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</span>
                        {item.featured && (
                          <span style={{
                            background: 'rgba(245,166,35,0.15)',
                            color: 'var(--amber)',
                            borderRadius: '4px',
                            padding: '1px 7px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}>
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <span style={{
                        color: 'var(--amber)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        background: 'rgba(245,166,35,0.08)',
                        borderRadius: '4px',
                        padding: '1px 8px',
                      }}>
                        {item.category}
                      </span>
                      {item.client && (
                        <span style={{ color: 'var(--white-dim)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
                          — {item.client}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEdit(item)}
                        style={{
                          background: 'rgba(245,166,35,0.1)',
                          border: '1px solid rgba(245,166,35,0.2)',
                          color: 'var(--amber)',
                          borderRadius: '8px',
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        style={{
                          background: 'rgba(255,60,60,0.1)',
                          border: '1px solid rgba(255,60,60,0.2)',
                          color: '#ff6b6b',
                          borderRadius: '8px',
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '2rem' }}>
              PENGATURAN
            </h1>
            <div style={{
              background: 'var(--black-2)',
              border: '1px solid rgba(245,166,35,0.1)',
              borderRadius: '14px',
              padding: '2rem',
            }}>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Informasi Akun</h3>
              <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Username: <strong style={{ color: 'var(--amber)' }}>Mahfudfebry</strong><br />
                Email: <strong style={{ color: 'var(--amber)' }}>mahfudfebry@hikimori.web.id</strong><br />
                Role: <strong style={{ color: 'var(--amber)' }}>Administrator</strong>
              </p>
            </div>
            <div style={{
              background: 'var(--black-2)',
              border: '1px solid rgba(245,166,35,0.1)',
              borderRadius: '14px',
              padding: '2rem',
              marginTop: '1rem',
            }}>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Konfigurasi API</h3>
              <p style={{ color: 'var(--white-dim)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Untuk mengatur Firebase, Cloudinary, dan EmailJS, edit file:<br />
                <code style={{ color: 'var(--amber)', background: '#111', padding: '2px 8px', borderRadius: '4px' }}>
                  src/config/firebase.ts
                </code><br />
                <code style={{ color: 'var(--amber)', background: '#111', padding: '2px 8px', borderRadius: '4px' }}>
                  src/config/services.ts
                </code>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              overflowY: 'auto',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              style={{
                background: 'var(--black-2)',
                border: '1px solid rgba(245,166,35,0.2)',
                borderRadius: '20px',
                padding: '2rem',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>
                  {editId ? 'EDIT PROJECT' : 'TAMBAH PROJECT'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--white-dim)',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Judul Project *</label>
                  <input
                    style={inputStyle}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Nama project"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Kategori</label>
                    <select
                      style={{ ...inputStyle }}
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {['HR', 'Administrasi', 'IT Support', 'Desain', 'Branding'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Tahun</label>
                    <input
                      style={inputStyle}
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Deskripsi *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Deskripsi project..."
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Client / Perusahaan</label>
                  <input
                    style={inputStyle}
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="Nama klien atau perusahaan"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tags (pisahkan dengan koma)</label>
                  <input
                    style={inputStyle}
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="HR, Rekrutmen, Training"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Gambar Upload (Cloudinary)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ ...inputStyle, padding: '8px' }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }}
                    />
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <label style={labelStyle}>Urutan Tampil</label>
                    <input
                      type="number"
                      style={inputStyle}
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: '1.5rem' }}>
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--amber)' }}
                    />
                    <label htmlFor="featured" style={{ color: 'var(--white-dim)', cursor: 'pointer', fontWeight: 600 }}>
                      Featured
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <motion.button
                    type="submit"
                    disabled={submitting || uploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      background: submitting ? 'rgba(245,166,35,0.5)' : 'var(--amber)',
                      color: 'var(--black)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '13px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? '⌛ Menyimpan...' : editId ? '💾 Update' : '➕ Tambah'}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'var(--white-dim)',
                      borderRadius: '10px',
                      padding: '13px 20px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                    }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                background: 'var(--black-2)',
                border: '1px solid rgba(255,60,60,0.3)',
                borderRadius: '16px',
                padding: '2.5rem',
                textAlign: 'center',
                maxWidth: '380px',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.6rem' }}>
                HAPUS PROJECT?
              </h3>
              <p style={{ color: 'var(--white-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  style={{
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--white-dim)',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                  }}
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
