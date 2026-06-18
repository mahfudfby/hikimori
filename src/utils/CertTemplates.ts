// src/utils/CertTemplates.ts
// ─── 3 Template Sertifikat Default (SVG → Data URL) ───────────────────────

const enc = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;

/* ══════════════════════════════════════════════════
   TEMPLATE 1 — BNSP CHRO  (Cream + Dark Green + Gold)
══════════════════════════════════════════════════ */
const SVG_BNSP = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
  <rect width="900" height="640" fill="#fefdf8"/>
  <rect x="12" y="12" width="876" height="616" fill="none" stroke="#2a4823" stroke-width="3" rx="8"/>
  <rect x="20" y="20" width="860" height="600" fill="none" stroke="#3f6b35" stroke-width="1" rx="6" opacity="0.4"/>
  <path d="M12,64 L12,12 L64,12" fill="none" stroke="#f5c842" stroke-width="3"/>
  <path d="M888,64 L888,12 L836,12" fill="none" stroke="#f5c842" stroke-width="3"/>
  <path d="M12,576 L12,628 L64,628" fill="none" stroke="#f5c842" stroke-width="3"/>
  <path d="M888,576 L888,628 L836,628" fill="none" stroke="#f5c842" stroke-width="3"/>
  <rect x="12" y="12" width="876" height="112" fill="#2a4823" rx="6"/>
  <rect x="12" y="110" width="876" height="14" fill="#2a4823"/>
  <text x="450" y="54" text-anchor="middle" fill="#f5d060" font-family="Georgia,serif" font-size="13" letter-spacing="5" font-weight="bold">BADAN NASIONAL SERTIFIKASI PROFESI</text>
  <text x="180" y="93" text-anchor="middle" fill="#f5d060" font-size="14">&#9733;</text>
  <text x="720" y="93" text-anchor="middle" fill="#f5d060" font-size="14">&#9733;</text>
  <text x="450" y="95" text-anchor="middle" fill="#ffffff" font-family="Georgia,serif" font-size="27" font-weight="bold" letter-spacing="3">SERTIFIKAT KOMPETENSI</text>
  <circle cx="450" cy="202" r="52" fill="#edf1e3" stroke="#3f6b35" stroke-width="2"/>
  <circle cx="450" cy="202" r="42" fill="none" stroke="#f5c842" stroke-width="1.5"/>
  <polygon points="450,175 457,194 478,194 462,206 468,226 450,215 432,226 438,206 422,194 443,194" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
  <circle cx="450" cy="200" r="13" fill="#2a4823"/>
  <text x="450" y="205" text-anchor="middle" fill="#f5d060" font-size="11" font-weight="bold" font-family="Arial,sans-serif">HR</text>
  <rect x="442" y="250" width="16" height="6" rx="2" fill="#f5c842"/>
  <polygon points="442,256 438,266 450,261 462,266 458,256" fill="#f5c842"/>
  <text x="450" y="302" text-anchor="middle" fill="#74816c" font-family="Georgia,serif" font-size="12" letter-spacing="4">D I B E R I K A N   K E P A D A</text>
  <text x="450" y="348" text-anchor="middle" fill="#1d2b18" font-family="Georgia,serif" font-size="34" font-weight="bold" font-style="italic">Mahfud Febry Styanto, S.Kom.</text>
  <line x1="140" y1="360" x2="760" y2="360" stroke="#3f6b35" stroke-width="1.5" opacity="0.4"/>
  <text x="450" y="390" text-anchor="middle" fill="#42513c" font-family="Georgia,serif" font-size="13">telah dinyatakan KOMPETEN dalam skema sertifikasi</text>
  <text x="450" y="428" text-anchor="middle" fill="#2a4823" font-family="Georgia,serif" font-size="23" font-weight="bold">Certified Human Resource Officer (CHRO)</text>
  <text x="450" y="458" text-anchor="middle" fill="#74816c" font-family="Georgia,serif" font-size="12" font-style="italic">BNSP &#8211; Badan Nasional Sertifikasi Profesi</text>
  <rect x="146" y="477" width="180" height="26" rx="13" fill="#edf1e3" stroke="#3f6b35" stroke-width="1"/>
  <text x="236" y="494" text-anchor="middle" fill="#2a4823" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Analisa Beban Kerja</text>
  <rect x="336" y="477" width="228" height="26" rx="13" fill="#edf1e3" stroke="#3f6b35" stroke-width="1"/>
  <text x="450" y="494" text-anchor="middle" fill="#2a4823" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Menyusun Uraian Jabatan</text>
  <rect x="574" y="477" width="180" height="26" rx="13" fill="#edf1e3" stroke="#3f6b35" stroke-width="1"/>
  <text x="664" y="494" text-anchor="middle" fill="#2a4823" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Payroll &amp; BPJS</text>
  <line x1="60" y1="534" x2="840" y2="534" stroke="#3f6b35" stroke-width="1" opacity="0.25"/>
  <line x1="78" y1="578" x2="258" y2="578" stroke="#3f6b35" stroke-width="1" opacity="0.5"/>
  <text x="168" y="590" text-anchor="middle" fill="#42513c" font-size="10" font-family="Georgia,serif">Direktur Eksekutif BNSP</text>
  <text x="168" y="602" text-anchor="middle" fill="#74816c" font-size="9" font-family="Georgia,serif">Jakarta, 2025</text>
  <circle cx="450" cy="568" r="30" fill="none" stroke="#3f6b35" stroke-width="1.5" opacity="0.3" stroke-dasharray="4,3"/>
  <text x="450" y="565" text-anchor="middle" fill="#3f6b35" font-size="8" font-weight="bold" opacity="0.45" font-family="Arial,sans-serif">BNSP</text>
  <text x="450" y="576" text-anchor="middle" fill="#3f6b35" font-size="7" opacity="0.4" font-family="Arial,sans-serif">OFFICIAL SEAL</text>
  <line x1="642" y1="578" x2="822" y2="578" stroke="#3f6b35" stroke-width="1" opacity="0.5"/>
  <text x="732" y="590" text-anchor="middle" fill="#42513c" font-size="10" font-family="Georgia,serif">No. BNSP/HRM/2025/001</text>
  <text x="732" y="602" text-anchor="middle" fill="#74816c" font-size="9" font-family="Georgia,serif">Berlaku hingga 2028</text>
  <text x="450" y="622" text-anchor="middle" fill="#9ba890" font-size="10" letter-spacing="1" font-family="Arial,sans-serif">Sistem Informasi Sertifikasi Kompetensi Nasional &#8226; www.bnsp.go.id</text>
