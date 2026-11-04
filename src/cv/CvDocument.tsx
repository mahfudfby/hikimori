// src/cv/CvDocument.tsx — dokumen CV A4 dengan 10 template (5 ATS-friendly, 5 kreatif), isi dari model yang sama.
// Ukuran halaman tetap 794 x 1123 px (A4 96 dpi), margin tepi 1,5 cm (57 px). Banyak halaman otomatis:
// tiap kolom dipecah per unit oleh usePagination (data-flow="main" | "side").
//
// Aturan template ATS (MIT CAPD, Columbia Career Education, Berkeley Career Engagement, Indeed, Jobscan):
//  - satu kolom, tanpa tabel / kotak teks / kolom / ikon / foto / grafis (parser membaca berurutan dari atas)
//  - nama & kontak di badan dokumen (bukan header/footer, sering dilewati parser)
//  - font standar (Arial / Calibri / Times; di sini Arimo, Carlito, Tinos = metrik yang sama), isi >= 10 pt
//  - judul bagian standar (Ringkasan, Pengalaman Kerja, Pendidikan, Keahlian, Sertifikasi), tanggal konsisten
//  - teks asli (ekspor "PDF teks (ATS)"); PDF gambar / JPEG tidak bisa dibaca ATS
// Template kreatif: maks. 2-3 warna (netral + 1 aksen), hierarki tipografi jelas, ruang kosong cukup.
import { forwardRef, useMemo, type CSSProperties, type ReactNode } from 'react';
import type { CvModel } from './cvModel';
import type { Lang } from '../contexts/LanguageContext';
import { usePagination } from './usePagination';

export const PAGE_W = 794; // A4 pada 96 dpi
export const PAGE_H = 1123;
const M = 57; // 1,5 cm
const GAP = 36;
const FOOT = 30; // tinggi area footer di bawah isi
// Ukuran huruf kelipatan 0,5 pt supaya sama persis bila nanti diekspor ke Word
const hp = (px: number) => Math.round(px * 1.5) / 1.5;

// Font (dimuat lewat ensureFont di exportCv.ts). Nama font sistem didahulukan, web font sebagai pengganti metrik-sama.
const F = {
  helv: '"Helvetica Neue", Helvetica, Arimo, Arial, sans-serif',
  arial: 'Arial, Arimo, "Liberation Sans", sans-serif',
  calibri: 'Calibri, Carlito, "Segoe UI", sans-serif',
  times: '"Times New Roman", Tinos, Times, serif',
  mont: 'Montserrat, Arimo, Arial, sans-serif',
};
export const CV_FONT = F.helv;

type Head = 'rule-thick' | 'rule-thin' | 'caps-rule' | 'center-rule' | 'plain-caps' | 'bar' | 'caps-accent';
type Tpl = {
  id: string; kind: 'ats' | 'creative'; name: { id: string; en: string };
  font: string; headFont?: string; base: number;
  cols: 'one' | 'side-right' | 'side-left'; sideW: number;
  sideBg?: string; sideInk?: string; sideMuted?: string;
  accent: string; head: Head; nameSize: number; center?: boolean;
  photo: 'none' | 'rect' | 'circle';
  banner?: { bg: string; ink: string; h: number; photo?: boolean; center?: boolean };
  timeline?: boolean; skillsFirst?: boolean;
};

