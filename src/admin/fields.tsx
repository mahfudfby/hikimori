// src/admin/fields.tsx — komponen form CMS (tanpa coding: semua konten diedit lewat ini).
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

/** Daftar poin bilingual: satu baris per poin (ID + EN), tombol tambah & hapus per poin. */
export const BiPoints: React.FC<{ label: string; value: Bi[]; onChange: (v: Bi[]) => void; hint?: string; addLabel?: string }> =
  ({ label, value, onChange, hint, addLabel = 'Tambah poin' }) => {
    // state lokal agar poin baru yang masih kosong tidak langsung hilang; yang tersimpan hanya poin berisi
    const [rows, setRows] = useState<Bi[]>(() => (value.length ? value : [{ id: '', en: '' }]).map(x => ({ id: x.id, en: x.en })));
    const commit = (next: Bi[]) => { setRows(next); onChange(next.filter(x => x.id.trim() || x.en.trim())); };
    const edit = (i: number, lang: 'id' | 'en', text: string) => commit(rows.map((r, j) => (j === i ? { ...r, [lang]: text } : r)));
    return (
      <div className="field">
        <span>{label}</span>
        <div className="cms-points">
          {rows.map((r, i) => (
            <div className="cms-point" key={i}>
              <span className="cms-point-n xs faint">{i + 1}</span>
              <textarea className="input" rows={2} placeholder="🇮🇩 Indonesia" aria-label={`Poin ${i + 1} Indonesia`} value={r.id} onChange={e => edit(i, 'id', e.target.value)} />
              <textarea className="input" rows={2} placeholder="🇬🇧 English" aria-label={`Poin ${i + 1} English`} value={r.en} onChange={e => edit(i, 'en', e.target.value)} />
              <button type="button" className="icon-btn sm" aria-label={`Hapus poin ${i + 1}`} title="Hapus poin" onClick={() => commit(rows.filter((_, j) => j !== i))}><Icon name="close" size={14} /></button>
            </div>
          ))}
        </div>
        <button type="button" className="pill sm" style={{ alignSelf: 'flex-start' }} onClick={() => setRows([...rows, { id: '', en: '' }])}><Icon name="plus" size={14} />{addLabel}</button>
        {hint && <small className="xs faint">{hint}</small>}
      </div>
    );
  };

/** Teks bilingual berisi baris "• ..." diedit sebagai daftar poin (disimpan tetap sebagai teks berbaris). */
export const BiBulletText: React.FC<{ label: string; value: Bi; onChange: (v: Bi) => void; hint?: string; addLabel?: string }> =
  ({ label, value, onChange, hint, addLabel }) => {
    const split = (t: string) => (t || '').split('\n').map(l => l.trim().replace(/^[•-]\s*/, '')).filter(Boolean);
    const [initial] = useState<Bi[]>(() => {
      const a = split(value?.id), b = split(value?.en);
      return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => ({ id: a[i] ?? '', en: b[i] ?? '' }));
    });
    const join = (rows: Bi[], lang: 'id' | 'en') => rows.map(r => r[lang].trim()).filter(Boolean).map(l => `• ${l.replace(/\s*\n\s*/g, ' ')}`).join('\n');
    return <BiPoints label={label} value={initial} hint={hint} addLabel={addLabel} onChange={rows => onChange({ id: join(rows, 'id'), en: join(rows, 'en') })} />;
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

