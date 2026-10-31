// src/admin/MediaFrameEditor.tsx — pratinjau media di "lembar artikel" CMS: seret tepian untuk ubah lebar/tinggi,
// pilih rasio, zoom & geser (crop) — mis. hilangkan bar hitam atas-bawah video landscape di embed Instagram.
import React, { useRef, useState } from 'react';
import type { ArticleBlock } from '../hooks/usePortfolio';
import { FitMedia, Slideshow, ratioCss, widthOf } from '../components/Article';

const RATIOS = [
  { value: 'auto', label: 'Asli (otomatis)' },
  { value: '16:9', label: '16:9 landscape / banner' },
  { value: '9:16', label: '9:16 reels / vertikal' },
  { value: '4:5', label: '4:5 post' },
  { value: '1:1', label: '1:1 kotak' },
  { value: '4:3', label: '4:3' },
];

export const MediaFrameEditor: React.FC<{ b: ArticleBlock; up: (p: Partial<ArticleBlock>) => void }> = ({ b, up }) => {
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<'' | 'w' | 'h' | 'wh'>('');
  const w = widthOf(b);
  const ratio = b.ratio || 'auto';
  const custom = ratio !== 'auto' && !RATIOS.some(r => r.value === ratio);
  const hasMedia = b.type === 'gallery' ? b.urls.some(Boolean) : !!b.url.trim();

  const start = (mode: 'w' | 'h' | 'wh') => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag(mode);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag || !stage.current || !box.current) return;
    const s = stage.current.getBoundingClientRect(), r = box.current.getBoundingClientRect();
    const patch: Partial<ArticleBlock> = {};
    if (drag !== 'h') {
      // kotak di tengah: lebar = 2 × jarak kursor dari garis tengah
      const pct = (Math.abs(e.clientX - (s.left + s.width / 2)) * 2) / s.width * 100;
      patch.width = Math.round(Math.max(20, Math.min(100, pct)));
    }
    if (drag !== 'w') {
      const hpx = Math.max(60, e.clientY - r.top);
      const wpx = drag === 'wh' && patch.width ? (s.width * patch.width) / 100 : r.width;
      patch.ratio = (wpx / hpx).toFixed(4);
    }
    up(patch);
  };
  const end = () => setDrag('');

  return (
    <div className="field">
      <span>Ukuran & posisi di lembar artikel</span>
      <div ref={stage} className={`mfe-stage${drag ? ' dragging' : ''}`} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {!hasMedia ? <div className="mfe-empty xs muted">Isi media dulu untuk melihat pratinjau.</div> : (
          <div ref={box} className="mfe-box" style={{ width: `${w}%` }}>
            {b.type === 'gallery'
              ? <Slideshow urls={b.urls} alt="pratinjau" ratio={b.ratio} />
              : <FitMedia url={b.url} alt="pratinjau" fit={{ ratio: b.ratio, zoom: b.zoom, shiftY: b.shiftY }} height={b.height} frameless={b.style === 'frameless'} />}
            <span className="mfe-h mfe-right" onPointerDown={start('w')} title="Seret untuk ubah lebar" />
            <span className="mfe-h mfe-left" onPointerDown={start('w')} title="Seret untuk ubah lebar" />
            <span className="mfe-h mfe-bottom" onPointerDown={start('h')} title="Seret untuk ubah tinggi (rasio bebas)" />
            <span className="mfe-h mfe-corner" onPointerDown={start('wh')} title="Seret untuk ubah lebar & tinggi" />
            <span className="mfe-badge">{w}% · {ratio === 'auto' ? 'asli' : custom ? `bebas ${Number(ratio).toFixed(2)}` : ratio}</span>
          </div>
        )}
      </div>
      <small className="xs faint">Seret tepi kiri/kanan = lebar, tepi bawah = tinggi, sudut kanan bawah = keduanya. {b.type === 'media' && 'Lebar = porsi media di samping teks.'}</small>
      <div className="cms-grid" style={{ ['--cols' as any]: 3 }}>
        <label className="field"><span>Rasio kotak</span>
          <select className="input" value={custom ? 'custom' : ratio} onChange={e => up({ ratio: e.target.value === 'custom' ? ratio : e.target.value })}>
            {RATIOS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            {custom && <option value="custom">Bebas (hasil seret)</option>}
          </select>
        </label>
        <label className="field"><span>Zoom crop: {b.zoom ?? 100}%</span>
          <input type="range" min={100} max={300} step={1} value={b.zoom ?? 100} disabled={!ratioCss(ratio) || b.type === 'gallery'} onChange={e => up({ zoom: Number(e.target.value) })} />
        </label>
        <label className="field"><span>Geser vertikal: {b.shiftY ?? 0}%</span>
          <input type="range" min={-60} max={60} step={1} value={b.shiftY ?? 0} disabled={!ratioCss(ratio) || b.type === 'gallery'} onChange={e => up({ shiftY: Number(e.target.value) })} />
        </label>
      </div>
      <div className="row wrap gap-8">
        <button type="button" className="pill sm" onClick={() => up({ ratio: '16:9', width: 100, zoom: 100, shiftY: 0 })}>Banner landscape 16:9</button>
        <button type="button" className="pill sm" onClick={() => up({ ratio: '9:16', width: b.type === 'media' ? 38 : 45, zoom: 100, shiftY: 0 })}>Reels vertikal 9:16</button>
        <button type="button" className="pill sm" onClick={() => up({ ratio: '16:9', zoom: 180, shiftY: 0 })}>Hilangkan bar hitam (landscape)</button>
        <button type="button" className="pill sm ghost" onClick={() => up({ ratio: 'auto', width: b.type === 'media' ? 45 : 100, zoom: 100, shiftY: 0 })}>Reset</button>
      </div>
      {ratioCss(ratio) && b.type !== 'gallery' && <small className="xs faint">Bar hitam masih terlihat? Naikkan <strong>Zoom crop</strong> sampai hilang, lalu atur <strong>Geser vertikal</strong> agar video pas di tengah.</small>}
    </div>
  );
};
