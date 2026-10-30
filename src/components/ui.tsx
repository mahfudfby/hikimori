// src/components/ui.tsx — primitif UI bersama (ikon, reveal, header halaman, dll).
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ───────── Ikon (inline SVG, stroke = currentColor) ───────── */
const P: Record<string, React.ReactNode> = {
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  play: <path d="M7 5v14l11-7z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  next: <path d="M6 5v14l9-7zM18 5v14" />,
  alarm: <><circle cx="12" cy="13" r="7" /><path d="M12 10v3l2 2M5 4 2.5 6.5M19 4l2.5 2.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  map: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  download: <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 21h16" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  up: <path d="m6 15 6-6 6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  chat: <path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.6A8.5 8.5 0 1 1 21 12z" />,
  layers: <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5L5 20" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  logout: <path d="M15 12H4m0 0 4-4m-4 4 4 4M10 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8" />,
  save: <><path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M7 3v6h8M7 21v-7h10v7" /></>,
  upload: <path d="M12 21V9m0 0-4.5 4.5M12 9l4.5 4.5M4 3h16" />,
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  tool: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  link: <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />,
};

export const Icon: React.FC<{ name: keyof typeof P | string; size?: number; className?: string; fill?: boolean }> = ({ name, size = 18, className, fill }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true"
    fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {P[name] ?? P.spark}
  </svg>
);

/* ───────── Mode "lite" (HP / hemat data / jaringan lambat) ─────────
   Kelas `lite` dipasang di <html> oleh skrip kecil di public/index.html sebelum render. */
export const isLite = (): boolean =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('lite');

/* ───────── Antrean muat berurutan ─────────
   Di mode lite, setiap blok berat di-mount SATU PER SATU: blok berikutnya baru
   dirender setelah blok sebelumnya selesai & browser sedang idle. Blok di bawah
   layar baru masuk antrean saat mendekati viewport. Desktop: langsung tampil. */
const queue: Array<() => void> = [];
let pumping = false;
const STAGE_GAP = 70; // jeda antar blok (ms)
const pump = () => {
  if (pumping) return;
  const job = queue.shift();
  if (!job) return;
  pumping = true;
  const run = () => {
    job();
    // beri waktu React merender blok ini, baru lanjut ke blok berikutnya
    setTimeout(() => { pumping = false; pump(); }, STAGE_GAP);
  };
  const w = window as any;
  w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 400 }) : setTimeout(run, 16);
};

/** true bila blok boleh dirender. Mode lite: menunggu giliran di antrean. */
export const useStaged = (ref: React.RefObject<Element>, margin = '300px 0px', eager = false): boolean => {
  const [ready, setReady] = useState(() => eager || !isLite());
  useEffect(() => { if (eager) setReady(true); }, [eager]);
  useEffect(() => {
    if (ready) return;
    const el = ref.current;
    let alive = true, queued = false;
    const enqueue = () => { if (queued) return; queued = true; queue.push(() => { if (alive) setReady(true); }); pump(); };
    if (!el || typeof IntersectionObserver === 'undefined') { enqueue(); return () => { alive = false; }; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); enqueue(); } }, { rootMargin: margin });
    io.observe(el);
    return () => { alive = false; io.disconnect(); };
  }, [ready, ref, margin]);
  return ready;
};

