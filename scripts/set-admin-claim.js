#!/usr/bin/env node
// scripts/set-admin-claim.js — beri / cabut custom claim `admin: true` untuk akun Firebase Auth.
// Claim ini membuat akun diakui sebagai admin tanpa bergantung pada email (lihat firestore.rules & src/config/admins.ts).
//
// Pemakaian (sekali saja, dari komputer sendiri; JANGAN commit file kunci):
//   1. Firebase Console → Project settings → Service accounts → Generate new private key → simpan mis. ./service-account.json
//   2. npm i --no-save firebase-admin
//   3. GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node scripts/set-admin-claim.js email@contoh.com
//      (Windows PowerShell: $env:GOOGLE_APPLICATION_CREDENTIALS='.\service-account.json'; node scripts/set-admin-claim.js email@contoh.com)
//   Cabut:  node scripts/set-admin-claim.js email@contoh.com --revoke
// User perlu logout/login ulang (atau tunggu ±1 jam) agar token barunya memuat claim.
let admin;
try { admin = require('firebase-admin'); } catch {
  console.error('firebase-admin belum terpasang. Jalankan:  npm i --no-save firebase-admin');
  process.exit(1);
}

const [email, flag] = process.argv.slice(2);
if (!email || !email.includes('@')) {
  console.error('Pemakaian: node scripts/set-admin-claim.js <email> [--revoke]');
  process.exit(1);
}

admin.initializeApp({ projectId: 'hikimori-18d47' });
(async () => {
  const user = await admin.auth().getUserByEmail(email);
  const claims = { ...(user.customClaims || {}) };
  if (flag === '--revoke') delete claims.admin; else claims.admin = true;
  await admin.auth().setCustomUserClaims(user.uid, claims);
  console.log(`${flag === '--revoke' ? 'Dicabut' : 'Diberikan'}: admin claim untuk ${email} (uid ${user.uid})`);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
