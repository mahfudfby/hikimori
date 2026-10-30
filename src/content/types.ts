// src/content/types.ts
// Model konten situs — SATU dokumen JSON yang diedit lewat CMS (/admin)
// dan dibaca semua halaman. Teks yang tampil ke pengunjung bersifat
// bilingual (Bi = { id, en }).

export interface Bi { id: string; en: string; }

export type ExpCategory = 'hr' | 'it' | 'ops' | 'other';

export interface Experience {
  id: string;
  position: Bi;
  company: string;
  industry: Bi;
  location: string;
  /** 'YYYY-MM' */
  start: string;
  /** 'YYYY-MM' — kosong = masih bekerja sampai sekarang */
  end: string;
  type: string;
  category: ExpCategory;
  logoUrl: string;
  tags: string[];
  /** Deskripsi kerja; baris diawali "•" tampil sebagai bullet */
  desc: Bi;
}

export interface Education {
  id: string;
  level: Bi;
  school: string;
  major: Bi;
  location: string;
  start: string;
  end: string;
  gpa: string;
  logoUrl: string;
  note: Bi;
  /** Cerita singkat selama menempuh pendidikan ini */
  story: Bi;
  thesis: Bi;
  courses: string[];
  highlights: Bi[];
}

export interface JourneyStep {
  id: string;
  year: string;
  title: Bi;
  desc: Bi;
}

export interface Organization {
  id: string;
  name: Bi;
  role: Bi;
  period: string;
  points: Bi[];
}

export type CertCategory = 'license' | 'training' | 'cert';

export interface Certificate {
  id: string;
  name: Bi;
  issuer: string;
  code: string;
  category: CertCategory;
  year: string;
  imageUrl: string;
  credentialUrl: string;
  desc: Bi;
  /** Unit kompetensi / materi yang dipelajari (tampil sebagai daftar di kartu sertifikat) */
  units: Bi[];
}

export interface Skill {
  id: string;
  name: Bi;
  category: 'hard' | 'soft';
  /** 0–100 */
  level: number;
  desc: Bi;
}

export interface Tool {
  id: string;
  name: string;
  group: string;
}

export interface Service {
  id: string;
  icon: string;
  title: Bi;
  subtitle: Bi;
  desc: Bi;
  points: Bi[];
}

export interface ProcessStep {
  id: string;
  title: Bi;
  desc: Bi;
}

export interface Reference {
  id: string;
  name: string;
  role: Bi;
  company: string;
  note: Bi;
}

export interface Profile {
  name: string;
  shortName: string;
  title: Bi;
  tagline: Bi;
  badge: string;
  photoUrl: string;
  logoUrl: string;
  cvUrl: string;
  summary: Bi;
  /** Cerita panjang untuk halaman /profil — paragraf dipisah baris kosong */
  story: Bi;
  birthPlace: string;
  birthDate: string;
  birthYear: number;
  gender: Bi;
  nationality: Bi;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  openToWork: boolean;
  /** false = tanggal lahir, usia & jenis kelamin disembunyikan dari publik (privasi & cegah bias usia) */
  showBirthDate: boolean;
  /** true = kartu dashboard menampilkan bar Usia; false = kartu Pencapaian */
  showAgeCard: boolean;
  hobbies: Bi[];
  socials: {
    instagram: string;
    linkedin: string;
    threads: string;
    tiktok: string;
    jobstreet: string;
    ibenews: string;
  };
}

export interface Achievement {
  id: string;
  value: string;
  label: Bi;
}

export interface ContactInfo {
  headline: Bi;
  sub: Bi;
  availability: Bi;
  waTemplate: Bi;
}

export interface SiteContent {
  /** Naikkan kalau struktur berubah — dipakai untuk merge default */
  schema: number;
  updatedAt: string;
  profile: Profile;
  experience: Experience[];
  education: {
    intro: Bi;
    story: Bi;
    items: Education[];
    journey: JourneyStep[];
  };
  organizations: Organization[];
  certificates: Certificate[];
  skills: Skill[];
  tools: Tool[];
  services: Service[];
  process: ProcessStep[];
  references: Reference[];
  /** Angka-angka pencapaian (kartu dashboard & halaman profil) */
  achievements: Achievement[];
  contact: ContactInfo;
}
