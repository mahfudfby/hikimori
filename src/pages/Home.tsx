// src/pages/Home.tsx — Ghibli Studio Theme (sections below hero → ContactSection)
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

/* ─── localStorage keys ─── */
const LS_HOME    = 'hk_home_data';
const LS_ABOUT   = 'hk_home_about_data';
const LS_SKILLS  = 'hk_skills_data';
const LS_EXP     = 'hk_experience_data';
const LS_CONTACT = 'hk_contact_data';
const LS_CERT    = 'hk_cert_data';

interface HomeData    { heroTitle:string; heroSubtitle:string; heroTagline:string; heroCtaSecondary:string; heroCtaSecondaryLink:string; heroCta:string; heroCtaLink:string; heroPhotoUrl:string; heroTagRight:string; }
interface AboutData   { name:string; location:string; bio1:string; bio2:string; photoUrl:string; }
interface SkillItem   { id:string; number:string; title:string; desc:string; }
interface ExpItem     { id:string; position:string; company:string; period:string; icon:string; tags:string; }
interface ContactData { email:string; location:string; website:string; instagram:string; linkedin:string; twitter:string; }
interface CertItem    { id:string; name:string; year:string; issuer:string; subtitle:string; imageUrl:string; }

const D_HOME:    HomeData    = { heroTitle:'Shaping tomorrow', heroSubtitle:'with vision and action.', heroTagline:'We back visionaries and craft ventures that define what comes next.', heroCtaSecondary:'Start a Chat', heroCtaSecondaryLink:'#contact', heroCta:'Explore Now', heroCtaLink:'/portofolio', heroPhotoUrl:'', heroTagRight:'Investing. Building. Advisory.' };
const D_ABOUT:   AboutData   = { name:'Mahfudfebry', location:'Nganjuk, Indonesia', bio1:'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.', bio2:'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.', photoUrl:'' };
const D_SKILLS:  SkillItem[] = [
  { id:'1', number:'01', title:'Branding & Identity Design', desc:"Crafting memorable logos and visual systems that reflect a brand's essence." },
  { id:'2', number:'02', title:'Creativity & Problem-Solving', desc:'Thinking outside the box while solving design challenges with strategic insight.' },
  { id:'3', number:'03', title:'Concept Development', desc:'Skilled in brainstorming and translating abstract ideas into visual narratives.' },
  { id:'4', number:'04', title:'Proper Time Management', desc:'Capable of handling multiple projects and meeting tight deadlines.' },
];
const D_EXP: ExpItem[] = [
  { id:'1', position:'HR / General Affairs', company:'UD Duta Pangan', period:'2020–2023', icon:'👥', tags:'Vendor Management,Stock Monitoring,Facility Maintenance,Workload Analysis' },
  { id:'2', position:'Staff Administrasi',   company:'UD Duta Pangan', period:'2020–2023', icon:'📋', tags:'Document Processing,Administrative Support,Filing & Archiving,Reporting' },
  { id:'3', position:'IT Support',           company:'UD Duta Pangan', period:'2020–2023', icon:'💻', tags:'Hardware Troubleshooting,Software Installation,Network Setup,User Training' },
];
const D_CONTACT: ContactData = { email:'mahfudfebry@hikimori.web.id', location:'Nganjuk, Indonesia', website:'hikimori.web.id', instagram:'', linkedin:'', twitter:'' };
const D_CERT: CertItem[] = [
  { id:'1', name:'Google Digital Marketing', year:'2023', issuer:'Google', subtitle:'Fundamentals of Digital Marketing', imageUrl:'' },
  { id:'2', name:'HR Management Professional', year:'2022', issuer:'BNSP Indonesia', subtitle:'Sertifikasi Kompetensi SDM', imageUrl:'' },
];

const FALLBACK_PHOTO = 'https://res.cloudinary.com/dl4pyan8v/image/upload/WhatsApp_Image_2026-06-16_at_03.45.15_axvhg3';
const HERO_VIDEO    = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';
const CONTACT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES_LIST = ['Website','Mobile App','Web App','E-Commerce','Visual Identity','3D & Motion','Digital Marketing','Growth & Consulting','Other'];

const ls = <T,>(key:string, fb:T):T => { try { return JSON.parse(localStorage.getItem(key)||'null')??fb; } catch { return fb; } };

/* ═══════════════════════════════════════════════
   GHIBLI PALETTE
═══════════════════════════════════════════════ */
const G = {
  sky1:'#0a1628', sky2:'#0d2240', sky3:'#112a4e',
  forest1:'#0a1f0a', forest2:'#0f2b12', forest3:'#143318',
  dusk1:'#1a0f2e', dusk2:'#2d1b4e', dusk3:'#3d2060',
  cream:'#f5e6c8', amber:'#F5A623', amberD:'#d4891f',
  jade:'#4ecdc4', teal:'#2ec4b6', mint:'#a8e6cf',
  gold:'#ffd700', warmWhite:'#fef9f0',
  spirit:'rgba(168,230,207,0.85)', spiritG:'rgba(78,205,196,0.6)',
};

