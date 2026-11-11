// api/_auth.ts — verifikasi admin untuk Vercel Serverless Functions (file berawalan _ tidak menjadi endpoint).
// Klien mengirim `Authorization: Bearer <Firebase ID token>`. Token diperiksa lewat Identity Toolkit
// `accounts:lookup` (API resmi Firebase Auth, tanpa dependensi tambahan): token palsu/kedaluwarsa ditolak Google,
// lalu email/claim dicocokkan dengan aturan admin yang sama dengan Firestore Rules (src/config/admins.ts).
import { isAdminClaims } from '../src/config/admins';

// Web API key Firebase memang publik (sama dengan yang ada di bundle); boleh ditimpa lewat env.
const API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyA2_CNohjlSmQN2phrYzVW47ghFWsqo8I8';

export type AuthResult = { ok: true; email: string } | { ok: false; status: 401 | 403; error: string };

export async function requireAdmin(req: any): Promise<AuthResult> {
  const header = String(req.headers?.authorization || '');
  const m = header.match(/^Bearer\s+([\w-]+\.[\w-]+\.[\w-]+)$/);
  if (!m) return { ok: false, status: 401, error: 'Butuh login admin.' };
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: m[1] }),
    });
    if (!r.ok) return { ok: false, status: 401, error: 'Sesi login tidak valid atau kedaluwarsa.' };
    const u = (await r.json())?.users?.[0];
    if (!u) return { ok: false, status: 401, error: 'Sesi login tidak valid.' };
    let admin: unknown;
    try { admin = JSON.parse(u.customAttributes || '{}').admin; } catch { /* tanpa claim */ }
    if (!isAdminClaims({ email: u.email, emailVerified: u.emailVerified, admin }))
      return { ok: false, status: 403, error: 'Akun ini tidak punya akses.' };
    return { ok: true, email: String(u.email || '') };
  } catch {
    return { ok: false, status: 401, error: 'Gagal memverifikasi login.' };
  }
}