</svg>`;

/* ══════════════════════════════════════════════════
   TEMPLATE 2 — Surat Referensi Kerja  (White + Navy Blue)
══════════════════════════════════════════════════ */
const SVG_REFERENSI = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
  <rect width="900" height="640" fill="#f8f9ff"/>
  <rect x="0" y="0" width="900" height="640" fill="none" stroke="#1a2e6b" stroke-width="0"/>
  <rect x="0" y="0" width="14" height="640" fill="#1a2e6b"/>
  <rect x="886" y="0" width="14" height="640" fill="#1a2e6b"/>
  <rect x="0" y="0" width="900" height="120" fill="#1a2e6b"/>
  <rect x="0" y="120" width="900" height="8" fill="#f5c842"/>
  <circle cx="80" cy="60" r="34" fill="rgba(255,255,255,0.08)"/>
  <text x="80" y="56" text-anchor="middle" fill="#f5c842" font-size="24" font-family="Arial,sans-serif" font-weight="bold">UD</text>
  <text x="80" y="72" text-anchor="middle" fill="#f5c842" font-size="9" font-family="Arial,sans-serif" letter-spacing="1">DUTA PANGAN</text>
  <text x="480" y="48" text-anchor="middle" fill="#ffffff" font-family="Georgia,serif" font-size="11" letter-spacing="4" opacity="0.8">PERUSAHAAN PANGAN &amp; DISTRIBUSI</text>
  <text x="480" y="84" text-anchor="middle" fill="#ffffff" font-family="Georgia,serif" font-size="28" font-weight="bold" letter-spacing="1">UD DUTA PANGAN</text>
  <text x="480" y="108" text-anchor="middle" fill="#f5c842" font-family="Arial,sans-serif" font-size="11" letter-spacing="2">Nganjuk, Jawa Timur &#8226; Indonesia</text>
  <text x="450" y="166" text-anchor="middle" fill="#1a2e6b" font-family="Georgia,serif" font-size="22" font-weight="bold" letter-spacing="2">SURAT KETERANGAN KERJA</text>
  <line x1="200" y1="174" x2="700" y2="174" stroke="#1a2e6b" stroke-width="1.5" opacity="0.3"/>
  <text x="450" y="198" text-anchor="middle" fill="#74816c" font-family="Georgia,serif" font-size="12">No. Ref: SK/HRD/2025/042</text>
  <text x="80" y="232" fill="#42513c" font-family="Georgia,serif" font-size="12">Yang bertanda tangan di bawah ini, Pimpinan UD Duta Pangan, menerangkan bahwa:</text>
  <rect x="60" y="255" width="780" height="148" rx="8" fill="#ffffff" stroke="#1a2e6b" stroke-width="1" opacity="0.6"/>
  <text x="100" y="284" fill="#1a2e6b" font-family="Georgia,serif" font-size="12">Nama</text>
  <text x="220" y="284" fill="#42513c" font-family="Georgia,serif" font-size="12">: Mahfud Febry Styanto, S.Kom.</text>
  <text x="100" y="306" fill="#1a2e6b" font-family="Georgia,serif" font-size="12">Jabatan</text>
  <text x="220" y="306" fill="#42513c" font-family="Georgia,serif" font-size="12">: Staff HRD &amp; General Affairs</text>
  <text x="100" y="328" fill="#1a2e6b" font-family="Georgia,serif" font-size="12">Departemen</text>
  <text x="220" y="328" fill="#42513c" font-family="Georgia,serif" font-size="12">: Human Resource &amp; General Affairs Division</text>
  <text x="100" y="350" fill="#1a2e6b" font-family="Georgia,serif" font-size="12">Periode</text>
  <text x="220" y="350" fill="#42513c" font-family="Georgia,serif" font-size="12">: Juli 2024 &#8211; Sekarang</text>
  <text x="100" y="372" fill="#1a2e6b" font-family="Georgia,serif" font-size="12">Status</text>
  <text x="220" y="372" fill="#42513c" font-family="Georgia,serif" font-size="12">: Karyawan Aktif</text>
  <text x="80" y="430" fill="#42513c" font-family="Georgia,serif" font-size="12">Yang bersangkutan telah menunjukkan kinerja yang baik, profesional, dan bertanggung jawab</text>
  <text x="80" y="450" fill="#42513c" font-family="Georgia,serif" font-size="12">dalam menjalankan tugasnya. Surat ini dibuat untuk digunakan sebagaimana mestinya.</text>
  <line x1="60" y1="508" x2="840" y2="508" stroke="#1a2e6b" stroke-width="1" opacity="0.2"/>
  <text x="680" y="532" fill="#42513c" font-family="Georgia,serif" font-size="11">Nganjuk, Januari 2025</text>
  <text x="680" y="556" fill="#42513c" font-family="Georgia,serif" font-size="11">Pimpinan UD Duta Pangan</text>
  <line x1="640" y1="590" x2="860" y2="590" stroke="#1a2e6b" stroke-width="1" opacity="0.4"/>
  <text x="750" y="604" text-anchor="middle" fill="#1a2e6b" font-family="Georgia,serif" font-size="11" font-weight="bold">H. Ahmad Subagyo</text>
  <circle cx="120" cy="570" r="36" fill="none" stroke="#1a2e6b" stroke-width="1.5" opacity="0.25" stroke-dasharray="4,3"/>
  <text x="120" y="566" text-anchor="middle" fill="#1a2e6b" font-size="8" font-weight="bold" opacity="0.35" font-family="Arial,sans-serif">UD DUTA</text>
  <text x="120" y="577" text-anchor="middle" fill="#1a2e6b" font-size="7" opacity="0.3" font-family="Arial,sans-serif">PANGAN</text>
  <rect x="0" y="628" width="900" height="12" fill="#1a2e6b"/>
  <rect x="0" y="620" width="900" height="8" fill="#f5c842"/>
</svg>`;