/** Pembungkus blok berurutan. `className` diteruskan ke placeholder supaya posisi grid tetap. */
export const Staged: React.FC<{ children: React.ReactNode; className?: string; minHeight?: number; eager?: boolean }> = ({ children, className = '', minHeight = 180, eager = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useStaged(ref, '300px 0px', eager);
  if (ready) return <>{children}</>;
  return <div ref={ref} className={`skeleton stage-ph ${className}`} style={{ minHeight, borderRadius: 'var(--r-xl)' }} aria-hidden="true" />;
};

/* ───────── Reveal (IntersectionObserver + CSS, tanpa library animasi) ───────── */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; as?: keyof JSX.IntrinsicElements; style?: React.CSSProperties; minHeight?: number }> =
  ({ children, delay = 0, className = '', as = 'div', style, minHeight = 140 }) => {
    const ref = useRef<HTMLElement>(null);
    const ready = useStaged(ref);
    const [inView, setIn] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!ready) return;
      if (!el || typeof IntersectionObserver === 'undefined') { setIn(true); return; }
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIn(true); io.disconnect(); } }, { rootMargin: '0px 0px -40px 0px' });
      io.observe(el);
      return () => io.disconnect();
    }, [ready]);
    const Tag = as as any;
    if (!ready) return <Tag ref={ref} className={`skeleton ${className}`} style={{ minHeight, ...style }} aria-hidden="true" />;
    // Mode lite: tanpa delay bertingkat (blok sudah muncul bergiliran lewat antrean)
    return <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ transitionDelay: isLite() ? '0ms' : `${delay}ms`, ...style }}>{children}</Tag>;
  };

/** URL Cloudinary dengan lebar tertentu (f_auto,q_auto,w_X). URL lain dikembalikan apa adanya. */
export const cld = (url: string, w: number): string => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const [head, tail] = url.split('/upload/');
  const parts = tail.split('/');
  const isTransform = /(^|,)(w|f|q|c|h)_/.test(parts[0]);
  const rest = isTransform ? parts.slice(1).join('/') : tail;
  return `${head}/upload/f_auto,q_auto,w_${w}/${rest}`;
};
export const cldSet = (url: string, widths: number[]) =>
  url.includes('res.cloudinary.com') ? widths.map(w => `${cld(url, w)} ${w}w`).join(', ') : undefined;

/* ───────── Header halaman detail ───────── */
export const PageHero: React.FC<{ crumb: string; title: React.ReactNode; lead?: React.ReactNode; aside?: React.ReactNode }> = ({ crumb, title, lead, aside }) => (
  <header className="page-hero">
    <div>
      <nav className="crumb" aria-label="breadcrumb"><Link to="/">Home</Link><span>/</span><span>{crumb}</span></nav>
      <h1 className="h-page">{title}</h1>
      {lead && <p className="muted mt-16" style={{ maxWidth: 680, fontSize: '1.02rem' }}>{lead}</p>}
    </div>
    {aside && <div>{aside}</div>}
  </header>
);

export const CardLink: React.FC<{ to: string; label: string; dark?: boolean }> = ({ to, label, dark }) => (
  <Link to={to} className={`icon-btn ${dark ? 'dark' : ''}`} aria-label={label} title={label}><Icon name="arrow" /></Link>
);

export const Stat: React.FC<{ icon: string; value: React.ReactNode; label: string }> = ({ icon, value, label }) => (
  <div className="stat">
    <div className="stat-row">
      <span className="stat-k" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <span className="row gap-4 muted xs"><Icon name={icon} size={14} /></span>
        <span className="xs muted">{label}</span>
      </span>
      <span className="num-xl">{value}</span>
    </div>
  </div>
);

/** Angka yang menghitung naik saat pertama terlihat. */
export const CountUp: React.FC<{ to: number; decimals?: number }> = ({ to, decimals = 0 }) => {
  const [v, setV] = useState(() => (isLite() ? to : 0));
  useEffect(() => {
    if (isLite()) { setV(to); return; } // HP: langsung tampil, tanpa 60 render/detik
    let raf = 0; const t0 = performance.now(); const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 3);
      setV(to * e); if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v.toFixed(decimals)}</>;
};

export const Bullets: React.FC<{ text: string; className?: string }> = ({ text, className = 'bullets' }) => {
  const rows = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
  if (!rows.length) return null;
  return <ul className={className}>{rows.map((r, i) => <li key={i}>{r.replace(/^[•-]\s*/, '')}</li>)}</ul>;
};

