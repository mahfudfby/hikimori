// src/pages/Home.tsx — Modern Japanese Theme 和モダン
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring, AnimatePresence, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

/* ─── localStorage keys ─── */
const LS_HOME='hk_home_data',LS_ABOUT='hk_home_about_data',LS_SKILLS='hk_skills_data';
const LS_EXP='hk_experience_data',LS_CONTACT='hk_contact_data',LS_CERT='hk_cert_data';

interface HomeData    {heroTitle:string;heroSubtitle:string;heroTagline:string;heroCtaSecondary:string;heroCtaSecondaryLink:string;heroCta:string;heroCtaLink:string;heroPhotoUrl:string;heroTagRight:string;}
interface AboutData   {name:string;location:string;bio1:string;bio2:string;photoUrl:string;}
interface SkillItem   {id:string;number:string;title:string;desc:string;}
interface ExpItem     {id:string;position:string;company:string;period:string;icon:string;tags:string;}
interface ContactData {email:string;location:string;website:string;instagram:string;linkedin:string;twitter:string;}
interface CertItem    {id:string;name:string;year:string;issuer:string;subtitle:string;imageUrl:string;}

const D_HOME:HomeData={heroTitle:'Shaping tomorrow',heroSubtitle:'with vision and action.',heroTagline:'We back visionaries and craft ventures that define what comes next.',heroCtaSecondary:'Start a Chat',heroCtaSecondaryLink:'#contact',heroCta:'Explore Now',heroCtaLink:'/portofolio',heroPhotoUrl:'',heroTagRight:'Investing. Building. Advisory.'};
const D_ABOUT:AboutData={name:'Mahfudfebry',location:'Nganjuk, Indonesia',bio1:'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',bio2:'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',photoUrl:''};
const D_SKILLS:SkillItem[]=[{id:'1',number:'01',title:'Branding & Identity Design',desc:"Crafting memorable logos and visual systems that reflect a brand's essence."},{id:'2',number:'02',title:'Creativity & Problem-Solving',desc:'Thinking outside the box while solving design challenges with strategic insight.'},{id:'3',number:'03',title:'Concept Development',desc:'Skilled in brainstorming and translating abstract ideas into visual narratives.'},{id:'4',number:'04',title:'Proper Time Management',desc:'Capable of handling multiple projects and meeting tight deadlines.'}];
const D_EXP:ExpItem[]=[{id:'1',position:'HR / General Affairs',company:'UD Duta Pangan',period:'2020–2023',icon:'👥',tags:'Vendor Management,Stock Monitoring,Facility Maintenance,Workload Analysis'},{id:'2',position:'Staff Administrasi',company:'UD Duta Pangan',period:'2020–2023',icon:'📋',tags:'Document Processing,Administrative Support,Filing & Archiving,Reporting'},{id:'3',position:'IT Support',company:'UD Duta Pangan',period:'2020–2023',icon:'💻',tags:'Hardware Troubleshooting,Software Installation,Network Setup,User Training'}];
const D_CONTACT:ContactData={email:'mahfudfebry@hikimori.web.id',location:'Nganjuk, Indonesia',website:'hikimori.web.id',instagram:'',linkedin:'',twitter:''};
const D_CERT:CertItem[]=[{id:'1',name:'Google Digital Marketing',year:'2023',issuer:'Google',subtitle:'Fundamentals of Digital Marketing',imageUrl:''},{id:'2',name:'HR Management Professional',year:'2022',issuer:'BNSP Indonesia',subtitle:'Sertifikasi Kompetensi SDM',imageUrl:''}];
const FALLBACK_PHOTO='https://res.cloudinary.com/dl4pyan8v/image/upload/WhatsApp_Image_2026-06-16_at_03.45.15_axvhg3';
const HERO_VIDEO='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';
const CONTACT_VIDEO='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES_LIST=['Website','Mobile App','Web App','E-Commerce','Visual Identity','3D & Motion','Digital Marketing','Growth & Consulting','Other'];
const ls=<T,>(key:string,fb:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fb;}catch{return fb;}};

/* ════════════════════════════════════════
   JAPANESE PALETTE 和カラー
════════════════════════════════════════ */
const J={
  // Warm dark — matches washi/ink concept art
  ink:'#100c08',    inkD:'#080604',    inkM:'#1a1410',
  warm:'#1e1610',   warmD:'#140f0a',   warmL:'#281e14',
  indigo:'#1a1530', indigoL:'#252040',
  // Nature accents
  sakura:'#c4687a',  sakuraL:'#e8909f', sakuraD:'#8b3040',
  bamboo:'#4a6840',  bambooL:'#6a9860', bambooD:'#2d4828',
  // Core Japanese accents — from image
  vermillion:'#922018', vermillionL:'#c03028', vermillionB:'rgba(146,32,24,0.15)',
  gold:'#b8922a',       goldL:'#d4b050',       goldD:'#7a5e18',
  goldGlow:'rgba(184,146,42,0.25)',
  // Washi paper tones
  washi:'#e8d0a0',    washiD:'#c4a878',   washiDark:'#8a6a3a',
  cream:'#d8c090',
  // Text
  moon:'#f0e8d0',    moonD:'#c8b898',    moonDim:'rgba(240,232,208,0.65)',
  // Effects
  smoke:'rgba(20,12,8,0.7)',
  crack:'rgba(180,140,80,0.12)',
  circuit:'rgba(184,146,42,0.35)',
};

/* ════════════════════════════════════════
   UTILITY COMPONENTS
════════════════════════════════════════ */
const LG:React.CSSProperties={background:'rgba(0,0,0,0.4)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',boxShadow:'inset 0 1px 1px rgba(255,255,255,0.1)',position:'relative'};

const FadeIn:React.FC<{children:React.ReactNode;delay?:number;duration?:number;style?:React.CSSProperties}>=({children,delay=0,duration=1000,style={}})=>{
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t);},[delay]);
  return <div style={{opacity:v?1:0,transition:`opacity ${duration}ms ease`,...style}}>{children}</div>;
};

const AnimatedHeading:React.FC<{text:string;style?:React.CSSProperties}>=({text,style={}})=>{
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t);},[]);
  const lines=text.split('\n');
  return <h1 style={{margin:0,...style}}>{lines.map((line,li)=>{const prev=lines.slice(0,li).reduce((acc,l)=>acc+l.length,0);return <span key={li} style={{display:'block'}}>{line.split('').map((char,ci)=>{const delay=(200+(prev+ci)*30)/1000;return <span key={ci} style={{display:'inline-block',opacity:a?1:0,transform:a?'translateX(0)':'translateX(-18px)',transition:`opacity 500ms ease ${delay}s,transform 500ms ease ${delay}s`}}>{char===' '?'\u00A0':char}</span>;})}</span>;})}</h1>;
};

/* 3D Tilt Card */
const TiltCard:React.FC<{children:React.ReactNode;style?:React.CSSProperties;intensity?:number}>=({children,style={},intensity=8})=>{
  const mx=useMotionValue(0),my=useMotionValue(0);
  const rx=useSpring(useTransform(my,[-0.5,0.5],[intensity,-intensity]),{stiffness:200,damping:30});
  const ry=useSpring(useTransform(mx,[-0.5,0.5],[-intensity,intensity]),{stiffness:200,damping:30});
  const gx=useTransform(mx,[-0.5,0.5],['0%','100%']);
  const gy=useTransform(my,[-0.5,0.5],['0%','100%']);
  const move=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();mx.set((e.clientX-r.left)/r.width-0.5);my.set((e.clientY-r.top)/r.height-0.5);};
  return <motion.div style={{perspective:900,transformStyle:'preserve-3d',...style}} onMouseMove={move} onMouseLeave={()=>{mx.set(0);my.set(0);}}>
    <motion.div style={{rotateX:rx,rotateY:ry,transformStyle:'preserve-3d',width:'100%',height:'100%',position:'relative'}}>
      {children}
      <motion.div style={{position:'absolute',inset:0,borderRadius:'inherit',pointerEvents:'none',background:`radial-gradient(circle at ${gx} ${gy},rgba(242,167,184,0.12) 0%,transparent 65%)`,zIndex:10}}/>
    </motion.div>
  </motion.div>;
};

/* Scroll Reveal */
const Reveal:React.FC<{children:React.ReactNode;direction?:'up'|'left'|'right'|'scale'|'fade';delay?:number;style?:React.CSSProperties}>=({children,direction='up',delay=0,style={}})=>{
  const variants={hidden:{opacity:0,y:direction==='up'?50:0,x:direction==='left'?-50:direction==='right'?50:0,scale:direction==='scale'?0.8:1,filter:'blur(4px)'},visible:{opacity:1,y:0,x:0,scale:1,filter:'blur(0px)',transition:{duration:0.9,ease:[0.22,1,0.36,1],delay}}};
  return <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} style={style}>{children}</motion.div>;
};

/* ════════════════════════════════════════
   JAPANESE SVG ASSETS
════════════════════════════════════════ */

/* Sakura Petal Canvas */
const SakuraCanvas:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext('2d');if(!ctx)return;
    let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};
    resize();window.addEventListener('resize',resize);
    const petals=Array.from({length:35},()=>({
      x:Math.random()*1400,y:Math.random()*-800,
      r:Math.random()*5+3,vx:Math.random()*1.2-0.4,vy:Math.random()*1.5+0.8,
      rot:Math.random()*360,vrot:Math.random()*2-1,
      a:Math.random()*0.6+0.3,swing:Math.random()*60,swingSpeed:Math.random()*0.02+0.01,t:Math.random()*100,
    }));
    const drawPetal=(x:number,y:number,r:number,rot:number,a:number)=>{
      ctx.save();ctx.translate(x,y);ctx.rotate(rot*Math.PI/180);ctx.globalAlpha=a;
      ctx.beginPath();
      ctx.moveTo(0,0);ctx.bezierCurveTo(r,r*0.5,r*1.5,-r*0.5,r*2,0);
      ctx.bezierCurveTo(r*1.5,r*0.5,r,-r*0.3,0,0);
      const grad=ctx.createLinearGradient(0,-r,r*2,r);
      grad.addColorStop(0,'rgba(255,182,193,'+a+')');
      grad.addColorStop(0.5,'rgba(255,150,170,'+a*0.9+')');
      grad.addColorStop(1,'rgba(220,120,140,'+a*0.7+')');
      ctx.fillStyle=grad;ctx.fill();ctx.restore();
    };
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      petals.forEach(p=>{
        p.t+=p.swingSpeed;p.x+=p.vx+Math.sin(p.t)*0.4;p.y+=p.vy;p.rot+=p.vrot;
        if(p.y>c.height+20){p.y=-20;p.x=Math.random()*c.width;}
        if(p.x>c.width+20)p.x=-20;if(p.x<-20)p.x=c.width+20;
        drawPetal(p.x,p.y,p.r,p.rot,p.a);
      });
      raf=requestAnimationFrame(tick);
    };
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1}}/>;
};

/* ════════════════════════════════════════
   KANJI FLOATING LAYER 漢字
════════════════════════════════════════ */
const KANJI_POOL=['引','こ','も','り','愛','情','熱','孤','独','静','心','夢','道','力','美','闇','光','空','風','雪','花','月','星','海','山','火','水','木','魂','絆','詩','侘','寂','間','無','気','命','縁','悲','涙','歌','記','憶','幻','霧','影','永','刹','那','煌','儚','想','願','祈','響','沈','漂','揺','廻','暁'];

