// src/content/derive.ts — helper hitungan tanggal & teks yang dipakai banyak halaman.
import type { Bi, Experience, SiteContent } from './types';
import type { Lang } from '../contexts/LanguageContext';

export const pick = (b: Bi | undefined, lang: Lang): string => (b ? (lang === 'en' ? b.en || b.id : b.id || b.en) : '');

const MONTHS = {
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const parseYM = (s: string): number | null => {
  const m = /^(\d{4})-(\d{1,2})$/.exec((s || '').trim());
  return m ? Number(m[1]) * 12 + (Number(m[2]) - 1) : null;
};
const nowYM = () => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); };

/** Jumlah bulan inklusif. end kosong = sampai bulan ini. */
export const monthsOf = (start: string, end: string): number => {
  const a = parseYM(start); const b = end ? parseYM(end) : nowYM();
  if (a === null || b === null || b < a) return 0;
  return b - a + 1;
};

export const fmtYM = (s: string, lang: Lang): string => {
  const v = parseYM(s); if (v === null) return s || '';
  return `${MONTHS[lang][v % 12]} ${Math.floor(v / 12)}`;
};

/** Pemisah rentang tanggal tanpa garis: "Okt 2023 s.d. Jan 2024" / "Oct 2023 to Jan 2024". */
export const rangeSep = (lang: Lang) => (lang === 'en' ? ' to ' : ' s.d. ');

export const fmtPeriod = (start: string, end: string, lang: Lang): string => {
  const a = fmtYM(start, lang); const b = end ? fmtYM(end, lang) : (lang === 'en' ? 'Present' : 'Sekarang');
  return a ? `${a}${rangeSep(lang)}${b}` : b;
};

export const fmtDuration = (months: number, lang: Lang, short = false): string => {
  const y = Math.floor(months / 12), m = months % 12;
  if (short) {
    const parts = [y ? `${y}${lang === 'en' ? 'y' : 'th'}` : '', m ? `${m}${lang === 'en' ? 'm' : 'bln'}` : ''];
    return parts.filter(Boolean).join(' ') || '0';
  }
  const yl = lang === 'en' ? (y > 1 ? 'Years' : 'Year') : 'Tahun';
  const ml = lang === 'en' ? (m > 1 ? 'Months' : 'Month') : 'Bulan';
  return [y ? `${y} ${yl}` : '', m ? `${m} ${ml}` : ''].filter(Boolean).join(' ') || '—';
};

/** Total masa kerja tanpa menghitung ganda periode yang tumpang-tindih. */
export const careerMonths = (exps: Experience[]): number => {
  const ranges = exps
    .map(e => [parseYM(e.start), e.end ? parseYM(e.end) : nowYM()] as const)
    .filter((r): r is readonly [number, number] => r[0] !== null && r[1] !== null && r[1] >= r[0])
    .sort((a, b) => a[0] - b[0]);
  let total = 0, cs = -1, ce = -2;
  for (const [s, e] of ranges) {
    if (s > ce + 1) { if (ce >= cs && cs >= 0) total += ce - cs + 1; cs = s; ce = e; }
    else ce = Math.max(ce, e);
  }
  if (cs >= 0) total += ce - cs + 1;
  return total;
};

/** Rentang kalender dari mulai kerja pertama sampai akhir kerja terakhir (termasuk jeda). */
export const calendarSpanMonths = (exps: Experience[]): number => {
  const s = exps.map(e => parseYM(e.start)).filter((v): v is number => v !== null);
  const e = exps.map(x => (x.end ? parseYM(x.end) : nowYM())).filter((v): v is number => v !== null);
  return s.length && e.length ? Math.max(...e) - Math.min(...s) + 1 : 0;
};

