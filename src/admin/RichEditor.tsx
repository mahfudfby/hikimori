// src/admin/RichEditor.tsx — editor paragraf gaya Microsoft Word: Clipboard, Font, Paragraf.
// Hasil disimpan sebagai HTML yang sudah dibersihkan (lihat utils/richHtml).
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { sanitizeHtml, isRichHtml, legacyToHtml } from '../utils/richHtml';

const FONTS = ['Georgia', 'Calibri', 'Arial', 'Times New Roman', 'Verdana', 'Trebuchet MS', 'Garamond', 'Courier New', 'Inter'];
const SIZES = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]; // pt, seperti Word
const COLORS = ['#000000', '#444444', '#888888', '#ffffff', '#c00000', '#e8590c', '#c9a227', '#2b8a3e', '#1971c2', '#6741d9', '#c2255c', '#0c8599'];
const MARKS = ['#fff200', '#8ce99a', '#99e9f2', '#fcc2d7', '#a5d8ff', '#ffc9c9', '#d0bfff', '#ced4da'];
const SHADES = ['#fff9db', '#ebfbee', '#e7f5ff', '#fff0f6', '#f3f0ff', '#f1f3f5', '#212529', '#c9a227'];
const LINE = ['1', '1.15', '1.5', '2', '2.5', '3'];
const BORDER = '1px solid #9a9488';
const MARK = '__hk__';

const SVG = (d: string) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true"><path d={d} /></svg>;
const G = {
  paste: SVG('M5 3H3.5v11h9V3H11M6 2h4v2H6zM6 8h4M6 11h4'),
  cut: SVG('M4.5 13.5a1.5 1.5 0 1 0 0-.01M11.5 13.5a1.5 1.5 0 1 0 0-.01M5.5 12 12 2M10.5 12 4 2'),
  copy: SVG('M5 5h8v9H5zM3 11V2h7'),
  painter: SVG('M3 2h9v4H3zM12 4h2v4H8v2M7 10h2v5H7z'),
  bullets: SVG('M2.5 4h.01M2.5 8h.01M2.5 12h.01M6 4h8M6 8h8M6 12h8'),
  numbers: SVG('M2 3h1v3M2 6h2M2 10h2l-2 2.5h2M6 4h8M6 8h8M6 12h8'),
  multi: SVG('M2 4h.01M5 8h.01M8 12h.01M5 4h9M8 8h6M11 12h3'),
  outdent: SVG('M7 4h7M7 8h7M7 12h7M2 4h3M4.5 6 2.5 8l2 2M2 12h3'),
  indent: SVG('M7 4h7M7 8h7M7 12h7M2 4h3M2.5 6l2 2-2 2M2 12h3'),
  sort: SVG('M4 2v12M2 12l2 2 2-2M9 2h4l-4 5h4M9 10h4M11 9v5'),
  left: SVG('M2 3h12M2 6h8M2 9h12M2 12h8'),
  center: SVG('M2 3h12M4 6h8M2 9h12M4 12h8'),
  right: SVG('M2 3h12M6 6h8M2 9h12M6 12h8'),
  justify: SVG('M2 3h12M2 6h12M2 9h12M2 12h12'),
  spacing: SVG('M7 3h7M7 8h7M7 13h7M3 2v12M1.5 4 3 2l1.5 2M1.5 12 3 14l1.5-2'),
  shade: SVG('M3 9l5-6 5 6-5 5zM13 11c0 1.5 1.5 1.5 1.5 0L13.7 9.5z'),
  border: SVG('M2 2h12v12H2zM2 8h12M8 2v12'),
  eraser: SVG('M9 3l4 4-6 6H4l-2-2zM6 6l4 4M7 13h7'),
  grow: SVG('M2 13 5.5 3 9 13M3.3 9.5h4.4M11 6l2-2 2 2'),
  shrink: SVG('M2 13 5.5 3 9 13M3.3 9.5h4.4M11 4l2 2 2-2'),
};

/** Tombol toolbar: tidak mencuri seleksi teks (preventDefault saat mousedown). */
const Btn: React.FC<{ title: string; on?: boolean; disabled?: boolean; onClick: () => void; onDoubleClick?: () => void; children: React.ReactNode; wide?: boolean }> = ({ title, on, disabled, onClick, onDoubleClick, children, wide }) => (
  <button type="button" className={`rte-btn${on ? ' on' : ''}${wide ? ' wide' : ''}`} title={title} aria-label={title} aria-pressed={on} disabled={disabled}
    onMouseDown={e => e.preventDefault()} onClick={onClick} onDoubleClick={onDoubleClick}>{children}</button>
);

