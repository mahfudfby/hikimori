// src/pages/Home.tsx — Japanese Calligraphy Theme 書道
// Palette: Red · Black · Gold · White — Masculine Portfolio
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring, AnimatePresence, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import LazyMount from '../components/LazyMount';
import SpotlightCard from '../components/SpotlightCard';
import MagneticButton from '../components/MagneticButton';
import { useLang } from '../contexts/LanguageContext';
import { PROFILE } from '../data/cvData';

/* ─── localStorage keys ─── */
const LS_HOME='hk_home_data',LS_ABOUT='hk_home_about_data',LS_SKILLS='hk_skills_data';
const LS_EXP='hk_experience_data',LS_CONTACT='hk_contact_data',LS_CERT='hk_cert_data';
const LS_VER='hk_data_version';
const DATA_VERSION='v8'; // Naikkan versi ini setiap kali ada perubahan default data
/* Auto-reset localStorage jika versi berubah */
(()=>{try{if(localStorage.getItem(LS_VER)!==DATA_VERSION){[LS_HOME,LS_ABOUT,LS_SKILLS,LS_EXP,LS_CONTACT,LS_CERT].forEach(k=>localStorage.removeItem(k));localStorage.setItem(LS_VER,DATA_VERSION);}}catch{}})();

interface HomeData    {heroTitle:string;heroSubtitle:string;heroTagline:string;heroCtaSecondary:string;heroCtaSecondaryLink:string;heroCta:string;heroCtaLink:string;heroPhotoUrl:string;heroTagRight:string;}
interface AboutData   {name:string;location:string;bio1:string;bio2:string;photoUrl:string;instagram?:string;linkedin?:string;whatsapp?:string;threads?:string;tiktok?:string;email?:string;jobstreet?:string;ibenews?:string;}
interface SkillItem   {id:string;number:string;title:string;desc:string;category?:'hard'|'soft';}
interface ExpItem     {id:string;position:string;company:string;period:string;icon:string;tags:string;desc?:string;logoUrl?:string;location?:string;}
interface ContactData {email:string;location:string;website:string;instagram:string;linkedin:string;twitter:string;}
interface CertItem    {id:string;name:string;year:string;issuer:string;subtitle:string;imageUrl:string;}

