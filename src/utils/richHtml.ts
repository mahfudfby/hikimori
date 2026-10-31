// src/utils/richHtml.ts — HTML artikel dari editor gaya Word: dibersihkan dengan daftar putih (tag, gaya, class).
// Semua yang tidak dikenal (skrip, iframe, event handler, url(), gambar) dibuang sebelum disimpan & sebelum tampil.
import { parseInline } from './embed';

const KEEP: Record<string, string> = {
  P: 'p', DIV: 'div', BR: 'br', UL: 'ul', OL: 'ol', LI: 'li', BLOCKQUOTE: 'blockquote',
  B: 'strong', STRONG: 'strong', I: 'em', EM: 'em', U: 'u', S: 's', STRIKE: 's', DEL: 's',
  SUB: 'sub', SUP: 'sup', SPAN: 'span', FONT: 'span', MARK: 'mark', A: 'a',
  H1: 'h2', H2: 'h2', H3: 'h3', H4: 'h4', H5: 'h4', H6: 'h4',
};
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'TITLE', 'META', 'LINK', 'SVG', 'MATH', 'IMG', 'VIDEO', 'AUDIO', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'HEAD']);
export const FX = ['fx-shadow', 'fx-glow', 'fx-outline', 'fx-gold', 'btn-link'];

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(,\s*[\d.]+\s*)?\)|[a-z]{3,20})$/i;
const LEN = /^\d+(\.\d+)?(px|pt|em|rem|%)$/;
const BORDER = /^\d+(\.\d+)?px (solid|dashed|dotted|double)( (#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]{3,20}))?$/i;
const STYLE: Record<string, RegExp> = {
  color: COLOR, 'background-color': COLOR,
  'font-family': /^[\w\s,'"-]{1,80}$/, 'font-size': LEN,
  'font-weight': /^(bold|bolder|[4-9]00|normal)$/, 'font-style': /^(italic|normal)$/,
  'text-decoration-line': /^(underline|line-through|none)( (underline|line-through))?$/,
  'text-align': /^(left|center|right|justify|start|end)$/, 'line-height': /^\d+(\.\d+)?(px|%|em)?$/,
  'margin-left': LEN, 'padding-left': LEN, 'text-indent': LEN, padding: /^[\d.]+(px|em)( [\d.]+(px|em)){0,3}$/,
  'border-top': BORDER, 'border-right': BORDER, 'border-bottom': BORDER, 'border-left': BORDER,
  'list-style-type': /^(disc|circle|square|decimal|lower-alpha|upper-alpha|lower-roman|upper-roman)$/,
};
const FONT_SIZE_ATTR = [0, 10, 13, 16, 18, 24, 32, 48];

function clean(src: Node, out: Node, doc: Document) {
  src.childNodes.forEach(n => {
    if (n.nodeType === 3) { out.appendChild(doc.createTextNode(n.textContent || '')); return; }
    if (n.nodeType !== 1) return; // komentar dll.
    const el = n as HTMLElement, tag = el.tagName.toUpperCase();
    if (DROP.has(tag)) return;
    const name = tag.includes(':') ? undefined : KEEP[tag]; // o:p dll. dari Word
    if (!name) { clean(el, out, doc); return; } // tag tak dikenal (mis. o:p dari Word): buang tag, simpan isi
    const o = doc.createElement(name);
    for (const p of Object.keys(STYLE)) {
      const v = el.style.getPropertyValue(p).trim();
      if (v && STYLE[p].test(v)) o.style.setProperty(p, v);
    }
    const deco = el.style.getPropertyValue('text-decoration').trim();
    if (deco && !o.style.getPropertyValue('text-decoration-line') && STYLE['text-decoration-line'].test(deco)) o.style.setProperty('text-decoration-line', deco);
    if (tag === 'FONT') {
      const c = el.getAttribute('color'), f = el.getAttribute('face'), s = Number(el.getAttribute('size'));
      if (c && COLOR.test(c)) o.style.color = c;
      if (f && STYLE['font-family'].test(f)) o.style.fontFamily = f;
      if (FONT_SIZE_ATTR[s]) o.style.fontSize = `${FONT_SIZE_ATTR[s]}px`;
    }
    const fx = (el.getAttribute('class') || '').split(/\s+/).filter(c => FX.includes(c));
    if (fx.length) o.setAttribute('class', fx.join(' '));
    if (name === 'a') {
      const href = el.getAttribute('href') || '';
      if (!/^(https?:|mailto:|tel:)/i.test(href)) { clean(el, out, doc); return; }
      o.setAttribute('href', href); o.setAttribute('target', '_blank'); o.setAttribute('rel', 'noopener noreferrer');
    }
    out.appendChild(o);
    if (name !== 'br') clean(el, o, doc);
  });
}

/** HTML apa pun → HTML aman (daftar putih). */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html || ''}</body>`, 'text/html');
  const box = doc.createElement('div');
  clean(doc.body, box, doc);
  return (box.textContent?.trim() || box.querySelector('li')) ? box.innerHTML : '';
}

export const isRichHtml = (s: string) => /^\s*<(p|div|ul|ol|h[1-6]|blockquote|span|strong|em|u|s|sub|sup|br|mark|a)[\s>/]/i.test(s || '');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Teks format lama (**tebal**, *miring*, baris kosong = paragraf) → HTML untuk dibuka di editor. */
export function legacyToHtml(text: string): string {
  return (text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p>${p.split('\n').map(line =>
    parseInline(line).map(n => n.t === 'b' ? `<strong>${esc(n.v)}</strong>` : n.t === 'i' ? `<em>${esc(n.v)}</em>`
      : n.t === 'code' ? esc(n.v) : n.t === 'a' ? `<a href="${esc(n.href)}">${esc(n.v)}</a>` : esc(n.v)).join('')).join('<br>')}</p>`).join('');
}