const KanjiCanvas:React.FC=()=>{
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const container=ref.current;if(!container)return;
    const particles:HTMLSpanElement[]=[];
    let timer:ReturnType<typeof setInterval>;
    const rand=(a:number,b:number)=>a+Math.random()*(b-a);
    const spawn=()=>{
      const el=document.createElement('span');
      const isAccent=Math.random()<0.2;
      el.textContent=KANJI_POOL[Math.floor(Math.random()*KANJI_POOL.length)];
      const size=rand(14,70);
      const x=rand(1,95);
      const startY=rand(60,100);
      const dur=rand(10,24);
      const delay=rand(0,dur);
      const r0=rand(-28,28);
      const r1=r0+rand(-32,32);
      const op=isAccent?rand(0.25,0.55):rand(0.05,0.22);
      const sc=rand(0.75,1.2);
      Object.assign(el.style,{
        position:'absolute',
        fontFamily:"'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
        fontWeight:'900',
        fontSize:`${size}px`,
        left:`${x}%`,
        top:`${startY}%`,
        color:isAccent?`rgba(220,145,55,${op})`:`rgba(210,160,80,${op})`,
        pointerEvents:'none',
        userSelect:'none',
        willChange:'transform,opacity',
        animation:`hkmFloat ${dur}s ${-delay}s linear infinite`,
        '--r0':`${r0}deg`,
        '--r1':`${r1}deg`,
        '--sc':`${sc}`,
      } as React.CSSProperties & Record<string,string>);
      container.appendChild(el);
      particles.push(el);
      if(particles.length>60){const old=particles.shift();old&&container.removeChild(old);}
    };
    for(let i=0;i<45;i++)spawn();
    timer=setInterval(spawn,600);
    return()=>{clearInterval(timer);particles.forEach(p=>{try{container.removeChild(p);}catch{}});};
  },[]);
  return(
    <>
      <style>{`
        @keyframes hkmFloat{
          0%{transform:translateY(0) rotate(var(--r0)) scale(1);opacity:var(--op,0.15);}
          45%{opacity:calc(var(--op,0.15)*2.2);}
          85%{opacity:var(--op,0.15);}
          100%{transform:translateY(-600px) rotate(var(--r1)) scale(var(--sc));opacity:0;}
        }
      `}</style>
      <div ref={ref} style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',overflow:'hidden'}}/>
    </>
  );
};

/* Ink Brush Strokes Overlay 墨 */
const InkBrushOverlay:React.FC=()=>(
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.18}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1400 900">
    <path d="M30,130 C110,175 200,110 370,220" stroke="#b07828" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.9"/>
    <path d="M370,220 C470,275 560,195 720,310" stroke="#b07828" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.75"/>
    <path d="M720,310 C840,390 950,280 1150,160" stroke="#b07828" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/>
    <path d="M1200,80 C1260,180 1340,130 1370,320" stroke="#b07828" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M60,500 C180,570 310,480 480,610" stroke="#b07828" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.65"/>
    <path d="M480,610 C590,680 700,580 880,680" stroke="#b07828" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M100,760 C240,800 380,745 550,810" stroke="#b07828" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.55"/>
    <path d="M900,700 C1000,750 1080,700 1200,760" stroke="#b07828" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5"/>
    {/* Ink blots at stroke starts */}
    <ellipse cx="32" cy="132" rx="18" ry="11" fill="#8a5c18" opacity="0.7"/>
    <ellipse cx="1152" cy="163" rx="14" ry="9" fill="#8a5c18" opacity="0.65"/>
    <ellipse cx="63" cy="503" rx="20" ry="12" fill="#8a5c18" opacity="0.6"/>
    <ellipse cx="103" cy="762" rx="12" ry="7" fill="#8a5c18" opacity="0.55"/>
    <ellipse cx="1202" cy="83" rx="13" ry="8" fill="#8a5c18" opacity="0.6"/>
    {/* Fine splatter drops */}
    <circle cx="450" cy="195" r="4" fill="#8a5c18" opacity="0.5"/>
    <circle cx="820" cy="290" r="3" fill="#8a5c18" opacity="0.45"/>
    <circle cx="1050" cy="210" r="5" fill="#8a5c18" opacity="0.4"/>
    <circle cx="350" cy="580" r="4" fill="#8a5c18" opacity="0.4"/>
    <circle cx="700" cy="650" r="3" fill="#8a5c18" opacity="0.35"/>
  </svg>
);

