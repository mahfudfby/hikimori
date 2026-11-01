// src/content/defaults.ts
// Konten bawaan. Dipakai saat Firestore belum punya data / offline, dan
// sebagai "Reset ke bawaan" di CMS. Semua isinya bisa diubah dari /admin
// tanpa coding — file ini cuma titik awal.
import seed from './seed.json';
import type { SiteContent, Experience, Skill, Certificate } from './types';

const bi = (id: string, en: string = id) => ({ id, en });

export const SCHEMA_VERSION = 1;

export const DEFAULT_CONTENT: SiteContent = {
  schema: SCHEMA_VERSION,
  updatedAt: '',
  profile: {
    name: 'Mahfud Febry Styanto, S.Kom., CHRG',
    shortName: 'Mahfud',
    title: bi('Human Resources & Administration'),
    tagline: bi(
      'HRD, Payroll, General Affairs, IT Support, FMCG & Administrasi Operasional, pengalaman nyata di industri manufaktur.',
      'HRD, Payroll, General Affairs, IT Support, FMCG & Operational Administration, hands-on experience in the manufacturing industry.'
    ),
    badge: 'CHRG',
    photoUrl: 'https://res.cloudinary.com/dl4pyan8v/image/upload/f_auto,q_auto,w_900/v1783866519/Mahfudfebry_casual_oj8r1d.png',
    logoUrl: 'https://res.cloudinary.com/dl4pyan8v/image/upload/e_trim/f_auto,q_auto,h_160/v1793385513/1EF88D88-4DEB-4541-A073-0ED603FFF1CA_hyknub.png',
    cvUrl: '/CV-Mahfud-Febry-Styanto.pdf',
    summary: bi(
      'Profesional multidisiplin di bidang HRD, Payroll, General Affairs, IT Support, FMCG, dan Administrasi Operasional dengan pengalaman nyata di industri manufaktur. Telah melewati perjalanan lintas divisi dalam satu perusahaan pada periode berbeda, sebagai bukti loyalitas dan kepercayaan yang diberikan atas pencapaian di setiap peran. Kompeten dalam payroll, analisa beban kerja, BPJS, pengelolaan 100+ perangkat IT, serta koordinasi operasional. Bersertifikat BNSP CHRG, S.Kom., IPK 3.39.',
      'A multidisciplinary professional in HRD, Payroll, General Affairs, IT Support, FMCG, and Operational Administration with hands-on experience in the manufacturing industry. Has held cross-departmental roles within the same company at different times, demonstrating loyalty and the trust placed in me based on my achievements in each role. Competent in payroll, workload analysis, BPJS, managing over 100 IT devices, and operational coordination. BNSP CHRG certified, S.Kom., GPA 3.39.'
    ),
    story: bi(
      'Perjalanan karier saya dimulai di instansi pemerintah Kabupaten Nganjuk sebagai Human Resources Assistant, tempat saya pertama kali belajar bahwa administrasi SDM yang rapi adalah fondasi organisasi yang sehat.\n\nSetelah itu saya merantau ke Malang. Di sana saya bekerja di berbagai bidang, dari bengkel las, dapur restoran, hingga layanan transportasi online, sambil menempuh kuliah Teknik Informatika di kelas karyawan. Masa itu mengajarkan disiplin, manajemen waktu, dan empati terhadap pekerja lapangan.\n\nDi UD Duta Pangan saya dipercaya berpindah lintas divisi: Sales Marketing, Administrasi Gudang & Produksi, IT Support, hingga HR Generalist dan Staff HRD / General Affairs. Kombinasi latar belakang IT dan SDM membuat saya terbiasa membangun sistem kerja yang efisien, dari payroll, BPJS, perizinan OSS, sampai ERP internal.',
      'My career started at the Nganjuk Regency government as a Human Resources Assistant, where I first learned that tidy HR administration is the foundation of a healthy organization.\n\nI then moved to Malang, working across many fields, a welding workshop, restaurant kitchens, and ride-hailing, while studying Informatics Engineering in an employee class. Those years taught me discipline, time management, and empathy for frontline workers.\n\nAt UD Duta Pangan I was trusted to move across divisions: Sales Marketing, Warehouse & Production Administration, IT Support, and finally HR Generalist and HRD / General Affairs Staff. Combining IT and HR backgrounds, I build efficient work systems, from payroll, BPJS and OSS licensing to an internal ERP.'
    ),
    birthPlace: 'Nganjuk',
    birthDate: '12 Februari 2000',
    birthYear: 2000,
    gender: bi('Laki-laki', 'Male'),
    nationality: bi('Indonesia', 'Indonesian'),
    location: 'Nganjuk, Jawa Timur, Indonesia',
    email: 'Mahfudfebrys@gmail.com',
    phone: '0822-3465-1413',
    whatsapp: '6282234651413',
    website: 'hikimori.web.id',
    openToWork: true,
    showBirthDate: false,
    showAgeCard: false,
    hobbies: [
      bi('Riset Otomasi AI', 'AI Automation Research'),
      bi('Coding / Web Developer', 'Web Developer Coding'),
      bi('Penulisan Konten', 'Content Writing'),
      bi('Proyek Pengabdian Masyarakat', 'Community Service Projects'),
    ],
    socials: {
      instagram: 'mahfudfebry',
      linkedin: 'mahfud-febry-styanto',
      threads: 'mahfudfebry',
      tiktok: 'mahfudfebry',
      jobstreet: 'https://id.jobstreet.com/id/profiles/xT4NqdPjhP',
      ibenews: 'https://www.ibenews.id/author/10521/Mahfud-Febry-Styanto',
    },
  },

  experience: seed.exp as Experience[],

  education: {
    intro: bi(
      'Latar belakang Teknik Informatika yang saya tempuh sambil bekerja, pondasi yang membuat saya nyaman di persimpangan SDM dan teknologi.',
      'An Informatics Engineering background earned while working, the foundation that makes me comfortable where HR meets technology.'
    ),
    story: bi(
      'Saya memilih kelas karyawan di Institut Teknologi & Bisnis ASIA Malang supaya bisa tetap bekerja sambil kuliah. Pagi hingga sore bekerja, malam dan akhir pekan kuliah, ritme yang melatih saya mengatur prioritas dengan ketat.\n\nIlmu informatika yang saya dapat, basis data, jaringan, dan pengembangan sistem, kemudian saya terapkan langsung di dunia kerja: mengelola 100+ perangkat IT, membangun ERP internal, dan mengotomasi laporan SDM.\n\nSetelah lulus sebagai S.Kom. dengan IPK 3.39, saya melanjutkan pengembangan diri lewat pelatihan Certified Human Resources Generalist (CHRG) berbasis SKKNI dan meraih sertifikasinya dari BNSP.',
      'I chose the employee class at Institut Teknologi & Bisnis ASIA Malang so I could keep working while studying. Working by day, studying at night and on weekends, a rhythm that trained me to prioritize strictly.\n\nThe informatics knowledge I gained, databases, networking and systems development, went straight into my work: managing 100+ IT devices, building an internal ERP, and automating HR reports.\n\nAfter graduating as S.Kom. with a 3.39 GPA, I continued developing through SKKNI-based Certified Human Resources Generalist (CHRG) training and earned the certification from BNSP.'
    ),
    items: [
      {
        id: 'ed1',
        level: bi('Sarjana (S1)', "Bachelor's Degree"),
        school: 'Institut Teknologi & Bisnis ASIA Malang',
        major: bi('Teknik Informatika', 'Informatics Engineering'),
        location: 'Malang, Jawa Timur',
        start: '',
        end: '',
        gpa: '3.39',
        logoUrl: '',
        note: bi('Kelas Karyawan', 'Employee Class'),
        story: bi(
          'Kuliah sambil bekerja penuh waktu di Malang. Fokus pada pengembangan sistem informasi, jaringan komputer, dan basis data.',
          'Studied while working full time in Malang. Focused on information systems development, computer networks and databases.'
        ),
        thesis: bi('', ''),
        courses: ['Basis Data', 'Jaringan Komputer', 'Rekayasa Perangkat Lunak', 'Sistem Informasi Manajemen', 'Pemrograman Web'],
        highlights: [
          bi('Lulus dengan gelar S.Kom., IPK 3.39', 'Graduated as S.Kom., GPA 3.39'),
          bi('Kepala Divisi Humas Internal, Paguyuban Mahasiswa Nganjuk di Malang', 'Head of Internal PR, Nganjuk Students Association in Malang'),
        ],
      },
    ],
    journey: [
      { id: 'j1', year: '2016', title: bi('Mulai berkarier di SDM', 'Started an HR career'), desc: bi('Human Resources Assistant di Dinas Kesehatan Nganjuk.', 'Human Resources Assistant at Nganjuk Health Office.') },
      { id: 'j2', year: '2018', title: bi('Merantau ke Malang', 'Moved to Malang'), desc: bi('Bekerja sambil menempuh kuliah Teknik Informatika kelas karyawan.', 'Worked while studying Informatics Engineering in an employee class.') },
      { id: 'j3', year: '—', title: bi('Aktif berorganisasi', 'Active in organizations'), desc: bi('Kepala Divisi Humas Internal Paguyuban Mahasiswa Nganjuk di Malang.', 'Head of Internal PR at the Nganjuk Students Association in Malang.') },
      { id: 'j4', year: '—', title: bi('Lulus S.Kom.', 'Graduated S.Kom.'), desc: bi('Menyelesaikan studi dengan IPK 3.39.', 'Completed studies with a 3.39 GPA.') },
      { id: 'j5', year: '2025', title: bi('Pelatihan CHRG', 'CHRG training'), desc: bi('Pelatihan Certified Human Resources Generalist: 4 unit kompetensi SKKNI MSDM, Cipta Innovasi Unggul.', 'Certified Human Resources Generalist training: 4 SKKNI HR competency units, Cipta Innovasi Unggul.') },
      { id: 'j6', year: '2026', title: bi('Sertifikasi BNSP CHRG', 'BNSP CHRG certification'), desc: bi('Certified Human Resources Generalist, berlaku 2026 s.d. 2029.', 'Certified Human Resources Generalist, valid 2026 to 2029.') },
    ],
  },

  organizations: [
    {
      id: 'o1',
      name: bi('PANGLIMA (Paguyuban Mahasiswa Nganjuk Kuliah di Malang)', 'PANGLIMA (Nganjuk Students Association in Malang)'),
      role: bi('Kepala Divisi Humas Internal', 'Head of Internal Public Relations'),
      period: '',
      points: [
        bi('Menangani konflik organisasi internal', 'Handling internal organizational conflict'),
        bi('Menjaga solidaritas anggota', 'Maintaining member solidarity'),
        bi('Pengembangan karakter & soft skills anggota', 'Character and soft-skill development of members'),
        bi('Pusat distribusi & manajemen informasi organisasi', 'Organizational information distribution and management'),
      ],
    },
  ],

  certificates: seed.certs as Certificate[],
  skills: seed.skills as Skill[],

  tools: [
    'Microsoft Excel, Word, PowerPoint|Office',
    'Google Workspace (Sheets, Docs, Forms)|Office',
    'OSS Platform|HR & Legal',
    'SIPP BPJS Ketenagakerjaan|HR & Legal',
    'e-Dabu BPJS Kesehatan|HR & Legal',
    'ERP / SaaS (Self-Developed)|IT',
    'AI Automation & Optimization|IT',
    'Mikrotik & Wireshark|IT',
    'Olsera POS System|IT',
    'Adobe Photoshop|Creative',
    'CapCut Video Editor|Creative',
  ].map((s, i) => { const [name, group] = s.split('|'); return { id: 't' + i, name, group }; }),

  services: [
    {
      id: 'sv1', icon: '👥',
      title: bi('Human Resource Management'), subtitle: bi('HR Professional'),
      desc: bi('Pengelolaan sumber daya manusia secara menyeluruh, dari rekrutmen, onboarding, evaluasi kinerja, hingga pengembangan organisasi.', 'End-to-end people management, from recruitment and onboarding to performance reviews and organizational development.'),
      points: [bi('Analisa Beban Kerja', 'Workload Analysis'), bi('Menyusun Uraian Jabatan', 'Job Descriptions'), bi('Payroll & BPJS'), bi('Rekrutmen & Seleksi', 'Recruitment & Selection'), bi('Employee Relations'), bi('Performance Evaluation')],
    },
    {
      id: 'sv2', icon: '📋',
      title: bi('Staff Administrasi', 'Administration'), subtitle: bi('Administration'),
      desc: bi('Layanan administrasi profesional yang efisien, pengelolaan dokumen, pelaporan, dan koordinasi operasional harian perusahaan.', 'Efficient professional administration, document management, reporting and daily operational coordination.'),
      points: [bi('Document Management'), bi('Vendor Coordination'), bi('Stock Monitoring'), bi('Facility Maintenance'), bi('Laporan Operasional', 'Operational Reports'), bi('Arsip & Filing', 'Archiving & Filing')],
    },
    {
      id: 'sv3', icon: '💻',
      title: bi('IT Support & Technical'), subtitle: bi('Technology'),
      desc: bi('Dukungan teknis komprehensif untuk kebutuhan IT perusahaan, dari hardware, software, jaringan, hingga pelatihan pengguna.', 'Comprehensive technical support, hardware, software, networking and user training.'),
      points: [bi('Hardware Troubleshooting'), bi('Software Installation'), bi('Network Setup & Config'), bi('Data Backup & Recovery'), bi('User Training'), bi('IT Documentation')],
    },
  ],

  process: [
    { id: 'p1', title: bi('Konsultasi', 'Consultation'), desc: bi('Diskusi mendalam tentang kebutuhan dan tujuan Anda.', 'An in-depth discussion of your needs and goals.') },
    { id: 'p2', title: bi('Perencanaan', 'Planning'), desc: bi('Menyusun strategi dan roadmap yang terstruktur.', 'Building a structured strategy and roadmap.') },
    { id: 'p3', title: bi('Eksekusi', 'Execution'), desc: bi('Implementasi dengan standar kualitas tertinggi.', 'Implementation to the highest quality standard.') },
    { id: 'p4', title: bi('Evaluasi', 'Review'), desc: bi('Review dan penyempurnaan untuk hasil optimal.', 'Review and refinement for the best result.') },
  ],

  references: [
    {
      id: 'r1', name: 'Aldy Bachtiyar', role: bi('General Manager'), company: 'UD Duta Pangan',
      note: bi('Surat Referensi Kerja No. 078/SR-HRD/UDP/06/2026', 'Work Reference Letter No. 078/SR-HRD/UDP/06/2026'),
    },
  ],

  achievements: [
    { id: 'a6', value: '4 jenis', label: bi('vendor dikoordinasikan: cleaning service, keamanan, teknisi, ekspedisi', 'vendor types coordinated: cleaning, security, technicians, couriers'), job: 'HRD / General Affairs · ARCHIMAX Architect Indonesia' },
    { id: 'a1', value: '121', label: bi('karyawan, payroll & BPJS bulanan', 'employees, monthly payroll & BPJS'), job: 'Staff HRD / GA · UD Duta Pangan' },
    { id: 'a2', value: '6', label: bi('divisi, uraian jabatan & evaluasi KPI', 'divisions, job descriptions & KPI reviews'), job: 'Staff HRD / GA · UD Duta Pangan' },
    { id: 'a7', value: '5', label: bi('dokumen legal usaha lewat OSS: NIB, Akta, SK Kemenkumham, NPWP, SIUP', 'business legal documents via OSS: NIB, deed, ministry decree, NPWP, SIUP'), job: 'Staff HRD / GA · UD Duta Pangan' },
    { id: 'a3', value: '4j → <1j', label: bi('waktu pelaporan lewat ERP buatan sendiri', 'reporting time via self-built ERP'), job: 'IT Support · UD Duta Pangan' },
    { id: 'a4', value: '-50%', label: bi('insiden IT berulang', 'recurring IT incidents'), job: 'IT Support · UD Duta Pangan' },
    { id: 'a8', value: '90%', label: bi('uptime 30 komputer & perangkat kantor', 'uptime across 30 computers & office devices'), job: 'IT Support · UD Duta Pangan' },
    { id: 'a9', value: '30 mnt', label: bi('waktu penyelesaian isu IT minor', 'resolution time for minor IT issues'), job: 'IT Support · UD Duta Pangan' },
    { id: 'a5', value: '200+', label: bi('SKU inventori dipantau', 'inventory SKUs monitored'), job: 'Admin Gudang & Produksi · UD Duta Pangan' },
    { id: 'a10', value: '85%', label: bi('akurasi stok lewat stock opname rutin', 'stock accuracy through regular stock counts'), job: 'Admin Gudang & Produksi · UD Duta Pangan' },
    { id: 'a11', value: '25 SKU', label: bi('administrasi produksi harian, ±100 kg bahan baku per SKU', 'daily production records, ±100 kg of raw material per SKU'), job: 'Admin Gudang & Produksi · UD Duta Pangan' },
    { id: 'a14', value: '100 nota', label: bi('pesanan per hari, dari persiapan, plating, hingga diantar ke meja pelanggan', 'orders per day, from prep and plating to the customer’s table'), job: 'Kitchen Staff · Mikane Gepuktular' },
    { id: 'a15', value: '17 menu', label: bi('produk disiapkan sekaligus sebagai konsultan kuliner bagi pelanggan', 'menu items prepared, also acting as culinary consultant for customers'), job: 'Kitchen Staff · Mikane Gepuktular' },
    { id: 'a12', value: '4', label: bi('layanan antar: penumpang, makanan, paket, belanja', 'delivery services: rides, food, parcels, groceries'), job: 'Driver Bike · Grab' },
    { id: 'a13', value: '2,5 th', label: bi('pembuatan & pemasangan pagar, tralis, kanopi, rolling door', 'building & installing fences, grilles, canopies, rolling doors'), job: 'Welding Operator · Lancar Jaya Malang' },
  ],

  awards: [],

  contact: {
    headline: bi('Mari bekerja sama', "Let's work together"),
    sub: bi('Terbuka untuk peluang kerja, kolaborasi proyek, atau sekadar diskusi seputar SDM & sistem kerja.', 'Open to job opportunities, project collaboration, or simply a chat about HR and work systems.'),
    availability: bi('Tersedia untuk peluang baru', 'Available for new opportunities'),
    waTemplate: bi('Halo Mahfud, saya lihat portofolio Anda dan tertarik untuk berdiskusi lebih lanjut.', 'Hi Mahfud, I saw your portfolio and would like to discuss further.'),
  },
};
