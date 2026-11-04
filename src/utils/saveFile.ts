// src/utils/saveFile.ts — simpan file untuk pengunjung, aman di Safari iOS.
// (1) unduh otomatis lewat blob URL, (2) tawarkan Share (iOS: Simpan ke File / Foto).
// navigator.share() wajib dipanggil langsung dari klik, jadi tombolnya ada di <ShareSheet />.
export const SHARE_EVENT = 'hk:share-file';

function clickDownload(href: string, name: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function saveFile(blob: Blob, name: string) {
  // octet-stream: Safari iOS tetap MEMBUKA PDF/JSON di penampil walau ada atribut download; tipe biner memaksa unduh.
  // Gambar tetap bertipe aslinya (diunduh normal, dan Share menawarkan "Simpan Gambar").
  const raw = blob.type.startsWith('image/') ? blob : new Blob([blob], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(raw);
  clickDownload(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 60_000); // jangan langsung: Safari butuh waktu

  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) window.dispatchEvent(new CustomEvent(SHARE_EVENT, { detail: file }));
}

/** Unduh file dari URL (mis. CV PDF). Bila gagal diambil (CORS / offline), coba unduh langsung lewat link (tanpa pindah halaman). */
export async function downloadUrl(href: string, fallbackName = 'file.pdf') {
  try {
    const res = await fetch(href, { mode: 'cors', cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const base = decodeURIComponent(new URL(href, window.location.href).pathname.split('/').pop() || '');
    saveFile(await res.blob(), /\.\w{2,5}$/.test(base) ? base : fallbackName);
  } catch {
    // Cloudinary: fl_attachment membuat server mengirim "Content-Disposition: attachment", jadi browser mengunduh, bukan membuka tab
    clickDownload(/res\.cloudinary\.com\/.+\/upload\//.test(href) ? href.replace('/upload/', '/upload/fl_attachment/') : href, fallbackName);
  }
}
