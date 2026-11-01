// src/pages/PortfolioArticle.tsx — /portofolio/:id : artikel proyek gaya majalah/koran.
// Headline → sub-judul → hero banner → isi blok. Kiri: kontak + ornamen. Kanan: rekomendasi baca.
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePortfolio, ArticleBlock } from '../hooks/usePortfolio';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { pick, waLink } from '../content/derive';
import { Icon, useTitle, cld } from '../components/ui';
import { ArticleBlocks, Media } from '../components/Article';
import { hyphenate } from '../utils/richHtml';
import { mailLink } from '../utils/mailLink';

const Ornament: React.FC = () => (
  <div className="mag-ornament" aria-hidden="true">
    <svg viewBox="0 0 120 120"><defs><linearGradient id="mag-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4E2A1" /><stop offset=".5" stopColor="#C9A24A" /><stop offset="1" stopColor="#8A6A22" /></linearGradient></defs>
      <circle cx="60" cy="60" r="54" fill="none" stroke="url(#mag-gold)" strokeWidth="1" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="url(#mag-gold)" strokeWidth=".6" strokeDasharray="2 5" />
      <path d="M60 18 66 54 102 60 66 66 60 102 54 66 18 60 54 54Z" fill="url(#mag-gold)" opacity=".85" />
    </svg>
    <span className="mag-vert">HIKIMORI · PORTFOLIO</span>
  </div>
);

const PortfolioArticle: React.FC = () => {
  const { id } = useParams();
  const { items, loading, error } = usePortfolio();
  const { content } = useContent();
  const { t, lang } = useLang();
  const p = content.profile;
  const post = items.find(i => i.id === id);
  useTitle(`${post?.seoTitle || post?.title || t('Portofolio', 'Portfolio')} — ${p.name}`);
  // SEO: deskripsi & kata kunci halaman artikel, dikembalikan saat keluar
  useEffect(() => {
    if (!post) return;
    const set = (sel: string, attr: string, key: string, val: string) => {
      let m = document.head.querySelector<HTMLMetaElement>(sel);
      if (!m) { m = document.createElement('meta'); m.setAttribute(attr, key); document.head.appendChild(m); }
      const old = m.content; m.content = val;
      return () => { m!.content = old; };
    };
    const desc = post.seoDesc || post.description || post.subtitle;
    const undo = [
      desc && set('meta[name="description"]', 'name', 'description', desc),
      desc && set('meta[property="og:description"]', 'property', 'og:description', desc),
      set('meta[property="og:title"]', 'property', 'og:title', post.seoTitle || post.title),
      post.keywords?.length && set('meta[name="keywords"]', 'name', 'keywords', post.keywords.join(', ')),
    ];
    return () => undo.forEach(u => typeof u === 'function' && u());
  }, [post]);

  if (loading) return <main className="shell page-in"><div className="frame"><div className="skeleton" style={{ height: 520 }} /></div></main>;
  if (error || !post) return (
    <main className="shell page-in"><div className="frame center" style={{ padding: '80px 20px' }}>
      <p className="muted">{error ? t('Gagal memuat artikel.', 'Failed to load the article.') : t('Artikel tidak ditemukan.', 'Article not found.')}</p>
      <Link to="/portofolio" className="pill dark mt-16">{t('Kembali ke portofolio', 'Back to portfolio')}</Link>
    </div></main>
  );

  // Proyek lama tanpa blok: deskripsi jadi paragraf pembuka berhuruf kapital besar
  const blocks: ArticleBlock[] = post.blocks?.length ? post.blocks
    : [{ id: 'desc', type: 'text', style: 'dropcap', text: post.description, url: '', urls: [], caption: '', side: 'right', height: 0 }];
  const recs = items.filter(i => i.id !== post.id).sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order).slice(0, 4);
  const hero = post.videoUrl || post.imageUrl;

  return (
    <main className="shell shell-wide page-in">
      <div className="frame mag">
        <article className="mag-article" lang="id">
          <nav className="crumb" aria-label="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/portofolio">{t('Portofolio', 'Portfolio')}</Link></nav>
          <header className="mag-head">
            <div className="mag-kicker">{[post.category, post.year].filter(Boolean).join(' · ')}</div>
            <h1 className="mag-title">{hyphenate(post.title)}</h1>
            {post.subtitle && <p className="mag-sub">{hyphenate(post.subtitle)}</p>}
            <div className="mag-byline">
              {p.photoUrl && <img src={cld(p.photoUrl, 96)} alt="" width={36} height={36} />}
              <span>{t('Oleh', 'By')} <strong>{p.name}</strong>{post.client && <> · {post.client}</>}</span>
            </div>
          </header>
          {hero && <figure className="mag-hero"><Media url={hero} alt={post.title} eager frameless /></figure>}
          <div className="mag-body"><ArticleBlocks blocks={blocks} title={post.title} /></div>
          <footer className="mag-foot">
            {post.tags?.length > 0 && <div className="row wrap gap-8">{post.tags.map(tg => <span key={tg} className="chip">{tg}</span>)}</div>}
            {post.link && <a className="pill dark mt-16" href={post.link} target="_blank" rel="noopener noreferrer"><Icon name="external" size={15} />{t('Buka proyek', 'Open project')}</a>}
            {(post.hashtags?.length > 0 || post.keywords?.length > 0) && (
              <div className="mag-meta">
                {post.hashtags?.length > 0 && <p className="mag-hashtags">{post.hashtags.map(h => <span key={h}>#{h}</span>)}</p>}
                {post.keywords?.length > 0 && <p className="mag-keywords"><strong>{t('Kata kunci', 'Keywords')}:</strong> {post.keywords.join(' · ')}</p>}
              </div>
            )}
          </footer>
        </article>

        <aside className="mag-side mag-left">
          <div className="card mag-box">
            <div className="eyebrow">{t('Kontak saya', 'Contact me')}</div>
            <div className="row gap-12 mt-16">
              {p.photoUrl && <img className="mag-avatar" src={cld(p.photoUrl, 160)} alt={p.name} />}
              <div><div className="small" style={{ fontWeight: 600 }}>{p.name}</div><div className="xs muted">{pick(p.title, lang)}</div></div>
            </div>
            <div className="stack gap-8 mt-16">
              {p.whatsapp && <a className="pill dark" href={waLink(content, lang)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={15} />WhatsApp</a>}
              {p.email && <a className="pill" href={mailLink(p.email)}><Icon name="mail" size={15} />Email</a>}
              <Link className="pill ghost" to="/kontak"><Icon name="arrow" size={15} />{t('Halaman kontak', 'Contact page')}</Link>
            </div>
          </div>
          <Ornament />
        </aside>

        <aside className="mag-side mag-right">
          <div className="card mag-box">
            <div className="eyebrow">{t('Rekomendasi baca', 'Recommended reading')}</div>
            {recs.length === 0 ? <p className="xs muted mt-16">{t('Artikel lain segera hadir.', 'More articles coming soon.')}</p> : (
              <ol className="mag-recs">
                {recs.map((r, i) => (
                  <li key={r.id}>
                    <Link to={`/portofolio/${r.id}`}>
                      {r.imageUrl ? <img src={cld(r.imageUrl, 240)} alt="" loading="lazy" /> : <span className="mag-rec-n">{String(i + 1).padStart(2, '0')}</span>}
                      <span><span className="xs muted">{r.category}</span><span className="mag-rec-t">{r.title}</span></span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            <Link to="/portofolio" className="pill sm mt-16">{t('Semua proyek', 'All projects')}</Link>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default PortfolioArticle;