export const TEMPLATES: Tpl[] = [
  // ── ATS-friendly: satu kolom, tanpa foto, teks gelap di atas putih ──
  { id: 'ats-klasik', kind: 'ats', name: { id: 'ATS Klasik (Arial)', en: 'ATS Classic (Arial)' }, font: F.arial, base: 14, cols: 'one', sideW: 0, accent: '#111111', head: 'caps-rule', nameSize: 28, photo: 'none' },
  { id: 'ats-modern', kind: 'ats', name: { id: 'ATS Modern (Calibri)', en: 'ATS Modern (Calibri)' }, font: F.calibri, base: 14.5, cols: 'one', sideW: 0, accent: '#1F3A5F', head: 'rule-thin', nameSize: 30, photo: 'none' },
  { id: 'ats-serif', kind: 'ats', name: { id: 'ATS Formal (Times)', en: 'ATS Formal (Times)' }, font: F.times, base: 14.5, cols: 'one', sideW: 0, accent: '#111111', head: 'center-rule', nameSize: 28, center: true, photo: 'none' },
  { id: 'ats-ringkas', kind: 'ats', name: { id: 'ATS Ringkas (padat)', en: 'ATS Compact' }, font: F.arial, base: 13.5, cols: 'one', sideW: 0, accent: '#111111', head: 'plain-caps', nameSize: 24, photo: 'none' },
  { id: 'ats-kompetensi', kind: 'ats', name: { id: 'ATS Kompetensi (keahlian di atas)', en: 'ATS Skills-first' }, font: F.calibri, base: 14.5, cols: 'one', sideW: 0, accent: '#2B2B2B', head: 'caps-rule', nameSize: 30, photo: 'none', skillsFirst: true },
  // ── Kreatif: foto, kolom samping, satu warna aksen ──
  { id: 'cr-replika', kind: 'creative', name: { id: 'Kreatif Replika (asli)', en: 'Creative Replica (original)' }, font: F.helv, base: 13, cols: 'side-right', sideW: 268, accent: '#111111', head: 'rule-thick', nameSize: 46, photo: 'rect' },
  { id: 'cr-sidebar', kind: 'creative', name: { id: 'Kreatif Sidebar Gelap', en: 'Creative Dark Sidebar' }, font: F.helv, headFont: F.mont, base: 13, cols: 'side-left', sideW: 236, sideBg: '#1E2A38', sideInk: '#F4F6F8', sideMuted: '#B9C3CE', accent: '#D9A21B', head: 'caps-accent', nameSize: 38, photo: 'circle' },
  { id: 'cr-banner', kind: 'creative', name: { id: 'Kreatif Banner Biru', en: 'Creative Blue Banner' }, font: F.helv, headFont: F.mont, base: 13, cols: 'side-right', sideW: 240, accent: '#1F4E79', head: 'bar', nameSize: 36, photo: 'circle', banner: { bg: '#1F4E79', ink: '#FFFFFF', h: 190, photo: true } },
  { id: 'cr-elegan', kind: 'creative', name: { id: 'Kreatif Elegan (serif)', en: 'Creative Elegant (serif)' }, font: F.times, base: 14, cols: 'side-left', sideW: 230, sideBg: '#F4F1EA', sideInk: '#2A2622', sideMuted: '#6B6258', accent: '#8A6D3B', head: 'center-rule', nameSize: 38, photo: 'circle', banner: { bg: '#FFFFFF', ink: '#2A2622', h: 150, center: true } },
  { id: 'cr-timeline', kind: 'creative', name: { id: 'Kreatif Garis Waktu', en: 'Creative Timeline' }, font: F.helv, headFont: F.mont, base: 13, cols: 'side-right', sideW: 250, accent: '#0F766E', head: 'bar', nameSize: 40, photo: 'circle', timeline: true },
];
export const tplOf = (id?: string) => TEMPLATES.find((t) => t.id === id) || TEMPLATES.find((t) => t.id === 'cr-replika')!;

// Judul bagian standar untuk ATS (dikenali parser)
const ATS_L: Record<Lang, CvModel['L']> = {
  id: { summary: 'Ringkasan Profesional', experience: 'Pengalaman Kerja', contact: 'Kontak', education: 'Pendidikan', skills: 'Keahlian', tools: 'Perangkat Lunak', references: 'Referensi', certs: 'Sertifikasi & Pelatihan', hobbies: 'Minat', orgs: 'Organisasi' },
  en: { summary: 'Professional Summary', experience: 'Work Experience', contact: 'Contact', education: 'Education', skills: 'Skills', tools: 'Software & Tools', references: 'References', certs: 'Certifications & Training', hobbies: 'Interests', orgs: 'Organizations' },
};

