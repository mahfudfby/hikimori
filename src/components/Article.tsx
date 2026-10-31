// src/components/Article.tsx — isi artikel portofolio gaya majalah: blok teks, media, slideshow, embed, kode.
import React, { useEffect, useRef, useState } from 'react';
import type { ArticleBlock } from '../hooks/usePortfolio';
import { parseEmbed, mediaKind, parseInline, embedUrlFromCode } from '../utils/embed';
import { Icon, cld } from './ui';

/** Link https saja untuk tombol cadangan (kode embed / teks lain tidak dijadikan href). */
const parseHref = (raw: string) => { const u = embedUrlFromCode(raw); return /^https:\/\//.test(u) ? u : ''; };

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
export const EmbedFrame: React.FC<{ url: string; title: string; height?: number; frameless?: boolean }> = ({ url, title, height, frameless }) => {
  const e = parseEmbed(url, frameless);
  const frame = useRef<HTMLIFrameElement>(null);
  const [igH, setIgH] = useState(0);
  const isIg = e?.kind === 'instagram';
  useEffect(() => {
    if (!isIg) return;
    // Instagram mengirim {"type":"MEASURE","details":{"height":…}} — sama seperti yang dibaca embed.js resminya
    const onMsg = (m: MessageEvent) => {
      if (m.origin !== 'https://www.instagram.com' || m.source !== frame.current?.contentWindow) return;
      try { const d = typeof m.data === 'string' ? JSON.parse(m.data) : m.data; if (d?.type === 'MEASURE' && d.details?.height > 0) setIgH(Math.ceil(d.details.height)); } catch { /* pesan lain */ }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [isIg]);
  if (!e) {
    const href = parseHref(url);
    return href ? <a className="pill" href={href} target="_blank" rel="noopener noreferrer"><Icon name="external" size={15} />Buka media</a> : null;
  }
  const web = e.kind === 'web';
  return (
    <div className={`embed embed-${e.kind}${frameless ? ' frameless' : ''}`} style={web ? { height: height || 520 } : igH ? { height: igH } : { aspectRatio: e.ratio }}>
      <iframe ref={frame} src={e.src} title={title} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        // program web pihak luar: skrip boleh jalan, tapi tidak bisa membuka halaman induk
        sandbox={web ? 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads' : undefined} />
    </div>
  );
};

/** Satu media: gambar, file video, atau embed. */
export const Media: React.FC<{ url: string; alt: string; height?: number; eager?: boolean; frameless?: boolean }> = ({ url, alt, height, eager, frameless }) => {
  const k = mediaKind(url);
  if (k === 'image') return <img className="mag-img" src={cld(url, 1400)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
  if (k === 'video') return <video className="mag-img" src={url} controls playsInline preload="metadata" />;
  if (k === 'embed') return <EmbedFrame url={url} title={alt} height={height} frameless={frameless} />;
  return null;
};

/** "16:9" / "1.7778" / "auto" → nilai CSS aspect-ratio (undefined = ukuran asli media). */
export const ratioCss = (r?: string) => (!r || r === 'auto' ? undefined : r.includes(':') ? r.replace(':', ' / ') : r);
export interface Fit { ratio?: string; zoom?: number; shiftY?: number }

/**
 * Media dalam kotak rasio tetap, dipotong (crop) + zoom + geser vertikal.
 * Dipakai mis. untuk menghilangkan bar hitam atas-bawah video landscape di embed Instagram.
 */
export const FitMedia: React.FC<{ url: string; alt: string; fit: Fit; frameless?: boolean; height?: number; eager?: boolean }> = ({ url, alt, fit, frameless, height, eager }) => {
  const ar = ratioCss(fit.ratio);
  if (!ar) return <Media url={url} alt={alt} height={height} frameless={frameless} eager={eager} />;
  const z = (fit.zoom ?? 100) / 100, y = fit.shiftY ?? 0, k = mediaKind(url);
  const fill: React.CSSProperties = { objectPosition: `50% ${50 - y}%`, transform: `scale(${z})` };
  return (
    <div className="fitbox" style={{ aspectRatio: ar }}>
      {k === 'image' ? <img src={cld(url, 1400)} alt={alt} style={fill} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        : k === 'video' ? <video src={url} style={fill} controls playsInline preload="metadata" />
          : <div className="fitbox-in" style={{ transform: `translate(-50%, calc(-50% + ${y}%)) scale(${z})` }}><EmbedFrame url={url} title={alt} height={height} frameless={frameless} /></div>}
    </div>
  );
};

/** Lebar media (% lebar artikel); blok Teks + Media default 45%. */
export const widthOf = (b: ArticleBlock) => Math.max(20, Math.min(100, b.width ?? (b.type === 'media' ? 45 : 100)));
const fitOf = (b: ArticleBlock): Fit => ({ ratio: b.ratio, zoom: b.zoom, shiftY: b.shiftY });

/** Slideshow foto: geser otomatis (berhenti saat disentuh / hover), tombol, titik, swipe. */
export const Slideshow: React.FC<{ urls: string[]; caption?: string; alt: string; ratio?: string; style?: React.CSSProperties }> = ({ urls, caption, alt, ratio, style }) => {
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
    <figure className="mag-figure" style={style}>
      <div className="slides" style={{ aspectRatio: ratioCss(ratio) }} tabIndex={0} aria-roledescription="slideshow" aria-label={alt}
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

export const Block: React.FC<{ b: ArticleBlock; title: string }> = ({ b, title }) => {
  const fig: React.CSSProperties = { width: `${widthOf(b)}%`, marginInline: 'auto' };
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
      <figure className="mag-figure" style={fig}><FitMedia url={b.url} alt={b.caption || title} fit={fitOf(b)} height={b.height} frameless={b.style === 'frameless'} />{b.caption && b.style !== 'frameless' && <figcaption>{b.caption}</figcaption>}</figure>
    );
    case 'gallery': return b.style === 'grid' ? (
      <figure className="mag-figure" style={fig}>
        <div className="mag-grid">{b.urls.filter(Boolean).map((u, j) => <img key={u + j} src={cld(u, 900)} alt={`${b.caption || title} ${j + 1}`} loading="lazy" decoding="async" />)}</div>
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    ) : <Slideshow urls={b.urls} caption={b.caption} alt={b.caption || title} ratio={b.ratio} style={fig} />;
    case 'media': return (
      <div className={`mag-split ${b.side === 'left' ? 'media-left' : ''}`}
        style={{ ['--split' as any]: b.side === 'left' ? `${widthOf(b)}% minmax(0, 1fr)` : `minmax(0, 1fr) ${widthOf(b)}%` }}>
        <div className="mag-split-text"><RichText text={b.text} /></div>
        <figure className="mag-figure"><FitMedia url={b.url} alt={b.caption || title} fit={fitOf(b)} height={b.height} frameless={b.style === 'frameless'} />{b.caption && b.style !== 'frameless' && <figcaption>{b.caption}</figcaption>}</figure>
      </div>
    );
    default: return <div className={`mag-text mag-${b.style || 'plain'}`}><RichText text={b.text} /></div>;
  }
};

export const ArticleBlocks: React.FC<{ blocks: ArticleBlock[]; title: string }> = ({ blocks, title }) => (
  <>{blocks.map(b => <Block key={b.id} b={b} title={title} />)}</>
);