/* Stars */
const Stars:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    const stars=Array.from({length:100},()=>({x:Math.random()*1400,y:Math.random()*900,r:Math.random()*1.2+0.2,a:Math.random(),da:(Math.random()*0.005+0.001)*(Math.random()<0.5?1:-1)}));
    const shoots:any[]=[]; let next=0,t=0;
    const spawn=()=>{const a=(Math.random()*25+15)*Math.PI/180,sp=Math.random()*7+6,len=Math.random()*120+80,life=len/sp;shoots.push({x:Math.random()*c.width*0.8,y:Math.random()*c.height*0.4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len,life,maxLife:life});};
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s=>{s.a=Math.max(0.1,Math.min(1,s.a+s.da));if(s.a<=0.1||s.a>=1)s.da*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(232,232,245,${s.a})`;ctx.fill();});
      t++;if(t>=next){spawn();next=t+Math.floor(Math.random()*200+100);}
      for(let i=shoots.length-1;i>=0;i--){const s=shoots[i];const prog=1-s.life/s.maxLife;const alpha=s.life<20?s.life/20:1;const ang=Math.atan2(s.vy,s.vx);const tx=s.x-Math.cos(ang)*s.len*Math.min(prog*2,1);const ty=s.y-Math.sin(ang)*s.len*Math.min(prog*2,1);const g=ctx.createLinearGradient(tx,ty,s.x,s.y);g.addColorStop(0,'rgba(201,168,76,0)');g.addColorStop(1,`rgba(232,232,245,${alpha})`);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.stroke();s.x+=s.vx;s.y+=s.vy;s.life--;if(s.life<=0)shoots.splice(i,1);}
      raf=requestAnimationFrame(tick);
    };
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}/>;
};

/* Cherry Blossom Tree */
const CherryTree:React.FC<{style?:React.CSSProperties;scale?:number;delay?:number;flip?:boolean}>=({style={},scale=1,delay=0,flip=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transformOrigin:'bottom center',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{rotate:[0,1.2,-0.8,0.5,0],scaleX:[1,1.01,0.99,1]}} transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 120 220" width={120*scale} height={220*scale}>
      {/* Trunk */}
      <path d="M58 220 Q55 180 52 150 Q48 120 50 90" stroke="#5c3d1e" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M62 220 Q65 180 68 150 Q72 120 70 90" stroke="#7a5230" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* Main branches */}
      <path d="M50 90 Q30 70 15 50" stroke="#5c3d1e" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M70 90 Q90 70 105 50" stroke="#5c3d1e" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M55 110 Q40 90 25 80" stroke="#5c3d1e" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M65 110 Q80 90 95 80" stroke="#5c3d1e" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Blossom clusters */}
      {[{cx:15,cy:44,r:22},{cx:105,cy:44,r:20},{cx:25,cy:72,r:18},{cx:95,cy:72,r:17},{cx:60,cy:35,r:25},{cx:45,cy:60,r:16},{cx:75,cy:58,r:16},{cx:60,cy:80,r:14}].map((b,i)=>(
        <g key={i}>
          <ellipse cx={b.cx} cy={b.cy} rx={b.r} ry={b.r*0.85} fill={`rgba(255,182,193,${0.35+i%3*0.1})`}/>
          <ellipse cx={b.cx} cy={b.cy} rx={b.r*0.7} ry={b.r*0.6} fill={`rgba(255,150,170,${0.25+i%2*0.1})`}/>
          {[...Array(5)].map((_,j)=>{ const a=j*72*Math.PI/180; return <circle key={j} cx={b.cx+Math.cos(a)*b.r*0.5} cy={b.cy+Math.sin(a)*b.r*0.45} r={b.r*0.18} fill={`rgba(255,210,220,0.7)`}/>; })}
        </g>
      ))}
    </svg>
  </motion.div>
);

/* Torii Gate */
const ToriiGate:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.18})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{opacity:[opacity,opacity*1.4,opacity],y:[0,-4,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 200 260" width="200" height="260">
      {/* Top kasagi */}
      <rect x="5" y="20" width="190" height="16" rx="3" fill={J.vermillion}/>
      {/* Top arch (nuki upper) */}
      <path d="M5 36 Q100 10 195 36" stroke={J.vermillion} strokeWidth="8" fill="none"/>
      {/* Shimaki (second beam) */}
      <rect x="18" y="55" width="164" height="12" rx="2" fill={J.vermillion}/>
      {/* Columns */}
      <rect x="28" y="67" width="18" height="193" rx="4" fill={J.vermillionL}/>
      <rect x="154" y="67" width="18" height="193" rx="4" fill={J.vermillionL}/>
      {/* Nuki (tie beams) */}
      <rect x="20" y="110" width="160" height="9" rx="2" fill={J.vermillion} opacity="0.7"/>
      {/* Glow */}
      <rect x="5" y="20" width="190" height="16" rx="3" fill={J.vermillion} opacity="0.3" filter="blur(4px)"/>
    </svg>
  </motion.div>
);

/* Bamboo Forest */
const BambooForest:React.FC<{style?:React.CSSProperties;count?:number}>=({style={},count=5})=>(
  <div style={{position:'absolute',pointerEvents:'none',...style}}>
    {Array.from({length:count},(_,i)=>(
      <motion.div key={i} style={{position:'absolute',left:i*22,bottom:0,transformOrigin:'bottom center'}}
        animate={{rotate:[0,1.5,-1,1.2,0],scaleX:[1,1.02,0.98,1]}} transition={{duration:3.5+i*0.4,repeat:Infinity,ease:'easeInOut',delay:i*0.3}}>
        <svg viewBox="0 0 20 200" width={16+i%2*4} height={160+i*20}>
          <line x1="8" y1="200" x2="10" y2="0" stroke={J.bambooL} strokeWidth="3.5" strokeLinecap="round" opacity={0.6+i*0.06}/>
          {[20,50,80,110,140].map((y,j)=>(
            <g key={j}>
              <line x1="3" y1={y} x2="15" y2={y} stroke={J.bambooD} strokeWidth="1.5" opacity="0.8"/>
              <path d={`M10 ${y} Q22 ${y-18} 28 ${y-8}`} stroke={J.bambooL} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
              <path d={`M10 ${y} Q-2 ${y-15} -8 ${y-5}`} stroke={J.bambooL} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
            </g>
          ))}
        </svg>
      </motion.div>
    ))}
  </div>
);

/* Mount Fuji */
const MountFuji:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.12})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{opacity:[opacity,opacity*1.3,opacity]}} transition={{duration:8,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 400 200" width="400" height="200">
      {/* Mountain body */}
      <path d="M0 200 L200 20 L400 200 Z" fill={`rgba(26,31,56,0.8)`}/>
      {/* Snow cap */}
      <path d="M160 65 L200 20 L240 65 Q220 58 200 55 Q180 58 160 65 Z" fill={`rgba(232,232,245,0.85)`}/>
      {/* Snow detail */}
      <path d="M170 72 Q200 62 230 72 Q210 66 200 64 Q190 66 170 72 Z" fill={`rgba(200,200,225,0.6)`}/>
      {/* Mist layers */}
      <ellipse cx="200" cy="130" rx="200" ry="25" fill={`rgba(20,25,45,0.5)`}/>
      <ellipse cx="200" cy="150" rx="200" ry="20" fill={`rgba(15,20,40,0.4)`}/>
    </svg>
  </motion.div>
);

/* Origami Crane */
const OrigamiCrane:React.FC<{style?:React.CSSProperties;size?:number;delay?:number;color?:string}>=({style={},size=40,delay=0,color=J.sakura})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{y:[0,-25,0],x:[0,12,-8,0],rotate:[0,8,-5,0],opacity:[0.4,0.85,0.4]}}
    transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 60 50" width={size} height={size*0.83}>
      {/* Body */}
      <polygon points="30,5 50,30 30,22 10,30" fill={color} opacity="0.8"/>
      {/* Left wing */}
      <polygon points="10,30 30,22 5,45" fill={color} opacity="0.65"/>
      {/* Right wing */}
      <polygon points="50,30 30,22 55,45" fill={color} opacity="0.65"/>
      {/* Tail */}
      <polygon points="30,22 28,48 32,48" fill={color} opacity="0.7"/>
      {/* Head */}
      <polygon points="30,5 38,12 33,18" fill={color} opacity="0.9"/>
      {/* Beak */}
      <line x1="33" y1="12" x2="42" y2="8" stroke={color} strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
    </svg>
  </motion.div>
);

/* Paper Lantern */
const Lantern:React.FC<{style?:React.CSSProperties;delay?:number;size?:number}>=({style={},delay=0,size=50})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{y:[0,-12,0],rotate:[0,3,-3,0]}} transition={{duration:3.5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 50 80" width={size} height={size*1.6}>
      {/* String */}
      <line x1="25" y1="0" x2="25" y2="10" stroke={J.gold} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="10" x2="32" y2="10" stroke={J.gold} strokeWidth="2" strokeLinecap="round"/>
      {/* Body glow */}
      <ellipse cx="25" cy="40" rx="16" ry="22" fill={`rgba(232,200,106,0.08)`}/>
      {/* Body */}
      <path d="M12 22 Q8 40 12 58 Q25 65 38 58 Q42 40 38 22 Q25 16 12 22 Z" fill={J.vermillion}/>
      {/* Ribs */}
      {[28,35,42,49].map(y=><ellipse key={y} cx="25" cy={y} rx="13" ry="2.5" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1"/>)}
      {/* Inner glow */}
      <ellipse cx="25" cy="40" rx="10" ry="16" fill={`rgba(255,220,100,0.3)`}/>
      {/* Bottom tassel */}
      <line x1="25" y1="63" x2="25" y2="72" stroke={J.gold} strokeWidth="1.5"/>
      <ellipse cx="25" cy="73" rx="4" ry="2" fill={J.gold} opacity="0.8"/>
      {/* Kanji character */}
      <text x="25" y="44" textAnchor="middle" fontSize="12" fill="rgba(255,240,180,0.7)" fontWeight="bold">和</text>
    </svg>
    {/* Light glow under lantern */}
    <motion.div animate={{opacity:[0.3,0.6,0.3],scale:[1,1.2,1]}} transition={{duration:1.8+delay,repeat:Infinity,ease:'easeInOut'}}
      style={{position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',width:30,height:12,borderRadius:'50%',background:'rgba(255,200,80,0.3)',filter:'blur(6px)'}}/>
  </motion.div>
);

/* Enso Circle */
const Enso:React.FC<{style?:React.CSSProperties;size?:number;opacity?:number}>=({style={},size=120,opacity=0.15})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{rotate:360}} transition={{duration:40,repeat:Infinity,ease:'linear'}}>
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <motion.path d="M60 10 A50 50 0 1 1 59.9 10" fill="none" stroke={J.gold} strokeWidth="4" strokeLinecap="round"
        initial={{pathLength:0,opacity:0}} animate={{pathLength:0.92,opacity:1}} transition={{duration:2.5,ease:'easeInOut',delay:0.5}}/>
      <motion.path d="M60 18 A42 42 0 1 1 59.9 18" fill="none" stroke={J.sakura} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"
        initial={{pathLength:0}} animate={{pathLength:0.7}} transition={{duration:3,ease:'easeInOut',delay:1}}/>
    </svg>
  </motion.div>
);

/* Koi Fish */
const KoiFish:React.FC<{style?:React.CSSProperties;delay?:number;flip?:boolean}>=({style={},delay=0,flip=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transform:flip?'scaleY(-1)':'none',...style}}
    animate={{x:[0,80,160,80,0],y:[0,20,-10,30,0],rotate:[0,5,-5,8,0]}}
    transition={{duration:12+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 80 30" width="80" height="30">
      {/* Body */}
      <ellipse cx="38" cy="15" rx="28" ry="11" fill={J.vermillion} opacity="0.7"/>
      {/* Scales pattern */}
      {[[20,10],[28,8],[36,7],[44,8],[20,15],[28,13],[36,12],[44,13],[20,20],[28,18],[36,17],[44,18]].map(([x,y],i)=>
        <ellipse key={i} cx={x} cy={y} rx="5" ry="3.5" fill="none" stroke="rgba(200,60,40,0.4)" strokeWidth="0.8"/>
      )}
      {/* Tail */}
      <path d="M66 15 Q75 5 78 12 Q75 15 78 18 Q75 25 66 15 Z" fill={J.vermillion} opacity="0.6"/>
      {/* Fins */}
      <path d="M38 4 Q45 -2 50 4" fill={J.gold} opacity="0.5"/>
      <path d="M25 15 Q20 22 28 22" fill={J.gold} opacity="0.4"/>
      {/* White markings */}
      <ellipse cx="32" cy="12" rx="7" ry="5" fill="rgba(255,255,255,0.35)"/>
      {/* Eye */}
      <circle cx="14" cy="13" r="3" fill="rgba(0,0,0,0.7)"/>
      <circle cx="13.5" cy="12.5" r="1" fill="white"/>
    </svg>
  </motion.div>
);

/* Wave (Hokusai) */
const WaveDecor:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.12})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{x:[-20,20,-20],y:[0,-8,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 300 80" width="300" height="80">
      <path d="M0 50 Q30 20 60 40 Q90 60 120 35 Q150 10 180 35 Q210 60 240 38 Q270 16 300 42" fill="none" stroke={J.indigo} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M0 60 Q30 30 60 50 Q90 70 120 45 Q150 20 180 45 Q210 70 240 48 Q270 26 300 52" fill="none" stroke={J.indigoL} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      {/* Foam tips */}
      {[60,120,180,240].map(x=><ellipse key={x} cx={x} cy={35} rx="8" ry="4" fill="rgba(232,232,245,0.3)"/>)}
    </svg>
  </motion.div>
);

/* Floating particles (mon circles) */
const MonCircle:React.FC<{style?:React.CSSProperties;delay?:number;size?:number}>=({style={},delay=0,size=30})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{y:[0,-20,0],rotate:[0,180,360],opacity:[0.15,0.35,0.15]}} transition={{duration:8+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="18" fill="none" stroke={J.gold} strokeWidth="1.5" opacity="0.8"/>
      <circle cx="20" cy="20" r="12" fill="none" stroke={J.gold} strokeWidth="1" opacity="0.5"/>
      {[...Array(8)].map((_,i)=>{const a=i*45*Math.PI/180;return <circle key={i} cx={20+Math.cos(a)*14} cy={20+Math.sin(a)*14} r="2" fill={J.gold} opacity="0.6"/>;  })}
      <circle cx="20" cy="20" r="3" fill={J.gold} opacity="0.7"/>
    </svg>
  </motion.div>
);

/* Ink Drop Ripple on hover */
const InkRipple:React.FC<{children:React.ReactNode;style?:React.CSSProperties}>=({children,style={}})=>{
  const [ripples,setRipples]=useState<{id:number;x:number;y:number}[]>([]);
  const handleClick=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    const id=Date.now();
    setRipples(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRipples(p=>p.filter(r=>r.id!==id)),800);
  };
  return <div style={{position:'relative',overflow:'hidden',...style}} onClick={handleClick}>
    {children}
    {ripples.map(r=><motion.div key={r.id} style={{position:'absolute',left:r.x,top:r.y,width:0,height:0,borderRadius:'50%',border:`2px solid ${J.sakura}`,transform:'translate(-50%,-50%)',pointerEvents:'none'}}
      animate={{width:200,height:200,opacity:[0.6,0]}} transition={{duration:0.8,ease:'easeOut'}}/>)}
  </div>;
};


/* ════════════════════════════════════════
   JAPAN BACKGROUND SYSTEM 和の背景
════════════════════════════════════════ */

/* Gold circuit line canvas */
const GoldLines:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext('2d');if(!ctx)return;
    let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};
    resize();window.addEventListener('resize',resize);
    interface Line{x1:number;y1:number;x2:number;y2:number;prog:number;speed:number;alpha:number;dir:1|-1;}
    const lines:Line[]=Array.from({length:18},()=>({
      x1:Math.random()*1400,y1:Math.random()*900,
      x2:Math.random()*1400,y2:Math.random()*900,
      prog:Math.random(),speed:Math.random()*0.003+0.001,
      alpha:Math.random()*0.3+0.1,dir:(Math.random()<0.5?1:-1) as 1|-1,
    }));
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      lines.forEach(l=>{
        l.prog+=l.speed*l.dir;
        if(l.prog>1){l.prog=1;l.dir=-1;l.x2=Math.random()*c.width;l.y2=Math.random()*c.height;}
        if(l.prog<0){l.prog=0;l.dir=1;l.x1=Math.random()*c.width;l.y1=Math.random()*c.height;}
        const grd=ctx.createLinearGradient(l.x1,l.y1,l.x2,l.y2);
        grd.addColorStop(0,`rgba(184,146,42,0)`);
        grd.addColorStop(l.prog*0.4,`rgba(184,146,42,${l.alpha*0.5})`);
        grd.addColorStop(l.prog,`rgba(212,176,80,${l.alpha})`);
        grd.addColorStop(Math.min(l.prog+0.05,1),`rgba(184,146,42,${l.alpha*0.5})`);
        grd.addColorStop(1,`rgba(184,146,42,0)`);
        ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);
        ctx.strokeStyle=grd;ctx.lineWidth=0.8;ctx.stroke();
        // node dots
        const nx=l.x1+(l.x2-l.x1)*l.prog;
        const ny=l.y1+(l.y2-l.y1)*l.prog;
        ctx.beginPath();ctx.arc(nx,ny,1.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(212,176,80,${l.alpha*1.5})`;ctx.fill();
      });
      raf=requestAnimationFrame(tick);
    };
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2}}/>;
};

/* Crack texture SVG overlay */
const CrackOverlay:React.FC=()=>(
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.18}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 900">
    <path d="M120 50 L180 120 L140 200 L200 280 L160 380 L220 450 L180 560 L240 640 L200 750 L260 850" stroke="rgba(180,140,80,0.7)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    <path d="M280 30 L240 100 L290 180 L250 260 L300 350 L260 440 L310 520 L270 620 L320 720 L280 820" stroke="rgba(180,140,80,0.6)" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
    <path d="M60 150 L120 180 L80 230 L150 260 L100 320" stroke="rgba(160,120,60,0.5)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    <path d="M320 200 L360 240 L310 290 L370 340 L330 400" stroke="rgba(160,120,60,0.4)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    <path d="M180 120 L230 140 L200 160 L250 185" stroke="rgba(180,140,80,0.45)" strokeWidth="0.4" fill="none" strokeLinecap="round"/>
    <path d="M140 200 L100 220 L130 245 L90 265" stroke="rgba(160,120,60,0.4)" strokeWidth="0.4" fill="none" strokeLinecap="round"/>
    <path d="M240 450 L280 470 L260 500 L300 520" stroke="rgba(180,140,80,0.35)" strokeWidth="0.4" fill="none" strokeLinecap="round"/>
    {/* Diamond pattern scattered */}
    {[[90,300],[210,400],[330,500],[150,600],[270,700],[100,800],[350,750]].map(([x,y],i)=>(
      <g key={i} transform={`translate(${x},${y}) rotate(45)`}>
        <rect x="-4" y="-4" width="8" height="8" fill="none" stroke="rgba(180,140,80,0.3)" strokeWidth="0.5"/>
      </g>
    ))}
  </svg>
);

