// src/admin/fields.tsx — komponen form CMS (tanpa coding: semua konten diedit lewat ini).
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Icon } from '../components/ui';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import type { Bi } from '../content/types';

export const uid = (p = 'x') => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const Text: React.FC<{ label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; hint?: string }> =
  ({ label, value, onChange, type = 'text', placeholder, hint }) => (
    <label className="field">
      <span>{label}</span>
      <input className="input" type={type} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      {hint && <small className="xs faint">{hint}</small>}
    </label>
  );

export const Area: React.FC<{ label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }> =
  ({ label, value, onChange, rows = 4, hint }) => (
    <label className="field">
      <span>{label}</span>
      <textarea className="input" rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} />
      {hint && <small className="xs faint">{hint}</small>}
    </label>
  );

export const Select: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> =
  ({ label, value, onChange, options }) => (
    <label className="field">
      <span>{label}</span>
      <select className="input" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );

export const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <label className="row gap-8 small" style={{ cursor: 'pointer', minHeight: 44 }}>
    <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--ink)' }} />
    {label}
  </label>
);

/** Field bilingual: kolom Indonesia + English berdampingan. */
export const BiField: React.FC<{ label: string; value: Bi; onChange: (v: Bi) => void; area?: boolean; rows?: number; hint?: string }> =
  ({ label, value, onChange, area, rows = 4, hint }) => {
    const v = value || { id: '', en: '' };
    const Input = (lang: 'id' | 'en') => area
      ? <textarea className="input" rows={rows} value={v[lang]} onChange={e => onChange({ ...v, [lang]: e.target.value })} />
      : <input className="input" value={v[lang]} onChange={e => onChange({ ...v, [lang]: e.target.value })} />;
    return (
      <div className="field">
        <div className="row between"><span>{label}</span>
          <button type="button" className="pill sm ghost" title="Salin teks Indonesia ke English" onClick={() => onChange({ ...v, en: v.id })}><Icon name="copy" size={12} />ID → EN</button>
        </div>
        <div className="cms-bi">
          <div><small className="xs faint">🇮🇩 Indonesia</small>{Input('id')}</div>
          <div><small className="xs faint">🇬🇧 English</small>{Input('en')}</div>
        </div>
        {hint && <small className="xs faint">{hint}</small>}
      </div>
    );
  };

/** Daftar teks bilingual, satu item per baris. */
export const BiLines: React.FC<{ label: string; value: Bi[]; onChange: (v: Bi[]) => void; hint?: string }> = ({ label, value, onChange, hint }) => {
  const ids = value.map(v => v.id).join('\n');
  const ens = value.map(v => v.en).join('\n');
  const set = (idText: string, enText: string) => {
    const a = idText.split('\n'); const b = enText.split('\n');
    const n = Math.max(a.length, b.length);
    onChange(Array.from({ length: n }, (_, i) => ({ id: a[i] ?? '', en: b[i] ?? '' })).filter(x => x.id.trim() || x.en.trim()));
  };
  return (
    <div className="field">
      <span>{label}</span>
      <div className="cms-bi">
        <div><small className="xs faint">🇮🇩 satu per baris</small><textarea className="input" rows={4} defaultValue={ids} onBlur={e => set(e.target.value, ens)} /></div>
        <div><small className="xs faint">🇬🇧 one per line</small><textarea className="input" rows={4} defaultValue={ens} onBlur={e => set(ids, e.target.value)} /></div>
      </div>
      <small className="xs faint">{hint || 'Baris ke-n kolom ID berpasangan dengan baris ke-n kolom EN. Tersimpan saat kursor keluar dari kotak.'}</small>
    </div>
  );
};

export const Tags: React.FC<{ label: string; value: string[]; onChange: (v: string[]) => void }> = ({ label, value, onChange }) => {
  const [text, setText] = useState(value.join(', '));
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input" value={text} onChange={e => setText(e.target.value)}
        onBlur={() => onChange(text.split(',').map(s => s.trim()).filter(Boolean))} placeholder="pisahkan dengan koma" />
      {value.length > 0 && <div className="row wrap gap-4">{value.map(v => <span key={v} className="chip">{v}</span>)}</div>}
    </label>
  );
};

