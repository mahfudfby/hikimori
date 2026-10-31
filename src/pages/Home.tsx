// src/pages/Home.tsx — Dashboard ringkas. Tiap kartu = ringkasan; tombol ↗ membuka halaman detailnya.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { usePortfolio } from '../hooks/usePortfolio';
import { Icon, CardLink, CountUp, Reveal, Staged, isLite, cld, cldSet, Logo } from '../components/ui';
import {
  pick, monthsOf, fmtDuration, fmtPeriod, careerMonths, categoryShare, CATEGORY_LABEL, ageOf, lines, waLink, RELEVANT, relevantExp,
} from '../content/derive';
import type { Experience } from '../content/types';
import { downloadUrl } from '../utils/saveFile';

const SLIDE_MS = 6500;
const MAX_BARS = 10;

/* ───────── Header: sapaan + pill persentase + angka besar ───────── */
const DashTop: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  // Hanya pengalaman profesional/relevan (HR & Admin, IT, Operasional) — pekerjaan lapangan & part-time
  // tetap lengkap di /pengalaman, tapi tidak mendominasi kesan pertama dashboard.
  const relevant = relevantExp(content.experience);
  const share = categoryShare(relevant, RELEVANT);
  const years = careerMonths(relevant) / 12;
  const styles = ['dark', 'yellow', 'stripe'];
  const [nameMain, ...deg] = content.profile.name.split(',');
  const nameDeg = deg.join(',').trim();
  return (
    <section className="dash-top">
      <div style={{ minWidth: 0 }}>
        <h1 className="h-hero">{nameMain}{nameDeg && <span className="hero-deg">{nameDeg}</span>}</h1>
        <p className="hero-sub">{pick(content.profile.title, lang)} · {content.profile.location.split(',')[0]}</p>
        <div className="xs faint mt-24">{t('Komposisi pengalaman profesional', 'Professional experience mix')}</div>
        <div className="dash-pills mt-8" style={{ ['--cols' as any]: share.map(s => `${Math.max(2, Math.round(s.pct / 7))}fr`).join(' ') }}>
          {share.map((s, i) => (
            <div key={s.key} style={{ minWidth: 0 }}>
              <div className="lbl">{pick(CATEGORY_LABEL[s.key], lang)}</div>
              <Link to={`/pengalaman?k=${s.key}`} className={`pill ${styles[i]}`} title={fmtDuration(s.months, lang)}>{s.pct}%</Link>
            </div>
          ))}
        </div>
      </div>
      <div className="dash-stats">
        {[
          { icon: 'briefcase', v: years, d: 1, l: t('Th. profesional', 'Years pro') },
          { icon: 'users', v: relevant.length, d: 0, l: t('Posisi', 'Positions') },
          { icon: 'award', v: content.certificates.length, d: 0, l: t('Sertifikat', 'Certificates') },
        ].map(s => (
          <div key={s.l} className="row gap-8" style={{ alignItems: 'flex-end' }}>
            <div className="stack gap-4" style={{ paddingBottom: 6 }}>
              <span className="icon-btn sm" style={{ width: 26, height: 26, flexBasis: 26 }}><Icon name={s.icon} size={13} /></span>
              <span className="xs muted" style={{ whiteSpace: 'nowrap' }}>{s.l}</span>
            </div>
            <span className="num-xl"><CountUp to={s.v} decimals={s.d} /></span>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ───────── Kartu foto profil ───────── */
const PhotoCard: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLang();
  const p = content.profile;
  return (
    <Link to="/profil" className="card photo-card hoverable b-photo" style={{ textDecoration: 'none' }}>
      {/* HP maks. 540 px (layar DPR tinggi tidak perlu 900 px untuk kartu ini) — sama persis dengan preload di index.html */}
      <picture>
        <source media="(max-width: 680px)" srcSet={cldSet(p.photoUrl, [360, 540])} sizes="92vw" />
        <img src={cld(p.photoUrl, 640)} srcSet={cldSet(p.photoUrl, [640, 900])} sizes="(max-width: 1180px) 46vw, 300px"
          alt={p.name} {...{ fetchpriority: "high" }} decoding="async" width={600} height={760} />
      </picture>
      <div className="meta">
        <div style={{ minWidth: 0 }}>
          <div className="h-card" style={{ fontSize: '1.35rem' }}>{p.name.split(',')[0]}</div>
          <div className="small" style={{ opacity: 0.8 }}>{pick(p.title, lang)}</div>
        </div>
        {p.badge && <span className="pill">{p.badge}</span>}
      </div>
    </Link>
  );
};

/* ───────── Progress: grafik batang durasi tiap pengalaman ───────── */
const ProgressCard: React.FC<{ exps: Experience[]; idx: number; onPick: (i: number) => void }> = ({ exps, idx, onPick }) => {
  const { content } = useContent();
  const { lang, t } = useLang();
  const months = exps.map(e => monthsOf(e.start, e.end));
  const max = Math.max(1, ...months);
  const total = careerMonths(content.experience);
  return (
    <div className="card b-progress">
      <div className="card-head">
        <h2 className="h-card">{t('Pengalaman', 'Experience')}</h2>
        <CardLink to="/pengalaman" label={t('Detail pengalaman', 'Experience details')} />
      </div>
      <div className="row gap-12">
        <span className="num-lg">{(total / 12).toFixed(1)} <span style={{ fontSize: '1.1rem' }}>{t('th', 'y')}</span></span>
        <span className="xs muted" style={{ lineHeight: 1.3 }} title={t('Periode menganggur tidak dihitung', 'Unemployed periods are excluded')}>{t('Masa kerja efektif', 'Effective work time')}<br />{t('tanpa jeda', 'excluding gaps')}</span>
      </div>
      <div className="bars" role="listbox" aria-label={t('Pilih pengalaman', 'Pick an experience')}>
        {exps.map((e, i) => {
          // Maks. 10 batang terbaru → tiap batang ≥ 24 px (standar target sentuh). Riwayat lengkap ada di /pengalaman.
          if (i < exps.length - MAX_BARS) return null;
          const h = Math.max(10, Math.round((months[i] / max) * 100));
          const on = i === idx;
          return (
            <button key={e.id} className={`bar ${on ? 'on' : ''}`} onClick={() => onPick(i)} role="option" aria-selected={on}
              title={`${pick(e.position, lang)} — ${e.company} (${fmtDuration(months[i], lang)})`}>
              {on && <span className="pill yellow sm tip">{fmtDuration(months[i], lang, true)}</span>}
              <span className="ghost" />
              <span className="stick" style={{ height: `${h * 0.62}%` }} />
              <span className="dot" />
              <span className="lab">'{(e.start || '').slice(2, 4)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ───────── Time tracker → deskripsi pekerjaan (auto-slideshow) ───────── */
const TrackerCard: React.FC<{ exp?: Experience; idx: number; count: number; playing: boolean; setPlaying: (p: boolean) => void; next: () => void; prev: () => void }> =
  ({ exp, idx, count, playing, setPlaying, next, prev }) => {
    const { lang, t } = useLang();
    // Geser kiri = berikutnya, geser kanan = sebelumnya (layar sentuh). Gerakan vertikal tetap menggulir halaman.
    const touch = useRef<{ x: number; y: number } | null>(null);
    const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchEnd = (e: React.TouchEvent) => {
      const s = touch.current; touch.current = null;
      if (!s) return;
      const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
      setPlaying(false);
      if (dx < 0) next(); else prev();
    };
    if (!exp) return <div className="card b-tracker"><div className="empty">{t('Belum ada pengalaman', 'No experience yet')}</div></div>;
    const m = monthsOf(exp.start, exp.end);
    const desc = lines(pick(exp.desc, lang));
    return (
      <div className="card b-tracker" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="card-head">
          <h2 className="h-card">{t('Deskripsi Kerja', 'Job Description')}</h2>
          <CardLink to={`/pengalaman#${exp.id}`} label={t('Buka detail', 'Open details')} />
        </div>
        <div className="dur-box" key={`${exp.id}-${idx}`}>
          <div className="dur-top">
            <span className="dur-1">{fmtDuration(m, lang, true)}</span>
            <Logo key={exp.id} src={exp.logoUrl} alt={exp.company} />
          </div>
          <span className="dur-2">{pick(exp.position, lang)}</span>
          <span className="dur-3">{exp.company} · {fmtPeriod(exp.start, exp.end, lang)}{exp.type ? ` · ${exp.type}` : ''}</span>
          <div className="slide-prog" aria-hidden="true">
            <span key={`${exp.id}-${idx}`} style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? 'running' : 'paused' }}
              onAnimationEnd={() => playing && next()} />
          </div>
        </div>
        {desc.length ? <ul className="job-desc">{desc.map((d, i) => <li key={i}>{d.text}</li>)}</ul>
          : <p className="xs faint">{t('Deskripsi belum diisi.', 'No description yet.')}</p>}
        <div className="row between mt-16">
          <div className="row gap-8">
            <button className={`icon-btn ${playing ? '' : 'dark'}`} onClick={() => setPlaying(true)} aria-label="Play"><Icon name="play" /></button>
            <button className={`icon-btn ${playing ? 'dark' : ''}`} onClick={() => setPlaying(false)} aria-label="Pause"><Icon name="pause" /></button>
          </div>
          <span className="xs faint center">{idx + 1}/{count}<span className="touch-hint"><br />‹ {t('geser', 'swipe')} ›</span></span>
          <button className="icon-btn dark" onClick={next} aria-label={t('Berikutnya', 'Next')}><Icon name="next" /></button>
        </div>
      </div>
    );
  };

/* ───────── Onboarding → bar Usia (tahun lahir → ∞), terus mengisi tapi tak pernah penuh ───────── */
const AgeCard: React.FC = () => {
  const { content } = useContent();
  const { t } = useLang();
  const by = content.profile.birthYear;
  const age = ageOf(by, content.profile.birthDate);
  const now = new Date().getFullYear();
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = isLite();
    const p0 = 18; const tau = 9000; // mendekati 100% secara asimtotik
    const t0 = performance.now(); let raf = 0; let to = 0;
    const tick = () => {
      const tm = performance.now();
      const p = reduce ? 72 : 100 - (100 - p0) * Math.exp(-(tm - t0) / tau);
      const shown = Math.min(p, 99.4);
      // transform (bukan width) → di-composite GPU, tanpa hitung ulang layout
      if (fillRef.current) fillRef.current.style.transform = `translateX(${shown - 100}%)`;
      if (pctRef.current) pctRef.current.textContent = `${shown.toFixed(1)}%`;
      if (reduce) return;
      // HP: 4x per detik + transisi CSS (tetap mulus, jauh lebih hemat CPU) — desktop: tiap frame
      if (lite) to = window.setTimeout(tick, 250); else raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); clearTimeout(to); };
  }, []);

  return (
    <div className="card b-onboard">
      <div className="card-head" style={{ alignItems: 'center' }}>
        <h2 className="h-card">{t('Usia', 'Age')}</h2>
        <span className="num-lg">{age || '—'}<span style={{ fontSize: '1rem' }}> {t('th', 'y')}</span></span>
      </div>
      <div className="age-labels" style={{ ['--split' as any]: '1fr' }}>
        <span>{by || '—'}</span><span style={{ textAlign: 'center' }}>{now}</span><span>∞</span>
      </div>
      <div className="age-track">
        <div className="age-rest" />
        <div ref={fillRef} className="age-bar" style={{ transform: 'translateX(-82%)', transition: isLite() ? 'transform 0.25s linear' : undefined }} />
        <span className="age-label">{t('Hidup', 'Life')}</span>
      </div>
      <div className="row between mt-8 xs muted">
        <span>{t('Terus bertumbuh', 'Always growing')}</span>
        <span ref={pctRef} style={{ fontVariantNumeric: 'tabular-nums' }}>18%</span>
      </div>
      <p className="xs faint mt-16">{t('Batang ini terus terisi tapi tak akan pernah penuh — belajar tidak punya garis akhir.', 'This bar keeps filling but never completes — learning has no finish line.')}</p>
    </div>
  );
};

/* ───────── Pencapaian: angka-angka yang menjual (pengganti kartu Usia, bisa diatur di CMS) ───────── */
const AchievementsCard: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  const list = content.achievements.slice(0, 5);
  return (
    <div className="card b-onboard">
      <div className="card-head" style={{ alignItems: 'center' }}>
        <h2 className="h-card">{t('Pencapaian', 'Highlights')}</h2>
        <CardLink to="/pengalaman" label={t('Lihat pengalaman', 'See experience')} />
      </div>
      {list.length === 0 ? <p className="xs faint">{t('Tambahkan pencapaian di CMS → Profil.', 'Add highlights in CMS → Profile.')}</p> : (
        <div className="ach-list">
          {list.map(a => (
            <div className="ach-item" key={a.id}>
              <span className="ach-l">{pick(a.label, lang)}</span>
              <span className="ach-v">{a.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ───────── Accordion biodata + pendidikan ───────── */
const Acc: React.FC<{ title: string; open: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, open, onToggle, children }) => (
  <div className={`acc ${open ? 'open' : ''}`}>
    <button onClick={onToggle} aria-expanded={open}>{title}<Icon name="chevron" /></button>
    {open && <div className="acc-body">{children}</div>}
  </div>
);

const BioCard: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  const [open, setOpen] = useState<string>('edu');
  const p = content.profile;
  const ed = content.education.items[0];
  const tog = (k: string) => setOpen(o => (o === k ? '' : k));
  return (
    <div className="card b-bio">
      <Acc title={t('Biodata Pribadi', 'Personal Details')} open={open === 'bio'} onToggle={() => tog('bio')}>
        <dl className="kv">
          <dt>{t('Nama', 'Name')}</dt><dd>{p.name}</dd>
          {p.showBirthDate ? <><dt>{t('Tempat, tgl lahir', 'Born')}</dt><dd>{[p.birthPlace, p.birthDate || p.birthYear].filter(Boolean).join(', ')}</dd>
          <dt>{t('Jenis kelamin', 'Gender')}</dt><dd>{pick(p.gender, lang)}</dd></> : <><dt>{t('Asal', 'From')}</dt><dd>{p.birthPlace}</dd></>}
          <dt>{t('Kewarganegaraan', 'Nationality')}</dt><dd>{pick(p.nationality, lang)}</dd>
          <dt>{t('Domisili', 'Location')}</dt><dd>{p.location}</dd>
        </dl>
        <Link to="/profil" className="pill sm mt-16">{t('Profil lengkap', 'Full profile')} <Icon name="arrow" size={13} /></Link>
      </Acc>
      <Acc title={t('Pendidikan', 'Education')} open={open === 'edu'} onToggle={() => tog('edu')}>
        {ed ? (
          <Link to="/pendidikan" className="row gap-12" style={{ textDecoration: 'none' }}>
            <div className="logo-box" style={{ width: 56, height: 44, flexBasis: 56, borderRadius: 10 }}><Icon name="cap" size={22} /></div>
            <div className="grow">
              <div className="small" style={{ fontWeight: 500 }}>{pick(ed.level, lang)} {pick(ed.major, lang)}</div>
              <div className="xs muted">{ed.school}</div>
              <div className="xs faint">{ed.gpa ? `IPK ${ed.gpa}` : ''}{pick(ed.note, lang) ? ` · ${pick(ed.note, lang)}` : ''}</div>
            </div>
            <Icon name="right" />
          </Link>
        ) : <span className="xs faint">—</span>}
      </Acc>
      <Acc title={t('Kontak', 'Contact')} open={open === 'contact'} onToggle={() => tog('contact')}>
        <dl className="kv">
          <dt>Email</dt><dd><a href={`mailto:${p.email}`}>{p.email}</a></dd>
          <dt>{t('Telepon', 'Phone')}</dt><dd>{p.phone}</dd>
          <dt>Web</dt><dd>{p.website}</dd>
        </dl>
      </Acc>
      <Acc title={t('Hobi', 'Hobbies')} open={open === 'hobby'} onToggle={() => tog('hobby')}>
        <div className="row wrap gap-8">{p.hobbies.map((h, i) => <span key={i} className="chip">{pick(h, lang)}</span>)}</div>
      </Acc>
    </div>
  );
};

/* ───────── Schedule → Summary (tampilan ala kalender) ───────── */
const SummaryCard: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  const hard = content.skills.filter(s => s.category === 'hard').sort((a, b) => b.level - a.level).slice(0, 4);
  const soft = content.skills.filter(s => s.category === 'soft').sort((a, b) => b.level - a.level).slice(0, 4);
  return (
    <div className="card b-summary">
      <div className="sum-head">
        <Link to="/profil" className="pill white sm">{t('Profil', 'Profile')}</Link>
        <h2 className="h-card">{t('Ringkasan', 'Summary')}</h2>
        <Link to="/keahlian" className="pill white sm">{t('Keahlian', 'Skills')}</Link>
      </div>
      <div className="sum-grid">
        <div className="time">{t('Profil', 'Profile')}</div>
        <div className="lane"><p className="small muted" style={{ lineHeight: 1.7 }}>{pick(content.profile.summary, lang)}</p></div>
        <div className="time">Hard skill</div>
        <div className="lane">
          {hard.map((s, i) => (
            <Link key={s.id} to="/keahlian" className={`event ${i === 0 ? 'dark' : ''}`} style={{ textDecoration: 'none' }}>
              {pick(s.name, lang)}
            </Link>
          ))}
        </div>
        <div className="time">Soft skill</div>
        <div className="lane">
          {soft.map((s, i) => (
            <Link key={s.id} to="/keahlian" className={`event ${i === 1 ? 'dark' : ''}`} style={{ textDecoration: 'none' }}>
              {pick(s.name, lang)}
            </Link>
          ))}
        </div>
        <div className="time">Tools</div>
        <div className="lane">{content.tools.slice(0, 6).map(tl => <span key={tl.id} className="chip">{tl.name}</span>)}</div>
      </div>
    </div>
  );
};

/* ───────── Onboarding Task → Sertifikat & Lisensi (kartu gelap) ───────── */
const CertsCard: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  const certs = content.certificates;
  const lic = certs.filter(c => c.category === 'license').length;
  return (
    <div className="stack-tabs b-certs">
      <div className="card dark" style={{ height: '100%' }}>
        <div className="card-head" style={{ alignItems: 'center' }}>
          <div>
            <h2 className="h-card">{t('Sertifikat & Lisensi', 'Certificates & Licenses')}</h2>
            <div className="xs muted" style={{ marginTop: 2 }}>
              {[lic && `${lic} ${t('lisensi profesi', 'professional license')}`, certs.length - lic && `${certs.length - lic} ${t('pelatihan', 'trainings')}`].filter(Boolean).join(' · ')}
            </div>
          </div>
          <span className="num-lg">{certs.length}</span>
        </div>
        <div className="task-list">
          {certs.slice(0, 6).map((c, i) => (
            <React.Fragment key={c.id}>
            <Link to={`/sertifikat#${c.id}`} className={`task ${i === 0 ? 'top' : ''}`}>
              <span className="ico" aria-hidden="true">{c.category === 'license' ? '🪪' : c.category === 'training' ? '🎓' : '📜'}</span>
              <span className="grow">
                <span className="t" style={{ display: 'block' }}>{pick(c.name, lang)}</span>
                <span className="s">{c.issuer.split('—')[0].trim()} · {c.year}</span>
              </span>
              <span className="check" title={t('Lulus', 'Passed')}><Icon name="check" size={12} /></span>
            </Link>
            {/* Unit kompetensi (mis. 4 materi pelatihan CHRG) sebagai sub-daftar; kode unit disembunyikan agar ringkas */}
            {(c.units || []).length > 0 && (
              <ul className="cert-units">
                {c.units.map((u, k) => <li key={k}>{pick(u, lang).split(' (M.')[0]}</li>)}
              </ul>
            )}
            </React.Fragment>
          ))}
        </div>
        <Link to="/sertifikat" className="pill sm mt-16" style={{ borderColor: 'var(--ink-2)', color: 'var(--on-ink)' }}>
          {t('Lihat semua', 'View all')} <Icon name="arrow" size={13} />
        </Link>
      </div>
    </div>
  );
};

/* ───────── Slideshow portofolio: pita kartu bergerak otomatis, berhenti saat disentuh kursor ───────── */
const FolioCard: React.FC = () => {
  const { items, loading } = usePortfolio();
  const { t } = useLang();
  const list = items.slice().sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order).slice(0, 10);
  // Pita digandakan agar putaran mulus tanpa lompatan
  const loop = list.length > 1 ? [...list, ...list] : list;
  return (
    <div className="card b-folio no-tilt">
      <div className="card-head">
        <div><h2 className="h-card">{t('Portofolio', 'Portfolio')}</h2>
          <div className="xs faint">{list.length ? `${items.length} ${t('proyek', 'projects')}` : t('Kumpulan karya & proyek', 'Selected work & projects')}</div></div>
        <CardLink to="/portofolio" label={t('Lihat semua', 'See all')} />
      </div>
      {loading ? <div className="skeleton" style={{ height: 210 }} />
        : list.length === 0 ? <div className="empty">{t('Proyek segera ditambahkan.', 'Projects coming soon.')}</div>
        : (
          <div className="folio-view">
            <div className="folio-track" style={{ animationDuration: `${Math.max(20, list.length * 6)}s`, animationName: list.length > 1 ? undefined : 'none' }}>
              {loop.map((p, i) => (
                <Link key={`${p.id}-${i}`} to="/portofolio" className="folio-slide" aria-hidden={i >= list.length || undefined} tabIndex={i >= list.length ? -1 : undefined}>
                  <div className="folio-img">{p.imageUrl ? <img src={cld(p.imageUrl, 480)} alt={i < list.length ? p.title : ''} loading="lazy" decoding="async" /> : <Icon name="grid" />}</div>
                  <span className="dur-2">{p.title}</span>
                  <span className="dur-3">{[p.category, p.client, p.year].filter(Boolean).join(' · ')}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

const Home: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  // Urut kronologis (lama → baru) untuk grafik, mulai slideshow dari yang terbaru.
  const exps = useMemo(() => [...content.experience].sort((a, b) => (a.start || '').localeCompare(b.start || '')), [content.experience]);
  const [idx, setIdx] = useState(Math.max(0, exps.length - 1));
  const [playing, setPlaying] = useState(true);
  useEffect(() => { if (idx >= exps.length) setIdx(Math.max(0, exps.length - 1)); }, [exps.length, idx]);
  const next = () => setIdx(i => (exps.length ? (i + 1) % exps.length : 0));
  const prev = () => setIdx(i => (exps.length ? (i - 1 + exps.length) % exps.length : 0));

  useEffect(() => { document.title = `${content.profile.name} | ${pick(content.profile.title, lang)}`; }, [content.profile, lang]);

  return (
    <main className="shell page-in">
      <div className="frame">
        <DashTop />
        <div className="bento">
          {/* Mode HP: kartu dimuat bergiliran sesuai urutan ini */}
          <Staged className="b-photo" minHeight={340} eager><PhotoCard /></Staged>
          <Staged className="b-progress" minHeight={300}><ProgressCard exps={exps} idx={idx} onPick={i => { setIdx(i); setPlaying(false); }} /></Staged>
          <Staged className="b-tracker" minHeight={420}><TrackerCard exp={exps[idx]} idx={idx} count={exps.length} playing={playing} setPlaying={setPlaying} next={next} prev={prev} /></Staged>
          <Staged className="b-onboard" minHeight={240}>{content.profile.showAgeCard ? <AgeCard /> : <AchievementsCard />}</Staged>
          <Staged className="b-bio" minHeight={220}><BioCard /></Staged>
          <Staged className="b-summary" minHeight={360}><SummaryCard /></Staged>
          <Staged className="b-certs" minHeight={420}><CertsCard /></Staged>
          <Staged className="b-folio" minHeight={300}><FolioCard /></Staged>
        </div>
      </div>

      <Reveal className="card dark row wrap between gap-16" style={{ padding: 'clamp(20px,3vw,32px)' }}>
        <div style={{ maxWidth: 560 }}>
          <span className="chip yellow mb-8">{pick(content.contact.availability, lang)}</span>
          <h2 className="h-2 mt-8">{pick(content.contact.headline, lang)}</h2>
          <p className="muted mt-8">{pick(content.contact.sub, lang)}</p>
        </div>
        <div className="row wrap gap-8">
          <a className="pill yellow lg" href={waLink(content, lang)} target="_blank" rel="noreferrer"><Icon name="chat" />{t('Chat WhatsApp', 'Chat on WhatsApp')}</a>
          <Link className="pill lg" to="/kontak" style={{ borderColor: 'var(--ink-2)', color: 'var(--on-ink)' }}><Icon name="mail" />{t('Kontak', 'Contact')}</Link>
          {content.profile.cvUrl && <a className="pill lg" href={content.profile.cvUrl} download onClick={e => { e.preventDefault(); downloadUrl(content.profile.cvUrl, 'CV-Mahfud-Febry-Styanto.pdf'); }} style={{ borderColor: 'var(--ink-2)', color: 'var(--on-ink)' }}><Icon name="download" />CV</a>}
        </div>
      </Reveal>
    </main>
  );
};

export default Home;