/* Smoke cloud SVG */
const SmokeCloud:React.FC<{style?:React.CSSProperties;delay?:number;flip?:boolean}>=({style={},delay=0,flip=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',filter:'blur(18px)',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{x:[0,15,0,-10,0],y:[0,-8,0,-5,0],opacity:[0.5,0.7,0.4,0.6,0.5]}}
    transition={{duration:8+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 200 100" width="200" height="100">
      <ellipse cx="100" cy="60" rx="90" ry="40" fill="rgba(15,10,5,0.85)"/>
      <ellipse cx="70"  cy="45" rx="55" ry="35" fill="rgba(20,12,6,0.8)"/>
      <ellipse cx="130" cy="48" rx="50" ry="30" fill="rgba(18,10,5,0.75)"/>
      <ellipse cx="100" cy="35" rx="40" ry="28" fill="rgba(25,15,8,0.7)"/>
    </svg>
  </motion.div>
);

/* Kamon floor glow circle */
const KamonFloor:React.FC<{style?:React.CSSProperties;delay?:number;size?:number}>=({style={},delay=0,size=120})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{opacity:[0.15,0.4,0.15],scale:[0.95,1.05,0.95]}}
    transition={{duration:4+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 120 120" width={size} height={size}>
      {/* Outer glow ring */}
      <circle cx="60" cy="60" r="56" fill="none" stroke={J.vermillion} strokeWidth="1" opacity="0.6"/>
      <circle cx="60" cy="60" r="52" fill="none" stroke={J.gold} strokeWidth="0.5" opacity="0.4"/>
      {/* Inner sakura pattern */}
      <circle cx="60" cy="60" r="30" fill="none" stroke={J.vermillion} strokeWidth="1.2" opacity="0.7"/>
      {/* 6 petals */}
      {[...Array(6)].map((_,i)=>{
        const a=i*60*Math.PI/180;
        return <ellipse key={i} cx={60+Math.cos(a)*20} cy={60+Math.sin(a)*20} rx="10" ry="7"
          fill={`rgba(146,32,24,0.25)`} stroke={J.vermillion} strokeWidth="0.8" opacity="0.7"
          transform={`rotate(${i*60+30},${60+Math.cos(a)*20},${60+Math.sin(a)*20})`}/>;
      })}
      {/* Center */}
      <circle cx="60" cy="60" r="6" fill={`rgba(146,32,24,0.4)`} stroke={J.gold} strokeWidth="1"/>
      {/* Radial glow */}
      <circle cx="60" cy="60" r="56" fill={`rgba(146,32,24,0.04)`}/>
    </svg>
    {/* Ground glow under */}
    <motion.div animate={{opacity:[0.2,0.5,0.2],scale:[1,1.15,1]}} transition={{duration:3+delay,repeat:Infinity}}
      style={{position:'absolute',inset:-20,borderRadius:'50%',background:`radial-gradient(circle,rgba(146,32,24,0.25) 0%,transparent 70%)`,filter:'blur(8px)'}}/>
  </motion.div>
);

/* Rising Sun element */
const RisingSun:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.12})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{scale:[1,1.04,1],opacity:[opacity,opacity*1.6,opacity]}}
    transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 160 160" width="160" height="160">
      {/* Outer rays */}
      {[...Array(12)].map((_,i)=>{
        const a=i*30*Math.PI/180;
        return <line key={i} x1={80+Math.cos(a)*62} y1={80+Math.sin(a)*62}
          x2={80+Math.cos(a)*76} y2={80+Math.sin(a)*76}
          stroke={J.vermillion} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>;
      })}
      {/* Main circle */}
      <circle cx="80" cy="80" r="55" fill={`rgba(146,32,24,0.18)`} stroke={J.vermillion} strokeWidth="2"/>
      <circle cx="80" cy="80" r="42" fill={`rgba(146,32,24,0.22)`} stroke={J.vermillionL} strokeWidth="1"/>
      <circle cx="80" cy="80" r="28" fill={`rgba(146,32,24,0.3)`}/>
      {/* Wave pattern inside */}
      <path d="M50 80 Q60 70 70 80 Q80 90 90 80 Q100 70 110 80" fill="none" stroke="rgba(200,80,60,0.3)" strokeWidth="1.5"/>
    </svg>
  </motion.div>
);

/* Isometric building silhouette */
const IsoBuilding:React.FC<{style?:React.CSSProperties;flip?:boolean;delay?:number}>=({style={},flip=false,delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{opacity:[0.3,0.5,0.3]}} transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 120 140" width="120" height="140">
      {/* Roof */}
      <polygon points="10,50 60,10 110,50" fill={`rgba(15,10,6,0.9)`} stroke={`rgba(180,140,80,0.3)`} strokeWidth="1"/>
      <polygon points="20,50 60,18 100,50" fill={`rgba(25,15,8,0.8)`}/>
      {/* Roof curve tips */}
      <path d="M10 50 Q5 45 8 40" stroke={`rgba(180,140,80,0.4)`} strokeWidth="1.5" fill="none"/>
      <path d="M110 50 Q115 45 112 40" stroke={`rgba(180,140,80,0.4)`} strokeWidth="1.5" fill="none"/>
      {/* Walls */}
      <rect x="20" y="50" width="80" height="60" fill={`rgba(12,8,4,0.88)`} stroke={`rgba(180,140,80,0.2)`} strokeWidth="1"/>
      {/* Windows */}
      {[[35,65],[60,65],[85,65],[45,90],[75,90]].map(([x,y],i)=>(
        <rect key={i} x={x-5} y={y-7} width="10" height="14" rx="1"
          fill={`rgba(212,160,60,0.15)`} stroke={`rgba(212,160,60,0.3)`} strokeWidth="0.5"/>
      ))}
      {/* Lantern hanging */}
      <line x1="60" y1="10" x2="60" y2="22" stroke={`rgba(180,140,80,0.4)`} strokeWidth="1"/>
      <rect x="54" y="22" width="12" height="18" rx="3" fill={`rgba(180,40,20,0.5)`} stroke={`rgba(212,160,60,0.4)`} strokeWidth="0.8"/>
      <motion.rect x="54" y="22" width="12" height="18" rx="3" fill={`rgba(255,180,60,0.1)`}
        animate={{opacity:[0.1,0.3,0.1]}} transition={{duration:1.5+delay,repeat:Infinity}}/>
      {/* Kamon on wall */}
      <circle cx="60" cy="75" r="8" fill="none" stroke={`rgba(180,40,20,0.35)`} strokeWidth="0.8"/>
      <circle cx="60" cy="75" r="3" fill={`rgba(180,40,20,0.3)`}/>
    </svg>
  </motion.div>
);

/* Shared Japan background wrapper - uses image as fixed bg */
const JapanBgSection:React.FC<{children:React.ReactNode;overlayColor?:string;style?:React.CSSProperties}>=({
  children,
  overlayColor='rgba(12,8,5,0.78)',
  style={},
})=>(
  <section style={{
    position:'relative',
    padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',
    overflow:'hidden',
    backgroundImage:"url('/japan-bg.jpg')",
    backgroundSize:'cover',
    backgroundPosition:'center top',
    backgroundAttachment:'fixed',
    ...style,
  }}>
    {/* Primary dark overlay — key for text readability */}
    <div style={{position:'absolute',inset:0,background:overlayColor,zIndex:0}}/>
    {/* Warm vignette */}
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,rgba(30,10,5,0.1) 0%,rgba(8,4,2,0.55) 100%)',zIndex:0}}/>
    {/* Top/bottom fades to J.ink for seamless section joins */}
    <div style={{position:'absolute',top:0,left:0,right:0,height:100,background:`linear-gradient(to bottom,${J.ink},transparent)`,zIndex:3,pointerEvents:'none'}}/>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:100,background:`linear-gradient(to top,${J.ink},transparent)`,zIndex:3,pointerEvents:'none'}}/>
    {/* Crack texture */}
    <CrackOverlay/>
    {/* Gold circuit lines */}
    <GoldLines/>
    {/* Content */}
    <div style={{position:'relative',zIndex:4}}>
      {children}
    </div>
  </section>
);