const D_HOME:HomeData={heroTitle:'Mahfud Febry Styanto, S.Kom., CHRG',heroSubtitle:'Human Resources & Administration',heroTagline:'HRD, Payroll, General Affairs, IT Support, FMCG & Administrasi Operasional — pengalaman nyata di industri manufaktur.',heroCtaSecondary:'Mulai Chat',heroCtaSecondaryLink:'https://wa.me/6282234651413',heroCta:'Jelajahi Sekarang',heroCtaLink:'/portofolio',heroPhotoUrl:'',heroTagRight:'Nganjuk, Jawa Timur'};
const D_HOME_EN:HomeData={...D_HOME,heroSubtitle:'Human Resources & Administration',heroTagline:'HRD, Payroll, General Affairs, IT Support, FMCG & Operational Administration — hands-on experience in the manufacturing industry.',heroCtaSecondary:'Start a Chat',heroCta:'Explore Now'};
const D_ABOUT:AboutData={name:'Mahfud Febry Styanto, S.Kom., CHRG',location:'Nganjuk, Indonesia',bio1:PROFILE.summary.id,bio2:'',photoUrl:'',instagram:'mahfudfebry',linkedin:'mahfud-febry-styanto',whatsapp:'6282234651413',threads:'mahfudfebry',tiktok:'mahfudfebry',email:'Mahfudfebrys@gmail.com',jobstreet:'https://id.jobstreet.com/id/profiles/xT4NqdPjhP',ibenews:'https://www.ibenews.id/author/10521/Mahfud-Febry-Styanto'};
const D_ABOUT_EN:AboutData={...D_ABOUT,bio1:PROFILE.summary.en};
const D_SKILLS:SkillItem[]=[
  {id:'1',number:'01',title:'Administrasi Payroll',desc:'Menghitung gaji, potongan, bonus, dan komponen penggajian karyawan secara akurat dan tepat waktu.',category:'hard'},
  {id:'2',number:'02',title:'Administrasi BPJS',desc:'Mengelola pendaftaran dan iuran BPJS Kesehatan & BPJS Ketenagakerjaan karyawan.',category:'hard'},
  {id:'3',number:'03',title:'Legal & Perizinan (OSS)',desc:'Mengurus perizinan usaha dan kepatuhan hukum lewat platform OSS (NIB, Akta, NPWP, SIUP).',category:'hard'},
  {id:'4',number:'04',title:'Analisa Aset',desc:'Menganalisa dan mengelola aset operasional serta fasilitas perusahaan.',category:'hard'},
  {id:'5',number:'05',title:'IT Troubleshooting',desc:'Menangani troubleshooting hardware & software untuk operasional kantor sehari-hari.',category:'hard'},
  {id:'6',number:'06',title:'Dukungan Jaringan',desc:'Konfigurasi dan monitoring jaringan (Mikrotik, Wireshark) untuk kelancaran operasional IT.',category:'hard'},
  {id:'7',number:'07',title:'Pengembangan ERP/SaaS',desc:'Merancang dan membangun sistem ERP/SaaS internal untuk efisiensi pelaporan.',category:'hard'},
  {id:'8',number:'08',title:'Manajemen Inventori',desc:'Mengelola inventori bahan baku dan produk lintas ratusan SKU.',category:'hard'},
  {id:'9',number:'09',title:'Operasional Gudang',desc:'Mengatur alur kerja gudang: put-away, picking, dan prinsip 5S.',category:'hard'},
  {id:'10',number:'10',title:'Excel & Pelaporan Workspace',desc:'Menyusun laporan kerja menggunakan Excel dan Google Workspace secara rapi dan efisien.',category:'hard'},
  {id:'11',number:'01',title:'Koordinasi Lintas Divisi',desc:'Menjembatani komunikasi dan kerja sama antar divisi untuk kelancaran operasional.',category:'soft'},
  {id:'12',number:'02',title:'Relasi Vendor',desc:'Membina hubungan kerja yang baik dengan vendor dan supplier.',category:'soft'},
  {id:'13',number:'03',title:'Kepemimpinan',desc:'Memimpin dan mengarahkan tim untuk mencapai target kerja.',category:'soft'},
  {id:'14',number:'04',title:'Resolusi Konflik',desc:'Menengahi dan menyelesaikan konflik internal secara profesional.',category:'soft'},
  {id:'15',number:'05',title:'Manajemen Waktu',desc:'Mengatur prioritas kerja agar tenggat waktu selalu terpenuhi.',category:'soft'},
  {id:'16',number:'06',title:'Pemecahan Masalah',desc:'Menganalisa masalah dan mengambil solusi yang tepat secara cepat.',category:'soft'},
  {id:'17',number:'07',title:'Adaptabilitas Lintas Budaya',desc:'Cepat beradaptasi dengan lingkungan kerja dan budaya yang berbeda-beda.',category:'soft'},
  {id:'18',number:'08',title:'Ketelitian & Fokus',desc:'Teliti dan fokus dalam menangani detail pekerjaan administratif.',category:'soft'},
  {id:'19',number:'09',title:'Hubungan Masyarakat',desc:'Menjaga komunikasi dan citra baik dengan pihak eksternal.',category:'soft'},
  {id:'20',number:'10',title:'Inisiatif',desc:'Proaktif mengambil langkah tanpa harus selalu diarahkan.',category:'soft'},
  {id:'21',number:'11',title:'Membangun Tim',desc:'Membina soliditas dan semangat kerja sama dalam tim.',category:'soft'}
];
const D_SKILLS_EN:SkillItem[]=[
  {id:'1',number:'01',title:'Payroll Administration',desc:'Accurately and punctually calculating salary, deductions, bonuses, and payroll components.',category:'hard'},
  {id:'2',number:'02',title:'BPJS Administration',desc:'Managing employee BPJS Kesehatan & BPJS Ketenagakerjaan registration and contributions.',category:'hard'},
  {id:'3',number:'03',title:'Legal & Licensing (OSS)',desc:'Handling business licensing and legal compliance through the OSS platform (NIB, Akta, NPWP, SIUP).',category:'hard'},
  {id:'4',number:'04',title:'Asset Analyst',desc:'Analyzing and managing company operational assets and facilities.',category:'hard'},
  {id:'5',number:'05',title:'IT Troubleshooting',desc:'Handling hardware & software troubleshooting for daily office operations.',category:'hard'},
  {id:'6',number:'06',title:'Network Support',desc:'Configuring and monitoring networks (Mikrotik, Wireshark) for smooth IT operations.',category:'hard'},
  {id:'7',number:'07',title:'ERP / SaaS Development',desc:'Designing and building internal ERP/SaaS systems for reporting efficiency.',category:'hard'},
  {id:'8',number:'08',title:'Inventory Management',desc:'Managing raw material and product inventory across hundreds of SKUs.',category:'hard'},
  {id:'9',number:'09',title:'Warehouse Operational',desc:'Organizing warehouse workflow: put-away, picking, and 5S principles.',category:'hard'},
  {id:'10',number:'10',title:'Excel & Workspace Reporting',desc:'Producing clean, efficient work reports using Excel and Google Workspace.',category:'hard'},
  {id:'11',number:'01',title:'Cross-Dept Coordination',desc:'Bridging communication and collaboration between divisions for smooth operations.',category:'soft'},
  {id:'12',number:'02',title:'Vendor Relation',desc:'Maintaining good working relationships with vendors and suppliers.',category:'soft'},
  {id:'13',number:'03',title:'Leadership',desc:'Leading and directing teams to meet work targets.',category:'soft'},
  {id:'14',number:'04',title:'Conflict Resolution',desc:'Mediating and resolving internal conflicts professionally.',category:'soft'},
  {id:'15',number:'05',title:'Time Management',desc:'Managing work priorities so deadlines are consistently met.',category:'soft'},
  {id:'16',number:'06',title:'Problem Solving',desc:'Analyzing problems and quickly reaching the right solution.',category:'soft'},
  {id:'17',number:'07',title:'Adaptability (Any Culture)',desc:'Adapting quickly to different work environments and cultures.',category:'soft'},
  {id:'18',number:'08',title:'Attention to Detail & Focus',desc:'Thorough and focused when handling administrative details.',category:'soft'},
  {id:'19',number:'09',title:'Public Relation',desc:'Maintaining communication and a positive image with external parties.',category:'soft'},
  {id:'20',number:'10',title:'Initiative',desc:'Proactively taking action without always needing direction.',category:'soft'},
  {id:'21',number:'11',title:'Team Building',desc:'Fostering solidarity and teamwork spirit within the team.',category:'soft'}
];
const D_EXP:ExpItem[]=[
  {id:'1',position:'Staff HRD / General Affairs',company:'UD Duta Pangan (Food Manufacturing & Distribution)',period:'Juni 2025 – Juni 2026 · 1 Tahun 1 Bulan · Full-time',icon:'👥',tags:'Payroll & Penggajian,BPJS & BPJS-Tk,Perizinan OSS,Legal & Notaris,Jobdesk & KPI 6 Divisi,Pengelolaan Fasilitas & Aset',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Memproses payroll bulanan untuk 121 karyawan, meliputi perhitungan gaji, potongan, dan bonus\n• Menghitung dan mengelola iuran BPJS Kesehatan & BPJS Ketenagakerjaan untuk 121 karyawan, memastikan kepatuhan penuh dan penyetoran tepat waktu\n• Mengelola perizinan usaha dan kepatuhan hukum melalui platform OSS pemerintah, termasuk registrasi dan perpanjangan NIB, Akta, SK Kemenkumham, NPWP, dan SIUP untuk entitas CV dan PT\n• Mengoordinasikan proses administrasi internal & eksternal, termasuk dokumentasi notaris dan perpanjangan berkala dokumen legal & pajak perusahaan\n• Menyusun uraian jabatan (jobdesk) dan melakukan evaluasi KPI di 6 divisi (Eksekutif, Finance, Logistik, Warehouse, Marketing, dan HR/General Affairs) untuk menentukan perpanjangan kontrak dan keputusan staffing\n• Mengelola fasilitas perusahaan dan aset operasional, termasuk kendaraan pengiriman (blind van, truk, motor), peralatan kantor & produksi, serta utilitas gedung di berbagai kota',location:'Sidoarjo, Jawa Timur'},
  {id:'2',position:'Human Resources Generalist',company:'UD Duta Pangan (Food Manufacturing)',period:'Juni 2025 – Juni 2026 · 1 Tahun 1 Bulan · Full-time',icon:'🧑\u200d💼',tags:'BPJS,Analisa Beban Kerja',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'',location:'Sidoarjo, Jawa Timur'},
  {id:'3',position:'IT Support Specialist',company:'UD Duta Pangan (Food Manufacturing & Distribution)',period:'Januari 2025 – Juni 2025 · 6 Bulan · Full-time',icon:'💻',tags:'Technical Support,Preventive Maintenance,Mikrotik & Wireshark,ERP/SaaS Self-Developed',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Menjaga 90% uptime perangkat di 30 komputer & perangkat kantor melalui preventive maintenance rutin\n• Menangani 1-3 tiket support harian, menyelesaikan isu minor dalam 30 menit dan isu major (termasuk pengadaan part) dalam 1-2 jam\n• Mengurangi insiden IT berulang sebesar 50% dan menghilangkan ketergantungan pada teknisi eksternal dengan membangun fungsi IT support internal\n• Mengimplementasikan Class Based Queuing (CBQ) menggunakan Mikrotik & Winbox untuk mengalokasikan bandwidth khusus divisi prioritas sekaligus membatasi akses jaringan umum, dipantau via Wireshark pada sistem berbasis Linux\n• Merancang dan mengimplementasikan sistem ERP/SaaS berbasis web real-time untuk menggantikan pelaporan Excel manual offline, memangkas waktu pelaporan dari 4 jam menjadi kurang dari 1 jam dan menghilangkan keterlambatan pelaporan antar-divisi',location:'Sidoarjo, Jawa Timur'},
  {id:'4',position:'Warehouse & Production Administrative Staff',company:'UD Duta Pangan (Food Manufacturing & Distribution)',period:'Juni 2024 – Desember 2024 · 7 Bulan · Contract',icon:'📦',tags:'FIFO/FEFO,Stock Opname,5S,Vendor Coordination',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Mengelola administrasi produksi harian untuk 25 SKU, melacak ±100kg penggunaan bahan baku berbasis tepung per SKU\n• Menerapkan metode inventory FIFO/FEFO untuk meminimalkan pemborosan bahan baku dan menjaga kesegaran produk\n• Menjaga safety stock buffer untuk bahan baku mudah rusak guna mencegah stockout dan meminimalkan risiko kerusakan\n• Menetapkan level stok min-max serta batch/lot tracking untuk mencegah stockout, mengurangi overstock, dan menjaga traceability\n• Mengatur layout gudang dengan sistem put-away & picking serta prinsip 5S untuk penyimpanan & pengambilan yang efisien\n• Berkoordinasi dengan vendor & supplier terkait jadwal pengiriman bahan baku demi kelancaran produksi\n• Memantau inventori bahan baku & produk di 200+ SKU, menjaga akurasi stok 85% melalui stock opname rutin\n• Melakukan closing bulanan untuk merekonsiliasi data inventori, produksi, dan distribusi di akhir bulan',location:'Sidoarjo, Jawa Timur'},
  {id:'5',position:'Sales Marketing Positions',company:'UD Duta Pangan (Food Manufacturing)',period:'Januari 2024 – Juli 2024 · 7 Bulan · Contract',icon:'📈',tags:'Marketing,Sales Operations',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Sales Lapangan\n• Menjual Produk Premix Tepung Bakso',location:'Sidoarjo, Jawa Timur'},
  {id:'6',position:'Driver Bike',company:'Grab',period:'Februari 2022 – Desember 2025 · 3 Tahun 11 Bulan · Part-time',icon:'🏍️',tags:'',desc:'• Mengantar penumpang dengan aman dan tepat waktu\n• Mengantar pesanan makanan (GrabFood)\n• Mengantar paket/barang (GrabExpress)\n• Melayani titip belanja (GrabMart)\n• Menjaga rating dan kepuasan pelanggan\n• Mematuhi standar keselamatan berkendara',location:'Jakarta, Indonesia'},
  {id:'7',position:'Crew',company:'PT. Richeese Kuliner Indonesia',period:'Oktober 2023 – Januari 2024 · 4 Bulan · Contract',icon:'🍗',tags:'Cooking,Platting',desc:'• Memasak ayam goreng crispy sesuai SOP dan standar resep\n• Meracik sauce/saus sesuai standar rasa perusahaan\n• Melakukan food preparation harian (marinasi, potong, susun stok)\n• Menjaga kualitas dan kebersihan bahan baku (food safety)\n• Merekap inventory harian (stok masuk, terpakai, sisa stok)\n• Melaporkan kebutuhan restock ke supervisor/leader shift\n• Berkoordinasi dengan tim dapur dan kasir untuk kelancaran operasional\n• Menjaga kecepatan penyajian sesuai target service time',location:'Indonesia'},
  {id:'8',position:'Kitchen Staff',company:'Mikane Gepuktular',period:'Januari 2023 – November 2023 · 11 Bulan · Part-time',icon:'👨\u200d🍳',tags:'',desc:'• Sebagai Juru Masak Dan Persiapan Bahan Mentah',location:'Malang, Jawa Timur'},
  {id:'9',position:'Crew',company:'Mie Gacoan',period:'Oktober 2022 – Desember 2022 · 3 Bulan · Contract',icon:'🍜',tags:'Hospitality Industry,Food and Beverage Operations',desc:'• Hospitality Customer',location:'Indonesia'},
  {id:'10',position:'Welding Operator',company:'Lancar Jaya Kota Malang',period:'Agustus 2018 – Januari 2021 · 2 Tahun 6 Bulan · Freelance',icon:'🔩',tags:'Welding,Project Planning',desc:'• Operator welder pembuatan pagar, tralis, kanopi, rolling door, dll hingga finishing serta pemasangan di lapangan',location:'Kota Malang, Jawa Timur'},
  {id:'11',position:'Human Resources Assistant',company:'Dinas Sosial PPPA Kab Nganjuk',period:'Mei 2017 – Juni 2018 · 1 Tahun 2 Bulan · Full-time',icon:'🏛️',tags:'Sumber Daya Manusia (SDM),Project Management',desc:'• Staff SDM bertugas dalam menyiapkan materi untuk anggota Forum Perlindungan Anak Nganjuk untuk mewujudkan nganjuk kabupaten layak anak',location:'Nganjuk, Jawa Timur'},
  {id:'12',position:'Human Resources Assistant',company:'Dinas Kesehatan Nganjuk',period:'Maret 2016 – Mei 2017 · 1 Tahun 3 Bulan · Full-time',icon:'🏛️',tags:'Sumber Daya Manusia (SDM),Project Management',desc:'• Sebagai staff yang menangani perencanaan kegiatan dan agenda program kerja dalam mensosialisasikan kesehatan remaja di kabupaten nganjuk',location:'Nganjuk, Jawa Timur'}
];
const D_EXP_EN:ExpItem[]=[
  {id:'1',position:'Staff HRD / General Affairs',company:'UD Duta Pangan (Food Manufacturing & Distribution)',period:'Jun 2025 – Jun 2026 · 1 Year 1 Month · Full-time',icon:'👥',tags:'Payroll,BPJS,OSS Licensing,Legal & Notary,Jobdesc & KPI 6 Divisions,Facilities & Assets',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Processed monthly payroll for 121 employees, including salary, deductions, and bonus calculations\n• Calculated and administered BPJS Kesehatan and BPJS Ketenagakerjaan contributions for 121 employees, ensuring full compliance and on-time submission\n• Managed business licensing and legal compliance through the government\u2019s OSS platform, including registration and renewal of NIB, business deeds (Akta), SK Kemenkumham, NPWP, and SIUP for CV and PT entities\n• Coordinated internal and external administrative processes, including notary-related documentation and periodic renewal of legal and tax-related company documents\n• Drafted job descriptions and conducted KPI evaluations across 6 divisions (Executive, Finance, Logistics, Warehouse, Marketing, and HR/General Affairs) to determine contract renewals and staffing decisions\n• Managed company facilities and operational assets, including delivery vehicles (blind vans, trucks, motorcycles), office and production equipment, and building utilities across multiple cities',location:'Sidoarjo, Jawa Timur'},
  {id:'2',position:'Human Resources Generalist',company:'UD Duta Pangan (Food Manufacturing)',period:'Jun 2025 – Jun 2026 · 1 Year 1 Month · Full-time',icon:'🧑\u200d💼',tags:'BPJS,Workload Analysis',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'',location:'Sidoarjo, Jawa Timur'},
  {id:'3',position:'IT Support Specialist',company:'UD Duta Pangan (Food Manufacturing & Distribution)',period:'Jan 2025 – Jun 2025 · 6 Months · Full-time',icon:'💻',tags:'Technical Support,Preventive Maintenance,Mikrotik & Wireshark,Self-Developed ERP/SaaS',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Maintained 90% device uptime across 30 computer and office devices through regular preventive maintenance\n• Handled 1-3 support tickets daily, resolving minor issues within 30 minutes and major issues (including part procurement) within 1-2 hours\n• Reduced recurring IT incidents by 50% and eliminated dependency on external technicians by establishing an in-house IT support function\n• Implemented Class Based Queuing (CBQ) using Mikrotik and Winbox to allocate exclusive bandwidth for priority divisions while limiting general network access, monitored via Wireshark on a Linux-based system\n• Designed and implemented a real-time, web-based ERP/SaaS system to replace manual, paper-based, offline Excel reporting, reducing report turnaround time from 4 hours to under 1 hour and eliminating inter-division reporting delays',location:'Sidoarjo, Jawa Timur'},
  {id:'4',position:'Warehouse & Production Administrative Staff',company:'UD Duta Pangan (Food Manufacturing & Distribution)',period:'Jun 2024 – Dec 2024 · 7 Months · Contract',icon:'📦',tags:'FIFO/FEFO,Stock Opname,5S,Vendor Coordination',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Managed daily production administration for 25 SKUs, tracking approximately 100kg of flour-based raw material usage per SKU\n• Applied FIFO / FEFO inventory methods to minimize raw material waste and ensure product freshness\n• Maintained safety stock buffers for perishable raw materials to prevent stockouts and minimize spoilage risk\n• Set min-max stock levels and batch/lot tracking to prevent stockouts, reduce overstock, and maintain traceability\n• Organized warehouse layout using put-away and picking systems and 5S principles for efficient storage and retrieval\n• Coordinated with vendors and suppliers on raw material delivery schedules to ensure production continuity\n• Monitored raw material and product inventory across 200+ SKUs, maintaining 85% stock accuracy through regular stock opname\n• Performed monthly closing to reconcile inventory, production, and distribution records at month-end',location:'Sidoarjo, Jawa Timur'},
  {id:'5',position:'Sales Marketing Positions',company:'UD Duta Pangan (Food Manufacturing)',period:'Jan 2024 – Jul 2024 · 7 Months · Contract',icon:'📈',tags:'Marketing,Sales Operations',logoUrl:'https://images.unsplash.com/photo-1786148203853-09d9383c7511?auto=format&fit=crop&w=200&q=80',desc:'• Field sales\n• Sold Premix Meatball Flour products',location:'Sidoarjo, Jawa Timur'},
  {id:'6',position:'Driver Bike',company:'Grab',period:'Feb 2022 – Dec 2025 · 3 Years 11 Months · Part-time',icon:'🏍️',tags:'',desc:'• Delivered passengers safely and on time\n• Delivered food orders (GrabFood)\n• Delivered packages/goods (GrabExpress)\n• Handled shopping requests (GrabMart)\n• Maintained customer rating and satisfaction\n• Complied with driving safety standards',location:'Jakarta, Indonesia'},
  {id:'7',position:'Crew',company:'PT. Richeese Kuliner Indonesia',period:'Oct 2023 – Jan 2024 · 4 Months · Contract',icon:'🍗',tags:'Cooking,Plating',desc:'• Cooked crispy fried chicken per SOP and recipe standards\n• Prepared sauces to the company\u2019s taste standards\n• Performed daily food preparation (marinating, cutting, stock arrangement)\n• Maintained raw-material quality and cleanliness (food safety)\n• Recorded daily inventory (stock in, used, remaining)\n• Reported restock needs to the supervisor/shift leader\n• Coordinated with the kitchen and cashier team for smooth operations\n• Maintained serving speed to meet service-time targets',location:'Indonesia'},
  {id:'8',position:'Kitchen Staff',company:'Mikane Gepuktular',period:'Jan 2023 – Nov 2023 · 11 Months · Part-time',icon:'👨\u200d🍳',tags:'',desc:'• Cook and raw-material preparation',location:'Malang, Jawa Timur'},
  {id:'9',position:'Crew',company:'Mie Gacoan',period:'Oct 2022 – Dec 2022 · 3 Months · Contract',icon:'🍜',tags:'Hospitality Industry,Food and Beverage Operations',desc:'• Hospitality customer service',location:'Indonesia'},
  {id:'10',position:'Welding Operator',company:'Lancar Jaya Kota Malang',period:'Aug 2018 – Jan 2021 · 2 Years 6 Months · Freelance',icon:'🔩',tags:'Welding,Project Planning',desc:'• Welding operator producing fences, railings, canopies, rolling doors, etc. through finishing and on-site installation',location:'Kota Malang, Jawa Timur'},
  {id:'11',position:'Human Resources Assistant',company:'Dinas Sosial PPPA Kab Nganjuk',period:'May 2017 – Jun 2018 · 1 Year 2 Months · Full-time',icon:'🏛️',tags:'Human Resources,Project Management',desc:'• HR staff preparing materials for the Nganjuk Child Protection Forum to support a child-friendly Nganjuk regency',location:'Nganjuk, Jawa Timur'},
  {id:'12',position:'Human Resources Assistant',company:'Dinas Kesehatan Nganjuk',period:'Mar 2016 – May 2017 · 1 Year 3 Months · Full-time',icon:'🏛️',tags:'Human Resources,Project Management',desc:'• Staff handling planning of activities and program agendas for youth-health outreach in Nganjuk regency',location:'Nganjuk, Jawa Timur'}
];

/* ─── Logo Perusahaan: upload manual (logoUrl) atau otomatis cari via Clearbit
   untuk perusahaan/PT besar yang dikenal. Jika tidak ditemukan, fallback ke emoji icon. ─── */
const KNOWN_LOGO_DOMAINS:Record<string,string>={
  'grab':'grab.com',
  'richeese':'richeesefactory.com',
  'mie gacoan':'miegacoan.com',
  'dinas sosial':'dinsospppa.nganjukkab.go.id',
  'dinas kesehatan':'dinkes.nganjukkab.go.id',
};
const guessLogoDomain=(company:string):string|null=>{
  const c=company.toLowerCase();
  for(const key in KNOWN_LOGO_DOMAINS) if(c.includes(key)) return KNOWN_LOGO_DOMAINS[key];
  return null;
};
const resolveLogo=(exp:{company:string;logoUrl?:string}):string|null=>{
  if(exp.logoUrl) return exp.logoUrl;
  const domain=guessLogoDomain(exp.company);
  return domain?`https://logo.clearbit.com/${domain}`:null;
};

/* ─── Grouping pengalaman kerja per perusahaan (layout infografis) ───
   Kalau ada beberapa posisi di perusahaan yang sama, dikelompokkan jadi
   1 blok: shape besar utama (nama perusahaan + total masa kerja gabungan)
   dengan tiap posisi sebagai "turunan" di bawahnya, dihubungkan garis
   pohon. Perusahaan dengan 1 posisi tetap tampil sebagai kartu biasa. */
const MONTH_MAP:Record<string,number>={
  januari:0,jan:0,february:1,februari:1,feb:1,maret:2,mar:2,april:3,apr:3,
  mei:4,may:4,juni:5,jun:5,juli:6,jul:6,agustus:7,aug:7,agu:7,
  september:8,sep:8,sept:8,oktober:9,oct:9,okt:9,november:10,nov:10,
  desember:11,dec:11,des:11,
};
const parseMonthYear=(str:string):{y:number;m:number}|null=>{
  const mm=str.trim().match(/([A-Za-zÀ-ÿ]+)\s+(\d{4})/);
  if(!mm) return null;
  const mon=MONTH_MAP[mm[1].toLowerCase()];
  if(mon===undefined) return null;
  return {y:parseInt(mm[2],10),m:mon};
};
const parsePeriodRange=(period:string):{start:{y:number;m:number};end:{y:number;m:number}}|null=>{
  const beforeDot=period.split('·')[0];
  const parts=beforeDot.split(/[–-]/);
  if(parts.length<2) return null;
  const start=parseMonthYear(parts[0]);
  const end=parseMonthYear(parts[1]);
  if(!start||!end) return null;
  return {start,end};
};
const formatDuration=(totalMonths:number,lang:'id'|'en'):string=>{
  const years=Math.floor(totalMonths/12);
  const months=totalMonths%12;
  const parts:string[]=[];
  if(lang==='en'){
    if(years) parts.push(`${years} Year${years>1?'s':''}`);
    if(months) parts.push(`${months} Month${months>1?'s':''}`);
    return parts.join(' ')||'—';
  }
  if(years) parts.push(`${years} Tahun`);
  if(months) parts.push(`${months} Bulan`);
  return parts.join(' ')||'—';
};
const computeTotalDuration=(items:ExpItem[],lang:'id'|'en'):string=>{
  let minStart:{y:number;m:number}|null=null, maxEnd:{y:number;m:number}|null=null;
  items.forEach(it=>{
    const r=parsePeriodRange(it.period);
    if(!r) return;
    if(!minStart||r.start.y<minStart.y||(r.start.y===minStart.y&&r.start.m<minStart.m)) minStart=r.start;
    if(!maxEnd||r.end.y>maxEnd.y||(r.end.y===maxEnd.y&&r.end.m>maxEnd.m)) maxEnd=r.end;
  });
  if(!minStart||!maxEnd) return '';
  const s:{y:number;m:number}=minStart, e:{y:number;m:number}=maxEnd;
  const totalMonths=(e.y-s.y)*12+(e.m-s.m)+1;
  return formatDuration(totalMonths,lang);
};
interface ExpGroup{ companyKey:string; companyDisplay:string; items:ExpItem[]; totalDuration:string; }
type ExpRow = { type:'group'; group:ExpGroup } | { type:'single'; item:ExpItem };
const groupExpByCompany=(exps:ExpItem[],lang:'id'|'en'):ExpRow[]=>{
  const order:string[]=[];
  const buckets:Record<string,ExpItem[]>=Object.create(null);
  exps.forEach(it=>{
    const key=it.company.split(' (')[0].trim();
    if(!buckets[key]){ buckets[key]=[]; order.push(key); }
    buckets[key].push(it);
  });
  return order.map((key):ExpRow=>{
    const items=buckets[key];
    if(items.length===1) return { type:'single', item:items[0] };
    return {
      type:'group',
      group:{ companyKey:key, companyDisplay:key, items, totalDuration:computeTotalDuration(items,lang) },
    };
  });
};

const D_CONTACT:ContactData={email:'Mahfudfebrys@gmail.com',location:'Nganjuk, Indonesia',website:'hikimori.web.id',instagram:'mahfudfebry',linkedin:'mahfud-febry-styanto',twitter:''};
const D_CERT:CertItem[]=[
  {id:'1',name:'Certified Human Resources Generalist (CHRG)',year:'2026 – 2029',issuer:'Badan Nasional Sertifikasi Profesi (BNSP)',subtitle:'Sertifikasi Kompetensi SDM',imageUrl:''},
  {id:'2',name:'Menyusun Uraian Jabatan',year:'2025',issuer:'Training MSDM — Cipta Innovasi Unggul',subtitle:'M.70SDM01.010.2',imageUrl:''},
  {id:'3',name:'Melakukan Administrasi Jaminan Sosial',year:'2025',issuer:'Training MSDM — Cipta Innovasi Unggul',subtitle:'M.70SDM01.058.2',imageUrl:''},
  {id:'4',name:'Melakukan Analisis Beban Kerja',year:'2025',issuer:'Training MSDM — Cipta Innovasi Unggul',subtitle:'M.70SDM01.011.2',imageUrl:''},
  {id:'5',name:'Administrasi Penerapan Kebijakan MSDM',year:'2025',issuer:'Training MSDM — Cipta Innovasi Unggul',subtitle:'M.70SDM01.059.2',imageUrl:''},
  {id:'6',name:'Certified Excel for Administration',year:'2024',issuer:'Jobstreet',subtitle:'Excel for Administration',imageUrl:''},
];
const D_CERT_EN:CertItem[]=[
  {id:'1',name:'Certified Human Resources Generalist (CHRG)',year:'2026 – 2029',issuer:'Badan Nasional Sertifikasi Profesi (BNSP)',subtitle:'HR Competency Certification',imageUrl:''},
  {id:'2',name:'Preparing Job Descriptions',year:'2025',issuer:'MSDM Training — Cipta Innovasi Unggul',subtitle:'M.70SDM01.010.2',imageUrl:''},
  {id:'3',name:'Administering Social Security (BPJS)',year:'2025',issuer:'MSDM Training — Cipta Innovasi Unggul',subtitle:'M.70SDM01.058.2',imageUrl:''},
  {id:'4',name:'Conducting Workload Analysis',year:'2025',issuer:'MSDM Training — Cipta Innovasi Unggul',subtitle:'M.70SDM01.011.2',imageUrl:''},
  {id:'5',name:'HR Policy Implementation Administration',year:'2025',issuer:'MSDM Training — Cipta Innovasi Unggul',subtitle:'M.70SDM01.059.2',imageUrl:''},
  {id:'6',name:'Certified Excel for Administration',year:'2024',issuer:'Jobstreet',subtitle:'Excel for Administration',imageUrl:''},
];
const FALLBACK_PHOTO='https://res.cloudinary.com/dl4pyan8v/image/upload/f_auto,q_auto/v1783866519/Mahfudfebry_casual_oj8r1d.png';
/* Hero visual sekarang full CSS/SVG (lihat komponen HeroVisual) —
   tidak ada lagi request video, jadi hero load instan & jauh lebih ringan. */

/* Deteksi jaringan lemot / mode hemat data (Network Information API).
   Kalau terdeteksi, video hero di-skip (ganti gradient statis) supaya
   hemat kuota & RAM — fitur lain tetap 100% jalan seperti biasa. */
const useLiteMode = (): boolean => {
  const [lite, setLite] = React.useState(false);
  React.useEffect(() => {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!conn) return;
    const check = () => setLite(!!conn.saveData || ['slow-2g', '2g', '3g'].includes(conn.effectiveType));
    check();
    conn.addEventListener?.('change', check);
    return () => conn.removeEventListener?.('change', check);
  }, []);
  return lite;
};

/* ─── HeroVisual: pengganti video hero ───
   Full CSS/SVG, tanpa file media sama sekali — load instan, hampir
   tidak makan RAM/CPU. Gaya profesional-minimalis: gradient navy
   lembut, "tirai" aurora cyan/navy yang mengalir pelan (3 lapis pita
   elongated) dan bereaksi terhadap posisi kursor (parallax + spotlight),
   grid garis tipis ala blueprint, dan satu lingkaran ensō tipis sebagai
   sentuhan Jepang yang halus. Posisi kursor dibaca lewat CSS variable
   (--hero-px/py/dx/dy, di-set oleh <section id="hk-hero"> lewat
   onMouseMove) — jadi TIDAK memicu re-render React sama sekali saat
   mouse bergerak, tetap ringan. `reduced` mematikan animasi untuk
   jaringan lemot / hemat baterai / prefers-reduced-motion. */
const HeroVisual: React.FC<{ reduced?: boolean }> = ({ reduced }) => (
  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', background: 'linear-gradient(155deg, #0A1522 0%, #0E1B2C 55%, #132437 100%)' }}>
    {/* grid tipis ala blueprint */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(1,169,242,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(1,169,242,0.05) 1px, transparent 1px)',
      backgroundSize: '56px 56px',
      maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 90%)',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 90%)',
    }} />
    {/* ── Tirai Aurora — 3 pita cahaya elongated, saling silang, mengalir pelan
         + parallax halus mengikuti kursor (translate berlawanan arah dikit) ── */}
    <div
      className="hero-aurora-parallax"
      style={{ position: 'absolute', inset: '-10%', filter: 'blur(60px)', mixBlendMode: 'screen' }}
    >
      <div className={reduced ? '' : 'aurora-ribbon-1'} style={{ position: 'absolute', top: '5%', left: '-15%', width: '75%', height: '38%', borderRadius: '50%', background: 'linear-gradient(100deg, rgba(1,169,242,0.28), rgba(0,226,224,0.14) 45%, transparent 80%)', transform: 'rotate(-8deg)' }} />
      <div className={reduced ? '' : 'aurora-ribbon-2'} style={{ position: 'absolute', top: '30%', right: '-20%', width: '70%', height: '42%', borderRadius: '50%', background: 'linear-gradient(-100deg, rgba(0,82,245,0.26), rgba(51,118,250,0.12) 45%, transparent 80%)', transform: 'rotate(6deg)' }} />
      <div className={reduced ? '' : 'aurora-ribbon-3'} style={{ position: 'absolute', bottom: '-5%', left: '10%', width: '65%', height: '35%', borderRadius: '50%', background: 'linear-gradient(95deg, rgba(102,153,255,0.16), rgba(153,255,255,0.07) 50%, transparent 85%)', transform: 'rotate(-4deg)' }} />
    </div>
    {/* Spotlight cyan mengikuti kursor — menyatu dgn aurora lewat mix-blend-mode */}
    <div className="hero-cursor-spotlight" style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(420px circle at var(--hero-px,50%) var(--hero-py,50%), rgba(1,169,242,0.28), transparent 70%)',
      mixBlendMode: 'screen', opacity: 0, transition: 'opacity 0.4s ease',
    }} />
    {/* ensō — lingkaran tinta tipis, sentuhan Jepang minimal */}
    <svg viewBox="0 0 400 400" style={{ position: 'absolute', top: '50%', left: '50%', width: 'min(60vw,560px)', height: 'min(60vw,560px)', transform: 'translate(-50%,-50%)', opacity: 0.07 }}>
      <circle cx="200" cy="200" r="160" fill="none" stroke="#99FFFF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="880" strokeDashoffset="70" />
    </svg>
    {/* vignette bawah supaya teks hero tetap kontras */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(6,13,22,0.55) 100%)' }} />
  </div>
);
const CONTACT_VIDEO='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES_LIST=['Website','Mobile App','Web App','E-Commerce','Visual Identity','3D & Motion','Digital Marketing','Growth & Consulting','Other'];
const ls=<T,>(key:string,fb:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fb;}catch{return fb;}};
const lsRaw=<T,>(key:string):T|null=>{try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}};

/* ─── Sosmed Button: hanya icon, hover slide muncul username ─── */
const SOSMED_CFG:{key:keyof AboutData;label:string;color:string;href:(v:string)=>string;svg:React.ReactNode}[]=[
  {key:'instagram',label:'Instagram',color:'#E1306C',href:v=>`https://instagram.com/${v}`,svg:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1.1em',height:'1.1em'}}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>},
  {key:'linkedin',label:'LinkedIn',color:'#0A66C2',href:v=>`https://linkedin.com/in/${v}`,svg:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1.1em',height:'1.1em'}}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>},
  {key:'whatsapp',label:'WhatsApp',color:'#25D366',href:v=>`https://wa.me/${v}`,svg:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1.1em',height:'1.1em'}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>},
  {key:'threads',label:'Threads',color:'#fff',href:v=>`https://threads.net/@${v}`,svg:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1.1em',height:'1.1em'}}><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.513 5.465l-2.167.578c-1.084-4.015-3.897-6.084-8.18-6.115-2.909.024-5.11.936-6.54 2.717C4.307 6.35 3.616 8.73 3.589 12c.027 3.27.718 5.65 2.057 7.259 1.429 1.78 3.631 2.692 6.54 2.717 1.866-.016 3.421-.425 4.597-1.215 1.355-.908 2.095-2.346 2.206-4.28a6.44 6.44 0 00-.123-1.517c-.22-1.036-.71-1.833-1.394-2.301-.43-.295-.933-.481-1.489-.552-.24 2.058-1.017 3.488-2.315 4.252-1.146.679-2.566.775-3.972.269-1.237-.45-2.204-1.354-2.72-2.542-.47-1.094-.513-2.32-.121-3.45.6-1.726 1.997-2.742 3.787-2.781.577-.013 1.133.068 1.647.238-.036-.264-.054-.538-.054-.819 0-.666.12-1.316.358-1.933.239-.617.588-1.177 1.039-1.669l1.619 1.48c-.574.63-.868 1.413-.868 2.122 0 .276.025.548.075.812.356.108.696.257 1.014.448 1.16.697 1.904 1.873 2.19 3.4.147.786.19 1.59.128 2.389-.178 2.507-1.224 4.434-3.028 5.573-1.464.924-3.311 1.398-5.493 1.411zm-.56-9.72c-.851.018-1.538.478-1.826 1.213-.196.502-.18 1.066.047 1.594.25.585.76 1.038 1.417 1.27.732.264 1.53.208 2.186-.152.723-.393 1.236-1.177 1.42-2.188a6.39 6.39 0 00-1.516-.604 6.57 6.57 0 00-1.728-.133z"/></svg>},
  {key:'tiktok',label:'TikTok',color:'#ff0050',href:v=>`https://tiktok.com/@${v}`,svg:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1.1em',height:'1.1em'}}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>},
  {key:'email',label:'Email',color:'#0092C7',href:v=>`mailto:${v}`,svg:<svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1.1em',height:'1.1em'}}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>},
];
const SosmedButtons:React.FC<{about:AboutData}>=({about})=>(
  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.2rem'}}>
    {SOSMED_CFG.map(({key,label,color,href,svg})=>{
      const val=(about as any)[key] as string|undefined;
      if(!val) return null;
      return (
        <motion.a key={key} href={href(val)} target="_blank" rel="noopener noreferrer"
          initial="rest" whileHover="hover" animate="rest"
          style={{display:'inline-flex',alignItems:'center',overflow:'hidden',borderRadius:8,background:'rgba(255,255,255,0.06)',border:`1px solid rgba(255,255,255,0.12)`,textDecoration:'none',cursor:'pointer',height:36}}>
          {/* Icon */}
          <motion.span style={{color,display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,flexShrink:0,fontSize:'1.1rem'}}>
            {svg}
          </motion.span>
          {/* Username slide */}
          <motion.span
            variants={{rest:{width:0,opacity:0,paddingRight:0},hover:{width:'auto',opacity:1,paddingRight:12}}}
            transition={{duration:0.25,ease:'easeOut'}}
            style={{color:'rgba(255,255,255,0.88)',fontSize:'0.72rem',fontWeight:600,fontFamily:'var(--font-body)',whiteSpace:'nowrap',overflow:'hidden',display:'block',paddingLeft:2}}>
            {val}
          </motion.span>
        </motion.a>
      );
    })}
  </div>
);


const useIsMobile=()=>{const [m,setM]=useState(()=>typeof window!=='undefined'&&window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[]);return m;};

/* ══════════════════════════════════════════
   PALETTE — Red · Black · Gold · White
   書道カラー
══════════════════════════════════════════ */
const J={
  // Blacks
  ink:'#0A1522',   inkD:'#060D16',   inkM:'#0E1B2C',   inkL:'#132437',   charcoal:'#16283D',
  // Crimsons
  red:'#0052F5',   redL:'#3376FA',   redD:'#0041C4', redV:'#6699FF',
  redGlow:'rgba(0,82,245,0.35)',  redBg:'rgba(0,82,245,0.08)',
  // Golds
  gold:'#0092C7',  goldL:'#01A9F2',  goldB:'#99FFFF', goldD:'#006B94',
  goldGlow:'rgba(0,146,199,0.3)',  goldBg:'rgba(0,146,199,0.08)',
  // Whites
  white:'#EAF2F8', whiteD:'#B8C9DA', whiteDim:'rgba(234,242,248,0.65)',
  // Overlays
  ov78:'rgba(6,14,24,0.78)',  ov82:'rgba(6,14,24,0.82)',  ov85:'rgba(5,11,20,0.85)',  ov88:'rgba(4,9,17,0.88)',
};

/* ══════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════ */
const LG:React.CSSProperties={background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',boxShadow:'inset 0 1px 1px rgba(255,255,255,0.08)',position:'relative'};

const FadeIn:React.FC<{children:React.ReactNode;delay?:number;duration?:number;style?:React.CSSProperties}>=({children,delay=0,duration=1000,style={}})=>{
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t);},[delay]);
  return <div style={{opacity:v?1:0,transition:`opacity ${duration}ms ease`,...style}}>{children}</div>;
};

const AnimatedHeading:React.FC<{text:string;style?:React.CSSProperties}>=({text,style={}})=>{
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t);},[]);
  const lines=text.split('\n');
  return <h1 style={{margin:0,...style}}>{lines.map((line,li)=>{const prev=lines.slice(0,li).reduce((acc,l)=>acc+l.length,0);return <span key={li} style={{display:'block'}}>{line.split('').map((char,ci)=>{const d=(200+(prev+ci)*30)/1000;return <span key={ci} style={{display:'inline-block',opacity:a?1:0,transform:a?'none':'translateX(-18px)',transition:`opacity 500ms ease ${d}s,transform 500ms ease ${d}s`}}>{char===' '?'\u00A0':char}</span>;})}</span>;})}  </h1>;
};

const ShineHeading:React.FC<{text:string;style?:React.CSSProperties}>=({text,style={}})=>{
  const [a,setA]=useState(false);
  const isMobile=useIsMobile();
  useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t);},[]);
  return <>
    <style>{`
      @keyframes shine-sweep{0%{left:-120%}100%{left:150%}}
      .shine-wrap{position:relative;display:inline-block;overflow:visible;}
      .shine-wrap::after{content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.55) 50%,rgba(255,220,100,0.35) 60%,transparent 80%);animation:shine-sweep 3s ease-in-out infinite;pointer-events:none;}
    `}</style>
    <motion.h1
      className="shine-wrap"
      whileHover={{scale:1.14,textShadow:'4px 4px 0px rgba(0,82,245,1),8px 8px 0px rgba(9,74,112,0.85),13px 13px 0px rgba(6,50,76,0.65),18px 18px 28px rgba(0,0,0,0.95),0 0 80px rgba(0,146,199,0.65),0 0 140px rgba(0,82,245,0.45),0 0 200px rgba(0,82,245,0.2)'}}
      transition={{type:'spring',stiffness:220,damping:18}}
      style={{
        margin:0,
        cursor:'default',
        whiteSpace:isMobile?'normal':'nowrap',
        fontSize:isMobile?'clamp(1.3rem,6.5vw,2.2rem)':'clamp(2rem,5.5vw,5rem)',
        textAlign:'center',
        display:'inline-block',
        textShadow:`2px 2px 0px rgba(0,82,245,0.9),4px 4px 0px rgba(9,74,112,0.7),6px 6px 0px rgba(6,50,76,0.5),8px 8px 12px rgba(0,0,0,0.8),0 0 30px rgba(0,146,199,0.3)`,
        ...style
      }}>
      {text.split('').map((char,ci)=>{
        const d=(200+ci*25)/1000;
        return <span key={ci} style={{display:'inline-block',opacity:a?1:0,transform:a?'none':'translateX(-18px)',transition:`opacity 500ms ease ${d}s,transform 500ms ease ${d}s`}}>{char===' '?'\u00A0':char}</span>;
      })}
    </motion.h1>
  </>;
};

