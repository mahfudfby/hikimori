// src/admin/PortfolioAdmin.tsx — CRUD koleksi `portfolio` (setiap simpan langsung live) + penyusun artikel blok.
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { usePortfolio, PortfolioItem, ArticleBlock, BlockType } from '../hooks/usePortfolio';
import { Icon } from '../components/ui';
import { parseEmbed, isTikTokShort, resolveTikTok, mediaKind } from '../utils/embed';
import { MediaFrameEditor } from './MediaFrameEditor';
import { RichEditor } from './RichEditor';
import { Text, Area, Tags, ImageInput, Toggle, Grid, Section, Select, ListEditor, uid } from './fields';

type Draft = Omit<PortfolioItem, 'id'> & { id?: string };
const EMPTY: Draft = { title: '', subtitle: '', videoUrl: '', blocks: [], category: '', description: '', imageUrl: '', tags: [], hashtags: [], seoTitle: '', seoDesc: '', keywords: [], client: '', year: String(new Date().getFullYear()), link: '', featured: false, order: 0 };

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
const newBlock = (type: BlockType): ArticleBlock => ({ id: uid('b'), type, text: '', style: type === 'gallery' ? 'slideshow' : 'plain', url: '', urls: [], caption: '', side: 'right', height: 520, width: type === 'media' ? 45 : 100, ratio: 'auto', zoom: 100, shiftY: 0 });
const blockLabel = (t: BlockType) => BLOCKS.find(b => b.type === t)?.label || t;
const FRAME_OPTS = [
  { value: 'plain', label: 'Dengan caption (kartu lengkap platform + keterangan)' },
  { value: 'frameless', label: 'Frameless (video saja, tanpa caption)' },
];
/** Panduan embed per sosmed (tampil di blok embed). */
const GUIDES: { name: string; steps: string[]; note?: string }[] = [
  { name: 'Instagram (post / reel)', steps: [
    'Buka postingan di instagram.com lewat browser komputer.',
    'Klik ikon ••• di kanan atas postingan → Embed.',
    'Centang / hapus "Include caption" sesuai selera → Copy embed code.',
    'Tempel kodenya di kolom di atas. Bisa juga: ••• → Copy link, lalu tempel link-nya.',
  ], note: 'Akun harus publik dan izin embed aktif (Pengaturan → Privasi → "Izinkan orang menyematkan postingan Anda").' },
  { name: 'TikTok', steps: [
    'Di aplikasi HP: Bagikan (panah) → Salin tautan, lalu tempel. Link pendek vt.tiktok.com otomatis diubah ke link lengkap.',
    'Di komputer: Bagikan → Sematkan (Embed) → Copy code, atau salin link dari kolom alamat (tiktok.com/@akun/video/…).',
  ], note: 'Video harus publik dan izin sematkan aktif (Pengaturan → Privasi → Izinkan video Anda disematkan). Dengan caption = nama akun, caption & musik tampil di video.' },
  { name: 'YouTube (video / Shorts / playlist)', steps: [
    'Buka video → Bagikan (Share) → Salin link, atau Sematkan (Embed) → salin kode <iframe>.',
    'Mulai dari detik tertentu: centang "Mulai pada" saat Bagikan (link berisi ?t=90). Waktu mulai ikut terbawa.',
    'Shorts (youtube.com/shorts/…) otomatis tampil vertikal 9:16. Link playlist (…list=…) tampil sebagai playlist.',
  ], note: 'Video harus Publik atau Tidak publik (unlisted), dan "Izinkan penyematan" di YouTube Studio aktif. Video berlisensi musik/film kadang tidak bisa disematkan.' },
  { name: 'Program web hasil developer', steps: [
    'Tempel link https dari demo program (Vercel, Netlify, GitHub Pages, CodeSandbox, StackBlitz, dll.).',
    'Atur "Tinggi program web" agar program tampil penuh.',
  ], note: 'Situs tujuan harus mengizinkan ditampilkan di iframe; bila kotak kosong, situsnya menolak.' },
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
    <small className="xs muted"><strong>Dengan caption</strong>: kartu lengkap platform (nama akun, caption) + keterangan Anda. <strong>Frameless</strong>: video saja, tanpa caption.</small>
  </details>
);

