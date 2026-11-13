// src/utils/cloudinaryUpload.ts
// Upload bertanda tangan (signed) lewat /api/cloudinary-sign (khusus admin login). Bila server belum dikonfigurasi
// atau sedang error (5xx), pakai preset unsigned lama sebagai cadangan.
import { CLOUDINARY_CONFIG } from '../config/services';
import { getAuthInstance } from '../config/firebase';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  let signed = false;
  try {
    const token = await (await getAuthInstance()).currentUser?.getIdToken();
    if (token) {
      const r = await fetch('/api/cloudinary-sign', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) {
        const s = await r.json();
        formData.append('api_key', s.apiKey);
        formData.append('timestamp', String(s.timestamp));
        formData.append('folder', s.folder);
        formData.append('allowed_formats', s.allowedFormats);
        formData.append('signature', s.signature);
        signed = true;
      } else if (r.status === 401 || r.status === 403) {
        // Hanya penolakan akses yang menghentikan upload; server error (5xx/404/501) jatuh ke preset unsigned
        throw new Error('Tanda tangan upload ditolak');
      }
    }
  } catch (e: any) {
    if (e?.message === 'Tanda tangan upload ditolak') throw e;
  }
  if (!signed) formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const res = await fetch(CLOUDINARY_CONFIG.apiUrl, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload ke Cloudinary gagal');
  const data = await res.json();
  return data.secure_url as string;
};
