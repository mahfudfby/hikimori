// src/admin/PortfolioAdmin.tsx — CRUD koleksi `portfolio` + penyusun artikel blok tingkat lanjut
// Fitur: Real-time Live Preview (Desktop & Mobile 390px), Split Screen, Autosave Draf Lokal,
// Multi-upload Galeri, Pencarian Cepat, Filter Kategori, Quick Star, dan Duplikat Proyek.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { usePortfolio, PortfolioItem, ArticleBlock, BlockType } from '../hooks/usePortfolio';
import { Icon } from '../components/ui';
import { parseEmbed, isTikTokShort, resolveTikTok, mediaKind } from '../utils/embed';
import { MediaFrameEditor } from './MediaFrameEditor';
import { RichEditor } from './RichEditor';
import { Text, Area, Tags, ImageInput, Toggle, Grid, Section, Select, ListEditor, EditPage, closeEditPage, uid } from './fields';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { ArticleBlocks, Media } from '../components/Article';
import { hyphenate } from '../utils/richHtml';
import { slugify } from '../utils/slug';
import { asErr } from '../utils/errors';

type Draft = Omit<PortfolioItem, 'id'> & { id?: string };
const EMPTY: Draft = {
  title: '',
  slug: '',
  subtitle: '',
  videoUrl: '',
  blocks: [],
  category: '',
  description: '',
  imageUrl: '',
  tags: [],
  hashtags: [],
  seoTitle: '',
  seoDesc: '',
  keywords: [],
  client: '',
  year: String(new Date().getFullYear()),
  link: '',
  featured: false,
  order: 0,
};

const DRAFT_PREFIX = 'hk_folio_draft_';

const BLOCKS: { type: BlockType; label: string; icon: string }[] = [
  { type: 'text', label: 'Paragraf', icon: 'layers' },
  { type: 'heading', label: 'Subjudul', icon: 'menu' },
  { type: 'media', label: 'Teks + Media / Reels', icon: 'image' },
  { type: 'gallery', label: 'Slideshow / Galeri', icon: 'grid' },
  { type: 'embed', label: 'Embed video / program', icon: 'play' },
  { type: 'quote', label: 'Kutipan', icon: 'chat' },
  { type: 'code', label: 'Kode', icon: 'tool' },
  { type: 'divider', label: 'Ornamen pemisah', icon: 'spark' },
];

const newBlock = (type: BlockType): ArticleBlock => ({
  id: uid('b'),
  type,
  text: '',
  style: type === 'gallery' ? 'slideshow' : 'plain',
  url: '',
  urls: [],
  caption: '',
  side: 'right',
  height: 520,
  width: type === 'media' ? 45 : 100,
  ratio: 'auto',
  zoom: 100,
  shiftY: 0,
});

const blockLabel = (t: BlockType) => BLOCKS.find(b => b.type === t)?.label || t;

const FRAME_OPTS = [
  { value: 'plain', label: 'Dengan caption (kartu lengkap platform + keterangan)' },
  { value: 'frameless', label: 'Frameless (video saja, tanpa caption)' },
];

/** Panduan embed per sosmed. */
const GUIDES: { name: string; steps: string[]; note?: string }[] = [
  {
    name: 'Instagram (post / reel)',
    steps: [
      'Buka postingan di instagram.com lewat browser komputer.',
      'Klik ikon ••• di kanan atas postingan → Embed.',
      'Centang / hapus "Include caption" sesuai selera → Copy embed code.',
      'Tempel kodenya di kolom di atas. Bisa juga: ••• → Copy link, lalu tempel link-nya.',
    ],
    note: 'Akun harus publik dan izin embed aktif.',
  },
  {
    name: 'TikTok',
    steps: [
      'Di aplikasi HP: Bagikan (panah) → Salin tautan, lalu tempel. Link pendek vt.tiktok.com otomatis diubah ke link lengkap.',
      'Di komputer: Bagikan → Sematkan (Embed) → Copy code, atau salin link dari kolom alamat (tiktok.com/@akun/video/…).',
    ],
    note: 'Video harus publik dan izin sematkan aktif.',
  },
  {
    name: 'YouTube (video / Shorts / playlist)',
    steps: [
      'Buka video → Bagikan (Share) → Salin link, atau Sematkan (Embed) → salin kode <iframe>.',
      'Mulai dari detik tertentu: centang "Mulai pada" saat Bagikan (link berisi ?t=90). Waktu mulai ikut terbawa.',
      'Shorts (youtube.com/shorts/…) otomatis tampil vertikal 9:16. Link playlist (…list=…) tampil sebagai playlist.',
    ],
    note: 'Video harus Publik atau Tidak publik (unlisted), dan "Izinkan penyematan" aktif.',
  },
  {
    name: 'Program web hasil developer',
    steps: [
      'Tempel link https dari demo program (Vercel, Netlify, GitHub Pages, CodeSandbox, StackBlitz, dll.).',
      'Atur "Tinggi program web" agar program tampil penuh.',
    ],
    note: 'Situs tujuan harus mengizinkan ditampilkan di iframe.',
  },
];