// ---------- Hyphenation otomatis (pemenggalan suku kata bahasa Indonesia) ----------
const SHY = '\u00AD';
const VOWEL = /[aeiou]/;
/** Satu kata → kata dengan tanda pisah lunak (&shy;) di batas suku kata: ba-ngun, ang-ka, in-stru-men. */
export function hyphenateWord(word: string): string {
  if (word.length < 6 || !/^[a-zA-Z]+$/.test(word)) return word;
  const w = word.toLowerCase();
  // satuan huruf: ng, ny, kh, sy dihitung satu konsonan
  const units: string[] = [];
  for (let i = 0; i < w.length;) {
    const two = w.slice(i, i + 2);
    if (['ng', 'ny', 'kh', 'sy'].includes(two)) { units.push(two); i += 2; } else { units.push(w[i]); i += 1; }
  }
  const cuts: number[] = []; // indeks satuan tempat kata dipenggal (sebelum satuan ini)
  let i = 0;
  while (i < units.length && !VOWEL.test(units[i])) i++;
  while (i < units.length) {
    let j = i + 1;
    while (j < units.length && !VOWEL.test(units[j])) j++;
    if (j >= units.length) break; // tidak ada vokal lagi
    const cons = j - i - 1;
    if (cons === 1) cuts.push(i + 1); // V-CV
    else if (cons === 2 && /^[bdfgkpt][rl]$/.test(units[i + 1] + units[i + 2])) cuts.push(i + 1); // V-CCV: pa-ra-graf, pu-tra
    else if (cons >= 2) cuts.push(i + 2); // VC-CV, VC-CCV
    i = j;
  }
  let out = '', pos = 0, ui = 0;
  const at = new Set(cuts);
  for (const u of units) {
    if (at.has(ui) && pos >= 2 && word.length - pos >= 3) out += SHY;
    out += word.slice(pos, pos + u.length);
    pos += u.length; ui++;
  }
  return out;
}
export const hyphenate = (text: string) => (text || '').replace(/[a-zA-Z]{6,}/g, hyphenateWord);

/** HTML aman + pemenggalan otomatis di semua teks (hanya saat tampil, data tersimpan tetap bersih). */
export function hyphenateHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const walk = doc.createTreeWalker(doc.body, 4);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) n.textContent = hyphenate(n.textContent || '');
  return doc.body.innerHTML;
}
