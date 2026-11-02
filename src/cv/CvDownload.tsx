// src/cv/CvDownload.tsx — tombol "Unduh CV" + dialog: pilih pengalaman kerja, lisensi & sertifikat (centang bebas), bagian CV,
// bahasa Indonesia / English (terjemahan otomatis bila isi Inggris di CMS kosong), pratinjau langsung, lalu unduh PDF.
// Isi CV dibaca dari konten live situs (CMS), jadi selalu mengikuti perubahan di /admin.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import type { Lang } from '../contexts/LanguageContext';
import { fmtPeriod, pick, sortExp } from '../content/derive';
import type { CertCategory } from '../content/types';
import { Icon } from '../components/ui';
import { saveFile } from '../utils/saveFile';
import {
  DEFAULT_EXP_COUNT, SEC_DEFAULT, SEC_LABEL, buildModel, certKey, defaultExpIds, defaultOnCert, expKey, isOn, missingTexts,
  type Choice, type SecKey,
} from './cvModel';
import { CvDocument, PAGE_W } from './CvDocument';
import { ensureFont, exportJpegs, exportPdf, printText } from './exportCv';
import { translateMissing, trCache } from './translate';

const LS_CHOICE = 'hk_cv_choice_v1';
const LS_OPTS = 'hk_cv_opts_v1';
const CERT_GROUPS: { key: CertCategory; id: string; en: string }[] = [
  { key: 'license', id: 'Lisensi', en: 'Licenses' }, { key: 'cert', id: 'Sertifikat', en: 'Certificates' }, { key: 'training', id: 'Pelatihan', en: 'Training' },
];

const readChoice = (): Choice => {
  try {
    const v = JSON.parse(localStorage.getItem(LS_CHOICE) || 'null');
    if (v && typeof v === 'object') return { on: v.on || {}, sec: { ...SEC_DEFAULT, ...(v.sec || {}) } };
  } catch { /* abaikan */ }
  return { on: {}, sec: { ...SEC_DEFAULT } };
};

const box: React.CSSProperties = { border: '1px solid var(--line, #d8d4c8)', borderRadius: 14, padding: 14, display: 'grid', gap: 8 };
const row: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 10, minHeight: 44, cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1.35 };
const mini: React.CSSProperties = { border: '1px solid var(--line, #d8d4c8)', background: 'none', borderRadius: 999, padding: '6px 12px', minHeight: 36, fontSize: '0.78rem', cursor: 'pointer' };

