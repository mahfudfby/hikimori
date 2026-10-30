// src/pages/ExperiencePage.tsx — /pengalaman : timeline lengkap, filter kategori, statistik.
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, Reveal, useTitle, useHashTarget, Logo, Staged } from '../components/ui';
import { pick, monthsOf, fmtDuration, fmtPeriod, careerMonths, categoryShare, CATEGORY_LABEL, sortExp, lines, careerGaps, calendarSpanMonths, fmtYM } from '../content/derive';
import type { Experience, ExpCategory } from '../content/types';

const ExpCard: React.FC<{ e: Experience; max: number; on: boolean }> = ({ e, max, on }) => {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(on);
  const m = monthsOf(e.start, e.end);
  const desc = lines(pick(e.desc, lang));
  const shown = open ? desc : desc.slice(0, 3);
  return (
    <div id={e.id} className={`tl-item ${on ? 'on' : ''}`}>
      <div className="card" style={on ? { boxShadow: '0 0 0 3px var(--yellow), var(--shadow-lg)' } : undefined}>
        <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
          <Logo src={e.logoUrl} alt={e.company} />
          <div className="grow">
            <div className="row between wrap gap-8">
              <h2 className="h-card">{pick(e.position, lang)}</h2>
              <span className="pill sm dark">{fmtDuration(m, lang, true)}</span>
            </div>
            <div className="small" style={{ fontWeight: 500 }}>{e.company}{pick(e.industry, lang) ? <span className="muted"> · {pick(e.industry, lang)}</span> : null}</div>
            <div className="row wrap gap-8 xs muted mt-8">
              <span className="row gap-4"><Icon name="alarm" size={13} />{fmtPeriod(e.start, e.end, lang)}</span>
              {e.type && <span className="chip" style={{ padding: '2px 9px' }}>{e.type}</span>}
              {e.location && <span className="row gap-4"><Icon name="map" size={13} />{e.location}</span>}
              <span className="chip" style={{ padding: '2px 9px' }}>{pick(CATEGORY_LABEL[e.category], lang)}</span>
            </div>
          </div>
        </div>
        <div className="meter yellow mt-16" title={fmtDuration(m, lang)}><span style={{ width: `${Math.max(4, (m / max) * 100)}%` }} /></div>
        {shown.length > 0 && (
          <ul className="bullets mt-16">{shown.map((d, i) => <li key={i}>{d.text}</li>)}</ul>
        )}
        {desc.length > 3 && (
          <button className="pill sm mt-8" onClick={() => setOpen(o => !o)}>
            {open ? t('Ringkas', 'Show less') : t(`+${desc.length - 3} tugas lainnya`, `+${desc.length - 3} more duties`)}
            <Icon name={open ? 'up' : 'down'} size={13} />
          </button>
        )}
        {e.tags.length > 0 && <div className="row wrap gap-8 mt-16">{e.tags.map(tg => <span key={tg} className="chip">{tg}</span>)}</div>}
      </div>
    </div>
  );
};