const TiltCard:React.FC<{children:React.ReactNode;style?:React.CSSProperties;intensity?:number}>=({children,style={},intensity=8})=>{
  const mx=useMotionValue(0),my=useMotionValue(0);
  const rx=useSpring(useTransform(my,[-0.5,0.5],[intensity,-intensity]),{stiffness:200,damping:30});
  const ry=useSpring(useTransform(mx,[-0.5,0.5],[-intensity,intensity]),{stiffness:200,damping:30});
  const gx=useTransform(mx,[-0.5,0.5],['0%','100%']);
  const gy=useTransform(my,[-0.5,0.5],['0%','100%']);
  const move=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();mx.set((e.clientX-r.left)/r.width-0.5);my.set((e.clientY-r.top)/r.height-0.5);};
  return <motion.div style={{perspective:900,transformStyle:'preserve-3d',...style}} onMouseMove={move} onMouseLeave={()=>{mx.set(0);my.set(0);}}>
    <motion.div style={{rotateX:rx,rotateY:ry,transformStyle:'preserve-3d',width:'100%',height:'100%',position:'relative'}}>
      {children}
      <motion.div style={{position:'absolute',inset:0,borderRadius:'inherit',pointerEvents:'none',background:`radial-gradient(circle at ${gx} ${gy},rgba(0,146,199,0.1) 0%,transparent 65%)`,zIndex:10}}/>
    </motion.div>
  </motion.div>;
};

const Reveal:React.FC<{children:React.ReactNode;direction?:'up'|'left'|'right'|'scale'|'fade';delay?:number;style?:React.CSSProperties}>=({children,direction='up',delay=0,style={}})=>{
  const v={hidden:{opacity:0,y:direction==='up'?50:0,x:direction==='left'?-50:direction==='right'?50:0,scale:direction==='scale'?0.8:1,filter:'blur(4px)'},visible:{opacity:1,y:0,x:0,scale:1,filter:'blur(0px)',transition:{duration:0.9,ease:[0.22,1,0.36,1],delay}}};
  return <motion.div variants={v} initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} style={style}>{children}</motion.div>;
};

/* ─── SkillDesc: deskripsi skill dengan tombol "Lihat Selengkapnya" ───
   Deteksi overflow BENERAN (scrollHeight vs clientHeight) lewat ref,
   bukan nebak dari panjang karakter — jadi tombol cuma muncul kalau
   teksnya emang kepotong 2 baris, nggak muncul kalau udah muat semua.
   Dipakai di kartu Hard/Soft Skill Home.tsx & About.tsx (reusable). */
export const SkillDesc:React.FC<{desc:string;color:string;fontSize?:string}>=({desc,color,fontSize='0.82rem'})=>{
  const ref=useRef<HTMLParagraphElement>(null);
  const [expanded,setExpanded]=useState(false);
  const [overflowing,setOverflowing]=useState(false);
  const {t}=useLang();

  useEffect(()=>{
    const check=()=>{
      const el=ref.current;
      if(!el) return;
      setOverflowing(el.scrollHeight>el.clientHeight+1);
    };
    check();
    window.addEventListener('resize',check);
    return ()=>window.removeEventListener('resize',check);
  },[desc]);

  return (
    <div style={{position:'relative',zIndex:1}}>
      <p ref={ref} className={expanded?'text-justify-auto':'skill-desc-clamp'} style={{color,fontSize,lineHeight:1.3}}>{desc}</p>
      {(overflowing||expanded)&&(
        <button onClick={()=>setExpanded(e=>!e)} style={{marginTop:'0.4rem',background:'none',border:'none',padding:0,color:'var(--amber)',fontWeight:700,fontSize:'0.72rem',cursor:'pointer',fontFamily:'var(--font-body)',display:'inline-flex',alignItems:'center',gap:'0.25rem'}}>
          {expanded?t('Sembunyikan','Show Less'):t('Lihat Selengkapnya','Read More')}
          <span aria-hidden="true" style={{display:'inline-block',transition:'transform 0.2s',transform:expanded?'rotate(180deg)':'none'}}>▾</span>
        </button>
      )}
    </div>
  );
};

const InkRipple:React.FC<{children:React.ReactNode;style?:React.CSSProperties}>=({children,style={}})=>{
  const [rips,setRips]=useState<{id:number;x:number;y:number}[]>([]);
  const click=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();const id=Date.now();
    setRips(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRips(p=>p.filter(r=>r.id!==id)),900);
  };
  return <div style={{position:'relative',overflow:'hidden',...style}} onClick={click}>
    {children}
    {rips.map(r=><motion.div key={r.id} style={{position:'absolute',left:r.x,top:r.y,width:0,height:0,borderRadius:'50%',border:`2px solid ${J.red}`,transform:'translate(-50%,-50%)',pointerEvents:'none'}}
      animate={{width:240,height:240,opacity:[0.7,0]}} transition={{duration:0.9,ease:'easeOut'}}/>)}
  </div>;
};

