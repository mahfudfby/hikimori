// src/components/Footer.tsx — reads from localStorage (editable via AdminPanel)
import React from 'react';
import { Link } from 'react-router-dom';

const LS_CONTACT = 'hk_contact_data';
interface ContactData { email:string; location:string; website:string; instagram:string; linkedin:string; twitter:string; }
const D: ContactData = { email:'Mahfudfebrys@gmail.com', location:'Nganjuk, Indonesia', website:'hikimori.web.id', instagram:'', linkedin:'', twitter:'' };

const Footer: React.FC = () => {
  let contact: ContactData = D;
  try { contact = JSON.parse(localStorage.getItem(LS_CONTACT) || 'null') ?? D; } catch {}

  const socials = [
    contact.instagram && { icon:'📸', label:'Instagram', href:`https://instagram.com/${contact.instagram}` },
    contact.linkedin  && { icon:'💼', label:'LinkedIn',  href:`https://linkedin.com/in/${contact.linkedin}` },
    contact.twitter   && { icon:'🐦', label:'Twitter',   href:`https://twitter.com/${contact.twitter}` },
  ].filter(Boolean) as { icon:string; label:string; href:string }[];

  const links = [
    { label:'Home', to:'/' }, { label:'About', to:'/about' },
    { label:'Services', to:'/services' }, { label:'Portofolio', to:'/portofolio' },
  ];

  return (
    <footer style={{ background:'var(--black-2)', borderTop:'1px solid rgba(245,166,35,0.15)', padding:'clamp(2rem,5vw,3rem) clamp(1rem,5vw,2rem) 1.5rem' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div id="footer-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:'2rem', marginBottom:'2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', color:'var(--amber)', marginBottom:'0.6rem', letterSpacing:'3px' }}>MFD-FBY's</div>
            <p style={{ color:'var(--white-dim)', fontSize:'0.88rem', lineHeight:1.6 }}>Hikimori Project — Creative Portfolio<br />{contact.location}</p>
            {socials.length > 0 && (
              <div style={{ display:'flex', gap:'0.6rem', marginTop:'1rem', flexWrap:'wrap' }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.2)', color:'var(--amber)', borderRadius:8, padding:'6px 12px', textDecoration:'none', fontSize:'0.78rem', fontWeight:600 }}>{s.icon} {s.label}</a>
                ))}
              </div>
            )}
          </div>
          {/* Navigation */}
          <div>
            <h4 style={{ color:'var(--amber)', marginBottom:'0.8rem', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.9rem' }}>Navigation</h4>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem 1.5rem' }}>
              {links.map(l => (
                <Link key={l.to} to={l.to} style={{ color:'var(--white-dim)', textDecoration:'none', fontSize:'0.88rem' }}
                  onMouseEnter={e => (e.currentTarget.style.color='var(--amber)')}
                  onMouseLeave={e => (e.currentTarget.style.color='var(--white-dim)')}>{l.label}</Link>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 style={{ color:'var(--amber)', marginBottom:'0.8rem', fontFamily:'var(--font-body)', fontWeight:600, fontSize:'0.9rem' }}>Kontak</h4>
            <div style={{ color:'var(--white-dim)', fontSize:'0.88rem', lineHeight:2 }}>
              {contact.location && <div>📍 {contact.location}</div>}
              {contact.website  && <div>🌐 {contact.website}</div>}
              {contact.email    && <div>📧 <a href={`mailto:${contact.email}`} style={{ color:'var(--amber)', textDecoration:'none' }}>{contact.email}</a></div>}
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ paddingTop:'1.2rem', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.8rem' }}>
          <p style={{ color:'var(--white-faint)', fontSize:'0.78rem' }}>© {new Date().getFullYear()} Mahfudfebry — Hikimori Project. All rights reserved.</p>
          <Link to="/admin/login" style={{ color:'rgba(245,166,35,0.3)', fontSize:'0.72rem', textDecoration:'none' }}>Admin</Link>
        </div>
      </div>
      <style>{`
        @media (min-width:640px) { #footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (min-width:1024px) { #footer-grid { grid-template-columns: 2fr 1fr 1.5fr !important; } }
      `}</style>
    </footer>
  );
};

export default Footer;