/* ═══════════════ SHOOTING STARS ═══════════════ */
const Stars: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { c.width=c.offsetWidth; c.height=c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({length:120},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+0.3,a:Math.random(),da:(Math.random()*0.004+0.001)*(Math.random()<0.5?1:-1)}));
    const shoots:any[]=[]; let next=0,t=0;
    const spawn=()=>{const a=(Math.random()*20+20)*Math.PI/180,sp=Math.random()*6+8,len=Math.random()*120+80,life=len/sp;shoots.push({x:Math.random()*c.width*0.8,y:Math.random()*c.height*0.4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len,life,maxLife:life});};
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s=>{s.a=Math.max(0.1,Math.min(1,s.a+s.da));if(s.a<=0.1||s.a>=1)s.da*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.a})`;ctx.fill();});
      t++;if(t>=next){spawn();next=t+Math.floor(Math.random()*180+80);}
      for(let i=shoots.length-1;i>=0;i--){const s=shoots[i];const prog=1-s.life/s.maxLife;const alpha=s.life<20?s.life/20:1;const ang=Math.atan2(s.vy,s.vx);const tx=s.x-Math.cos(ang)*s.len*Math.min(prog*2,1);const ty=s.y-Math.sin(ang)*s.len*Math.min(prog*2,1);const g=ctx.createLinearGradient(tx,ty,s.x,s.y);g.addColorStop(0,'rgba(245,166,35,0)');g.addColorStop(0.5,`rgba(255,255,255,${alpha*0.4})`);g.addColorStop(1,`rgba(255,255,255,${alpha})`);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.stroke();s.x+=s.vx;s.y+=s.vy;s.life--;if(s.life<=0)shoots.splice(i,1);}
      raf=requestAnimationFrame(tick);
    };
    tick(); return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}/>;
};

/* ─── FadeIn ─── */
const FadeIn:React.FC<{children:React.ReactNode;delay?:number;duration?:number;style?:React.CSSProperties}>=({children,delay=0,duration=1000,style={}})=>{
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t);},[delay]);
  return <div style={{opacity:v?1:0,transition:`opacity ${duration}ms ease`,...style}}>{children}</div>;
};

/* ─── AnimatedHeading ─── */
const AnimatedHeading:React.FC<{text:string;style?:React.CSSProperties}>=({text,style={}})=>{
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t);},[]);
  const lines=text.split('\n');
  return <h1 style={{margin:0,...style}}>{lines.map((line,li)=>{const prev=lines.slice(0,li).reduce((acc,l)=>acc+l.length,0);return <span key={li} style={{display:'block'}}>{line.split('').map((char,ci)=>{const delay=(200+(prev+ci)*30)/1000;return <span key={ci} style={{display:'inline-block',opacity:a?1:0,transform:a?'translateX(0)':'translateX(-18px)',transition:`opacity 500ms ease ${delay}s, transform 500ms ease ${delay}s`}}>{char===' '?'\u00A0':char}</span>;})}</span>;})}</h1>;
};

/* ─── Liquid Glass ─── */
const LG:React.CSSProperties={background:'rgba(0,0,0,0.4)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',boxShadow:'inset 0 1px 1px rgba(255,255,255,0.1)',position:'relative'};

/* ─── SVG Icons ─── */
const IcoTwitter=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IcoIG=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const IcoLI=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const SBtn:React.FC<{icon:React.ReactNode;bg:string;color:string}>=({icon,bg,color})=>(
  <button type="button" style={{width:32,height:32,borderRadius:12,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:bg,color,flexShrink:0}}>{icon}</button>
);

/* ═══════════════════════════════════════════════
   GHIBLI ASSET COMPONENTS
═══════════════════════════════════════════════ */

/* Kodama Spirit */
const Kodama:React.FC<{x?:string;y?:string;size?:number;delay?:number}>=({x='50%',y='50%',size=32,delay=0})=>(
  <motion.div style={{position:'absolute',left:x,top:y,width:size,height:size,zIndex:2,pointerEvents:'none'}}
    animate={{y:[0,-12,0],opacity:[0.6,1,0.6],scale:[1,1.05,1]}}
    transition={{duration:3+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 40 50" width={size} height={size*1.25}>
      <ellipse cx="20" cy="20" rx="14" ry="16" fill={G.spirit} opacity="0.9"/>
      <ellipse cx="20" cy="14" rx="10" ry="11" fill={G.warmWhite} opacity="0.95"/>
      <circle cx="15" cy="13" r="2.5" fill="#2d4a2d"/>
      <circle cx="25" cy="13" r="2.5" fill="#2d4a2d"/>
      <circle cx="15.8" cy="12.2" r="0.8" fill="white"/>
      <circle cx="25.8" cy="12.2" r="0.8" fill="white"/>
      <path d="M16 18 Q20 21 24 18" stroke="#2d4a2d" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="20" cy="32" rx="8" ry="12" fill={G.spirit} opacity="0.5"/>
      <line x1="12" y1="20" x2="8" y2="25" stroke={G.spirit} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="32" y2="25" stroke={G.spirit} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </motion.div>
);

/* Firefly */
const Firefly:React.FC<{style?:React.CSSProperties;delay?:number}>=({style={},delay=0})=>(
  <motion.div style={{position:'absolute',width:5,height:5,borderRadius:'50%',background:'#a8e6cf',pointerEvents:'none',boxShadow:'0 0 8px 3px rgba(168,230,207,0.8)',...style}}
    animate={{x:[0,Math.random()*60-30,Math.random()*-40+20,0],y:[0,Math.random()*-50-10,Math.random()*-30,0],opacity:[0,1,0.7,0],scale:[0.5,1.2,0.8,0]}}
    transition={{duration:4+delay*0.5,repeat:Infinity,ease:'easeInOut',delay,repeatDelay:Math.random()*2}}/>
);

/* Ghibli Cloud */
const GhibliCloud:React.FC<{style?:React.CSSProperties;speed?:number;direction?:1|-1}>=({style={},speed=20,direction=1})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{x: direction>0 ? ['0%','120%'] : ['120%','0%']}}
    transition={{duration:speed,repeat:Infinity,ease:'linear'}}>
    <svg viewBox="0 0 140 60" width="140" height="60">
      <ellipse cx="70" cy="45" rx="55" ry="18" fill="rgba(168,230,207,0.08)"/>
      <ellipse cx="50" cy="38" rx="28" ry="20" fill="rgba(168,230,207,0.06)"/>
      <ellipse cx="90" cy="40" rx="22" ry="16" fill="rgba(168,230,207,0.06)"/>
      <ellipse cx="70" cy="34" rx="35" ry="24" fill="rgba(200,240,220,0.07)"/>
    </svg>
  </motion.div>
);

/* Animated Tree */
const GhibliTree:React.FC<{style?:React.CSSProperties;scale?:number;delay?:number}>=({style={},scale=1,delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transformOrigin:'bottom center',...style}}
    animate={{rotate:[0,1.5,-1,0.8,0],scaleX:[1,1.01,0.99,1]}}
    transition={{duration:4+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 80 160" width={80*scale} height={160*scale}>
      <rect x="34" y="110" width="12" height="50" rx="4" fill="#3d2010"/>
      <ellipse cx="40" cy="95" rx="28" ry="32" fill="#1a3a1a"/>
      <ellipse cx="40" cy="75" rx="22" ry="26" fill="#244d24"/>
      <ellipse cx="40" cy="58" rx="16" ry="20" fill="#2d6a2d"/>
      <ellipse cx="40" cy="44" rx="11" ry="15" fill="#3d8c3d"/>
      {[...Array(6)].map((_,i)=>(
        <motion.circle key={i} cx={22+i*6} cy={60+Math.sin(i)*15} r="1.5" fill="#a8e6cf" opacity="0.6"
          animate={{opacity:[0.3,0.8,0.3],scale:[0.8,1.3,0.8]}}
          transition={{duration:2+i*0.3,repeat:Infinity,delay:i*0.4}}/>
      ))}
    </svg>
  </motion.div>
);

/* Totoro Silhouette */
const TotoroSilhouette:React.FC<{style?:React.CSSProperties}>=({style={}})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity:0.12,...style}}
    animate={{y:[0,-8,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 120 150" width="120" height="150">
      <ellipse cx="60" cy="85" rx="45" ry="55" fill={G.spirit}/>
      <ellipse cx="60" cy="60" rx="35" ry="40" fill={G.warmWhite}/>
      <ellipse cx="44" cy="55" rx="8" ry="12" fill={G.spirit}/>
      <ellipse cx="76" cy="55" rx="8" ry="12" fill={G.spirit}/>
      <circle cx="48" cy="50" r="6" fill="#222"/>
      <circle cx="72" cy="50" r="6" fill="#222"/>
      <circle cx="49.5" cy="48.5" r="2" fill="white"/>
      <circle cx="73.5" cy="48.5" r="2" fill="white"/>
      <ellipse cx="60" cy="66" rx="8" ry="5" fill="#d4a96a" opacity="0.6"/>
      {[...Array(6)].map((_,i)=><line key={i} x1={42+i*6} y1={70+i%2*3} x2={36+i*6} y2={73+i%2*2} stroke="#555" strokeWidth="1.2"/>)}
      <ellipse cx="35" cy="100" rx="18" ry="12" fill={G.spirit} opacity="0.5"/>
      <ellipse cx="85" cy="100" rx="18" ry="12" fill={G.spirit} opacity="0.5"/>
    </svg>
  </motion.div>
);

/* Floating Island */
const FloatingIsland:React.FC<{style?:React.CSSProperties;delay?:number}>=({style={},delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{y:[0,-14,0],rotate:[0,1,-1,0]}}
    transition={{duration:6+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 100 70" width="100" height="70">
      <ellipse cx="50" cy="55" rx="44" ry="18" fill="#3d2010" opacity="0.5"/>
      <path d="M10 50 Q50 30 90 50 Q80 65 20 65 Z" fill="#4a2d15" opacity="0.7"/>
      <ellipse cx="50" cy="48" rx="38" ry="10" fill="#2d6a2d" opacity="0.8"/>
      <rect x="44" y="30" width="6" height="18" rx="2" fill="#5c3d2e" opacity="0.7"/>
      <ellipse cx="47" cy="28" rx="10" ry="12" fill="#2d6a2d" opacity="0.9"/>
      <ellipse cx="47" cy="22" rx="7" ry="9" fill="#3d8c3d" opacity="0.9"/>
    </svg>
  </motion.div>
);

/* Fireflies Canvas */
const FirefliesCanvas:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext('2d');if(!ctx)return;
    let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};
    resize();window.addEventListener('resize',resize);
    const flies=Array.from({length:40},()=>({
      x:Math.random()*800,y:Math.random()*600,
      vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,
      r:Math.random()*2+1,a:Math.random(),da:Math.random()*0.02+0.005,
      hue:Math.random()*40+140,
    }));
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      flies.forEach(f=>{
        f.x+=f.vx;f.y+=f.vy;
        if(f.x<0)f.x=c.width;if(f.x>c.width)f.x=0;
        if(f.y<0)f.y=c.height;if(f.y>c.height)f.y=0;
        f.a+=f.da;if(f.a>1||f.a<0.1)f.da*=-1;
        const grad=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r*4);
        grad.addColorStop(0,`hsla(${f.hue},80%,75%,${f.a})`);
        grad.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(f.x,f.y,f.r*4,0,Math.PI*2);
        ctx.fillStyle=grad;ctx.fill();
        ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${f.hue},90%,85%,${f.a})`;ctx.fill();
      });
      raf=requestAnimationFrame(tick);
    };
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}/>;
};

