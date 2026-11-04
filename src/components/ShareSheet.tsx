// src/components/ShareSheet.tsx — dialog "File siap" (iOS): tombol Share dipicu langsung oleh klik pengunjung.
import React, { useEffect, useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { SHARE_EVENT } from '../utils/saveFile';
import { Icon } from './ui';

const ShareSheet: React.FC = () => {
  const { t } = useLang();
  // Beberapa file sekaligus (mis. JPEG CV per halaman) dikumpulkan lalu dibagikan dalam satu lembar Share
  const [files, setFiles] = useState<File[]>([]);
  const close = () => setFiles([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const onFile = (e: Event) => { const f = (e as CustomEvent<File>).detail; setFiles(fs => [...fs.filter(x => x.name !== f.name), f]); setError(''); };
    window.addEventListener(SHARE_EVENT, onFile);
    return () => window.removeEventListener(SHARE_EVENT, onFile);
  }, []);

  useEffect(() => {
    if (!files.length) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFiles([]); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [files.length]);

  if (!files.length) return null;
  const images = files.every(f => f.type.startsWith('image/'));

  // Dipanggil LANGSUNG dari klik: jangan ada await sebelum navigator.share
  const share = async () => {
    try {
      const all = navigator.canShare?.({ files }) ? files : files.slice(-1);
      await navigator.share({ files: all, title: all[0].name });
      close();
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // pengunjung menutup lembar share
      setError(err?.message || t('Gagal membagikan file.', 'Sharing failed.'));
    }
  };

  return (
    <div className="share-sheet" role="dialog" aria-modal="true" aria-label={t('Simpan atau bagikan file', 'Save or share file')} onClick={close}>
      <div className="card share-box" onClick={e => e.stopPropagation()}>
        <h2 className="h-card">{t('File siap', 'File ready')}</h2>
        {files.map(f => <p key={f.name} className="xs muted mt-8" style={{ wordBreak: 'break-all' }}>{f.name}</p>)}
        <p className="small mt-16">{t('Ketuk ', 'Tap ')}<strong>{t('Bagikan / Simpan', 'Share / Save')}</strong>{t(', lalu pilih ', ', then choose ')}<strong>{images ? t('Simpan Gambar', 'Save Image') : t('Simpan ke File', 'Save to Files')}</strong>{images ? t(' atau ', ' or ') : ''}{images && <strong>{t('Simpan ke File', 'Save to Files')}</strong>}.</p>
        {error && <p role="alert" className="xs mt-8" style={{ color: '#d14343' }}>{error}</p>}
        <button className="pill dark lg mt-16" style={{ width: '100%', justifyContent: 'center' }} onClick={share}><Icon name="download" size={16} />{t('Bagikan / Simpan', 'Share / Save')}</button>
        <button className="pill mt-8" style={{ width: '100%', justifyContent: 'center' }} onClick={close}>{t('Tutup', 'Close')}</button>
      </div>
    </div>
  );
};

export default ShareSheet;
