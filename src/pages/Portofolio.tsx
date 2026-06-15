// src/pages/Portofolio.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import { usePortfolio } from '../hooks/usePortfolio';

const CATEGORIES = ['Semua', 'HR', 'Administrasi', 'IT Support', 'Desain', 'Branding'];

const PortfolioCard: React.FC<{ item: ReturnType<typeof usePortfolio>['items'][0]; index: number }> = ({
  item,
  index,
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
      style={{
        background: 'var(--black-2)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(245,166,35,0.4)' : 'rgba(245,166,35,0.1)'}`,
        transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(245,166,35,0.2)' : '0 4px 20px rgba(0,0,0,0.3)',
        cursor: 'default',
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
            ? 'linear-gradient(to bottom, rgba(245,166,35,0.15), rgba(10,10,10,0.6))'
            : 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.5))',
          transition: 'background 0.3s',
        }} />
        {item.featured && (
          <div style={{
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
          border: '1px solid rgba(245,166,35,0.3)',
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
        }}>
          {item.title}
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
                background: 'rgba(245,166,35,0.1)',
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
          <span style={{ color: 'var(--white-faint)', fontSize: '0.8rem' }}>{item.year}</span>
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

const Portofolio: React.FC = () => {
  const { items, loading, error } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

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
      <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
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
                border: '1px solid rgba(245,166,35,0.2)',
                borderRadius: '10px',
                padding: '12px 18px',
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                display: 'block',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.2)')}
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
                  padding: '8px 18px',
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

      {/* Portfolio Grid */}
      <section style={{ padding: '1rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--white-dim)' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(245,166,35,0.2)',
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
              <PortfolioCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
};

export default Portofolio;
