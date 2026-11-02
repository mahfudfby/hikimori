// src/cv/exportCv.ts — font, PDF (gambar persis tampilan) dan cetak teks asli.
import { PAGE_H, PAGE_W } from './CvDocument';

/** Muat font Arimo (metrik = Arial) supaya tata letak sama di semua perangkat. Offline: pakai Arial. */
export async function ensureFont(): Promise<void> {
  if (!document.getElementById('hk-cv-font')) {
    const l = document.createElement('link');
    l.id = 'hk-cv-font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&display=swap';
    document.head.appendChild(l);
  }
  try { await Promise.all(['400 16px Arimo', '700 16px Arimo'].map((f) => document.fonts.load(f))); } catch { /* pakai font cadangan */ }
  await document.fonts.ready;
}

/** Render tiap halaman CV ke kanvas (satu per satu, hemat memori). Halaman disalin ke wadah di luar layar agar tidak ikut skala pratinjau. */
async function eachPage(pages: HTMLElement[], scale: number, fn: (canvas: HTMLCanvasElement, i: number) => void | Promise<void>) {
  await ensureFont();
  const { default: html2canvas } = await import('html2canvas');
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_W}px;background:#fff`;
  document.body.appendChild(host);
  try {
    for (const [i, page] of pages.entries()) {
      const clone = page.cloneNode(true) as HTMLElement;
      host.appendChild(clone);
      const canvas = await html2canvas(clone, { scale, width: PAGE_W, height: PAGE_H, windowWidth: 1280, backgroundColor: '#ffffff', useCORS: true });
      host.removeChild(clone);
      await fn(canvas, i);
    }
  } finally {
    host.remove();
  }
}

/** Mutu PDF. min: tetap resolusi tinggi (3x, ±288 dpi, setara kualitas cetak 300 dpi) dengan JPEG 0,5; ±30% lebih kecil dari 4x (diukur: ±426 KB vs ±660 KB per halaman); std: 2,5x (±240 dpi); hd: 4x (±384 dpi). */
export type PdfMode = 'min' | 'std' | 'hd';
const PDF_Q: Record<PdfMode, { scale: number; q: number }> = { min: { scale: 3, q: 0.5 }, std: { scale: 2.5, q: 0.92 }, hd: { scale: 4, q: 0.97 } };

/** PDF A4: tiap halaman di-render ke gambar JPEG lalu dirakit (JPEG: PNG membuat PDF sangat besar). */
export async function exportPdf(pages: HTMLElement[], mode: PdfMode = 'std'): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: [210, 297], orientation: 'portrait', compress: true });
  const { scale, q } = PDF_Q[mode];
  await eachPage(pages, scale, (canvas, i) => {
    if (i) pdf.addPage([210, 297], 'portrait');
    pdf.addImage(canvas.toDataURL('image/jpeg', q), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  });
  return pdf.output('blob');
}

/** JPEG resolusi tinggi: satu file per halaman A4 (4x = 3176 x 4492 px, ±384 dpi). */
export async function exportJpegs(pages: HTMLElement[]): Promise<Blob[]> {
  const out: Blob[] = [];
  await eachPage(pages, 4, async (canvas) => {
    out.push(await new Promise<Blob>((ok, no) => canvas.toBlob((b) => (b ? ok(b) : no(new Error('Gagal membuat gambar.'))), 'image/jpeg', 0.97)));
  });
  return out;
}

/** Cetak teks asli lewat dialog cetak browser (pilih "Simpan sebagai PDF"): PDF-nya bisa dicari/disalin dan terbaca sistem ATS. */
export function printText(pages: HTMLElement[], title: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(iframe);
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) { iframe.remove(); return reject(new Error('Browser tidak mendukung cetak.')); }
    const styles = [...document.querySelectorAll('link[rel="stylesheet"]')].map((n) => n.outerHTML).join('');
    const css = `@page { size: 210mm 297mm; margin: 0; } html, body { margin: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .sheet { width: 210mm; height: 297mm; overflow: hidden; break-after: page; page-break-after: always; } .sheet:last-child { break-after: auto; page-break-after: auto; }`;
    const scale = (210 * 96) / 25.4 / PAGE_W;
    const sheets = pages.map((p) => `<div class="sheet"><div style="width:${PAGE_W}px;transform:scale(${scale});transform-origin:top left">${p.outerHTML}</div></div>`).join('');
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title.replace(/[<>&"]/g, '')}</title>${styles}<style>${css}</style></head><body>${sheets}</body></html>`);
    doc.close();
    let removed = false;
    const cleanup = () => { if (!removed) iframe.remove(); removed = true; };
    win.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 120_000);
    setTimeout(() => { try { win.focus(); win.print(); resolve(); } catch (e) { cleanup(); reject(e); } }, 500);
  });
}