/** Tombol dengan menu turun (palet warna, daftar pilihan). */
const Drop: React.FC<{ title: string; label: React.ReactNode; children: (close: () => void) => React.ReactNode }> = ({ title, label, children }) => {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);
  return (
    <div className="rte-drop" ref={box}>
      <button type="button" className="rte-btn" title={title} aria-label={title} aria-expanded={open} onMouseDown={e => e.preventDefault()} onClick={() => setOpen(o => !o)}>{label}<span className="rte-caret">▾</span></button>
      {open && <div className="rte-menu" onMouseDown={e => { if (!(e.target as HTMLElement).closest('input, select')) e.preventDefault(); }}>{children(() => setOpen(false))}</div>}
    </div>
  );
};

const Palette: React.FC<{ colors: string[]; onPick: (c: string) => void; none?: string; custom?: boolean }> = ({ colors, onPick, none, custom }) => (
  <div className="rte-palette">
    {none && <button type="button" className="rte-none" onClick={() => onPick('')}>{none}</button>}
    <div className="rte-swatches">{colors.map(c => <button type="button" key={c} title={c} style={{ background: c }} onClick={() => onPick(c)} />)}</div>
    {custom && <label className="rte-custom xs">Warna lain <input type="color" onChange={e => onPick(e.target.value)} /></label>}
  </div>
);

interface Painter { bold: boolean; italic: boolean; underline: boolean; strike: boolean; sub: boolean; sup: boolean; color: string; font: string; size: string; back: string }