const KIND_NAME: Record<string, string> = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', web: 'program web' };
/** Status link embed. Link pendek TikTok (vt.tiktok.com/…) otomatis diubah ke link lengkap. */
const EmbedStatus: React.FC<{ url: string; onChange: (v: string) => void }> = ({ url, onChange }) => {
  const [failed, setFailed] = useState('');
  const latest = useRef(onChange);
  latest.current = onChange;
  const short = isTikTokShort(url);
  useEffect(() => {
    if (!short) return;
    let alive = true;
    // jeda singkat: jangan memanggil TikTok di setiap ketikan
    const t = window.setTimeout(() => resolveTikTok(url).then(full => {
      if (!alive) return;
      if (full) { latest.current(full); toast.success('Link pendek TikTok diubah ke link lengkap'); } else setFailed(url);
    }), 600);
    return () => { alive = false; window.clearTimeout(t); };
  }, [url, short]);
  if (!url.trim() || mediaKind(url) !== 'embed') return null;
  if (short) return <small className="xs faint">{failed === url ? <strong style={{ color: '#d14343' }}>Link pendek TikTok tidak bisa dibaca. Buka videonya di browser, lalu salin link lengkap (tiktok.com/@akun/video/…).</strong> : 'Membaca link pendek TikTok…'}</small>;
  const e = parseEmbed(url);
  return <small className="xs faint">{e ? <>Terbaca: <strong>{KIND_NAME[e.kind]}</strong>{/[?&]start=/.test(e.src) && ' · mulai dari detik ' + e.src.match(/start=(\d+)/)![1]}{/[?&]list=/.test(e.src) && ' · playlist'}</> : <strong style={{ color: '#d14343' }}>Link belum terbaca. Cek panduan di bawah.</strong>}</small>;
};


/** Daftar foto slideshow / galeri: tambah & hapus satu per satu. */
const Photos: React.FC<{ value: string[]; onChange: (v: string[]) => void }> = ({ value, onChange }) => (
  <div className="field">
    <span>Foto ({value.length})</span>
    <div className="cms-points">
      {value.map((u, i) => (
        <div key={i} className="cms-point cms-photo">
          <span className="cms-point-n xs faint">{i + 1}</span>
          <ImageInput label="" value={u} onChange={v => onChange(value.map((x, j) => (j === i ? v : x)))} />
          <button type="button" className="icon-btn sm" aria-label={`Hapus foto ${i + 1}`} onClick={() => onChange(value.filter((_, j) => j !== i))}><Icon name="close" size={14} /></button>
        </div>
      ))}
    </div>
    <button type="button" className="pill sm" style={{ alignSelf: 'flex-start' }} onClick={() => onChange([...value, ''])}><Icon name="plus" size={14} />Tambah foto</button>
  </div>
);

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
      <small className="xs faint">Tempel link, atau kode dari menu <strong>Embed</strong> Instagram / TikTok / YouTube. Juga bisa link program web hasil developer (tampil interaktif).</small>
      <EmbedStatus url={b.url} onChange={v => up({ url: v })} />
      <Grid>
        <Text label="Keterangan (opsional)" value={b.caption} onChange={v => up({ caption: v })} />
        <Text label="Tinggi program web (px)" type="number" value={b.height} onChange={v => up({ height: Math.max(240, Math.min(1400, Number(v) || 520)) })} hint="Hanya untuk link program web." />
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
      <ImageInput label="Media: upload foto, atau tempel link / kode embed YouTube / TikTok / Instagram" value={b.url} onChange={v => up({ url: v })} />
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