/* ════════════════════════════════════════
   MARQUEE
════════════════════════════════════════ */
const Marquee:React.FC<{contact:ContactData}>=({contact})=>{
  const items=[
    contact.instagram&&{icon:'📸',label:'Instagram',value:'@'+contact.instagram,href:'https://instagram.com/'+contact.instagram},
    contact.linkedin &&{icon:'💼',label:'LinkedIn', value:contact.linkedin,      href:'https://linkedin.com/in/'+contact.linkedin},
    contact.twitter  &&{icon:'🐦',label:'Twitter',  value:'@'+contact.twitter,  href:'https://twitter.com/'+contact.twitter},
    contact.email    &&{icon:'📧',label:'Email',    value:contact.email,         href:'mailto:'+contact.email},
    contact.website  &&{icon:'🌐',label:'Website',  value:contact.website,       href:'https://'+contact.website},
    contact.location &&{icon:'🗾',label:'Location', value:contact.location,      href:null},
    {icon:'🌸',label:'Japanese Portfolio',value:'和モダン',href:null},
    {icon:'⛩️',label:'Hikimori',value:'Creative Works',href:null},
  ].filter(Boolean) as {icon:string;label:string;value:string;href:string|null}[];
  const doubled=[...items,...items,...items];
  return (
    <div style={{width:'100%',overflow:'hidden',background:`linear-gradient(90deg,${J.vermillion},#a82d22,${J.vermillion})`,padding:'10px 0',position:'relative',zIndex:10,borderTop:`1px solid rgba(255,255,255,0.1)`,borderBottom:`1px solid rgba(255,255,255,0.1)`}}>
      <motion.div style={{display:'flex',width:'max-content'}}
        animate={{x:['0%','-33.33%']}} transition={{duration:24,repeat:Infinity,ease:'linear'}}>
        {doubled.map((item,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'0 24px',flexShrink:0,whiteSpace:'nowrap'}}>
            <span style={{fontSize:'0.88rem'}}>{item.icon}</span>
            <span style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:700,color:'rgba(255,230,200,0.7)',textTransform:'uppercase',letterSpacing:'1.5px'}}>{item.label}</span>
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:'0.8rem'}}>·</span>
            {item.href
              ?<a href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(255,240,220,0.9)',textDecoration:'none'}}>{item.value}</a>
              :<span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(255,240,220,0.9)'}}>{item.value}</span>}
            <span style={{color:'rgba(255,255,255,0.2)',marginLeft:8}}>✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ════════════════════════════════════════
   CERT CARD
════════════════════════════════════════ */
const CertCard:React.FC<{cert:CertItem;index:number}>=({cert,index})=>{
  const [open,setOpen]=useState(false);
  const [imgLoaded,setImgLoaded]=useState(false);
  return (
    <Reveal direction="up" delay={index*0.09}>
      <InkRipple>
        <motion.div
          whileHover={!open?{y:-4,boxShadow:`0 20px 60px rgba(192,57,43,0.15), 0 0 0 1px rgba(192,57,43,0.25)`}:{}}
          style={{borderRadius:16,overflow:'hidden',border:`1px solid rgba(192,57,43,${open?0.5:0.15})`,background:`linear-gradient(135deg,rgba(18,12,8,0.92),rgba(26,16,10,0.88))`,backdropFilter:'blur(16px)',transition:'all 0.3s'}}>
          <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'1.3rem 1.5rem',display:'flex',alignItems:'center',gap:'1.1rem',textAlign:'left'}}>
            {/* Wax seal */}
            <div style={{flexShrink:0,width:52,height:52,borderRadius:'50%',background:`radial-gradient(circle,${J.vermillion} 0%,#8b1a12 100%)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 16px rgba(192,57,43,0.4)`,position:'relative'}}>
              <span style={{fontSize:'1.3rem'}}>🎓</span>
              <div style={{position:'absolute',inset:0,borderRadius:'50%',border:`2px solid rgba(255,200,180,0.3)`}}/>
            </div>
            <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:'0.2rem'}}>
              <div style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'clamp(0.9rem,2.2vw,1.05rem)',color:J.moon,lineHeight:1.3,wordBreak:'break-word'}}>{cert.name||'—'}</div>
              <div style={{fontFamily:'var(--font-body)',fontSize:'0.82rem',color:J.sakura,fontWeight:600,display:'flex',alignItems:'center',gap:'0.4rem',flexWrap:'wrap'}}>
                <span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:J.sakura,flexShrink:0}}/>
                {cert.issuer||'—'}
                {cert.subtitle&&<span style={{color:'rgba(242,167,184,0.5)',fontWeight:400}}>· {cert.subtitle}</span>}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.1rem'}}>
                <span style={{fontFamily:'var(--font-body)',fontSize:'0.73rem',fontWeight:700,color:J.gold,background:'rgba(201,168,76,0.1)',border:`1px solid rgba(201,168,76,0.3)`,borderRadius:5,padding:'2px 10px',letterSpacing:'0.5px'}}>{cert.year||'—'}</span>
              </div>
            </div>
            <motion.div animate={{rotate:open?180:0}} transition={{duration:0.35,ease:[0.4,0,0.2,1]}} style={{flexShrink:0,color:J.sakura}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </motion.div>
          </button>
          <AnimatePresence>
            {open&&<motion.div key="sep" initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}} style={{height:1,background:`linear-gradient(to right,transparent,${J.vermillion}66,transparent)`,margin:'0 1.5rem'}}/>}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {open&&(
              <motion.div key="img" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.45,ease:[0.4,0,0.2,1]}} style={{overflow:'hidden'}}>
                <div style={{padding:'1rem 1.5rem 1.5rem'}}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'1rem'}}>
                    {[{label:`📋 ${cert.name}`,color:J.moon,bg:'rgba(255,255,255,0.05)'},{label:cert.issuer,color:J.sakura,bg:'rgba(242,167,184,0.08)'},{label:cert.subtitle,color:'rgba(242,167,184,0.6)',bg:'rgba(255,255,255,0.04)'},{label:`📅 ${cert.year}`,color:J.gold,bg:'rgba(201,168,76,0.1)'}].filter(t=>t.label).map((t,i)=>(
                      <span key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.73rem',fontWeight:600,color:t.color,background:t.bg,border:`1px solid ${t.color}22`,borderRadius:6,padding:'3px 10px'}}>{t.label}</span>
                    ))}
                  </div>
                  <div style={{borderRadius:12,overflow:'hidden',border:`1px solid rgba(192,57,43,0.2)`,background:'rgba(0,0,0,0.4)',minHeight:200,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                    {cert.imageUrl?(
                      <>{!imgLoaded&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.8rem'}}>
                        <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} style={{width:36,height:36,borderRadius:'50%',border:`2.5px solid ${J.sakura}`,borderTopColor:'transparent'}}/>
                        <span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'rgba(242,167,184,0.5)'}}>Memuat...</span>
                      </div>}
                      <img src={cert.imageUrl} alt={cert.name} onLoad={()=>setImgLoaded(true)} style={{width:'100%',display:'block',objectFit:'contain',maxHeight:400,opacity:imgLoaded?1:0,transition:'opacity 0.4s'}}/></>
                    ):(
                      <div style={{textAlign:'center',padding:'3rem 2rem',color:'rgba(242,167,184,0.4)'}}>
                        <motion.div animate={{y:[0,-8,0]}} transition={{duration:2.5,repeat:Infinity}} style={{fontSize:'3rem',marginBottom:'0.8rem'}}>🎓</motion.div>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',lineHeight:1.6}}>Gambar belum diupload<br/><span style={{fontSize:'0.75rem',opacity:0.6}}>Upload via Admin Panel → Sertifikasi</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </InkRipple>
    </Reveal>
  );
};

/* ════════════════════════════════════════
   CONTACT SECTION (dipertahankan)
════════════════════════════════════════ */
const ContactSection:React.FC=()=>{
  const [sel,setSel]=useState<string[]>([]);
  const [name,setName]=useState('');const [email,setEmail]=useState('');const [msg,setMsg]=useState('');
  const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);
  const contact:ContactData=ls(LS_CONTACT,D_CONTACT);
  const toggle=(s:string)=>setSel(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setSending(true);await new Promise(r=>setTimeout(r,1000));setSending(false);setSent(true);};
  const inp:React.CSSProperties={flex:1,minWidth:0,fontSize:'0.875rem',padding:'10px 12px',borderRadius:12,border:'1px solid #e5e7eb',background:'transparent',outline:'none',fontFamily:'var(--font-body)',color:'#111',boxSizing:'border-box'};
  const IcoTW=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  const IcoIG=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  const IcoLI=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  const SBtn:React.FC<{icon:React.ReactNode;bg:string;color:string}>=({icon,bg,color})=><button type="button" style={{width:32,height:32,borderRadius:12,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:bg,color,flexShrink:0}}>{icon}</button>;
  return (
    <section style={{width:'100%',padding:'12px',background:'#fff',boxSizing:'border-box'}}>
      <div style={{position:'relative',borderRadius:24,overflow:'hidden',minHeight:'calc(100vh - 24px)',display:'flex',flexDirection:'column'}}>
        <video autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}><source src={CONTACT_VIDEO} type="video/mp4"/></video>
        <div style={{position:'relative',zIndex:1,flex:1,display:'flex',flexDirection:'column',padding:'clamp(16px,4vw,24px)',gap:20,minHeight:'calc(100vh - 24px)',boxSizing:'border-box'}}>
          <div style={{background:'rgba(255,255,255,0.6)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',borderRadius:16,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',padding:'8px 12px',display:'flex',alignItems:'center',gap:12}}>
            <svg viewBox="0 0 256 256" width={28} height={28} style={{flexShrink:0}}><path fill="#000" d="M 256 256 L 128 256 L 0 128 L 128 128 Z"/><path fill="#000" d="M 256 128 L 128 128 L 0 0 L 128 0 Z"/></svg>
            <div id="cnav" style={{display:'none',gap:20,flex:1}}>{['Our story','Expertise','Our work','Journal'].map(l=><a key={l} href="#" style={{color:'#1f2937',fontSize:'0.82rem',fontWeight:500,textDecoration:'none',whiteSpace:'nowrap'}}>{l}</a>)}</div>
            <button style={{background:'#000',color:'#fff',fontSize:'0.82rem',fontWeight:500,padding:'7px 16px',borderRadius:10,border:'none',cursor:'pointer',marginLeft:'auto',flexShrink:0,whiteSpace:'nowrap'}}>Start a project</button>
          </div>
          <div style={{flex:1,minHeight:24}}/>
          <div id="cbot" style={{display:'flex',flexDirection:'column',gap:20}}>
            <p style={{color:'#fff',fontSize:'clamp(1.6rem,5vw,3rem)',fontWeight:500,lineHeight:1.2,textShadow:'0 2px 12px rgba(0,0,0,0.3)',margin:0}}>We craft bold ideas<br/>and ship them as <span style={{fontFamily:"'Georgia',serif",fontStyle:'italic'}}>products</span></p>
            <div style={{width:'100%',maxWidth:480}} id="cform">
              <div style={{background:'#fff',borderRadius:24,boxShadow:'0 25px 50px rgba(0,0,0,0.25)',padding:'clamp(16px,4vw,24px)',display:'flex',flexDirection:'column',gap:14}}>
                {sent?(<div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 0',gap:12}}><div style={{width:48,height:48,borderRadius:'50%',background:'#f0fdf4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>✓</div><p style={{fontSize:'1rem',fontWeight:600,color:'#111',margin:0}}>You're all set!</p><p style={{fontSize:'0.875rem',color:'#6b7280',margin:0}}>Expect a reply within 24 hours.</p></div>)
                :(<><h2 style={{fontSize:'1.25rem',fontWeight:600,color:'#000',margin:0}}>Say hello! 👋</h2>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,background:'#f9fafb',borderRadius:14,padding:'10px 14px',flexWrap:'wrap',rowGap:8}}>
                    <div style={{minWidth:0}}><p style={{fontSize:'0.72rem',color:'#9ca3af',margin:'0 0 2px 0'}}>Drop us a line</p><a href={`mailto:${contact.email}`} style={{color:'#2563eb',fontWeight:600,fontSize:'0.82rem',textDecoration:'none',display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{contact.email}</a></div>
                    <div style={{display:'flex',gap:5,flexShrink:0}}><SBtn icon={<IcoTW/>} bg="#f3f4f6" color="#1f2937"/><SBtn icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>} bg="#fce7f3" color="#ec4899"/><SBtn icon={<IcoIG/>} bg="#ffedd5" color="#fb923c"/><SBtn icon={<IcoLI/>} bg="#dbeafe" color="#2563eb"/></div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{flex:1,height:1,background:'#e5e7eb'}}/><span style={{fontSize:'0.82rem',color:'#9ca3af',fontWeight:500}}>OR</span><div style={{flex:1,height:1,background:'#e5e7eb'}}/></div>
                  <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
                    <label style={{fontSize:'0.82rem',fontWeight:500,color:'#000'}}>Tell us about your vision</label>
                    <div style={{display:'flex',flexDirection:'column',gap:8}} id="cinputs"><input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} style={{...inp,width:'100%'}}/><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{...inp,width:'100%'}}/></div>
                    <textarea rows={3} placeholder="What are you looking to build or improve..." value={msg} onChange={e=>setMsg(e.target.value)} style={{...inp,resize:'none',width:'100%'}}/>
                    <div><p style={{fontSize:'0.82rem',fontWeight:500,color:'#000',marginBottom:6}}>I need help with...</p><div style={{display:'flex',flexWrap:'wrap',gap:5}}>{SERVICES_LIST.map(s=><button key={s} type="button" onClick={()=>toggle(s)} style={{fontSize:'0.72rem',fontWeight:500,padding:'6px 10px',borderRadius:7,border:sel.includes(s)?'1px solid #000':'1px solid #e5e7eb',background:sel.includes(s)?'#f3f4f6':'#fff',color:sel.includes(s)?'#000':'#374151',cursor:'pointer'}}>{s}</button>)}</div></div>
                    <button type="submit" disabled={sending} style={{width:'100%',background:'#000',color:'#fff',fontSize:'0.875rem',fontWeight:600,padding:'11px 0',borderRadius:14,border:'none',cursor:sending?'not-allowed':'pointer',opacity:sending?0.6:1}}>{sending?'Sending...':'Send my message'}</button>
                  </form></>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){#cnav{display:none!important;}}@media(min-width:768px){#cnav{display:flex!important;}#cinputs{flex-direction:row!important;}}@media(min-width:1024px){#cbot{flex-direction:row!important;align-items:flex-end!important;justify-content:space-between!important;}#cform{width:min(480px,45%)!important;}}`}</style>
    </section>
  );
};

