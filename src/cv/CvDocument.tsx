// src/cv/CvDocument.tsx — CV Creative 01 "Replika Referensi" (A4): nama besar kiri, foto & kontak kanan, judul bergaris tebal.
// Margin tepi 1,5 cm (57 px), grid kolom tetap (kiri 1fr, kanan 268 px), teks hitam #111 di atas putih (kontras 18:1, WCAG AA).
// Font keluarga Helvetica: tebal (700) untuk nama/judul, reguler (400) untuk isi, tipis (300 Light) untuk subjudul & keterangan.
// Mode High Contrast: hitam murni #000, tanpa teks abu-abu/tipis, garis & butir lebih tebal.
// Banyak halaman otomatis: tiap kolom dipecah per unit oleh usePagination (data-flow="main" | "side").
import { forwardRef, useMemo, type ReactNode } from 'react';
import type { CvModel } from './cvModel';
import { usePagination } from './usePagination';

export const PAGE_W = 794; // A4 pada 96 dpi
export const PAGE_H = 1123;
const M = 57; // 1,5 cm
const SIDE = 268;
const GAP = 40;
const FOOT = 30; // tinggi area footer di bawah isi (isi berhenti lebih awal, footer di tepi bawah)
// Helvetica Neue/Helvetica bila ada di perangkat (Mac, iPhone); selain itu Arimo (metrik Arial)
export const CV_FONT = '"Helvetica Neue", Helvetica, Arimo, Arial, sans-serif';
// Ukuran huruf kelipatan 0,5 pt supaya sama persis bila nanti diekspor ke Word
const hp = (px: number) => Math.round(px * 1.5) / 1.5;

type Unit = { g: number; el: ReactNode };

function buildUnits(m: CvModel, hc: boolean): { main: Unit[]; side: Unit[] } {
  let gid = 0;
  const INK = hc ? '#000000' : '#111111';
  const MUTED = hc ? '#000000' : '#404040';
  const LIGHT = hc ? 400 : 300; // bobot tipis; High Contrast = reguler agar tegas
  const RULE = hc ? 4 : 3;
  const Head = ({ children }: { children: ReactNode }) => (
    <div style={{ fontWeight: 700, lineHeight: 1.2, fontSize: hp(24), letterSpacing: 0.6, color: INK, borderBottom: `${RULE}px solid ${INK}`, paddingBottom: 6, marginBottom: 10 }}>{children}</div>
  );
  const Bullet = ({ text, size = 13 }: { text: string; size?: number }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '16px minmax(0,1fr)' }}>
      <span aria-hidden style={{ display: 'block', width: hc ? 7 : 6, height: hc ? 7 : 6, borderRadius: '50%', background: INK, marginTop: hc ? 6.5 : 7 }} />
      <div style={{ fontSize: hp(size), overflowWrap: 'anywhere' }}>{text}</div>
    </div>
  );
  // Satu bagian = judul + blok-blok isi. Judul menempel pada blok pertama; "grup" = satu item yang dijaga utuh antarhalaman.
  const sec = (title: string, groups: ReactNode[][], tight = false): Unit[] => groups.flatMap((nodes, gi) => {
    const g0 = ++gid;
    return nodes.map((node, ni) => ({
      g: tight && ni > 1 ? ++gid : g0,
      el: <>{gi === 0 && ni === 0 && <Head>{title}</Head>}<div style={{ paddingBottom: ni === nodes.length - 1 ? 16 : tight ? 0 : 6 }}>{node}</div></>,
    }));
  });
  const list = (items: string[]) => items.map((t, i) => <div key={i}><Bullet text={t} /></div>);

  const initials = m.name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const photo = (
    <div role="img" aria-label={`Foto ${m.name}`} style={{
      width: 186, height: 272, boxSizing: 'border-box', backgroundColor: '#f1f1f1', border: m.photo ? undefined : `2px solid ${INK}`,
      backgroundImage: m.photo ? `url("${m.photo}")` : undefined, backgroundSize: 'cover', backgroundPosition: 'center top',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 700, color: INK,
    }}>{m.photo ? null : initials}</div>
  );

  const main: Unit[] = [
    { g: ++gid, el: (
      <div style={{ paddingBottom: 24 }}>
        <div style={{ fontSize: hp(46), fontWeight: 700, lineHeight: 1.08, letterSpacing: -1, overflowWrap: 'anywhere' }}>{m.name}</div>
        {m.title && <div style={{ fontSize: hp(26), lineHeight: 1.25, marginTop: 8, fontWeight: LIGHT }}>{m.title}</div>}
      </div>
    ) },
    ...(m.summary ? sec(m.L.summary, [[<p style={{ margin: 0, fontSize: hp(13.5), lineHeight: 1.6 }}>{m.summary}</p>]]) : []),
    ...(m.jobs.length ? sec(m.L.experience, m.jobs.map((j) => [
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', columnGap: 16, alignItems: 'start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: hp(18), lineHeight: 1.2, letterSpacing: 0.3 }}>{j.pos}</div>
          {j.industry && <div style={{ fontSize: hp(13.5), fontWeight: LIGHT }}>{j.industry}</div>}
        </div>
        <div style={{ fontWeight: 700, fontSize: hp(12.5), textAlign: 'right', textDecoration: 'underline' }}><div>{j.company}</div><div>{j.period}</div></div>
      </div>,
      ...j.intro.map((t, i) => <div key={`i${i}`} style={{ fontSize: hp(13) }}>{t}</div>),
      ...j.bullets.map((t, i) => <div key={i}><Bullet text={t} /></div>),
    ])) : []),
  ];

  const side: Unit[] = [
    { g: ++gid, el: <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 18 }}>{photo}</div> },
    ...(m.contact.length ? sec(m.L.contact, [[<div style={{ display: 'grid', rowGap: 6, fontWeight: LIGHT }}>{m.contact.map((c, i) => <div key={i} style={{ overflowWrap: 'anywhere' }}>{c}</div>)}</div>]]) : []),
    ...(m.edu.length ? sec(m.L.education, m.edu.map((e) => [<div>
      <div style={{ fontWeight: 700, fontSize: hp(14) }}>{e.head}</div><div style={{ fontWeight: LIGHT }}>{e.school}</div>{e.note && <div style={{ color: MUTED, fontSize: hp(12.5) }}>{e.note}</div>}
    </div>])) : []),
    ...(m.skills.length ? sec(m.L.skills, [list(m.skills)], true) : []),
    ...(m.tools.length ? sec(m.L.tools, [list(m.tools)], true) : []),
    ...(m.refs.length ? sec(m.L.references, m.refs.map((r) => [<div>
      <div style={{ fontWeight: 700 }}>{r.name}</div>{r.role && <div style={{ fontWeight: LIGHT }}>{r.role}</div>}<div style={{ fontWeight: LIGHT }}>{r.company}</div>{r.note && <div style={{ color: MUTED, fontSize: hp(12.5) }}>{r.note}</div>}
    </div>])) : []),
    ...(m.certs.length ? sec(m.L.certs, m.certs.map((c) => [
      <div><Bullet text={c.title} size={13} />
        {c.sub.length > 0 && <div style={{ paddingLeft: 16, color: MUTED, fontSize: hp(12.5) }}>{c.sub.join(' · ')}</div>}</div>,
      ...c.units.map((u, i) => <div key={i} style={{ paddingLeft: 16, fontSize: hp(12.5) }}>{i + 1}. {u}</div>),
    ])) : []),
    ...(m.hobbies.length ? sec(m.L.hobbies, [list(m.hobbies)], true) : []),
    ...(m.orgs.length ? sec(m.L.orgs, m.orgs.map((o) => [
      <div><div style={{ fontWeight: 700 }}>{o.role}</div><div style={{ fontWeight: LIGHT }}>{o.name}</div>{o.period && <div style={{ color: MUTED, fontSize: hp(12.5) }}>{o.period}</div>}</div>,
      ...o.points.map((t, i) => <div key={i}><Bullet text={t} size={12.5} /></div>),
    ])) : []),
  ];
  return { main, side };
}

