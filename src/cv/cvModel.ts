// src/cv/cvModel.ts — mengubah konten CMS (SiteContent) + pilihan centang + bahasa menjadi isi CV.
// Data selalu dibaca dari konten live situs, jadi CV otomatis ikut berubah saat Anda mengedit di /admin.
import type { Bi, Certificate, Experience, SiteContent } from '../content/types';
import type { Lang } from '../contexts/LanguageContext';
import { RELEVANT, fmtPeriod, fmtRange, sortExp } from '../content/derive';

// ============================================================
// SECTION: Pilihan pengguna (centang)
// ============================================================
export type SecKey = 'summary' | 'contact' | 'photo' | 'education' | 'skills' | 'tools' | 'references' | 'hobbies' | 'organizations' | 'units';
export type Choice = { on: Record<string, boolean>; sec: Record<SecKey, boolean> };

export const SEC_LABEL: Record<SecKey, Bi> = {
  summary: { id: 'Ringkasan', en: 'Summary' }, contact: { id: 'Kontak', en: 'Contact' }, photo: { id: 'Foto', en: 'Photo' },
  education: { id: 'Pendidikan', en: 'Education' }, skills: { id: 'Keahlian', en: 'Skills' }, tools: { id: 'Alat & aplikasi', en: 'Tools & apps' },
  references: { id: 'Referensi', en: 'References' }, hobbies: { id: 'Hobi', en: 'Hobbies' }, organizations: { id: 'Organisasi', en: 'Organizations' },
  units: { id: 'Rincian unit kompetensi sertifikat', en: 'Certificate competency units' },
};
export const SEC_DEFAULT: Record<SecKey, boolean> = {
  summary: true, contact: true, photo: true, education: true, skills: true, tools: true, references: true, hobbies: true, organizations: true, units: false,
};

// Bawaan: 4 pengalaman relevan (HR / IT / Operasional) terbaru agar CV ringkas, semua lisensi & sertifikat, tanpa pelatihan.
// Item baru dari CMS mengikuti aturan ini; semuanya bebas dicentang ulang.
export const expKey = (e: Experience) => `exp:${e.id}`;
export const certKey = (c: Certificate) => `cert:${c.id}`;
export const DEFAULT_EXP_COUNT = 4;
export const defaultExpIds = (list: Experience[]): Set<string> =>
  new Set(sortExp(list).filter((e) => RELEVANT.includes(e.category)).slice(0, DEFAULT_EXP_COUNT).map((e) => e.id));
export const defaultOnCert = (c: Certificate) => c.category !== 'training';
export const isOn = (ch: Choice, key: string, def: boolean) => (key in ch.on ? ch.on[key] : def);

export const selectedExp = (c: SiteContent, ch: Choice) => {
  const def = defaultExpIds(c.experience);
  return sortExp(c.experience).filter((e) => isOn(ch, expKey(e), def.has(e.id)));
};
export const selectedCerts = (c: SiteContent, ch: Choice) => c.certificates.filter((x) => isOn(ch, certKey(x), defaultOnCert(x)));

// ============================================================
// SECTION: Teks dwibahasa + terjemahan otomatis
// ============================================================
export type Tmap = Record<string, string>;
const MARK = /^(\s*[•\-*–]\s*)?(.*)$/;
const body = (l: string) => (MARK.exec(l) as RegExpExecArray)[2].trim();
export const linesOf = (t: string) => t.split('\n').map(body).filter(Boolean);
/** Terjemahkan per baris (penanda butir dipertahankan) memakai peta terjemahan. */
export const tLines = (t: string, map: Tmap) => t.split('\n').map((l) => {
  const m = MARK.exec(l) as RegExpExecArray;
  const b = m[2].trim();
  return b ? (m[1] ?? '') + (map[b] ?? b) : l;
}).join('\n');
console.assert(tLines('• satu\nbaris dua', { satu: 'one', 'baris dua': 'line two' }) === '• one\nline two' && linesOf('• a\n\n- b').join('|') === 'a|b', 'tLines/linesOf');

/** Bahasa Inggris belum diisi di CMS (kosong, atau sama persis dengan Indonesia karena disalin otomatis). */
export const needsEn = (b?: Bi) => !!b && !!b.id.trim() && (!b.en.trim() || b.en.trim() === b.id.trim());
export const biText = (b: Bi | undefined, lang: Lang, map: Tmap): string => {
  if (!b) return '';
  if (lang === 'id') return b.id || b.en;
  return needsEn(b) ? tLines(b.id, map) : b.en || b.id;
};

// Semua teks dwibahasa yang dipakai CV (untuk daftar yang perlu diterjemahkan)
function usedBis(c: SiteContent, ch: Choice): Bi[] {
  const s = ch.sec;
  const out: Bi[] = [];
  out.push(c.profile.title);
  if (s.summary) out.push(c.profile.summary);
  selectedExp(c, ch).forEach((e) => out.push(e.position, e.industry, e.desc));
  if (s.education) c.education.items.forEach((e) => out.push(e.level, e.major));
  if (s.skills) c.skills.forEach((k) => out.push(k.name));
  if (s.hobbies) out.push(...c.profile.hobbies);
  if (s.references) c.references.forEach((r) => out.push(r.role, r.note));
  if (s.organizations) c.organizations.forEach((o) => out.push(o.name, o.role, ...o.points));
  selectedCerts(c, ch).forEach((x) => { out.push(x.name); if (s.units) out.push(...x.units); });
  return out;
}
export const missingTexts = (c: SiteContent, ch: Choice): string[] =>
  [...new Set(usedBis(c, ch).filter(needsEn).flatMap((b) => linesOf(b.id)))];