const ExperiencePage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  useTitle(`${t('Pengalaman', 'Experience')} — ${content.profile.name}`);
  const [params, setParams] = useSearchParams();
  const k = (params.get('k') || 'all') as ExpCategory | 'all';
  const hash = useHashTarget();
  const all = useMemo(() => sortExp(content.experience), [content.experience]);
  const list = k === 'all' ? all : all.filter(e => e.category === k);
  const max = Math.max(1, ...all.map(e => monthsOf(e.start, e.end)));
  const share = categoryShare(all);
  const companies = new Set(all.map(e => e.company)).size;

  // Kelompokkan per tahun mulai untuk penanda di timeline
  let lastYear = '';

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Pengalaman', 'Experience')}
          title={<>{t('Perjalanan', 'Career')}<br />{t('karier', 'journey')}</>}
          lead={t('Seluruh riwayat kerja — dari instansi pemerintah, lapangan, hingga lintas divisi di industri manufaktur.', 'My complete work history — from government offices and frontline roles to cross-division work in manufacturing.')}
          aside={<div className="row gap-24">
            <div><div className="num-xl">{(careerMonths(all) / 12).toFixed(1)}</div><div className="xs muted">{t('tahun kerja efektif', 'effective years')}</div></div>
            <div><div className="num-xl">{all.length}</div><div className="xs muted">{t('posisi', 'positions')}</div></div>
            <div><div className="num-xl">{companies}</div><div className="xs muted">{t('tempat kerja', 'workplaces')}</div></div>
          </div>} />

        <div className="split-r">
          <div>
            <div className="seg mb-24" role="tablist">
              {(['all', 'hr', 'it', 'ops', 'other'] as const).map(key => (
                <button key={key} className={k === key ? 'on' : ''} role="tab" aria-selected={k === key}
                  onClick={() => setParams(key === 'all' ? {} : { k: key }, { replace: true })}>
                  {key === 'all' ? t('Semua', 'All') : pick(CATEGORY_LABEL[key], lang)}
                </button>
              ))}
            </div>
            {list.length === 0 ? <div className="empty">{t('Tidak ada data di kategori ini.', 'Nothing in this category.')}</div> : (
              <div className="timeline">
                {list.map(e => {
                  const y = (e.start || '').slice(0, 4);
                  const showYear = y !== lastYear; lastYear = y;
                  return (
                    <React.Fragment key={e.id}>
                      {showYear && <div className="eyebrow" style={{ margin: '18px 0 8px' }}>{y}</div>}
                      <Staged minHeight={220} eager={hash === e.id}><ExpCard e={e} max={max} on={hash === e.id} /></Staged>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="stack gap-12 sticky">
            <div className="card">
              <h2 className="h-sm">{t('Masa kerja efektif', 'Effective work time')}</h2>
              <div className="row gap-8 mt-8" style={{ alignItems: 'baseline' }}>
                <span className="num-lg">{fmtDuration(careerMonths(all), lang, true)}</span>
                <span className="xs muted">{careerMonths(all)} {t('bulan bekerja', 'months worked')}</span>
              </div>
              <div className="meter yellow mt-16" title={t('Bagian kuning = bekerja', 'Yellow = working')}>
                <span style={{ width: `${(careerMonths(all) / Math.max(1, calendarSpanMonths(all))) * 100}%` }} />
              </div>
              <div className="row between xs muted mt-8">
                <span>{t('Bekerja', 'Working')} {fmtDuration(careerMonths(all), lang, true)}</span>
                <span>{t('Rentang', 'Span')} {fmtDuration(calendarSpanMonths(all), lang, true)}</span>
              </div>
              {careerGaps(all).length > 0 && (
                <div className="mt-16">
                  <div className="xs faint mb-8">{t('Jeda tanpa pekerjaan (tidak dihitung):', 'Gaps without work (excluded):')}</div>
                  <div className="row wrap gap-8">
                    {careerGaps(all).map(g => (
                      <span key={g.start} className="chip" style={{ padding: '3px 10px' }}>
                        {g.start === g.end ? fmtYM(g.start, lang) : `${fmtYM(g.start, lang)} – ${fmtYM(g.end, lang)}`} · {fmtDuration(g.months, lang, true)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="xs faint mt-16">{t('Periode kerja yang tumpang-tindih (mis. part-time bersamaan) dihitung sekali.', 'Overlapping jobs (e.g. concurrent part-time) are counted once.')}</p>
            </div>
            <div className="card">
              <h2 className="h-sm mb-16">{t('Komposisi masa kerja', 'Time by field')}</h2>
              {share.map(s => (
                <div key={s.key} className="mb-16">
                  <div className="row between small"><span>{pick(CATEGORY_LABEL[s.key], lang)}</span><span className="muted">{s.pct}% · {fmtDuration(s.months, lang, true)}</span></div>
                  <div className={`meter mt-8 ${s.key === 'it' ? 'yellow' : ''}`}><span style={{ width: `${s.pct}%` }} /></div>
                </div>
              ))}
              <p className="xs faint">{t('Dihitung dari durasi tiap posisi; periode paralel dihitung terpisah.', 'Based on each position’s duration; parallel periods are counted separately.')}</p>
            </div>
            <Reveal className="card dark">
              <h2 className="h-sm">{t('Jabatan terlama', 'Longest roles')}</h2>
              <div className="task-list mt-16">
                {[...all].sort((a, b) => monthsOf(b.start, b.end) - monthsOf(a.start, a.end)).slice(0, 4).map(e => (
                  <a key={e.id} className="task" href={`#${e.id}`}>
                    <span className="ico"><Icon name="briefcase" /></span>
                    <span className="grow"><span className="t" style={{ display: 'block' }}>{pick(e.position, lang)}</span><span className="s">{e.company}</span></span>
                    <span className="chip yellow">{fmtDuration(monthsOf(e.start, e.end), lang, true)}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ExperiencePage;