/* ══════════════════════════════════════════════════
   TEMPLATE 3 — IT Support Certificate  (Dark + Cyan)
══════════════════════════════════════════════════ */
const SVG_IT = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f1729"/>
      <stop offset="100%" stop-color="#1a2540"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00c6ff"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="900" height="640" fill="url(#g1)"/>
  <circle cx="820" cy="80" r="200" fill="rgba(0,198,255,0.04)"/>
  <circle cx="80" cy="560" r="160" fill="rgba(124,58,237,0.05)"/>
  <rect x="0" y="0" width="900" height="5" fill="url(#g2)"/>
  <rect x="0" y="635" width="900" height="5" fill="url(#g2)"/>
  <rect x="0" y="0" width="5" height="640" fill="url(#g2)"/>
  <rect x="895" y="0" width="5" height="640" fill="url(#g2)"/>
  <rect x="20" y="20" width="860" height="600" fill="none" stroke="rgba(0,198,255,0.15)" stroke-width="1" rx="6"/>
  <rect x="20" y="20" width="860" height="100" fill="rgba(0,198,255,0.06)" rx="6"/>
  <text x="450" y="56" text-anchor="middle" fill="rgba(0,198,255,0.7)" font-family="Arial,sans-serif" font-size="11" letter-spacing="6">LEMBAGA SERTIFIKASI KOMPETENSI TEKNOLOGI INFORMASI</text>
  <text x="450" y="95" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="28" font-weight="bold" letter-spacing="2">CERTIFICATE OF COMPETENCE</text>
  <rect x="300" y="105" width="300" height="3" rx="2" fill="url(#g2)"/>
  <rect x="38" y="155" width="70" height="70" rx="10" fill="rgba(0,198,255,0.08)" stroke="rgba(0,198,255,0.3)" stroke-width="1"/>
  <text x="73" y="195" text-anchor="middle" fill="rgba(0,198,255,0.8)" font-size="28" font-family="Arial,sans-serif">&#128187;</text>
  <rect x="828" y="155" width="54" height="54" rx="27" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.3)" stroke-width="1"/>
  <text x="855" y="190" text-anchor="middle" fill="rgba(124,58,237,0.8)" font-size="22" font-family="Arial,sans-serif">&#9881;</text>
  <text x="450" y="190" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif" font-size="12" letter-spacing="3">THIS IS TO CERTIFY THAT</text>
  <text x="450" y="244" text-anchor="middle" fill="#ffffff" font-family="Georgia,serif" font-size="34" font-weight="bold" font-style="italic">Mahfud Febry Styanto, S.Kom.</text>
  <rect x="200" y="254" width="500" height="2" rx="1" fill="url(#g2)" opacity="0.6"/>
  <text x="450" y="284" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Arial,sans-serif" font-size="13">has successfully demonstrated competence in</text>
  <text x="450" y="326" text-anchor="middle" fill="#00c6ff" font-family="Arial,sans-serif" font-size="24" font-weight="bold" letter-spacing="1">IT SUPPORT SPECIALIST</text>
  <text x="450" y="356" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="Arial,sans-serif" font-size="12">Divisi Teknologi Informasi &#8226; UD Duta Pangan</text>
  <rect x="60" y="378" width="780" height="1" fill="rgba(0,198,255,0.15)"/>
  <rect x="86" y="400" width="216" height="28" rx="14" fill="rgba(0,198,255,0.1)" stroke="rgba(0,198,255,0.35)" stroke-width="1"/>
  <text x="194" y="418" text-anchor="middle" fill="#00c6ff" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Hardware Troubleshooting</text>
  <rect x="314" y="400" width="272" height="28" rx="14" fill="rgba(124,58,237,0.1)" stroke="rgba(124,58,237,0.35)" stroke-width="1"/>
  <text x="450" y="418" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Network Configuration &amp; LAN</text>
  <rect x="598" y="400" width="216" height="28" rx="14" fill="rgba(0,198,255,0.1)" stroke="rgba(0,198,255,0.35)" stroke-width="1"/>
  <text x="706" y="418" text-anchor="middle" fill="#00c6ff" font-size="11" font-weight="bold" font-family="Arial,sans-serif">IT Incident Management</text>
  <rect x="200" y="440" width="218" height="28" rx="14" fill="rgba(124,58,237,0.1)" stroke="rgba(124,58,237,0.35)" stroke-width="1"/>
  <text x="309" y="458" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Software Support &amp; Config</text>
  <rect x="432" y="440" width="268" height="28" rx="14" fill="rgba(0,198,255,0.1)" stroke="rgba(0,198,255,0.35)" stroke-width="1"/>
  <text x="566" y="458" text-anchor="middle" fill="#00c6ff" font-size="11" font-weight="bold" font-family="Arial,sans-serif">Inventarisasi Perangkat IT (30+)</text>
  <rect x="60" y="482" width="780" height="1" fill="rgba(0,198,255,0.12)"/>
  <line x1="78" y1="546" x2="258" y2="546" stroke="rgba(0,198,255,0.4)" stroke-width="1"/>
  <text x="168" y="560" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="10" font-family="Arial,sans-serif">Kepala Divisi IT</text>
  <text x="168" y="572" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Arial,sans-serif">UD Duta Pangan</text>
  <circle cx="450" cy="530" r="36" fill="none" stroke="url(#g2)" stroke-width="1.5" opacity="0.4"/>
  <text x="450" y="527" text-anchor="middle" fill="rgba(0,198,255,0.6)" font-size="9" font-weight="bold" font-family="Arial,sans-serif">VERIFIED</text>
  <text x="450" y="540" text-anchor="middle" fill="rgba(0,198,255,0.4)" font-size="8" font-family="Arial,sans-serif">2025</text>
  <line x1="642" y1="546" x2="822" y2="546" stroke="rgba(124,58,237,0.4)" stroke-width="1"/>
  <text x="732" y="560" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="10" font-family="Arial,sans-serif">Ref: IT/CERT/2025/DP-003</text>
  <text x="732" y="572" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Arial,sans-serif">Valid: 2025 &#8211; 2028</text>
  <text x="450" y="610" text-anchor="middle" fill="rgba(0,198,255,0.3)" font-size="10" letter-spacing="2" font-family="Arial,sans-serif">LEMBAGA SERTIFIKASI KOMPETENSI TI &#8226; NGANJUK, JAWA TIMUR</text>