// ============================================================
// SECTION: Model CV
// ============================================================
export type CvModel = {
  lang: Lang; name: string; title: string; summary: string; photo: string; contact: string[];
  jobs: { pos: string; company: string; industry: string; period: string; intro: string[]; bullets: string[] }[];
  edu: { head: string; school: string; note: string }[];
  skills: string[]; tools: string[];
  refs: { name: string; role: string; company: string; note: string }[];
  certs: { title: string; sub: string[]; units: string[] }[];
  hobbies: string[];
  orgs: { role: string; name: string; period: string; points: string[] }[];
  L: Record<'summary' | 'experience' | 'contact' | 'education' | 'skills' | 'tools' | 'references' | 'certs' | 'hobbies' | 'orgs', string>;
};

export const LABELS: Record<Lang, CvModel['L']> = {
  id: { summary: 'Ringkasan', experience: 'Pengalaman Kerja', contact: 'Kontak', education: 'Pendidikan', skills: 'Keahlian', tools: 'Alat & Aplikasi', references: 'Referensi', certs: 'Pelatihan & Lisensi', hobbies: 'Hobi', orgs: 'Pengalaman Organisasi' },
  en: { summary: 'Summary', experience: 'Work Experience', contact: 'Contact', education: 'Education', skills: 'Skills and Expertise', tools: 'Tools and Apps', references: 'References', certs: 'Training License', hobbies: 'Hobby', orgs: 'Organizational experience' },
};

/** Deskripsi kerja: baris ber-"•" = butir; baris biasa = kalimat pembuka. Tanpa penanda sama sekali = tiap baris jadi butir. */
export const splitDesc = (t: string): { intro: string[]; bullets: string[] } => {
  const lines = t.split('\n').map((l) => l.trim()).filter(Boolean);
  const marked = lines.filter((l) => MARK.exec(l)?.[1]);
  return marked.length ? { intro: lines.filter((l) => !MARK.exec(l)?.[1]), bullets: marked.map(body) } : { intro: [], bullets: lines };
};
console.assert(splitDesc('Buka\n• a\n• b').bullets.length === 2 && splitDesc('x\ny').bullets.length === 2 && splitDesc('x\ny').intro.length === 0, 'splitDesc');

// Penyingkat khusus CV (data di situs tidak berubah): HRD menaungi HR, General Affairs, Personalia, Recruitment, dll
const cvPos = (t: string) => t.replace(/Human Resources? Development(\s*\/\s*General Affairs)?/i, 'HRD');
const cvCompany = (t: string) => t.replace(/^(ARCHIMAX Architect)\s+Indonesia$/i, '$1');
console.assert(cvPos('Human Resource Development / General Affairs') === 'HRD' && cvCompany('ARCHIMAX Architect Indonesia') === 'ARCHIMAX Architect' && cvCompany('PT. Richeese Kuliner Indonesia') === 'PT. Richeese Kuliner Indonesia', 'cvPos/cvCompany');

export function buildModel(c: SiteContent, ch: Choice, lang: Lang, map: Tmap, photo: string): CvModel {
  const s = ch.sec;
  const T = (b?: Bi) => biText(b, lang, map);
  const p = c.profile;
  const edu = s.education ? c.education.items.map((e) => ({
    head: `${[T(e.level), T(e.major)].filter(Boolean).join(' ')}${e.gpa ? `, ${lang === 'en' ? 'GPA' : 'IPK'} ${e.gpa}` : ''}`,
    school: e.school,
    note: [e.location, e.start || e.end ? fmtPeriod(e.start, e.end, lang) : ''].filter(Boolean).join(' · '),
  })) : [];
  return {
    lang, name: p.name, title: T(p.title), summary: s.summary ? T(p.summary) : '', photo: s.photo ? photo : '',
    contact: s.contact ? [p.email, p.phone, p.website, p.location].filter(Boolean) : [],
    jobs: selectedExp(c, ch).map((e) => ({ pos: cvPos(T(e.position)), company: cvCompany(e.company), industry: T(e.industry), period: fmtPeriod(e.start, e.end, lang), ...splitDesc(T(e.desc)) })),
    edu,
    skills: s.skills ? c.skills.map((k) => T(k.name)).filter(Boolean) : [],
    tools: s.tools ? c.tools.map((t) => t.name).filter(Boolean) : [],
    refs: s.references ? c.references.map((r) => ({ name: r.name, role: T(r.role), company: r.company, note: T(r.note) })) : [],
    certs: selectedCerts(c, ch).map((x) => ({
      title: T(x.name),
      sub: [x.issuer, x.year && fmtRange(x.year, lang), x.code].filter(Boolean) as string[],
      units: s.units ? x.units.map((u) => T(u)).filter(Boolean) : [],
    })),
    hobbies: s.hobbies ? p.hobbies.map((h) => T(h)).filter(Boolean) : [],
    orgs: s.organizations ? c.organizations.map((o) => ({ role: T(o.role), name: T(o.name), period: o.period, points: o.points.map((x) => T(x)).filter(Boolean) })) : [],
    L: LABELS[lang],
  };
}
