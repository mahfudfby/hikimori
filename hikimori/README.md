# 🌐 Hikimori Web — Mahfudfebry's Creative Portfolio

Website personal **Mahfudfebry** dengan desain dark amber yang terinspirasi dari PDF portfolio Hikimori Project.

---

## 🚀 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18 + TypeScript |
| Animasi | **Framer Motion** |
| Database | Firebase Firestore |
| Storage gambar | Cloudinary |
| Email | EmailJS |
| Hosting | Vercel |
| Auth | Firebase Auth |

---

## ⚙️ Setup & Konfigurasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Buat project di [console.firebase.google.com](https://console.firebase.google.com)
2. Aktifkan **Firestore Database**
3. Aktifkan **Authentication → Email/Password**
4. Buat user admin di Firebase Auth:
   - Email: `mahfudfebry@hikimori.web.id`
   - Password: `120200`
5. Salin config ke `src/config/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx"
};
```

6. Set **Firestore Rules**:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Cloudinary Setup

1. Daftar di [cloudinary.com](https://cloudinary.com) (free)
2. Buat **Upload Preset** → unsigned → nama: `hikimori_unsigned`
3. Edit `src/config/services.ts`:

```ts
export const CLOUDINARY_CONFIG = {
  cloudName: "your_cloud_name",
  uploadPreset: "hikimori_unsigned",
  apiUrl: "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload"
};
```

### 4. EmailJS Setup (Opsional, untuk form kontak)

1. Daftar di [emailjs.com](https://emailjs.com) (free)
2. Buat Service + Template
3. Edit `src/config/services.ts`:

```ts
export const EMAILJS_CONFIG = {
  serviceId: "service_xxx",
  templateId: "template_xxx",
  publicKey: "xxx"
};
```

---

## 🖥️ Menjalankan Lokal

```bash
npm start
```

Buka: [http://localhost:3000](http://localhost:3000)

---

## 🌍 Deploy ke Vercel

```bash
npm install -g vercel
vercel
```

Atau connect repo GitHub ke [vercel.com](https://vercel.com) → auto deploy.

---

## 🔐 Admin Panel

- URL: `/admin/login`
- Username: `Mahfudfebry`
- Password: `120200`

Fitur Admin:
- ✅ Dashboard statistik
- ✅ CMS Portfolio (Tambah / Edit / Hapus)
- ✅ Upload gambar via Cloudinary
- ✅ Set featured project
- ✅ Filter kategori

---

## 📁 Struktur File

```
src/
├── config/
│   ├── firebase.ts        ← Firebase config
│   └── services.ts        ← Cloudinary + EmailJS config
├── contexts/
│   └── AuthContext.tsx    ← Auth state
├── hooks/
│   └── usePortfolio.ts    ← Firestore CRUD
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CursorGlow.tsx     ← Custom cursor amber glow
│   ├── AnimatedSection.tsx ← Scroll-triggered animation wrapper
│   ├── PageTransition.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Home.tsx           ← Landing page
│   ├── About.tsx          ← About + Education + Sertifikasi
│   ├── Services.tsx       ← Layanan
│   ├── Portofolio.tsx     ← Portfolio grid + filter
│   ├── AdminLogin.tsx     ← Login admin
│   └── AdminPanel.tsx     ← CMS Panel
├── utils/
│   └── cloudinaryUpload.ts
├── App.tsx
├── index.tsx
└── index.css              ← Global styles + CSS variables
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#F5A623` (Amber) |
| Background | `#0a0a0a` (Black) |
| Surface | `#111111` |
| Display Font | Bebas Neue |
| Script Font | Caveat |
| Body Font | Space Grotesk |

---

## ✨ Fitur Animasi (Framer Motion)

- Page transitions: fade + slide saat pindah halaman
- Hero: staggered entrance animations
- Scroll-triggered: fade-in, slide-left, slide-right, scale
- Hover: float + shadow pada cards
- Cursor glow: amber dot + trailing ring
- Typewriter effect: role cycling di hero
- Navbar: smooth scroll detection
- Parallax: hero section saat scroll

---

*Dibuat dengan ❤️ oleh Mahfudfebry — Hikimori Project, Nganjuk, Indonesia*