// Footer permanen di setiap halaman & setiap ekspor
const FOOTER = { id: 'Lebih lengkap terkait pengalaman dan pencapaian kunjungi : H I K I M O R I .web.id', en: 'For more on my experience and achievements, visit : H I K I M O R I .web.id' };

const Page = ({ main, side, ink, foot, hc }: { main: ReactNode[]; side: ReactNode[]; ink: string; foot: string; hc: boolean }) => (
  <div data-page style={{ position: 'relative', width: PAGE_W, height: PAGE_H, overflow: 'hidden', boxSizing: 'border-box', background: '#ffffff', color: ink, fontFamily: CV_FONT, fontSize: hp(13), lineHeight: 1.5, letterSpacing: 0.4 }}>
    <div style={{ position: 'absolute', top: M, right: M, bottom: M + FOOT, left: M, display: 'grid', gridTemplateColumns: `minmax(0,1fr) ${SIDE}px`, gridTemplateRows: 'minmax(0,1fr)', columnGap: GAP }}>
      <div style={{ overflow: 'hidden', minHeight: 0 }}><div data-flow="main">{main.map((u, i) => <div key={i}>{u}</div>)}</div></div>
      <div style={{ overflow: 'hidden', minHeight: 0 }}><div data-flow="side">{side.map((u, i) => <div key={i}>{u}</div>)}</div></div>
    </div>
    <div style={{ position: 'absolute', left: M, right: M, bottom: M - 22, textAlign: 'center', fontStyle: 'italic', fontWeight: hc ? 400 : 300, fontSize: hp(11), letterSpacing: 0.3, color: hc ? '#000000' : '#8a8a8a' }}>{foot}</div>
  </div>
);

/** Semua halaman CV. Ref menunjuk ke pembungkus; halaman = elemen [data-page] di dalamnya. */
export const CvDocument = forwardRef<HTMLDivElement, { model: CvModel; fontTick: number; hc?: boolean }>(({ model, fontTick, hc = false }, ref) => {
  const { main, side } = useMemo(() => buildUnits(model, hc), [model, hc]);
  // objek baru setiap isi/font/kontras berubah -> pembagian halaman dihitung ulang dari awal
  const key = useMemo(() => ({}), [model, fontTick, hc]); // eslint-disable-line react-hooks/exhaustive-deps
  const root = () => (typeof ref === 'object' && ref ? ref.current : null);
  const mainR = usePagination(main.length, main.map((u) => u.g), key, root, '[data-flow="main"]');
  const sideR = usePagination(side.length, side.map((u) => u.g), key, root, '[data-flow="side"]');
  const n = Math.max(mainR.length, sideR.length, 1);
  return (
    <div ref={ref} style={{ width: PAGE_W, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Array.from({ length: n }, (_, i) => {
        const [a, b] = mainR[i] ?? [main.length, main.length];
        const [c, d] = sideR[i] ?? [side.length, side.length];
        return <div key={i} style={{ boxShadow: '0 4px 18px rgba(0,0,0,.18)' }}><Page ink={hc ? '#000000' : '#111111'} hc={hc} foot={FOOTER[model.lang]} main={main.slice(a, b).map((u) => u.el)} side={side.slice(c, d).map((u) => u.el)} /></div>;
      })}
    </div>
  );
});
CvDocument.displayName = 'CvDocument';
