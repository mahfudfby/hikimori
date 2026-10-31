// src/pages/PortfolioPage.tsx — /portofolio : proyek dari koleksi Firestore `portfolio`.
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, Reveal, useTitle, cld } from '../components/ui';

const PortfolioPage: React.FC = () => {
  const { items, loading, error } = usePortfolio();
  const { content } = useContent();
  const { t } = useLang();
  useTitle(`${t('Portofolio', 'Portfolio')} — ${content.profile.name}`);
  const [cat, setCat] = useState('all');
  const cats = useMemo(() => Array.from(new Set(items.map(i => i.category).filter(Boolean))), [items]);
  const list = (cat === 'all' ? items : items.filter(i => i.category === cat)).slice().sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Portofolio', 'Portfolio')} title={t('Karya & proyek', 'Work & projects')}
          lead={t('Kumpulan proyek, sistem, dan karya yang pernah saya kerjakan.', 'A collection of projects, systems and work I have delivered.')}
          aside={<div><div className="num-xl">{items.length}</div><div className="xs muted">{t('proyek', 'projects')}</div></div>} />

        {cats.length > 0 && (
          <div className="seg mb-24">
            <button className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>{t('Semua', 'All')}</button>
            {cats.map(c => <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}

        {loading ? (
          <div className="grid-3">{[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 320 }} />)}</div>
        ) : error ? (
          <div className="empty">{t('Gagal memuat portofolio.', 'Failed to load portfolio.')} <span className="xs">{error}</span></div>
        ) : list.length === 0 ? (
          <div className="empty">{t('Belum ada proyek. Tambahkan dari CMS → Portofolio.', 'No projects yet. Add them in CMS → Portfolio.')}</div>
        ) : (
          <div className="grid-3">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 6) * 40}>
                <Link to={`/portofolio/${p.id}`} className={`card hoverable stack ${p.featured ? 'dark' : ''}`} style={{ width: '100%', textAlign: 'left', height: '100%', color: 'inherit', textDecoration: 'none' }}>
                  {p.imageUrl ? <img className="thumb" src={cld(p.imageUrl, 640)} alt={p.title} loading="lazy" decoding="async" /> : <div className="thumb row" style={{ justifyContent: 'center' }}><Icon name="image" size={32} /></div>}
                  <div className="row between gap-8 mt-16">
                    <span className={`chip ${p.featured ? 'yellow' : ''}`}>{p.category || '—'}</span>
                    <span className="xs muted">{p.year}</span>
                  </div>
                  <h2 className="h-card mt-8">{p.title}</h2>
                  {p.client && <div className="xs muted">{p.client}</div>}
                  <p className="small muted mt-8" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.subtitle || p.description}</p>
                  <span className="xs mt-8" style={{ fontWeight: 600 }}>{t('Baca artikel →', 'Read article →')}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>

    </main>
  );
};

export default PortfolioPage;
