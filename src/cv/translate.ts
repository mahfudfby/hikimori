// src/cv/translate.ts — terjemahan otomatis Indonesia → Inggris lewat /api/translate (api/translate.ts).
// Hasil disimpan per kalimat di localStorage perangkat: teks yang sama tidak diterjemahkan ulang.
import type { Tmap } from './cvModel';
import { getAuthInstance } from '../config/firebase';

const CACHE_KEY = 'hk_cv_tr_v1';
const CACHE_MAX = 3000;
let memo: Tmap | null = null;

const load = (): Tmap => {
  if (memo) return memo;
  try { memo = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { memo = {}; }
  return memo as Tmap;
};

/** Peta terjemahan yang sudah ada (objek yang sama dipakai ulang; tampilan di-render ulang lewat penghitung versi). */
export const trCache = (): Tmap => load();

/** Terjemahkan teks yang belum ada di cache. */
export async function translateMissing(texts: string[]): Promise<void> {
  const cache = load();
  const todo = [...new Set(texts.filter((t) => t.trim() && !(t in cache)))];
  // /api/translate hanya untuk admin yang login: kirim ID token Firebase (diverifikasi di api/_auth.ts)
  const token = todo.length ? await (await getAuthInstance()).currentUser?.getIdToken() : undefined;
  if (todo.length && !token) throw new Error('Login dulu untuk menerjemahkan CV.');
  for (let i = 0; i < todo.length; i += 150) {
    const q = todo.slice(i, i + 150);
    const r = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ q }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !Array.isArray(data.t)) throw new Error(data.error || `server ${r.status}`);
    q.forEach((s, j) => { cache[s] = data.t[j] ?? s; });
  }
  if (!todo.length) return;
  const keys = Object.keys(cache);
  if (keys.length > CACHE_MAX) keys.slice(0, keys.length - CACHE_MAX).forEach((k) => delete cache[k]);
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* penyimpanan penuh: cache hanya di memori */ }
}