export const RichEditor: React.FC<{ label: string; value: string; onChange: (v: string) => void; minHeight?: number }> = ({ label, value, onChange, minHeight = 180 }) => {
  const ed = useRef<HTMLDivElement>(null);
  const range = useRef<Range | null>(null);
  const emitted = useRef<string | null>(null);
  const [st, setSt] = useState({ bold: false, italic: false, underline: false, strike: false, sub: false, sup: false, ul: false, ol: false, align: 'left', font: '', size: '', sel: false });
  const [marks, setMarks] = useState(false);
  const [painter, setPainter] = useState<Painter | null>(null);
  const sticky = useRef(false); // klik dua kali Format Painter = tetap aktif sampai diklik lagi / Esc
  const [sortDesc, setSortDesc] = useState(false);
  const [panel, setPanel] = useState<'' | 'link' | 'find'>('');
  const [link, setLink] = useState({ text: '', href: '' });
  const linkEl = useRef<HTMLAnchorElement | null>(null);
  const [fr, setFr] = useState({ find: '', rep: '', caseOn: false });
  const [frInfo, setFrInfo] = useState('');
  const [pad, setPad] = useState({ t: 8, r: 12, b: 8, l: 12 });

  // isi editor hanya diganti bila nilai berubah dari luar (bukan dari ketikan sendiri)
  useEffect(() => {
    if (!ed.current || value === emitted.current) return;
    ed.current.innerHTML = isRichHtml(value) ? sanitizeHtml(value) : legacyToHtml(value);
    emitted.current = value;
  }, [value]);

  const emit = () => {
    if (!ed.current) return;
    const html = sanitizeHtml(ed.current.innerHTML);
    emitted.current = html;
    onChange(html);
  };

  const inside = (n: Node | null) => !!n && !!ed.current && ed.current.contains(n);
  const refresh = () => {
    const s = window.getSelection();
    if (!s || !s.rangeCount || !inside(s.anchorNode)) return;
    range.current = s.getRangeAt(0).cloneRange();
    const q = (c: string) => { try { return document.queryCommandState(c); } catch { return false; } };
    const el = (s.anchorNode?.nodeType === 1 ? s.anchorNode : s.anchorNode?.parentElement) as HTMLElement | null;
    const cs = el ? getComputedStyle(el) : null;
    setSt({
      bold: q('bold'), italic: q('italic'), underline: q('underline'), strike: q('strikeThrough'), sub: q('subscript'), sup: q('superscript'),
      ul: q('insertUnorderedList'), ol: q('insertOrderedList'),
      align: q('justifyCenter') ? 'center' : q('justifyRight') ? 'right' : q('justifyFull') ? 'justify' : 'left',
      font: (cs?.fontFamily || '').split(',')[0].replace(/["']/g, '').trim(),
      size: cs ? String(Math.round(parseFloat(cs.fontSize) * 0.75 * 2) / 2) : '', // px → pt
      sel: !s.isCollapsed,
    });
  };
  useEffect(() => {
    document.addEventListener('selectionchange', refresh);
    return () => document.removeEventListener('selectionchange', refresh);
  });

  /** Kembalikan seleksi terakhir (setelah klik dropdown / select yang mengambil fokus). */
  const restore = () => {
    const e = ed.current;
    if (!e) return;
    e.focus();
    const s = window.getSelection();
    // fokus ulang memindah kursor ke awal: selalu pakai posisi terakhir yang tersimpan
    if (range.current && s && inside(range.current.startContainer)) { s.removeAllRanges(); s.addRange(range.current); }
  };
  const run = (cmd: string, val?: string) => {
    restore();
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand(cmd, false, val);
    emit(); refresh();
  };

  /** Bungkus seleksi dengan <span> bergaya / ber-class (trik fontName agar rapi di banyak node). */
  const wrap = (style: Partial<CSSStyleDeclaration>, cls?: string) => {
    restore();
    const s = window.getSelection();
    if (!s || s.isCollapsed) { toast('Pilih (blok) teksnya dulu'); return; }
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand('fontName', false, MARK);
    ed.current!.querySelectorAll<HTMLElement>(`font[face="${MARK}"], [style*="${MARK}"]`).forEach(n => {
      let span = n;
      if (n.tagName === 'FONT') { span = document.createElement('span'); while (n.firstChild) span.appendChild(n.firstChild); n.replaceWith(span); }
      else n.style.removeProperty('font-family');
      Object.assign(span.style, style);
      if (cls) span.classList.add(cls);
    });
    emit(); refresh();
  };

  /** Paragraf (p / li / judul) yang tersentuh seleksi. */
  const blocks = (): HTMLElement[] => {
    restore();
    const e = ed.current!, r = range.current;
    if (!e.firstElementChild || [...e.childNodes].some(n => n.nodeType === 3 && n.textContent?.trim())) document.execCommand('formatBlock', false, 'p');
    const all = [...e.querySelectorAll<HTMLElement>('p, div, li, h2, h3, h4, blockquote')].filter(b => !b.querySelector('p, div, li, h2, h3, h4, blockquote'));
    const hit = r ? all.filter(b => r.intersectsNode(b)) : [];
    return hit.length ? hit : all.slice(0, 1);
  };
  const setBlock = (fn: (b: HTMLElement) => void) => { blocks().forEach(fn); emit(); };

  // ---------- Clipboard ----------
  // semua tempelan dari luar hanya membawa teks polos (tanpa format / warna / ukuran)
  const insertPlain = (text: string) => { document.execCommand('insertText', false, text.replace(/\r\n?/g, '\n')); emit(); };
  const onPaste = (e: React.ClipboardEvent) => { e.preventDefault(); insertPlain(e.clipboardData.getData('text/plain')); };
  const paste = async () => {
    try { const t = await navigator.clipboard.readText(); restore(); insertPlain(t); }
    catch { toast('Browser menolak akses clipboard. Tekan Ctrl+V (⌘V di Mac).'); }
  };
  const startPainter = (keep = false) => {
    if (painter && !keep) { setPainter(null); sticky.current = false; return; }
    sticky.current = keep;
    restore();
    const q = (c: string) => { try { return document.queryCommandState(c); } catch { return false; } };
    const s = window.getSelection();
    const el = (s?.anchorNode?.nodeType === 1 ? s.anchorNode : s?.anchorNode?.parentElement) as HTMLElement | null;
    if (!el) return;
    const cs = getComputedStyle(el);
    let back = '';
    for (let n: HTMLElement | null = el; n && n !== ed.current; n = n.parentElement) if (n.style.backgroundColor) { back = n.style.backgroundColor; break; }
    setPainter({ bold: q('bold'), italic: q('italic'), underline: q('underline'), strike: q('strikeThrough'), sub: q('subscript'), sup: q('superscript'), color: cs.color, font: cs.fontFamily, size: cs.fontSize, back });
    toast(keep ? 'Format Painter aktif terus. Klik lagi atau tekan Esc untuk berhenti.' : 'Format disalin. Blok teks tujuan untuk menempelkan format.');
  };
  const applyPainter = () => {
    const s = window.getSelection();
    if (!painter || !s || s.isCollapsed) return;
    const p = painter;
    if (!sticky.current) setPainter(null);
    range.current = s.getRangeAt(0).cloneRange();
    run('removeFormat');
    const toggles: [boolean, string][] = [[p.bold, 'bold'], [p.italic, 'italic'], [p.underline, 'underline'], [p.strike, 'strikeThrough'], [p.sub, 'subscript'], [p.sup, 'superscript']];
    toggles.forEach(([on, c]) => on && run(c));
    wrap({ color: p.color, fontFamily: p.font, fontSize: p.size, ...(p.back ? { backgroundColor: p.back } : {}) });
  };

  // ---------- Font ----------
  const step = (d: number) => {
    const cur = Number(st.size) || 12;
    const next = d > 0 ? SIZES.find(x => x > cur) || Math.min(cur + 12, 96) : [...SIZES].reverse().find(x => x < cur) || 8;
    wrap({ fontSize: `${next}pt` });
  };
  const changeCase = (mode: string) => {
    restore();
    const s = window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) { toast('Pilih (blok) teksnya dulu'); return; }
    const r = s.getRangeAt(0);
    // potongan teks di dalam seleksi (bisa beda-beda format)
    const segs = texts().filter(t => r.intersectsNode(t)).map(t => ({
      t, a: t === r.startContainer ? r.startOffset : 0, b: t === r.endContainer ? r.endOffset : t.data.length,
    })).filter(x => x.b > x.a);
    const full = segs.map(x => x.t.data.slice(x.a, x.b)).join('');
    const out = mode === 'upper' ? full.toUpperCase() : mode === 'lower' ? full.toLowerCase()
      : mode === 'title' ? full.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase())
        : mode === 'toggle' ? [...full].map(c => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('')
          : full.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
    if (out.length !== full.length) { document.execCommand('insertText', false, out); emit(); return; } // huruf khusus (mis. ß)
    let pos = 0;
    const first = segs[0], last = segs[segs.length - 1];
    segs.forEach(x => { const len = x.b - x.a; x.t.data = x.t.data.slice(0, x.a) + out.slice(pos, pos + len) + x.t.data.slice(x.b); pos += len; });
    const nr = document.createRange();
    nr.setStart(first.t, first.a); nr.setEnd(last.t, last.b);
    s.removeAllRanges(); s.addRange(nr); range.current = nr.cloneRange();
    emit();
  };

  /** Warna huruf kembali ke warna tema (ikut mode terang / gelap). */
  const autoColor = () => {
    wrap({}, 'fx-auto');
    ed.current!.querySelectorAll<HTMLElement>('.fx-auto, .fx-auto *').forEach(n => {
      n.style.removeProperty('color');
      if (n.tagName === 'FONT') n.removeAttribute('color');
    });
    emit();
  };

  // ---------- Paragraf ----------
  const listStyle = (tag: 'ul' | 'ol', type: string) => {
    if (!(tag === 'ul' ? st.ul : st.ol)) run(tag === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
    setBlock(b => { const l = b.closest(tag); if (l && ed.current!.contains(l)) l.style.listStyleType = type; });
  };
  const multilevel = () => (st.ul || st.ol ? run('indent') : run('insertOrderedList'));
  const sort = () => {
    const bs = blocks();
    if (bs.length < 2) { toast('Blok beberapa paragraf / poin untuk diurutkan'); return; }
    const parent = bs[0].parentElement!;
    if (bs.some(b => b.parentElement !== parent)) { toast('Urutkan dalam satu daftar / bagian yang sama'); return; }
    const anchor = bs[bs.length - 1].nextSibling;
    const sorted = [...bs].sort((a, b) => (a.textContent || '').localeCompare(b.textContent || '', 'id', { numeric: true }) * (sortDesc ? -1 : 1));
    sorted.forEach(b => parent.insertBefore(b, anchor));
    setSortDesc(d => !d);
    emit();
    toast(sortDesc ? 'Diurutkan Z → A' : 'Diurutkan A → Z');
  };
  const border = (side: string) => setBlock(b => {
    (['Top', 'Right', 'Bottom', 'Left'] as const).forEach(k => b.style.setProperty(`border-${k.toLowerCase()}`, side === 'all' || side === k ? BORDER : ''));
    b.style.padding = side === 'none' ? '' : '4px 8px';
  });

  // ---------- Link tombol biru ----------
  const anchorAtSel = () => {
    const n = window.getSelection()?.anchorNode;
    const el = (n?.nodeType === 1 ? n : n?.parentElement) as HTMLElement | null;
    const a = el?.closest('a');
    return a && inside(a) ? (a as HTMLAnchorElement) : null;
  };
  const openLink = () => {
    restore();
    const a = anchorAtSel();
    linkEl.current = a;
    setLink(a ? { text: a.textContent || '', href: a.getAttribute('href') || '' } : { text: window.getSelection()?.toString() || '', href: '' });
    setPanel(p => (p === 'link' ? '' : 'link'));
  };
  const saveLink = () => {
    let href = link.href.trim();
    const text = link.text.trim() || 'Buka link';
    if (!href) { toast('Isi link tujuan'); return; }
    if (!/^(https?:|mailto:|tel:)/i.test(href)) href = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href) ? `mailto:${href}` : `https://${href.replace(/^\/+/, '')}`;
    const a = linkEl.current;
    if (a && inside(a)) { a.setAttribute('href', href); a.textContent = text; a.className = 'btn-link'; emit(); }
    else {
      restore();
      const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      document.execCommand('insertHTML', false, `<a class="btn-link" href="${esc(href)}">${esc(text)}</a>&nbsp;`);
      emit();
    }
    setPanel(''); linkEl.current = null;
  };
  const removeLink = () => {
    const a = linkEl.current;
    if (a && inside(a)) { a.replaceWith(document.createTextNode(a.textContent || '')); emit(); }
    setPanel(''); linkEl.current = null;
  };

  // ---------- Cari & Ganti (juga kata yang sebagian tebal / berwarna) ----------
  const texts = () => {
    const out: Text[] = [];
    const w = document.createTreeWalker(ed.current!, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n as Text);
    return out;
  };
  const rx = () => new RegExp(fr.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g' + (fr.caseOn ? '' : 'i'));
  type Hit = { s: Text; so: number; e: Text; eo: number };
  const hits = (): Hit[] => {
    const map: { t: Text; at: number }[] = [];
    let full = '', prev: Element | null | undefined;
    texts().forEach(t => {
      const blk = t.parentElement?.closest('p, div, li, h2, h3, h4, blockquote');
      if (full && blk !== prev) full += '\u0000'; // tidak mencocokkan melewati batas paragraf
      prev = blk;
      map.push({ t, at: full.length });
      full += t.data;
    });
    const loc = (pos: number, end: boolean) => map.find(x => pos >= x.at && (end ? pos <= x.at + x.t.data.length : pos < x.at + x.t.data.length));
    const out: Hit[] = [];
    const re = rx();
    for (let m = re.exec(full); m; m = re.exec(full)) {
      if (!m[0]) { re.lastIndex++; continue; }
      const a = loc(m.index, false), b = loc(m.index + m[0].length, true);
      if (a && b) out.push({ s: a.t, so: m.index - a.at, e: b.t, eo: m.index + m[0].length - b.at });
    }
    return out;
  };
  const toRange = (h: Hit) => { const r = document.createRange(); r.setStart(h.s, h.so); r.setEnd(h.e, h.eo); return r; };
  const findNext = () => {
    if (!fr.find) return;
    const r = range.current, list = hits();
    if (!list.length) { setFrInfo('Tidak ditemukan'); return; }
    const next = list.find(h => !r || r.comparePoint(h.s, h.so) > 0 || (r.collapsed && r.comparePoint(h.s, h.so) === 0)) || list[0];
    const nr = toRange(next), s = window.getSelection()!;
    ed.current!.focus(); s.removeAllRanges(); s.addRange(nr); range.current = nr.cloneRange();
    next.s.parentElement?.scrollIntoView({ block: 'nearest' });
    setFrInfo(`${list.indexOf(next) + 1} dari ${list.length}`);
  };
  const replaceOne = () => {
    restore();
    const sel = window.getSelection()?.toString() || '';
    if (sel && (fr.caseOn ? sel === fr.find : sel.toLowerCase() === fr.find.toLowerCase())) { document.execCommand('insertText', false, fr.rep); emit(); }
    findNext();
  };
  const replaceAll = () => {
    if (!fr.find) return;
    const list = hits();
    [...list].reverse().forEach(h => { const r = toRange(h); r.deleteContents(); r.insertNode(document.createTextNode(fr.rep)); });
    ed.current!.normalize();
    emit();
    setFrInfo(list.length ? `${list.length} teks diganti` : 'Tidak ditemukan');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && painter) { setPainter(null); sticky.current = false; return; }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'h')) { e.preventDefault(); setPanel('find'); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openLink(); return; }
    if (e.key === 'Tab') { e.preventDefault(); run(e.shiftKey ? 'outdent' : 'indent'); }
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      const k = e.key.toLowerCase();
      const map: Record<string, string> = { b: 'bold', i: 'italic', u: 'underline', e: 'justifyCenter', l: 'justifyLeft', r: 'justifyRight', j: 'justifyFull' };
      if (map[k] && !e.shiftKey) { e.preventDefault(); run(map[k]); }
      if (k === '=') { e.preventDefault(); run(e.shiftKey ? 'superscript' : 'subscript'); }
      if ((k === '>' || k === '.') && e.shiftKey) { e.preventDefault(); step(1); }
      if ((k === '<' || k === ',') && e.shiftKey) { e.preventDefault(); step(-1); }
    }
  };

  return (
    <div className="field">
      <span>{label}</span>
      <div className="rte">
        <div className="rte-bar" role="toolbar" aria-label="Format teks">
          <div className="rte-group">
            <div className="rte-row rte-clip">
              <Btn title="Tempel (Ctrl+V)" onClick={paste} wide>{G.paste}<span>Tempel</span></Btn>
              <div className="rte-col">
                <Btn title="Potong (Ctrl+X)" disabled={!st.sel} onClick={() => run('cut')}>{G.cut}<span>Potong</span></Btn>
                <Btn title="Salin (Ctrl+C)" disabled={!st.sel} onClick={() => run('copy')}>{G.copy}<span>Salin</span></Btn>
                <Btn title="Format Painter: klik = sekali pakai, klik dua kali = terus aktif" on={!!painter} onClick={() => startPainter()} onDoubleClick={() => startPainter(true)}>{G.painter}<span>Format Painter</span></Btn>
              </div>
            </div>
            <small className="rte-label">Clipboard</small>
          </div>

          <div className="rte-group">
            <div className="rte-row">
              <select className="rte-select rte-font" title="Jenis huruf" value={FONTS.includes(st.font) ? st.font : ''} onChange={e => e.target.value && run('fontName', e.target.value)}>
                <option value="">{st.font || 'Huruf'}</option>
                {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
              </select>
              <select className="rte-select rte-size" title="Ukuran huruf (pt)" value={SIZES.includes(Number(st.size)) ? st.size : ''} onChange={e => e.target.value && wrap({ fontSize: `${e.target.value}pt` })}>
                <option value="">{st.size || '—'}</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Btn title="Perbesar huruf (Ctrl+Shift+>)" onClick={() => step(1)}>{G.grow}</Btn>
              <Btn title="Perkecil huruf (Ctrl+Shift+<)" onClick={() => step(-1)}>{G.shrink}</Btn>
              <Drop title="Ubah huruf besar/kecil" label={<b className="rte-t">Aa</b>}>{close => (
                <div className="rte-list">
                  {[['sentence', 'Huruf awal kalimat.'], ['lower', 'huruf kecil'], ['upper', 'HURUF BESAR'], ['title', 'Huruf Awal Kata'], ['toggle', 'bALIK hURUF']].map(([m, l]) => (
                    <button type="button" key={m} onClick={() => { close(); changeCase(m); }}>{l}</button>
                  ))}
                </div>
              )}</Drop>
              <Btn title="Hapus semua format" onClick={() => run('removeFormat')}>{G.eraser}</Btn>
            </div>
            <div className="rte-row">
              <Btn title="Tebal (Ctrl+B)" on={st.bold} onClick={() => run('bold')}><b className="rte-t">B</b></Btn>
              <Btn title="Miring (Ctrl+I)" on={st.italic} onClick={() => run('italic')}><i className="rte-t" style={{ fontFamily: 'Georgia, serif' }}>I</i></Btn>
              <Btn title="Garis bawah (Ctrl+U)" on={st.underline} onClick={() => run('underline')}><u className="rte-t">U</u></Btn>
              <Btn title="Coret" on={st.strike} onClick={() => run('strikeThrough')}><s className="rte-t">abc</s></Btn>
              <Btn title="Subskrip (Ctrl+=)" on={st.sub} onClick={() => run('subscript')}><span className="rte-t">x<sub>2</sub></span></Btn>
              <Btn title="Superskrip (Ctrl+Shift+=)" on={st.sup} onClick={() => run('superscript')}><span className="rte-t">x<sup>2</sup></span></Btn>
              <Drop title="Efek teks" label={<b className="rte-t fx-outline" style={{ color: '#1971c2' }}>A</b>}>{close => (
                <div className="rte-list">
                  {[['fx-shadow', 'Bayangan'], ['fx-glow', 'Cahaya'], ['fx-outline', 'Garis tepi'], ['fx-gold', 'Emas (tema situs)']].map(([c, l]) => (
                    <button type="button" key={c} onClick={() => { close(); wrap({}, c); }}><span className={c}>{l}</span></button>
                  ))}
                </div>
              )}</Drop>
              <Drop title="Warna sorot teks (stabilo)" label={<span className="rte-t rte-under" style={{ borderColor: '#fff200' }}>ab</span>}>{close => (
                <Palette colors={MARKS} none="Tanpa warna" onPick={c => { close(); run('hiliteColor', c || 'transparent'); }} />
              )}</Drop>
              <Drop title="Warna huruf" label={<span className="rte-t rte-under" style={{ borderColor: '#c00000' }}>A</span>}>{close => (
                <Palette colors={COLORS} none="Otomatis (warna teks tema)" custom onPick={c => { close(); if (c) run('foreColor', c); else autoColor(); }} />
              )}</Drop>
            </div>
            <small className="rte-label">Font</small>
          </div>

          <div className="rte-group">
            <div className="rte-row">
              <Btn title="Poin (bullet)" on={st.ul} onClick={() => run('insertUnorderedList')}>{G.bullets}</Btn>
              <Drop title="Gaya poin" label={null}>{close => (
                <div className="rte-list">{[['disc', '● Bulat'], ['circle', '○ Lingkaran'], ['square', '■ Kotak']].map(([t, l]) => <button type="button" key={t} onClick={() => { close(); listStyle('ul', t); }}>{l}</button>)}</div>
              )}</Drop>
              <Btn title="Penomoran" on={st.ol} onClick={() => run('insertOrderedList')}>{G.numbers}</Btn>
              <Drop title="Gaya nomor" label={null}>{close => (
                <div className="rte-list">{[['decimal', '1. 2. 3.'], ['lower-alpha', 'a. b. c.'], ['upper-alpha', 'A. B. C.'], ['lower-roman', 'i. ii. iii.'], ['upper-roman', 'I. II. III.']].map(([t, l]) => <button type="button" key={t} onClick={() => { close(); listStyle('ol', t); }}>{l}</button>)}</div>
              )}</Drop>
              <Btn title="Daftar bertingkat (Tab = turun level, Shift+Tab = naik)" onClick={multilevel}>{G.multi}</Btn>
              <Btn title="Kurangi indentasi (Shift+Tab)" onClick={() => run('outdent')}>{G.outdent}</Btn>
              <Btn title="Tambah indentasi (Tab)" onClick={() => run('indent')}>{G.indent}</Btn>
              <Btn title={`Urutkan ${sortDesc ? 'Z → A' : 'A → Z'}`} onClick={sort}>{G.sort}</Btn>
              <Btn title="Tampilkan tanda paragraf ¶" on={marks} onClick={() => setMarks(m => !m)}><b className="rte-t">¶</b></Btn>
            </div>
            <div className="rte-row">
              <Btn title="Rata kiri (Ctrl+L)" on={st.align === 'left'} onClick={() => run('justifyLeft')}>{G.left}</Btn>
              <Btn title="Rata tengah (Ctrl+E)" on={st.align === 'center'} onClick={() => run('justifyCenter')}>{G.center}</Btn>
              <Btn title="Rata kanan (Ctrl+R)" on={st.align === 'right'} onClick={() => run('justifyRight')}>{G.right}</Btn>
              <Btn title="Rata kiri-kanan (Ctrl+J)" on={st.align === 'justify'} onClick={() => run('justifyFull')}>{G.justify}</Btn>
              <Drop title="Spasi baris" label={G.spacing}>{close => (
                <div className="rte-list">{LINE.map(l => <button type="button" key={l} onClick={() => { close(); setBlock(b => { b.style.lineHeight = l; }); }}>{l.replace('.', ',')}</button>)}</div>
              )}</Drop>
              <Drop title="Warna latar paragraf (shading)" label={G.shade}>{close => (
                <Palette colors={SHADES} none="Tanpa warna" custom onPick={c => { close(); setBlock(b => { b.style.backgroundColor = c; b.style.padding = c ? '4px 8px' : b.style.borderTop || b.style.borderBottom ? b.style.padding : ''; }); }} />
              )}</Drop>
              <Drop title="Garis tepi paragraf" label={G.border}>{close => (
                <div className="rte-list">{[['Bottom', 'Garis bawah'], ['Top', 'Garis atas'], ['Left', 'Garis kiri'], ['Right', 'Garis kanan'], ['all', 'Semua sisi (kotak)'], ['none', 'Tanpa garis']].map(([k, l]) => <button type="button" key={k} onClick={() => { close(); border(k); }}>{l}</button>)}</div>
              )}</Drop>
              <Drop title="Padding paragraf (jarak isi ke tepi)" label={<span className="rte-t" style={{ fontSize: 11 }}>Padding</span>}>{close => (
                <div className="rte-list">
                  {[0, 4, 8, 12, 16, 24].map(p => <button type="button" key={p} onClick={() => { close(); setBlock(b => { b.style.padding = p ? `${p}px` : ''; }); }}>{p ? `${p} px semua sisi` : 'Tanpa padding'}</button>)}
                  <div className="rte-pad">
                    {([['t', 'Atas'], ['r', 'Kanan'], ['b', 'Bawah'], ['l', 'Kiri']] as const).map(([k, l]) => (
                      <label key={k}>{l}<input type="number" min={0} max={80} value={pad[k]} onChange={e => setPad({ ...pad, [k]: Math.max(0, Math.min(80, Number(e.target.value) || 0)) })} /></label>
                    ))}
                  </div>
                  <button type="button" onClick={() => { close(); setBlock(b => { b.style.padding = `${pad.t}px ${pad.r}px ${pad.b}px ${pad.l}px`; }); }}>Terapkan padding sendiri</button>
                </div>
              )}</Drop>
            </div>
            <small className="rte-label">Paragraf</small>
          </div>

          <div className="rte-group">
            <div className="rte-row">
              <Btn title="Sisipkan link sebagai tombol biru (Ctrl+K)" on={panel === 'link'} onClick={openLink} wide><span className="rte-t" style={{ color: '#1971c2' }}>🔗</span><span>Link</span></Btn>
              <Btn title="Cari & Ganti (Ctrl+F / Ctrl+H)" on={panel === 'find'} onClick={() => setPanel(p => (p === 'find' ? '' : 'find'))} wide><span className="rte-t">🔍</span><span>Cari & Ganti</span></Btn>
            </div>
            <small className="rte-label">Sisip & Edit</small>
          </div>
        </div>

        {panel === 'link' && (
          <div className="rte-panel">
            <label className="grow">Teks yang tampil di artikel<input type="text" autoFocus value={link.text} placeholder="mis. Lihat demo program" onChange={e => setLink({ ...link, text: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveLink(); } }} /></label>
            <label className="grow">Menuju link<input type="url" value={link.href} placeholder="https://…" onChange={e => setLink({ ...link, href: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveLink(); } }} /></label>
            <button type="button" className="pill sm" onClick={saveLink}>{linkEl.current ? 'Simpan link' : 'Sisipkan'}</button>
            {linkEl.current && <button type="button" className="pill sm ghost" onClick={removeLink}>Hapus link</button>}
            <button type="button" className="pill sm ghost" onClick={() => setPanel('')}>Batal</button>
          </div>
        )}
        {panel === 'find' && (
          <div className="rte-panel">
            <label className="grow">Cari<input type="text" autoFocus value={fr.find} onChange={e => { setFr({ ...fr, find: e.target.value }); setFrInfo(''); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); findNext(); } }} /></label>
            <label className="grow">Ganti dengan<input type="text" value={fr.rep} onChange={e => setFr({ ...fr, rep: e.target.value })} /></label>
            <label className="row-inline"><input type="checkbox" checked={fr.caseOn} onChange={e => setFr({ ...fr, caseOn: e.target.checked })} />Huruf besar/kecil sama</label>
            <button type="button" className="pill sm" onClick={findNext}>Cari berikutnya</button>
            <button type="button" className="pill sm" onClick={replaceOne}>Ganti</button>
            <button type="button" className="pill sm" onClick={replaceAll}>Ganti semua</button>
            {frInfo && <small className="xs muted">{frInfo}</small>}
          </div>
        )}

        <div ref={ed} className={`rte-page mag-rich${marks ? ' show-marks' : ''}${painter ? ' painting' : ''}`} style={{ minHeight }}
          contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label={label}
          onInput={emit} onBlur={emit} onPaste={onPaste} onKeyDown={onKey} onMouseUp={applyPainter} onKeyUp={refresh} />
      </div>
      <small className="xs faint">Pintasan seperti Word: Ctrl+B / I / U, Ctrl+E / L / R / J, Tab untuk poin bertingkat. Ctrl+K = link, Ctrl+F = cari. Tempelan dari luar selalu jadi teks polos; pemenggalan kata otomatis.</small>
    </div>
  );
};
