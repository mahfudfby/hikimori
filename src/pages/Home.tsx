// src/pages/Home.tsx — Mobile-First, All Content from localStorage
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Footer from '../components/Footer';

/* ─── localStorage keys (shared with AdminPanel) ─── */
const LS_HOME     = 'hk_home_data';
const LS_ABOUT    = 'hk_home_about_data';
const LS_SKILLS   = 'hk_skills_data';
const LS_EXP      = 'hk_experience_data';
const LS_CONTACT  = 'hk_contact_data';

/* ─── Types ─── */
interface HomeData { heroTitle: string; heroSubtitle: string; heroTagline: string; heroCtaSecondary: string; heroCtaSecondaryLink: string; heroCta: string; heroCtaLink: string; heroPhotoUrl: string; heroTagRight: string; }
interface AboutData { name: string; location: string; bio1: string; bio2: string; photoUrl: string; }
interface SkillItem { id: string; number: string; title: string; desc: string; }
interface ExpItem   { id: string; position: string; company: string; period: string; icon: string; tags: string; }
interface ContactData { email: string; location: string; website: string; instagram: string; linkedin: string; twitter: string; }

/* ─── Defaults ─── */
const D_HOME: HomeData   = { heroTitle:'Shaping tomorrow', heroSubtitle:'with vision and action.', heroTagline:'We back visionaries and craft ventures that define what comes next.', heroCtaSecondary:'Start a Chat', heroCtaSecondaryLink:'#contact', heroCta:'Explore Now', heroCtaLink:'/portofolio', heroPhotoUrl:'', heroTagRight:'Investing. Building. Advisory.' };
const D_ABOUT: AboutData = { name:'Mahfudfebry', location:'Nganjuk, Indonesia', bio1:'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.', bio2:'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.', photoUrl:'' };
const D_SKILLS: SkillItem[] = [
  { id:'1', number:'01', title:'Branding & Identity Design', desc:"Crafting memorable logos and visual systems that reflect a brand's essence and personality." },
  { id:'2', number:'02', title:'Creativity & Problem-Solving', desc:'Thinking outside the box while solving design challenges with strategic insight.' },
  { id:'3', number:'03', title:'Concept Development', desc:'Skilled in brainstorming and translating abstract ideas into compelling visual narratives.' },
  { id:'4', number:'04', title:'Proper Time Management', desc:'Capable of handling multiple projects and meeting tight deadlines consistently.' },
];
const D_EXP: ExpItem[] = [
  { id:'1', position:'HR / General Affairs', company:'UD Duta Pangan', period:'2020–2023', icon:'👥', tags:'Vendor Management,Stock Monitoring,Facility Maintenance,Workload Analysis' },
  { id:'2', position:'Staff Administrasi', company:'UD Duta Pangan', period:'2020–2023', icon:'📋', tags:'Document Processing,Administrative Support,Filing & Archiving,Reporting' },
  { id:'3', position:'IT Support', company:'UD Duta Pangan', period:'2020–2023', icon:'💻', tags:'Hardware Troubleshooting,Software Installation,Network Setup,User Training' },
];
const D_CONTACT: ContactData = { email:'mahfudfebry@hikimori.web.id', location:'Nganjuk, Indonesia', website:'hikimori.web.id', instagram:'', linkedin:'', twitter:'' };

const FALLBACK_PHOTO = 'https://res.cloudinary.com/dl4pyan8v/image/upload/WhatsApp_Image_2026-06-16_at_03.45.15_axvhg3';
const HERO_VIDEO    = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';
const CONTACT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES_LIST = ['Website','Mobile App','Web App','E-Commerce','Visual Identity','3D & Motion','Digital Marketing','Growth & Consulting','Other'];

const ls = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

/* ─── Liquid Glass style ─── */
const LG: React.CSSProperties = { background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', WebkitBackdropFilter:'blur(4px)', boxShadow:'inset 0 1px 1px rgba(255,255,255,0.1)', position:'relative' };

/* ─── FadeIn ─── */
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; duration?: number; style?: React.CSSProperties }> = ({ children, delay=0, duration=1000, style={} }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transition: `opacity ${duration}ms ease`, ...style }}>{children}</div>;
};