/* ══════════════════════════════════════════
   STARS (hero bg — unchanged)
══════════════════════════════════════════ */
const Stars:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    const stars=Array.from({length:100},()=>({x:Math.random()*1400,y:Math.random()*900,r:Math.random()*1.2+0.2,a:Math.random(),da:(Math.random()*0.005+0.001)*(Math.random()<0.5?1:-1)}));
    const shoots:any[]=[]; let next=0,t=0;
    const spawn=()=>{const a=(Math.random()*25+15)*Math.PI/180,sp=Math.random()*7+6,len=Math.random()*120+80,life=len/sp;shoots.push({x:Math.random()*c.width*0.8,y:Math.random()*c.height*0.4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len,life,maxLife:life});};
    const tick=()=>{ctx.clearRect(0,0,c.width,c.height);stars.forEach(s=>{s.a=Math.max(0.1,Math.min(1,s.a+s.da));if(s.a<=0.1||s.a>=1)s.da*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(234,242,248,${s.a})`;ctx.fill();});
      t++;if(t>=next){spawn();next=t+Math.floor(Math.random()*200+100);}
      for(let i=shoots.length-1;i>=0;i--){const s=shoots[i];const prog=1-s.life/s.maxLife;const alpha=s.life<20?s.life/20:1;const ang=Math.atan2(s.vy,s.vx);const tx=s.x-Math.cos(ang)*s.len*Math.min(prog*2,1);const ty=s.y-Math.sin(ang)*s.len*Math.min(prog*2,1);const g=ctx.createLinearGradient(tx,ty,s.x,s.y);g.addColorStop(0,'rgba(0,146,199,0)');g.addColorStop(1,`rgba(234,242,248,${alpha})`);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.stroke();s.x+=s.vx;s.y+=s.vy;s.life--;if(s.life<=0)shoots.splice(i,1);}
      raf=requestAnimationFrame(tick);};
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}/>;
};

/* ══════════════════════════════════════════
   CALLIGRAPHY ASSETS — Red · Black · Gold
══════════════════════════════════════════ */

/* Animated ink brush stroke canvas */
const InkBrushCanvas:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    interface Stroke{x:number;y:number;pts:{x:number;y:number}[];len:number;maxLen:number;vx:number;vy:number;w:number;color:string;alpha:number;life:number;}
    const strokes:Stroke[]=[];let next=0,t=0;
    const spawnStroke=()=>{
      const isRed=Math.random()<0.3;
      const color=isRed?`rgba(0,82,245,`:`rgba(0,146,199,`;
      const maxLen=Math.floor(Math.random()*80+40);
      strokes.push({
        x:Math.random()*c.width,y:Math.random()*c.height,
        pts:[],len:0,maxLen,
        vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*1.5,
        w:Math.random()*3+1,
        color,alpha:Math.random()*0.35+0.1,life:maxLen+60,
      });
    };
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      t++;if(t>=next){spawnStroke();next=t+Math.floor(Math.random()*120+60);}
      for(let i=strokes.length-1;i>=0;i--){
        const s=strokes[i];
        if(s.pts.length<s.maxLen){s.pts.push({x:s.x,y:s.y});s.x+=s.vx+(Math.random()-0.5)*0.5;s.y+=s.vy+(Math.random()-0.5)*0.5;}
        if(s.pts.length>1){
          for(let j=1;j<s.pts.length;j++){
            const fade=j/s.pts.length;const decay=s.life<40?s.life/40:1;
            ctx.beginPath();ctx.moveTo(s.pts[j-1].x,s.pts[j-1].y);ctx.lineTo(s.pts[j].x,s.pts[j].y);
            ctx.strokeStyle=`${s.color}${(s.alpha*fade*decay).toFixed(2)})`;
            ctx.lineWidth=s.w*(0.5+fade*0.5)*decay;ctx.lineCap='round';ctx.stroke();
          }
        }
        s.life--;if(s.life<=0)strokes.splice(i,1);
      }
      raf=requestAnimationFrame(tick);
    };
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1}}/>;
};

/* Gold circuit lines */
const GoldLines:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    const lines=Array.from({length:16},()=>({x1:Math.random()*1400,y1:Math.random()*900,x2:Math.random()*1400,y2:Math.random()*900,prog:Math.random(),speed:Math.random()*0.003+0.001,alpha:Math.random()*0.25+0.08,dir:(Math.random()<0.5?1:-1) as 1|-1}));
    const tick=()=>{ctx.clearRect(0,0,c.width,c.height);lines.forEach(l=>{l.prog+=l.speed*l.dir;if(l.prog>1){l.prog=1;l.dir=-1;l.x2=Math.random()*c.width;l.y2=Math.random()*c.height;}if(l.prog<0){l.prog=0;l.dir=1;l.x1=Math.random()*c.width;l.y1=Math.random()*c.height;}const g=ctx.createLinearGradient(l.x1,l.y1,l.x2,l.y2);g.addColorStop(0,'rgba(0,146,199,0)');g.addColorStop(l.prog,`rgba(63,195,219,${l.alpha})`);g.addColorStop(Math.min(l.prog+0.05,1),`rgba(0,146,199,${l.alpha*0.5})`);g.addColorStop(1,'rgba(0,146,199,0)');ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);ctx.strokeStyle=g;ctx.lineWidth=0.8;ctx.stroke();const nx=l.x1+(l.x2-l.x1)*l.prog;const ny=l.y1+(l.y2-l.y1)*l.prog;ctx.beginPath();ctx.arc(nx,ny,1.5,0,Math.PI*2);ctx.fillStyle=`rgba(63,195,219,${l.alpha*1.5})`;ctx.fill();});raf=requestAnimationFrame(tick);};
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2}}/>;
};

/* Crack texture SVG */
const CrackOverlay:React.FC=()=>(
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.15}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 900">
    <path d="M120 50 L180 120 L140 200 L200 280 L160 380 L220 450 L180 560 L240 640 L200 750 L260 850" stroke="rgba(0,146,199,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    <path d="M280 30 L240 100 L290 180 L250 260 L300 350 L260 440 L310 520 L270 620 L320 720 L280 820" stroke="rgba(0,146,199,0.5)" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
    <path d="M60 150 L120 180 L80 230 L150 260 L100 320" stroke="rgba(0,82,245,0.4)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    <path d="M320 200 L360 240 L310 290 L370 340 L330 400" stroke="rgba(0,82,245,0.35)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    {[[90,300],[210,400],[330,500],[150,600],[270,700]].map(([x,y],i)=>(
      <g key={i} transform={`translate(${x},${y}) rotate(45)`}>
        <rect x="-5" y="-5" width="10" height="10" fill="none" stroke="rgba(0,146,199,0.25)" strokeWidth="0.6"/>
      </g>
    ))}
  </svg>
);

/* Smoke */
const SmokeCloud:React.FC<{style?:React.CSSProperties;delay?:number;flip?:boolean}>=({style={},delay=0,flip=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',filter:'blur(20px)',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{x:[0,12,0,-8,0],y:[0,-6,0,-4,0],opacity:[0.55,0.75,0.45,0.65,0.55]}}
    transition={{duration:9+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 200 100" width="200" height="100">
      <ellipse cx="100" cy="60" rx="90" ry="40" fill="rgba(8,5,0,0.9)"/>
      <ellipse cx="70"  cy="45" rx="55" ry="35" fill="rgba(12,6,0,0.85)"/>
      <ellipse cx="130" cy="48" rx="50" ry="30" fill="rgba(10,5,0,0.8)"/>
      <ellipse cx="100" cy="35" rx="40" ry="28" fill="rgba(15,8,0,0.75)"/>
    </svg>
  </motion.div>
);

/* Samurai Mon — bold geometric crest */
const SamuraiMon:React.FC<{style?:React.CSSProperties;delay?:number;size?:number;variant?:number}>=({style={},delay=0,size=90,variant=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{opacity:[0.15,0.4,0.15],rotate:[0,variant%2===0?3:-3,0]}}
    transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={J.gold} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke={J.red} strokeWidth="0.8" opacity="0.5"/>
      {variant===0 && <>
        {/* Tomoe (tomoe pattern - 3 comma swirls) */}
        {[0,120,240].map((_,i)=>{const a=(i*120-90)*Math.PI/180;return <path key={i} d={`M50 50 Q${50+Math.cos(a)*28} ${50+Math.sin(a)*28} ${50+Math.cos(a+Math.PI/3)*20} ${50+Math.sin(a+Math.PI/3)*20} A8 8 0 1 0 ${50+Math.cos(a)*12} ${50+Math.sin(a)*12} Z`} fill={`rgba(0,146,199,0.35)`} stroke={J.gold} strokeWidth="0.8"/>;})}
        <circle cx="50" cy="50" r="6" fill={`rgba(0,82,245,0.5)`} stroke={J.red} strokeWidth="1"/>
      </>}
      {variant===1 && <>
        {/* Diamond cross */}
        {[0,45,90,135].map((_,i)=>{const a=i*45*Math.PI/180;return <line key={i} x1={50+Math.cos(a)*8} y1={50+Math.sin(a)*8} x2={50+Math.cos(a)*38} y2={50+Math.sin(a)*38} stroke={J.gold} strokeWidth="1.5" opacity="0.7"strokeLinecap="round"/>;})}
        {[0,45,90,135,180,225,270,315].map((_,i)=>{const a=i*45*Math.PI/180;return <circle key={i} cx={50+Math.cos(a)*28} cy={50+Math.sin(a)*28} r="2.5" fill={J.gold} opacity="0.6"/>;})  }
        <polygon points="50,35 57,47 50,59 43,47" fill="none" stroke={J.red} strokeWidth="1.2" opacity="0.7"/>
      </>}
      {variant===2 && <>
        {/* Six-pointed pattern */}
        {[...Array(6)].map((_,i)=>{const a=i*60*Math.PI/180;return <polygon key={i} points={`${50+Math.cos(a)*35},${50+Math.sin(a)*35} ${50+Math.cos(a+Math.PI/6)*18},${50+Math.sin(a+Math.PI/6)*18} ${50+Math.cos(a-Math.PI/6)*18},${50+Math.sin(a-Math.PI/6)*18}`} fill={`rgba(0,146,199,0.2)`} stroke={J.gold} strokeWidth="0.8" opacity="0.7"/>;})  }
        <circle cx="50" cy="50" r="8" fill={`rgba(0,82,245,0.4)`} stroke={J.red} strokeWidth="1.2"/>
      </>}
    </svg>
    <motion.div animate={{opacity:[0.1,0.3,0.1],scale:[1,1.2,1]}} transition={{duration:3+delay,repeat:Infinity}}
      style={{position:'absolute',inset:-15,borderRadius:'50%',background:`radial-gradient(circle,rgba(0,82,245,0.2) 0%,transparent 70%)`,filter:'blur(6px)'}}/>
  </motion.div>
);

/* Katana blade silhouette */
const Katana:React.FC<{style?:React.CSSProperties;delay?:number;vertical?:boolean}>=({style={},delay=0,vertical=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transform:vertical?'rotate(90deg)':'none',...style}}
    animate={{opacity:[0.2,0.45,0.2],x:[0,3,0]}}
    transition={{duration:6+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 280 20" width="280" height="20">
      {/* Blade */}
      <path d="M0 10 L240 10 L270 8 L280 6" stroke={`rgba(234,242,248,0.6)`} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M0 10 L240 10 L270 12 L280 14" stroke={`rgba(234,242,248,0.3)`} strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      {/* Gold edge line */}
      <path d="M10 9 L240 9" stroke={J.gold} strokeWidth="0.8" opacity="0.5"/>
      {/* Tsuba (guard) */}
      <ellipse cx="28" cy="10" rx="6" ry="9" fill={`rgba(0,146,199,0.3)`} stroke={J.gold} strokeWidth="1"/>
      {/* Handle */}
      <rect x="0" y="7" width="28" height="6" rx="2" fill={`rgba(0,82,245,0.4)`} stroke={J.red} strokeWidth="0.8"/>
      {[5,10,15,20,25].map(x=><line key={x} x1={x} y1="7" x2={x+2} y2="13" stroke={`rgba(0,146,199,0.4)`} strokeWidth="0.8"/>)}
      {/* Blood groove */}
      <line x1="35" y1="9.5" x2="200" y2="9.5" stroke={`rgba(0,82,245,0.3)`} strokeWidth="0.6"/>
      {/* Tip glow */}
      <motion.circle cx="278" cy="7" r="2" fill={J.gold} animate={{opacity:[0.3,0.8,0.3]}} transition={{duration:2,repeat:Infinity,delay}}/>
    </svg>
  </motion.div>
);

/* Bold Kanji stamp effect */
const KanjiStamp:React.FC<{kanji:string;style?:React.CSSProperties;delay?:number;size?:number}>=({kanji,style={},delay=0,size=80})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    initial={{scale:0,opacity:0}} animate={{scale:[0,1.15,1],opacity:[0,0.4,0.25]}}
    transition={{duration:1.2,delay,ease:[0.22,1,0.36,1]}}>
    <motion.div animate={{opacity:[0.25,0.45,0.25]}} transition={{duration:4+delay,repeat:Infinity}}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <rect x="2" y="2" width="96" height="96" rx="4" fill="none" stroke={J.red} strokeWidth="3" opacity="0.8"/>
        <rect x="6" y="6" width="88" height="88" rx="2" fill="none" stroke={J.red} strokeWidth="1" opacity="0.5"/>
        <text x="50" y="68" textAnchor="middle" fontSize="54" fontFamily="serif" fill={`rgba(0,82,245,0.85)`} fontWeight="bold">{kanji}</text>
      </svg>
    </motion.div>
  </motion.div>
);

/* Ink ground circle (replaces kamon floor) */
const InkCircle:React.FC<{style?:React.CSSProperties;delay?:number;size?:number;color?:'red'|'gold'}>=({style={},delay=0,size=120,color='red'})=>{
  const c=color==='red'?J.red:J.gold;
  return (
    <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
      animate={{opacity:[0.1,0.3,0.1],scale:[0.96,1.04,0.96]}}
      transition={{duration:4+delay,repeat:Infinity,ease:'easeInOut',delay}}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <motion.circle cx="60" cy="60" r="55" fill="none" stroke={c} strokeWidth="2"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:2,delay:delay+0.5}}/>
        <motion.circle cx="60" cy="60" r="44" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5"
          initial={{pathLength:0}} animate={{pathLength:0.8}} transition={{duration:2.5,delay:delay+1}}/>
        {[...Array(8)].map((_,i)=>{const a=i*45*Math.PI/180;return <motion.line key={i} x1={60+Math.cos(a)*46} y1={60+Math.sin(a)*46} x2={60+Math.cos(a)*56} y2={60+Math.sin(a)*56} stroke={c} strokeWidth="1.5" opacity="0.6" initial={{opacity:0}} animate={{opacity:0.6}} transition={{delay:delay+0.1*i}}/>;})  }
        <circle cx="60" cy="60" r="6" fill={`rgba(0,82,245,0.3)`} stroke={c} strokeWidth="1"/>
      </svg>
      <motion.div animate={{opacity:[0.15,0.4,0.15]}} transition={{duration:3+delay,repeat:Infinity}}
        style={{position:'absolute',inset:-20,borderRadius:'50%',background:`radial-gradient(circle,${c}22 0%,transparent 70%)`,filter:'blur(8px)'}}/>
    </motion.div>
  );
};

/* War banner / Nobori flag */
const Nobori:React.FC<{style?:React.CSSProperties;delay?:number;kanji?:string}>=({style={},delay=0,kanji='武'})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{rotate:[0,1.5,-1,0.8,0],opacity:[0.35,0.55,0.35]}}
    transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 40 140" width="40" height="140">
      {/* Pole */}
      <line x1="20" y1="0" x2="20" y2="140" stroke="rgba(139,90,40,0.6)" strokeWidth="3" strokeLinecap="round"/>
      {/* Flag body */}
      <rect x="4" y="8" width="32" height="100" rx="2" fill={`rgba(0,82,245,0.5)`} stroke={J.red} strokeWidth="1"/>
      {/* Gold trim */}
      <rect x="4" y="8" width="32" height="6" rx="1" fill={`rgba(0,146,199,0.4)`}/>
      <rect x="4" y="102" width="32" height="6" rx="1" fill={`rgba(0,146,199,0.4)`}/>
      {/* Kanji */}
      <text x="20" y="65" textAnchor="middle" fontSize="22" fontFamily="serif" fill="rgba(245,240,220,0.8)" fontWeight="bold">{kanji}</text>
      {/* Decorative line */}
      <line x1="10" y1="80" x2="30" y2="80" stroke={`rgba(0,146,199,0.4)`} strokeWidth="0.8"/>
    </svg>
  </motion.div>
);

/* Bold horizontal brush stroke */
const BrushStroke:React.FC<{style?:React.CSSProperties;width?:number;color?:string;delay?:number}>=({style={},width=300,color=J.red,delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    initial={{scaleX:0,opacity:0}} whileInView={{scaleX:1,opacity:1}} viewport={{once:true}}
    transition={{duration:0.9,ease:[0.22,1,0.36,1],delay}}>
    <svg viewBox={`0 0 ${width} 12`} width={width} height="12">
      <path d={`M0 6 Q${width*0.3} 3 ${width*0.6} 6 Q${width*0.8} 8 ${width} 5`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.9"/>
      <path d={`M0 8 Q${width*0.3} 6 ${width*0.6} 8 Q${width*0.8} 10 ${width} 7`} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>
  </motion.div>
);

/* Torii gate — black with gold/red */
const ToriiGate:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.15})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{opacity:[opacity,opacity*1.4,opacity]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 200 260" width="200" height="260">
      <rect x="5" y="20" width="190" height="16" rx="3" fill={J.redD}/>
      <path d="M5 36 Q100 10 195 36" stroke={J.redD} strokeWidth="8" fill="none"/>
      <rect x="18" y="55" width="164" height="12" rx="2" fill={J.redV}/>
      <rect x="28" y="67" width="18" height="193" rx="4" fill={J.redL}/>
      <rect x="154" y="67" width="18" height="193" rx="4" fill={J.redL}/>
      <rect x="20" y="110" width="160" height="9" rx="2" fill={J.redD} opacity="0.7"/>
      {/* Gold accents */}
      <rect x="5" y="20" width="190" height="2" fill={J.gold} opacity="0.4"/>
      <rect x="18" y="55" width="164" height="2" fill={J.gold} opacity="0.3"/>
    </svg>
  </motion.div>
);

/* Rising sun — bold geometric */
const RisingSun:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.12})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{scale:[1,1.05,1],opacity:[opacity,opacity*1.5,opacity]}} transition={{duration:6,repeat:Infinity}}>
    <svg viewBox="0 0 160 160" width="160" height="160">
      {[...Array(16)].map((_,i)=>{const a=i*22.5*Math.PI/180;return <line key={i} x1={80+Math.cos(a)*62} y1={80+Math.sin(a)*62} x2={80+Math.cos(a)*76} y2={80+Math.sin(a)*76} stroke={J.red} strokeWidth={i%2===0?"2":"1"} opacity="0.6" strokeLinecap="round"/>;})  }
      <circle cx="80" cy="80" r="55" fill={`rgba(0,82,245,0.12)`} stroke={J.red} strokeWidth="2.5"/>
      <circle cx="80" cy="80" r="38" fill={`rgba(0,82,245,0.18)`} stroke={J.redL} strokeWidth="1.5"/>
      <circle cx="80" cy="80" r="22" fill={`rgba(0,82,245,0.28)`}/>
      <circle cx="80" cy="80" r="55" fill="none" stroke={J.gold} strokeWidth="0.8" opacity="0.35"/>
    </svg>
  </motion.div>
);

/* Ink building/structure (strong, masculine) */
const StrucBuilding:React.FC<{style?:React.CSSProperties;flip?:boolean;delay?:number}>=({style={},flip=false,delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{opacity:[0.3,0.5,0.3]}} transition={{duration:5+delay,repeat:Infinity,delay}}>
    <svg viewBox="0 0 110 150" width="110" height="150">
      {/* Castle-style silhouette */}
      <rect x="5" y="60" width="100" height="90" fill="rgba(8,4,0,0.9)" stroke="rgba(0,146,199,0.25)" strokeWidth="1"/>
      {/* Battlements */}
      {[10,28,46,64,82].map(x=><rect key={x} x={x} y="48" width="14" height="14" fill="rgba(8,4,0,0.9)" stroke="rgba(0,146,199,0.2)" strokeWidth="0.8"/>)}
      {/* Roof */}
      <path d="M0 62 L55 20 L110 62" fill="rgba(12,6,0,0.92)" stroke="rgba(0,146,199,0.3)" strokeWidth="1"/>
      {/* Roof curve tips */}
      <path d="M2 60 Q-2 54 2 48" stroke="rgba(0,146,199,0.4)" strokeWidth="1.5" fill="none"/>
      <path d="M108 60 Q112 54 108 48" stroke="rgba(0,146,199,0.4)" strokeWidth="1.5" fill="none"/>
      {/* Windows — glowing */}
      {[[25,90],[50,90],[75,90],[35,115],[65,115]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x-7} y={y-10} width="14" height="18" rx="1" fill="rgba(0,146,199,0.08)" stroke="rgba(0,146,199,0.3)" strokeWidth="0.8"/>
          <motion.rect x={x-7} y={y-10} width="14" height="18" rx="1" fill="rgba(0,146,199,0.06)" animate={{opacity:[0.06,0.18,0.06]}} transition={{duration:2+i*0.3,repeat:Infinity,delay:i*0.4}}/>
        </g>
      ))}
      {/* Gate */}
      <path d="M42 150 L42 125 Q55 115 68 125 L68 150" fill="rgba(5,2,0,0.95)" stroke="rgba(0,146,199,0.25)" strokeWidth="1"/>
      {/* Red banner */}
      <rect x="48" y="48" width="14" height="30" fill="rgba(0,82,245,0.5)" stroke={J.red} strokeWidth="0.8"/>
      <text x="55" y="68" textAnchor="middle" fontSize="10" fill="rgba(245,240,220,0.7)" fontFamily="serif">武</text>
    </svg>
  </motion.div>
);

/* JapanBgSection wrapper */
const JapanBgSection:React.FC<{children:React.ReactNode;overlayColor?:string;style?:React.CSSProperties}>=({children,overlayColor=J.ov78,style={}})=>(
  <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',overflow:'hidden',backgroundImage:"url('/japan-bg.jpg')",backgroundSize:'cover',backgroundPosition:'center top',backgroundAttachment:'fixed',...style}}>
    <div style={{position:'absolute',inset:0,background:overlayColor,zIndex:0}}/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,rgba(0,82,245,0.08) 0%,rgba(6,14,24,0.5) 100%)',zIndex:0}}/>
    <div style={{position:'absolute',top:0,left:0,right:0,height:100,background:`linear-gradient(to bottom,${J.ink},transparent)`,zIndex:3,pointerEvents:'none'}}/>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:100,background:`linear-gradient(to top,${J.ink},transparent)`,zIndex:3,pointerEvents:'none'}}/>
    <CrackOverlay/>
    <GoldLines/>
    <div style={{position:'relative',zIndex:4}}>{children}</div>
  </section>
);

/* ══════════════════════════════════════════
   MARQUEE — Red bar
══════════════════════════════════════════ */
const Marquee:React.FC<{contact:ContactData}>=({contact})=>{
  const items=[
    contact.instagram&&{icon:'▶',label:'Instagram',value:'@'+contact.instagram,href:'https://instagram.com/'+contact.instagram},
    contact.linkedin &&{icon:'▶',label:'LinkedIn', value:contact.linkedin,      href:'https://linkedin.com/in/'+contact.linkedin},
    contact.twitter  &&{icon:'▶',label:'Twitter',  value:'@'+contact.twitter,  href:'https://twitter.com/'+contact.twitter},
    contact.email    &&{icon:'▶',label:'Email',    value:contact.email,         href:'mailto:'+contact.email},
    contact.website  &&{icon:'▶',label:'Website',  value:contact.website,       href:'https://'+contact.website},
    contact.location &&{icon:'▶',label:'Location', value:contact.location,      href:null},
    {icon:'▶',label:'Portfolio',value:'書道スタイル',href:null},
    {icon:'▶',label:'Open to Work',value:'Indonesia',href:null},
  ].filter(Boolean) as {icon:string;label:string;value:string;href:string|null}[];
  const doubled=[...items,...items,...items];
  return (
    <div style={{width:'100%',overflow:'hidden',background:`linear-gradient(90deg,${J.redD},${J.red},${J.redD})`,padding:'10px 0',position:'relative',zIndex:10,borderTop:`1px solid rgba(0,146,199,0.3)`,borderBottom:`1px solid rgba(0,146,199,0.3)`}}>
      <motion.div style={{display:'flex',width:'max-content'}} animate={{x:['0%','-33.33%']}} transition={{duration:26,repeat:Infinity,ease:'linear'}}>
        {doubled.map((item,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'0 24px',flexShrink:0,whiteSpace:'nowrap'}}>
            <span style={{color:J.gold,fontSize:'0.65rem'}}>◆</span>
            <span style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:700,color:'rgba(245,240,220,0.55)',textTransform:'uppercase',letterSpacing:'2px'}}>{item.label}</span>
            <span style={{color:'rgba(0,146,199,0.4)',fontSize:'0.8rem'}}>·</span>
            {item.href
              ?<a href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(245,240,220,0.9)',textDecoration:'none'}}>{item.value}</a>
              :<span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(245,240,220,0.9)'}}>{item.value}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   CERT CARD — Red seal style
══════════════════════════════════════════ */
const CertCard:React.FC<{cert:CertItem;index:number}>=({cert,index})=>{
  const [open,setOpen]=useState(false);
  const [imgLoaded,setImgLoaded]=useState(false);
  const {t}=useLang();
  return (
    <Reveal direction="up" delay={index*0.09}>
      <InkRipple>
        <motion.div
          whileHover={!open?{y:-4,boxShadow:`0 20px 60px rgba(0,82,245,0.2),0 0 0 1px rgba(0,82,245,0.35)`}:{}}
          style={{borderRadius:12,overflow:'hidden',border:`1px solid rgba(0,82,245,${open?0.6:0.2})`,background:'rgba(8,4,0,0.9)',backdropFilter:'blur(16px)',transition:'all 0.3s'}}>
          <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'1.2rem 1.5rem',display:'flex',alignItems:'center',gap:'1.1rem',textAlign:'left'}}>
            {/* Red wax seal */}
            <div style={{flexShrink:0,width:50,height:50,borderRadius:'50%',background:`radial-gradient(circle,${J.red} 0%,${J.redD} 100%)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 16px rgba(0,82,245,0.5)`,position:'relative',border:`1px solid rgba(0,146,199,0.3)`}}>
              <span style={{fontFamily:'serif',fontSize:'1.2rem',color:'rgba(245,240,220,0.9)'}}>証</span>
            </div>
            <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:'0.2rem'}}>
              <div style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'clamp(0.9rem,2.2vw,1.05rem)',color:J.white,lineHeight:1.3,wordBreak:'break-word'}}>{cert.name||'—'}</div>
              <div style={{fontFamily:'var(--font-body)',fontSize:'0.82rem',color:J.goldL,fontWeight:600,display:'flex',alignItems:'center',gap:'0.4rem',flexWrap:'wrap'}}>
                <span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:J.gold,flexShrink:0}}/>
                {cert.issuer||'—'}
                {cert.subtitle&&<span style={{color:'rgba(0,146,199,0.5)',fontWeight:400}}>· {cert.subtitle}</span>}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.1rem'}}>
                <span style={{fontFamily:'var(--font-body)',fontSize:'0.73rem',fontWeight:700,color:J.gold,background:'rgba(0,146,199,0.1)',border:`1px solid rgba(0,146,199,0.35)`,borderRadius:4,padding:'2px 10px',letterSpacing:'0.5px'}}>{cert.year||'—'}</span>
              </div>
            </div>
            <motion.div animate={{rotate:open?180:0}} transition={{duration:0.3}} style={{flexShrink:0,color:J.gold}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </motion.div>
          </button>
          <AnimatePresence>
            {open&&<motion.div key="sep" initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}} style={{height:1,background:`linear-gradient(to right,transparent,${J.red},${J.gold},transparent)`,margin:'0 1.5rem'}}/>}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {open&&(
              <motion.div key="img" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.45,ease:[0.4,0,0.2,1]}} style={{overflow:'hidden'}}>
                <div style={{padding:'1rem 1.5rem 1.5rem'}}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'1rem'}}>
                    {[{t:`📋 ${cert.name}`,c:J.white,bg:'rgba(255,255,255,0.05)'},{t:cert.issuer,c:J.goldL,bg:J.goldBg},{t:cert.subtitle,c:'rgba(0,146,199,0.6)',bg:'rgba(255,255,255,0.04)'},{t:`📅 ${cert.year}`,c:J.gold,bg:J.goldBg}].filter(x=>x.t).map((x,i)=>(
                      <span key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.73rem',fontWeight:600,color:x.c,background:x.bg,border:`1px solid ${x.c}22`,borderRadius:5,padding:'3px 10px'}}>{x.t}</span>
                    ))}
                  </div>
                  <div style={{borderRadius:10,overflow:'hidden',border:`1px solid rgba(0,82,245,0.3)`,background:'rgba(0,0,0,0.5)',minHeight:200,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                    {cert.imageUrl?(
                      <>{!imgLoaded&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.8rem'}}>
                        <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} style={{width:36,height:36,borderRadius:'50%',border:`2.5px solid ${J.gold}`,borderTopColor:'transparent'}}/>
                        <span style={{color:'rgba(0,146,199,0.5)',fontSize:'0.78rem',fontFamily:'var(--font-body)'}}>{t('Memuat...','Loading...')}</span>
                      </div>}
                      <img src={cert.imageUrl} alt={cert.name} loading="lazy" decoding="async" onLoad={()=>setImgLoaded(true)} style={{width:'100%',display:'block',objectFit:'contain',maxHeight:400,opacity:imgLoaded?1:0,transition:'opacity 0.4s'}}/></>
                    ):(
                      <div style={{textAlign:'center',padding:'3rem 2rem',color:'rgba(0,146,199,0.4)'}}>
                        <motion.div animate={{y:[0,-8,0]}} transition={{duration:2.5,repeat:Infinity}} style={{fontSize:'3rem',marginBottom:'0.8rem'}}>📜</motion.div>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',lineHeight:1.6}}>{t('Gambar belum diupload','Image not uploaded yet')}<br/><span style={{fontSize:'0.75rem',opacity:0.6}}>Upload via Admin Panel</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </InkRipple>
    </Reveal>
  );
};

/* ══════════════════════════════════════════
   CONTACT SECTION (dipertahankan)
══════════════════════════════════════════ */
const ContactSection:React.FC=()=>{
  const [sel,setSel]=useState<string[]>([]);const [name,setName]=useState('');const [email,setEmail]=useState('');const [msg,setMsg]=useState('');const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);
  const contact:ContactData=ls(LS_CONTACT,D_CONTACT);
  const toggle=(s:string)=>setSel(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setSending(true);await new Promise(r=>setTimeout(r,1000));setSending(false);setSent(true);};
  const inp:React.CSSProperties={flex:1,minWidth:0,fontSize:'0.875rem',padding:'10px 12px',borderRadius:10,border:'1px solid #e5e7eb',background:'transparent',outline:'none',fontFamily:'var(--font-body)',color:'#111',boxSizing:'border-box'};
  const IcoIG=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  const IcoLI=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  const SBtn:React.FC<{icon:React.ReactNode;bg:string;color:string;href:string}>=({icon,bg,color,href})=><a href={href} target="_blank" rel="noopener noreferrer" style={{width:40,height:40,minWidth:40,borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:bg,color,flexShrink:0,textDecoration:'none'}}>{icon}</a>;
  return (
    <section style={{width:'100%',padding:'12px',background:'#fff',boxSizing:'border-box'}}>
      <div style={{position:'relative',borderRadius:24,overflow:'hidden',minHeight:'calc(100vh - 24px)',display:'flex',flexDirection:'column'}}>
        <video autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}><source src={CONTACT_VIDEO} type="video/mp4"/></video>
        <div style={{position:'relative',zIndex:1,flex:1,display:'flex',flexDirection:'column',padding:'clamp(16px,4vw,24px)',gap:20,minHeight:'calc(100vh - 24px)',boxSizing:'border-box'}}>
          <div style={{background:'rgba(255,255,255,0.6)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',borderRadius:16,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',padding:'8px 12px',display:'flex',alignItems:'center',gap:12}}>
            <svg viewBox="0 0 256 256" width={28} height={28} style={{flexShrink:0}}><path fill="#000" d="M 256 256 L 128 256 L 0 128 L 128 128 Z"/><path fill="#000" d="M 256 128 L 128 128 L 0 0 L 128 0 Z"/></svg>
            <div id="cnav" style={{display:'none',gap:20,flex:1}}>{['Our story','Expertise','Our work','Journal'].map(l=><span key={l} style={{color:'#1f2937',fontSize:'0.82rem',fontWeight:500,cursor:'default',whiteSpace:'nowrap'}}>{l}</span>)}</div>
            <button onClick={()=>document.getElementById('cform')?.scrollIntoView({behavior:'smooth',block:'center'})} style={{background:'#000',color:'#fff',fontSize:'0.82rem',fontWeight:500,padding:'9px 18px',minHeight:40,borderRadius:10,border:'none',cursor:'pointer',marginLeft:'auto',flexShrink:0,whiteSpace:'nowrap'}}>Start a project</button>
          </div>
          <div style={{flex:1,minHeight:24}}/>
          <div id="cbot" style={{display:'flex',flexDirection:'column',gap:20}}>
            <p style={{color:'#fff',fontSize:'clamp(1.6rem,5vw,3rem)',fontWeight:500,lineHeight:1.2,textShadow:'0 2px 12px rgba(0,0,0,0.3)',margin:0}}>We craft bold ideas<br/>and ship them as <span style={{fontFamily:"'Georgia',serif",fontStyle:'italic'}}>products</span></p>
            <div style={{width:'100%',maxWidth:480}} id="cform">
              <div style={{background:'#fff',borderRadius:24,boxShadow:'0 25px 50px rgba(0,0,0,0.25)',padding:'clamp(16px,4vw,24px)',display:'flex',flexDirection:'column',gap:14}}>
                {sent?(<div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 0',gap:12}}><div style={{width:48,height:48,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>✓</div><p style={{fontSize:'1rem',fontWeight:600,color:'#111',margin:0}}>You're all set!</p><p style={{fontSize:'0.875rem',color:'#6b7280',margin:0}}>Expect a reply within 24 hours.</p></div>)
                :(<><h2 style={{fontSize:'1.25rem',fontWeight:600,color:'#000',margin:0}}>Say hello! 👋</h2>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,background:'#f9fafb',borderRadius:14,padding:'10px 14px',flexWrap:'wrap',rowGap:8}}>
                    <div style={{minWidth:0}}><p style={{fontSize:'0.72rem',color:'#9ca3af',margin:'0 0 2px 0'}}>Drop us a line</p><a href={`mailto:${contact.email}`} style={{color:'#2563eb',fontWeight:600,fontSize:'0.82rem',textDecoration:'none',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.email}</a></div>
                    <div style={{display:'flex',gap:8,flexShrink:0}}><SBtn icon={<IcoIG/>} bg="#ffedd5" color="#fb923c" href="https://instagram.com/mahfudfebry"/><SBtn icon={<IcoLI/>} bg="#dbeafe" color="#2563eb" href="https://linkedin.com/in/mahfud-febry-styanto"/></div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{flex:1,height:1,background:'#e5e7eb'}}/><span style={{fontSize:'0.82rem',color:'#9ca3af',fontWeight:500}}>OR</span><div style={{flex:1,height:1,background:'#e5e7eb'}}/></div>
                  <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
                    <label style={{fontSize:'0.82rem',fontWeight:500,color:'#000'}}>Tell us about your vision</label>
                    <div style={{display:'flex',flexDirection:'column',gap:8}} id="cinputs"><input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} style={{...inp,width:'100%'}}/><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{...inp,width:'100%'}}/></div>
                    <textarea rows={3} placeholder="What are you looking to build or improve..." value={msg} onChange={e=>setMsg(e.target.value)} style={{...inp,resize:'none',width:'100%'}}/>
                    <div><p style={{fontSize:'0.82rem',fontWeight:500,color:'#000',marginBottom:8}}>I need help with...</p><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{SERVICES_LIST.map(s=><button key={s} type="button" onClick={()=>toggle(s)} style={{fontSize:'0.75rem',fontWeight:500,padding:'9px 14px',minHeight:38,borderRadius:9,border:sel.includes(s)?'1px solid #000':'1px solid #e5e7eb',background:sel.includes(s)?'#f3f4f6':'#fff',color:sel.includes(s)?'#000':'#374151',cursor:'pointer'}}>{s}</button>)}</div></div>
                    <button type="submit" disabled={sending} style={{width:'100%',background:'#000',color:'#fff',fontSize:'0.875rem',fontWeight:600,padding:'11px 0',borderRadius:14,border:'none',cursor:sending?'not-allowed':'pointer',opacity:sending?0.6:1}}>{sending?'Sending...':'Send my message'}</button>
                  </form></>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){#cnav{display:none!important;}}@media(min-width:768px){#cnav{display:flex!important;}#cinputs{flex-direction:row!important;}}@media(min-width:1024px){#cbot{flex-direction:row!important;align-items:flex-end!important;justify-content:space-between!important;}#cform{width:min(480px,45%)!important;}}`}</style>
    </section>
  );
};

/* ══════════════════════════════════════════
   EXP CARD — extracted so useState is valid
══════════════════════════════════════════ */
/* ─── ExpDrilldown: kartu pengalaman kerja dengan navigasi drill-down 3 tahap ───
   Tahap 1 "company"  : nama perusahaan, detail industri, alamat, (kalau multi-posisi) total masa kerja.
   Tahap 2 "positions": muncul kalau perusahaan itu punya >1 posisi — daftar jabatan yang pernah ditempati.
   Tahap 3 "detail"   : deskripsi pekerjaan dari jabatan yang diklik.
   Transisi pakai `layout` (framer-motion menghitung sendiri geser+mengecilnya
   header perusahaan — bukan dihardcode manual) + AnimatePresence untuk
   masuk/keluarnya daftar & detail. Kalau cuma 1 posisi, tahap "positions"
   dilewati (langsung company → detail). */
const ExpDrilldown:React.FC<{company:string;items:ExpItem[];totalDuration:string;index:number}>=({company,items,totalDuration,index:i})=>{
  const isMulti=items.length>1;
  const [step,setStep]=useState<'company'|'positions'|'detail'>('company');
  const [selectedIdx,setSelectedIdx]=useState<number|null>(null);
  const [logoFailed,setLogoFailed]=useState(false);
  const [headerHover,setHeaderHover]=useState(false);
  const {t,lang}=useLang();
  const logo=resolveLogo({company,logoUrl:items.find(it=>it.logoUrl)?.logoUrl});
  const detailMatch=items[0].company.match(/\(([^)]+)\)/);
  const industryDetail=detailMatch?detailMatch[1]:'';
  const location=items[0].location;
  const selected=selectedIdx!==null?items[selectedIdx]:null;
  const compact=step!=='company';

  const goToPositions=()=>{ if(isMulti){ setStep('positions'); } else { setSelectedIdx(0); setStep('detail'); } };
  const goBackToCompany=()=>{ setStep('company'); setSelectedIdx(null); };
  const goBackToPositions=()=>{ setStep('positions'); setSelectedIdx(null); };
  const pickPosition=(idx:number)=>{ setSelectedIdx(idx); setStep('detail'); };

  return (
    <Reveal direction="right" delay={i*0.14}>
      <div style={{display:'flex',gap:'clamp(1rem,4vw,2rem)',position:'relative'}}>
        <div style={{flexShrink:0,width:'clamp(32px,10vw,64px)',display:'flex',flexDirection:'column',alignItems:'center',paddingTop:'1.4rem'}}>
          <motion.div
            animate={{boxShadow:[`0 0 8px ${J.gold}44`,`0 0 22px ${J.gold}99`,`0 0 8px ${J.gold}44`]}}
            transition={{duration:2,repeat:Infinity,delay:i*0.5}} whileHover={{scale:1.25}}
            style={{width:isMulti?20:16,height:isMulti?20:16,borderRadius:'50%',background:isMulti?J.gold:J.red,border:`2px solid ${isMulti?J.red:J.gold}`,position:'relative',zIndex:2}}>
            <motion.div animate={{scale:[1,1.45,1],opacity:[0.5,0,0.5]}} transition={{duration:2,repeat:Infinity,delay:i*0.5}} style={{position:'absolute',inset:-5,borderRadius:'50%',border:`1px solid ${J.gold}`,pointerEvents:'none'}}/>
          </motion.div>
        </div>

        <div style={{flex:1}}>
          <InkRipple>
            <SpotlightCard className="clay-card" style={{padding:'1.4rem clamp(1.1rem,3vw,1.9rem)',position:'relative',overflow:'hidden',background:'#0E1B2C',border:`1.5px solid rgba(0,146,199,${isMulti?0.32:0.16})`}}>
              <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at top left, rgba(0,82,245,0.08), transparent 60%)',pointerEvents:'none'}}/>
              <motion.div animate={{opacity:[0.04,0.1,0.04]}} transition={{duration:4+i,repeat:Infinity}} style={{position:'absolute',top:-24,right:-24,width:130,height:130,borderRadius:'50%',background:`radial-gradient(circle,${J.gold}2e,transparent 70%)`,pointerEvents:'none'}}/>

              {/* ── Header perusahaan — layout prop bikin transisi ukuran/posisi otomatis mulus ── */}
              <motion.div
                layout="position"
                transition={{duration:0.5,ease:[0.4,0,0.2,1]}}
                onClick={()=>step==='company'&&goToPositions()}
                onMouseEnter={()=>step==='company'&&setHeaderHover(true)}
                onMouseLeave={()=>setHeaderHover(false)}
                whileTap={step==='company'?{scale:0.985}:undefined}
                style={{
                  position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:compact?'0.7rem':'1.1rem',
                  cursor:step==='company'?'pointer':'default',
                  marginBottom:compact?'1rem':0,
                  paddingBottom:compact?'0.9rem':0,
                  borderBottom:compact?'1px solid rgba(0,82,245,0.16)':'none',
                  borderRadius:12,
                  margin:step==='company'?'-0.6rem -0.7rem 0':undefined,
                  padding:step==='company'?'0.6rem 0.7rem':undefined,
                  background:step==='company'&&headerHover?'rgba(0,146,199,0.06)':'transparent',
                  transition:'background 0.25s ease',
                }}>
                <motion.div layout style={{width:compact?38:64,height:compact?38:64,borderRadius:compact?9:14,background:logo&&!logoFailed?'#fff':`radial-gradient(circle,rgba(0,146,199,0.25),rgba(0,146,199,0.06))`,border:`2px solid ${J.gold}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:compact?'0.9rem':'1.6rem',overflow:'hidden',flexShrink:0,transition:'font-size 0.3s'}}>
                  {logo&&!logoFailed?(
                    <img src={logo} alt={company} loading="lazy" decoding="async" onError={()=>setLogoFailed(true)} style={{width:'100%',height:'100%',objectFit:'contain',padding:compact?4:7,borderRadius:compact?6:10}}/>
                  ):(<span aria-hidden="true">🏢</span>)}
                </motion.div>
                <motion.div layout style={{flex:1,minWidth:0}}>
                  {step==='company'&&(
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.15rem'}}>
                      <span style={{color:'rgba(0,146,199,0.75)',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase'}}>
                        {isMulti?t('Klik untuk lihat riwayat jabatan','Click to view position history'):t('Klik untuk lihat detail','Click to view details')}
                      </span>
                      <motion.span aria-hidden="true" animate={{x:headerHover?4:0}} transition={{duration:0.25}} style={{color:J.gold,fontSize:'0.85rem'}}>→</motion.span>
                    </div>
                  )}
                  <motion.h3 layout style={{fontFamily:'var(--font-display)',color:J.white,lineHeight:1.15,fontSize:compact?'clamp(0.95rem,2.6vw,1.15rem)':'clamp(1.2rem,3.6vw,1.7rem)',marginBottom:compact?0:'0.35rem',transition:'font-size 0.3s'}}>{company}</motion.h3>
                  <AnimatePresence>
                    {!compact&&(
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.3}} style={{overflow:'hidden'}}>
                        {industryDetail&&<div style={{color:'rgba(234,242,248,0.55)',fontSize:'0.82rem',marginBottom:'0.3rem'}}>{industryDetail}</div>}
                        {location&&<div style={{color:'rgba(234,242,248,0.55)',fontSize:'0.82rem',marginBottom:isMulti?'0.5rem':0,display:'flex',alignItems:'center',gap:'0.35rem'}}><span aria-hidden="true">📍</span>{location}</div>}
                        {isMulti&&(
                          <div style={{display:'inline-flex',alignItems:'center',gap:'0.4rem',color:J.goldL,fontWeight:700,fontSize:'0.8rem'}}>
                            <span aria-hidden="true">⏳</span>{t('Total Masa Kerja','Total Duration')}: {totalDuration}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {step==='company'&&isMulti&&(
                  <motion.button
                    layout
                    onClick={(e)=>{e.stopPropagation(); goToPositions();}}
                    whileHover={{scale:1.04}}
                    whileTap={{y:3,boxShadow:'0 0 0 #B85400'}}
                    transition={{duration:0.15}}
                    style={{
                      position:'relative',flexShrink:0,
                      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                      background:'linear-gradient(180deg,#FF9A3D,#FF8A1E)',
                      color:'#fff',fontWeight:800,letterSpacing:'0.2px',lineHeight:1.3,
                      padding:'10px 15px',borderRadius:10,minWidth:64,minHeight:44,
                      boxShadow:'0 4px 0 #B85400, 0 6px 14px rgba(0,0,0,0.32)',
                      border:'1px solid rgba(255,255,255,0.22)',
                      cursor:'pointer',fontFamily:'var(--font-body)',
                    }}>
                    <span aria-hidden="true" style={{
                      position:'absolute',top:-9,right:-9,background:'#fff',color:'#B85400',
                      fontWeight:800,fontSize:'0.7rem',minWidth:22,height:22,borderRadius:'50%',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      border:'2px solid #FF8A1E',boxShadow:'0 2px 5px rgba(0,0,0,0.35)',
                    }}>{items.length}</span>
                    <span style={{fontSize:'0.72rem'}}>{t('Buka','Open')}</span>
                    <span style={{fontSize:'0.72rem'}}>{t('Jabatan','Positions')}</span>
                  </motion.button>
                )}
                {compact&&(
                  <motion.button
                    layout
                    onClick={(e)=>{e.stopPropagation(); step==='detail'&&isMulti?goBackToPositions():goBackToCompany();}}
                    whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                    style={{flexShrink:0,display:'inline-flex',alignItems:'center',gap:'0.35rem',background:'rgba(0,82,245,0.12)',border:`1px solid rgba(0,82,245,0.3)`,color:J.goldL,borderRadius:8,padding:'10px 16px',minHeight:40,fontSize:'0.76rem',fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>
                    ← {t('Kembali','Back')}
                  </motion.button>
                )}
              </motion.div>

              {/* ── Tahap 2: daftar jabatan ── */}
              <AnimatePresence mode="wait">
                {step==='positions'&&(
                  <motion.div key="positions" initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-28}} transition={{duration:0.4,ease:[0.4,0,0.2,1]}} style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                    {items.map((item,idx)=>{
                      const dateRange=item.period.split('·')[0]?.trim();
                      return (
                        <motion.button key={item.id} onClick={()=>pickPosition(idx)} whileHover={{x:5,borderColor:'rgba(0,82,245,0.5)'}}
                          style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.8rem',textAlign:'left',background:'rgba(9,18,29,0.6)',border:'1px solid rgba(0,82,245,0.18)',borderRadius:9,padding:'0.8rem 0.8rem 0.8rem 1rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>
                          <div style={{minWidth:0}}>
                            <div style={{color:J.white,fontWeight:700,fontSize:'0.88rem',marginBottom:'0.15rem'}}>{item.position}</div>
                            <div style={{color:'rgba(234,242,248,0.5)',fontSize:'0.72rem'}}>{dateRange}</div>
                          </div>
                          {/* Tombol "Detail Deskripsi Kerja" — gaya 3D tegas: solid fill + tepi bawah gelap
                              (efek timbul), mengempis pas ditekan (whileTap) biar berasa kayak tombol fisik
                              beneran. Teks dual-line (2 baris) supaya tetap ringkas lebarnya.
                              Pakai J.red (biru vivid) solid, bukan gradient gold — sudah dicek kontras teks
                              putihnya 5.9:1 (lolos WCAG AA), gradient gold sebelumnya cuma ~2.7:1 di ujung terang. */}
                          <motion.div
                            whileTap={{y:3,boxShadow:`0 0 0 ${J.redD}`}}
                            transition={{duration:0.1}}
                            style={{
                              display:'flex',alignItems:'center',gap:'0.55rem',flexShrink:0,
                              background:J.red,
                              color:'#fff',fontWeight:800,letterSpacing:'0.2px',
                              padding:'8px 12px',borderRadius:8,
                              boxShadow:`0 3px 0 ${J.redD}, 0 5px 10px rgba(0,0,0,0.3)`,
                              border:'1px solid rgba(255,255,255,0.15)',
                            }}>
                            <div style={{display:'flex',flexDirection:'column',lineHeight:1.25,textAlign:'left'}}>
                              <span style={{fontSize:'0.68rem'}}>{t('Detail','Detail')}</span>
                              <span style={{fontSize:'0.68rem'}}>{t('Deskripsi Kerja','Job Description')}</span>
                            </div>
                            <span aria-hidden="true" style={{fontSize:'0.95rem',flexShrink:0}}>→</span>
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}

                {/* ── Tahap 3: deskripsi jabatan terpilih ── */}
                {step==='detail'&&selected&&(
                  <motion.div key="detail" initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-28}} transition={{duration:0.4,ease:[0.4,0,0.2,1]}} style={{position:'relative',zIndex:1}}>
                    <h4 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1rem,2.8vw,1.25rem)',color:J.white,marginBottom:'0.4rem'}}>{selected.position}</h4>
                    {selected.period&&(()=>{
                      const [dateRange,duration,type]=selected.period.split('·').map(p=>p.trim());
                      return (
                        <div style={{display:'inline-flex',flexDirection:'column',gap:'0.2rem',alignItems:'flex-start',background:J.redBg,color:J.goldL,borderRadius:5,padding:'5px 12px',fontSize:'0.72rem',fontWeight:700,border:`1px solid rgba(0,82,245,0.3)`,marginBottom:'0.7rem'}}>
                          <span><span aria-hidden="true">🕐</span> {dateRange}</span>
                          <span>[ {duration} ]{type?` · ${type}`:''}</span>
                        </div>
                      );
                    })()}
                    {selected.tags&&<div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',marginBottom:'0.8rem'}}>{selected.tags.split(',').map(tg=>tg.trim()).filter(Boolean).map(tag=>(<span key={tag} style={{background:'rgba(0,146,199,0.07)',border:`1px solid rgba(0,146,199,0.18)`,color:'rgba(0,146,199,0.8)',borderRadius:4,padding:'3px 10px',fontSize:'0.72rem',fontWeight:500}}>{tag}</span>))}</div>}
                    {selected.desc&&(
                      <div style={{padding:'1rem 1.2rem',background:'rgba(0,82,245,0.06)',border:`1px solid rgba(0,82,245,0.2)`,borderRadius:8,borderLeft:`3px solid ${J.red}`}} lang={lang}>
                        <div className="bullet-list">
                          {selected.desc.split('\n').map((line,li)=>{
                            const isBullet=line.trim().startsWith('•');
                            const text=isBullet?line.trim().slice(1).trim():line;
                            return isBullet?(
                              <div key={li} className="bullet-line">
                                <span className="bullet-dot" style={{color:J.gold}}>•</span>
                                <span className="bullet-text text-justify-auto" style={{color:'rgba(234,242,248,0.82)',fontSize:'0.82rem',lineHeight:1.75,fontFamily:'var(--font-body)'}}>{text}</span>
                              </div>
                            ):(
                              <div key={li} className="text-justify-auto para-indent" style={{color:'rgba(234,242,248,0.82)',fontSize:'0.82rem',lineHeight:1.75,fontFamily:'var(--font-body)'}}>{line}</div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </SpotlightCard>
          </InkRipple>
        </div>
      </div>
    </Reveal>
  );
};


/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
const Home:React.FC=()=>{
  const {lang,t}=useLang();
  const liteMode=useLiteMode();
  const [heroCustom,setHero]=useState<HomeData|null>(()=>lsRaw<HomeData>(LS_HOME));
  const [aboutCustom,setAbout]=useState<AboutData|null>(()=>lsRaw<AboutData>(LS_ABOUT));
  const [skillsCustom,setSkills]=useState<SkillItem[]|null>(()=>lsRaw<SkillItem[]>(LS_SKILLS));
  const [expsCustom,setExps]=useState<ExpItem[]|null>(()=>lsRaw<ExpItem[]>(LS_EXP));
  const [contact,setContact]=useState<ContactData>(()=>ls(LS_CONTACT,D_CONTACT));
  const [certsCustom,setCerts]=useState<CertItem[]|null>(()=>lsRaw<CertItem[]>(LS_CERT));
  /* Data admin (localStorage) selalu diprioritaskan bila ada; jika belum ada override,
     tampilkan default sesuai bahasa aktif (ID/EN) dari toggle mengambang. */
  const hero=heroCustom??(lang==='en'?D_HOME_EN:D_HOME);
  const about=aboutCustom??(lang==='en'?D_ABOUT_EN:D_ABOUT);
  const skills=skillsCustom??(lang==='en'?D_SKILLS_EN:D_SKILLS);
  const exps=expsCustom??(lang==='en'?D_EXP_EN:D_EXP);
  const certs=certsCustom??(lang==='en'?D_CERT_EN:D_CERT);
  const containerRef=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:containerRef,offset:['start start','end end']});
  const _py=useTransform(scrollYProgress,[0,1],[0,-60]); // parallax ref (keep for future use)

  useEffect(()=>{
    const onS=(e:StorageEvent)=>{if(e.key===LS_HOME&&e.newValue)try{setHero(JSON.parse(e.newValue));}catch{}if(e.key===LS_ABOUT&&e.newValue)try{setAbout(JSON.parse(e.newValue));}catch{}if(e.key===LS_SKILLS&&e.newValue)try{setSkills(JSON.parse(e.newValue));}catch{}if(e.key===LS_EXP&&e.newValue)try{setExps(JSON.parse(e.newValue));}catch{}if(e.key===LS_CONTACT&&e.newValue)try{setContact(JSON.parse(e.newValue));}catch{}if(e.key===LS_CERT&&e.newValue)try{setCerts(JSON.parse(e.newValue));}catch{}};
    const onC=(e:Event)=>{const{key,value}=(e as CustomEvent).detail;try{if(key===LS_HOME)setHero(JSON.parse(value));if(key===LS_ABOUT)setAbout(JSON.parse(value));if(key===LS_SKILLS)setSkills(JSON.parse(value));if(key===LS_EXP)setExps(JSON.parse(value));if(key===LS_CONTACT)setContact(JSON.parse(value));if(key===LS_CERT)setCerts(JSON.parse(value));}catch{}};
    window.addEventListener('storage',onS);window.addEventListener('hk-update',onC);
    return()=>{window.removeEventListener('storage',onS);window.removeEventListener('hk-update',onC);};
  },[]);

  const photo=about.photoUrl||FALLBACK_PHOTO;

  return (
    <div ref={containerRef} style={{background:J.ink,minHeight:'100vh',overflowX:'hidden'}}>

      {/* ══ HERO ══ */}
      <section
        id="hk-hero"
        onMouseMove={(e) => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          const px = e.clientX - rect.left;
          const py = e.clientY - rect.top;
          el.style.setProperty('--hero-px', `${px}px`);
          el.style.setProperty('--hero-py', `${py}px`);
          el.style.setProperty('--hero-dx', `${(px / rect.width - 0.5) * 2}`);
          el.style.setProperty('--hero-dy', `${(py / rect.height - 0.5) * 2}`);
        }}
        style={{position:'relative',width:'100%',height:'100vh',minHeight:500,overflow:'hidden',display:'flex',flexDirection:'column',background:'#0A1522',color:'#fff'}}>
        <HeroVisual reduced={liteMode} />
        <Stars/>
        {/* Main content: semua elemen rapat di bagian bawah, tidak overlap navbar */}
        <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',flex:1}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'flex-end',alignItems:'center',textAlign:'center',padding:'0 clamp(1rem,5vw,4rem) clamp(0.5rem,2vw,1rem)',gap:'0.3rem'}}>

            {/* Subtitle langsung di atas title — rapat */}
            <div className="hk-hero-subtitle" style={{textAlign:'center',marginBottom:'0.05rem'}}>
              {(hero.heroSubtitle||'').split('\n').map((line,li)=>(
                <div key={li} style={{
                  fontFamily:'var(--font-display)',fontWeight:700,textTransform:'uppercase',
                  letterSpacing:'0.06em',lineHeight:1.5,whiteSpace:'nowrap',
                  fontSize:'clamp(0.65rem,1.5vw,1rem)',
                  color:'rgba(255,255,255,0.95)',
                  textShadow:'0 2px 8px rgba(0,0,0,0.9),0 0 20px rgba(0,82,245,0.5),1px 1px 0 rgba(0,0,0,0.8)'
                }}>
                  {line}
                </div>
              ))}
            </div>

            {/* Hero Title */}
            <ShineHeading text={hero.heroTitle} style={{fontWeight:800,letterSpacing:'-0.01em',lineHeight:1,color:'#fff',fontFamily:'var(--font-display)',textTransform:'uppercase'}}/>

            {/* Tagline */}
            <FadeIn delay={600}>
              <p className="hk-hero-tagline" style={{fontSize:'clamp(0.78rem,1.6vw,0.95rem)',color:'rgba(209,213,219,0.85)',margin:0,lineHeight:1.5,maxWidth:'480px',textShadow:'0 2px 6px rgba(0,0,0,0.8)'}}>
                {hero.heroTagline}
              </p>
            </FadeIn>

            {/* Buttons */}
            <FadeIn delay={1000}>
              <div className="hk-hero-cta-row" style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',justifyContent:'center'}}>
                <MagneticButton strength={0.3}>
                  <a href={hero.heroCtaSecondaryLink||'https://wa.me/6282234651413'} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                    <button style={{background:'rgba(255,255,255,0.92)',color:'#000',border:'none',borderRadius:8,padding:'11px 20px',minHeight:42,fontWeight:600,fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>{hero.heroCtaSecondary||'Start a Chat'}</button>
                  </a>
                </MagneticButton>
                <MagneticButton strength={0.3}>
                  <Link to={hero.heroCtaLink||'/portofolio'} style={{textDecoration:'none'}}>
                    <button style={{...LG,border:'1px solid rgba(255,255,255,0.25)',color:'#fff',borderRadius:8,padding:'11px 20px',minHeight:42,fontWeight:600,fontSize:'0.8rem',cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>{hero.heroCta}</button>
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>

            {/* Location */}
            <FadeIn delay={1200}>
              <div className="hk-location-badge" style={{...LG,border:'1px solid rgba(255,255,255,0.18)',borderRadius:8,padding:'5px 14px',display:'inline-block'}}>
                <span style={{fontSize:'clamp(0.72rem,1.5vw,0.9rem)',fontWeight:400,color:'rgba(255,255,255,0.88)',fontFamily:'var(--font-body)',display:'inline-flex',alignItems:'center',gap:'5px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width:'0.9em',height:'0.9em',flexShrink:0,color:J.red}}><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.697 3.5-8.027a8.25 8.25 0 00-16.5 0c0 3.33 1.556 6.014 3.5 8.027a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                  {hero.heroTagRight}
                </span>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Marquee — di luar hero agar tidak terpotong di mobile */}
      <Marquee contact={contact}/>

      {/* ══ ABOUT — 自己紹介 (Jiko Shokai) ══ */}
      <JapanBgSection overlayColor={J.ov82}>
        <InkBrushCanvas/>
        {/* Smoke base */}
        <SmokeCloud style={{left:'-5%',bottom:'2%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-5%',bottom:'4%',opacity:0.85}} delay={1.5} flip/>
        {/* Torii gates */}
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',top:'3%'}} opacity={0.08}/>
        {/* Samurai Mon circles */}
        <SamuraiMon style={{right:'4%',top:'12%'}} delay={0} size={100} variant={0}/>
        <SamuraiMon style={{left:'3%',bottom:'18%'}} delay={1.5} size={80} variant={1}/>
        {/* Katana blades */}
        <Katana style={{right:'5%',bottom:'25%'}} delay={0} vertical/>
        <Katana style={{left:'3%',top:'35%'}} delay={1}/>
        {/* Kanji stamps */}
        <KanjiStamp kanji="人" style={{right:'2%',bottom:'5%'}} delay={0.3} size={70}/>
        <KanjiStamp kanji="誠" style={{left:'1%',top:'8%'}} delay={0.8} size={60}/>
        {/* Ink circles */}
        <InkCircle style={{left:'8%',bottom:'12%'}} delay={0} size={90} color="red"/>
        <InkCircle style={{right:'8%',top:'20%'}} delay={1} size={70} color="gold"/>
        {/* Nobori flags */}
        <Nobori style={{right:'2%',top:'5%',opacity:0.5}} delay={0} kanji="武"/>
        <Nobori style={{left:'2%',top:'5%',opacity:0.45}} delay={0.8} kanji="道"/>
        {/* Rising sun */}
        <RisingSun style={{left:'3%',top:'10%'}} opacity={0.1}/>
        {/* Buildings */}
        <StrucBuilding style={{right:'0%',bottom:'3%',opacity:0.5}} delay={0}/>
        <StrucBuilding style={{left:'0%',bottom:'2%',opacity:0.45}} flip delay={1}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <div id="about-row" style={{display:'flex',flexDirection:'column',gap:'3rem',alignItems:'center'}}>
            <Reveal direction="left" style={{width:'100%',maxWidth:340,flexShrink:0}}>
              <TiltCard style={{borderRadius:16,width:'100%'}} intensity={10}>
                <InkRipple>
                  <div style={{borderRadius:16,overflow:'hidden',position:'relative',aspectRatio:'4/5',border:`2px solid rgba(0,82,245,0.5)`,boxShadow:`0 0 0 6px rgba(0,82,245,0.06),0 30px 80px rgba(0,0,0,0.7),0 0 60px rgba(0,82,245,0.12)`}}>
                    <img src={photo} alt={about.name} decoding="async" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                    <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,rgba(8,4,0,0.9) 0%,rgba(8,4,0,0.1) 50%,transparent 100%)`}}/>
                    {/* Red corner accents */}
                    <div style={{position:'absolute',top:8,left:8,width:20,height:20,borderTop:`2px solid ${J.gold}`,borderLeft:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',top:8,right:8,width:20,height:20,borderTop:`2px solid ${J.gold}`,borderRight:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',bottom:8,left:8,width:20,height:20,borderBottom:`2px solid ${J.gold}`,borderLeft:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',bottom:8,right:8,width:20,height:20,borderBottom:`2px solid ${J.gold}`,borderRight:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',bottom:'1rem',left:'1rem',right:'1rem'}}>
                      <motion.div whileHover={{scale:1.04}} style={{background:'rgba(0,82,245,0.85)',backdropFilter:'blur(8px)',borderRadius:8,padding:'0.5rem 1rem',color:J.white,fontWeight:700,fontSize:'0.82rem',display:'inline-block',wordBreak:'break-word',border:`1px solid rgba(0,146,199,0.3)`}}>
                        ⛩️ {about.location}
                      </motion.div>
                    </div>
                  </div>
                </InkRipple>
              </TiltCard>
            </Reveal>
            <Reveal direction="right" delay={0.15}>
              <div style={{maxWidth:560}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'0.8rem'}}>
                  <span style={{fontFamily:'serif',fontSize:'1.8rem',color:J.red}}>自</span>
                </div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5rem)',lineHeight:0.9,marginBottom:'0.2rem',color:J.white}}>ABOUT ME !</h2>
                <BrushStroke style={{position:'relative',marginBottom:'0.8rem'}} width={100} color={J.red} delay={0.3}/>
                <div style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'clamp(1.5rem,5vw,2.2rem)',fontWeight:700,marginBottom:'1.8rem',textShadow:`0 0 20px rgba(0,146,199,0.35)`}}>{about.name}</div>

                <p lang={lang} className="text-justify-auto para-indent" style={{color:J.whiteDim,lineHeight:1.9,marginBottom:'1.2rem',fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio1}</p>

                <p lang={lang} className="text-justify-auto para-indent" style={{color:'rgba(234,242,248,0.5)',lineHeight:1.9,fontSize:'clamp(0.88rem,2vw,1rem)',marginBottom:'1.8rem'}}>{about.bio2}</p>

                <SosmedButtons about={about}/>

                <div style={{display:'flex',alignItems:'center',gap:'0.8rem',margin:'1.4rem 0 1.2rem'}}>
                  <div style={{flex:1,height:1,background:'linear-gradient(to right, rgba(0,146,199,0.5), rgba(0,146,199,0.05))'}}/>
                  <span style={{fontFamily:'var(--font-body)',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:J.gold,whiteSpace:'nowrap'}}>
                    portfolio · Link Portofolio
                  </span>
                  <div style={{flex:1,height:1,background:'linear-gradient(to left, rgba(0,146,199,0.5), rgba(0,146,199,0.05))'}}/>
                </div>

                <div className="hk-btn-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'0.8rem',maxWidth:520}}>
                  <motion.div whileHover={{scale:1.04,boxShadow:`0 8px 30px rgba(0,82,245,0.35)`}} whileTap={{scale:0.97}}>
                    <Link to="/about" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:J.redBg,color:J.goldL,textDecoration:'none',borderRadius:8,padding:'11px 18px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.85rem',border:`1px solid rgba(0,82,245,0.45)`,backdropFilter:'blur(6px)',whiteSpace:'nowrap'}}>
                      詳細を見る → Selengkapnya
                    </Link>
                  </motion.div>
                  {about.jobstreet && (
                    <motion.div whileHover={{scale:1.04,boxShadow:`0 8px 30px rgba(0,110,224,0.35)`}} whileTap={{scale:0.97}}>
                      <a href={about.jobstreet} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'rgba(0,110,224,0.15)',color:'#4ea1ff',textDecoration:'none',borderRadius:8,padding:'11px 18px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.85rem',border:'1px solid rgba(0,110,224,0.45)',backdropFilter:'blur(6px)',whiteSpace:'nowrap'}}>
                        💼 Jobstreet
                      </a>
                    </motion.div>
                  )}
                  {about.linkedin && (
                    <motion.div whileHover={{scale:1.04,boxShadow:`0 8px 30px rgba(10,102,194,0.35)`}} whileTap={{scale:0.97}}>
                      <a href={`https://linkedin.com/in/${about.linkedin}`} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'rgba(10,102,194,0.15)',color:'#4fa3ff',textDecoration:'none',borderRadius:8,padding:'11px 18px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.85rem',border:'1px solid rgba(10,102,194,0.45)',backdropFilter:'blur(6px)',whiteSpace:'nowrap'}}>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{width:'1em',height:'1em',flexShrink:0}}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    </motion.div>
                  )}
                  {about.ibenews && (
                    <motion.div whileHover={{scale:1.04,boxShadow:`0 8px 30px rgba(220,20,20,0.35)`}} whileTap={{scale:0.97}}>
                      <a href={about.ibenews} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'rgba(220,20,20,0.12)',color:'#ff5c5c',textDecoration:'none',borderRadius:8,padding:'11px 18px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.85rem',border:'1px solid rgba(220,20,20,0.45)',backdropFilter:'blur(6px)',whiteSpace:'nowrap'}}>
                        ✍️ iBenews.id
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </JapanBgSection>

      {/* ══ SERTIFIKASI — 証明書 (Shomeisho) ══ */}
      <LazyMount minHeight={700}>
      <JapanBgSection overlayColor={J.ov85}>
        <InkBrushCanvas/>
        <SmokeCloud style={{left:'-4%',bottom:'0%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-4%',bottom:'3%',opacity:0.85}} delay={1.8} flip/>
        <ToriiGate style={{right:'5%',top:'5%'}} opacity={0.07}/>
        <ToriiGate style={{left:'-2%',bottom:'8%'}} opacity={0.06}/>
        <SamuraiMon style={{left:'3%',top:'20%'}} delay={0} size={85} variant={2}/>
        <SamuraiMon style={{right:'3%',bottom:'20%'}} delay={1} size={75} variant={0}/>
        <InkCircle style={{left:'50%',bottom:'5%',transform:'translateX(-50%)'}} delay={0} size={150} color="red"/>
        <KanjiStamp kanji="証" style={{left:'2%',bottom:'8%'}} delay={0.5} size={75}/>
        <KanjiStamp kanji="明" style={{right:'2%',top:'10%'}} delay={1} size={65}/>
        <Nobori style={{left:'2%',top:'5%',opacity:0.45}} delay={0} kanji="証"/>
        <Nobori style={{right:'2%',top:'5%',opacity:0.45}} delay={1} kanji="書"/>
        <StrucBuilding style={{left:'0%',bottom:'2%',opacity:0.45}} flip delay={0}/>
        <StrucBuilding style={{right:'0%',bottom:'2%',opacity:0.4}} delay={1}/>

        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',marginBottom:'0.8rem'}}>
                <motion.div style={{height:1,width:50,background:`linear-gradient(to right,transparent,${J.red})`}} initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:0.8}}/>
                <span style={{fontFamily:'serif',fontSize:'1.6rem',color:J.red}}>証</span>
                <motion.div style={{height:1,width:50,background:`linear-gradient(to left,transparent,${J.red})`}} initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:0.8}}/>
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,8vw,5rem)',lineHeight:0.9,color:J.white,wordBreak:'break-word'}}>
                SERTIFI<span style={{color:J.red,textShadow:`0 0 30px rgba(0,82,245,0.6)`}}>KASI</span>
              </h2>
              <BrushStroke style={{position:'relative',margin:'0.8rem auto 0',display:'block',width:'fit-content'}} width={120} color={J.gold} delay={0.3}/>
              <p style={{color:'rgba(234,242,248,0.6)',marginTop:'0.8rem',fontSize:'0.88rem'}}>{t('Klik kartu untuk melihat · 証明書','Tap a card to view · 証明書')}</p>
            </div>
          </Reveal>
          {certs.length===0?(
            <Reveal direction="up"><div style={{textAlign:'center',padding:'3rem',color:'rgba(0,146,199,0.4)',border:`1px dashed rgba(0,82,245,0.3)`,borderRadius:12}}><div style={{fontSize:'3rem',marginBottom:'0.8rem'}}>📜</div><p>{t('Belum ada sertifikasi.','No certifications yet.')}</p></div></Reveal>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {certs.map((cert,i)=><CertCard key={cert.id} cert={cert} index={i}/>)}
            </div>
          )}
        </div>
      </JapanBgSection>
      </LazyMount>

      {/* ══ EXPERIENCE — 経歴 (Keireki / Career Path) ══ */}
      <LazyMount minHeight={800}>
      <JapanBgSection overlayColor={J.ov82}>
        <InkBrushCanvas/>
        {/* Stars */}
        {[...Array(18)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',width:2,height:2,borderRadius:'50%',background:J.white,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,pointerEvents:'none'}}
            animate={{opacity:[0.1,0.6,0.1]}} transition={{duration:2+Math.random()*3,repeat:Infinity,delay:Math.random()*4}}/>
        ))}
        <SmokeCloud style={{left:'-6%',bottom:'0%',opacity:0.95}} delay={0}/>
        <SmokeCloud style={{right:'-6%',bottom:'2%',opacity:0.9}} delay={1.2} flip/>
        <SmokeCloud style={{left:'25%',bottom:'0%',opacity:0.6}} delay={0.7}/>
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',bottom:'5%'}} opacity={0.07}/>
        <SamuraiMon style={{right:'3%',top:'15%'}} delay={0} size={90} variant={1}/>
        <SamuraiMon style={{left:'3%',bottom:'20%'}} delay={1.5} size={70} variant={2}/>
        <Katana style={{top:'12%',left:'5%',opacity:0.5}} delay={0}/>
        <Katana style={{bottom:'18%',right:'5%',opacity:0.45}} delay={1.2}/>
        <KanjiStamp kanji="歴" style={{right:'1%',bottom:'5%'}} delay={0.4} size={70}/>
        <KanjiStamp kanji="仕" style={{left:'1%',top:'8%'}} delay={0.9} size={60}/>
        <Nobori style={{left:'2%',top:'4%',opacity:0.4}} delay={0} kanji="経"/>
        <Nobori style={{right:'2%',top:'4%',opacity:0.4}} delay={0.6} kanji="道"/>
        <StrucBuilding style={{left:'0%',top:'8%',opacity:0.4}} delay={0}/>
        <StrucBuilding style={{right:'0%',top:'10%',opacity:0.35}} flip delay={0.8}/>

        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.8rem',marginBottom:'0.6rem'}}>
                <span style={{fontFamily:'serif',fontSize:'1.6rem',color:J.gold}}>経</span>
                <span style={{fontFamily:'var(--font-body)',color:J.gold,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Keireki · Career Path</span>
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.9,color:J.white,wordBreak:'break-word'}}>
                PENGALAMAN <span style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'55%',textShadow:`0 0 20px rgba(0,146,199,0.5)`}}>Kerja</span>
              </h2>
              <p style={{color:'rgba(234,242,248,0.6)',marginTop:'0.8rem',fontSize:'0.88rem'}}>{t('Pengalaman Profesional & Riwayat Kerja','Professional Experience & Work History')}</p>
            </div>
          </Reveal>
          {/* Timeline */}
          <div style={{position:'relative'}}>
            <motion.div initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:true}} transition={{duration:1.8,ease:'easeOut'}}
              style={{position:'absolute',left:'clamp(16px,5vw,32px)',top:0,bottom:0,width:2,background:`linear-gradient(to bottom,transparent,${J.red},${J.gold},transparent)`,transformOrigin:'top',zIndex:1}}/>
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
              {groupExpByCompany(exps,lang).map((row,i)=>(
                row.type==='group'
                  ? <ExpDrilldown key={row.group.companyKey} company={row.group.companyDisplay} items={row.group.items} totalDuration={row.group.totalDuration} index={i}/>
                  : <ExpDrilldown key={row.item.id} company={row.item.company.split(' (')[0].trim()} items={[row.item]} totalDuration="" index={i}/>
              ))}
            </div>
          </div>
        </div>
      </JapanBgSection>
      </LazyMount>

      {/* ══ SKILLS — 技術 (Gijutsu / Technique) ══ */}
      <LazyMount minHeight={900}>
      <JapanBgSection overlayColor={J.ov82}>
        <InkBrushCanvas/>
        <SmokeCloud style={{left:'-5%',bottom:'0%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-5%',bottom:'1%',opacity:0.85}} delay={2} flip/>
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',bottom:'3%'}} opacity={0.06}/>
        <SamuraiMon style={{left:'2%',top:'15%'}} delay={0} size={90} variant={0}/>
        <SamuraiMon style={{right:'2%',bottom:'18%'}} delay={1} size={80} variant={2}/>
        <SamuraiMon style={{left:'50%',top:'5%',transform:'translateX(-50%)'}} delay={0.5} size={65} variant={1}/>
        <Katana style={{top:'8%',left:'3%'}} delay={0}/>
        <Katana style={{bottom:'12%',right:'3%'}} delay={1.5}/>
        <InkCircle style={{right:'3%',top:'12%'}} delay={0} size={80} color="red"/>
        <InkCircle style={{left:'3%',bottom:'12%'}} delay={1.2} size={70} color="gold"/>
        <RisingSun style={{right:'3%',top:'5%'}} opacity={0.08}/>
        <KanjiStamp kanji="技" style={{left:'1%',bottom:'5%'}} delay={0.5} size={70}/>
        <KanjiStamp kanji="術" style={{right:'1%',top:'5%'}} delay={1} size={65}/>
        <Nobori style={{left:'2%',top:'3%',opacity:0.4}} delay={0} kanji="技"/>
        <Nobori style={{right:'2%',top:'3%',opacity:0.4}} delay={0.8} kanji="術"/>
        <StrucBuilding style={{left:'0%',bottom:'2%',opacity:0.45}} flip delay={0}/>
        <StrucBuilding style={{right:'0%',bottom:'3%',opacity:0.4}} delay={1}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
              <motion.div animate={{y:[0,-5,0]}} transition={{duration:4,repeat:Infinity}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.8rem',marginBottom:'0.6rem'}}>
                  <span style={{fontFamily:'serif',fontSize:'1.6rem',color:J.red}}>技</span>
                  <span style={{fontFamily:'var(--font-body)',color:J.red,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Gijutsu · Technique</span>
                </div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5.5rem)',lineHeight:0.9,color:J.white,wordBreak:'break-word'}}>
                  SKILLS &amp; <span style={{color:J.red,textShadow:`0 0 30px rgba(0,82,245,0.5)`}}>TOOLS</span>
                </h2>
                <BrushStroke style={{position:'relative',margin:'0.8rem auto 0',display:'block',width:'fit-content'}} width={100} color={J.gold} delay={0.4}/>
              </motion.div>
            </div>
          </Reveal>
          <div className="skills-columns" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2.5rem',alignItems:'start'}}>
            {/* ── Kolom Hard Skill ── */}
            <div>
              <Reveal direction="left">
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1.3rem'}}>
                  <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,rgba(0,82,245,0.5))`}}/>
                  <h3 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1.3rem,4vw,1.9rem)',color:J.red,letterSpacing:'1px',whiteSpace:'nowrap'}}>HARD <span style={{color:J.white}}>SKILL</span></h3>
                  <div style={{flex:1,height:1,background:`linear-gradient(to left,transparent,rgba(0,82,245,0.5))`}}/>
                </div>
              </Reveal>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {skills.filter(sk=>sk.category!=='soft').map((sk,i)=>(
                  <Reveal key={sk.id} direction="up" delay={i*0.09}>
                    <TiltCard style={{borderRadius:14}} intensity={10}>
                      <InkRipple>
                        <motion.div whileHover={{boxShadow:`0 24px 70px rgba(0,82,245,0.25),0 0 0 1px rgba(0,82,245,0.4)`}}
                          style={{background:'rgba(8,16,26,0.9)',border:`1px solid rgba(0,82,245,0.18)`,borderRadius:14,padding:'1.5rem',position:'relative',overflow:'hidden',backdropFilter:'blur(14px)',transition:'all 0.3s'}}>
                          <div style={{position:'absolute',right:8,top:4,fontFamily:'serif',fontSize:'4rem',color:`rgba(0,82,245,0.07)`,lineHeight:1,userSelect:'none'}}>{['技','能','術','力'][i%4]}</div>
                          <motion.div animate={{scale:[1,1.4,1],opacity:[0.12,0.28,0.12]}} transition={{duration:3+i*0.4,repeat:Infinity}} style={{position:'absolute',top:-15,left:-15,width:70,height:70,borderRadius:'50%',background:`radial-gradient(circle,rgba(0,82,245,0.2),transparent 70%)`}}/>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.6rem',position:'relative',zIndex:1}}>
                            <motion.div animate={{y:[0,-3,0]}} transition={{duration:2.5+i*0.3,repeat:Infinity}}
                              style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',color:J.red,textShadow:`0 0 15px rgba(0,82,245,0.6)`,lineHeight:1}}>{sk.number}</motion.div>
                            <div style={{flex:1,height:1,background:`linear-gradient(to right,rgba(0,82,245,0.5),transparent)`}}/>
                          </div>
                          <div style={{position:'absolute',top:8,right:8,width:10,height:10,borderTop:`1px solid ${J.gold}`,borderRight:`1px solid ${J.gold}`,opacity:0.4}}/>
                          <div style={{position:'absolute',bottom:8,left:8,width:10,height:10,borderBottom:`1px solid ${J.gold}`,borderLeft:`1px solid ${J.gold}`,opacity:0.4}}/>
                          <h4 style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.85rem',color:J.white,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.5rem',position:'relative',zIndex:1}}>{sk.title}</h4>
                          <SkillDesc desc={sk.desc} color="rgba(234,242,248,0.6)" />
                          <motion.div animate={{scaleX:[0,1,0]}} transition={{duration:3,repeat:Infinity,delay:i*0.35}}
                            style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${J.red},${J.gold},transparent)`,transformOrigin:'left'}}/>
                        </motion.div>
                      </InkRipple>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
            {/* ── Kolom Soft Skill ── */}
            <div>
              <Reveal direction="right">
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1.3rem'}}>
                  <div style={{flex:1,height:1,background:`linear-gradient(to right,transparent,rgba(0,146,199,0.5))`}}/>
                  <h3 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1.3rem,4vw,1.9rem)',color:J.gold,letterSpacing:'1px',whiteSpace:'nowrap'}}>SOFT <span style={{color:J.white}}>SKILL</span></h3>
                  <div style={{flex:1,height:1,background:`linear-gradient(to left,transparent,rgba(0,146,199,0.5))`}}/>
                </div>
              </Reveal>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {skills.filter(sk=>sk.category==='soft').map((sk,i)=>(
                  <Reveal key={sk.id} direction="up" delay={i*0.09}>
                    <TiltCard style={{borderRadius:14}} intensity={10}>
                      <InkRipple>
                        <motion.div whileHover={{boxShadow:`0 24px 70px rgba(0,146,199,0.2),0 0 0 1px rgba(0,146,199,0.35)`}}
                          style={{background:'rgba(8,16,26,0.9)',border:`1px solid rgba(0,146,199,0.18)`,borderRadius:14,padding:'1.5rem',position:'relative',overflow:'hidden',backdropFilter:'blur(14px)',transition:'all 0.3s'}}>
                          <div style={{position:'absolute',right:8,top:4,fontFamily:'serif',fontSize:'4rem',color:`rgba(0,146,199,0.07)`,lineHeight:1,userSelect:'none'}}>{['和','心','絆','善'][i%4]}</div>
                          <motion.div animate={{scale:[1,1.4,1],opacity:[0.12,0.28,0.12]}} transition={{duration:3+i*0.4,repeat:Infinity}} style={{position:'absolute',top:-15,left:-15,width:70,height:70,borderRadius:'50%',background:`radial-gradient(circle,rgba(0,146,199,0.2),transparent 70%)`}}/>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.6rem',position:'relative',zIndex:1}}>
                            <motion.div animate={{y:[0,-3,0]}} transition={{duration:2.5+i*0.3,repeat:Infinity}}
                              style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',color:J.gold,textShadow:`0 0 15px rgba(0,146,199,0.6)`,lineHeight:1}}>{sk.number}</motion.div>
                            <div style={{flex:1,height:1,background:`linear-gradient(to right,rgba(0,146,199,0.5),transparent)`}}/>
                          </div>
                          <div style={{position:'absolute',top:8,right:8,width:10,height:10,borderTop:`1px solid ${J.red}`,borderRight:`1px solid ${J.red}`,opacity:0.4}}/>
                          <div style={{position:'absolute',bottom:8,left:8,width:10,height:10,borderBottom:`1px solid ${J.red}`,borderLeft:`1px solid ${J.red}`,opacity:0.4}}/>
                          <h4 style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.85rem',color:J.white,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.5rem',position:'relative',zIndex:1}}>{sk.title}</h4>
                          <SkillDesc desc={sk.desc} color="rgba(234,242,248,0.6)" />
                          <motion.div animate={{scaleX:[0,1,0]}} transition={{duration:3,repeat:Infinity,delay:i*0.35}}
                            style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${J.gold},${J.red},transparent)`,transformOrigin:'left'}}/>
                        </motion.div>
                      </InkRipple>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
          <style>{`
            @media (max-width: 860px) {
              .skills-columns { grid-template-columns: 1fr !important; gap: 3rem !important; }
            }
          `}</style>
        </div>
      </JapanBgSection>
      </LazyMount>

      {/* ══ CTA — 覇道 (Hado / Path of Dominance) ══ */}
      <LazyMount minHeight={700}>
      <JapanBgSection overlayColor={J.ov88} style={{textAlign:'center'}}>
        <InkBrushCanvas/>
        {/* Dense smoke */}
        <SmokeCloud style={{left:'-8%',bottom:'0%',opacity:1}} delay={0}/>
        <SmokeCloud style={{right:'-8%',bottom:'2%',opacity:0.95}} delay={1} flip/>
        <SmokeCloud style={{left:'15%',bottom:'0%',opacity:0.7}} delay={0.5}/>
        <SmokeCloud style={{right:'18%',bottom:'1%',opacity:0.65}} delay={1.5} flip/>
        {/* Large rising sun center */}
        <RisingSun style={{left:'50%',top:'8%',transform:'translateX(-50%)'}} opacity={0.1}/>
        {/* Torii gates */}
        <ToriiGate style={{left:'12%',bottom:'5%'}} opacity={0.1}/>
        <ToriiGate style={{right:'12%',bottom:'5%'}} opacity={0.1}/>
        {/* Buildings flanking */}
        <StrucBuilding style={{left:'0%',bottom:'3%',opacity:0.55}} delay={0}/>
        <StrucBuilding style={{right:'0%',bottom:'4%',opacity:0.5}} flip delay={1}/>
        <StrucBuilding style={{left:'14%',bottom:'2%',opacity:0.3}} delay={0.6}/>
        <StrucBuilding style={{right:'14%',bottom:'3%',opacity:0.3}} flip delay={1.2}/>
        {/* Mon circles flanking */}
        <SamuraiMon style={{left:'3%',top:'20%'}} delay={0} size={100} variant={0}/>
        <SamuraiMon style={{right:'3%',top:'22%'}} delay={1} size={90} variant={1}/>
        {/* Large ink circles */}
        <InkCircle style={{left:'50%',bottom:'10%',transform:'translateX(-50%)'}} delay={0} size={200} color="red"/>
        {/* Katana crossed */}
        <Katana style={{top:'25%',left:'5%',transform:'rotate(-15deg)'}} delay={0}/>
        <Katana style={{top:'25%',right:'5%',transform:'rotate(15deg) scaleX(-1)'}} delay={0.8}/>
        {/* War banners */}
        <Nobori style={{left:'8%',top:'8%',opacity:0.5}} delay={0} kanji="覇"/>
        <Nobori style={{right:'8%',top:'8%',opacity:0.5}} delay={0.5} kanji="道"/>
        <Nobori style={{left:'20%',top:'12%',opacity:0.35}} delay={1} kanji="武"/>
        <Nobori style={{right:'20%',top:'12%',opacity:0.35}} delay={1.5} kanji="魂"/>
        {/* Kanji stamps */}
        <KanjiStamp kanji="覇" style={{left:'2%',bottom:'5%'}} delay={0.3} size={80}/>
        <KanjiStamp kanji="魂" style={{right:'2%',bottom:'5%'}} delay={0.8} size={75}/>

        <div style={{position:'relative',zIndex:2,maxWidth:700,margin:'0 auto'}}>
          <Reveal direction="scale">
            {/* Large kanji */}
            <motion.div animate={{opacity:[0.5,0.9,0.5]}} transition={{duration:3,repeat:Infinity}}
              style={{fontFamily:'serif',fontSize:'clamp(3rem,8vw,5rem)',color:J.red,marginBottom:'0.3rem',textShadow:`0 0 40px rgba(0,82,245,0.5),0 0 80px rgba(0,82,245,0.2)`}}>
              覇
            </motion.div>
            <div style={{fontFamily:'var(--font-body)',color:J.gold,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,marginBottom:'1rem'}}>
              Hado · Path of Dominance
            </div>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.95,color:J.white,wordBreak:'break-word',marginBottom:'0.8rem'}}>
              SIAP BERKOLABORASI?
            </h2>
            <BrushStroke style={{position:'relative',margin:'0 auto 1.2rem',display:'block',width:'fit-content'}} width={80} color={J.red} delay={0.3}/>
            <p style={{color:'rgba(234,242,248,0.55)',marginBottom:'2.5rem',fontSize:'clamp(0.9rem,2vw,1.05rem)',lineHeight:1.7,maxWidth:480,margin:'0 auto 2.5rem'}}>
              Seperti seorang samurai yang menguasai pedangnya — saya siap membawa setiap proyek ke puncaknya.
            </p>
            {/* CTA Button */}
            <div style={{position:'relative',display:'inline-block'}}>
              {[...Array(3)].map((_,i)=>(
                <motion.div key={i} style={{position:'absolute',inset:-(i+1)*10,borderRadius:8,border:`1.5px solid rgba(0,82,245,${0.4-i*0.1})`,pointerEvents:'none'}}
                  animate={{scale:[1,1.2,1],opacity:[0.5,0,0.5]}} transition={{duration:2.2,repeat:Infinity,delay:i*0.7}}/>
              ))}
              <motion.a href={`mailto:${contact.email}`}
                whileHover={{scale:1.06,boxShadow:`0 15px 50px rgba(0,82,245,0.55)`}} whileTap={{scale:0.97}}
                style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',background:`linear-gradient(135deg,${J.red},${J.redD})`,color:J.white,textDecoration:'none',borderRadius:8,padding:'16px 48px',fontFamily:'var(--font-body)',fontWeight:800,fontSize:'1rem',letterSpacing:'0.5px',position:'relative',boxShadow:`0 8px 30px rgba(0,82,245,0.45)`,border:`1px solid rgba(0,146,199,0.25)`}}>
                ⛩ Mulai Sekarang →
              </motion.a>
            </div>
          </Reveal>
        </div>
      </JapanBgSection>
      </LazyMount>

      <ContactSection/>
      <Footer/>

      <style>{`
        /* ── ABOUT ROW ── */
        @media(min-width:768px){
          #about-row{flex-direction:row!important;align-items:flex-start!important;}
          #about-row>*{width:50%;}
        }

        /* ── HERO SUBTITLE ── */
        @media(max-width:767px){
          .shine-wrap{white-space:normal!important;word-break:break-word;}
          .hk-hero-subtitle>div{font-size:clamp(0.55rem,2.8vw,0.75rem)!important;white-space:normal!important;overflow:visible!important;text-overflow:unset!important;line-height:1.8!important;}
        }
        @media(min-width:768px){
          .hk-hero-subtitle>div{font-size:clamp(0.65rem,1.5vw,1rem)!important;}
        }

        /* ── HERO 3/4 LAYAR DI MOBILE ── */
        @media(max-width:767px){
          #hk-hero{
            height:75vh !important;
            min-height:300px !important;
            max-height:none !important;
          }
          #hk-hero video{
            width:100% !important;
            height:100% !important;
            object-fit:cover !important;
          }
          /* Hero title LEBIH BESAR di mobile */
          #hk-hero .shine-wrap{
            font-size:clamp(1.2rem,7vw,2.2rem)!important;
            white-space:nowrap!important;
          }
          /* Subtitle */
          #hk-hero .hk-hero-subtitle>div{
            font-size:clamp(0.5rem,2.2vw,0.72rem)!important;
            line-height:1.5!important;
            white-space:nowrap!important;
          }
          /* Tagline tampil di mobile portrait */
          #hk-hero .hk-hero-tagline{display:block!important;font-size:0.78rem!important;}
          /* Buttons */
          #hk-hero .hk-hero-cta-row button{
            padding:8px 16px!important;
            font-size:0.72rem!important;
          }
          /* Location badge */
          #hk-hero .hk-location-badge span{
            font-size:0.68rem!important;
          }
          /* Gap elemen dalam hero */
          #hk-hero>div>div{
            gap:0.5rem!important;
            padding-bottom:1rem!important;
          }
        }

        /* Portrait phone kecil (<480px) */
        @media(max-width:480px) and (orientation:portrait){
          #hk-hero{
            height:75vh !important;
            min-height:280px !important;
          }
          #hk-hero .shine-wrap{
            font-size:clamp(1rem,6.5vw,1.8rem)!important;
          }
        }

        /* ── GLOBAL MOBILE OPTIMIZATIONS ── */
        @media(max-width:767px){
          body,#root{overflow-x:hidden!important;}
          .hk-section-inner{padding-left:1rem!important;padding-right:1rem!important;}
          .hk-section-h2{font-size:clamp(1.8rem,9vw,3rem)!important;}
          #about-row>*:first-child{max-width:100%!important;width:100%!important;}
          .hk-exp-timeline-line{left:12px!important;}
          .hk-exp-icon{width:36px!important;height:36px!important;font-size:1rem!important;}
          .hk-skills-grid{grid-template-columns:1fr!important;}
        }
        @media(min-width:480px) and (max-width:767px){
          .hk-skills-grid{grid-template-columns:1fr 1fr!important;}
        }

        /* ── HIDE HEAVY SVG DECORATIONS ON MOBILE ── */
        @media(max-width:480px){
          .hk-bg-deco{display:none!important;}
        }

        /* ── CTA BUTTON STACK ON MOBILE ── */
        @media(max-width:480px){
          .hk-hero-cta-row{flex-direction:row!important;gap:0.4rem!important;}
        }

        /* ── CERT CARDS ── */
        @media(max-width:767px){
          .hk-cert-card{flex-direction:column!important;}
          .hk-cert-img{width:100%!important;height:140px!important;}
        }

        /* ── MARQUEE ── */
        @media(max-width:480px){
          .hk-marquee-item{font-size:0.75rem!important;padding:0 0.8rem!important;}
        }
      `}</style>
    </div>
  );
};

export default Home;
export { D_ABOUT, D_ABOUT_EN, D_SKILLS, D_SKILLS_EN, D_EXP, D_EXP_EN, D_CERT, D_CERT_EN, D_HOME, D_HOME_EN };
export type { HomeData, AboutData, SkillItem, ExpItem, CertItem };