/** Gambar: tempel URL atau upload ke Cloudinary. */
export const ImageInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; round?: boolean }> = ({ label, value, onChange, round }) => {
  const [busy, setBusy] = useState(false);
  const upload = async (f?: File) => {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp|gif|avif|svg\+xml)$/.test(f.type)) { toast.error('Hanya file gambar (JPG, PNG, WebP, GIF, AVIF, SVG)'); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error('Maksimal 5 MB'); return; }
    setBusy(true);
    try { const url = await uploadToCloudinary(f); onChange(url); toast.success('Gambar terunggah'); }
    catch { toast.error('Upload gagal — cek koneksi / preset Cloudinary'); }
    finally { setBusy(false); }
  };
  return (
    <div className="field">
      <span>{label}</span>
      <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
        <div className="logo-box" style={{ width: 72, height: 72, flexBasis: 72, borderRadius: round ? '50%' : 16 }}>
          {value ? <img src={value} alt="" style={{ objectFit: 'cover', padding: 0 }} /> : <Icon name="image" />}
        </div>
        <div className="grow stack gap-8">
          <input className="input" value={value} placeholder="https://…" onChange={e => onChange(e.target.value)} />
          <div className="row gap-8">
            <label className="pill sm dark" style={{ cursor: 'pointer' }}>
              <Icon name="upload" size={13} />{busy ? 'Mengunggah…' : 'Upload'}
              <input type="file" accept="image/*" hidden disabled={busy} onChange={e => upload(e.target.files?.[0])} />
            </label>
            {value && <button type="button" className="pill sm" onClick={() => onChange('')}><Icon name="trash" size={13} />Hapus</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Editor daftar generik: tambah, hapus, duplikat, urutkan naik/turun, buka-tutup item. */
export function ListEditor<T extends { id: string }>({ items, onChange, create, title, render, addLabel = 'Tambah' }: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  title: (item: T, i: number) => React.ReactNode;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };
  return (
    <div className="stack gap-8">
      {items.map((it, i) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className="cms-item">
            <div className="row gap-8">
              <button type="button" className="grow row gap-8 cms-item-head" onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen}>
                <span className="xs faint" style={{ width: 22 }}>{i + 1}</span>
                <span className="grow small" style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title(it, i) || <em className="faint">(tanpa judul)</em>}</span>
                <Icon name={isOpen ? 'up' : 'down'} size={15} />
              </button>
              <button type="button" className="icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Naik"><Icon name="up" size={14} /></button>
              <button type="button" className="icon-btn sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Turun"><Icon name="down" size={14} /></button>
              <button type="button" className="icon-btn sm" aria-label="Duplikat" onClick={() => { const c = { ...JSON.parse(JSON.stringify(it)), id: uid() }; const n = [...items]; n.splice(i + 1, 0, c); onChange(n); }}><Icon name="copy" size={14} /></button>
              <button type="button" className="icon-btn sm" aria-label="Hapus" onClick={() => { if (window.confirm('Hapus item ini?')) onChange(items.filter(x => x.id !== it.id)); }}><Icon name="trash" size={14} /></button>
            </div>
            {isOpen && <div className="cms-item-body">{render(it, patch => onChange(items.map(x => (x.id === it.id ? { ...x, ...patch } : x))))}</div>}
          </div>
        );
      })}
      <button type="button" className="pill" style={{ alignSelf: 'flex-start' }} onClick={() => { const n = create(); onChange([...items, n]); setOpen(n.id); }}>
        <Icon name="plus" size={15} />{addLabel}
      </button>
    </div>
  );
}

export const Grid: React.FC<{ children: React.ReactNode; cols?: number }> = ({ children, cols = 2 }) => (
  <div className="cms-grid" style={{ ['--cols' as any]: cols }}>{children}</div>
);

export const Section: React.FC<{ title: string; desc?: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, desc, children, actions }) => (
  <section className="card solid stack gap-16">
    <div className="row between wrap gap-8">
      <div><h2 className="h-card">{title}</h2>{desc && <p className="xs muted mt-8">{desc}</p>}</div>
      {actions}
    </div>
    {children}
  </section>
);