const EmbedGuide: React.FC<{ open?: boolean }> = ({ open }) => (
  <details className="cms-guide" open={open}>
    <summary><Icon name="eye" size={14} />Panduan embed tiap sosmed</summary>
    <div className="cms-guide-grid">
      {GUIDES.map(g => (
        <div key={g.name} className="cms-guide-item">
          <strong className="small">{g.name}</strong>
          <ol>{g.steps.map(st => <li key={st}>{st}</li>)}</ol>
          {g.note && <small className="xs muted">{g.note}</small>}
        </div>
      ))}
    </div>
    <small className="xs muted"><strong>Dengan caption</strong>: kartu lengkap platform. <strong>Frameless</strong>: video saja, tanpa caption.</small>
  </details>
);

const KIND_NAME: Record<string, string> = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', web: 'program web' };

const EmbedStatus: React.FC<{ url: string; onChange: (v: string) => void }> = ({ url, onChange }) => {
  const [failed, setFailed] = useState('');
  const latest = useRef(onChange);
  latest.current = onChange;
  const short = isTikTokShort(url);
  useEffect(() => {
    if (!short) return;
    let alive = true;
    const t = window.setTimeout(() => resolveTikTok(url).then(full => {
      if (!alive) return;
      if (full) { latest.current(full); toast.success('Link pendek TikTok diubah ke link lengkap'); } else setFailed(url);
    }), 600);
    return () => { alive = false; window.clearTimeout(t); };
  }, [url, short]);
  if (!url.trim() || mediaKind(url) !== 'embed') return null;
  if (short) return <small className="xs faint">{failed === url ? <strong style={{ color: '#d14343' }}>Link pendek TikTok tidak bisa dibaca. Buka videonya di browser, lalu salin link lengkap.</strong> : 'Membaca link pendek TikTok…'}</small>;
  const e = parseEmbed(url);
  return <small className="xs faint">{e ? <>Terbaca: <strong>{KIND_NAME[e.kind]}</strong>{/[?&]start=/.test(e.src) && ' · mulai detik ' + e.src.match(/start=(\d+)/)![1]}{/[?&]list=/.test(e.src) && ' · playlist'}</> : <strong style={{ color: '#d14343' }}>Link belum terbaca. Cek panduan di bawah.</strong>}</small>;
};

