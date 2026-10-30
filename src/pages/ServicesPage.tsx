// src/pages/ServicesPage.tsx — /layanan : layanan, cakupan kerja, dan alur kerja sama.
import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, Reveal, useTitle } from '../components/ui';
import { pick, waLink } from '../content/derive';

const ServicesPage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  useTitle(`${t('Layanan', 'Services')} — ${content.profile.name}`);
  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Layanan', 'Services')} title={t('Yang bisa saya bantu', 'How I can help')}
          lead={t('Dari pengelolaan SDM hingga dukungan IT — layanan yang lahir dari pengalaman langsung di lapangan.', 'From people management to IT support — services grounded in hands-on field experience.')}
          aside={<a className="pill dark lg" href={waLink(content, lang)} target="_blank" rel="noreferrer"><Icon name="chat" />{t('Konsultasi gratis', 'Free consultation')}</a>} />

        <div className="grid-2">
          {content.services.map((s, i) => (
            <Reveal key={s.id} delay={i * 60} className={`card ${i === 0 ? 'dark' : ''}`}>
              <div className="row between">
                <span className="icon-btn" style={{ width: 52, height: 52, flexBasis: 52, fontSize: '1.4rem' }}>{s.icon}</span>
                <span className="eyebrow" style={i === 0 ? { color: 'var(--on-ink-dim)' } : undefined}>{String(i + 1).padStart(2, '0')} · {pick(s.subtitle, lang)}</span>
              </div>
              <h2 className="h-2 mt-16">{pick(s.title, lang)}</h2>
              <p className="muted mt-8">{pick(s.desc, lang)}</p>
              <div className="row wrap gap-8 mt-16">{s.points.map((p, j) => <span key={j} className={`chip ${i === 0 && j === 0 ? 'yellow' : ''}`}>{pick(p, lang)}</span>)}</div>
            </Reveal>
          ))}
        </div>

        <h2 className="h-2 mt-40 mb-16">{t('Alur kerja sama', 'How we work')}</h2>
        <div className="grid-4">
          {content.process.map((p, i) => (
            <Reveal key={p.id} delay={i * 60} className="card">
              <div className="row between"><span className="num-lg">{String(i + 1).padStart(2, '0')}</span>{i < content.process.length - 1 && <Icon name="right" />}</div>
              <div className="h-card mt-16">{pick(p.title, lang)}</div>
              <p className="small muted mt-8">{pick(p.desc, lang)}</p>
            </Reveal>
          ))}
        </div>

        <div className="card mt-24 row wrap between gap-16">
          <div><div className="h-card">{t('Punya kebutuhan spesifik?', 'Have a specific need?')}</div><div className="small muted">{t('Ceritakan kebutuhanmu — saya balas secepatnya.', 'Tell me what you need — I reply quickly.')}</div></div>
          <div className="row gap-8"><Link to="/kontak" className="pill dark">{t('Kirim pesan', 'Send a message')}</Link><Link to="/portofolio" className="pill">{t('Lihat portofolio', 'See portfolio')}</Link></div>
        </div>
      </div>
    </main>
  );
};

export default ServicesPage;
