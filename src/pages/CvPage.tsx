// src/pages/CvPage.tsx: /cv, halaman Unduh CV: pilih isi CV, lihat pratinjau, lalu unduh PDF.
import React from 'react';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { PageHero, useTitle } from '../components/ui';
import { CvBuilder } from '../cv/CvDownload';

const CvPage: React.FC = () => {
  const { content } = useContent();
  const { t } = useLang();
  useTitle(`${t('Unduh CV', 'Download CV')} | ${content.profile.name}`);
  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Unduh CV', 'Download CV')} title={t('Unduh CV', 'Download CV')}
          lead={t('Pilih pengalaman kerja, lisensi & sertifikat yang dimasukkan. Isi CV otomatis mengikuti konten situs, pratinjau tampil langsung.', 'Choose which work experience, licenses & certificates to include. CV content follows the website automatically, with a live preview.')} />
        <CvBuilder />
      </div>
    </main>
  );
};

export default CvPage;
