// src/pages/CertificatesPage.tsx — /sertifikat : semua sertifikat, lisensi & pelatihan + preview gambar.
import React, { useState } from 'react';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, useTitle, useHashTarget, Modal, Staged, cld } from '../components/ui';
import { pick } from '../content/derive';
import type { Certificate, CertCategory } from '../content/types';

const CAT: Record<CertCategory, { id: string; en: string; icon: string }> = {
  license: { id: 'Lisensi', en: 'License', icon: '🪪' },
  training: { id: 'Pelatihan', en: 'Training', icon: '🎓' },
  cert: { id: 'Sertifikat', en: 'Certificate', icon: '📜' },
};

const CertificatesPage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  useTitle(`${t('Sertifikat', 'Certificates')} — ${content.profile.name}`);
  const hash = useHashTarget();
  const [f, setF] = useState<CertCategory | 'all'>('all');
  const [view, setView] = useState<Certificate | null>(null);
  const certs = content.certificates;
  const list = f === 'all' ? certs : certs.filter(c => c.category === f);
  const count = (c: CertCategory) => certs.filter(x => x.category === c).length;

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Sertifikat', 'Certificates')} title={t('Sertifikat & lisensi', 'Certificates & licenses')}
          lead={t('Kompetensi yang sudah diuji dan diakui — lisensi profesi BNSP, pelatihan berbasis SKKNI, dan sertifikasi lainnya.', 'Tested and recognized competencies — BNSP professional licenses, SKKNI-based training, and other certifications.')}
          aside={<div className="row gap-24">
            {(['license', 'training', 'cert'] as CertCategory[]).map(c => (
              <div key={c}><div className="num-xl">{count(c)}</div><div className="xs muted">{pick(CAT[c], lang)}</div></div>
            ))}
          </div>} />

        <div className="seg mb-24">
          {(['all', 'license', 'training', 'cert'] as const).map(k => (
            <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{k === 'all' ? t('Semua', 'All') : pick(CAT[k], lang)}</button>
          ))}
        </div>

        {list.length === 0 ? <div className="empty">{t('Belum ada data.', 'Nothing yet.')}</div> : (
          <div className="grid-3">
            {list.map(c => (
              <Staged key={c.id} minHeight={380} eager={hash === c.id}>
              <article key={c.id} id={c.id} className={`card ${c.category === 'license' ? 'dark' : ''} hoverable stack`}
                style={hash === c.id ? { boxShadow: '0 0 0 3px var(--yellow), var(--shadow-lg)' } : undefined}>
                <button onClick={() => setView(c)} style={{ border: 0, background: 'none', padding: 0, textAlign: 'left' }} aria-label={t('Lihat sertifikat', 'View certificate')}>
                  {c.imageUrl
                    ? <img className="thumb" src={cld(c.imageUrl, 640)} alt={pick(c.name, lang)} loading="lazy" decoding="async" />
                    : <div className="thumb row" style={{ justifyContent: 'center', fontSize: '2.6rem', background: c.category === 'license' ? 'var(--ink-2)' : 'var(--surface-strong)' }}>{CAT[c.category].icon}</div>}
                </button>
                <div className="row between gap-8 mt-16">
                  <span className={`chip ${c.category === 'license' ? 'yellow' : ''}`}>{pick(CAT[c.category], lang)}</span>
                  <span className="xs muted">{c.year}</span>
                </div>
                <h2 className="h-card mt-8">{pick(c.name, lang)}</h2>
                <div className="small muted mt-8">{c.issuer}</div>
                {c.code && <div className="xs faint">{t('Kode unit', 'Unit code')}: {c.code}</div>}
                {pick(c.desc, lang) && <p className="small muted mt-8">{pick(c.desc, lang)}</p>}
                <div className="row gap-8 mt-16" style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <button className="pill sm" onClick={() => setView(c)} style={c.category === 'license' ? { color: 'var(--on-ink)', borderColor: 'var(--ink-2)' } : undefined}><Icon name="eye" size={13} />{t('Lihat', 'View')}</button>
                  {c.credentialUrl && <a className="pill sm" href={c.credentialUrl} target="_blank" rel="noreferrer" style={c.category === 'license' ? { color: 'var(--on-ink)', borderColor: 'var(--ink-2)' } : undefined}><Icon name="external" size={13} />{t('Verifikasi', 'Verify')}</a>}
                </div>
              </article>
              </Staged>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!view} onClose={() => setView(null)} label={view ? pick(view.name, lang) : ''}>
        {view && (<>
          {view.imageUrl ? <img src={view.imageUrl} alt={pick(view.name, lang)} style={{ width: '100%', borderRadius: 16 }} />
            : <div className="empty">{t('Gambar sertifikat belum diunggah. Tambahkan lewat CMS.', 'No certificate image yet. Add one in the CMS.')}</div>}
          <h2 className="h-2 mt-16">{pick(view.name, lang)}</h2>
          <p className="muted">{view.issuer} · {view.year}{view.code ? ` · ${view.code}` : ''}</p>
        </>)}
      </Modal>
    </main>
  );
};

export default CertificatesPage;
