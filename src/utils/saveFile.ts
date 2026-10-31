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
  // octet-stream: Safari iOS tetap MEMBUKA PDF di penampil walau ada atribut download; tipe biner memaksa unduh
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
  clickDownload(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 60_000); // jangan langsung: Safari butuh waktu

  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) window.dispatchEvent(new CustomEvent(SHARE_EVENT, { detail: file }));
}

/** Unduh file dari URL (mis. CV PDF). Bila gagal diambil (CORS / offline), coba unduh langsung lewat link (tanpa pindah halaman). */
export async function downloadUrl(href: string, fallbackName = 'file.pdf') {
  try {
    const res = await fetch(href);
    if (!res.ok) throw new Error(String(res.status));
    const base = decodeURIComponent(new URL(href, window.location.href).pathname.split('/').pop() || '');
    saveFile(await res.blob(), /\.\w{2,5}$/.test(base) ? base : fallbackName);
  } catch {
    clickDownload(href, fallbackName);
  }
}
