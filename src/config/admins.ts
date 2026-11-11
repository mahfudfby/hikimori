// src/config/admins.ts — SATU sumber daftar akun admin untuk kode aplikasi (CMS) dan API serverless (/api/*).
// Penjaga sebenarnya tetap Firestore Rules (firestore.rules): bila daftar ini diubah, samakan juga di sana.
//
// Aturan admin (sama di klien, API, dan Firestore Rules):
//   - akun punya custom claim `admin: true` (paling aman, tidak bergantung email), ATAU
//   - email ada di daftar di bawah DAN email_verified == true.
export const ADMIN_EMAILS: readonly string[] = ['admin@hikimori.app', 'mahfudfby@gmail.com', 'mahfudfebry@hikimori.web.id'];

export interface AdminClaims {
  email?: string | null;
  emailVerified?: boolean | null;
  admin?: unknown;
}

export const isAdminEmail = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());

export const isAdminClaims = (c: AdminClaims | null | undefined): boolean =>
  !!c && (c.admin === true || (c.emailVerified === true && isAdminEmail(c.email)));
