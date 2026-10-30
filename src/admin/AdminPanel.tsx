// src/admin/AdminPanel.tsx — CMS: kelola SEMUA konten situs tanpa coding.
// Alur: edit di draft (tersimpan otomatis di browser) → "Publikasikan" menyimpan ke Firestore
// dan langsung tampil di situs untuk semua pengunjung.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useContent, mergeContent, listHistory, fetchLiveUpdatedAt } from '../content/ContentContext';
import { DEFAULT_CONTENT } from '../content/defaults';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '../components/ui';
import LogoMark from '../components/LogoMark';
import { pick, monthsOf, fmtDuration, CATEGORY_LABEL } from '../content/derive';
import type { SiteContent, Experience, Certificate, Skill, Service, Education, JourneyStep, Organization, Reference, Tool, ProcessStep, Achievement } from '../content/types';
import { Text, Select, Toggle, BiField, BiLines, Tags, ImageInput, ListEditor, Grid, Section, uid } from './fields';
import PortfolioAdmin from './PortfolioAdmin';

const DRAFT_KEY = 'hk_cms_draft';
const eb = () => ({ id: '', en: '' });

const SECTIONS = [
  { k: 'dash', label: 'Ringkasan', icon: 'grid' },
  { k: 'profile', label: 'Profil & Biodata', icon: 'user' },
  { k: 'exp', label: 'Pengalaman', icon: 'briefcase' },
  { k: 'edu', label: 'Pendidikan', icon: 'cap' },
  { k: 'cert', label: 'Sertifikat', icon: 'award' },
  { k: 'skill', label: 'Keahlian & Tools', icon: 'tool' },
  { k: 'service', label: 'Layanan', icon: 'layers' },
  { k: 'contact', label: 'Kontak & Referensi', icon: 'chat' },
  { k: 'portfolio', label: 'Portofolio', icon: 'image' },
  { k: 'backup', label: 'Backup & Reset', icon: 'save' },
] as const;
type SKey = typeof SECTIONS[number]['k'];

