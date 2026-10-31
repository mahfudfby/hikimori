// src/components/Article.tsx — isi artikel portofolio gaya majalah: blok teks, media, slideshow, embed, kode.
import React, { useEffect, useRef, useState } from 'react';
import type { ArticleBlock } from '../hooks/usePortfolio';
import { parseEmbed, mediaKind, parseInline } from '../utils/embed';
import { Icon, cld } from './ui';

/** **tebal**, *miring*, `kode`, [link](https://...) → elemen React (tanpa HTML mentah). */
export const RichText: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <>
    {(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map((p, i) => (
      <p key={i} className={className}>
        {p.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {j > 0 && <br />}
            {parseInline(line).map((n, k) =>
              n.t === 'b' ? <strong key={k}>{n.v}</strong>
                : n.t === 'i' ? <em key={k}>{n.v}</em>
                  : n.t === 'code' ? <code key={k}>{n.v}</code>
                    : n.t === 'a' ? <a key={k} href={n.href} target="_blank" rel="noopener noreferrer">{n.v}</a>
                      : <React.Fragment key={k}>{n.v}</React.Fragment>)}
          </React.Fragment>
        ))}
      </p>
    ))}
  </>
);

/** iframe YouTube / TikTok / Instagram / program web. Link tidak dikenal → tautan biasa. */
export const EmbedFrame: React.FC<{ url: string; title: string; height?: number }> = ({ url, title, height }) => {
  const e = parseEmbed(url);
  if (!e) return url ? <a className="pill" href={url} target="_blank" rel="noopener noreferrer"><Icon name="external" size={15} />Buka media</a> : null;
  const web = e.kind === 'web';
  return (
    <div className={`embed embed-${e.kind}`} style={web ? { height: height || 520 } : { aspectRatio: e.ratio }}>
      <iframe src={e.src} title={title} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        // program web pihak luar: skrip boleh jalan, tapi tidak bisa membuka halaman induk
        sandbox={web ? 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads' : undefined} />
    </div>
  );
};

/** Satu media: gambar, file video, atau embed. */
export const Media: React.FC<{ url: string; alt: string; height?: number; eager?: boolean }> = ({ url, alt, height, eager }) => {
  const k = mediaKind(url);
  if (k === 'image') return <img className="mag-img" src={cld(url, 1400)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
  if (k === 'video') return <video className="mag-img" src={url} controls playsInline preload="metadata" />;
  if (k === 'embed') return <EmbedFrame url={url} title={alt} height={height} />;
  return null;
};

/** Slideshow foto: geser otomatis (berhenti saat disentuh / hover), tombol, titik, swipe. */
export const Slideshow: React.FC<{ urls: string[]; caption?: string; alt: string }> = ({ urls, caption, alt }) => {
  const list = urls.filter(Boolean);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const x0 = useRef<number | null>(null);
  const n = list.length;
  const go = (d: number) => setI(v => (v + d + n) % n);
  useEffect(() => {
    if (n < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setI(v => (v + 1) % n), 4800);
    return () => window.clearInterval(t);
  }, [n, paused]);
  if (!n) return null;
  return (
    <figure className="mag-figure">
      <div className="slides" tabIndex={0} aria-roledescription="slideshow" aria-label={alt}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onKeyDown={e => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }}
        onPointerDown={e => { x0.current = e.clientX; setPaused(true); }}
        onPointerUp={e => { if (x0.current !== null && Math.abs(e.clientX - x0.current) > 40) go(e.clientX < x0.current ? 1 : -1); x0.current = null; }}>
        {list.map((u, j) => (
          <img key={u + j} src={cld(u, 1400)} alt={`${alt} ${j + 1}/${n}`} className={j === i ? 'on' : ''} loading={j === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} />
        ))}
        {n > 1 && (<>
          <button type="button" className="icon-btn sm slide-prev" aria-label="Foto sebelumnya" onClick={() => go(-1)}><Icon name="left" size={16} /></button>
          <button type="button" className="icon-btn sm slide-next" aria-label="Foto berikutnya" onClick={() => go(1)}><Icon name="right" size={16} /></button>
          <div className="slide-dots">{list.map((_, j) => <button type="button" key={j} className={j === i ? 'on' : ''} aria-label={`Foto ${j + 1}`} onClick={() => setI(j)} />)}</div>
        </>)}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

const Block: React.FC<{ b: ArticleBlock; title: string }> = ({ b, title }) => {
  switch (b.type) {
    case 'heading': return <h2 className="mag-h2">{b.text}</h2>;
    case 'quote': return (
      <blockquote className="mag-quote"><RichText text={b.text} />{b.caption && <cite>— {b.caption}</cite>}</blockquote>
    );
    case 'divider': return <div className="mag-divider" aria-hidden="true"><span>✦</span></div>;
    case 'code': return (
      <figure className="mag-figure"><pre className="mag-code"><code>{b.text}</code></pre>{b.caption && <figcaption>{b.caption}</figcaption>}</figure>
    );
    case 'embed': return (
      <figure className="mag-figure"><EmbedFrame url={b.url} title={b.caption || title} height={b.height} />{b.caption && <figcaption>{b.caption}</figcaption>}</figure>
    );
    case 'gallery': return b.style === 'grid' ? (
      <figure className="mag-figure">
        <div className="mag-grid">{b.urls.filter(Boolean).map((u, j) => <img key={u + j} src={cld(u, 900)} alt={`${b.caption || title} ${j + 1}`} loading="lazy" decoding="async" />)}</div>
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    ) : <Slideshow urls={b.urls} caption={b.caption} alt={b.caption || title} />;
    case 'media': return (
      <div className={`mag-split ${b.side === 'left' ? 'media-left' : ''}`}>
        <div className="mag-split-text"><RichText text={b.text} /></div>
        <figure className="mag-figure"><Media url={b.url} alt={b.caption || title} height={b.height} />{b.caption && <figcaption>{b.caption}</figcaption>}</figure>
      </div>
    );
    default: return <div className={`mag-text mag-${b.style || 'plain'}`}><RichText text={b.text} /></div>;
  }
};

export const ArticleBlocks: React.FC<{ blocks: ArticleBlock[]; title: string }> = ({ blocks, title }) => (
  <>{blocks.map(b => <Block key={b.id} b={b} title={title} />)}</>
);