type Unit = { g: number; el: ReactNode };

function buildUnits(m: CvModel, hc: boolean, t: Tpl): { main: Unit[]; side: Unit[] } {
  let gid = 0;
  const ats = t.kind === 'ats';
  const L = ats ? ATS_L[m.lang] : m.L;
  const INK = hc ? '#000000' : '#111111';
  const MUTED = hc ? '#000000' : ats ? '#333333' : '#404040';
  const LIGHT = hc || ats ? 400 : 300; // ATS: tanpa bobot tipis (keterbacaan)
  const ACC = hc ? INK : t.accent;
  const S = { ink: t.sideInk && !hc ? t.sideInk : INK, muted: t.sideMuted && !hc ? t.sideMuted : MUTED };
  const dark = !!t.sideBg && t.sideBg !== '#FFFFFF' && t.id === 'cr-sidebar';
  const sideInk = hc && dark ? '#FFFFFF' : S.ink;
  const sideMuted = hc && dark ? '#FFFFFF' : S.muted;
  const B = t.base;

  const Head = ({ children, side }: { children: ReactNode; side?: boolean }) => {
    const ink = side ? sideInk : INK;
    const acc = side ? (dark ? (hc ? '#FFFFFF' : t.accent) : ACC) : ACC;
    const base: CSSProperties = { fontFamily: t.headFont || t.font, fontWeight: 700, lineHeight: 1.2, color: ink, marginBottom: 10 };
    switch (t.head) {
      case 'rule-thick': return <div style={{ ...base, fontSize: hp(24), letterSpacing: 0.6, borderBottom: `${hc ? 4 : 3}px solid ${ink}`, paddingBottom: 6 }}>{children}</div>;
      case 'rule-thin': return <div style={{ ...base, fontSize: hp(B * 1.3), color: acc, borderBottom: `1px solid ${acc}`, paddingBottom: 4 }}>{children}</div>;
      case 'caps-rule': return <div style={{ ...base, fontSize: hp(B * 1.1), letterSpacing: 1.6, textTransform: 'uppercase', borderBottom: `1px solid ${ink}`, paddingBottom: 4 }}>{children}</div>;
      case 'center-rule': return <div style={{ ...base, fontSize: hp(B * 1.08), letterSpacing: 2.2, textTransform: 'uppercase', textAlign: 'center', color: side ? ink : acc, borderBottom: `1px solid ${side ? ink : acc}`, paddingBottom: 4 }}>{children}</div>;
      case 'plain-caps': return <div style={{ ...base, fontSize: hp(B * 1.08), letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
      case 'bar': return <div style={{ ...base, fontSize: hp(B * 1.4), borderLeft: `4px solid ${acc}`, paddingLeft: 10 }}>{children}</div>;
      case 'caps-accent': return (
        <div style={{ ...base, fontSize: hp(B * 1.08), letterSpacing: 2, textTransform: 'uppercase' }}>
          {children}<div aria-hidden style={{ width: 34, height: 3, background: acc, marginTop: 6 }} />
        </div>
      );
    }
  };
  // Butir: ATS pakai karakter teks "•" (terbaca parser), kreatif pakai titik bulat
  const Bullet = ({ text, size = B, side }: { text: string; size?: number; side?: boolean }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '16px minmax(0,1fr)' }}>
      {ats ? <span style={{ fontSize: hp(size) }}>•</span>
        : <span aria-hidden style={{ display: 'block', width: hc ? 7 : 6, height: hc ? 7 : 6, borderRadius: '50%', background: side ? sideInk : t.timeline ? ACC : INK, marginTop: hc ? 6.5 : 7 }} />}
      <div style={{ fontSize: hp(size), overflowWrap: 'anywhere' }}>{text}</div>
    </div>
  );
  // Satu bagian = judul + blok-blok isi. Judul menempel pada blok pertama; "grup" = satu item yang dijaga utuh antarhalaman.
  const sec = (title: string, groups: ReactNode[][], o: { tight?: boolean; side?: boolean; line?: boolean } = {}): Unit[] => groups.flatMap((nodes, gi) => {
    const g0 = ++gid;
    return nodes.map((node, ni) => {
      const pad = ni === nodes.length - 1 ? (ats ? 12 : 16) : o.tight ? 0 : ats ? 3 : 6;
      const body = o.line
        ? ( // garis waktu: garis vertikal + titik di awal tiap pekerjaan
          <div style={{ position: 'relative', borderLeft: `2px solid ${ACC}`, marginLeft: 5, paddingLeft: 16, paddingBottom: pad }}>
            {ni === 0 && <span aria-hidden style={{ position: 'absolute', left: -7, top: 3, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: `3px solid ${ACC}`, boxSizing: 'border-box' }} />}
            {node}
          </div>)
        : <div style={{ paddingBottom: pad }}>{node}</div>;
      return { g: o.tight && ni > 1 ? ++gid : g0, el: <>{gi === 0 && ni === 0 && <Head side={o.side}>{title}</Head>}{body}</> };
    });
  });
  const list = (items: string[], side?: boolean) => items.map((x, i) => <div key={i}><Bullet text={x} side={side} /></div>);
  const inline = (items: string[]) => <div style={{ fontSize: hp(B) }}>{items.join(', ')}</div>; // ATS: daftar keahlian sebagai teks biasa

  const initials = m.name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const photoEl = (kind: 'rect' | 'circle', size: number, ink: string) => (
    <div role="img" aria-label={`Foto ${m.name}`} style={{
      width: size, height: kind === 'rect' ? Math.round(size * 1.46) : size, borderRadius: kind === 'circle' ? '50%' : 0, boxSizing: 'border-box',
      backgroundColor: '#f1f1f1', border: m.photo ? (kind === 'circle' ? `3px solid ${ink === '#FFFFFF' || ink === '#F4F6F8' ? '#FFFFFF' : ACC}` : undefined) : `2px solid ${INK}`,
      backgroundImage: m.photo ? `url("${m.photo}")` : undefined, backgroundSize: 'cover', backgroundPosition: 'center top',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size / 3.3, fontWeight: 700, color: INK,
    }}>{m.photo ? null : initials}</div>
  );

  // ── Kepala dokumen ──
  const header: Unit[] = t.banner ? [] : [{ g: ++gid, el: ats ? (
    <div style={{ paddingBottom: 14, textAlign: t.center ? 'center' : 'left' }}>
      <div style={{ fontSize: hp(t.nameSize), fontWeight: 700, lineHeight: 1.15, color: t.head === 'rule-thin' ? ACC : INK }}>{m.name}</div>
      {m.title && <div style={{ fontSize: hp(B * 1.15), marginTop: 4 }}>{m.title}</div>}
      {m.contact.length > 0 && <div style={{ fontSize: hp(B * .95), marginTop: 6, color: MUTED }}>{m.contact.join('  |  ')}</div>}
    </div>
  ) : (
    <div style={{ paddingBottom: 22 }}>
      <div style={{ fontFamily: t.headFont || t.font, fontSize: hp(t.nameSize), fontWeight: 700, lineHeight: 1.08, letterSpacing: -0.5, overflowWrap: 'anywhere' }}>{m.name}</div>
      {m.title && <div style={{ fontSize: hp(t.nameSize * .55), lineHeight: 1.25, marginTop: 8, fontWeight: LIGHT, color: t.id === 'cr-replika' ? INK : ACC }}>{m.title}</div>}
    </div>
  ) }];

  // ── Blok isi (dipakai semua template) ──
  const summary = m.summary ? sec(L.summary, [[<p style={{ margin: 0, fontSize: hp(B * 1.03), lineHeight: 1.6 }}>{m.summary}</p>]]) : [];
  const jobHead = (j: CvModel['jobs'][number]) => ats ? (
    <div>
      <div style={{ fontWeight: 700, fontSize: hp(B * 1.12) }}>{j.pos}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: hp(B) }}>
        <span><b>{j.company}</b>{j.industry ? `, ${j.industry}` : ''}</span><span style={{ whiteSpace: 'nowrap' }}>{j.period}</span>
      </div>
    </div>
  ) : (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 16, alignItems: 'start' }}>
      <div>
        <div style={{ fontFamily: t.headFont || t.font, fontWeight: 700, fontSize: hp(B * 1.38), lineHeight: 1.2, letterSpacing: 0.3 }}>{j.pos}</div>
        {j.industry && <div style={{ fontSize: hp(B * 1.03), fontWeight: LIGHT }}>{j.industry}</div>}
      </div>
      <div style={{ fontWeight: 700, fontSize: hp(B * .96), textAlign: 'right', textDecoration: t.id === 'cr-replika' ? 'underline' : undefined, color: t.id === 'cr-replika' ? INK : ACC }}><div>{j.company}</div><div>{j.period}</div></div>
    </div>
  );
  const jobs = m.jobs.length ? sec(L.experience, m.jobs.map((j) => [
    jobHead(j),
    ...j.intro.map((x, i) => <div key={`i${i}`} style={{ fontSize: hp(B) }}>{x}</div>),
    ...j.bullets.map((x, i) => <div key={i}><Bullet text={x} /></div>),
  ]), { line: t.timeline }) : [];
  const edu = (side?: boolean) => m.edu.length ? sec(L.education, m.edu.map((e) => [<div>
    <div style={{ fontWeight: 700, fontSize: hp(B * 1.07) }}>{e.head}</div><div style={{ fontWeight: LIGHT }}>{e.school}</div>{e.note && <div style={{ color: side ? sideMuted : MUTED, fontSize: hp(B * .96) }}>{e.note}</div>}
  </div>]), { side }) : [];
  const skills = (side?: boolean) => m.skills.length ? sec(L.skills, ats ? [[inline(m.skills)]] : [list(m.skills, side)], { tight: !ats, side }) : [];
  const tools = (side?: boolean) => m.tools.length ? sec(L.tools, ats ? [[inline(m.tools)]] : [list(m.tools, side)], { tight: !ats, side }) : [];
  const refs = (side?: boolean) => m.refs.length ? sec(L.references, m.refs.map((r) => [<div>
    <div style={{ fontWeight: 700 }}>{r.name}</div>{r.role && <div style={{ fontWeight: LIGHT }}>{r.role}</div>}<div style={{ fontWeight: LIGHT }}>{r.company}</div>{r.note && <div style={{ color: side ? sideMuted : MUTED, fontSize: hp(B * .96) }}>{r.note}</div>}
  </div>]), { side }) : [];
  const certs = (side?: boolean) => m.certs.length ? sec(L.certs, m.certs.map((c) => [
    ats
      ? <div><Bullet text={[c.title, ...c.sub].join(' | ')} /></div>
      : <div><Bullet text={c.title} side={side} />{c.sub.length > 0 && <div style={{ paddingLeft: 16, color: side ? sideMuted : MUTED, fontSize: hp(B * .96) }}>{c.sub.join(' · ')}</div>}</div>,
    ...c.units.map((u, i) => <div key={i} style={{ paddingLeft: 16, fontSize: hp(B * .96) }}>{i + 1}. {u}</div>),
  ]), { side }) : [];
  const hobbies = (side?: boolean) => m.hobbies.length ? sec(L.hobbies, ats ? [[inline(m.hobbies)]] : [list(m.hobbies, side)], { tight: !ats, side }) : [];
  const orgs = (side?: boolean) => m.orgs.length ? sec(L.orgs, m.orgs.map((o) => [
    <div><div style={{ fontWeight: 700 }}>{o.role}</div><div style={{ fontWeight: LIGHT }}>{o.name}</div>{o.period && <div style={{ color: side ? sideMuted : MUTED, fontSize: hp(B * .96) }}>{o.period}</div>}</div>,
    ...o.points.map((x, i) => <div key={i}><Bullet text={x} size={B * .96} side={side} /></div>),
  ]), { side }) : [];

  if (t.cols === 'one') {
    // ATS: urutan kronologis terbalik; varian "kompetensi" menaruh keahlian tepat setelah ringkasan
    const main = t.skillsFirst
      ? [...header, ...summary, ...skills(), ...jobs, ...edu(), ...certs(), ...tools(), ...orgs(), ...refs(), ...hobbies()]
      : [...header, ...summary, ...jobs, ...edu(), ...certs(), ...skills(), ...tools(), ...orgs(), ...refs(), ...hobbies()];
    return { main, side: [] };
  }

  const contact = m.contact.length ? sec(L.contact, [[<div style={{ display: 'grid', rowGap: 6, fontWeight: LIGHT }}>{m.contact.map((c, i) => <div key={i} style={{ overflowWrap: 'anywhere' }}>{c}</div>)}</div>]], { side: true }) : [];
  const sidePhoto: Unit[] = t.photo !== 'none' && !t.banner?.photo
    ? [{ g: ++gid, el: <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 18 }}>{photoEl(t.photo === 'rect' ? 'rect' : 'circle', t.photo === 'rect' ? 186 : 150, sideInk)}</div> }]
    : [];
  const main = [...header, ...summary, ...jobs, ...orgs()];
  // Kontak sudah ada di banner (template banner) → tidak diulang di kolom samping
  const side = [...sidePhoto, ...(t.banner ? [] : contact), ...edu(true), ...skills(true), ...tools(true), ...certs(true), ...refs(true), ...hobbies(true)];
  return { main, side };
}

