// src/components/ShareSheet.tsx — dialog "File siap" (iOS): tombol Share dipicu langsung oleh klik pengunjung.
import React, { useEffect, useState } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { SHARE_EVENT } from '../utils/saveFile';
import { Icon } from './ui';

const ShareSheet: React.FC = () => {
  const { t } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const onFile = (e: Event) => { setFile((e as CustomEvent<File>).detail); setError(''); };
    window.addEventListener(SHARE_EVENT, onFile);
    return () => window.removeEventListener(SHARE_EVENT, onFile);
  }, []);

  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFile(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [file]);

  if (!file) return null;

  // Dipanggil LANGSUNG dari klik: jangan ada await sebelum navigator.share
  const share = async () => {
    try {
      await navigator.share({ files: [file], title: file.name });
      setFile(null);
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // pengunjung menutup lembar share
      setError(err?.message || t('Gagal membagikan file.', 'Sharing failed.'));
    }
  };

  return (
    <div className="share-sheet" role="dialog" aria-modal="true" aria-label={t('Simpan atau bagikan file', 'Save or share file')} onClick={() => setFile(null)}>
      <div className="card share-box" onClick={e => e.stopPropagation()}>
        <h2 className="h-card">{t('File siap', 'File ready')}</h2>
        <p className="xs muted mt-8" style={{ wordBreak: 'break-all' }}>{file.name}</p>
        <p className="small mt-16">{t('Ketuk ', 'Tap ')}<strong>{t('Bagikan / Simpan', 'Share / Save')}</strong>{t(', lalu pilih ', ', then choose ')}<strong>{t('Simpan ke File', 'Save to Files')}</strong>.</p>
        {error && <p role="alert" className="xs mt-8" style={{ color: '#d14343' }}>{error}</p>}
        <button className="pill dark lg mt-16" style={{ width: '100%', justifyContent: 'center' }} onClick={share}><Icon name="download" size={16} />{t('Bagikan / Simpan', 'Share / Save')}</button>
        <button className="pill mt-8" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setFile(null)}>{t('Tutup', 'Close')}</button>
      </div>
    </div>
  );
};

export default ShareSheet;