/** Periode menganggur (tidak ada pekerjaan sama sekali) — TIDAK dihitung di careerMonths. */
export const careerGaps = (exps: Experience[]): { start: string; end: string; months: number }[] => {
  const ranges = exps
    .map(e => [parseYM(e.start), e.end ? parseYM(e.end) : nowYM()] as const)
    .filter((r): r is readonly [number, number] => r[0] !== null && r[1] !== null && r[1] >= r[0])
    .sort((a, b) => a[0] - b[0]);
  const toYM = (v: number) => `${Math.floor(v / 12)}-${String((v % 12) + 1).padStart(2, '0')}`;
  const gaps: { start: string; end: string; months: number }[] = [];
  let ce = -Infinity;
  for (const [s, e] of ranges) {
    if (ce !== -Infinity && s > ce + 1) gaps.push({ start: toYM(ce + 1), end: toYM(s - 1), months: s - ce - 1 });
    ce = Math.max(ce, e);
  }
  return gaps;
};

/** Urutkan pengalaman dari yang terbaru. */
export const sortExp = (exps: Experience[]): Experience[] =>
  [...exps].sort((a, b) => (parseYM(b.start) ?? 0) - (parseYM(a.start) ?? 0));

export const CATEGORY_LABEL: Record<Experience['category'], Bi> = {
  hr: { id: 'HR & Administrasi', en: 'HR & Administration' },
  it: { id: 'IT Support', en: 'IT Support' },
  ops: { id: 'Operasional', en: 'Operations' },
  other: { id: 'Lainnya', en: 'Others' },
};

/** Kategori yang dianggap "pengalaman profesional / relevan" (pekerjaan lapangan & part-time = 'other'). */
export const RELEVANT: Experience['category'][] = ['hr', 'it', 'ops'];
export const relevantExp = (exps: Experience[]) => exps.filter(e => RELEVANT.includes(e.category));

/** Persentase masa kerja per kategori (untuk pill di dashboard). */
export const categoryShare = (exps: Experience[], keys: Experience['category'][] = ['hr', 'it', 'ops', 'other']) => {
  const sums = keys.map(k => exps.filter(e => e.category === k).reduce((a, e) => a + monthsOf(e.start, e.end), 0));
  const all = sums.reduce((a, b) => a + b, 0) || 1;
  return keys.map((k, i) => ({ key: k, months: sums[i], pct: Math.round((sums[i] / all) * 100) }));
};

const MONTH_INDEX: Record<string, number> = {
  jan: 0, januari: 0, january: 0, feb: 1, februari: 1, february: 1, mar: 2, maret: 2, march: 2, apr: 3, april: 3,
  mei: 4, may: 4, jun: 5, juni: 5, june: 5, jul: 6, juli: 6, july: 6, agu: 7, agustus: 7, aug: 7, august: 7,
  sep: 8, september: 8, okt: 9, oktober: 9, oct: 9, october: 9, nov: 10, november: 10, des: 11, desember: 11, dec: 11, december: 11,
};

/** Tanggal lahir dari teks "12 Februari 2000" / "2000-02-12"; null kalau tidak lengkap. */
export const parseBirth = (birthDate: string): Date | null => {
  const s = (birthDate || '').trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(s);
  if (m && MONTH_INDEX[m[2].toLowerCase()] !== undefined) return new Date(Number(m[3]), MONTH_INDEX[m[2].toLowerCase()], Number(m[1]));
  return null;
};

/** Usia tepat (memperhitungkan sudah/belum ulang tahun) bila tanggal lahir diisi. */
export const ageOf = (birthYear: number, birthDate = ''): number => {
  const now = new Date();
  const b = parseBirth(birthDate);
  if (b) {
    let a = now.getFullYear() - b.getFullYear();
    if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
    return a;
  }
  return birthYear ? now.getFullYear() - birthYear : 0;
};

/** Pecah teks menjadi baris bullet / paragraf. */
export const lines = (text: string) =>
  (text || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => ({ bullet: l.startsWith('•') || l.startsWith('-'), text: l.replace(/^[•-]\s*/, '') }));

export const paragraphs = (text: string) => (text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

export const waLink = (c: SiteContent, lang: Lang) =>
  `https://wa.me/${c.profile.whatsapp}?text=${encodeURIComponent(pick(c.contact.waTemplate, lang))}`;
