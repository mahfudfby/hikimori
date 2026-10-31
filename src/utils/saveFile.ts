// src/utils/saveFile.ts — simpan file untuk pengunjung, aman di Safari iOS.
// (1) unduh otomatis lewat blob URL, (2) tawarkan Share (iOS: Simpan ke File / Foto).
// navigator.share() wajib dipanggil langsung dari klik, jadi tombolnya ada di <ShareSheet />.
export const SHARE_EVENT = 'hk:share-file';

export function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob); // blob URL (bukan data URL) agar Safari mengunduh, bukan membuka
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000); // jangan langsung: Safari butuh waktu

  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) window.dispatchEvent(new CustomEvent(SHARE_EVENT, { detail: file }));
}

/** Unduh file dari URL (mis. CV PDF). Bila gagal diambil (CORS / offline), buka link-nya seperti biasa. */
export async function downloadUrl(href: string, fallbackName = 'file.pdf') {
  try {
    const res = await fetch(href);
    if (!res.ok) throw new Error(String(res.status));
    const base = decodeURIComponent(new URL(href, window.location.href).pathname.split('/').pop() || '');
    saveFile(await res.blob(), /\.\w{2,5}$/.test(base) ? base : fallbackName);
  } catch {
    window.location.href = href;
  }
}