/* 3D Tilt Card */
const TiltCard:React.FC<{children:React.ReactNode;style?:React.CSSProperties;className?:string}>=({children,style={},className})=>{
  const x=useMotionValue(0),y=useMotionValue(0);
  const rotX=useSpring(useTransform(y,[-0.5,0.5],[8,-8]),{stiffness:200,damping:30});
  const rotY=useSpring(useTransform(x,[-0.5,0.5],[-8,8]),{stiffness:200,damping:30});
  const gX=useTransform(x,[-0.5,0.5],['0%','100%']);
  const gY=useTransform(y,[-0.5,0.5],['0%','100%']);
  const handleMouse=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    x.set((e.clientX-r.left)/r.width-0.5);
    y.set((e.clientY-r.top)/r.height-0.5);
  };
  return (
    <motion.div className={className}
      style={{perspective:800,transformStyle:'preserve-3d',...style}}
      onMouseMove={handleMouse}
      onMouseLeave={()=>{x.set(0);y.set(0);}}>
      <motion.div style={{rotateX:rotX,rotateY:rotY,transformStyle:'preserve-3d',width:'100%',height:'100%',position:'relative'}}>
        {children}
        <motion.div style={{position:'absolute',inset:0,borderRadius:'inherit',pointerEvents:'none',background:`radial-gradient(circle at ${gX} ${gY}, rgba(168,230,207,0.15) 0%, transparent 60%)`,zIndex:10}}/>
      </motion.div>
    </motion.div>
  );
};

/* Scroll-reveal wrapper */
const Reveal:React.FC<{children:React.ReactNode;direction?:'up'|'left'|'right'|'scale';delay?:number;style?:React.CSSProperties}>=({children,direction='up',delay=0,style={}})=>{
  const variants={
    hidden:{opacity:0,y:direction==='up'?40:0,x:direction==='left'?-40:direction==='right'?40:0,scale:direction==='scale'?0.85:1},
    visible:{opacity:1,y:0,x:0,scale:1,transition:{duration:0.8,ease:[0.22,1,0.36,1],delay}},
  };
  return <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{once:true,margin:'-80px'}} style={style}>{children}</motion.div>;
};