/** Isi halaman /cv: pilihan isi di kiri, pratinjau + tombol unduh di kanan. */
export const CvBuilder: React.FC = () => {
  const { content } = useContent();
  const { lang: siteLang, t } = useLang();
  const [lang, setLang] = useState<Lang>(siteLang);
  const [ch, setCh] = useState<Choice>(readChoice);
  const [photo, setPhoto] = useState('');
  const [fontTick, setFontTick] = useState(0);
  const [ver, setVer] = useState(0);
  const [retry, setRetry] = useState(0);
  const [tst, setTst] = useState<{ s: 'ok' | 'busy' | 'error'; msg: string }>({ s: 'ok', msg: '' });
  const [opts, setOpts] = useState<{ hc: boolean; hr: boolean }>(() => {
    try { return { hc: false, hr: false, ...JSON.parse(localStorage.getItem(LS_OPTS) || '{}') }; } catch { return { hc: false, hr: false }; }
  });
  type Kind = 'pdf' | 'pdfmin' | 'jpeg' | 'text';
  const [busy, setBusy] = useState<'' | Kind>('');
  const docRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ k: 0.5, h: 0 });

  useEffect(() => { try { localStorage.setItem(LS_CHOICE, JSON.stringify(ch)); } catch { /* abaikan */ } }, [ch]);
  useEffect(() => { try { localStorage.setItem(LS_OPTS, JSON.stringify(opts)); } catch { /* abaikan */ } }, [opts]);
  useEffect(() => { ensureFont().then(() => setFontTick((n) => n + 1)); }, []);

  // Foto diambil sekali sebagai data URL (aman untuk render PDF). Gagal (CORS/offline) = CV tanpa foto.
  useEffect(() => {
    let live = true;
    if (!content.profile.photoUrl) return;
    fetch(content.profile.photoUrl, { mode: 'cors' }).then((r) => r.blob()).then((b) => new Promise<string>((ok, no) => {
      const fr = new FileReader();
      fr.onload = () => ok(String(fr.result));
      fr.onerror = no;
      fr.readAsDataURL(b);
    })).then((d) => live && setPhoto(d)).catch(() => live && setPhoto(''));
    return () => { live = false; };
  }, [content.profile.photoUrl]);

  // Terjemahan otomatis: hanya teks yang Inggrisnya kosong di CMS, hanya untuk item yang dicentang
  const need = useMemo(() => (lang === 'en' ? missingTexts(content, ch) : []), [content, ch, lang]);
  useEffect(() => {
    if (!need.some((x) => !(x in trCache()))) { setTst({ s: 'ok', msg: '' }); return; }
    setTst({ s: 'busy', msg: '' });
    let live = true;
    const h = setTimeout(() => {
      translateMissing(need).then(() => { if (live) { setTst({ s: 'ok', msg: '' }); setVer((v) => v + 1); } })
        .catch((e) => { if (live) setTst({ s: 'error', msg: e?.message || 'layanan tidak merespons' }); });
    }, 500);
    return () => { live = false; clearTimeout(h); };
  }, [need, retry]);

  const model = useMemo(() => buildModel(content, ch, lang, trCache(), photo), [content, ch, lang, photo, ver]); // eslint-disable-line react-hooks/exhaustive-deps

  // Skala pratinjau mengikuti lebar kolom
  useLayoutEffect(() => {
    const w = wrapRef.current;
    const d = docRef.current;
    if (!w || !d) return;
    const f = () => { const k = Math.min(1, w.clientWidth / PAGE_W); setFit({ k, h: d.offsetHeight * k }); };
    f();
    const ro = new ResizeObserver(f);
    ro.observe(w);
    ro.observe(d);
    return () => ro.disconnect();
  }, []);

  const exps = useMemo(() => sortExp(content.experience), [content.experience]);
  const defExp = useMemo(() => defaultExpIds(content.experience), [content.experience]);
  const setOn = useCallback((key: string, v: boolean) => setCh((c) => ({ ...c, on: { ...c.on, [key]: v } })), []);
  const setMany = (pairs: [string, boolean][]) => setCh((c) => ({ ...c, on: { ...c.on, ...Object.fromEntries(pairs) } }));
  const pages = () => [...(docRef.current?.querySelectorAll<HTMLElement>('[data-page]') ?? [])];
  const fileName = `CV-${content.profile.name.split(',')[0].trim().replace(/[^\w-]+/g, '-')}-${lang.toUpperCase()}`;
  const blocked = tst.s === 'busy' || !!busy;

  const run = async (kind: Kind) => {
    setBusy(kind);
    try {
      if (kind === 'pdf') { saveFile(await exportPdf(pages(), opts.hr ? 'hd' : 'std'), `${fileName}${opts.hr ? '-HD' : ''}.pdf`); toast.success(t('CV berhasil diunduh.', 'CV downloaded.')); }
      else if (kind === 'pdfmin') { const b = await exportPdf(pages(), 'min'); saveFile(b, `${fileName}-mini.pdf`); toast.success(`${t('PDF resolusi tinggi (ukuran minimum) diunduh', 'High-resolution PDF (minimum size) downloaded')} (${Math.max(1, Math.round(b.size / 1024))} KB).`); }
      else if (kind === 'jpeg') {
        const imgs = await exportJpegs(pages());
        imgs.forEach((b, i) => saveFile(b, `${fileName}-HD${imgs.length > 1 ? `-hal${i + 1}` : ''}.jpg`));
        toast.success(t(`${imgs.length} gambar JPEG resolusi tinggi diunduh.`, `${imgs.length} high-resolution JPEG image(s) downloaded.`));
      }
      else { await printText(pages(), fileName); toast.success(t('Pilih "Simpan sebagai PDF" di jendela cetak.', 'Choose "Save as PDF" in the print window.')); }
    } catch (e: any) {
      toast.error(`${t('Gagal membuat CV', 'Could not create CV')}: ${e?.message || ''}`);
    } finally { setBusy(''); }
  };

  const nExp = exps.filter((e) => isOn(ch, expKey(e), defExp.has(e.id))).length;
  const nCert = content.certificates.filter((c) => isOn(ch, certKey(c), defaultOnCert(c))).length;

  return (
      <div style={{ display: 'grid', gap: 14, padding: '0 4px 8px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
            <div style={box} role="group" aria-label={t('Bahasa CV', 'CV language')}>
              <strong className="small">{t('Bahasa CV', 'CV language')}</strong>
              <div className="seg" role="radiogroup">
                {(['id', 'en'] as Lang[]).map((l) => (
                  <button key={l} type="button" role="radio" aria-checked={lang === l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l === 'id' ? 'Indonesia' : 'English'}</button>
                ))}
              </div>
              {lang === 'en' && tst.s === 'busy' && <span role="status" className="small">{t('Menerjemahkan…', 'Translating…')}</span>}
              {lang === 'en' && tst.s === 'error' && <span role="alert" className="small" style={{ color: '#b42318' }}>{t('Terjemahan gagal', 'Translation failed')}: {tst.msg} <button type="button" style={{ ...mini, minHeight: 0, padding: '2px 8px' }} onClick={() => setRetry((r) => r + 1)}>{t('Coba lagi', 'Retry')}</button></span>}
              {lang === 'en' && <span className="xs muted">{t('Teks yang belum punya versi Inggris di CMS diterjemahkan otomatis; periksa hasilnya.', 'Text without an English version in the CMS is auto-translated; please review the result.')}</span>}
            </div>

            <div style={box} role="group" aria-label={t('Pengalaman kerja', 'Work experience')}>
              <strong className="small">{t('Pengalaman kerja', 'Work experience')} ({nExp}/{exps.length})</strong>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button type="button" style={mini} onClick={() => setMany(exps.map((e) => [expKey(e), true]))}>{t('Semua', 'All')}</button>
                <button type="button" style={mini} onClick={() => setMany(exps.map((e) => [expKey(e), false]))}>{t('Kosongkan', 'None')}</button>
                <button type="button" style={mini} onClick={() => setMany(exps.map((e) => [expKey(e), defExp.has(e.id)]))}>{t(`Bawaan (${DEFAULT_EXP_COUNT} relevan terbaru)`, `Default (${DEFAULT_EXP_COUNT} latest relevant)`)}</button>
              </div>
              {exps.map((e) => (
                <label key={e.id} style={row}>
                  <input type="checkbox" style={{ width: 20, height: 20, marginTop: 2, flex: '0 0 20px' }} checked={isOn(ch, expKey(e), defExp.has(e.id))} onChange={(ev) => setOn(expKey(e), ev.target.checked)} />
                  <span><strong>{pick(e.position, lang)}</strong> · {e.company}<br /><span className="xs muted">{fmtPeriod(e.start, e.end, lang)}</span></span>
                </label>
              ))}
            </div>

            <div style={box} role="group" aria-label={t('Lisensi & sertifikat', 'Licenses & certificates')}>
              <strong className="small">{t('Lisensi & sertifikat', 'Licenses & certificates')} ({nCert}/{content.certificates.length})</strong>
              {CERT_GROUPS.map((g) => {
                const items = content.certificates.filter((c) => c.category === g.key);
                if (!items.length) return null;
                return (
                  <div key={g.key} style={{ display: 'grid', gap: 2 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="xs muted" style={{ fontWeight: 700 }}>{lang === 'en' ? g.en : g.id}</span>
                      <button type="button" style={mini} onClick={() => setMany(items.map((c) => [certKey(c), true]))}>{t('Semua', 'All')}</button>
                      <button type="button" style={mini} onClick={() => setMany(items.map((c) => [certKey(c), false]))}>{t('Kosongkan', 'None')}</button>
                    </div>
                    {items.map((c) => (
                      <label key={c.id} style={row}>
                        <input type="checkbox" style={{ width: 20, height: 20, marginTop: 2, flex: '0 0 20px' }} checked={isOn(ch, certKey(c), defaultOnCert(c))} onChange={(ev) => setOn(certKey(c), ev.target.checked)} />
                        <span>{pick(c.name, lang)}<br /><span className="xs muted">{[c.issuer, c.year].filter(Boolean).join(' · ')}</span></span>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>

            <div style={box} role="group" aria-label={t('Bagian CV', 'CV sections')}>
              <strong className="small">{t('Bagian CV', 'CV sections')}</strong>
              {(Object.keys(SEC_LABEL) as SecKey[]).map((k) => (
                <label key={k} style={row}>
                  <input type="checkbox" style={{ width: 20, height: 20, flex: '0 0 20px' }} checked={ch.sec[k]} onChange={(ev) => setCh((c) => ({ ...c, sec: { ...c.sec, [k]: ev.target.checked } }))} />
                  <span>{pick(SEC_LABEL[k], siteLang)}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10, minWidth: 0, position: 'sticky', top: 84 }}>
            <div style={box} role="group" aria-label={t('Ekspor', 'Export')}>
              <strong className="small">{t('Ekspor', 'Export')}</strong>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="pill dark" style={{ minHeight: 44 }} disabled={blocked} onClick={() => run('pdfmin')}><Icon name="download" size={16} />{busy === 'pdfmin' ? t('Menyiapkan…', 'Preparing…') : t('PDF resolusi tinggi, ukuran minimum (online)', 'High-resolution PDF, minimum size (online)')}</button>
                <button type="button" className="pill dark" style={{ minHeight: 44 }} disabled={blocked} onClick={() => run('jpeg')}><Icon name="download" size={16} />{busy === 'jpeg' ? t('Menyiapkan…', 'Preparing…') : t('JPEG resolusi tinggi', 'High-resolution JPEG')}</button>
                <button type="button" className="pill" style={{ minHeight: 44 }} disabled={blocked} onClick={() => run('pdf')}>{busy === 'pdf' ? t('Menyiapkan…', 'Preparing…') : t('PDF standar', 'Standard PDF')}</button>
                <button type="button" className="pill" style={{ minHeight: 44 }} disabled={blocked} onClick={() => run('text')}>{busy === 'text' ? t('Menyiapkan…', 'Preparing…') : t('PDF teks (ATS)', 'Text PDF (ATS)')}</button>
              </div>
              <span className="xs muted">{t('PDF minimum: tetap resolusi tinggi (±288 dpi, setara kualitas cetak 300 dpi) dengan kompresi lebih kuat, jadi file jauh lebih kecil untuk diunggah/dikirim online. JPEG: satu gambar per halaman, 3176 x 4492 px (±384 dpi). Bila CV lebih dari satu halaman, JPEG diunduh per halaman.', 'Minimum PDF: still high resolution (~288 dpi, print-grade 300 dpi) with stronger compression, so the file is much smaller for uploading/sending online. JPEG: one image per page, 3176 x 4492 px (~384 dpi). A multi-page CV downloads one JPEG per page.')}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="group" aria-label={t('Kualitas', 'Quality')}>
              <button type="button" aria-pressed={opts.hc} className={opts.hc ? 'pill dark' : 'pill'} style={{ minHeight: 44 }} onClick={() => setOpts((o) => ({ ...o, hc: !o.hc }))}>{opts.hc ? '✓ ' : ''}High Contrast</button>
              <button type="button" aria-pressed={opts.hr} className={opts.hr ? 'pill dark' : 'pill'} style={{ minHeight: 44 }} onClick={() => setOpts((o) => ({ ...o, hr: !o.hr }))}>{opts.hr ? '✓ ' : ''}High Resolution</button>
            </div>
            <span className="xs muted">{t('High Contrast: teks hitam murni, tanpa teks abu-abu/tipis, garis lebih tebal. High Resolution: PDF 4x (±384 dpi), ukuran file lebih besar.', 'High Contrast: pure black text, no grey/light text, thicker rules. High Resolution: 4x PDF (~384 dpi), larger file.')}</span>
            <span className="xs muted">{t('Unduh PDF = gambar persis pratinjau. PDF teks = lewat cetak browser, teks bisa dicari & dibaca sistem ATS.', 'Download PDF = exact image of the preview. Text PDF = via browser print, searchable and ATS-readable.')}</span>
            <div ref={wrapRef} style={{ width: '100%', overflow: 'hidden' }} aria-label={t('Pratinjau CV', 'CV preview')}>
              <div style={{ width: PAGE_W * fit.k, height: fit.h || undefined }}>
                <div style={{ width: PAGE_W, transform: `scale(${fit.k})`, transformOrigin: 'top left' }}>
                  <CvDocument ref={docRef} model={model} fontTick={fontTick} hc={opts.hc} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
