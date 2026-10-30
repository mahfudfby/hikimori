// src/admin/PortfolioAdmin.tsx — CRUD koleksi `portfolio` (setiap simpan langsung live).
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { usePortfolio, PortfolioItem } from '../hooks/usePortfolio';
import { Icon } from '../components/ui';
import { Text, Area, Tags, ImageInput, Toggle, Grid, Section } from './fields';

type Draft = Omit<PortfolioItem, 'id'> & { id?: string };
const EMPTY: Draft = { title: '', category: '', description: '', imageUrl: '', tags: [], client: '', year: String(new Date().getFullYear()), link: '', featured: false, order: 0 };

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
        <Text label="Judul" value={edit.title} onChange={v => setEdit({ ...edit, title: v })} />
        <Text label="Kategori (mis. HR, IT Support, Desain)" value={edit.category} onChange={v => setEdit({ ...edit, category: v })} />
        <Text label="Klien / perusahaan" value={edit.client} onChange={v => setEdit({ ...edit, client: v })} />
        <Text label="Tahun" value={edit.year} onChange={v => setEdit({ ...edit, year: v })} />
      </Grid>
      <Area label="Deskripsi" value={edit.description} onChange={v => setEdit({ ...edit, description: v })} rows={6} />
      <Tags label="Tag" value={edit.tags} onChange={v => setEdit({ ...edit, tags: v })} />
      <Text label="Link proyek (opsional)" value={edit.link || ''} onChange={v => setEdit({ ...edit, link: v })} />
      <ImageInput label="Gambar cover" value={edit.imageUrl} onChange={v => setEdit({ ...edit, imageUrl: v })} />
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
              <div className="grow"><div className="small">{it.featured && '⭐ '}{it.title}</div><div className="xs muted">{it.category} · {it.year}</div></div>
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
