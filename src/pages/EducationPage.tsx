// src/pages/EducationPage.tsx — /pendidikan : cerita, detail studi, alur/sejarah, organisasi.
import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, Reveal, useTitle, Logo, Bullets } from '../components/ui';
import { pick, paragraphs, fmtYM } from '../content/derive';

const EducationPage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  useTitle(`${t('Pendidikan', 'Education')} — ${content.profile.name}`);
  const ed = content.education;
  const main = ed.items[0];
  const period = (s: string, e: string) => [s && (fmtYM(s, lang) || s), e && (fmtYM(e, lang) || e)].filter(Boolean).join(' – ');

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Pendidikan', 'Education')} title={t('Pendidikan & pembelajaran', 'Education & learning')} lead={pick(ed.intro, lang)}
          aside={main && <div className="row gap-24">
            {main.gpa && <div><div className="num-xl">{main.gpa}</div><div className="xs muted">IPK / GPA</div></div>}
            <div><div className="num-xl">{content.certificates.length}</div><div className="xs muted">{t('pelatihan & lisensi', 'trainings & licenses')}</div></div>
          </div>} />

        <div className="split">
          <div className="stack gap-12 sticky">
            {ed.items.map(it => {
              const gpa = parseFloat(it.gpa);
              return (
                <div key={it.id} className="card dark">
                  <div className="row gap-12">
                    <Logo src={it.logoUrl} alt={it.school} fallback="🎓" />
                    <div className="grow"><div className="eyebrow" style={{ color: 'var(--on-ink-dim)' }}>{pick(it.level, lang)}</div><div className="h-card">{pick(it.major, lang)}</div></div>
                  </div>
                  <div className="small mt-16">{it.school}</div>
                  <div className="xs muted">{[it.location, period(it.start, it.end), pick(it.note, lang)].filter(Boolean).join(' · ')}</div>
                  {!isNaN(gpa) && (
                    <div className="mt-16">
                      <div className="row between xs"><span className="muted">IPK / GPA</span><span>{it.gpa} / 4.00</span></div>
                      <div className="meter yellow mt-8" style={{ background: 'var(--ink-2)' }}><span style={{ width: `${(gpa / 4) * 100}%` }} /></div>
                    </div>
                  )}
                  {it.highlights.length > 0 && <Bullets className="bullets mt-16" text={it.highlights.map(h => pick(h, lang)).join('\n')} />}
                </div>
              );
            })}
            <Link to="/sertifikat" className="card hoverable row between" style={{ textDecoration: 'none' }}>
              <div><div className="h-sm">{t('Sertifikat & pelatihan', 'Certificates & training')}</div><div className="xs muted">{t('Pendidikan non-formal setelah lulus', 'Non-formal learning after graduation')}</div></div>
              <span className="icon-btn"><Icon name="arrow" /></span>
            </Link>
          </div>

          <div className="stack gap-12">
            <Reveal className="card">
              <span className="eyebrow">{t('Cerita', 'Story')}</span>
              <div className="prose mt-16">{paragraphs(pick(ed.story, lang)).map((p, i) => <p key={i}>{p}</p>)}</div>
            </Reveal>

            {ed.items.map(it => (
              <Reveal key={it.id} className="card">
                <span className="eyebrow">{t('Detail studi', 'Study details')}: {it.school}</span>
                {pick(it.story, lang) && <p className="muted mt-16" style={{ lineHeight: 1.75 }}>{pick(it.story, lang)}</p>}
                <dl className="kv mt-16">
                  <dt>{t('Jenjang', 'Level')}</dt><dd>{pick(it.level, lang)}</dd>
                  <dt>{t('Program studi', 'Major')}</dt><dd>{pick(it.major, lang)}</dd>
                  <dt>{t('Kampus', 'Institution')}</dt><dd>{it.school}</dd>
                  {it.location && <><dt>{t('Lokasi', 'Location')}</dt><dd>{it.location}</dd></>}
                  {period(it.start, it.end) && <><dt>{t('Periode', 'Period')}</dt><dd>{period(it.start, it.end)}</dd></>}
                  {pick(it.note, lang) && <><dt>{t('Kelas', 'Class')}</dt><dd>{pick(it.note, lang)}</dd></>}
                  {it.gpa && <><dt>IPK / GPA</dt><dd>{it.gpa}</dd></>}
                  {pick(it.thesis, lang) && <><dt>{t('Skripsi', 'Thesis')}</dt><dd>{pick(it.thesis, lang)}</dd></>}
                </dl>
                {it.courses.length > 0 && (<>
                  <div className="h-sm mt-24 mb-8">{t('Mata kuliah inti', 'Core courses')}</div>
                  <div className="row wrap gap-8">{it.courses.map(c => <span key={c} className="chip">{c}</span>)}</div>
                </>)}
              </Reveal>
            ))}

            {ed.journey.length > 0 && (
              <Reveal className="card">
                <span className="eyebrow">{t('Alur & sejarah', 'Path & history')}</span>
                <div className="timeline mt-16">
                  {ed.journey.map((j, i) => (
                    <div key={j.id} className={`tl-item ${i === ed.journey.length - 1 ? 'on' : ''}`}>
                      <div className="row gap-16" style={{ alignItems: 'flex-start', padding: '12px 0' }}>
                        {j.year && j.year.trim() !== '—' && <span className="pill sm dark" style={{ minWidth: 64 }}>{j.year}</span>}
                        <div className="grow"><div className="h-sm">{pick(j.title, lang)}</div><div className="small muted">{pick(j.desc, lang)}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {content.organizations.length > 0 && (
              <Reveal className="card">
                <span className="eyebrow">{t('Organisasi kampus', 'Campus organizations')}</span>
                {content.organizations.map(o => (
                  <div key={o.id} className="mt-16">
                    <div className="h-sm">{pick(o.role, lang)}</div>
                    <div className="small muted">{pick(o.name, lang)}</div>
                    <Bullets className="bullets mt-8" text={o.points.map(x => pick(x, lang)).join('\n')} />
                  </div>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default EducationPage;
