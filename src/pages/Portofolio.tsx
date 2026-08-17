// src/pages/Portofolio.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import LazyMount from '../components/LazyMount';
import AuroraBackground from '../components/AuroraBackground';
import { usePortfolio } from '../hooks/usePortfolio';

const CATEGORIES = ['Semua', 'HR', 'Administrasi', 'IT Support', 'Desain', 'Branding'];

const PortfolioCard: React.FC<{ item: ReturnType<typeof usePortfolio>['items'][0]; index: number; onOpen: () => void }> = ({
  item,
  index,
  onOpen,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(); }}
      aria-label={`Lihat detail proyek ${item.title}`}
      style={{
        background: 'var(--black-2)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(0,82,245,0.4)' : 'rgba(0,82,245,0.1)'}`,
        transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(0,82,245,0.2)' : '0 4px 20px rgba(0,0,0,0.3)',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <motion.img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80'}
          alt={item.title}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(to bottom, rgba(0,82,245,0.15), rgba(10,10,10,0.6))'
            : 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.5))',
          transition: 'background 0.3s',
        }} />
        {/* Affordance "Lihat Detail" — desktop muncul pas hover, ada juga versi kecil permanen buat HP (nggak ada hover di touchscreen) */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
        >
          <div className="text-shadow-onlight" style={{ background: 'var(--amber)', color: 'var(--black)', borderRadius: '999px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            👁️ Lihat Detail
          </div>
        </motion.div>
        {item.featured && (
          <div className="text-shadow-onlight" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'var(--amber)',
            color: 'var(--black)',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}>
            ⭐ Featured
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(10px)',
          color: 'var(--amber)',
          borderRadius: '6px',
          padding: '3px 10px',
          fontSize: '0.75rem',
          fontWeight: 600,
          border: '1px solid rgba(0,82,245,0.3)',
        }}>
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          marginBottom: '0.5rem',
          lineHeight: 1.1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
        }}>
          <span>{item.title}</span>
          <span aria-hidden="true" style={{ color: 'var(--amber)', fontSize: '1rem', flexShrink: 0, opacity: 0.7 }}>→</span>
        </h3>
        <p style={{
          color: 'var(--white-dim)',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {item.tags?.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                background: 'rgba(0,82,245,0.1)',
                color: 'var(--amber)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>{item.year}</span>
        </div>

        {item.client && (
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            color: 'var(--white-dim)',
            fontSize: '0.82rem',
          }}>
            🏢 {item.client}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Modal detail proyek — full deskripsi, gambar, tags, klien, tahun ───
   Touch-friendly: tombol tutup besar, tap di luar modal juga menutup,
   Escape key juga jalan buat pengguna keyboard. */
const PortfolioModal: React.FC<{ item: ReturnType<typeof usePortfolio>['items'][0]; onClose: () => void }> = ({ item, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(4,9,15,0.82)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--black-2)', borderRadius: 'var(--radius)', maxWidth: '640px', width: '100%', maxHeight: '88vh', overflowY: 'auto', border: '1px solid var(--card-border)', position: 'relative' }}
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, width: 44, height: 44, borderRadius: '50%', background: 'rgba(4,9,15,0.75)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--white)', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✕
        </button>
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
          <img src={item.imageUrl || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ padding: 'clamp(1.3rem,4vw,2rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'var(--accent-bg)', color: 'var(--amber)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>{item.category}</span>
            {item.featured && <span className="text-shadow-onlight" style={{ background: 'var(--amber)', color: 'var(--black)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>⭐ Featured</span>}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,4vw,2.1rem)', marginBottom: '0.8rem', lineHeight: 1.1 }}>{item.title}</h2>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.3rem', whiteSpace: 'pre-line' }}>{item.description}</p>
          {item.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.3rem' }}>
              {item.tags.map((tag) => (
                <span key={tag} style={{ background: 'rgba(0,82,245,0.1)', color: 'var(--amber)', borderRadius: '5px', padding: '4px 11px', fontSize: '0.8rem', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1.2rem', borderTop: '1px solid var(--card-border)' }}>
            {item.client && (
              <div>
                <div style={{ color: 'var(--white-faint)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>Klien</div>
                <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.9rem' }}>🏢 {item.client}</div>
              </div>
            )}
            {item.year && (
              <div>
                <div style={{ color: 'var(--white-faint)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>Tahun</div>
                <div style={{ color: 'var(--white)', fontWeight: 600, fontSize: '0.9rem' }}>{item.year}</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Portofolio: React.FC = () => {
  const { items, loading, error } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ReturnType<typeof usePortfolio>['items'][0] | null>(null);

  const filtered = items.filter((item) => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '70px' }}>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <AuroraBackground variant="soft" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1 }}
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
            Riwayat Project
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            lineHeight: 0.9,
            marginBottom: '0.4rem',
          }}>
            PORTOFOLIO
          </h1>
          <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.7, marginTop: '1.5rem' }}>
            Kumpulan proyek dan karya terbaik yang telah saya kerjakan bersama klien dan perusahaan.
          </p>
        </motion.div>
      </section>

      {/* Filter & Search */}
      <LazyMount minHeight={500}>
      <section style={{ padding: '0 2rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection direction="up" delay={0.2}>
          {/* Search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="🔍 Cari project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'var(--black-2)',
                border: '1px solid rgba(0,82,245,0.2)',
                borderRadius: '10px',
                padding: '12px 18px',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                display: 'block',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(0,82,245,0.6)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(0,82,245,0.2)')}
            />
          </div>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: activeCategory === cat ? 'var(--amber)' : 'transparent',
                  color: activeCategory === cat ? 'var(--black)' : 'var(--white-dim)',
                  border: `1px solid ${activeCategory === cat ? 'var(--amber)' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '8px',
                  padding: '11px 20px',
                  minHeight: 42,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </AnimatedSection>
      </section>
      </LazyMount>

      {/* Portfolio Grid */}
      <LazyMount minHeight={500}>
      <section style={{ padding: '1rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--white-dim)' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(0,82,245,0.2)',
                borderTop: '3px solid var(--amber)',
                borderRadius: '50%',
                margin: '0 auto 1rem',
              }}
            />
            Memuat portfolio...
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--white-dim)',
            background: 'var(--black-2)',
            borderRadius: 'var(--radius)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p>Gagal memuat portfolio. Pastikan Firebase telah dikonfigurasi.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <AnimatedSection direction="scale">
            <div style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              color: 'var(--white-dim)',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📂</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.8rem' }}>
                {items.length === 0 ? 'BELUM ADA KONTEN' : 'TIDAK DITEMUKAN'}
              </h3>
              <p>
                {items.length === 0
                  ? 'Tambahkan project portfolio melalui Admin Panel.'
                  : 'Coba ubah filter atau kata kunci pencarian.'}
              </p>
            </div>
          </AnimatedSection>
        )}

        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <PortfolioCard key={item.id} item={item} index={i} onOpen={() => setSelectedItem(item)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      </LazyMount>

      <AnimatePresence>
        {selectedItem && <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Portofolio;