</svg>`;

/* ══════════════════════════════════════════════════
   EXPORTS — siap pakai sebagai imageUrl di defaultCerts
══════════════════════════════════════════════════ */
export const CERT_TEMPLATE_BNSP       = enc(SVG_BNSP);
export const CERT_TEMPLATE_REFERENSI  = enc(SVG_REFERENSI);
export const CERT_TEMPLATE_IT         = enc(SVG_IT);

/*
─── Cara pakai di Home.tsx & AdminPanel.tsx ────────────────────────────────

import { CERT_TEMPLATE_BNSP, CERT_TEMPLATE_REFERENSI, CERT_TEMPLATE_IT }
  from '../utils/CertTemplates';     // sesuaikan path

const defaultCerts: CertItem[] = [
  {
    id: '1',
    title: 'Certified Human Resource Officer (CHRO)',
    issuer: 'BNSP – Badan Nasional Sertifikasi Profesi',
    items: 'Analisa Beban Kerja,Menyusun Uraian Jabatan,Payroll & BPJS',
    imageUrl: CERT_TEMPLATE_BNSP,
  },
  {
    id: '2',
    title: 'Surat Keterangan Kerja',
    issuer: 'UD Duta Pangan',
    items: 'Vendor Management,Stock Monitoring,Facility Maintenance',
    imageUrl: CERT_TEMPLATE_REFERENSI,
  },
  {
    id: '3',
    title: 'IT Support Specialist',
    issuer: 'Lembaga Sertifikasi Kompetensi TI',
    items: 'Hardware Troubleshooting,Network Configuration,IT Incident Management',
    imageUrl: CERT_TEMPLATE_IT,
  },
];
─────────────────────────────────────────────────────────────────────────── */