// Footer permanen di setiap halaman & setiap ekspor (rata kanan)
const FOOTER = { id: 'Lebih lengkap terkait pengalaman dan pencapaian kunjungi : H I K I M O R I .web.id', en: 'For more on my experience and achievements, visit : H I K I M O R I .web.id' };

type PageProps = { main: ReactNode[]; side: ReactNode[]; foot: string; hc: boolean; t: Tpl; first: boolean; m: CvModel };
const Page = ({ main, side, foot, hc, t, first, m }: PageProps) => {
  const ink = hc ? '#000000' : '#111111';
  const band = first && t.banner ? t.banner : undefined;
  const top = band ? band.h + 28 : M;
  const one = t.cols === 'one';
  const sideStyle: CSSProperties = t.sideBg ? { color: hc && t.id === 'cr-sidebar' ? '#FFFFFF' : t.sideInk } : {};
  const cols = one ? 'minmax(0,1fr)' : t.cols === 'side-left' ? `${t.sideW}px minmax(0,1fr)` : `minmax(0,1fr) ${t.sideW}px`;
  const mainCol = <div key="m" style={{ overflow: 'hidden', minHeight: 0 }}><div data-flow="main">{main.map((u, i) => <div key={i}>{u}</div>)}</div></div>;
  const sideCol = <div key="s" style={{ overflow: 'hidden', minHeight: 0, ...sideStyle }}><div data-flow="side">{side.map((u, i) => <div key={i}>{u}</div>)}</div></div>;
  // Latar kolom samping penuh setinggi halaman (sidebar)
  const sideBgW = M + t.sideW + GAP / 2;
  return (
    <div data-page style={{ position: 'relative', width: PAGE_W, height: PAGE_H, overflow: 'hidden', boxSizing: 'border-box', background: '#ffffff', color: ink, fontFamily: t.font, fontSize: hp(t.base), lineHeight: t.kind === 'ats' ? 1.4 : 1.5, letterSpacing: t.kind === 'ats' ? 0 : 0.4 }}>
      {t.sideBg && !one && <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, width: sideBgW, [t.cols === 'side-left' ? 'left' : 'right']: 0, background: hc && t.id !== 'cr-sidebar' ? '#FFFFFF' : t.sideBg }} />}
      {band && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: band.h, background: hc && band.bg !== '#FFFFFF' ? '#000000' : band.bg, color: band.ink, boxSizing: 'border-box', padding: `0 ${M}px`, display: 'flex', alignItems: 'center', justifyContent: band.center ? 'center' : 'space-between', gap: 24, textAlign: band.center ? 'center' : 'left', borderBottom: band.bg === '#FFFFFF' ? `1px solid ${hc ? ink : t.accent}` : undefined }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: t.headFont || t.font, fontSize: hp(t.nameSize), fontWeight: 700, lineHeight: 1.1, letterSpacing: band.center ? 1.5 : -0.5 }}>{m.name}</div>
            {m.title && <div style={{ fontSize: hp(t.base * 1.35), marginTop: 6, opacity: .92, letterSpacing: band.center ? 2 : 0.3, textTransform: band.center ? 'uppercase' : undefined, color: band.center && !hc ? t.accent : undefined }}>{m.title}</div>}
            {band.photo && m.contact.length > 0 && <div style={{ fontSize: hp(t.base * .95), marginTop: 10, opacity: .9 }}>{m.contact.join('  ·  ')}</div>}
            {band.center && m.contact.length > 0 && <div style={{ fontSize: hp(t.base * .95), marginTop: 8 }}>{m.contact.join('  ·  ')}</div>}
          </div>
          {band.photo && (
            <div role="img" aria-label={`Foto ${m.name}`} style={{ flex: '0 0 128px', width: 128, height: 128, borderRadius: '50%', border: '3px solid #FFFFFF', backgroundColor: '#dfe6ee', backgroundImage: m.photo ? `url("${m.photo}")` : undefined, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
          )}
        </div>
      )}
      <div style={{ position: 'absolute', top, right: M, bottom: M + FOOT, left: M, display: 'grid', gridTemplateColumns: cols, gridTemplateRows: 'minmax(0,1fr)', columnGap: GAP }}>
        {one ? mainCol : t.cols === 'side-left' ? [sideCol, mainCol] : [mainCol, sideCol]}
      </div>
      <div style={{ position: 'absolute', left: M, right: M, bottom: M - 22, textAlign: 'right', fontStyle: 'italic', fontWeight: hc ? 400 : 300, fontSize: hp(11), letterSpacing: 0.3, color: hc ? '#000000' : '#8a8a8a', fontFamily: t.font }}>{foot}</div>
    </div>
  );
};