/* ─── AnimatedHeading ─── */
const AnimatedHeading: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style={} }) => {
  const [a, setA] = useState(false);
  useEffect(() => { const t = setTimeout(() => setA(true), 200); return () => clearTimeout(t); }, []);
  const lines = text.split('\n');
  return (
    <h1 style={{ margin: 0, ...style }}>
      {lines.map((line, li) => {
        const prev = lines.slice(0, li).reduce((acc, l) => acc + l.length, 0);
        return (
          <span key={li} style={{ display: 'block' }}>
            {line.split('').map((char, ci) => {
              const delay = (200 + (prev + ci) * 30) / 1000;
              return <span key={ci} style={{ display:'inline-block', opacity: a ? 1 : 0, transform: a ? 'translateX(0)' : 'translateX(-18px)', transition: `opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s` }}>{char === ' ' ? '\u00A0' : char}</span>;
            })}
          </span>
        );
      })}
    </h1>
  );
};

/* ─── Inline SVG Icons ─── */
const IcoTwitter = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IcoIG     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const IcoLI     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const SBtn: React.FC<{ icon: React.ReactNode; bg: string; color: string }> = ({ icon, bg, color }) => (
  <button type="button" style={{ width:32, height:32, borderRadius:12, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', background:bg, color, flexShrink:0 }}>{icon}</button>
);

/* ═══════════════ SHOOTING STARS ═══════════════ */
const Stars: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const stars = Array.from({ length: 120 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.2 + 0.3, a: Math.random(), da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1) }));
    const shoots: any[] = [];
    let next = 0, t = 0;
    const spawn = () => { const a = (Math.random() * 20 + 20) * Math.PI / 180, sp = Math.random() * 6 + 8, len = Math.random() * 120 + 80, life = len / sp; shoots.push({ x: Math.random() * c.width * 0.8, y: Math.random() * c.height * 0.4, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, len, life, maxLife: life }); };
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => { s.a = Math.max(0.1, Math.min(1, s.a + s.da)); if (s.a <= 0.1 || s.a >= 1) s.da *= -1; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill(); });
      t++; if (t >= next) { spawn(); next = t + Math.floor(Math.random() * 180 + 80); }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]; const prog = 1 - s.life / s.maxLife; const alpha = s.life < 20 ? s.life / 20 : 1; const ang = Math.atan2(s.vy, s.vx); const tx = s.x - Math.cos(ang) * s.len * Math.min(prog * 2, 1); const ty = s.y - Math.sin(ang) * s.len * Math.min(prog * 2, 1);
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y); g.addColorStop(0, 'rgba(245,166,35,0)'); g.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.4})`); g.addColorStop(1, `rgba(255,255,255,${alpha})`);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.life--; if (s.life <= 0) shoots.splice(i, 1);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }} />;
};


/* ═══════════════ MARQUEE TICKER ═══════════════ */
const Marquee: React.FC<{ contact: ContactData }> = ({ contact }) => {
  const items = [
    contact.instagram && { icon: '📸', label: 'Instagram', value: '@' + contact.instagram, href: 'https://instagram.com/' + contact.instagram },
    contact.linkedin  && { icon: '💼', label: 'LinkedIn',  value: contact.linkedin,          href: 'https://linkedin.com/in/' + contact.linkedin },
    contact.twitter   && { icon: '🐦', label: 'Twitter',   value: '@' + contact.twitter,     href: 'https://twitter.com/' + contact.twitter },
    contact.email     && { icon: '📧', label: 'Email',     value: contact.email,              href: 'mailto:' + contact.email },
    contact.website   && { icon: '🌐', label: 'Website',   value: contact.website,            href: 'https://' + contact.website },
    contact.location  && { icon: '📍', label: 'Location',  value: contact.location,           href: null },
    /* Always-on filler items so ticker is never empty */
    { icon: '✦', label: 'Hikimori', value: 'Creative Portfolio', href: null },
    { icon: '✦', label: 'Open to Work', value: 'Nganjuk, Indonesia', href: null },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string | null }[];

  // Duplicate for seamless loop
  const doubled = [...items, ...items, ...items];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: 'var(--amber)',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      padding: '10px 0',
      position: 'relative',
      zIndex: 10,
    }}>
      <motion.div
        style={{ display: 'flex', gap: 0, width: 'max-content' }}
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 28px', flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>{item.icon}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
            <span style={{ fontSize: '0.62rem', color: 'rgba(0,0,0,0.4)' }}>—</span>
            {item.href ? (
              <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(0,0,0,0.75)', textDecoration: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}>
                {item.value}
              </a>
            ) : (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(0,0,0,0.75)' }}>{item.value}</span>
            )}
            <span style={{ color: 'rgba(0,0,0,0.25)', fontSize: '1rem', marginLeft: 8 }}>✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ═══════════════ CONTACT SECTION (dipertahankan) ═══════════════ */
const ContactSection: React.FC = () => {
  const [sel, setSel] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const contact: ContactData = ls(LS_CONTACT, D_CONTACT);

  const toggle = (s: string) => setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSending(true); await new Promise(r => setTimeout(r, 1000)); setSending(false); setSent(true); };
  const inp: React.CSSProperties = { flex:1, minWidth:0, fontSize:'0.875rem', padding:'10px 12px', borderRadius:12, border:'1px solid #e5e7eb', background:'transparent', outline:'none', fontFamily:'var(--font-body)', color:'#111', boxSizing:'border-box' };

  return (
    <section style={{ width:'100%', padding:'12px', background:'#fff', boxSizing:'border-box' }}>
      <div style={{ position:'relative', borderRadius:24, overflow:'hidden', minHeight:'calc(100vh - 24px)', display:'flex', flexDirection:'column' }}>
        <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}>
          <source src={CONTACT_VIDEO} type="video/mp4" />
        </video>
        <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', padding:'clamp(16px,4vw,24px)', gap:20, minHeight:'calc(100vh - 24px)', boxSizing:'border-box' }}>
          {/* Navbar in contact */}
          <div style={{ background:'rgba(255,255,255,0.6)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,0.08)', padding:'8px 12px', display:'flex', alignItems:'center', gap:12, flexWrap:'nowrap', overflow:'hidden' }}>
            <svg viewBox="0 0 256 256" width={28} height={28} style={{ flexShrink:0 }}><path fill="#000" d="M 256 256 L 128 256 L 0 128 L 128 128 Z" /><path fill="#000" d="M 256 128 L 128 128 L 0 0 L 128 0 Z" /></svg>
            <div id="cnav" style={{ display:'none', gap:20, flex:1, overflow:'hidden' }}>
              {['Our story','Expertise','Our work','Journal'].map(l => <a key={l} href="#" style={{ color:'#1f2937', fontSize:'0.82rem', fontWeight:500, textDecoration:'none', whiteSpace:'nowrap' }}>{l}</a>)}
            </div>
            <button style={{ background:'#000', color:'#fff', fontSize:'0.82rem', fontWeight:500, padding:'7px 16px', borderRadius:10, border:'none', cursor:'pointer', marginLeft:'auto', flexShrink:0, whiteSpace:'nowrap' }}>Start a project</button>
          </div>
          {/* Spacer */}
          <div style={{ flex:1, minHeight:24 }} />
          {/* Bottom row */}
          <div id="cbot" style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <p style={{ color:'#fff', fontSize:'clamp(1.6rem,5vw,3rem)', fontWeight:500, lineHeight:1.2, textShadow:'0 2px 12px rgba(0,0,0,0.3)', margin:0 }}>
              We craft bold ideas<br />and ship them as{' '}
              <span style={{ fontFamily:"'Georgia',serif", fontStyle:'italic', fontWeight:400 }}>products</span>
            </p>
            {/* Form card */}
            <div style={{ width:'100%', maxWidth:480 }} id="cform">
              <div style={{ background:'#fff', borderRadius:24, boxShadow:'0 25px 50px rgba(0,0,0,0.25)', padding:'clamp(16px,4vw,24px)', display:'flex', flexDirection:'column', gap:14 }}>
                {sent ? (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 0', gap:12 }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>✓</div>
                    <p style={{ fontSize:'1rem', fontWeight:600, color:'#111', margin:0 }}>You're all set!</p>
                    <p style={{ fontSize:'0.875rem', color:'#6b7280', margin:0 }}>Expect a reply within 24 hours.</p>
                  </div>
                ) : (<>
                  <h2 style={{ fontSize:'1.25rem', fontWeight:600, color:'#000', letterSpacing:'-0.02em', margin:0 }}>Say hello! 👋</h2>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, background:'#f9fafb', borderRadius:14, padding:'10px 14px', flexWrap:'wrap', rowGap:8 }}>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:'0.72rem', color:'#9ca3af', margin:'0 0 2px 0' }}>Drop us a line</p>
                      <a href={`mailto:${contact.email}`} style={{ color:'#2563eb', fontWeight:600, fontSize:'0.82rem', textDecoration:'none', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{contact.email}</a>
                    </div>
                    <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                      <SBtn icon={<IcoTwitter />} bg="#f3f4f6" color="#1f2937" />
                      <SBtn icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>} bg="#fce7f3" color="#ec4899" />
                      <SBtn icon={<IcoIG />} bg="#ffedd5" color="#fb923c" />
                      <SBtn icon={<IcoLI />} bg="#dbeafe" color="#2563eb" />
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ flex:1, height:1, background:'#e5e7eb' }} />
                    <span style={{ fontSize:'0.82rem', color:'#9ca3af', fontWeight:500 }}>OR</span>
                    <div style={{ flex:1, height:1, background:'#e5e7eb' }} />
                  </div>
                  <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <label style={{ fontSize:'0.82rem', fontWeight:500, color:'#000' }}>Tell us about your vision</label>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }} id="cinputs">
                      <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={{ ...inp, width:'100%' }} />
                      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inp, width:'100%' }} />
                    </div>
                    <textarea rows={3} placeholder="What are you looking to build or improve..." value={msg} onChange={e => setMsg(e.target.value)} style={{ ...inp, resize:'none', width:'100%' }} />
                    <div>
                      <p style={{ fontSize:'0.82rem', fontWeight:500, color:'#000', marginBottom:6 }}>I need help with...</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {SERVICES_LIST.map(s => <button key={s} type="button" onClick={() => toggle(s)} style={{ fontSize:'0.72rem', fontWeight:500, padding:'6px 10px', borderRadius:7, border: sel.includes(s) ? '1px solid #000' : '1px solid #e5e7eb', background: sel.includes(s) ? '#f3f4f6' : '#fff', color: sel.includes(s) ? '#000' : '#374151', cursor:'pointer' }}>{s}</button>)}
                      </div>
                    </div>
                    <button type="submit" disabled={sending} style={{ width:'100%', background:'#000', color:'#fff', fontSize:'0.875rem', fontWeight:600, padding:'11px 0', borderRadius:14, border:'none', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.6 : 1 }}>
                      {sending ? 'Sending...' : 'Send my message'}
                    </button>
                  </form>
                </>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width:767px) { #cnav { display:none !important; } }
        @media (min-width:768px) { #cnav { display:flex !important; } #cinputs { flex-direction:row !important; } }
        @media (min-width:1024px) { #cbot { flex-direction:row !important; align-items:flex-end !important; justify-content:space-between !important; } #cform { width:min(480px,45%) !important; } }
      `}</style>
    </section>
  );
};