/* Marquee Ticker */
const Marquee:React.FC<{contact:ContactData}>=({contact})=>{
  const items=[
    contact.instagram&&{icon:'📸',label:'Instagram',value:'@'+contact.instagram,href:'https://instagram.com/'+contact.instagram},
    contact.linkedin &&{icon:'💼',label:'LinkedIn', value:contact.linkedin,      href:'https://linkedin.com/in/'+contact.linkedin},
    contact.twitter  &&{icon:'🐦',label:'Twitter',  value:'@'+contact.twitter,  href:'https://twitter.com/'+contact.twitter},
    contact.email    &&{icon:'📧',label:'Email',    value:contact.email,         href:'mailto:'+contact.email},
    contact.website  &&{icon:'🌐',label:'Website',  value:contact.website,       href:'https://'+contact.website},
    contact.location &&{icon:'📍',label:'Location', value:contact.location,      href:null},
    {icon:'✦',label:'Hikimori',value:'Creative Portfolio',href:null},
    {icon:'✦',label:'Open to Work',value:'Nganjuk, Indonesia',href:null},
  ].filter(Boolean) as {icon:string;label:string;value:string;href:string|null}[];
  const doubled=[...items,...items,...items];
  return (
    <div style={{width:'100%',overflow:'hidden',background:G.amber,borderTop:'1px solid rgba(255,255,255,0.2)',borderBottom:'1px solid rgba(255,255,255,0.2)',padding:'10px 0',position:'relative',zIndex:10}}>
      <motion.div style={{display:'flex',gap:0,width:'max-content'}}
        animate={{x:['0%','-33.33%']}} transition={{duration:22,repeat:Infinity,ease:'linear',repeatType:'loop'}}>
        {doubled.map((item,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'0 28px',flexShrink:0,whiteSpace:'nowrap'}}>
            <span style={{fontSize:'0.85rem',color:'rgba(0,0,0,0.5)'}}>{item.icon}</span>
            <span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:700,color:'#000',textTransform:'uppercase',letterSpacing:'0.5px'}}>{item.label}</span>
            <span style={{fontSize:'0.62rem',color:'rgba(0,0,0,0.4)'}}>—</span>
            {item.href
              ?<a href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(0,0,0,0.75)',textDecoration:'none'}}>{item.value}</a>
              :<span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(0,0,0,0.75)'}}>{item.value}</span>}
            <span style={{color:'rgba(0,0,0,0.25)',fontSize:'1rem',marginLeft:8}}>✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};


/* ═══════════════════════════════════════════════
   CERT CARD (accordion)
═══════════════════════════════════════════════ */
const CertCard:React.FC<{cert:CertItem;index:number}>=({cert,index})=>{
  const [open,setOpen]=useState(false);
  const [imgLoaded,setImgLoaded]=useState(false);
  return (
    <Reveal direction="up" delay={index*0.08}>
      <motion.div
        whileHover={!open?{y:-3,boxShadow:`0 20px 50px rgba(78,205,196,0.18), 0 0 0 1px rgba(78,205,196,0.3)`}:{}}
        style={{borderRadius:18,overflow:'hidden',border:`1px solid rgba(78,205,196,${open?0.5:0.15})`,background:'rgba(10,22,50,0.88)',backdropFilter:'blur(14px)',transition:'border-color 0.3s,box-shadow 0.3s'}}>

        {/* ── Header — always visible ── */}
        <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'1.4rem 1.6rem',display:'flex',alignItems:'center',gap:'1.2rem',textAlign:'left'}}>

          {/* Icon / number circle */}
          <div style={{flexShrink:0,width:48,height:48,borderRadius:'50%',background:`rgba(78,205,196,0.1)`,border:`1.5px solid rgba(78,205,196,0.35)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 14px rgba(78,205,196,0.15)`}}>
            <span style={{fontSize:'1.3rem'}}>🎓</span>
          </div>

          {/* Info — stacked 3 baris */}
          <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:'0.22rem'}}>
            {/* Baris 1: Nama Sertifikasi */}
            <div style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'clamp(0.9rem,2.2vw,1.05rem)',color:G.cream,lineHeight:1.3,wordBreak:'break-word'}}>
              {cert.name || '—'}
            </div>
            {/* Baris 2: Lembaga Penerbit */}
            <div style={{fontFamily:'var(--font-body)',fontSize:'0.82rem',color:G.jade,fontWeight:600,display:'flex',alignItems:'center',gap:'0.4rem',flexWrap:'wrap'}}>
              <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:G.jade,flexShrink:0}}/>
              {cert.issuer || '—'}
              {cert.subtitle && (
                <span style={{color:'rgba(168,230,207,0.5)',fontWeight:400}}>· {cert.subtitle}</span>
              )}
            </div>
            {/* Baris 3: Tahun */}
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.1rem'}}>
              <span style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',fontWeight:700,color:G.amber,background:'rgba(245,166,35,0.1)',border:`1px solid rgba(245,166,35,0.3)`,borderRadius:6,padding:'2px 10px',letterSpacing:'0.5px'}}>
                {cert.year || '—'}
              </span>
              {open && (
                <motion.span initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'rgba(168,230,207,0.5)'}}>
                  Lihat sertifikat ↓
                </motion.span>
              )}
            </div>
          </div>

          {/* Chevron */}
          <motion.div animate={{rotate:open?180:0}} transition={{duration:0.35,ease:[0.4,0,0.2,1]}} style={{flexShrink:0,color:G.jade}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </motion.div>
        </button>

        {/* Separator line */}
        <AnimatePresence>
          {open && (
            <motion.div key="sep" initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}}
              style={{height:1,background:`linear-gradient(to right,transparent,${G.jade}55,transparent)`,transformOrigin:'left',marginLeft:'1.6rem',marginRight:'1.6rem'}}/>
          )}
        </AnimatePresence>

        {/* ── Dropdown — image ── */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="cert-img"
              initial={{height:0,opacity:0}}
              animate={{height:'auto',opacity:1}}
              exit={{height:0,opacity:0}}
              transition={{duration:0.45,ease:[0.4,0,0.2,1]}}
              style={{overflow:'hidden'}}>
              <div style={{padding:'1rem 1.6rem 1.6rem'}}>
                {/* Meta info recap */}
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
                  <span style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',fontWeight:600,color:G.cream,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'3px 12px'}}>📋 {cert.name}</span>
                  <span style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',fontWeight:600,color:G.jade,background:'rgba(78,205,196,0.08)',border:`1px solid rgba(78,205,196,0.2)`,borderRadius:6,padding:'3px 12px'}}>{cert.issuer}</span>
                  {cert.subtitle && <span style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'rgba(168,230,207,0.6)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,padding:'3px 12px'}}>{cert.subtitle}</span>}
                  <span style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',fontWeight:700,color:G.amber,background:'rgba(245,166,35,0.1)',border:`1px solid rgba(245,166,35,0.3)`,borderRadius:6,padding:'3px 12px'}}>📅 {cert.year}</span>
                </div>
                {/* Certificate image */}
                <div style={{borderRadius:14,overflow:'hidden',border:`1px solid rgba(78,205,196,0.25)`,background:'rgba(0,0,0,0.35)',minHeight:200,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',boxShadow:`inset 0 0 40px rgba(0,0,0,0.3)`}}>
                  {cert.imageUrl ? (
                    <>
                      {!imgLoaded && (
                        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.8rem'}}>
                          <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}
                            style={{width:36,height:36,borderRadius:'50%',border:`2.5px solid ${G.jade}`,borderTopColor:'transparent'}}/>
                          <span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'rgba(168,230,207,0.5)'}}>Memuat sertifikat...</span>
                        </div>
                      )}
                      <img src={cert.imageUrl} alt={`Sertifikat ${cert.name}`} onLoad={()=>setImgLoaded(true)}
                        style={{width:'100%',display:'block',objectFit:'contain',maxHeight:420,opacity:imgLoaded?1:0,transition:'opacity 0.4s ease'}}/>
                    </>
                  ) : (
                    <div style={{textAlign:'center',padding:'3rem 2rem',color:'rgba(168,230,207,0.4)'}}>
                      <motion.div animate={{y:[0,-8,0]}} transition={{duration:2.5,repeat:Infinity,ease:'easeInOut'}}
                        style={{fontSize:'3.5rem',marginBottom:'0.8rem'}}>🎓</motion.div>
                      <p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',lineHeight:1.6}}>Gambar sertifikat<br/>belum diupload</p>
                      <p style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'rgba(168,230,207,0.3)',marginTop:'0.5rem'}}>Upload melalui Admin Panel → Sertifikasi</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  );
};

