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

/** PDF A4: tiap halaman di-render ke gambar. Halaman disalin ke wadah di luar layar agar tidak ikut skala pratinjau.
 *  highRes: 4x (±384 dpi, file lebih besar); biasa: 2,5x (±240 dpi). */
export async function exportPdf(pages: HTMLElement[], highRes = false): Promise<Blob> {
  await ensureFont();
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${PAGE_W}px;background:#fff`;
  document.body.appendChild(host);
  try {
    const pdf = new jsPDF({ unit: 'mm', format: [210, 297], orientation: 'portrait' });
    for (const [i, page] of pages.entries()) {
      const clone = page.cloneNode(true) as HTMLElement;
      host.appendChild(clone);
      const canvas = await html2canvas(clone, { scale: highRes ? 4 : 2.5, width: PAGE_W, height: PAGE_H, windowWidth: 1280, backgroundColor: '#ffffff', useCORS: true });
      host.removeChild(clone);
      if (i) pdf.addPage([210, 297], 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', highRes ? 0.97 : 0.92), 'JPEG', 0, 0, 210, 297); // JPEG: PNG membuat PDF sangat besar
    }
    return pdf.output('blob');
  } finally {
    host.remove();
  }
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