/* ═══════════════ HOME PAGE ═══════════════ */
const Home: React.FC = () => {
  const [hero,    setHero]    = useState<HomeData>(() => ls(LS_HOME, D_HOME));
  const [about,   setAbout]   = useState<AboutData>(() => ls(LS_ABOUT, D_ABOUT));
  const [skills,  setSkills]  = useState<SkillItem[]>(() => ls(LS_SKILLS, D_SKILLS));
  const [exps,    setExps]    = useState<ExpItem[]>(() => ls(LS_EXP, D_EXP));
  const [contact, setContact] = useState<ContactData>(() => ls(LS_CONTACT, D_CONTACT));

  useEffect(() => {
    // Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_HOME    && e.newValue) try { setHero(JSON.parse(e.newValue));    } catch {}
      if (e.key === LS_ABOUT   && e.newValue) try { setAbout(JSON.parse(e.newValue));   } catch {}
      if (e.key === LS_SKILLS  && e.newValue) try { setSkills(JSON.parse(e.newValue));  } catch {}
      if (e.key === LS_EXP     && e.newValue) try { setExps(JSON.parse(e.newValue));    } catch {}
      if (e.key === LS_CONTACT && e.newValue) try { setContact(JSON.parse(e.newValue)); } catch {}
    };
    // Same-tab sync (from AdminPanel save)
    const onCustom = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      try {
        if (key === LS_HOME)    setHero(JSON.parse(value));
        if (key === LS_ABOUT)   setAbout(JSON.parse(value));
        if (key === LS_SKILLS)  setSkills(JSON.parse(value));
        if (key === LS_EXP)     setExps(JSON.parse(value));
        if (key === LS_CONTACT) setContact(JSON.parse(value));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('hk-update', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('hk-update', onCustom);
    };
  }, []);

  const photo = about.photoUrl || FALLBACK_PHOTO;
  const heroText = `${hero.heroTitle}\n${hero.heroSubtitle}`;

  return (
    <div style={{ background:'var(--black)', minHeight:'100vh', overflowX:'hidden' }}>

      {/* ══ HERO (dipertahankan) ══ */}
      <section style={{ position:'relative', width:'100%', height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', background:'#000', color:'#fff' }}>
        <video autoPlay loop muted playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        {/* Stars layer */}
        <Stars />
        {/* Content */}
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%', padding:'70px clamp(1rem,5vw,4rem) 0 clamp(1rem,5vw,4rem)' }}>
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', paddingBottom:'clamp(2rem,5vw,4rem)' }}>
            <div id="hgrid" style={{ display:'grid', gridTemplateColumns:'1fr', alignItems:'flex-end', gap:'1.5rem' }}>
              {/* Left */}
              <div>
                <AnimatedHeading text={heroText}
                  style={{ fontSize:'clamp(2rem,7vw,4.5rem)', fontWeight:400, marginBottom:'0.8rem', letterSpacing:'-0.04em', lineHeight:1.1, color:'#fff', fontFamily:'var(--font-body)', wordBreak:'break-word' }} />
                <FadeIn delay={800} duration={1000}>
                  <p style={{ fontSize:'clamp(0.9rem,2vw,1.125rem)', color:'#d1d5db', marginBottom:'1.25rem', fontWeight:400, lineHeight:1.6, maxWidth:'520px' }}>{hero.heroTagline}</p>
                </FadeIn>
                <FadeIn delay={1200} duration={1000}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
                    <a href={hero.heroCtaSecondaryLink || '#contact'} style={{ textDecoration:'none' }}><button style={{ background:'#fff', color:'#000', border:'none', borderRadius:8, padding:'10px 24px', fontWeight:500, fontSize:'0.9rem', cursor:'pointer', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>{hero.heroCtaSecondary || 'Start a Chat'}</button></a>
                    <Link to={hero.heroCtaLink || '/portofolio'} style={{ textDecoration:'none' }}>
                      <button style={{ ...LG, border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:8, padding:'10px 24px', fontWeight:500, fontSize:'0.9rem', cursor:'pointer', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>{hero.heroCta}</button>
                    </Link>
                  </div>
                </FadeIn>
              </div>
              {/* Right — tag */}
              <div id="htag" style={{ display:'flex', alignItems:'flex-end', justifyContent:'flex-start' }}>
                <FadeIn delay={1400} duration={1000}>
                  <div style={{ ...LG, border:'1px solid rgba(255,255,255,0.2)', borderRadius:12, padding:'10px 20px', display:'inline-block', maxWidth:'100%' }}>
                    <span style={{ fontSize:'clamp(1rem,2.5vw,1.5rem)', fontWeight:300, color:'#fff', fontFamily:'var(--font-body)', wordBreak:'break-word' }}>{hero.heroTagRight || 'Investing. Building. Advisory.'}</span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE TICKER ══ */}
      <Marquee contact={contact} />

      {/* ══ ABOUT ══ */}
      <section style={{ padding:'clamp(3rem,8vw,6rem) clamp(1rem,5vw,2rem)', background:'var(--black-2)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div id="about-row" style={{ display:'flex', flexDirection:'column', gap:'2.5rem', alignItems:'center' }}>
            {/* Photo */}
            <AnimatedSection direction="up">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} style={{ width:'100%', maxWidth:340, borderRadius:'var(--radius)', overflow:'hidden', position:'relative', aspectRatio:'4/5', flexShrink:0, margin:'0 auto', cursor: 'default' }}>
                <img src={photo} alt={about.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(10,10,10,0.7) 0%,transparent 55%)' }} />
                <div style={{ position:'absolute', bottom:'1rem', left:'1rem', right:'1rem' }}>
                  <div style={{ background:'rgba(245,166,35,0.9)', borderRadius:10, padding:'0.5rem 1rem', color:'var(--black)', fontWeight:700, fontSize:'0.82rem', display:'inline-block', maxWidth:'100%', wordBreak:'break-word' }}>📍 {about.location}</div>
                </div>
              </motion.div>
            </AnimatedSection>
            {/* Text */}
            <AnimatedSection direction="up">
              <div style={{ maxWidth:560 }}>
                <span style={{ fontFamily:'var(--font-body)', color:'var(--amber)', fontSize:'0.78rem', letterSpacing:'3px', textTransform:'uppercase', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>About Me</span>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,8vw,4.5rem)', lineHeight:0.9, marginBottom:'0.2rem' }}>ABOUT ME !</h2>
                <span style={{ fontFamily:'var(--font-script)', color:'var(--amber)', fontSize:'clamp(1.4rem,5vw,2rem)', fontWeight:700, display:'block', marginBottom:'1.2rem' }}>{about.name}</span>
                <p style={{ color:'var(--white-dim)', lineHeight:1.8, marginBottom:'1rem', fontSize:'clamp(0.88rem,2vw,1rem)' }}>{about.bio1}</p>
                <p style={{ color:'var(--white-dim)', lineHeight:1.8, fontSize:'clamp(0.88rem,2vw,1rem)' }}>{about.bio2}</p>
                <div style={{ marginTop:'1.5rem' }}>
                  <Link to="/about" style={{ display:'inline-block', background:'transparent', color:'var(--amber)', textDecoration:'none', borderRadius:50, padding:'10px 24px', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.88rem', border:'1px solid rgba(245,166,35,0.4)' }}>Selengkapnya →</Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section style={{ padding:'clamp(3rem,8vw,6rem) clamp(1rem,5vw,2rem)', background:'var(--black)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,8vw,5.5rem)', lineHeight:0.9, wordBreak:'break-word' }}>
                SKILLS &amp;{' '}
                <span style={{ position:'relative', display:'inline-block' }}>
                  TOOLS
                  <span style={{ fontFamily:'var(--font-script)', color:'var(--amber)', fontSize:'45%', position:'absolute', bottom:'-0.4rem', right:'-1.5rem', whiteSpace:'nowrap' }}>Signature</span>
                </span>
              </h2>
            </div>
          </AnimatedSection>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap:'1rem' }}>
            {skills.map((sk, i) => (
              <AnimatedSection key={sk.id} direction="up" delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(245,166,35,0.18)', borderColor: 'rgba(245,166,35,0.4)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ background:'var(--black-2)', border:'1px solid rgba(245,166,35,0.12)', borderRadius:'var(--radius)', padding:'1.5rem', position:'relative', overflow:'hidden', height:'100%', cursor: 'default' }}>
                  <div style={{ position:'absolute', top:4, right:12, fontFamily:'var(--font-display)', fontSize:'4.5rem', color:'rgba(245,166,35,0.06)', lineHeight:1, userSelect:'none' }}>{sk.number}</div>
                  <div style={{ color:'var(--amber)', fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:'0.5rem' }}>{sk.number}</div>
                  <h3 style={{ fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.85rem', color:'var(--amber)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.6rem' }}>{sk.title}</h3>
                  <p style={{ color:'var(--white-dim)', fontSize:'0.85rem', lineHeight:1.6 }}>{sk.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section style={{ padding:'clamp(3rem,8vw,6rem) clamp(1rem,5vw,2rem)', background:'var(--black-2)' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <AnimatedSection direction="up">
            <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,8vw,5rem)', lineHeight:0.9, wordBreak:'break-word' }}>
                PENGALAMAN{' '}
                <span style={{ fontFamily:'var(--font-script)', color:'var(--amber)', fontSize:'45%' }}>Kerja</span>
              </h2>
              <p style={{ color:'var(--white-dim)', marginTop:'0.8rem', fontSize:'0.9rem' }}>Pengalaman Profesional &amp; Riwayat Kerja</p>
            </div>
          </AnimatedSection>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            {exps.map((exp, i) => (
              <AnimatedSection key={exp.id} direction="up" delay={i * 0.1}>
                <motion.div whileHover={{ x: 6, borderColor: 'rgba(245,166,35,0.4)', backgroundColor: '#1d1d1d' }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} style={{ background:'var(--black-3)', border:'1px solid rgba(245,166,35,0.1)', borderRadius:'var(--radius)', padding:'1.4rem clamp(1rem,4vw,2rem)', display:'flex', alignItems:'flex-start', gap:'1rem', position:'relative', overflow:'hidden', cursor: 'default' }}>
                  <div style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:4, height:'60%', background:'linear-gradient(to bottom,transparent,var(--amber),transparent)', borderRadius:'0 4px 4px 0' }} />
                  {/* Icon */}
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(245,166,35,0.1)', border:'2px solid rgba(245,166,35,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>{exp.icon}</div>
                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem', marginBottom:'0.2rem', flexWrap:'wrap' }}>
                      <h3 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1rem,3vw,1.3rem)', lineHeight:1.2 }}>{exp.position}</h3>
                      {exp.period && <span style={{ background:'rgba(245,166,35,0.1)', color:'var(--amber)', borderRadius:6, padding:'3px 10px', fontSize:'0.72rem', fontWeight:600, flexShrink:0, whiteSpace:'nowrap' }}>{exp.period}</span>}
                    </div>
                    {exp.company && <div style={{ fontFamily:'var(--font-script)', color:'var(--amber)', fontSize:'1rem', marginBottom:'0.6rem' }}>{exp.company}</div>}
                    {exp.tags && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                        {exp.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                          <span key={tag} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--white-dim)', borderRadius:5, padding:'3px 10px', fontSize:'0.72rem', fontWeight:500, wordBreak:'break-word' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding:'clamp(3rem,8vw,6rem) clamp(1rem,5vw,2rem)', textAlign:'center' }}>
        <AnimatedSection direction="scale">
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,8vw,5rem)', marginBottom:'0.8rem', wordBreak:'break-word' }}>SIAP BERKOLABORASI?</h2>
          <p style={{ color:'var(--white-dim)', marginBottom:'2rem', fontSize:'clamp(0.88rem,2vw,1rem)', maxWidth:480, margin:'0 auto 2rem' }}>Hubungi saya dan kita mulai wujudkan ide Anda bersama.</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: -8, borderRadius: 50, border: '2px solid var(--amber)', pointerEvents: 'none' }} />
          <motion.a href={`mailto:${contact.email}`}
            whileHover={{ scale:1.05, boxShadow:'0 10px 40px rgba(245,166,35,0.4)' }} whileTap={{ scale:0.97 }}
            style={{ display:'inline-block', background:'var(--amber)', color:'var(--black)', textDecoration:'none', borderRadius:50, padding:'14px 40px', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.95rem', letterSpacing:'0.5px', position: 'relative' }}>
            Mulai Sekarang →
          </motion.a>
          </div>
        </AnimatedSection>
      </section>

      {/* ══ CONTACT SECTION (dipertahankan) ══ */}
      <ContactSection />

      {/* ══ FOOTER ══ */}
      <Footer />

      <style>{`
        @media (min-width:768px) {
          #about-row { flex-direction:row !important; align-items:flex-start !important; }
          #about-row > * { width:50%; }
        }
        @media (min-width:1024px) {
          #hgrid { grid-template-columns:1fr 1fr !important; }
          #htag  { justify-content:flex-end !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
