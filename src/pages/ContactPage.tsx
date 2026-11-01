// src/pages/ContactPage.tsx — /kontak : info kontak + form yang langsung membuka WhatsApp / email
// (tanpa backend, jadi pesan pasti terkirim lewat aplikasi pengunjung).
import React, { useState } from 'react';
import { useContent } from '../content/ContentContext';
import { useLang } from '../contexts/LanguageContext';
import { Icon, PageHero, useTitle } from '../components/ui';
import { pick } from '../content/derive';
import { mailLink } from '../utils/mailLink';

const ContactPage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLang();
  useTitle(`${t('Kontak', 'Contact')} — ${content.profile.name}`);
  const p = content.profile;
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [msg, setMsg] = useState('');
  const topics = [t('Peluang kerja', 'Job opportunity'), t('Kolaborasi proyek', 'Project collaboration'), ...content.services.map(s => pick(s.title, lang))];
  const body = `${t('Halo', 'Hi')} ${p.shortName},\n\n${msg}\n\n${name}${topic ? `\n(${t('Topik', 'Topic')}: ${topic})` : ''}`;
  const valid = name.trim().length > 0 && msg.trim().length > 0;
  const [tried, setTried] = useState(false); // tampilkan pesan bila tombol diklik sebelum form lengkap
  const waHref = `https://wa.me/${p.whatsapp}?text=${encodeURIComponent(body)}`;
  const mailHref = mailLink(p.email, `?subject=${encodeURIComponent(topic || t('Halo dari portofolio', 'Hello from your portfolio'))}&body=${encodeURIComponent(body)}`);
  // Tautan biasa (bukan window.open) agar Safari iOS tidak memblokir pembukaan WhatsApp / aplikasi email
  const guard = (e: React.MouseEvent) => { if (!valid) { e.preventDefault(); setTried(true); } };

  const items = [
    { icon: 'mail', label: 'Email', value: p.email, href: mailLink(p.email) },
    { icon: 'chat', label: 'WhatsApp', value: p.phone, href: `https://wa.me/${p.whatsapp}` },
    { icon: 'map', label: t('Lokasi', 'Location'), value: p.location, href: `https://maps.google.com/?q=${encodeURIComponent(p.location)}` },
    p.socials.linkedin && { icon: 'link', label: 'LinkedIn', value: p.socials.linkedin, href: `https://linkedin.com/in/${p.socials.linkedin}` },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string }[];

  return (
    <main className="shell page-in">
      <div className="frame">
        <PageHero crumb={t('Kontak', 'Contact')} title={pick(content.contact.headline, lang)} lead={pick(content.contact.sub, lang)}
          aside={p.openToWork ? <span className="chip yellow">● {pick(content.contact.availability, lang)}</span> : undefined} />
        <div className="split">
          <div className="stack gap-12">
            {items.map(i => (
              <a key={i.label} href={i.href} target={i.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="card hoverable row gap-16" style={{ textDecoration: 'none' }}>
                <span className="icon-btn dark"><Icon name={i.icon} /></span>
                <div className="grow"><div className="xs muted">{i.label}</div><div style={{ wordBreak: 'break-word' }}>{i.value}</div></div>
                <Icon name="arrow" />
              </a>
            ))}
          </div>
          <form className="card stack gap-16" noValidate onSubmit={e => { e.preventDefault(); if (valid) window.location.href = waHref; else setTried(true); }}>
            <h2 className="h-card">{t('Kirim pesan', 'Send a message')}</h2>
            <label className="field"><span>{t('Nama kamu', 'Your name')}</span><input className="input" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required /></label>
            <div className="field"><span>{t('Topik', 'Topic')}</span>
              <div className="row wrap gap-8">{topics.map(tp => <button type="button" key={tp} className={`pill sm ${topic === tp ? 'dark' : ''}`} onClick={() => setTopic(tp === topic ? '' : tp)}>{tp}</button>)}</div>
            </div>
            <label className="field"><span>{t('Pesan', 'Message')}</span><textarea className="input" rows={5} value={msg} onChange={e => setMsg(e.target.value)} required /></label>
            <div className="row wrap gap-8">
              <a className="pill dark lg" href={waHref} target="_blank" rel="noopener noreferrer" onClick={guard}><Icon name="chat" />{t('Kirim via WhatsApp', 'Send via WhatsApp')}</a>
              <a className="pill lg" href={mailHref} onClick={guard}><Icon name="mail" />{t('Kirim via Email', 'Send via Email')}</a>
            </div>
            {tried && !valid && <p className="xs" role="alert" style={{ color: '#d9480f' }}>{t('Isi nama dan pesan dulu, ya.', 'Please fill in your name and message first.')}</p>}
            <p className="xs faint">{t('Pesan dibuka di aplikasi WhatsApp/email kamu, tidak ada data yang disimpan di situs ini.', 'Your message opens in your WhatsApp/email app, nothing is stored on this site.')}</p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
