// src/content/firestoreRest.ts
// Baca Firestore lewat REST API (fetch JSON biasa) — TANPA SDK Firebase.
// Pengunjung publik cuma perlu membaca, jadi ±330 KB JavaScript SDK tidak perlu
// diunduh/diproses sama sekali (besar pengaruhnya di HP). SDK hanya dimuat di CMS.
const PROJECT = 'hikimori-18d47';
const API_KEY = 'AIzaSyA2_CNohjlSmQN2phrYzVW47ghFWsqo8I8';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

/** Ubah format nilai bertipe Firestore REST ({ stringValue: 'x' } dst.) menjadi JSON biasa. */
const decode = (v: any): any => {
  if (!v || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('referenceValue' in v) return v.referenceValue;
  if ('geoPointValue' in v) return v.geoPointValue;
  if ('bytesValue' in v) return v.bytesValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return decodeFields(v.mapValue.fields);
  return null;
};
const decodeFields = (fields: Record<string, any> = {}) => {
  const out: Record<string, any> = {};
  for (const k of Object.keys(fields)) out[k] = decode(fields[k]);
  return out;
};

/** Satu dokumen; null bila belum ada. */
export const getDocRest = async (path: string, signal?: AbortSignal): Promise<Record<string, any> | null> => {
  const res = await fetch(`${BASE}/${path}?key=${API_KEY}`, { signal, cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore REST ${res.status}`);
  const json = await res.json();
  return decodeFields(json.fields);
};

/** Semua dokumen dalam koleksi (dengan id). */
export const listCollectionRest = async (collection: string, signal?: AbortSignal): Promise<Record<string, any>[]> => {
  const out: Record<string, any>[] = [];
  let token = '';
  do {
    const res = await fetch(`${BASE}/${collection}?pageSize=300&key=${API_KEY}${token ? `&pageToken=${token}` : ''}`, { signal });
    if (!res.ok) throw new Error(`Firestore REST ${res.status}`);
    const json = await res.json();
    for (const d of json.documents || []) out.push({ ...decodeFields(d.fields), id: String(d.name).split('/').pop() });
    token = json.nextPageToken || '';
  } while (token);
  return out;
};