/** Semua halaman CV. Ref menunjuk ke pembungkus; halaman = elemen [data-page] di dalamnya. */
export const CvDocument = forwardRef<HTMLDivElement, { model: CvModel; fontTick: number; hc?: boolean; tpl?: string }>(({ model, fontTick, hc = false, tpl }, ref) => {
  const t = tplOf(tpl);
  const { main, side } = useMemo(() => buildUnits(model, hc, t), [model, hc, t]);
  // objek baru setiap isi/font/kontras/template berubah -> pembagian halaman dihitung ulang dari awal
  const key = useMemo(() => ({}), [model, fontTick, hc, t]); // eslint-disable-line react-hooks/exhaustive-deps
  const root = () => (typeof ref === 'object' && ref ? ref.current : null);
  const mainR = usePagination(main.length, main.map((u) => u.g), key, root, '[data-flow="main"]');
  const sideR = usePagination(side.length, side.map((u) => u.g), key, root, '[data-flow="side"]');
  const n = Math.max(mainR.length, sideR.length, 1);
  return (
    <div ref={ref} style={{ width: PAGE_W, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Array.from({ length: n }, (_, i) => {
        const [a, b] = mainR[i] ?? [main.length, main.length];
        const [c, d] = sideR[i] ?? [side.length, side.length];
        return <div key={i} style={{ boxShadow: '0 4px 18px rgba(0,0,0,.18)' }}><Page t={t} m={model} first={i === 0} hc={hc} foot={FOOTER[model.lang]} main={main.slice(a, b).map((u) => u.el)} side={side.slice(c, d).map((u) => u.el)} /></div>;
      })}
    </div>
  );
});
CvDocument.displayName = 'CvDocument';
