// Vercel Serverless Function — tanda tangan upload Cloudinary (signed upload), hanya untuk admin yang login.
// POST (Authorization: Bearer <Firebase ID token>) → { apiKey, cloudName, timestamp, folder, allowedFormats, signature }
// Env di Vercel: CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (Cloudinary → Settings → API Keys). Tanpa env → 501,
// dan klien memakai preset unsigned lama (lihat src/utils/cloudinaryUpload.ts) sampai env dipasang.
// Setelah env dipasang & upload bertanda tangan terbukti jalan, NONAKTIFKAN preset unsigned `clouds_hikimori`
// di Cloudinary (Settings → Upload → Upload presets) supaya orang luar tidak bisa mengunggah.
import { createHash } from 'crypto';
import { requireAdmin } from './_auth';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dl4pyan8v';
const FOLDER = 'hikimori';
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,gif,avif,svg';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
  const apiKey = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !secret) return res.status(501).json({ error: 'CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET belum di-set.' });

  const timestamp = Math.floor(Date.now() / 1000);
  // Parameter yang ditandatangani, urut abjad, dipisah &, lalu ditambah secret (SHA-1).
  const toSign = `allowed_formats=${ALLOWED_FORMATS}&folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(toSign + secret).digest('hex');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ apiKey, cloudName: CLOUD_NAME, timestamp, folder: FOLDER, allowedFormats: ALLOWED_FORMATS, signature });
}
