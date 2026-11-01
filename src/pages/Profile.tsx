// src/pages/Profile.tsx — /profil : cerita, biodata, organisasi, hobi, referensi.
import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, Reveal, useTitle, Bullets, cld, cldSet } from '../components/ui';
import { pick, paragraphs, careerMonths, ageOf, waLink } from '../content/derive';
import { downloadUrl } from '../utils/saveFile';

const Profile: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  const p = content.profile;
  useTitle(`${t('Profil', 'Profile')} — ${p.name}`);
  const s = p.socials;
  const socials = [
    s.linkedin && { label: 'LinkedIn', href: `https://linkedin.com/in/${s.linkedin}` },
    s.instagram && { label: 'Instagram', href: `https://instagram.com/${s.instagram}` },
    s.threads && { label: 'Threads', href: `https://threads.net/@${s.threads}` },
    s.tiktok && { label: 'TikTok', href: `https://tiktok.com/@${s.tiktok}` },
    s.jobstreet && { label: 'Jobstreet', href: s.jobstreet },
    s.ibenews && { label: 'iBenews', href: s.ibenews },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Profil', 'Profile')} title={p.name} lead={pick(p.tagline, lang)}
          aside={<div className="row wrap gap-8">
            {p.openToWork && <span className="chip yellow">● {pick(content.contact.availability, lang)}</span>}
            {p.cvUrl && <a className="pill dark" href={p.cvUrl} download onClick={e => { e.preventDefault(); downloadUrl(p.cvUrl, 'CV-Mahfud-Febry-Styanto.pdf'); }}><Icon name="download" size={16} />{t('Unduh CV', 'Download CV')}</a>}
          </div>} />

        <div className="split">
          <div className="stack gap-12 sticky">
            <div className="card photo-card" style={{ minHeight: 420 }}>
              <img src={cld(p.photoUrl, 900)} srcSet={cldSet(p.photoUrl, [420, 640, 900])} sizes="(max-width: 860px) 92vw, 40vw" alt={p.name} decoding="async" />
              <div className="meta">
                <div><div className="h-card">{p.name.split(',')[0]}</div><div className="small" style={{ opacity: 0.8 }}>{pick(p.title, lang)}</div></div>
                {p.badge && <span className="pill">{p.badge}</span>}
              </div>
            </div>
            <div className="card">
              <h2 className="h-sm mb-16">{t('Biodata Pribadi', 'Personal Details')}</h2>
              <dl className="kv">
                <dt>{t('Nama lengkap', 'Full name')}</dt><dd>{p.name}</dd>
                <dt>{t('Tempat lahir', 'Birthplace')}</dt><dd>{p.birthPlace || '—'}</dd>
                {p.showBirthDate && <>
                  <dt>{t('Tanggal lahir', 'Date of birth')}</dt><dd>{p.birthDate || p.birthYear || '—'}</dd>
                  <dt>{t('Usia', 'Age')}</dt><dd>{ageOf(p.birthYear, p.birthDate) ? `${ageOf(p.birthYear, p.birthDate)} ${t('tahun', 'years')}` : '—'}</dd>
                  <dt>{t('Jenis kelamin', 'Gender')}</dt><dd>{pick(p.gender, lang)}</dd>
                </>}
                <dt>{t('Kewarganegaraan', 'Nationality')}</dt><dd>{pick(p.nationality, lang)}</dd>
                <dt>{t('Domisili', 'Location')}</dt><dd>{p.location}</dd>
                <dt>Email</dt><dd><a href={`mailto:${p.email}`}>{p.email}</a></dd>
                <dt>{t('Telepon', 'Phone')}</dt><dd>{p.phone}</dd>
                <dt>Website</dt><dd>{p.website}</dd>
              </dl>
            </div>
          </div>

          <div className="stack gap-12">
            <Reveal className="card">
              <span className="eyebrow">{t('Cerita saya', 'My story')}</span>
              <div className="prose mt-16">{paragraphs(pick(p.story, lang)).map((x, i) => <p key={i}>{x}</p>)}</div>
            </Reveal>

            <div className="grid-3">
              {[
                { v: (careerMonths(content.experience) / 12).toFixed(1), l: t('Tahun pengalaman', 'Years of experience'), to: '/pengalaman' },
                { v: content.certificates.length, l: t('Sertifikat & lisensi', 'Certificates & licenses'), to: '/sertifikat' },
                { v: content.skills.length, l: t('Keahlian', 'Skills'), to: '/keahlian' },
              ].map(x => (
                <Link key={x.l} to={x.to} className="card hoverable" style={{ textDecoration: 'none' }}>
                  <div className="num-lg">{x.v}</div><div className="small muted mt-8">{x.l}</div>
                </Link>
              ))}
            </div>

            <Reveal className="card">
              <span className="eyebrow">{t('Ringkasan profesional', 'Professional summary')}</span>
              <p className="muted mt-16" style={{ lineHeight: 1.75 }}>{pick(p.summary, lang)}</p>
            </Reveal>

            {content.achievements.length > 0 && (
              <Reveal className="card">
                <span className="eyebrow">{t('Pernah Menangani', 'Previously Handled')}</span>
                <div className="grid-3 mt-16">
                  {content.achievements.map(a => (
                    <div key={a.id}>
                      <div className="num-lg">{a.value}</div>
                      <div className="small muted mt-8">{pick(a.label, lang)}</div>
                      {a.job && <div className="xs faint mt-4">{a.job}</div>}
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {content.awards.length > 0 && (
              <Reveal className="card">
                <span className="eyebrow">{t('Pencapaian', 'Achievements')}</span>
                <ul className="award-list mt-16">
                  {content.awards.map(a => (
                    <li key={a.id}>
                      <span className="award-ic" aria-hidden="true"><Icon name="award" size={18} /></span>
                      <div>
                        <div className="row between gap-8"><strong>{pick(a.title, lang)}</strong>{a.year && <span className="chip">{a.year}</span>}</div>
                        {pick(a.desc, lang) && <p className="small muted mt-4">{pick(a.desc, lang)}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {content.organizations.length > 0 && (
              <Reveal className="card dark">
                <span className="eyebrow" style={{ color: 'var(--on-ink-dim)' }}>{t('Organisasi', 'Organizations')}</span>
                {content.organizations.map(o => (
                  <div key={o.id} className="mt-16">
                    <div className="h-sm">{pick(o.role, lang)}</div>
                    <div className="small muted">{pick(o.name, lang)}{o.period ? ` · ${o.period}` : ''}</div>
                    <Bullets text={o.points.map(x => pick(x, lang)).join('\n')} className="bullets mt-8" />
                  </div>
                ))}
              </Reveal>
            )}

            <div className="grid-2">
              <Reveal className="card">
                <span className="eyebrow">{t('Hobi & minat', 'Hobbies & interests')}</span>
                <div className="row wrap gap-8 mt-16">{p.hobbies.map((h, i) => <span key={i} className="chip">{pick(h, lang)}</span>)}</div>
              </Reveal>
              <Reveal className="card">
                <span className="eyebrow">{t('Temukan saya', 'Find me')}</span>
                <div className="row wrap gap-8 mt-16">
                  {socials.map(x => <a key={x.label} className="pill sm" href={x.href} target="_blank" rel="noreferrer">{x.label}<Icon name="external" size={12} /></a>)}
                </div>
              </Reveal>
            </div>

            {content.references.length > 0 && (
              <Reveal className="card">
                <span className="eyebrow">{t('Referensi', 'References')}</span>
                {content.references.map(r => (
                  <div key={r.id} className="row gap-12 mt-16">
                    <span className="icon-btn dark"><Icon name="user" /></span>
                    <div className="grow"><div className="h-sm">{r.name}</div><div className="small muted">{pick(r.role, lang)} · {r.company}</div><div className="xs faint">{pick(r.note, lang)}</div></div>
                  </div>
                ))}
              </Reveal>
            )}

            <div className="row wrap gap-8">
              <a className="pill dark lg" href={waLink(content, lang)} target="_blank" rel="noreferrer"><Icon name="chat" />{t('Hubungi saya', 'Contact me')}</a>
              <Link className="pill lg" to="/pengalaman">{t('Lihat pengalaman', 'See experience')} <Icon name="arrow" size={15} /></Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
