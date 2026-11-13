// Vercel Serverless Function — tanda tangan upload Cloudinary (signed upload), hanya untuk admin yang login.
// POST (Authorization: Bearer <Firebase ID token>) → { apiKey, cloudName, timestamp, folder, allowedFormats, signature }
// Env di Vercel: CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (Cloudinary → Settings → API Keys). Tanpa env → 501,
// dan klien memakai preset unsigned lama (lihat src/utils/cloudinaryUpload.ts) sampai env dipasang.
const { createHash } = require("crypto");
const ADMIN_EMAILS = ['admin@hikimori.app', 'mahfudfby@gmail.com', 'mahfudfebry@hikimori.web.id'];
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyA2_CNohjlSmQN2phrYzVW47ghFWsqo8I8';
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dl4pyan8v';
const FOLDER = 'hikimori';
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,gif,avif,svg';
async function requireAdmin(req) {
    const m = String(req.headers?.authorization || '').match(/^Bearer\s+([\w-]+\.[\w-]+\.[\w-]+)$/);
    if (!m)
        return { ok: false, status: 401, error: 'Butuh login admin.' };
    try {
        const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: m[1] }),
        });
        if (!r.ok)
            return { ok: false, status: 401, error: 'Sesi login tidak valid atau kedaluwarsa.' };
        const u = (await r.json())?.users?.[0];
        if (!u)
            return { ok: false, status: 401, error: 'Sesi login tidak valid.' };
        let admin;
        try {
            admin = JSON.parse(u.customAttributes || '{}').admin;
        }
        catch { }
        const email = String(u.email || '').toLowerCase();
        if (admin !== true && !(u.emailVerified === true && ADMIN_EMAILS.includes(email)))
            return { ok: false, status: 403, error: 'Akun ini tidak punya akses.' };
        return { ok: true };
    }
    catch {
        return { ok: false, status: 401, error: 'Gagal memverifikasi login.' };
    }
}
async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const auth = await requireAdmin(req);
    if (!auth.ok)
        return res.status(auth.status).json({ error: auth.error });
    const apiKey = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
    if (!apiKey || !secret)
        return res.status(501).json({ error: 'CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET belum di-set.' });
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `allowed_formats=${ALLOWED_FORMATS}&folder=${FOLDER}&timestamp=${timestamp}`;
    const signature = createHash('sha1').update(toSign + secret).digest('hex');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ apiKey, cloudName: CLOUD_NAME, timestamp, folder: FOLDER, allowedFormats: ALLOWED_FORMATS, signature });
}

// CommonJS biasa (tanpa TS/ESM): versi .ts sebelumnya crash saat dimuat di Vercel (FUNCTION_INVOCATION_FAILED).
module.exports = handler;
