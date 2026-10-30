// src/pages/SkillsPage.tsx — /keahlian : hard & soft skill dengan level, plus tools.
import React, { useState } from 'react';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { PageHero, Reveal, useTitle } from '../components/ui';
import { pick } from '../content/derive';

const SkillsPage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  useTitle(`${t('Keahlian', 'Skills')} — ${content.profile.name}`);
  const [f, setF] = useState<'all' | 'hard' | 'soft'>('all');
  const skills = [...content.skills].sort((a, b) => b.level - a.level);
  const list = f === 'all' ? skills : skills.filter(s => s.category === f);
  const avg = (c: 'hard' | 'soft') => { const x = skills.filter(s => s.category === c); return x.length ? Math.round(x.reduce((a, s) => a + s.level, 0) / x.length) : 0; };
  const groups = Array.from(new Set(content.tools.map(tl => tl.group || t('Lainnya', 'Other'))));

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Keahlian', 'Skills')} title={t('Keahlian & tools', 'Skills & tools')}
          lead={t('Kemampuan teknis dan interpersonal yang saya bangun dari pengalaman lintas divisi.', 'Technical and interpersonal abilities built through cross-division experience.')}
          aside={<div className="row gap-24">
            <div><div className="num-xl">{skills.filter(s => s.category === 'hard').length}</div><div className="xs muted">Hard skill · {avg('hard')}%</div></div>
            <div><div className="num-xl">{skills.filter(s => s.category === 'soft').length}</div><div className="xs muted">Soft skill · {avg('soft')}%</div></div>
            <div><div className="num-xl">{content.tools.length}</div><div className="xs muted">Tools</div></div>
          </div>} />

        <div className="seg mb-24">
          {(['all', 'hard', 'soft'] as const).map(k => <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{k === 'all' ? t('Semua', 'All') : k === 'hard' ? 'Hard skill' : 'Soft skill'}</button>)}
        </div>

        <div className="grid-3">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={(i % 6) * 40} className={`card ${i === 0 && f !== 'soft' ? 'dark' : ''}`}>
              <div className="row between gap-8">
                <span className="chip" style={i === 0 && f !== 'soft' ? undefined : undefined}>{s.category === 'hard' ? 'Hard' : 'Soft'}</span>
                <span className="num-lg" style={{ fontSize: '1.7rem' }}>{s.level}<span style={{ fontSize: '0.9rem' }}>%</span></span>
              </div>
              <h2 className="h-card mt-16">{pick(s.name, lang)}</h2>
              <p className="small muted mt-8" style={{ minHeight: '3em' }}>{pick(s.desc, lang)}</p>
              <div className={`meter mt-16 ${s.category === 'soft' ? 'yellow' : ''}`} style={i === 0 && f !== 'soft' ? { background: 'var(--ink-2)' } : undefined}>
                <span style={{ width: `${s.level}%`, ...(i === 0 && f !== 'soft' ? { background: 'var(--yellow)' } : {}) }} />
              </div>
            </Reveal>
          ))}
        </div>

        <h2 className="h-2 mt-40 mb-16">Tools & apps</h2>
        <div className="grid-4">
          {groups.map(g => (
            <div key={g} className="card">
              <span className="eyebrow">{g}</span>
              <div className="row wrap gap-8 mt-16">{content.tools.filter(tl => (tl.group || t('Lainnya', 'Other')) === g).map(tl => <span key={tl.id} className="chip">{tl.name}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SkillsPage;