const AdminPanel: React.FC = () => {
  const { content, saveContent, synced } = useContent();
  const { logout, user } = useAuth();
  const { mode, toggle } = useTheme();
  const nav = useNavigate();
  const [sec, setSec] = useState<SKey>(() => (sessionStorage.getItem('hk_cms_sec') as SKey) || 'dash');
  const touched = useRef(false); // true = admin sudah mengedit / ada draft lama
  const [draft, setDraftRaw] = useState<SiteContent>(() => {
    try { const d = localStorage.getItem(DRAFT_KEY); if (d) { touched.current = true; return mergeContent(JSON.parse(d)); } } catch {}
    return content;
  });
  const setDraft: typeof setDraftRaw = v => { touched.current = true; setDraftRaw(v); };
  // Data Firestore datang belakangan -> ikutkan ke draft selama belum diedit.
  useEffect(() => { if (!touched.current) setDraftRaw(content); }, [content]);
  const [rev, setRev] = useState(0); // remount form setelah import/reset
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  useEffect(() => { sessionStorage.setItem('hk_cms_sec', sec); window.scrollTo({ top: 0 }); }, [sec]);
  useEffect(() => { document.title = 'CMS — Hikimori'; }, []);
  // Draft otomatis tersimpan di browser (aman kalau tab tertutup)
  useEffect(() => {
    const id = setTimeout(() => { try { dirty ? localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) : localStorage.removeItem(DRAFT_KEY); } catch {} }, 400);
    return () => clearTimeout(id);
  }, [draft, dirty]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => setDraft(d => ({ ...d, [k]: v }));
  const setP = (patch: Partial<SiteContent['profile']>) => setDraft(d => ({ ...d, profile: { ...d.profile, ...patch } }));

  const [history, setHistory] = useState<{ id: string; savedAt: string; value: SiteContent }[] | null>(null);
  const [histBusy, setHistBusy] = useState(false);

  const publish = async () => {
    setSaving(true);
    try {
      // Cegah menimpa perubahan yang dipublikasikan dari tab/perangkat lain setelah draft ini dibuat.
      const live = await fetchLiveUpdatedAt().catch(() => '');
      if (live && draft.updatedAt && live !== draft.updatedAt &&
        !window.confirm(`Konten di situs sudah diperbarui dari tempat lain (${new Date(live).toLocaleString('id-ID')}).

Tetap publikasikan dan TIMPA versi tersebut?
(Versi lama tetap tersimpan di Riwayat.)`)) {
        setSaving(false); return;
      }
      await saveContent(draft);
      touched.current = false;
      localStorage.removeItem(DRAFT_KEY);
      toast.success('Tersimpan & dipublikasikan ✓');
    } catch (e: any) {
      const msg = String(e?.code || e?.message || e);
      toast.error(msg.includes('permission') ? 'Ditolak Firestore — cek Firestore Rules (lihat README) & pastikan login.' : 'Gagal menyimpan: ' + msg, { duration: 6000 });
    } finally { setSaving(false); }
  };
  const discard = () => { if (window.confirm('Buang semua perubahan yang belum dipublikasikan?')) { touched.current = false; setDraftRaw(content); setRev(r => r + 1); localStorage.removeItem(DRAFT_KEY); } };

  const p = draft.profile;

  const body = (() => {
    switch (sec) {
      case 'dash': {
        const stat = [
          ['Pengalaman', draft.experience.length, 'exp'], ['Pendidikan', draft.education.items.length, 'edu'],
          ['Sertifikat', draft.certificates.length, 'cert'], ['Keahlian', draft.skills.length, 'skill'],
          ['Tools', draft.tools.length, 'skill'], ['Layanan', draft.services.length, 'service'],
        ] as const;
        return (<>
          <Section title={`Halo, ${p.shortName} 👋`} desc="Semua konten situs bisa diubah dari panel ini. Edit bagian mana pun, lalu tekan Publikasikan.">
            <div className="grid-3">
              {stat.map(([l, n, k]) => (
                <button key={l} className="card hoverable" style={{ textAlign: 'left' }} onClick={() => setSec(k as SKey)}>
                  <div className="num-lg">{n}</div><div className="small muted mt-8">{l}</div>
                </button>
              ))}
            </div>
            <div className="small muted">
              Terakhir dipublikasikan: <b>{content.updatedAt ? new Date(content.updatedAt).toLocaleString('id-ID') : 'belum pernah (masih konten bawaan)'}</b>
              {' · '}Firestore: {synced ? '🟢 terhubung' : '🟡 menghubungkan…'}
            </div>
          </Section>
          <Section title="Cara pakai" desc="Tiga langkah sederhana">
            <ol className="bullets" style={{ paddingLeft: 0 }}>
              <li>Pilih menu di kiri (mis. <b>Pengalaman</b>) lalu klik item untuk membukanya.</li>
              <li>Ubah teks Indonesia & English, upload gambar, atau tambah/hapus/urutkan item. Draft otomatis tersimpan di browser.</li>
              <li>Tekan <b>Publikasikan</b> di atas — perubahan langsung tampil untuk semua pengunjung.</li>
            </ol>
          </Section>
        </>);
      }

      case 'profile': return (<>
        <Section title="Identitas" desc="Tampil di navbar, kartu foto dashboard, dan halaman /profil.">
          <Grid>
            <Text label="Nama lengkap + gelar" value={p.name} onChange={v => setP({ name: v })} />
            <Text label="Nama panggilan (sapaan dashboard & logo)" value={p.shortName} onChange={v => setP({ shortName: v })} />
          </Grid>
          <BiField label="Jabatan / title" value={p.title} onChange={v => setP({ title: v })} />
          <BiField label="Tagline" value={p.tagline} onChange={v => setP({ tagline: v })} area rows={2} />
          <Grid>
            <Text label="Badge di foto (mis. CHRG)" value={p.badge} onChange={v => setP({ badge: v })} />
            <Text label="Link file CV (PDF)" value={p.cvUrl} onChange={v => setP({ cvUrl: v })} hint="Bisa link Google Drive / Cloudinary, atau /CV-Mahfud-Febry-Styanto.pdf" />
          </Grid>
          <Grid>
            <ImageInput label="Foto profil" value={p.photoUrl} onChange={v => setP({ photoUrl: v })} />
            <ImageInput label="Logo gambar (untuk ikon tab & bagikan link — logo di situs memakai monogram HK vektor)" value={p.logoUrl} onChange={v => setP({ logoUrl: v })} />
          </Grid>
          <Toggle label="Tampilkan status “Terbuka untuk peluang kerja”" value={p.openToWork} onChange={v => setP({ openToWork: v })} />
          <Toggle label="Tampilkan tanggal lahir, usia & jenis kelamin ke publik (disarankan: mati — cegah bias usia & lindungi data pribadi)" value={p.showBirthDate} onChange={v => setP({ showBirthDate: v })} />
          <Toggle label="Kartu dashboard: tampilkan bar Usia (mati = kartu Pencapaian)" value={p.showAgeCard} onChange={v => setP({ showAgeCard: v })} />
        </Section>
        <Section title="Pencapaian" desc="Angka-angka yang menjual — tampil di kartu Pencapaian dashboard (5 teratas) dan halaman /profil. Isi angka singkat (mis. 121, -50%, 4j → <1j).">
          <ListEditor<Achievement> items={draft.achievements} onChange={v => set('achievements', v)} addLabel="Tambah pencapaian"
            create={() => ({ id: uid('a'), value: '', label: eb() })}
            title={a => <>{a.value} <span className="faint">· {pick(a.label, 'id')}</span></>}
            render={(a, up) => (<>
              <Text label="Angka / nilai" value={a.value} onChange={v => up({ value: v })} placeholder="121" />
              <BiField label="Keterangan" value={a.label} onChange={v => up({ label: v })} />
            </>)} />
        </Section>
        <Section title="Ringkasan & cerita" desc="Ringkasan tampil di kartu Summary dashboard; cerita panjang di /profil (pisahkan paragraf dengan baris kosong).">
          <BiField label="Ringkasan profesional" value={p.summary} onChange={v => setP({ summary: v })} area rows={5} />
          <BiField label="Cerita saya" value={p.story} onChange={v => setP({ story: v })} area rows={10} />
        </Section>
        <Section title="Biodata pribadi" desc="Tahun lahir dipakai untuk bar Usia di dashboard.">
          <Grid cols={3}>
            <Text label="Tempat lahir" value={p.birthPlace} onChange={v => setP({ birthPlace: v })} />
            <Text label="Tanggal lahir (teks bebas, opsional)" value={p.birthDate} onChange={v => setP({ birthDate: v })} placeholder="12 Februari 2000" />
            <Text label="Tahun lahir" type="number" value={p.birthYear} onChange={v => setP({ birthYear: Number(v) || 0 })} />
          </Grid>
          <Grid>
            <BiField label="Jenis kelamin" value={p.gender} onChange={v => setP({ gender: v })} />
            <BiField label="Kewarganegaraan" value={p.nationality} onChange={v => setP({ nationality: v })} />
          </Grid>
          <Grid>
            <Text label="Domisili" value={p.location} onChange={v => setP({ location: v })} />
            <Text label="Website" value={p.website} onChange={v => setP({ website: v })} />
            <Text label="Email" type="email" value={p.email} onChange={v => setP({ email: v })} />
            <Text label="Telepon (tampilan)" value={p.phone} onChange={v => setP({ phone: v })} />
            <Text label="Nomor WhatsApp (format 62…)" value={p.whatsapp} onChange={v => setP({ whatsapp: v.replace(/\D/g, '') })} />
          </Grid>
          <BiLines key={`hob${rev}`} label="Hobi & minat" value={p.hobbies} onChange={v => setP({ hobbies: v })} />
        </Section>
        <Section title="Media sosial" desc="Isi username saja (kecuali Jobstreet & iBenews: link penuh). Kosongkan untuk menyembunyikan.">
          <Grid cols={3}>
            {(Object.keys(p.socials) as (keyof typeof p.socials)[]).map(k => (
              <Text key={k} label={k} value={p.socials[k]} onChange={v => setP({ socials: { ...p.socials, [k]: v } })} />
            ))}
          </Grid>
        </Section>
      </>);

      case 'exp': return (
        <Section title="Pengalaman kerja" desc="Tampil di grafik Progress & slideshow Deskripsi Kerja (dashboard) dan /pengalaman. Baris diawali “•” = bullet."
          actions={<button className="pill sm" onClick={() => set('experience', [...draft.experience].sort((a, b) => (b.start || '').localeCompare(a.start || '')))}>Urutkan terbaru</button>}>
          <ListEditor<Experience> items={draft.experience} onChange={v => set('experience', v)} addLabel="Tambah pengalaman"
            create={() => ({ id: uid('e'), position: eb(), company: '', industry: eb(), location: '', start: '', end: '', type: 'Full-time', category: 'other', logoUrl: '', tags: [], desc: eb() })}
            title={e => <>{pick(e.position, 'id')} <span className="faint">· {e.company} · {fmtDuration(monthsOf(e.start, e.end), 'id', true)}</span></>}
            render={(e, up) => (<>
              <BiField label="Posisi / jabatan" value={e.position} onChange={v => up({ position: v })} />
              <Grid>
                <Text label="Perusahaan" value={e.company} onChange={v => up({ company: v })} />
                <Text label="Lokasi" value={e.location} onChange={v => up({ location: v })} />
              </Grid>
              <BiField label="Bidang industri" value={e.industry} onChange={v => up({ industry: v })} />
              <Grid cols={4}>
                <Text label="Mulai" type="month" value={e.start} onChange={v => up({ start: v })} />
                <Text label="Selesai" type="month" value={e.end} onChange={v => up({ end: v })} hint="Kosong = masih bekerja" />
                <Select label="Tipe" value={e.type} onChange={v => up({ type: v })} options={['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(x => ({ value: x, label: x }))} />
                <Select label="Kategori" value={e.category} onChange={v => up({ category: v as Experience['category'] })} options={(Object.keys(CATEGORY_LABEL) as Experience['category'][]).map(k => ({ value: k, label: CATEGORY_LABEL[k].id }))} />
              </Grid>
              <ImageInput label="Logo perusahaan" value={e.logoUrl} onChange={v => up({ logoUrl: v })} />
              <Tags label="Tag / kata kunci" value={e.tags} onChange={v => up({ tags: v })} />
              <BiField label="Deskripsi pekerjaan" value={e.desc} onChange={v => up({ desc: v })} area rows={8} hint="Satu tugas per baris, awali dengan •" />
            </>)} />
        </Section>
      );

      case 'edu': return (<>
        <Section title="Halaman pendidikan" desc="Pengantar & cerita tampil di /pendidikan.">
          <BiField label="Pengantar singkat" value={draft.education.intro} onChange={v => set('education', { ...draft.education, intro: v })} area rows={2} />
          <BiField label="Cerita pendidikan" value={draft.education.story} onChange={v => set('education', { ...draft.education, story: v })} area rows={9} />
        </Section>
        <Section title="Riwayat pendidikan" desc="Item pertama tampil di kartu Pendidikan dashboard.">
          <ListEditor<Education> items={draft.education.items} onChange={v => set('education', { ...draft.education, items: v })} addLabel="Tambah pendidikan"
            create={() => ({ id: uid('ed'), level: eb(), school: '', major: eb(), location: '', start: '', end: '', gpa: '', logoUrl: '', note: eb(), story: eb(), thesis: eb(), courses: [], highlights: [] })}
            title={e => `${pick(e.level, 'id')} ${pick(e.major, 'id')} — ${e.school}`}
            render={(e, up) => (<>
              <Grid><BiField label="Jenjang" value={e.level} onChange={v => up({ level: v })} /><BiField label="Program studi" value={e.major} onChange={v => up({ major: v })} /></Grid>
              <Grid><Text label="Nama kampus / sekolah" value={e.school} onChange={v => up({ school: v })} /><Text label="Lokasi" value={e.location} onChange={v => up({ location: v })} /></Grid>
              <Grid cols={3}>
                <Text label="Mulai (YYYY-MM atau tahun)" value={e.start} onChange={v => up({ start: v })} />
                <Text label="Lulus (YYYY-MM atau tahun)" value={e.end} onChange={v => up({ end: v })} />
                <Text label="IPK" value={e.gpa} onChange={v => up({ gpa: v })} />
              </Grid>
              <BiField label="Catatan (mis. Kelas Karyawan)" value={e.note} onChange={v => up({ note: v })} />
              <BiField label="Cerita singkat" value={e.story} onChange={v => up({ story: v })} area />
              <BiField label="Judul skripsi / tugas akhir" value={e.thesis} onChange={v => up({ thesis: v })} />
              <Tags label="Mata kuliah inti" value={e.courses} onChange={v => up({ courses: v })} />
              <BiLines label="Pencapaian / highlight" value={e.highlights} onChange={v => up({ highlights: v })} />
              <ImageInput label="Logo kampus" value={e.logoUrl} onChange={v => up({ logoUrl: v })} />
            </>)} />
        </Section>
        <Section title="Alur & sejarah" desc="Timeline perjalanan di /pendidikan.">
          <ListEditor<JourneyStep> items={draft.education.journey} onChange={v => set('education', { ...draft.education, journey: v })} addLabel="Tambah langkah"
            create={() => ({ id: uid('j'), year: '', title: eb(), desc: eb() })}
            title={j => `${j.year} · ${pick(j.title, 'id')}`}
            render={(j, up) => (<>
              <Text label="Tahun" value={j.year} onChange={v => up({ year: v })} />
              <BiField label="Judul" value={j.title} onChange={v => up({ title: v })} />
              <BiField label="Keterangan" value={j.desc} onChange={v => up({ desc: v })} area rows={2} />
            </>)} />
        </Section>
        <Section title="Organisasi" desc="Tampil di /profil dan /pendidikan.">
          <ListEditor<Organization> items={draft.organizations} onChange={v => set('organizations', v)} addLabel="Tambah organisasi"
            create={() => ({ id: uid('o'), name: eb(), role: eb(), period: '', points: [] })}
            title={o => `${pick(o.role, 'id')} — ${pick(o.name, 'id')}`}
            render={(o, up) => (<>
              <BiField label="Nama organisasi" value={o.name} onChange={v => up({ name: v })} />
              <Grid><BiField label="Jabatan" value={o.role} onChange={v => up({ role: v })} /><Text label="Periode" value={o.period} onChange={v => up({ period: v })} /></Grid>
              <BiLines label="Tanggung jawab" value={o.points} onChange={v => up({ points: v })} />
            </>)} />
        </Section>
      </>);

      case 'cert': return (
        <Section title="Sertifikat & lisensi" desc="Kategori “Lisensi” diberi tanda centang kuning di kartu dashboard. Upload gambar agar bisa dipreview pengunjung.">
          <ListEditor<Certificate> items={draft.certificates} onChange={v => set('certificates', v)} addLabel="Tambah sertifikat"
            create={() => ({ id: uid('c'), name: eb(), issuer: '', code: '', category: 'training', year: '', imageUrl: '', credentialUrl: '', desc: eb() })}
            title={c => <>{pick(c.name, 'id')} <span className="faint">· {c.year}</span></>}
            render={(c, up) => (<>
              <BiField label="Nama sertifikat" value={c.name} onChange={v => up({ name: v })} />
              <Grid>
                <Text label="Penerbit" value={c.issuer} onChange={v => up({ issuer: v })} />
                <Select label="Kategori" value={c.category} onChange={v => up({ category: v as Certificate['category'] })} options={[{ value: 'license', label: 'Lisensi' }, { value: 'training', label: 'Pelatihan' }, { value: 'cert', label: 'Sertifikat' }]} />
                <Text label="Tahun / masa berlaku" value={c.year} onChange={v => up({ year: v })} />
                <Text label="Kode unit / no. sertifikat" value={c.code} onChange={v => up({ code: v })} />
              </Grid>
              <BiField label="Keterangan" value={c.desc} onChange={v => up({ desc: v })} area rows={2} />
              <Text label="Link verifikasi (opsional)" value={c.credentialUrl} onChange={v => up({ credentialUrl: v })} />
              <ImageInput label="Gambar sertifikat" value={c.imageUrl} onChange={v => up({ imageUrl: v })} />
            </>)} />
        </Section>
      );

      case 'skill': return (<>
        <Section title="Keahlian" desc="Level 0–100 menentukan urutan & panjang bar. 4 teratas tiap kategori tampil di kartu Summary dashboard.">
          <ListEditor<Skill> items={draft.skills} onChange={v => set('skills', v)} addLabel="Tambah keahlian"
            create={() => ({ id: uid('s'), name: eb(), category: 'hard', level: 80, desc: eb() })}
            title={s => <>{pick(s.name, 'id')} <span className="faint">· {s.category} · {s.level}%</span></>}
            render={(s, up) => (<>
              <BiField label="Nama keahlian" value={s.name} onChange={v => up({ name: v })} />
              <Grid>
                <Select label="Kategori" value={s.category} onChange={v => up({ category: v as Skill['category'] })} options={[{ value: 'hard', label: 'Hard skill' }, { value: 'soft', label: 'Soft skill' }]} />
                <label className="field"><span>Level: {s.level}%</span><input type="range" min={0} max={100} value={s.level} onChange={e => up({ level: Number(e.target.value) })} style={{ accentColor: 'var(--ink)', minHeight: 44 }} /></label>
              </Grid>
              <BiField label="Deskripsi" value={s.desc} onChange={v => up({ desc: v })} area rows={2} />
            </>)} />
        </Section>
        <Section title="Tools & aplikasi" desc="Dikelompokkan berdasarkan nama grup.">
          <ListEditor<Tool> items={draft.tools} onChange={v => set('tools', v)} addLabel="Tambah tool"
            create={() => ({ id: uid('t'), name: '', group: 'Office' })}
            title={tl => <>{tl.name} <span className="faint">· {tl.group}</span></>}
            render={(tl, up) => <Grid><Text label="Nama" value={tl.name} onChange={v => up({ name: v })} /><Text label="Grup" value={tl.group} onChange={v => up({ group: v })} /></Grid>} />
        </Section>
      </>);

      case 'service': return (<>
        <Section title="Layanan" desc="Tampil di /layanan dan pilihan topik di form kontak.">
          <ListEditor<Service> items={draft.services} onChange={v => set('services', v)} addLabel="Tambah layanan"
            create={() => ({ id: uid('sv'), icon: '✨', title: eb(), subtitle: eb(), desc: eb(), points: [] })}
            title={s => `${s.icon} ${pick(s.title, 'id')}`}
            render={(s, up) => (<>
              <Grid cols={3}><Text label="Ikon (emoji)" value={s.icon} onChange={v => up({ icon: v })} /></Grid>
              <Grid><BiField label="Judul" value={s.title} onChange={v => up({ title: v })} /><BiField label="Sub judul" value={s.subtitle} onChange={v => up({ subtitle: v })} /></Grid>
              <BiField label="Deskripsi" value={s.desc} onChange={v => up({ desc: v })} area rows={3} />
              <BiLines label="Cakupan layanan" value={s.points} onChange={v => up({ points: v })} />
            </>)} />
        </Section>
        <Section title="Alur kerja sama">
          <ListEditor<ProcessStep> items={draft.process} onChange={v => set('process', v)} addLabel="Tambah langkah"
            create={() => ({ id: uid('p'), title: eb(), desc: eb() })}
            title={x => pick(x.title, 'id')}
            render={(x, up) => (<><BiField label="Judul" value={x.title} onChange={v => up({ title: v })} /><BiField label="Keterangan" value={x.desc} onChange={v => up({ desc: v })} area rows={2} /></>)} />
        </Section>
      </>);

      case 'contact': return (<>
        <Section title="Halaman kontak & CTA" desc="Dipakai di /kontak dan banner ajakan di dashboard.">
          <BiField label="Judul" value={draft.contact.headline} onChange={v => set('contact', { ...draft.contact, headline: v })} />
          <BiField label="Sub judul" value={draft.contact.sub} onChange={v => set('contact', { ...draft.contact, sub: v })} area rows={2} />
          <BiField label="Status ketersediaan" value={draft.contact.availability} onChange={v => set('contact', { ...draft.contact, availability: v })} />
          <BiField label="Template pesan WhatsApp" value={draft.contact.waTemplate} onChange={v => set('contact', { ...draft.contact, waTemplate: v })} area rows={2} />
        </Section>
        <Section title="Referensi kerja">
          <ListEditor<Reference> items={draft.references} onChange={v => set('references', v)} addLabel="Tambah referensi"
            create={() => ({ id: uid('r'), name: '', role: eb(), company: '', note: eb() })}
            title={r => `${r.name} — ${r.company}`}
            render={(r, up) => (<>
              <Grid><Text label="Nama" value={r.name} onChange={v => up({ name: v })} /><Text label="Perusahaan" value={r.company} onChange={v => up({ company: v })} /></Grid>
              <BiField label="Jabatan" value={r.role} onChange={v => up({ role: v })} />
              <BiField label="Catatan" value={r.note} onChange={v => up({ note: v })} />
            </>)} />
        </Section>
      </>);

      case 'portfolio': return <PortfolioAdmin />;

      case 'backup':
      default: return (
        <Section title="Backup, import & reset">
          <div className="row wrap gap-8">
            <button className="pill dark" onClick={() => {
              const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = `hikimori-konten-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href);
            }}><Icon name="download" size={15} />Unduh backup (.json)</button>
            <label className="pill" style={{ cursor: 'pointer' }}><Icon name="upload" size={15} />Import backup
              <input type="file" accept="application/json" hidden onChange={async e => {
                const f = e.target.files?.[0]; if (!f) return;
                try { const data = JSON.parse(await f.text()); setDraft(mergeContent(data)); setRev(r => r + 1); toast.success('Backup dimuat ke draft — tekan Publikasikan untuk menyimpan'); }
                catch { toast.error('File tidak valid'); }
                e.target.value = '';
              }} />
            </label>
            <button className="pill" style={{ color: 'var(--danger)' }} onClick={() => {
              if (window.confirm('Ganti seluruh draft dengan konten bawaan? (Belum tersimpan sampai kamu Publikasikan)')) { setDraft({ ...DEFAULT_CONTENT }); setRev(r => r + 1); }
            }}><Icon name="trash" size={15} />Reset ke bawaan</button>
          </div>
          <p className="xs muted">Backup berisi seluruh konten teks & link gambar (portofolio disimpan terpisah di koleksi Firestore “portfolio”).</p>
          <div className="stack gap-8" style={{ borderTop: '1px dashed var(--line-2)', paddingTop: 16 }}>
            <div className="row between wrap gap-8">
              <div><div className="h-sm">Riwayat publikasi</div><div className="xs muted">Setiap kali Publikasikan, versinya disimpan otomatis. Pulihkan = muat ke draft (belum live sampai dipublikasikan).</div></div>
              <button className="pill sm" disabled={histBusy} onClick={async () => {
                setHistBusy(true);
                try { setHistory(await listHistory(15)); }
                catch (e: any) { toast.error('Gagal memuat riwayat: ' + (e?.code || e?.message)); }
                finally { setHistBusy(false); }
              }}>{histBusy ? 'Memuat…' : history ? 'Muat ulang' : 'Tampilkan riwayat'}</button>
            </div>
            {history && (history.length === 0 ? <div className="xs faint">Belum ada riwayat (muncul setelah publikasi pertama).</div> : history.map(h => (
              <div key={h.id} className="cms-item row between gap-8" style={{ padding: '8px 12px' }}>
                <span className="small">{new Date(h.savedAt).toLocaleString('id-ID')}</span>
                <button className="pill sm" onClick={() => {
                  if (window.confirm('Muat versi ini ke draft? Perubahan draft saat ini akan diganti.')) { setDraft(mergeContent(h.value)); setRev(r => r + 1); toast.success('Versi dimuat ke draft — tekan Publikasikan untuk menerapkan'); }
                }}>Pulihkan</button>
              </div>
            )))}
          </div>
        </Section>
      );
    }
  })();

  return (
    <div className="cms">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--surface-solid)', color: 'var(--text)', border: '1px solid var(--line)', borderRadius: 14, fontSize: '0.88rem' } }} />
      <aside className="cms-side">
        <Link to="/" className="brand" style={{ marginBottom: 12 }}><LogoMark height={22} /><span>CMS</span></Link>
        <nav className="stack gap-4">
          {SECTIONS.map(s => (
            <button key={s.k} className={`cms-nav ${sec === s.k ? 'on' : ''}`} onClick={() => setSec(s.k)}><Icon name={s.icon} size={16} />{s.label}</button>
          ))}
        </nav>
        <div className="stack gap-8" style={{ marginTop: 'auto', paddingTop: 16 }}>
          <span className="xs faint" style={{ wordBreak: 'break-all' }}>{user?.email}</span>
          <div className="row gap-8">
            <button className="icon-btn sm" onClick={toggle} aria-label="Theme"><Icon name={mode === 'dark' ? 'sun' : 'moon'} size={14} /></button>
            <button className="pill sm" onClick={async () => { if (dirty && !window.confirm('Ada perubahan belum dipublikasikan. Tetap logout?')) return; await logout(); nav('/'); }}><Icon name="logout" size={13} />Logout</button>
          </div>
        </div>
      </aside>

      <div className="cms-main">
        <div className="cms-bar">
          <div className="grow">
            <div className="h-card">{SECTIONS.find(s => s.k === sec)?.label}</div>
            <div className="xs muted">{dirty ? '● Ada perubahan belum dipublikasikan (draft tersimpan otomatis)' : '✓ Semua perubahan sudah dipublikasikan'}</div>
          </div>
          <a className="pill sm" href="/" target="_blank" rel="noreferrer"><Icon name="eye" size={13} />Lihat situs</a>
          {dirty && <button className="pill sm" onClick={discard}>Buang</button>}
          <button className="pill dark" onClick={publish} disabled={!dirty || saving}><Icon name="save" size={15} />{saving ? 'Menyimpan…' : 'Publikasikan'}</button>
        </div>
        <div key={rev} className="stack gap-16 page-in">{body}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