/* ═══════════════════════════════════════════════
   CONTACT SECTION (unchanged)
═══════════════════════════════════════════════ */
const ContactSection:React.FC=()=>{
  const [sel,setSel]=useState<string[]>([]);
  const [name,setName]=useState('');const [email,setEmail]=useState('');const [msg,setMsg]=useState('');
  const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);
  const contact:ContactData=ls(LS_CONTACT,D_CONTACT);
  const toggle=(s:string)=>setSel(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setSending(true);await new Promise(r=>setTimeout(r,1000));setSending(false);setSent(true);};
  const inp:React.CSSProperties={flex:1,minWidth:0,fontSize:'0.875rem',padding:'10px 12px',borderRadius:12,border:'1px solid #e5e7eb',background:'transparent',outline:'none',fontFamily:'var(--font-body)',color:'#111',boxSizing:'border-box'};
  return (
    <section style={{width:'100%',padding:'12px',background:'#fff',boxSizing:'border-box'}}>
      <div style={{position:'relative',borderRadius:24,overflow:'hidden',minHeight:'calc(100vh - 24px)',display:'flex',flexDirection:'column'}}>
        <video autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}><source src={CONTACT_VIDEO} type="video/mp4"/></video>
        <div style={{position:'relative',zIndex:1,flex:1,display:'flex',flexDirection:'column',padding:'clamp(16px,4vw,24px)',gap:20,minHeight:'calc(100vh - 24px)',boxSizing:'border-box'}}>
          <div style={{background:'rgba(255,255,255,0.6)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',borderRadius:16,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',padding:'8px 12px',display:'flex',alignItems:'center',gap:12}}>
            <svg viewBox="0 0 256 256" width={28} height={28} style={{flexShrink:0}}><path fill="#000" d="M 256 256 L 128 256 L 0 128 L 128 128 Z"/><path fill="#000" d="M 256 128 L 128 128 L 0 0 L 128 0 Z"/></svg>
            <div id="cnav" style={{display:'none',gap:20,flex:1,overflow:'hidden'}}>
              {['Our story','Expertise','Our work','Journal'].map(l=><a key={l} href="#" style={{color:'#1f2937',fontSize:'0.82rem',fontWeight:500,textDecoration:'none',whiteSpace:'nowrap'}}>{l}</a>)}
            </div>
            <button style={{background:'#000',color:'#fff',fontSize:'0.82rem',fontWeight:500,padding:'7px 16px',borderRadius:10,border:'none',cursor:'pointer',marginLeft:'auto',flexShrink:0,whiteSpace:'nowrap'}}>Start a project</button>
          </div>
          <div style={{flex:1,minHeight:24}}/>
          <div id="cbot" style={{display:'flex',flexDirection:'column',gap:20}}>
            <p style={{color:'#fff',fontSize:'clamp(1.6rem,5vw,3rem)',fontWeight:500,lineHeight:1.2,textShadow:'0 2px 12px rgba(0,0,0,0.3)',margin:0}}>
              We craft bold ideas<br/>and ship them as{' '}
              <span style={{fontFamily:"'Georgia',serif",fontStyle:'italic',fontWeight:400}}>products</span>
            </p>
            <div style={{width:'100%',maxWidth:480}} id="cform">
              <div style={{background:'#fff',borderRadius:24,boxShadow:'0 25px 50px rgba(0,0,0,0.25)',padding:'clamp(16px,4vw,24px)',display:'flex',flexDirection:'column',gap:14}}>
                {sent?(
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 0',gap:12}}>
                    <div style={{width:48,height:48,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>✓</div>
                    <p style={{fontSize:'1rem',fontWeight:600,color:'#111',margin:0}}>You're all set!</p>
                    <p style={{fontSize:'0.875rem',color:'#6b7280',margin:0}}>Expect a reply within 24 hours.</p>
                  </div>
                ):(<>
                  <h2 style={{fontSize:'1.25rem',fontWeight:600,color:'#000',letterSpacing:'-0.02em',margin:0}}>Say hello! 👋</h2>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,background:'#f9fafb',borderRadius:14,padding:'10px 14px',flexWrap:'wrap',rowGap:8}}>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:'0.72rem',color:'#9ca3af',margin:'0 0 2px 0'}}>Drop us a line</p>
                      <a href={`mailto:${contact.email}`} style={{color:'#2563eb',fontWeight:600,fontSize:'0.82rem',textDecoration:'none',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.email}</a>
                    </div>
                    <div style={{display:'flex',gap:5,flexShrink:0}}>
                      <SBtn icon={<IcoTwitter/>} bg="#f3f4f6" color="#1f2937"/>
                      <SBtn icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>} bg="#fce7f3" color="#ec4899"/>
                      <SBtn icon={<IcoIG/>} bg="#ffedd5" color="#fb923c"/>
                      <SBtn icon={<IcoLI/>} bg="#dbeafe" color="#2563eb"/>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{flex:1,height:1,background:'#e5e7eb'}}/>
                    <span style={{fontSize:'0.82rem',color:'#9ca3af',fontWeight:500}}>OR</span>
                    <div style={{flex:1,height:1,background:'#e5e7eb'}}/>
                  </div>
                  <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
                    <label style={{fontSize:'0.82rem',fontWeight:500,color:'#000'}}>Tell us about your vision</label>
                    <div style={{display:'flex',flexDirection:'column',gap:8}} id="cinputs">
                      <input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} style={{...inp,width:'100%'}}/>
                      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{...inp,width:'100%'}}/>
                    </div>
                    <textarea rows={3} placeholder="What are you looking to build or improve..." value={msg} onChange={e=>setMsg(e.target.value)} style={{...inp,resize:'none',width:'100%'}}/>
                    <div>
                      <p style={{fontSize:'0.82rem',fontWeight:500,color:'#000',marginBottom:6}}>I need help with...</p>
                      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                        {SERVICES_LIST.map(s=><button key={s} type="button" onClick={()=>toggle(s)} style={{fontSize:'0.72rem',fontWeight:500,padding:'6px 10px',borderRadius:7,border:sel.includes(s)?'1px solid #000':'1px solid #e5e7eb',background:sel.includes(s)?'#f3f4f6':'#fff',color:sel.includes(s)?'#000':'#374151',cursor:'pointer'}}>{s}</button>)}
                      </div>
                    </div>
                    <button type="submit" disabled={sending} style={{width:'100%',background:'#000',color:'#fff',fontSize:'0.875rem',fontWeight:600,padding:'11px 0',borderRadius:14,border:'none',cursor:sending?'not-allowed':'pointer',opacity:sending?0.6:1}}>
                      {sending?'Sending...':'Send my message'}
                    </button>
                  </form>
                </>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:767px){#cnav{display:none!important;}}
        @media(min-width:768px){#cnav{display:flex!important;}#cinputs{flex-direction:row!important;}}
        @media(min-width:1024px){#cbot{flex-direction:row!important;align-items:flex-end!important;justify-content:space-between!important;}#cform{width:min(480px,45%)!important;}}
      `}</style>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════ */
const Home:React.FC=()=>{
  const [hero,setHero]       =useState<HomeData>(()=>ls(LS_HOME,D_HOME));
  const [about,setAbout]     =useState<AboutData>(()=>ls(LS_ABOUT,D_ABOUT));
  const [skills,setSkills]   =useState<SkillItem[]>(()=>ls(LS_SKILLS,D_SKILLS));
  const [exps,setExps]       =useState<ExpItem[]>(()=>ls(LS_EXP,D_EXP));
  const [contact,setContact] =useState<ContactData>(()=>ls(LS_CONTACT,D_CONTACT));
  const [certs,setCerts]     =useState<CertItem[]>(()=>ls(LS_CERT,D_CERT));
  const containerRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const onStorage=(e:StorageEvent)=>{
      if(e.key===LS_HOME&&e.newValue)try{setHero(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_ABOUT&&e.newValue)try{setAbout(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_SKILLS&&e.newValue)try{setSkills(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_EXP&&e.newValue)try{setExps(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_CONTACT&&e.newValue)try{setContact(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_CERT&&e.newValue)try{setCerts(JSON.parse(e.newValue));}catch{}
    };
    const onCustom=(e:Event)=>{
      const{key,value}=(e as CustomEvent).detail;
      try{
        if(key===LS_HOME)setHero(JSON.parse(value));
        if(key===LS_ABOUT)setAbout(JSON.parse(value));
        if(key===LS_SKILLS)setSkills(JSON.parse(value));
        if(key===LS_EXP)setExps(JSON.parse(value));
        if(key===LS_CONTACT)setContact(JSON.parse(value));
        if(key===LS_CERT)setCerts(JSON.parse(value));
      }catch{}
    };
    window.addEventListener('storage',onStorage);
    window.addEventListener('hk-update',onCustom);
    return()=>{window.removeEventListener('storage',onStorage);window.removeEventListener('hk-update',onCustom);};
  },[]);

  const photo=about.photoUrl||FALLBACK_PHOTO;
  const heroText=`${hero.heroTitle}\n${hero.heroSubtitle}`;

  return (
    <div ref={containerRef} style={{background:G.sky1,minHeight:'100vh',overflowX:'hidden'}}>

      {/* ══ HERO (unchanged) ══ */}
      <section style={{position:'relative',width:'100%',height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',background:'#000',color:'#fff'}}>
        <video autoPlay loop muted playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}>
          <source src={HERO_VIDEO} type="video/mp4"/>
        </video>
        <Stars/>
        <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',height:'100%',padding:'70px clamp(1rem,5vw,4rem) 0 clamp(1rem,5vw,4rem)'}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:'clamp(2rem,5vw,4rem)'}}>
            <div id="hgrid" style={{display:'grid',gridTemplateColumns:'1fr',alignItems:'flex-end',gap:'1.5rem'}}>
              <div>
                <AnimatedHeading text={heroText} style={{fontSize:'clamp(2rem,7vw,4.5rem)',fontWeight:400,marginBottom:'0.8rem',letterSpacing:'-0.04em',lineHeight:1.1,color:'#fff',fontFamily:'var(--font-body)',wordBreak:'break-word'}}/>
                <FadeIn delay={800} duration={1000}>
                  <p style={{fontSize:'clamp(0.9rem,2vw,1.125rem)',color:'#d1d5db',marginBottom:'1.25rem',fontWeight:400,lineHeight:1.6,maxWidth:'520px'}}>{hero.heroTagline}</p>
                </FadeIn>
                <FadeIn delay={1200} duration={1000}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
                    <a href={hero.heroCtaSecondaryLink||'#contact'} style={{textDecoration:'none'}}><button style={{background:'#fff',color:'#000',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:500,fontSize:'0.9rem',cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>{hero.heroCtaSecondary||'Start a Chat'}</button></a>
                    <Link to={hero.heroCtaLink||'/portofolio'} style={{textDecoration:'none'}}><button style={{...LG,border:'1px solid rgba(255,255,255,0.2)',color:'#fff',borderRadius:8,padding:'10px 24px',fontWeight:500,fontSize:'0.9rem',cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>{hero.heroCta}</button></Link>
                  </div>
                </FadeIn>
              </div>
              <div id="htag" style={{display:'flex',alignItems:'flex-end',justifyContent:'flex-start'}}>
                <FadeIn delay={1400} duration={1000}>
                  <div style={{...LG,border:'1px solid rgba(255,255,255,0.2)',borderRadius:12,padding:'10px 20px',display:'inline-block',maxWidth:'100%'}}>
                    <span style={{fontSize:'clamp(1rem,2.5vw,1.5rem)',fontWeight:300,color:'#fff',fontFamily:'var(--font-body)',wordBreak:'break-word'}}>{hero.heroTagRight||'Investing. Building. Advisory.'}</span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <Marquee contact={contact}/>

      {/* ══════════════════════════════════════════
          GHIBLI — ABOUT "SPIRIT FOREST"
      ══════════════════════════════════════════ */}
      <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',overflow:'hidden',background:`linear-gradient(180deg, ${G.sky1} 0%, ${G.forest1} 40%, ${G.forest2} 100%)`}}>
        {/* Bg fireflies */}
        <FirefliesCanvas/>
        {/* Clouds */}
        <GhibliCloud style={{top:'8%',left:'-15%',opacity:0.7}} speed={30}/>
        <GhibliCloud style={{top:'20%',right:'-10%',opacity:0.5}} speed={40} direction={-1}/>
        {/* Trees */}
        <GhibliTree style={{left:'-20px',bottom:0}} scale={1.1} delay={0}/>
        <GhibliTree style={{left:'60px',bottom:0}} scale={0.8} delay={0.5}/>
        <GhibliTree style={{right:'-20px',bottom:0}} scale={1.0} delay={1}/>
        <GhibliTree style={{right:'55px',bottom:0}} scale={0.7} delay={1.5}/>
        {/* Kodama spirits */}
        <Kodama x="8%" y="30%" size={36} delay={0}/>
        <Kodama x="85%" y="45%" size={28} delay={1.2}/>
        <Kodama x="15%" y="65%" size={22} delay={2}/>
        {/* Totoro */}
        <TotoroSilhouette style={{right:'5%',bottom:'10%',opacity:0.1}}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <div id="about-row" style={{display:'flex',flexDirection:'column',gap:'3rem',alignItems:'center'}}>
            {/* Photo with 3D tilt */}
            <Reveal direction="left" style={{width:'100%',maxWidth:340,flexShrink:0}}>
              <TiltCard style={{borderRadius:20,width:'100%'}}>
                <div style={{borderRadius:20,overflow:'hidden',border:`2px solid ${G.jade}`,boxShadow:`0 0 40px rgba(78,205,196,0.25), 0 20px 60px rgba(0,0,0,0.5)`,position:'relative',aspectRatio:'4/5'}}>
                  <img src={photo} alt={about.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,${G.forest1} 0%,transparent 55%)`}}/>
                  {/* Spirit orbs on photo */}
                  {[...Array(5)].map((_,i)=>(
                    <motion.div key={i} style={{position:'absolute',width:8,height:8,borderRadius:'50%',background:G.spirit,left:`${20+i*15}%`,top:`${30+i*10}%`,boxShadow:`0 0 12px 4px ${G.spiritG}`}}
                      animate={{y:[0,-10,0],opacity:[0.4,0.9,0.4],scale:[0.8,1.3,0.8]}}
                      transition={{duration:2.5+i*0.4,repeat:Infinity,delay:i*0.5}}/>
                  ))}
                  {/* Location badge */}
                  <div style={{position:'absolute',bottom:'1rem',left:'1rem',right:'1rem'}}>
                    <motion.div whileHover={{scale:1.04}} style={{background:'rgba(78,205,196,0.85)',backdropFilter:'blur(8px)',borderRadius:10,padding:'0.5rem 1rem',color:G.forest1,fontWeight:700,fontSize:'0.82rem',display:'inline-block',maxWidth:'100%',wordBreak:'break-word'}}>
                      🌿 {about.location}
                    </motion.div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
            {/* Text */}
            <Reveal direction="right" delay={0.15}>
              <div style={{maxWidth:560}}>
                <motion.span animate={{opacity:[0.7,1,0.7]}} transition={{duration:3,repeat:Infinity}}
                  style={{fontFamily:'var(--font-body)',color:G.jade,fontSize:'0.78rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,display:'block',marginBottom:'0.6rem'}}>
                  ✦ Spirit of the Forest
                </motion.span>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5rem)',lineHeight:0.9,marginBottom:'0.3rem',color:G.warmWhite}}>ABOUT ME !</h2>
                <div style={{fontFamily:'var(--font-script)',color:G.amber,fontSize:'clamp(1.5rem,5vw,2.2rem)',fontWeight:700,marginBottom:'1.5rem',textShadow:`0 0 20px ${G.amber}55`}}>{about.name}</div>
                <p style={{color:'rgba(245,232,200,0.85)',lineHeight:1.9,marginBottom:'1rem',fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio1}</p>
                <p style={{color:'rgba(245,232,200,0.7)',lineHeight:1.9,fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio2}</p>
                <div style={{marginTop:'2rem'}}>
                  <motion.div whileHover={{scale:1.05,boxShadow:`0 8px 30px ${G.jade}44`}} whileTap={{scale:0.97}} style={{display:'inline-block'}}>
                    <Link to="/about" style={{display:'inline-flex',alignItems:'center',gap:8,background:`rgba(78,205,196,0.12)`,color:G.jade,textDecoration:'none',borderRadius:50,padding:'12px 28px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.9rem',border:`1px solid ${G.jade}55`,backdropFilter:'blur(6px)'}}>
                      🌿 Masuk ke Hutan → 
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Ground fog */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:80,background:'linear-gradient(to top, rgba(10,31,10,0.8), transparent)',pointerEvents:'none'}}/>
      </section>

      {/* ══════════════════════════════════════════
          GHIBLI — SKILLS "CASTLE IN THE SKY"
      ══════════════════════════════════════════ */}
      <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',overflow:'hidden',background:`linear-gradient(180deg, ${G.forest2} 0%, ${G.dusk1} 50%, ${G.dusk2} 100%)`}}>
        {/* Moving clouds bg */}
        <GhibliCloud style={{top:'5%',left:'-10%',opacity:0.6}} speed={25}/>
        <GhibliCloud style={{top:'40%',right:'-5%',opacity:0.4}} speed={35} direction={-1}/>
        <GhibliCloud style={{bottom:'20%',left:'20%',opacity:0.3}} speed={45}/>
        {/* Floating islands */}
        <FloatingIsland style={{right:'5%',top:'10%',opacity:0.5}} delay={0}/>
        <FloatingIsland style={{left:'3%',top:'35%',opacity:0.4}} delay={1.5}/>
        <FloatingIsland style={{right:'15%',bottom:'15%',opacity:0.35}} delay={3}/>
        {/* Fireflies */}
        {[...Array(8)].map((_,i)=><Firefly key={i} style={{left:`${10+i*11}%`,top:`${20+i*8}%`}} delay={i*0.4}/>)}

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <motion.div animate={{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>
                <div style={{fontFamily:'var(--font-body)',color:G.jade,fontSize:'0.78rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,marginBottom:'0.6rem'}}>✦ Skills & Tools</div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5.5rem)',lineHeight:0.9,color:G.warmWhite,wordBreak:'break-word'}}>
                  CASTLE IN{' '}
                  <span style={{color:G.jade,textShadow:`0 0 30px ${G.jade}66`}}>THE SKY</span>
                </h2>
              </motion.div>
            </div>
          </Reveal>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))',gap:'1.2rem'}}>
            {skills.map((sk,i)=>(
              <Reveal key={sk.id} direction="up" delay={i*0.1}>
                <TiltCard style={{borderRadius:18,height:'100%'}}>
                  <motion.div
                    whileHover={{boxShadow:`0 20px 60px rgba(78,205,196,0.3), 0 0 0 1px ${G.jade}44`}}
                    style={{background:'rgba(13,34,64,0.85)',border:`1px solid rgba(78,205,196,0.2)`,borderRadius:18,padding:'1.8rem',position:'relative',overflow:'hidden',height:'100%',backdropFilter:'blur(12px)'}}>
                    {/* Glow orb */}
                    <motion.div animate={{scale:[1,1.3,1],opacity:[0.3,0.6,0.3]}} transition={{duration:3+i*0.5,repeat:Infinity}}
                      style={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle, ${G.jade}33 0%, transparent 70%)`}}/>
                    {/* Floating number */}
                    <motion.div animate={{y:[0,-4,0]}} transition={{duration:2.5+i*0.3,repeat:Infinity,ease:'easeInOut'}}
                      style={{color:G.jade,fontFamily:'var(--font-display)',fontSize:'1.8rem',marginBottom:'0.6rem',position:'relative',zIndex:1,textShadow:`0 0 15px ${G.jade}88`}}>
                      {sk.number}
                    </motion.div>
                    <h3 style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.88rem',color:G.cream,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.7rem',position:'relative',zIndex:1}}>{sk.title}</h3>
                    <p style={{color:'rgba(168,230,207,0.7)',fontSize:'0.85rem',lineHeight:1.6,position:'relative',zIndex:1}}>{sk.desc}</p>
                    {/* Bottom shimmer line */}
                    <motion.div animate={{scaleX:[0,1,0]}} transition={{duration:3,repeat:Infinity,delay:i*0.4}}
                      style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(to right, transparent, ${G.jade}, transparent)`,transformOrigin:'left'}}/>
                  </motion.div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GHIBLI — EXPERIENCE "JOURNEY PATH"
      ══════════════════════════════════════════ */}
      <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',overflow:'hidden',background:`linear-gradient(180deg, ${G.dusk2} 0%, ${G.dusk3} 50%, #1a0a2e 100%)`}}>
        {/* Stars bg */}
        {[...Array(30)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',width:2,height:2,borderRadius:'50%',background:'white',left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,pointerEvents:'none'}}
            animate={{opacity:[0.2,0.8,0.2]}} transition={{duration:2+Math.random()*3,repeat:Infinity,delay:Math.random()*3}}/>
        ))}
        {/* Clouds low */}
        <GhibliCloud style={{bottom:'5%',left:'-5%',opacity:0.4}} speed={28}/>
        <GhibliCloud style={{bottom:'15%',right:'-5%',opacity:0.3}} speed={38} direction={-1}/>
        {/* Kodama */}
        <Kodama x="4%" y="20%" size={28} delay={0.5}/>
        <Kodama x="92%" y="35%" size={24} delay={1.8}/>

        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{fontFamily:'var(--font-body)',color:G.amber,fontSize:'0.78rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,marginBottom:'0.6rem'}}>✦ Journey</div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.9,color:G.warmWhite,wordBreak:'break-word'}}>
                PENGALAMAN{' '}
                <span style={{fontFamily:'var(--font-script)',color:G.amber,fontSize:'55%',textShadow:`0 0 20px ${G.amber}66`}}>Kerja</span>
              </h2>
              <p style={{color:'rgba(245,230,200,0.6)',marginTop:'0.8rem',fontSize:'0.9rem'}}>Pengalaman Profesional &amp; Riwayat Kerja</p>
            </div>
          </Reveal>

          {/* Timeline vertical line */}
          <div style={{position:'relative'}}>
            <motion.div initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:true}} transition={{duration:1.5,ease:'easeOut'}}
              style={{position:'absolute',left:'clamp(16px,5vw,32px)',top:0,bottom:0,width:2,background:`linear-gradient(to bottom, ${G.amber}00, ${G.amber}, ${G.amber}00)`,transformOrigin:'top',zIndex:1}}/>

            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              {exps.map((exp,i)=>(
                <Reveal key={exp.id} direction="right" delay={i*0.15}>
                  <div style={{display:'flex',gap:'clamp(1rem,4vw,2rem)',position:'relative'}}>
                    {/* Timeline node */}
                    <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',width:'clamp(32px,10vw,64px)'}}>
                      <motion.div whileHover={{scale:1.2,boxShadow:`0 0 20px ${G.amber}88`}}
                        animate={{boxShadow:[`0 0 8px ${G.amber}44`,`0 0 16px ${G.amber}88`,`0 0 8px ${G.amber}44`]}}
                        transition={{duration:2,repeat:Infinity,delay:i*0.6}}
                        style={{width:44,height:44,borderRadius:'50%',background:`rgba(245,166,35,0.15)`,border:`2px solid ${G.amber}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',position:'relative',zIndex:2}}>
                        {exp.icon}
                      </motion.div>
                    </div>

                    {/* Card */}
                    <TiltCard style={{flex:1,borderRadius:16}}>
                      <motion.div whileHover={{borderColor:`${G.amber}66`,background:'rgba(61,32,16,0.3)'}}
                        style={{background:'rgba(26,10,46,0.85)',border:`1px solid rgba(245,166,35,0.15)`,borderRadius:16,padding:'1.4rem clamp(1rem,3vw,1.8rem)',backdropFilter:'blur(10px)',transition:'all 0.3s',position:'relative',overflow:'hidden'}}>
                        {/* Glow */}
                        <motion.div animate={{opacity:[0.2,0.5,0.2]}} transition={{duration:3+i*0.5,repeat:Infinity}}
                          style={{position:'absolute',top:-30,right:-30,width:100,height:100,borderRadius:'50%',background:`radial-gradient(circle, ${G.amber}22 0%, transparent 70%)`}}/>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'0.5rem',marginBottom:'0.3rem',flexWrap:'wrap',position:'relative',zIndex:1}}>
                          <h3 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1rem,3vw,1.4rem)',color:G.warmWhite,lineHeight:1.2}}>{exp.position}</h3>
                          {exp.period&&<motion.span whileHover={{scale:1.05}} style={{background:`rgba(245,166,35,0.15)`,color:G.amber,borderRadius:6,padding:'3px 12px',fontSize:'0.72rem',fontWeight:700,flexShrink:0,whiteSpace:'nowrap',border:`1px solid ${G.amber}33`}}>{exp.period}</motion.span>}
                        </div>
                        {exp.company&&<div style={{fontFamily:'var(--font-script)',color:G.jade,fontSize:'1.05rem',marginBottom:'0.8rem',position:'relative',zIndex:1}}>{exp.company}</div>}
                        {exp.tags&&(
                          <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',position:'relative',zIndex:1}}>
                            {exp.tags.split(',').map(t=>t.trim()).filter(Boolean).map((tag,ti)=>(
                              <motion.span key={tag} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{delay:ti*0.05+i*0.1}}
                                style={{background:'rgba(78,205,196,0.08)',border:`1px solid rgba(78,205,196,0.2)`,color:'rgba(168,230,207,0.8)',borderRadius:5,padding:'3px 10px',fontSize:'0.72rem',fontWeight:500}}>
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </TiltCard>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GHIBLI — CTA "FOREST SPIRIT"
      ══════════════════════════════════════════ */}
      <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',textAlign:'center',overflow:'hidden',background:`linear-gradient(180deg, #1a0a2e 0%, ${G.forest1} 60%, ${G.forest2} 100%)`}}>
        {/* Fireflies */}
        {[...Array(12)].map((_,i)=><Firefly key={i} style={{left:`${5+i*8}%`,top:`${10+i*6}%`}} delay={i*0.3}/>)}
        {/* Trees sides */}
        <GhibliTree style={{left:0,bottom:0,opacity:0.8}} scale={1.3} delay={0}/>
        <GhibliTree style={{left:80,bottom:0,opacity:0.6}} scale={0.9} delay={0.7}/>
        <GhibliTree style={{right:0,bottom:0,opacity:0.8}} scale={1.2} delay={1.2}/>
        <GhibliTree style={{right:85,bottom:0,opacity:0.5}} scale={0.8} delay={0.3}/>
        {/* Kodama center */}
        <Kodama x="46%" y="8%" size={40} delay={0}/>
        <Kodama x="20%" y="25%" size={24} delay={1}/>
        <Kodama x="74%" y="20%" size={28} delay={2}/>
        {/* Totoro bg */}
        <TotoroSilhouette style={{left:'50%',top:'15%',transform:'translateX(-50%)',opacity:0.06}}/>

        <div style={{position:'relative',zIndex:2,maxWidth:700,margin:'0 auto'}}>
          <Reveal direction="scale">
            {/* Spirit circle pulse */}
            <div style={{position:'relative',display:'inline-block',marginBottom:'1.5rem'}}>
              {[...Array(3)].map((_,i)=>(
                <motion.div key={i} style={{position:'absolute',inset:-(i+1)*18,borderRadius:'50%',border:`1px solid rgba(78,205,196,${0.3-i*0.08})`,pointerEvents:'none'}}
                  animate={{scale:[1,1.1,1],opacity:[0.4,0.7,0.4]}} transition={{duration:2+i,repeat:Infinity,delay:i*0.5}}/>
              ))}
              <div style={{width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle, ${G.jade}44, ${G.spiritG} 60%, transparent)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',border:`2px solid ${G.jade}66`,boxShadow:`0 0 40px ${G.jade}44`}}>
                🌿
              </div>
            </div>

            <motion.h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,8vw,5rem)',lineHeight:0.95,color:G.warmWhite,wordBreak:'break-word',marginBottom:'1rem',textShadow:`0 0 40px rgba(168,230,207,0.2)`}}>
              SIAP BERKOLABORASI?
            </motion.h2>
            <p style={{color:'rgba(168,230,207,0.7)',marginBottom:'2.5rem',fontSize:'clamp(0.9rem,2vw,1.05rem)',lineHeight:1.7,maxWidth:480,margin:'0 auto 2.5rem'}}>
              Seperti roh hutan yang menuntun jalan, saya siap membawa proyek Anda ke level berikutnya.
            </p>

            {/* CTA Button with pulsing ring */}
            <div style={{position:'relative',display:'inline-block'}}>
              {[...Array(2)].map((_,i)=>(
                <motion.div key={i} style={{position:'absolute',inset:-(i+1)*10,borderRadius:50,border:`2px solid ${G.jade}`,pointerEvents:'none'}}
                  animate={{scale:[1,1.15,1],opacity:[0.5,0,0.5]}} transition={{duration:2,repeat:Infinity,delay:i*0.8}}/>
              ))}
              <motion.a href={`mailto:${contact.email}`}
                whileHover={{scale:1.05,boxShadow:`0 15px 50px ${G.jade}55`}} whileTap={{scale:0.97}}
                style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',background:`linear-gradient(135deg, ${G.teal}, ${G.jade})`,color:G.forest1,textDecoration:'none',borderRadius:50,padding:'16px 48px',fontFamily:'var(--font-body)',fontWeight:800,fontSize:'1rem',letterSpacing:'0.5px',position:'relative',boxShadow:`0 8px 30px ${G.jade}44`}}>
                🌿 Mulai Petualangan →
              </motion.a>
            </div>
          </Reveal>
        </div>

        {/* Ground fog */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:100,background:'linear-gradient(to top, rgba(10,31,10,0.9), transparent)',pointerEvents:'none'}}/>
      </section>


      {/* ══════════════════════════════════════════
          GHIBLI — CERTIFICATES "SCROLL OF WISDOM"
      ══════════════════════════════════════════ */}
      <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',overflow:'hidden',background:`linear-gradient(180deg, #1a0a2e 0%, #0d1a2e 60%, ${G.sky1} 100%)`}}>
        {/* bg stars */}
        {[...Array(25)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',width:2,height:2,borderRadius:'50%',background:'white',left:`${Math.random()*100}%`,top:`${Math.random()*80}%`,pointerEvents:'none'}}
            animate={{opacity:[0.1,0.7,0.1]}} transition={{duration:2+Math.random()*3,repeat:Infinity,delay:Math.random()*4}}/>
        ))}
        {/* Fireflies */}
        {[...Array(6)].map((_,i)=><Firefly key={i} style={{left:`${10+i*14}%`,top:`${15+i*10}%`}} delay={i*0.5}/>)}
        {/* Kodama */}
        <Kodama x="5%" y="15%" size={26} delay={0.8}/>
        <Kodama x="90%" y="30%" size={22} delay={2}/>

        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <motion.div animate={{y:[0,-5,0]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}>
                <div style={{fontFamily:'var(--font-body)',color:G.jade,fontSize:'0.78rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,marginBottom:'0.6rem'}}>✦ Scroll of Wisdom</div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,8vw,5rem)',lineHeight:0.9,color:G.warmWhite,wordBreak:'break-word'}}>
                  SERTIFI<span style={{color:G.jade,textShadow:`0 0 30px ${G.jade}66`}}>KASI</span>
                </h2>
                <p style={{color:'rgba(168,230,207,0.6)',marginTop:'0.8rem',fontSize:'0.9rem'}}>Klik kartu untuk melihat sertifikat</p>
              </motion.div>
            </div>
          </Reveal>

          {certs.length === 0 ? (
            <Reveal direction="up">
              <div style={{textAlign:'center',padding:'3rem',color:'rgba(168,230,207,0.4)',border:`1px dashed rgba(78,205,196,0.2)`,borderRadius:16}}>
                <div style={{fontSize:'3rem',marginBottom:'0.8rem'}}>🎓</div>
                <p style={{fontFamily:'var(--font-body)',fontSize:'0.9rem'}}>Belum ada sertifikasi. Tambahkan melalui Admin Panel.</p>
              </div>
            </Reveal>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {certs.map((cert,i)=><CertCard key={cert.id} cert={cert} index={i}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══ CONTACT (unchanged) ══ */}
      <ContactSection/>

      {/* ══ FOOTER ══ */}
      <Footer/>

      <style>{`
        @media(min-width:768px){#about-row{flex-direction:row!important;align-items:flex-start!important;}#about-row>*{width:50%;}}
        @media(min-width:1024px){#hgrid{grid-template-columns:1fr 1fr!important;}#htag{justify-content:flex-end!important;}}
        @media(max-width:480px){.tilt-no-mobile{transform:none!important;}}
      `}</style>
    </div>
  );
};

export default Home;