/* ════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════ */
const Home:React.FC=()=>{
  const [hero,setHero]       =useState<HomeData>(()=>ls(LS_HOME,D_HOME));
  const [about,setAbout]     =useState<AboutData>(()=>ls(LS_ABOUT,D_ABOUT));
  const [skills,setSkills]   =useState<SkillItem[]>(()=>ls(LS_SKILLS,D_SKILLS));
  const [exps,setExps]       =useState<ExpItem[]>(()=>ls(LS_EXP,D_EXP));
  const [contact,setContact] =useState<ContactData>(()=>ls(LS_CONTACT,D_CONTACT));
  const [certs,setCerts]     =useState<CertItem[]>(()=>ls(LS_CERT,D_CERT));
  const containerRef=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:containerRef,offset:['start start','end end']});
  const parallaxY=useTransform(scrollYProgress,[0,1],[0,-80]);

  useEffect(()=>{
    const onS=(e:StorageEvent)=>{
      if(e.key===LS_HOME&&e.newValue)try{setHero(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_ABOUT&&e.newValue)try{setAbout(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_SKILLS&&e.newValue)try{setSkills(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_EXP&&e.newValue)try{setExps(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_CONTACT&&e.newValue)try{setContact(JSON.parse(e.newValue));}catch{}
      if(e.key===LS_CERT&&e.newValue)try{setCerts(JSON.parse(e.newValue));}catch{}
    };
    const onC=(e:Event)=>{const{key,value}=(e as CustomEvent).detail;try{if(key===LS_HOME)setHero(JSON.parse(value));if(key===LS_ABOUT)setAbout(JSON.parse(value));if(key===LS_SKILLS)setSkills(JSON.parse(value));if(key===LS_EXP)setExps(JSON.parse(value));if(key===LS_CONTACT)setContact(JSON.parse(value));if(key===LS_CERT)setCerts(JSON.parse(value));}catch{}};
    window.addEventListener('storage',onS);window.addEventListener('hk-update',onC);
    return()=>{window.removeEventListener('storage',onS);window.removeEventListener('hk-update',onC);};
  },[]);

  const photo=about.photoUrl||FALLBACK_PHOTO;
  const heroText=`${hero.heroTitle}\n${hero.heroSubtitle}`;

  return (
    <div ref={containerRef} style={{background:J.inkD,minHeight:'100vh',overflowX:'hidden'}}>

      {/* ══ HERO (unchanged) ══ */}
      <section style={{position:'relative',width:'100%',height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',background:'#000',color:'#fff'}}>
        <video autoPlay loop muted playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}><source src={HERO_VIDEO} type="video/mp4"/></video>
        <InkBrushOverlay/>
        <KanjiCanvas/>
        <Stars/>
        <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',height:'100%',padding:'70px clamp(1rem,5vw,4rem) 0 clamp(1rem,5vw,4rem)'}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:'clamp(2rem,5vw,4rem)'}}>
            <div id="hgrid" style={{display:'grid',gridTemplateColumns:'1fr',alignItems:'flex-end',gap:'1.5rem'}}>
              <div>
                <AnimatedHeading text={heroText} style={{fontSize:'clamp(2rem,7vw,4.5rem)',fontWeight:400,marginBottom:'0.8rem',letterSpacing:'-0.04em',lineHeight:1.1,color:'#fff',fontFamily:'var(--font-body)',wordBreak:'break-word'}}/>
                <FadeIn delay={800} duration={1000}><p style={{fontSize:'clamp(0.9rem,2vw,1.125rem)',color:'#d1d5db',marginBottom:'1.25rem',fontWeight:400,lineHeight:1.6,maxWidth:'520px'}}>{hero.heroTagline}</p></FadeIn>
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
                    <span style={{fontSize:'clamp(1rem,2.5vw,1.5rem)',fontWeight:300,color:'#fff',fontFamily:'var(--font-body)',wordBreak:'break-word'}}>{hero.heroTagRight}</span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <Marquee contact={contact}/>

      {/* ══════════════════════════════════
          ABOUT — 桜の庭 (SAKURA GARDEN)
      ══════════════════════════════════ */}
      <JapanBgSection overlayColor='rgba(10,6,4,0.80)' style={{padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)'}}>
        <SakuraCanvas/>
        {/* Smoke clouds */}
        <SmokeCloud style={{left:'-5%',bottom:'5%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-5%',bottom:'8%',opacity:0.8}} delay={2} flip/>
        <SmokeCloud style={{left:'15%',bottom:'2%',opacity:0.7}} delay={1}/>
        {/* Kamon floor glows */}
        <KamonFloor style={{left:'8%',bottom:'12%'}} delay={0} size={100}/>
        <KamonFloor style={{right:'10%',bottom:'15%'}} delay={1.5} size={80}/>
        {/* Rising sun */}
        <RisingSun style={{left:'2%',top:'8%'}} opacity={0.14}/>
        {/* Iso buildings */}
        <IsoBuilding style={{right:'2%',bottom:'5%',opacity:0.55}} delay={0}/>
        <IsoBuilding style={{left:'1%',top:'10%',opacity:0.4}} flip delay={1}/>
        {/* Cherry trees */}
        <CherryTree style={{left:'-30px',bottom:0,opacity:0.7}} scale={1.2} delay={0}/>
        <CherryTree style={{left:'120px',bottom:0,opacity:0.45}} scale={0.75} delay={1} flip/>
        <CherryTree style={{right:'-30px',bottom:0,opacity:0.65}} scale={1.1} delay={0.8} flip/>
        <CherryTree style={{right:'120px',bottom:0,opacity:0.4}} scale={0.7} delay={0.4}/>
        {/* Torii gate */}
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',top:'5%',opacity:0.1}} opacity={0.1}/>
        {/* Mon circles */}
        <MonCircle style={{right:'8%',top:'20%'}} delay={0} size={50}/>
        <MonCircle style={{left:'6%',top:'40%'}} delay={2} size={35}/>
        <MonCircle style={{right:'15%',bottom:'15%'}} delay={1} size={28}/>
        {/* Cranes */}
        <OrigamiCrane style={{right:'10%',top:'15%'}} delay={0} size={42} color={J.sakura}/>
        <OrigamiCrane style={{left:'8%',top:'30%'}} delay={2} size={30} color={J.gold}/>
        <OrigamiCrane style={{right:'20%',bottom:'20%'}} delay={1.2} size={28} color={J.moon}/>
        {/* Enso */}
        <Enso style={{right:'3%',top:'10%'}} size={100} opacity={0.12}/>
        {/* Wave bottom */}
        <WaveDecor style={{bottom:'5%',left:'-5%',width:'110%'}} opacity={0.1}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <div id="about-row" style={{display:'flex',flexDirection:'column',gap:'3rem',alignItems:'center'}}>
            {/* Photo */}
            <Reveal direction="left" style={{width:'100%',maxWidth:340,flexShrink:0}}>
              <TiltCard style={{borderRadius:20,width:'100%'}} intensity={10}>
                <InkRipple>
                  <div style={{borderRadius:20,overflow:'hidden',position:'relative',aspectRatio:'4/5',border:`2px solid rgba(192,57,43,0.4)`,boxShadow:`0 0 0 6px rgba(192,57,43,0.08),0 30px 80px rgba(0,0,0,0.6),0 0 60px rgba(192,57,43,0.12)`}}>
                    <img src={photo} alt={about.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                    {/* Ink overlay */}
                    <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,rgba(11,13,20,0.85) 0%,rgba(11,13,20,0.1) 50%,transparent 100%)`}}/>
                    {/* Floating sakura on photo */}
                    {[...Array(4)].map((_,i)=>(
                      <motion.div key={i} style={{position:'absolute',fontSize:'1rem',left:`${15+i*20}%`,top:`${20+i*12}%`,pointerEvents:'none'}}
                        animate={{y:[0,-14,0],rotate:[0,20,-15,0],opacity:[0.4,0.8,0.4]}} transition={{duration:3+i*0.5,repeat:Infinity,delay:i*0.7}}>🌸</motion.div>
                    ))}
                    {/* Location badge */}
                    <div style={{position:'absolute',bottom:'1rem',left:'1rem',right:'1rem'}}>
                      <motion.div whileHover={{scale:1.04}} style={{background:'rgba(192,57,43,0.85)',backdropFilter:'blur(8px)',borderRadius:10,padding:'0.5rem 1rem',color:'rgba(255,240,220,0.95)',fontWeight:700,fontSize:'0.82rem',display:'inline-block',wordBreak:'break-word'}}>
                        🗾 {about.location}
                      </motion.div>
                    </div>
                  </div>
                </InkRipple>
              </TiltCard>
            </Reveal>
            {/* Text */}
            <Reveal direction="right" delay={0.15}>
              <div style={{maxWidth:560}}>
                {/* Japanese accent label */}
                <motion.div animate={{opacity:[0.6,1,0.6]}} transition={{duration:3,repeat:Infinity}} style={{fontFamily:'var(--font-body)',color:J.sakura,fontSize:'0.75rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.8rem'}}>
                  <span style={{fontFamily:'serif',fontSize:'1.2rem',color:J.vermillion}}>桜</span> Sakura Garden
                </motion.div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5rem)',lineHeight:0.9,marginBottom:'0.3rem',color:J.moon,textShadow:`0 2px 20px rgba(180,140,80,0.2)`}}>ABOUT ME !</h2>
                {/* Red line accent */}
                <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}} style={{height:3,width:80,background:`linear-gradient(to right,${J.vermillion},transparent)`,marginBottom:'0.8rem',transformOrigin:'left'}}/>
                <div style={{fontFamily:'var(--font-script)',color:J.sakura,fontSize:'clamp(1.5rem,5vw,2.2rem)',fontWeight:700,marginBottom:'1.5rem',textShadow:`0 0 20px rgba(242,167,184,0.4)`}}>{about.name}</div>
                <p style={{color:J.moonDim,lineHeight:1.9,marginBottom:'1rem',fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio1}</p>
                <p style={{color:'rgba(240,220,180,0.6)',lineHeight:1.9,fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio2}</p>
                <div style={{marginTop:'2rem',display:'flex',gap:'0.8rem',flexWrap:'wrap'}}>
                  <motion.div whileHover={{scale:1.05,boxShadow:`0 8px 30px rgba(192,57,43,0.35)`}} whileTap={{scale:0.97}} style={{display:'inline-block'}}>
                    <Link to="/about" style={{display:'inline-flex',alignItems:'center',gap:8,background:`rgba(192,57,43,0.12)`,color:J.sakura,textDecoration:'none',borderRadius:50,padding:'11px 26px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.9rem',border:`1px solid rgba(192,57,43,0.4)`,backdropFilter:'blur(6px)'}}>
                      🌸 Selengkapnya →
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

      </JapanBgSection>

      {/* ══════════════════════════════════
          SERTIFIKASI — 巻物 (MAKIMONO SCROLL)
      ══════════════════════════════════ */}
      <JapanBgSection overlayColor='rgba(12,6,3,0.82)' style={{padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)'}}>
        {/* Smoke */}
        <SmokeCloud style={{left:'-3%',bottom:'3%',opacity:0.8}} delay={0.5}/>
        <SmokeCloud style={{right:'-3%',bottom:'6%',opacity:0.75}} delay={2} flip/>
        {/* Kamon floors */}
        <KamonFloor style={{left:'50%',bottom:'8%',transform:'translateX(-50%)'}} delay={0} size={140}/>
        <KamonFloor style={{left:'5%',top:'30%'}} delay={1} size={70}/>
        <KamonFloor style={{right:'5%',top:'35%'}} delay={2} size={65}/>
        {/* Rising sun subtle */}
        <RisingSun style={{right:'3%',top:'5%'}} opacity={0.1}/>
        {/* Iso buildings */}
        <IsoBuilding style={{left:'0%',bottom:'3%',opacity:0.5}} delay={0}/>
        <IsoBuilding style={{right:'0%',bottom:'5%',opacity:0.45}} flip delay={1.5}/>
        {/* Torii gate bg */}
        <ToriiGate style={{right:'5%',top:'5%',opacity:0.08}} opacity={0.08}/>
        <ToriiGate style={{left:'-2%',bottom:'10%',opacity:0.06}} opacity={0.06}/>
        {/* Falling sakura */}
        {[...Array(8)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',fontSize:'0.9rem',left:`${8+i*12}%`,top:'-5%',pointerEvents:'none',zIndex:1}}
            animate={{y:['0vh','105vh'],rotate:[0,360],opacity:[0,0.7,0]}} transition={{duration:6+i*0.8,repeat:Infinity,delay:i*0.9,ease:'linear'}}>🌸</motion.div>
        ))}
        {/* Lanterns */}
        <Lantern style={{left:'3%',top:'15%'}} delay={0} size={45}/>
        <Lantern style={{right:'4%',top:'20%'}} delay={1.2} size={38}/>
        <Lantern style={{left:'12%',bottom:'15%'}} delay={0.6} size={30}/>
        {/* Mon circles */}
        <MonCircle style={{left:'2%',top:'50%'}} delay={1.5} size={40}/>
        <MonCircle style={{right:'3%',bottom:'30%'}} delay={0.3} size={32}/>
        {/* Cranes */}
        <OrigamiCrane style={{right:'8%',top:'35%'}} delay={1} size={35} color={J.gold}/>
        <OrigamiCrane style={{left:'5%',bottom:'25%'}} delay={2.5} size={28} color={J.sakura}/>

        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',marginBottom:'0.8rem'}}>
                <motion.div animate={{scaleX:[0.5,1,0.5]}} transition={{duration:3,repeat:Infinity}} style={{height:1,width:40,background:`linear-gradient(to right,transparent,${J.vermillion})`}}/>
                <span style={{fontFamily:'serif',fontSize:'1.4rem',color:J.vermillion}}>巻物</span>
                <motion.div animate={{scaleX:[0.5,1,0.5]}} transition={{duration:3,repeat:Infinity,delay:1.5}} style={{height:1,width:40,background:`linear-gradient(to left,transparent,${J.vermillion})`}}/>
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,8vw,5rem)',lineHeight:0.9,color:J.moon,wordBreak:'break-word'}}>
                SERTIFI<span style={{color:J.sakura,textShadow:`0 0 30px rgba(242,167,184,0.5)`}}>KASI</span>
              </h2>
              <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:1}} style={{height:2,width:120,background:`linear-gradient(to right,transparent,${J.vermillion},transparent)`,margin:'0.8rem auto 0',transformOrigin:'center'}}/>
              <p style={{color:'rgba(232,232,245,0.5)',marginTop:'0.6rem',fontSize:'0.88rem'}}>Klik kartu untuk melihat sertifikat ·  証明書</p>
            </div>
          </Reveal>
          {certs.length===0?(
            <Reveal direction="up"><div style={{textAlign:'center',padding:'3rem',color:'rgba(242,167,184,0.4)',border:`1px dashed rgba(192,57,43,0.25)`,borderRadius:16}}><div style={{fontSize:'3rem',marginBottom:'0.8rem'}}>🎓</div><p style={{fontFamily:'var(--font-body)',fontSize:'0.9rem'}}>Belum ada sertifikasi.</p></div></Reveal>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {certs.map((cert,i)=><CertCard key={cert.id} cert={cert} index={i}/>)}
            </div>
          )}
        </div>

      </JapanBgSection>

      {/* ══════════════════════════════════
          EXPERIENCE — 道 (MICHI / THE PATH)
      ══════════════════════════════════ */}
      <JapanBgSection overlayColor='rgba(8,5,3,0.84)' style={{padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)'}}>
        {/* Heavy smoke for moody atmosphere */}
        <SmokeCloud style={{left:'-8%',bottom:'0%',opacity:0.95,width:280}} delay={0}/>
        <SmokeCloud style={{right:'-8%',bottom:'2%',opacity:0.9,width:250}} delay={1.5} flip/>
        <SmokeCloud style={{left:'20%',bottom:'0%',opacity:0.6}} delay={0.8}/>
        <SmokeCloud style={{right:'25%',bottom:'1%',opacity:0.55}} delay={2.2} flip/>
        {/* Kamon floor path */}
        <KamonFloor style={{left:'50%',top:'15%',transform:'translateX(-50%)'}} delay={0} size={100}/>
        <KamonFloor style={{left:'8%',bottom:'20%'}} delay={1} size={60}/>
        <KamonFloor style={{right:'8%',bottom:'18%'}} delay={2} size={55}/>
        {/* Iso buildings */}
        <IsoBuilding style={{left:'0%',top:'8%',opacity:0.45}} delay={0}/>
        <IsoBuilding style={{right:'0%',top:'10%',opacity:0.4}} flip delay={0.8}/>
        {/* Stars */}
        {[...Array(20)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',width:2,height:2,borderRadius:'50%',background:J.moon,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,pointerEvents:'none'}}
            animate={{opacity:[0.1,0.7,0.1]}} transition={{duration:2+Math.random()*3,repeat:Infinity,delay:Math.random()*4}}/>
        ))}
        {/* Mount Fuji bg */}
        <MountFuji style={{bottom:'0%',left:'50%',transform:'translateX(-50%)',width:500}} opacity={0.08}/>
        {/* Bamboo sides */}
        <BambooForest style={{left:0,bottom:0,opacity:0.5}} count={4}/>
        <BambooForest style={{right:0,bottom:0,opacity:0.45,transform:'scaleX(-1)'}} count={3}/>
        {/* Koi */}
        <KoiFish style={{top:'20%',left:'5%'}} delay={0}/>
        <KoiFish style={{top:'60%',right:'5%'}} delay={3} flip/>
        {/* Lanterns */}
        <Lantern style={{left:'3%',top:'30%'}} delay={0.5} size={36}/>
        <Lantern style={{right:'3%',top:'25%'}} delay={1.5} size={32}/>
        {/* Cranes flying */}
        <OrigamiCrane style={{top:'10%',left:'20%'}} delay={0} size={32} color={J.moon}/>
        <OrigamiCrane style={{top:'15%',right:'25%'}} delay={1.5} size={26} color={J.sakura}/>
        <OrigamiCrane style={{top:'8%',left:'60%'}} delay={0.8} size={20} color={J.gold}/>
        {/* Wave pattern */}
        <WaveDecor style={{bottom:'3%',left:0,width:'100%'}} opacity={0.1}/>

        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.8rem',marginBottom:'0.6rem'}}>
                <span style={{fontFamily:'serif',fontSize:'1.4rem',color:J.gold}}>道</span>
                <span style={{fontFamily:'var(--font-body)',color:J.gold,fontSize:'0.75rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Michi · The Path</span>
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.9,color:J.moon,wordBreak:'break-word'}}>
                PENGALAMAN <span style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'55%',textShadow:`0 0 20px rgba(201,168,76,0.5)`}}>Kerja</span>
              </h2>
              <p style={{color:'rgba(232,232,245,0.45)',marginTop:'0.8rem',fontSize:'0.88rem'}}>Pengalaman Profesional &amp; Riwayat Kerja</p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div style={{position:'relative'}}>
            <motion.div initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:true}} transition={{duration:1.8,ease:'easeOut'}}
              style={{position:'absolute',left:'clamp(16px,5vw,32px)',top:0,bottom:0,width:2,background:`linear-gradient(to bottom,transparent,${J.vermillion},${J.gold},transparent)`,transformOrigin:'top',zIndex:1}}/>
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
              {exps.map((exp,i)=>(
                <Reveal key={exp.id} direction="right" delay={i*0.14}>
                  <div style={{display:'flex',gap:'clamp(1rem,4vw,2rem)',position:'relative'}}>
                    {/* Node */}
                    <div style={{flexShrink:0,width:'clamp(32px,10vw,64px)',display:'flex',flexDirection:'column',alignItems:'center'}}>
                      <motion.div
                        animate={{boxShadow:[`0 0 8px rgba(192,57,43,0.4)`,`0 0 20px rgba(192,57,43,0.8)`,`0 0 8px rgba(192,57,43,0.4)`]}}
                        transition={{duration:2,repeat:Infinity,delay:i*0.5}}
                        whileHover={{scale:1.25}}
                        style={{width:44,height:44,borderRadius:'50%',background:`radial-gradient(circle,rgba(192,57,43,0.2),rgba(192,57,43,0.05))`,border:`2px solid ${J.vermillion}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',position:'relative',zIndex:2,cursor:'default'}}>
                        {exp.icon}
                        {/* Inner ring */}
                        <motion.div animate={{scale:[1,1.4,1],opacity:[0.5,0,0.5]}} transition={{duration:2,repeat:Infinity,delay:i*0.5}}
                          style={{position:'absolute',inset:-4,borderRadius:'50%',border:`1px solid ${J.vermillion}`,pointerEvents:'none'}}/>
                      </motion.div>
                    </div>
                    {/* Card */}
                    <TiltCard style={{flex:1,borderRadius:16}} intensity={5}>
                      <InkRipple>
                        <motion.div whileHover={{borderColor:`rgba(192,57,43,0.5)`,background:'rgba(26,22,45,0.9)'}}
                          style={{background:`rgba(16,10,6,0.88)`,border:`1px solid rgba(192,57,43,0.15)`,borderRadius:16,padding:'1.4rem clamp(1rem,3vw,1.8rem)',backdropFilter:'blur(12px)',transition:'all 0.3s',position:'relative',overflow:'hidden'}}>
                          {/* Ink splash bg */}
                          <motion.div animate={{opacity:[0.06,0.12,0.06],scale:[1,1.05,1]}} transition={{duration:4+i,repeat:Infinity}}
                            style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:`radial-gradient(circle,${J.vermillion}33,transparent 70%)`}}/>
                          {/* Kanji accent */}
                          <div style={{position:'absolute',right:'1rem',top:'0.5rem',fontFamily:'serif',fontSize:'2.5rem',color:`rgba(192,57,43,0.08)`,userSelect:'none',lineHeight:1}}>{['仕','事','技'][i%3]}</div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'0.5rem',marginBottom:'0.3rem',flexWrap:'wrap',position:'relative',zIndex:1}}>
                            <h3 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1rem,3vw,1.4rem)',color:J.moon,lineHeight:1.2}}>{exp.position}</h3>
                            {exp.period&&<motion.span whileHover={{scale:1.05}} style={{background:`rgba(192,57,43,0.12)`,color:J.sakura,borderRadius:6,padding:'3px 12px',fontSize:'0.72rem',fontWeight:700,flexShrink:0,whiteSpace:'nowrap',border:`1px solid rgba(192,57,43,0.3)`}}>{exp.period}</motion.span>}
                          </div>
                          {exp.company&&<div style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'1.05rem',marginBottom:'0.8rem',position:'relative',zIndex:1}}>{exp.company}</div>}
                          {exp.tags&&(
                            <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',position:'relative',zIndex:1}}>
                              {exp.tags.split(',').map(t=>t.trim()).filter(Boolean).map((tag,ti)=>(
                                <motion.span key={tag} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{delay:ti*0.04+i*0.08}}
                                  style={{background:'rgba(242,167,184,0.07)',border:`1px solid rgba(242,167,184,0.18)`,color:'rgba(230,180,150,0.75)',borderRadius:5,padding:'3px 10px',fontSize:'0.72rem',fontWeight:500}}>
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </InkRipple>
                    </TiltCard>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

      </JapanBgSection>

      {/* ══════════════════════════════════
          SKILLS — 山 (YAMA / MOUNTAIN)
      ══════════════════════════════════ */}
      <JapanBgSection overlayColor='rgba(10,6,3,0.83)' style={{padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)'}}>
        {/* Smoke at base */}
        <SmokeCloud style={{left:'-5%',bottom:'0%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-5%',bottom:'1%',opacity:0.85}} delay={1.8} flip/>
        {/* Kamon floors */}
        <KamonFloor style={{left:'3%',top:'20%'}} delay={0} size={80}/>
        <KamonFloor style={{right:'3%',top:'25%'}} delay={1.2} size={70}/>
        <KamonFloor style={{left:'50%',bottom:'10%',transform:'translateX(-50%)'}} delay={0.6} size={110}/>
        {/* Rising sun center-top */}
        <RisingSun style={{left:'50%',top:'2%',transform:'translateX(-50%)'}} opacity={0.1}/>
        {/* Iso buildings sides */}
        <IsoBuilding style={{left:'0%',bottom:'3%',opacity:0.5}} delay={0}/>
        <IsoBuilding style={{right:'0%',bottom:'4%',opacity:0.45}} flip delay={1}/>
        {/* Mt Fuji */}
        <MountFuji style={{bottom:0,left:'50%',transform:'translateX(-50%)',width:600,opacity:0.1}} opacity={0.1}/>
        {/* Bamboo */}
        <BambooForest style={{left:0,bottom:0,opacity:0.4}} count={3}/>
        <BambooForest style={{right:0,bottom:0,opacity:0.35,transform:'scaleX(-1)'}} count={3}/>
        {/* Torii gate far */}
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',bottom:'5%',opacity:0.06}} opacity={0.06}/>
        {/* Cranes */}
        {[...Array(5)].map((_,i)=><OrigamiCrane key={i} style={{top:`${8+i*12}%`,left:`${10+i*18}%`}} delay={i*0.6} size={20+i*4} color={[J.sakura,J.gold,J.moon,J.sakuraL,J.gold][i]}/>)}
        {/* Enso circles */}
        <Enso style={{right:'2%',top:'10%'}} size={90} opacity={0.1}/>
        <Enso style={{left:'1%',bottom:'15%'}} size={70} opacity={0.08}/>
        {/* Wave top */}
        <WaveDecor style={{top:'3%',left:0,width:'100%'}} opacity={0.08}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
              <motion.div animate={{y:[0,-5,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.8rem',marginBottom:'0.6rem'}}>
                  <span style={{fontFamily:'serif',fontSize:'1.4rem',color:J.sakura}}>山</span>
                  <span style={{fontFamily:'var(--font-body)',color:J.sakura,fontSize:'0.75rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Yama · Mountain</span>
                </div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5.5rem)',lineHeight:0.9,color:J.moon,wordBreak:'break-word'}}>
                  SKILLS &amp; <span style={{color:J.sakura,textShadow:`0 0 30px rgba(242,167,184,0.4)`}}>TOOLS</span>
                </h2>
                <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:1}} style={{height:2,width:100,background:`linear-gradient(to right,transparent,${J.sakura},transparent)`,margin:'0.8rem auto 0',transformOrigin:'center'}}/>
              </motion.div>
            </div>
          </Reveal>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))',gap:'1rem'}}>
            {skills.map((sk,i)=>(
              <Reveal key={sk.id} direction="up" delay={i*0.09}>
                <TiltCard style={{borderRadius:18,height:'100%'}} intensity={12}>
                  <InkRipple>
                    <motion.div
                      whileHover={{boxShadow:`0 24px 70px rgba(192,57,43,0.25),0 0 0 1px rgba(192,57,43,0.35)`}}
                      style={{background:`linear-gradient(135deg,rgba(18,12,6,0.92),rgba(28,18,10,0.88))`,border:`1px solid rgba(192,57,43,0.15)`,borderRadius:18,padding:'1.8rem',position:'relative',overflow:'hidden',height:'100%',backdropFilter:'blur(14px)',transition:'all 0.3s'}}>
                      {/* Kanji watermark */}
                      <div style={{position:'absolute',right:8,top:4,fontFamily:'serif',fontSize:'4.5rem',color:`rgba(192,57,43,0.07)`,lineHeight:1,userSelect:'none'}}>{['技','能','術','間'][i%4]}</div>
                      {/* Glow orb */}
                      <motion.div animate={{scale:[1,1.4,1],opacity:[0.15,0.35,0.15]}} transition={{duration:3+i*0.4,repeat:Infinity}}
                        style={{position:'absolute',top:-15,left:-15,width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle,rgba(192,57,43,0.2),transparent 70%)`}}/>
                      {/* Number with vermillion accent */}
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.7rem',position:'relative',zIndex:1}}>
                        <motion.div animate={{y:[0,-3,0]}} transition={{duration:2.5+i*0.3,repeat:Infinity,ease:'easeInOut'}}
                          style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',color:J.vermillion,textShadow:`0 0 15px rgba(192,57,43,0.6)`,lineHeight:1}}>{sk.number}</motion.div>
                        <div style={{flex:1,height:1,background:`linear-gradient(to right,rgba(192,57,43,0.4),transparent)`}}/>
                      </div>
                      <h3 style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.88rem',color:J.moon,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.6rem',position:'relative',zIndex:1}}>{sk.title}</h3>
                      <p style={{color:'rgba(240,220,180,0.6)',fontSize:'0.85rem',lineHeight:1.6,position:'relative',zIndex:1}}>{sk.desc}</p>
                      {/* Bottom shimmer */}
                      <motion.div animate={{scaleX:[0,1,0]}} transition={{duration:3,repeat:Infinity,delay:i*0.35}}
                        style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${J.vermillion},${J.sakura},transparent)`,transformOrigin:'left'}}/>
                    </motion.div>
                  </InkRipple>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

      </JapanBgSection>

      {/* ══════════════════════════════════
          CTA — 月 (TSUKI / MOON)
      ══════════════════════════════════ */}
      <JapanBgSection overlayColor='rgba(8,4,2,0.85)' style={{padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',textAlign:'center'}}>
        {/* Dense smoke for atmosphere */}
        <SmokeCloud style={{left:'-10%',bottom:'0%',opacity:1}} delay={0}/>
        <SmokeCloud style={{right:'-10%',bottom:'2%',opacity:0.95}} delay={1} flip/>
        <SmokeCloud style={{left:'10%',bottom:'1%',opacity:0.7}} delay={0.5}/>
        <SmokeCloud style={{right:'15%',bottom:'0%',opacity:0.65}} delay={1.8} flip/>
        {/* Large kamon center floor */}
        <KamonFloor style={{left:'50%',bottom:'12%',transform:'translateX(-50%)'}} delay={0} size={180}/>
        {/* Iso buildings */}
        <IsoBuilding style={{left:'0%',bottom:'3%',opacity:0.55}} delay={0}/>
        <IsoBuilding style={{right:'0%',bottom:'4%',opacity:0.5}} flip delay={1}/>
        <IsoBuilding style={{left:'15%',bottom:'2%',opacity:0.35}} delay={0.6}/>
        <IsoBuilding style={{right:'15%',bottom:'3%',opacity:0.3}} flip delay={1.2}/>
        {/* Full moon */}
        <motion.div animate={{opacity:[0.06,0.14,0.06],scale:[1,1.04,1]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}
          style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',width:280,height:280,borderRadius:'50%',background:`radial-gradient(circle,rgba(232,232,245,0.15) 0%,rgba(200,200,225,0.06) 60%,transparent 100%)`,boxShadow:`0 0 80px rgba(232,232,245,0.08)`,pointerEvents:'none'}}/>
        {/* Bamboo forest */}
        <BambooForest style={{left:0,bottom:0,opacity:0.55}} count={5}/>
        <BambooForest style={{right:0,bottom:0,opacity:0.5,transform:'scaleX(-1)'}} count={5}/>
        {/* Lanterns */}
        <Lantern style={{left:'8%',top:'20%'}} delay={0} size={50}/>
        <Lantern style={{right:'8%',top:'18%'}} delay={1} size={44}/>
        <Lantern style={{left:'22%',top:'40%'}} delay={0.5} size={32}/>
        <Lantern style={{right:'22%',top:'38%'}} delay={1.5} size={30}/>
        {/* Cranes */}
        {[...Array(7)].map((_,i)=><OrigamiCrane key={i} style={{top:`${5+i*8}%`,left:`${8+i*12}%`}} delay={i*0.5} size={16+i*3} color={[J.moon,J.sakura,J.gold,J.moon,J.sakura,J.gold,J.moon][i]}/>)}
        {/* Cherry petals floating */}
        {[...Array(10)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',fontSize:'0.9rem',left:`${5+i*9}%`,top:'-5%',pointerEvents:'none'}}
            animate={{y:['0vh','110vh'],rotate:[0,360],opacity:[0,0.6,0]}} transition={{duration:7+i*0.6,repeat:Infinity,delay:i*0.7,ease:'linear'}}>🌸</motion.div>
        ))}
        {/* Enso large */}
        <Enso style={{left:'50%',top:'5%',transform:'translateX(-50%)'}} size={160} opacity={0.1}/>

        <div style={{position:'relative',zIndex:2,maxWidth:700,margin:'0 auto'}}>
          <Reveal direction="scale">
            {/* Kanji */}
            <motion.div animate={{opacity:[0.4,0.8,0.4]}} transition={{duration:3,repeat:Infinity}} style={{fontFamily:'serif',fontSize:'clamp(2.5rem,6vw,4rem)',color:J.vermillion,marginBottom:'0.5rem',textShadow:`0 0 30px rgba(192,57,43,0.4)`}}>月</motion.div>
            <div style={{fontFamily:'var(--font-body)',color:J.sakura,fontSize:'0.75rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,marginBottom:'0.8rem'}}>Tsuki · Under the Moon</div>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.95,color:J.moon,wordBreak:'break-word',marginBottom:'1rem',textShadow:`0 2px 30px rgba(180,140,80,0.25)`}}>
              SIAP BERKOLABORASI?
            </h2>
            {/* Red divider */}
            <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:1}} style={{height:2,width:80,background:`linear-gradient(to right,transparent,${J.vermillion},transparent)`,margin:'0 auto 1.2rem',transformOrigin:'center'}}/>
            <p style={{color:'rgba(232,232,245,0.6)',marginBottom:'2.5rem',fontSize:'clamp(0.9rem,2vw,1.05rem)',lineHeight:1.7,maxWidth:480,margin:'0 auto 2.5rem'}}>
              Di bawah cahaya bulan, setiap karya lahir dari ketenangan dan ketelitian. Mari wujudkan visi Anda.
            </p>
            {/* CTA button */}
            <div style={{position:'relative',display:'inline-block'}}>
              {/* Pulse rings */}
              {[...Array(3)].map((_,i)=>(
                <motion.div key={i} style={{position:'absolute',inset:-(i+1)*12,borderRadius:50,border:`1.5px solid rgba(192,57,43,${0.4-i*0.1})`,pointerEvents:'none'}}
                  animate={{scale:[1,1.2,1],opacity:[0.5,0,0.5]}} transition={{duration:2.2,repeat:Infinity,delay:i*0.6}}/>
              ))}
              <motion.a href={`mailto:${contact.email}`}
                whileHover={{scale:1.06,boxShadow:`0 15px 50px rgba(192,57,43,0.5)`}} whileTap={{scale:0.97}}
                style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',background:`linear-gradient(135deg,${J.vermillion},#a82d22)`,color:'rgba(255,240,220,0.95)',textDecoration:'none',borderRadius:50,padding:'16px 48px',fontFamily:'var(--font-body)',fontWeight:800,fontSize:'1rem',letterSpacing:'0.5px',position:'relative',boxShadow:`0 8px 30px rgba(192,57,43,0.4)`,border:`1px solid rgba(255,200,180,0.2)`}}>
                🌸 Mulai Perjalanan →
              </motion.a>
            </div>
          </Reveal>
        </div>

      </JapanBgSection>

      {/* ══ CONTACT ══ */}
      <ContactSection/>
      {/* ══ FOOTER ══ */}
      <Footer/>

      <style>{`
        @media(min-width:768px){#about-row{flex-direction:row!important;align-items:flex-start!important;}#about-row>*{width:50%;}}
        @media(min-width:1024px){#hgrid{grid-template-columns:1fr 1fr!important;}#htag{justify-content:flex-end!important;}}
      `}</style>
    </div>
  );
};

export default Home;
