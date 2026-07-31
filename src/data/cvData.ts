// src/data/cvData.ts
// Sumber data CV terpusat & bilingual (ID/EN), disinkronkan 1:1 dengan
// "Mahfud Febry Styanto - Curriculum Vitae" (versi terbaru).
// Dipakai bersama oleh Home.tsx & About.tsx supaya konten selalu konsisten.

export interface Bi { id: string; en: string; }

export const PROFILE = {
  name: 'Mahfud Febry Styanto, S.Kom., CHRG',
  title: { id: 'Sumber Daya Manusia & Administrasi', en: 'Human Resources & Administration' } as Bi,
  location: 'Nganjuk, Jawa Timur, Indonesia',
  email: 'Mahfudfebrys@gmail.com',
  phone: '0822-3465-1413',
  website: 'hikimori.web.id',
  summary: {
    id: 'Profesional multidisiplin di bidang HRD, Payroll, General Affairs, IT Support, FMCG, dan Administrasi Operasional dengan pengalaman nyata di industri manufaktur. Telah melewati perjalanan lintas divisi dalam satu perusahaan pada periode berbeda, sebagai bukti loyalitas dan kepercayaan yang diberikan atas pencapaian di setiap peran. Kompeten dalam payroll, analisa beban kerja, BPJS, pengelolaan 100+ perangkat IT, serta koordinasi operasional. Bersertifikat BNSP CHRG, S.Kom., IPK 3.39.',
    en: 'A multidisciplinary professional in the fields of HRD, Payroll, General Affairs, IT Support, FMCG, and Operational Administration with hands-on experience in the manufacturing industry. Has held cross-departmental roles within the same company at different times, demonstrating loyalty and the trust placed in me based on my achievements in each role. Competent in payroll, workload analysis, BPJS, managing over 100 IT devices, and operational coordination. BNSP CHRG certified, S.Kom., GPA 3.39.',
  } as Bi,
};

/* ─── Education (baru — sesuai CV) ─── */
export const EDUCATION = {
  degree: { id: 'Teknik Informatika', en: 'Informatics Engineering' } as Bi,
  gpa: 'GPA 3.39',
  school: 'Institut Teknologi & Bisnis ASIA Malang',
  note: { id: '[ Kelas Karyawan ]', en: '[ Employee Class ]' } as Bi,
};

/* ─── Tools and Apps (baru — sesuai CV) ─── */
export const TOOLS: string[] = [
  'Microsoft Excel, Word, Power Point',
  'Google Workspace — Sheets, Docs, Forms',
  'OSS Platform',
  'ERP / SaaS (Self-Developed)',
  'AI Automation & Optimation',
  'Mikrotik & Wireshark',
  'Adobe Photoshop',
  'Capcut Video Editor',
  'Olsera POS System',
  'SIPP BPJS Ketenagakerjaan',
  'e-Dabu BPJS Kesehatan',
];

/* ─── Skills & Expertise ringkas (daftar chip resmi dari CV) ─── */
export const CV_SKILL_TAGS: Bi[] = [
  { id: 'Administrasi Payroll', en: 'Payroll Administration' },
  { id: 'IT Troubleshooting', en: 'IT Troubleshooting' },
  { id: 'Analisa KPI', en: 'KPI Analysis' },
  { id: 'Resolusi Konflik', en: 'Conflict Resolution' },
  { id: 'Dukungan Jaringan', en: 'Network Support' },
  { id: 'Kemampuan Kepemimpinan', en: 'Leadership Skills' },
  { id: 'Pemecahan Masalah', en: 'Problem Solving' },
  { id: 'Manajemen Waktu', en: 'Time Management' },
  { id: 'Relasi Vendor', en: 'Vendor Relation' },
  { id: 'Hubungan Masyarakat', en: 'Public Relation' },
];

/* ─── Training & License (baru — menggantikan sertifikasi generik lama) ─── */
export interface TrainingItem { id: string; name: Bi; issuer: string; subtitle?: Bi; year: string; }
export const TRAINING_LICENSE: TrainingItem[] = [
  {
    id: 't1',
    name: { id: 'Certified Human Resources Generalist (CHRG)', en: 'Certified Human Resources Generalist (CHRG)' },
    issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
    year: '2026 – 2029',
  },
  {
    id: 't2',
    name: { id: 'Menyusun Uraian Jabatan', en: 'Preparing Job Descriptions' },
    issuer: 'Training MSDM — Cipta Innovasi Unggul',
    subtitle: { id: 'M.70SDM01.010.2', en: 'M.70SDM01.010.2' },
    year: '2025',
  },
  {
    id: 't3',
    name: { id: 'Melakukan Administrasi Jaminan Sosial', en: 'Administering Social Security (BPJS)' },
    issuer: 'Training MSDM — Cipta Innovasi Unggul',
    subtitle: { id: 'M.70SDM01.058.2', en: 'M.70SDM01.058.2' },
    year: '2025',
  },
  {
    id: 't4',
    name: { id: 'Melakukan Analisis Beban Kerja', en: 'Conducting Workload Analysis' },
    issuer: 'Training MSDM — Cipta Innovasi Unggul',
    subtitle: { id: 'M.70SDM01.011.2', en: 'M.70SDM01.011.2' },
    year: '2025',
  },
  {
    id: 't5',
    name: { id: 'Administrasi Penerapan Kebijakan MSDM', en: 'HR Policy Implementation Administration' },
    issuer: 'Training MSDM — Cipta Innovasi Unggul',
    subtitle: { id: 'M.70SDM01.059.2', en: 'M.70SDM01.059.2' },
    year: '2025',
  },
  {
    id: 't6',
    name: { id: 'Certified Excel for Administration', en: 'Certified Excel for Administration' },
    issuer: 'Jobstreet',
    year: '2024',
  },
];

/* ─── Hobby (baru) ─── */
export const HOBBIES: Bi[] = [
  { id: 'Riset Otomasi AI', en: 'AI Automation Research' },
  { id: 'Coding / Web Developer', en: 'Web Developer Coding' },
  { id: 'Penulisan Konten', en: 'Content Writer' },
  { id: 'Proyek Pengabdian Masyarakat', en: 'Community Service Project' },
];

/* ─── Organizational Experience (baru) ─── */
export const ORG_EXPERIENCE = {
  role: 'PANGLIMA',
  org: { id: 'Paguyuban Mahasiswa Nganjuk Kuliah di Malang', en: 'Paguyuban Mahasiswa Nganjuk Kuliah di Malang (Nganjuk Students Association in Malang)' } as Bi,
  position: { id: 'Kepala Divisi Humas Internal', en: 'Head of Internal Public Relations Division' } as Bi,
  points: [
    { id: 'Menangani Konflik Organisasi Internal', en: 'Handling Internal Organizational Conflict' },
    { id: 'Menjaga Solidaritas Anggota', en: 'Maintaining Member Solidarity' },
    { id: 'Pengembangan Karakter & Soft Skills Anggota', en: 'Character Development and Soft Skills of Members' },
    { id: 'Pusat Distribusi & Manajemen Informasi Organisasi', en: 'Organizational Information Distribution and Management Center' },
  ] as Bi[],
};

/* ─── References (baru) ─── */
export const REFERENCES = [
  {
    id: 'r1',
    name: 'Aldy Bachtiyar',
    role: { id: 'General Manager', en: 'General Manager' } as Bi,
    company: 'UD Duta Pangan',
    note: { id: 'No Surat Referensi Kerja: No. 078/SR-HRD/UDP/06/2026', en: 'Work Reference Letter No. 078/SR-HRD/UDP/06/2026' } as Bi,
  },
];