export const Logo: React.FC<{ src?: string; alt: string; fallback?: string }> = ({ src, alt, fallback = '🏢' }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="logo-box">
      {src && !failed ? <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} /> : <span aria-hidden="true">{fallback}</span>}
    </div>
  );
};

/** Scroll ke elemen #hash (mis. /sertifikat#c1) setelah konten ter-render. Mengembalikan id aktif. */
export const useHashTarget = (ready: boolean = true): string => {
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash.slice(1) : ''));
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    if (!ready || !hash) return;
    const t = setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    return () => clearTimeout(t);
  }, [hash, ready]);
  return hash;
};

/** Ganti judul tab browser per halaman. */
export const useTitle = (title: string) => {
  useEffect(() => { document.title = title; }, [title]);
};

export const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; label: string }> = ({ open, onClose, children, label }) => {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={label} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(20,18,12,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card solid page-in" onClick={e => e.stopPropagation()} style={{ width: 'min(860px, 100%)', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="row" style={{ justifyContent: 'flex-end' }}><button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div>
        {children}
      </div>
    </div>
  );
};

/**
 * Carousel geser kanan-kiri untuk layar sentuh (HP/tablet): CSS scroll-snap bawaan browser,
 * tanpa library. Di desktop (mouse) tampil sebagai grid biasa. Titik indikator bisa diketuk.
 */
export const Swipe: React.FC<{ children: React.ReactNode; className?: string; label: string }> = ({ children, className = 'grid-3', label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = React.Children.count(children);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = el.children[0] as HTMLElement | undefined;
        if (!first) return;
        const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || '0');
        setActive(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / (step || 1)))));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [count]);
  const go = (i: number) => {
    const el = ref.current; const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - (el.clientWidth - child.clientWidth) / 2, behavior: 'smooth' });
  };
  return (
    <div className="swipe-wrap">
      <div ref={ref} className={`swipe ${className}`} role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}>
        {children}
      </div>
      {count > 1 && (
        <div className="swipe-dots" role="tablist" aria-label={label}>
          {Array.from({ length: count }, (_, i) => (
            <button key={i} role="tab" aria-selected={i === active} aria-label={`${i + 1} / ${count}`} className={i === active ? 'on' : ''} onClick={() => go(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ───────── Efek kursor (desktop): kartu miring 3D + kilau, tombol "magnet" ─────────
   Satu listener untuk seluruh halaman; mati di HP/lite, layar sentuh & reduced-motion. */
export const useCursorFx = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled || isLite() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let card: HTMLElement | null = null, mag: HTMLElement | null = null, raf = 0, ev: PointerEvent | null = null;
    const clear = (el: HTMLElement | null, cls: string) => { if (el) { el.classList.remove(cls); el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.style.removeProperty('--tx'); el.style.removeProperty('--ty'); } };
    const frame = () => {
      raf = 0; if (!ev) return;
      const t = ev.target as HTMLElement;
      const c = t.closest?.('.card:not(.no-tilt)') as HTMLElement | null;
      if (c !== card) { clear(card, 'tilt'); card = c; }
      if (card) {
        const r = card.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        const k = Math.min(1, 420 / Math.max(r.width, r.height)); // kartu lebar → miring lebih halus
        card.classList.add('tilt');
        card.style.setProperty('--rx', `${((0.5 - y) * 7 * k).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((x - 0.5) * 9 * k).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      }
      const m = t.closest?.('.pill, .icon-btn') as HTMLElement | null;
      if (m !== mag) { clear(mag, 'magnet'); mag = m; }
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.classList.add('magnet');
        mag.style.setProperty('--tx', `${((ev.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
        mag.style.setProperty('--ty', `${((ev.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
      }
    };
    const onMove = (e: PointerEvent) => { ev = e; if (!raf) raf = requestAnimationFrame(frame); };
    const onLeave = () => { clear(card, 'tilt'); clear(mag, 'magnet'); card = mag = null; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf); onLeave(); };
  }, [enabled]);
};