const PortfolioAdmin: React.FC = () => {
  const { items, loading, error, addItem, updateItem, deleteItem } = usePortfolio({ live: true });
  const [edit, setEdit] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!edit) return;
    if (!edit.title.trim()) { toast.error('Judul wajib diisi'); return; }
    setBusy(true);
    try {
      const { id, ...data } = edit;
      if (id) await updateItem(id, data); else await addItem({ ...data, order: items.length });
      toast.success('Proyek tersimpan & live');
      setEdit(null);
    } catch (e: any) { toast.error('Gagal: ' + (e?.code || e?.message)); }
    finally { setBusy(false); }
  };

  const move = async (i: number, d: number) => {
    const a = items[i], b = items[i + d]; if (!a || !b) return;
    try { await Promise.all([updateItem(a.id, { order: b.order ?? i + d }), updateItem(b.id, { order: a.order ?? i })]); }
    catch { toast.error('Gagal mengurutkan'); }
  };

  if (edit) return (
    <Section title={edit.id ? 'Edit proyek' : 'Proyek baru'} actions={<button className="pill sm" onClick={() => setEdit(null)}>Batal</button>}>
      <Grid>
        <Text label="Judul / headline" value={edit.title} onChange={v => setEdit({ ...edit, title: v })} />
        <Text label="Kategori (mis. HR, IT Support, Desain)" value={edit.category} onChange={v => setEdit({ ...edit, category: v })} />
        <Text label="Klien / perusahaan" value={edit.client} onChange={v => setEdit({ ...edit, client: v })} />
        <Text label="Tahun" value={edit.year} onChange={v => setEdit({ ...edit, year: v })} />
      </Grid>
      <Text label="Sub-judul artikel" value={edit.subtitle} onChange={v => setEdit({ ...edit, subtitle: v })} hint="Tampil di bawah headline." />
      <Area label="Ringkasan (kartu daftar portofolio)" value={edit.description} onChange={v => setEdit({ ...edit, description: v })} rows={3} />
      <Tags label="Tag" value={edit.tags} onChange={v => setEdit({ ...edit, tags: v })} />
      <Text label="Link proyek (opsional)" value={edit.link || ''} onChange={v => setEdit({ ...edit, link: v })} />
      <ImageInput label="Gambar cover / hero banner" value={edit.imageUrl} onChange={v => setEdit({ ...edit, imageUrl: v })} />
      <Area label="Video hero banner (opsional): link atau kode embed" value={edit.videoUrl} onChange={v => setEdit({ ...edit, videoUrl: v })} rows={2} />
      <EmbedStatus url={edit.videoUrl} onChange={v => setEdit(e => (e && { ...e, videoUrl: v }))} />
      <small className="xs faint">YouTube / TikTok / Instagram, tampil frameless. Bila diisi, hero banner artikel memakai video ini; gambar cover tetap dipakai di kartu daftar.</small>
      <EmbedGuide />
      <div className="field">
        <span>Isi artikel ({edit.blocks.length} blok)</span>
        <small className="xs faint">Susun bebas tanpa batas: tambah blok, ubah urutan dengan panah, duplikat, atau hapus. Kosong = ringkasan dipakai sebagai isi.</small>
        <ListEditor<ArticleBlock> items={edit.blocks} onChange={v => setEdit({ ...edit, blocks: v })} addLabel="Tambah paragraf"
          create={() => newBlock('text')}
          title={b => <><strong>{blockLabel(b.type)}</strong> <span className="faint">· {(b.text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim() || b.caption || b.url || (b.urls.length ? `${b.urls.length} foto` : '')).slice(0, 70)}</span></>}
          render={(b, up) => <BlockFields b={b} up={up} />}
          extraAdd={BLOCKS.filter(x => x.type !== 'text').map(x => ({ label: x.label, icon: x.icon, create: () => newBlock(x.type) }))} />
      </div>
      <div className="field cms-seo">
        <span>Hashtag, SEO & Keyword (tampil di akhir artikel)</span>
        <Tags label="Hashtag" value={edit.hashtags} onChange={v => setEdit({ ...edit, hashtags: v.map(h => h.replace(/^#+/, '').replace(/\s+/g, '')).filter(Boolean) })} />
        <Tags label="Keyword / kata kunci" value={edit.keywords} onChange={v => setEdit({ ...edit, keywords: v })} />
        <Text label={`Judul SEO (${(edit.seoTitle || edit.title).length}/60)`} value={edit.seoTitle} onChange={v => setEdit({ ...edit, seoTitle: v })} hint="Judul di hasil pencarian Google & saat dibagikan. Kosong = judul artikel. Ideal ≤ 60 karakter." />
        <Area label={`Deskripsi SEO (${(edit.seoDesc || edit.description).length}/160)`} value={edit.seoDesc} onChange={v => setEdit({ ...edit, seoDesc: v })} rows={2} hint="Ringkasan di bawah judul pada hasil Google. Kosong = ringkasan kartu. Ideal 120–160 karakter." />
        <div className="seo-preview" aria-label="Pratinjau hasil Google">
          <small className="xs faint">hikimori.web.id › portofolio</small>
          <strong>{(edit.seoTitle || edit.title || 'Judul artikel').slice(0, 70)}</strong>
          <p className="xs">{(edit.seoDesc || edit.description || 'Deskripsi artikel…').slice(0, 170)}</p>
        </div>
      </div>
      <Toggle label="Unggulan (tampil paling depan & kartu gelap)" value={edit.featured} onChange={v => setEdit({ ...edit, featured: v })} />
      <div className="row gap-8"><button className="pill dark" onClick={save} disabled={busy}><Icon name="save" size={15} />{busy ? 'Menyimpan…' : 'Simpan proyek'}</button></div>
    </Section>
  );

  return (
    <Section title="Portofolio" desc="Proyek disimpan langsung ke Firestore — tidak perlu menekan Publikasikan."
      actions={<button className="pill dark sm" onClick={() => setEdit({ ...EMPTY })}><Icon name="plus" size={14} />Proyek baru</button>}>
      {loading ? <div className="spinner" /> : error ? <div className="empty">{error}</div> : items.length === 0 ? <div className="empty">Belum ada proyek.</div> : (
        <div className="stack gap-8">
          {items.map((it, i) => (
            <div key={it.id} className="cms-item row gap-12" style={{ padding: 10 }}>
              {it.imageUrl ? <img src={it.imageUrl} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 10 }} /> : <span className="logo-box"><Icon name="image" /></span>}
              <div className="grow"><div className="small">{it.featured && '⭐ '}{it.title}</div><div className="xs muted">{it.category} · {it.year} · {it.blocks.length} blok</div></div>
              <a className="icon-btn sm" href={`/portofolio/${it.id}`} target="_blank" rel="noreferrer" aria-label="Lihat artikel"><Icon name="eye" size={14} /></a>
              <button className="icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Naik"><Icon name="up" size={14} /></button>
              <button className="icon-btn sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Turun"><Icon name="down" size={14} /></button>
              <button className="pill sm" onClick={() => setEdit({ ...EMPTY, ...it })}>Edit</button>
              <button className="icon-btn sm" aria-label="Hapus" onClick={async () => { if (window.confirm(`Hapus “${it.title}”?`)) { try { await deleteItem(it.id); toast.success('Dihapus'); } catch { toast.error('Gagal menghapus'); } } }}><Icon name="trash" size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default PortfolioAdmin;