/** Gambar: tempel URL atau upload ke Cloudinary, dukung drag-and-drop & paste gambar (Ctrl+V). */
export const ImageInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; round?: boolean }> = ({ label, value, onChange, round }) => {
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (f?: File) => {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp|gif|avif|svg\+xml)$/.test(f.type)) { toast.error('Hanya file gambar (JPG, PNG, WebP, GIF, AVIF, SVG)'); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error('Maksimal 5 MB'); return; }
    setBusy(true);
    try {
      const url = await uploadToCloudinary(f);
      onChange(url);
      toast.success('Gambar terunggah');
    } catch {
      toast.error('Upload gagal — cek koneksi / preset Cloudinary');
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0];
    if (file && /^image\//.test(file.type)) {
      e.preventDefault();
      upload(file);
    }
  };

  return (
    <div
      className={`field cms-img-field${dragOver ? ' drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onPaste={onPaste}
    >
      {label && <span>{label}</span>}
      <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
        <div className={`logo-box${dragOver ? ' drag-active' : ''}`} style={{ width: 72, height: 72, flexBasis: 72, borderRadius: round ? '50%' : 16 }}>
          {value ? <img src={value} alt="" style={{ objectFit: 'cover', padding: 0 }} /> : <Icon name="image" />}
        </div>
        <div className="grow stack gap-8">
          <input className="input" value={value} placeholder="https://… atau seret gambar / paste (Ctrl+V)" onChange={e => onChange(e.target.value)} />
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

/** Tombol tambahan di header halaman edit (mis. Publikasikan dari AdminPanel), dipasang lewat Provider. */
export const EditPageActions = createContext<React.ReactNode>(null);

/** Tutup halaman edit lewat riwayat (sekaligus membuang entri Back-nya); tanpa entri → panggil fallback. */
export const closeEditPage = (fallback: () => void) => { if (window.history.state?.cmsEdit) window.history.back(); else fallback(); };

/** Halaman edit terpisah (layar penuh) untuk satu item. Tombol Back HP/browser = kembali ke daftar.
 *  Isi tetap tersimpan ke draf yang sama (autosave), jadi tidak ada yang hilang saat kembali. */
export const EditPage: React.FC<{ title: React.ReactNode; sub?: React.ReactNode; onClose: () => void; actions?: React.ReactNode; nav?: { prev?: () => void; next?: () => void; pos: string }; children: React.ReactNode }> =
  ({ title, sub, onClose, actions, nav, children }) => {
    const closeRef = useRef(onClose); closeRef.current = onClose;
    const extra = useContext(EditPageActions);
    useEffect(() => {
      // satu entri riwayat per halaman edit → tombol Back menutup halaman, bukan keluar dari CMS (cek state: aman di StrictMode)
      if (!window.history.state?.cmsEdit) window.history.pushState({ ...window.history.state, cmsEdit: true }, '');
      const onPop = () => { if (!window.history.state?.cmsEdit) closeRef.current(); };
      window.addEventListener('popstate', onPop);
      const root = document.documentElement; root.classList.add('cms-page-open');

      return () => { window.removeEventListener('popstate', onPop); root.classList.remove('cms-page-open'); };
    }, []);
    const back = () => closeEditPage(onClose);
    const bodyRef = useRef<HTMLDivElement>(null);
    useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [nav?.pos]);
    return createPortal(
      <div className="cms-page" role="dialog" aria-modal="true">
        <header className="cms-page-head">
          <button type="button" className="icon-btn" onClick={back} aria-label="Kembali ke daftar"><Icon name="left" size={18} /></button>
          <div className="grow" style={{ minWidth: 0 }}>
            <div className="cms-page-title">{title}</div>
            {sub && <div className="xs muted cms-page-sub">{sub}</div>}
          </div>
          {nav && (
            <div className="row gap-4">
              <button type="button" className="icon-btn sm" onClick={nav.prev} disabled={!nav.prev} aria-label="Item sebelumnya"><Icon name="left" size={14} /></button>
              <span className="xs faint" style={{ minWidth: 34, textAlign: 'center' }}>{nav.pos}</span>
              <button type="button" className="icon-btn sm" onClick={nav.next} disabled={!nav.next} aria-label="Item berikutnya"><Icon name="right" size={14} /></button>
            </div>
          )}
          {actions ?? <>{extra}<button type="button" className="pill dark sm" onClick={back}><Icon name="check" size={14} />Selesai</button></>}
        </header>
        <div className="cms-page-body" ref={bodyRef}>{children}</div>
      </div>,
      document.body,
    );
  };

/** Editor daftar generik: tambah, hapus, duplikat, urutkan naik/turun, buka-tutup item, sisipkan. */
export function ListEditor<T extends { id: string }>({ items, onChange, create, title, render, addLabel = 'Tambah', extraAdd = [], page }: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  title: (item: T, i: number) => React.ReactNode;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
  /** tombol tambah lain (mis. per jenis blok); item baru langsung terbuka */
  extraAdd?: { label: string; icon: string; create: () => T }[];
  /** isi item dibuka di halaman edit terpisah (layar penuh), bukan dilipat di dalam daftar */
  page?: string;
}) {
  const [openPageId, setOpenPageId] = useState<string | null>(null);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const add = (n: T) => {
    onChange([...items, n]);
    if (page) setOpenPageId(n.id);
    else setOpenMap(m => ({ ...m, [n.id]: true }));
  };

  const insertAfter = (i: number, n: T) => {
    const next = [...items];
    next.splice(i + 1, 0, n);
    onChange(next);
    if (page) setOpenPageId(n.id);
    else setOpenMap(m => ({ ...m, [n.id]: true }));
  };

  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };

  const toggleOpen = (id: string) => {
    if (page) {
      setOpenPageId(openPageId === id ? null : id);
    } else {
      setOpenMap(m => ({ ...m, [id]: !m[id] }));
    }
  };

  const openAll = () => {
    const m: Record<string, boolean> = {};
    items.forEach(it => { m[it.id] = true; });
    setOpenMap(m);
  };

  const closeAll = () => setOpenMap({});

  return (
    <div className="stack gap-8">
      {!page && items.length > 2 && (
        <div className="row between gap-8" style={{ padding: '0 4px' }}>
          <span className="xs muted">{items.length} item</span>
          <div className="row gap-8">
            <button type="button" className="pill sm ghost" onClick={openAll}>Buka semua</button>
            <button type="button" className="pill sm ghost" onClick={closeAll}>Ciutkan semua</button>
          </div>
        </div>
      )}
      {items.map((it, i) => {
        const isOpen = !page && !!openMap[it.id];
        return (
          <div key={it.id} className={`cms-item${isOpen ? ' open' : ''}${page ? ' paged' : ''}`}>
            <div className="row gap-8">
              <button type="button" className="grow row gap-8 cms-item-head" onClick={() => toggleOpen(it.id)} aria-expanded={page ? undefined : isOpen}>
                <span className="xs faint" style={{ width: 22 }}>{i + 1}</span>
                <span className="grow small" style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title(it, i) || <em className="faint">(tanpa judul)</em>}</span>
                {page ? <span className="pill sm dark cms-edit-btn"><Icon name="gear" size={13} />Edit</span> : <Icon name={isOpen ? 'up' : 'down'} size={15} />}
              </button>
              <button type="button" className="icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Naik" title="Pindah ke atas"><Icon name="up" size={14} /></button>
              <button type="button" className="icon-btn sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Turun" title="Pindah ke bawah"><Icon name="down" size={14} /></button>
              <button type="button" className="icon-btn sm" aria-label="Sisipkan setelah ini" title="Sisipkan blok baru setelah ini" onClick={() => insertAfter(i, create())}><Icon name="plus" size={14} /></button>
              <button type="button" className="icon-btn sm" aria-label="Duplikat" title="Duplikat item" onClick={() => { const c = { ...JSON.parse(JSON.stringify(it)), id: uid() }; const n = [...items]; n.splice(i + 1, 0, c); onChange(n); }}><Icon name="copy" size={14} /></button>
              <button type="button" className="icon-btn sm" aria-label="Hapus" title="Hapus item" onClick={() => { if (window.confirm('Hapus item ini?')) onChange(items.filter(x => x.id !== it.id)); }}><Icon name="trash" size={14} /></button>
            </div>
            {isOpen && <div className="cms-item-body">{render(it, patch => onChange(items.map(x => (x.id === it.id ? { ...x, ...patch } : x))))}</div>}
          </div>
        );
      })}
      {page && openPageId && (() => {
        const i = items.findIndex(x => x.id === openPageId);
        if (i < 0) return null;
        const it = items[i];
        return (
          <EditPage title={title(it, i) || `${page} baru`} sub={page} onClose={() => setOpenPageId(null)}
            nav={{ pos: `${i + 1}/${items.length}`, prev: i > 0 ? () => setOpenPageId(items[i - 1].id) : undefined, next: i < items.length - 1 ? () => setOpenPageId(items[i + 1].id) : undefined }}>
            <div className="cms-item-body cms-page-form">{render(it, patch => onChange(items.map(x => (x.id === it.id ? { ...x, ...patch } : x))))}</div>
          </EditPage>
        );
      })()}
      <div className="row wrap gap-8">
        <button type="button" className="pill" onClick={() => add(create())}><Icon name="plus" size={15} />{addLabel}</button>
        {extraAdd.map(x => <button key={x.label} type="button" className="pill sm" onClick={() => add(x.create())}><Icon name={x.icon} size={13} />{x.label}</button>)}
      </div>
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