/** Daftar foto galeri / slideshow: multi-upload, drag & drop, urutkan naik/turun. */
const Photos: React.FC<{ value: string[]; onChange: (v: string[]) => void }> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || !files.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!/^image\//.test(f.type)) continue;
      try {
        toast.loading(`Mengunggah foto ${i + 1}/${files.length}…`, { id: 'multi-up' });
        const url = await uploadToCloudinary(f);
        newUrls.push(url);
      } catch {
        toast.error(`Gagal upload foto ke-${i + 1}`);
      }
    }
    toast.dismiss('multi-up');
    setUploading(false);
    if (newUrls.length) {
      onChange([...value.filter(Boolean), ...newUrls]);
      toast.success(`${newUrls.length} foto berhasil ditambahkan`);
    }
  };

  const movePhoto = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div
      className={`field cms-photos-field${dragOver ? ' drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
      }}
    >
      <div className="row between wrap gap-8">
        <span>Foto Galeri ({value.length})</span>
        <div className="row gap-8">
          <label className="pill sm dark" style={{ cursor: 'pointer' }}>
            <Icon name="upload" size={13} />{uploading ? 'Mengunggah…' : 'Upload Banyak Foto'}
            <input type="file" multiple accept="image/*" hidden disabled={uploading} onChange={e => e.target.files && uploadFiles(e.target.files)} />
          </label>
        </div>
      </div>
      <small className="xs faint">Pilih banyak foto sekaligus atau seret beberapa file gambar ke kotak ini.</small>

      <div className="cms-points mt-8">
        {value.map((u, i) => (
          <div key={i} className="cms-point cms-photo">
            <span className="cms-point-n xs faint">{i + 1}</span>
            <ImageInput label="" value={u} onChange={v => onChange(value.map((x, j) => (j === i ? v : x)))} />
            <div className="row gap-4">
              <button type="button" className="icon-btn sm" disabled={i === 0} aria-label={`Pindah foto ${i + 1} ke atas`} title="Pindah ke atas" onClick={() => movePhoto(i, -1)}><Icon name="up" size={14} /></button>
              <button type="button" className="icon-btn sm" disabled={i === value.length - 1} aria-label={`Pindah foto ${i + 1} ke bawah`} title="Pindah ke bawah" onClick={() => movePhoto(i, 1)}><Icon name="down" size={14} /></button>
              <button type="button" className="icon-btn sm" aria-label={`Hapus foto ${i + 1}`} title="Hapus foto" onClick={() => onChange(value.filter((_, j) => j !== i))}><Icon name="close" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="row gap-8 mt-8">
        <button type="button" className="pill sm" onClick={() => onChange([...value, ''])}><Icon name="plus" size={14} />Tambah slot URL</button>
        {value.length > 0 && <button type="button" className="pill sm ghost" onClick={() => { if (window.confirm('Hapus semua foto di galeri ini?')) onChange([]); }}><Icon name="trash" size={13} />Hapus semua</button>}
      </div>
    </div>
  );
};

const BlockFields: React.FC<{ b: ArticleBlock; up: (p: Partial<ArticleBlock>) => void }> = ({ b, up }) => {
  switch (b.type) {
    case 'heading': return <Text label="Subjudul" value={b.text} onChange={v => up({ text: v })} />;
    case 'divider': return <p className="xs muted">Ornamen ✦ pemisah antar bagian artikel. Tidak perlu diisi.</p>;
    case 'quote': return (<>
      <Area label="Kutipan" value={b.text} onChange={v => up({ text: v })} rows={3} />
      <Text label="Sumber / nama (opsional)" value={b.caption} onChange={v => up({ caption: v })} />
    </>);
    case 'code': return (<>
      <Area label="Kode / potongan program" value={b.text} onChange={v => up({ text: v })} rows={8} />
      <Text label="Keterangan (opsional)" value={b.caption} onChange={v => up({ caption: v })} />
    </>);
    case 'embed': return (<>
      <Select label="Tampilan embed" value={b.style === 'frameless' ? 'frameless' : 'plain'} onChange={v => up({ style: v })} options={FRAME_OPTS} />
      <EmbedGuide open />
      <Area label="Link atau kode embed" value={b.url} onChange={v => up({ url: v })} rows={3} />
      <small className="xs faint">Tempel link atau kode embed dari YouTube, TikTok, Instagram, atau demo program web.</small>
      <EmbedStatus url={b.url} onChange={v => up({ url: v })} />
      <Grid>
        <Text label="Keterangan (opsional)" value={b.caption} onChange={v => up({ caption: v })} />
        <Text label="Tinggi program web (px)" type="number" value={b.height} onChange={v => up({ height: Math.max(240, Math.min(1400, Number(v) || 520)) })} hint="Khusus demo program web." />
      </Grid>
      <MediaFrameEditor b={b} up={up} />
    </>);
    case 'gallery': return (<>
      <Select label="Tampilan" value={b.style} onChange={v => up({ style: v })} options={[{ value: 'slideshow', label: 'Slideshow animasi (geser otomatis)' }, { value: 'grid', label: 'Galeri grid' }]} />
      <Photos value={b.urls} onChange={v => up({ urls: v })} />
      <MediaFrameEditor b={b} up={up} />
      <Text label="Keterangan (opsional)" value={b.caption} onChange={v => up({ caption: v })} />
    </>);
    case 'media': return (<>
      <RichEditor label="Teks" value={b.text} onChange={v => up({ text: v })} minHeight={140} />
      <ImageInput label="Media: upload foto atau tempel link video" value={b.url} onChange={v => up({ url: v })} />
      <EmbedStatus url={b.url} onChange={v => up({ url: v })} />
      <EmbedGuide />
      <Grid>
        <Select label="Tampilan video embed" value={b.style === 'frameless' ? 'frameless' : 'plain'} onChange={v => up({ style: v })} options={FRAME_OPTS} />
        <Select label="Posisi media" value={b.side} onChange={v => up({ side: v as ArticleBlock['side'] })} options={[{ value: 'right', label: 'Media di kanan' }, { value: 'left', label: 'Media di kiri' }]} />
        <Text label="Keterangan media (opsional)" value={b.caption} onChange={v => up({ caption: v })} />
      </Grid>
      <MediaFrameEditor b={b} up={up} />
    </>);
    default: return (<>
      <Select label="Gaya paragraf" value={b.style} onChange={v => up({ style: v })} options={[
        { value: 'plain', label: 'Biasa' },
        { value: 'dropcap', label: 'Pembuka majalah (huruf awal besar)' },
        { value: 'lead', label: 'Lead (teks pengantar besar)' },
        { value: 'card', label: 'Magazine card (kotak)' },
        { value: 'columns', label: 'Kolom koran (2 kolom)' },
        { value: 'note', label: 'Catatan sorot (garis emas)' },
      ]} />
      <RichEditor label="Isi paragraf" value={b.text} onChange={v => up({ text: v })} />
    </>);
  }
};

/** Komponen Pratinjau Langsung (WYSIWYG Live Preview) */
const LivePreview: React.FC<{ post: Draft; device: 'desktop' | 'mobile' }> = ({ post, device }) => {
  const words = useMemo(() => {
    const text = [
      post.title,
      post.subtitle,
      post.description,
      ...post.blocks.map(b => b.text + ' ' + (b.caption || '')),
    ].join(' ').replace(/<[^>]*>/g, ' ');
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [post]);
  const readTime = Math.max(1, Math.ceil(words / 180));
  const hero = post.videoUrl || post.imageUrl;

  return (
    <div className={`cms-preview-frame ${device === 'mobile' ? 'mobile-390' : 'desktop-wide'}`}>
      <div className="cms-preview-inner frame mag">
        <article className="mag-article" lang="id">
          <nav className="crumb" aria-label="breadcrumb">
            <span>Home</span><span>/</span><span>Portofolio</span><span>/</span><span className="current">{post.title || 'Judul artikel'}</span>
          </nav>
          <header className="mag-head">
            <div className="mag-subhead row wrap gap-8" style={{ alignItems: 'center' }}>
              <span className="chip yellow">{post.category || 'Kategori'}</span>
              {post.year && <span className="xs muted">{post.year}</span>}
              {post.client && <span className="xs muted">· {post.client}</span>}
              <span className="xs muted">· ± {readTime} mnt baca ({words} kata)</span>
            </div>
            <h1 className="mag-title mt-8">{post.title ? hyphenate(post.title) : <em className="muted">(Belum ada judul)</em>}</h1>
            {post.subtitle && <p className="mag-lead">{hyphenate(post.subtitle)}</p>}
            {hero && (
              <div className="mag-hero mt-16">
                <Media url={hero} alt={post.title} eager frameless={true} />
              </div>
            )}
          </header>
          <div className="mag-body mt-24">
            {post.blocks.length > 0 ? (
              <ArticleBlocks blocks={post.blocks} title={post.title || 'Portofolio'} />
            ) : post.description ? (
              <p className="mag-lead">{post.description}</p>
            ) : (
              <div className="empty" style={{ padding: '30px 10px' }}>Belum ada blok isi artikel. Tambahkan blok di panel Editor.</div>
            )}
          </div>
          {(post.hashtags.length > 0 || post.keywords.length > 0) && (
            <footer className="mag-meta">
              {post.hashtags.length > 0 && (
                <div className="mag-hashtags">
                  {post.hashtags.map(h => <span key={h}>#{h}</span>)}
                </div>
              )}
              {post.keywords.length > 0 && (
                <div className="mag-keywords">Kata kunci: {post.keywords.join(', ')}</div>
              )}
            </footer>
          )}
        </article>
      </div>
    </div>
  );
};

const PortfolioAdmin: React.FC = () => {
  const { items, loading, error, addItem, updateItem, deleteItem } = usePortfolio({ live: true });
  const [edit, setEdit] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  // Preview & View Mode state
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Autosave & Recovery state
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [recoveredDraft, setRecoveredDraft] = useState<Draft | null>(null);

  // Autosave draf lokal saat ada perubahan di editor
  useEffect(() => {
    if (!edit) return;
    const key = `${DRAFT_PREFIX}${edit.id || 'new'}`;
    const t = setTimeout(() => {
      try {
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem(key, JSON.stringify({ data: edit, savedAt: timeStr }));
        setDraftSavedAt(timeStr);
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [edit]);

  // Buka editor dan periksa draf belum tersimpan
  const openEditor = (item: Draft) => {
    const key = `${DRAFT_PREFIX}${item.id || 'new'}`;
    let pending: Draft | null = null;
    let savedTime: string | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data && JSON.stringify(parsed.data) !== JSON.stringify(item)) {
          pending = parsed.data;
          savedTime = parsed.savedAt || 'sebelumnya';
        }
      }
    } catch {}
    setEdit(item);
    setRecoveredDraft(pending);
    setDraftSavedAt(savedTime);
    setViewMode('edit');
  };

  const save = async () => {
    if (!edit) return;
    if (!edit.title.trim()) { toast.error('Judul wajib diisi'); return; }
    setBusy(true);
    try {
      const { id, ...data } = edit;
      const cleanSlug = slugify(data.slug || data.title);
      const payload = { ...data, slug: cleanSlug };
      if (id) await updateItem(id, payload); else await addItem({ ...payload, order: items.length });
      // Bersihkan draf lokal setelah tersimpan
      try { localStorage.removeItem(`${DRAFT_PREFIX}${id || 'new'}`); } catch {}
      setDraftSavedAt(null);
      setRecoveredDraft(null);
      toast.success('Proyek tersimpan & live');
      closeEditPage(() => setEdit(null));
    } catch (raw) { const e = asErr(raw);
      toast.error('Gagal: ' + (e?.code || e?.message));
    } finally {
      setBusy(false);
    }
  };

  const move = async (i: number, d: number) => {
    const a = items[i], b = items[i + d]; if (!a || !b) return;
    try { await Promise.all([updateItem(a.id, { order: b.order ?? i + d }), updateItem(b.id, { order: a.order ?? i })]); }
    catch { toast.error('Gagal mengurutkan'); }
  };

  const toggleFeatured = async (it: PortfolioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateItem(it.id, { featured: !it.featured });
      toast.success(it.featured ? 'Dilepas dari unggulan' : 'Ditandai sebagai unggulan ⭐');
    } catch {
      toast.error('Gagal memperbarui status unggulan');
    }
  };

  const cloneProject = async (it: PortfolioItem) => {
    if (!window.confirm(`Duplikat proyek "${it.title}"?`)) return;
    setBusy(true);
    try {
      const { id, ...data } = it;
      await addItem({
        ...data,
        title: `${data.title} (Salinan)`,
        order: items.length,
        featured: false,
      });
      toast.success('Proyek berhasil diduplikat');
    } catch {
      toast.error('Gagal menduplikat proyek');
    } finally {
      setBusy(false);
    }
  };

  // Kategori unik & item terfilter
  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category).filter(Boolean))), [items]);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      if (catFilter !== 'all' && it.category !== catFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = it.title.toLowerCase().includes(q);
        const matchCat = (it.category || '').toLowerCase().includes(q);
        const matchClient = (it.client || '').toLowerCase().includes(q);
        const matchYear = (it.year || '').includes(q);
        const matchTags = (it.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchCat && !matchClient && !matchYear && !matchTags) return false;
      }
      return true;
    });
  }, [items, search, catFilter]);

  // Statistik kata & checklist
  const stats = useMemo(() => {
    if (!edit) return { words: 0, readTime: 1 };
    const text = [
      edit.title,
      edit.subtitle,
      edit.description,
      ...edit.blocks.map(b => b.text + ' ' + (b.caption || '')),
    ].join(' ').replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { words, readTime: Math.max(1, Math.ceil(words / 180)) };
  }, [edit]);

  const editorActions = (
    <div className="row wrap gap-8" style={{ alignItems: 'center' }}>
      <div className="seg sm">
        <button type="button" className={viewMode === 'edit' ? 'on' : ''} onClick={() => setViewMode('edit')} title="Editor form">
          <Icon name="gear" size={13} /> Edit
        </button>
        <button type="button" className={viewMode === 'preview' ? 'on' : ''} onClick={() => setViewMode('preview')} title="Pratinjau tampilan penuh">
          <Icon name="eye" size={13} /> Pratinjau
        </button>
        <button type="button" className={`desktop-only ${viewMode === 'split' ? 'on' : ''}`} onClick={() => setViewMode('split')} title="Berdampingan (Editor + Pratinjau)">
          <Icon name="layers" size={13} /> Split
        </button>
      </div>

      {(viewMode === 'preview' || viewMode === 'split') && (
        <div className="seg sm">
          <button type="button" className={previewDevice === 'desktop' ? 'on' : ''} onClick={() => setPreviewDevice('desktop')} title="Layar Desktop">
            <Icon name="grid" size={13} /> Desktop
          </button>
          <button type="button" className={previewDevice === 'mobile' ? 'on' : ''} onClick={() => setPreviewDevice('mobile')} title="Layar HP (390px)">
            <Icon name="phone" size={13} /> 390px
          </button>
        </div>
      )}

      <button className="pill dark sm" onClick={save} disabled={busy}>
        <Icon name="save" size={14} />{busy ? 'Menyimpan…' : 'Simpan'}
      </button>
    </div>
  );

  const editor = edit && (
    <EditPage
      title={edit.title || (edit.id ? 'Edit proyek' : 'Proyek baru')}
      sub="Portofolio CMS"
      onClose={() => setEdit(null)}
      actions={editorActions}
    >
      {recoveredDraft && (
        <div className="cms-draft-alert row between wrap gap-12 mb-16">
          <div className="row gap-8" style={{ alignItems: 'center' }}>
            <Icon name="spark" size={16} />
            <span className="small">Ditemukan draf lokal belum tersimpan ({draftSavedAt}). Ingin pulihkan?</span>
          </div>
          <div className="row gap-8">
            <button type="button" className="pill sm dark" onClick={() => { setEdit(recoveredDraft); setRecoveredDraft(null); toast.success('Draf dipulihkan'); }}>Pulihkan</button>
            <button type="button" className="pill sm ghost" onClick={() => {
              if (edit) localStorage.removeItem(`${DRAFT_PREFIX}${edit.id || 'new'}`);
              setRecoveredDraft(null);
            }}>Abaikan</button>
          </div>
        </div>
      )}

      {/* Baris ringkasan metrik artikel & draf */}
      <div className="cms-stats-bar row between wrap gap-8 mb-16">
        <div className="row wrap gap-8" style={{ alignItems: 'center' }}>
          <span className="chip xs">{edit.blocks.length} blok</span>
          <span className="chip xs">± {stats.readTime} mnt baca ({stats.words} kata)</span>
          {edit.imageUrl ? <span className="chip xs yellow">✓ Cover ada</span> : <span className="chip xs faint">Cover kosong</span>}
          {edit.description ? <span className="chip xs yellow">✓ Ringkasan ada</span> : <span className="chip xs faint">Ringkasan kosong</span>}
        </div>
        {draftSavedAt && (
          <span className="xs muted row gap-4" style={{ alignItems: 'center' }}>
            <span className="dot-green" /> Draf tersimpan otomatis ({draftSavedAt})
          </span>
        )}
      </div>

      <div className={`cms-editor-container mode-${viewMode}`}>
        {/* Kolom Formulir Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="cms-editor-pane">
            <Section title={edit.id ? 'Edit proyek' : 'Proyek baru'} actions={<button className="pill sm" onClick={() => closeEditPage(() => setEdit(null))}>Batal</button>}>
              <Grid>
                <Text label="Judul / headline" value={edit.title} onChange={v => setEdit({ ...edit, title: v })} />
                <Text label="Kategori (mis. HR, IT Support, Desain)" value={edit.category} onChange={v => setEdit({ ...edit, category: v })} />
                <Text label="Klien / perusahaan" value={edit.client} onChange={v => setEdit({ ...edit, client: v })} />
                <Text label="Tahun" value={edit.year} onChange={v => setEdit({ ...edit, year: v })} />
              </Grid>
              <div className="field">
                <div className="row between" style={{ alignItems: 'center' }}>
                  <span>Slug URL Mandiri (SEO Clean Link)</span>
                  <button
                    type="button"
                    className="pill sm ghost"
                    onClick={() => setEdit({ ...edit, slug: slugify(edit.title) })}
                    title="Buat slug otomatis dari judul"
                  >
                    Auto dari Judul
                  </button>
                </div>
                <input
                  className="input"
                  value={edit.slug || ''}
                  placeholder="mis. sistem-informasi-hr (kosong = otomatis dari judul)"
                  onChange={e => setEdit({ ...edit, slug: slugify(e.target.value) })}
                />
                <small className="xs faint">
                  Tautan mandiri artikel: <strong>/portofolio/{edit.slug || slugify(edit.title) || '(slug)'}</strong>
                </small>
              </div>
              <Text label="Sub-judul artikel" value={edit.subtitle} onChange={v => setEdit({ ...edit, subtitle: v })} hint="Tampil di bawah headline." />
              <Area label="Ringkasan (kartu daftar portofolio)" value={edit.description} onChange={v => setEdit({ ...edit, description: v })} rows={3} />
              <Tags label="Tag" value={edit.tags} onChange={v => setEdit({ ...edit, tags: v })} />
              <Text label="Link proyek eksternal (opsional)" value={edit.link || ''} onChange={v => setEdit({ ...edit, link: v })} />
              <ImageInput label="Gambar cover / hero banner" value={edit.imageUrl} onChange={v => setEdit({ ...edit, imageUrl: v })} />
              <Area label="Video hero banner (opsional): link atau kode embed" value={edit.videoUrl} onChange={v => setEdit({ ...edit, videoUrl: v })} rows={2} />
              <EmbedStatus url={edit.videoUrl} onChange={v => setEdit(e => (e && { ...e, videoUrl: v }))} />
              <small className="xs faint">YouTube / TikTok / Instagram. Bila diisi, video ini menjadi hero banner artikel.</small>
              <EmbedGuide />

              <div className="field">
                <div className="row between">
                  <span>Isi artikel ({edit.blocks.length} blok)</span>
                  <span className="xs muted">Urutkan, duplikat, atau sisipkan blok</span>
                </div>
                <ListEditor<ArticleBlock>
                  items={edit.blocks}
                  onChange={v => setEdit({ ...edit, blocks: v })}
                  addLabel="Tambah paragraf"
                  create={() => newBlock('text')}
                  title={b => {
                    const thumb = b.type === 'gallery' ? (b.urls.find(Boolean) || '') : (b.url || '');
                    const embedKind = b.type === 'embed' ? (parseEmbed(b.url)?.kind || 'embed') : null;
                    return (
                      <span className="row gap-8" style={{ alignItems: 'center' }}>
                        {thumb ? (
                          <img src={thumb} alt="" style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                        ) : embedKind ? (
                          <span className="chip xs" style={{ textTransform: 'capitalize', padding: '1px 6px' }}>{embedKind}</span>
                        ) : null}
                        <strong>{blockLabel(b.type)}</strong>
                        <span className="faint">· {(b.text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim() || b.caption || b.url || (b.urls.length ? `${b.urls.filter(Boolean).length} foto` : '')).slice(0, 60)}</span>
                      </span>
                    );
                  }}
                  render={(b, up) => <BlockFields b={b} up={up} />}
                  extraAdd={BLOCKS.filter(x => x.type !== 'text').map(x => ({ label: x.label, icon: x.icon, create: () => newBlock(x.type) }))}
                />
              </div>

              <div className="field cms-seo">
                <span>Hashtag, SEO & Keyword (tampil di akhir artikel)</span>
                <Tags label="Hashtag" value={edit.hashtags} onChange={v => setEdit({ ...edit, hashtags: v.map(h => h.replace(/^#+/, '').replace(/\s+/g, '')).filter(Boolean) })} />
                <Tags label="Keyword / kata kunci" value={edit.keywords} onChange={v => setEdit({ ...edit, keywords: v })} />
                <Text label={`Judul SEO (${(edit.seoTitle || edit.title).length}/60)`} value={edit.seoTitle} onChange={v => setEdit({ ...edit, seoTitle: v })} hint="Judul di hasil Google & share card. Kosong = judul artikel." />
                <Area label={`Deskripsi SEO (${(edit.seoDesc || edit.description).length}/160)`} value={edit.seoDesc} onChange={v => setEdit({ ...edit, seoDesc: v })} rows={2} hint="Ringkasan di hasil Google. Kosong = ringkasan kartu." />
                <div className="seo-preview" aria-label="Pratinjau hasil Google">
                  <small className="xs faint">hikimori.web.id › portofolio › {edit.slug || slugify(edit.title) || 'artikel'}</small>
                  <strong>{(edit.seoTitle || edit.title || 'Judul artikel').slice(0, 70)}</strong>
                  <p className="xs">{(edit.seoDesc || edit.description || 'Deskripsi artikel…').slice(0, 170)}</p>
                </div>
              </div>

              <Toggle label="Unggulan ⭐ (tampil paling depan & kartu gelap)" value={edit.featured} onChange={v => setEdit({ ...edit, featured: v })} />

              <div className="row gap-8">
                <button className="pill dark" onClick={save} disabled={busy}>
                  <Icon name="save" size={15} />{busy ? 'Menyimpan…' : 'Simpan proyek'}
                </button>
              </div>
            </Section>
          </div>
        )}

        {/* Kolom Pratinjau Langsung (Preview Pane) */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="cms-preview-pane">
            <LivePreview post={edit} device={previewDevice} />
          </div>
        )}
      </div>
    </EditPage>
  );

  const featuredCount = items.filter(i => i.featured).length;
  const totalBlocks = items.reduce((acc, i) => acc + (i.blocks?.length || 0), 0);

  return (<>
    {editor}
    <Section
      title="Portofolio"
      desc={`Kelola karya & proyek portofolio. Disimpan langsung ke Firestore.`}
      actions={
        <button className="pill dark sm" onClick={() => openEditor({ ...EMPTY })}>
          <Icon name="plus" size={14} />Proyek baru
        </button>
      }
    >
      {/* Bar Statistik Ringkas */}
      <div className="row wrap between gap-12 pb-8" style={{ borderBottom: '1px solid var(--line-2)' }}>
        <div className="row wrap gap-8">
          <span className="chip xs">Total: {items.length} proyek</span>
          <span className="chip xs yellow">⭐ {featuredCount} unggulan</span>
          <span className="chip xs">{totalBlocks} blok artikel</span>
        </div>
      </div>

      {/* Bar Pencarian & Filter Kategori */}
      <div className="row wrap gap-8 mt-4">
        <div className="grow" style={{ minWidth: 200 }}>
          <input
            className="input"
            type="search"
            placeholder="Cari proyek (judul, kategori, klien, tag)…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {categories.length > 0 && (
          <div className="seg sm">
            <button type="button" className={catFilter === 'all' ? 'on' : ''} onClick={() => setCatFilter('all')}>Semua</button>
            {categories.map(c => (
              <button key={c} type="button" className={catFilter === c ? 'on' : ''} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <div className="empty">{error}</div>
      ) : items.length === 0 ? (
        <div className="empty">Belum ada proyek. Klik "Proyek baru" untuk mulai menambahkan.</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty">Tidak ada proyek yang sesuai dengan pencarian "{search}".</div>
      ) : (
        <div className="stack gap-8">
          {filteredItems.map((it, i) => (
            <div key={it.id} className="cms-item row gap-12" style={{ padding: 10, alignItems: 'center' }}>
              {it.imageUrl ? (
                <img src={it.imageUrl} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
              ) : (
                <span className="logo-box" style={{ width: 64, height: 48, flexShrink: 0 }}><Icon name="image" /></span>
              )}

              <div className="grow" style={{ minWidth: 0 }}>
                <div className="small row gap-6" style={{ alignItems: 'center' }}>
                  <button
                    type="button"
                    className="icon-btn xs"
                    style={{ padding: 0, width: 22, height: 22, border: 0, background: 'none' }}
                    title={it.featured ? 'Lepas dari unggulan' : 'Tandai sebagai unggulan'}
                    onClick={e => toggleFeatured(it, e)}
                  >
                    {it.featured ? '⭐' : '☆'}
                  </button>
                  <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</strong>
                </div>
                <div className="xs muted">
                  <span className="chip xs mr-6">{it.category || '—'}</span>
                  {it.year} {it.client && `· ${it.client}`} · {it.blocks.length} blok
                  {it.slug && <span className="faint"> · /{it.slug}</span>}
                </div>
              </div>

              <a className="icon-btn sm" href={`/portofolio/${it.slug || it.id}`} target="_blank" rel="noreferrer" aria-label="Lihat artikel" title="Lihat artikel langsung">
                <Icon name="eye" size={14} />
              </a>

              <button className="icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Naik" title="Pindah ke atas">
                <Icon name="up" size={14} />
              </button>
              <button className="icon-btn sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Turun" title="Pindah ke bawah">
                <Icon name="down" size={14} />
              </button>

              <button className="icon-btn sm" aria-label="Duplikat proyek" title="Duplikat proyek ini" onClick={() => cloneProject(it)}>
                <Icon name="copy" size={14} />
              </button>

              <button className="pill sm" onClick={() => openEditor({ ...EMPTY, ...it })}>
                Edit
              </button>

              <button
                className="icon-btn sm"
                aria-label="Hapus"
                title="Hapus proyek"
                onClick={async () => {
                  if (window.confirm(`Hapus “${it.title}”?`)) {
                    try {
                      await deleteItem(it.id);
                      toast.success('Dihapus');
                    } catch {
                      toast.error('Gagal menghapus');
                    }
                  }
                }}
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Section>
  </>);
};

export default PortfolioAdmin;
