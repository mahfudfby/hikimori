// src/pages/Home.tsx — Japanese Calligraphy Theme 書道
// Palette: Red · Black · Gold · White — Masculine Portfolio
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

const D_HOME:HomeData={heroTitle:'Mahfud Febry Styanto, S.Kom,. CHRO',heroSubtitle:"HR Professional Officer' | General Affairs | IT Support Specialist | Website Developer | Network Engineer | Content Writer | F&B Operations",heroTagline:'We back visionaries and craft ventures that define what comes next.',heroCtaSecondary:'Start a Chat',heroCtaSecondaryLink:'#contact',heroCta:'Explore Now',heroCtaLink:'/portofolio',heroPhotoUrl:'',heroTagRight:'Nganjuk, Jawa Timur'};
const D_ABOUT:AboutData={name:'Mahfudfebry',location:'Nganjuk, Indonesia',bio1:'Halo! Nama saya Mahfudfebry, seorang profesional muda dari Nganjuk, Indonesia. Portfolio ini adalah kumpulan karya dan proyek terbaik saya yang mencerminkan keahlian, kreativitas, dan pertumbuhan profesional.',bio2:'Di setiap proyek, saya selalu berusaha memberikan hasil terbaik — dari desain visual yang kuat hingga solusi HR dan IT yang efisien dan berdampak.',photoUrl:''};
const D_SKILLS:SkillItem[]=[{id:'1',number:'01',title:'Branding & Identity Design',desc:"Crafting memorable logos and visual systems that reflect a brand's essence."},{id:'2',number:'02',title:'Creativity & Problem-Solving',desc:'Thinking outside the box while solving design challenges with strategic insight.'},{id:'3',number:'03',title:'Concept Development',desc:'Skilled in brainstorming and translating abstract ideas into visual narratives.'},{id:'4',number:'04',title:'Proper Time Management',desc:'Capable of handling multiple projects and meeting tight deadlines.'}];
const D_EXP:ExpItem[]=[{id:'1',position:'HR / General Affairs',company:'UD Duta Pangan',period:'2020–2023',icon:'👥',tags:'Vendor Management,Stock Monitoring,Facility Maintenance,Workload Analysis'},{id:'2',position:'Staff Administrasi',company:'UD Duta Pangan',period:'2020–2023',icon:'📋',tags:'Document Processing,Administrative Support,Filing & Archiving,Reporting'},{id:'3',position:'IT Support',company:'UD Duta Pangan',period:'2020–2023',icon:'💻',tags:'Hardware Troubleshooting,Software Installation,Network Setup,User Training'}];
const D_CONTACT:ContactData={email:'mahfudfebry@hikimori.web.id',location:'Nganjuk, Indonesia',website:'hikimori.web.id',instagram:'',linkedin:'',twitter:''};
const D_CERT:CertItem[]=[{id:'1',name:'Google Digital Marketing',year:'2023',issuer:'Google',subtitle:'Fundamentals of Digital Marketing',imageUrl:''},{id:'2',name:'HR Management Professional',year:'2022',issuer:'BNSP Indonesia',subtitle:'Sertifikasi Kompetensi SDM',imageUrl:''}];
const FALLBACK_PHOTO='https://res.cloudinary.com/dl4pyan8v/image/upload/WhatsApp_Image_2026-06-16_at_03.45.15_axvhg3';
const HERO_VIDEO='https://res.cloudinary.com/dl4pyan8v/video/upload/v1782631692/HomeHikimori_v2_mxmgio.mp4';
const CONTACT_VIDEO='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4';
const SERVICES_LIST=['Website','Mobile App','Web App','E-Commerce','Visual Identity','3D & Motion','Digital Marketing','Growth & Consulting','Other'];
const ls=<T,>(key:string,fb:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fb;}catch{return fb;}};

/* ─── Responsive hook ─── */
const useIsMobile=()=>{const [m,setM]=useState(()=>typeof window!=='undefined'&&window.innerWidth<768);useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[]);return m;};

/* ══════════════════════════════════════════
   PALETTE — Red · Black · Gold · White
   書道カラー
══════════════════════════════════════════ */
const J={
  // Blacks
  ink:'#080808',   inkD:'#030303',   inkM:'#111',   inkL:'#1a1a1a',   charcoal:'#1c1c1c',
  // Crimsons
  red:'#8B1A1A',   redL:'#c0392b',   redD:'#5c0e0e', redV:'#a01515',
  redGlow:'rgba(139,26,26,0.35)',  redBg:'rgba(139,26,26,0.08)',
  // Golds
  gold:'#c9a030',  goldL:'#d4af50',  goldB:'#e8c870', goldD:'#8a6e18',
  goldGlow:'rgba(201,160,48,0.3)',  goldBg:'rgba(201,160,48,0.08)',
  // Whites
  white:'#f5f5f0', whiteD:'#d8d0c0', whiteDim:'rgba(245,245,240,0.65)',
  // Overlays
  ov78:'rgba(5,3,0,0.78)',  ov82:'rgba(4,2,0,0.82)',  ov85:'rgba(3,1,0,0.85)',  ov88:'rgba(2,1,0,0.88)',
};

/* ══════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════ */
const LG:React.CSSProperties={background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',boxShadow:'inset 0 1px 1px rgba(255,255,255,0.08)',position:'relative'};

const FadeIn:React.FC<{children:React.ReactNode;delay?:number;duration?:number;style?:React.CSSProperties}>=({children,delay=0,duration=1000,style={}})=>{
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t);},[delay]);
  return <div style={{opacity:v?1:0,transition:`opacity ${duration}ms ease`,...style}}>{children}</div>;
};

const AnimatedHeading:React.FC<{text:string;style?:React.CSSProperties}>=({text,style={}})=>{
  const [a,setA]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t);},[]);
  const lines=text.split('\n');
  return <h1 style={{margin:0,...style}}>{lines.map((line,li)=>{const prev=lines.slice(0,li).reduce((acc,l)=>acc+l.length,0);return <span key={li} style={{display:'block'}}>{line.split('').map((char,ci)=>{const d=(200+(prev+ci)*30)/1000;return <span key={ci} style={{display:'inline-block',opacity:a?1:0,transform:a?'none':'translateX(-18px)',transition:`opacity 500ms ease ${d}s,transform 500ms ease ${d}s`}}>{char===' '?'\u00A0':char}</span>;})}</span>;})}  </h1>;
};

const ShineHeading:React.FC<{text:string;style?:React.CSSProperties}>=({text,style={}})=>{
  const [a,setA]=useState(false);
  const isMobile=useIsMobile();
  useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t);},[]);
  return <>
    <style>{`
      @keyframes shine-sweep{0%{left:-120%}100%{left:150%}}
      .shine-wrap{position:relative;display:inline-block;overflow:hidden;}
      .shine-wrap::after{content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.55) 50%,rgba(255,220,100,0.35) 60%,transparent 80%);animation:shine-sweep 3s ease-in-out infinite;pointer-events:none;}
    `}</style>
    <h1 className="shine-wrap" style={{
      margin:0,
      whiteSpace:isMobile?'normal':'nowrap',
      fontSize:isMobile?'clamp(1.05rem,5.5vw,1.6rem)':'clamp(1.1rem,3.2vw,2.8rem)',
      textAlign:'center',
      textShadow:`2px 2px 0px rgba(139,26,26,0.9),4px 4px 0px rgba(100,10,10,0.7),6px 6px 0px rgba(60,5,5,0.5),8px 8px 12px rgba(0,0,0,0.8),0 0 30px rgba(201,160,48,0.3)`,
      ...style
    }}>
      {text.split('').map((char,ci)=>{
        const d=(200+ci*25)/1000;
        return <span key={ci} style={{display:'inline-block',opacity:a?1:0,transform:a?'none':'translateX(-18px)',transition:`opacity 500ms ease ${d}s,transform 500ms ease ${d}s`}}>{char===' '?'\u00A0':char}</span>;
      })}
    </h1>
  </>;
};

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
      <motion.div style={{position:'absolute',inset:0,borderRadius:'inherit',pointerEvents:'none',background:`radial-gradient(circle at ${gx} ${gy},rgba(201,160,48,0.1) 0%,transparent 65%)`,zIndex:10}}/>
    </motion.div>
  </motion.div>;
};

const Reveal:React.FC<{children:React.ReactNode;direction?:'up'|'left'|'right'|'scale'|'fade';delay?:number;style?:React.CSSProperties}>=({children,direction='up',delay=0,style={}})=>{
  const v={hidden:{opacity:0,y:direction==='up'?50:0,x:direction==='left'?-50:direction==='right'?50:0,scale:direction==='scale'?0.8:1,filter:'blur(4px)'},visible:{opacity:1,y:0,x:0,scale:1,filter:'blur(0px)',transition:{duration:0.9,ease:[0.22,1,0.36,1],delay}}};
  return <motion.div variants={v} initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} style={style}>{children}</motion.div>;
};

const InkRipple:React.FC<{children:React.ReactNode;style?:React.CSSProperties}>=({children,style={}})=>{
  const [rips,setRips]=useState<{id:number;x:number;y:number}[]>([]);
  const click=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();const id=Date.now();
    setRips(p=>[...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(()=>setRips(p=>p.filter(r=>r.id!==id)),900);
  };
  return <div style={{position:'relative',overflow:'hidden',...style}} onClick={click}>
    {children}
    {rips.map(r=><motion.div key={r.id} style={{position:'absolute',left:r.x,top:r.y,width:0,height:0,borderRadius:'50%',border:`2px solid ${J.red}`,transform:'translate(-50%,-50%)',pointerEvents:'none'}}
      animate={{width:240,height:240,opacity:[0.7,0]}} transition={{duration:0.9,ease:'easeOut'}}/>)}
  </div>;
};

/* ══════════════════════════════════════════
   STARS (hero bg — unchanged)
══════════════════════════════════════════ */
const Stars:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    const stars=Array.from({length:100},()=>({x:Math.random()*1400,y:Math.random()*900,r:Math.random()*1.2+0.2,a:Math.random(),da:(Math.random()*0.005+0.001)*(Math.random()<0.5?1:-1)}));
    const shoots:any[]=[]; let next=0,t=0;
    const spawn=()=>{const a=(Math.random()*25+15)*Math.PI/180,sp=Math.random()*7+6,len=Math.random()*120+80,life=len/sp;shoots.push({x:Math.random()*c.width*0.8,y:Math.random()*c.height*0.4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len,life,maxLife:life});};
    const tick=()=>{ctx.clearRect(0,0,c.width,c.height);stars.forEach(s=>{s.a=Math.max(0.1,Math.min(1,s.a+s.da));if(s.a<=0.1||s.a>=1)s.da*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(245,240,230,${s.a})`;ctx.fill();});
      t++;if(t>=next){spawn();next=t+Math.floor(Math.random()*200+100);}
      for(let i=shoots.length-1;i>=0;i--){const s=shoots[i];const prog=1-s.life/s.maxLife;const alpha=s.life<20?s.life/20:1;const ang=Math.atan2(s.vy,s.vx);const tx=s.x-Math.cos(ang)*s.len*Math.min(prog*2,1);const ty=s.y-Math.sin(ang)*s.len*Math.min(prog*2,1);const g=ctx.createLinearGradient(tx,ty,s.x,s.y);g.addColorStop(0,'rgba(201,160,48,0)');g.addColorStop(1,`rgba(245,240,230,${alpha})`);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.stroke();s.x+=s.vx;s.y+=s.vy;s.life--;if(s.life<=0)shoots.splice(i,1);}
      raf=requestAnimationFrame(tick);};
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}}/>;
};

/* ══════════════════════════════════════════
   CALLIGRAPHY ASSETS — Red · Black · Gold
══════════════════════════════════════════ */

/* Animated ink brush stroke canvas */
const InkBrushCanvas:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    interface Stroke{x:number;y:number;pts:{x:number;y:number}[];len:number;maxLen:number;vx:number;vy:number;w:number;color:string;alpha:number;life:number;}
    const strokes:Stroke[]=[];let next=0,t=0;
    const spawnStroke=()=>{
      const isRed=Math.random()<0.3;
      const color=isRed?`rgba(139,26,26,`:`rgba(201,160,48,`;
      const maxLen=Math.floor(Math.random()*80+40);
      strokes.push({
        x:Math.random()*c.width,y:Math.random()*c.height,
        pts:[],len:0,maxLen,
        vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*1.5,
        w:Math.random()*3+1,
        color,alpha:Math.random()*0.35+0.1,life:maxLen+60,
      });
    };
    const tick=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      t++;if(t>=next){spawnStroke();next=t+Math.floor(Math.random()*120+60);}
      for(let i=strokes.length-1;i>=0;i--){
        const s=strokes[i];
        if(s.pts.length<s.maxLen){s.pts.push({x:s.x,y:s.y});s.x+=s.vx+(Math.random()-0.5)*0.5;s.y+=s.vy+(Math.random()-0.5)*0.5;}
        if(s.pts.length>1){
          for(let j=1;j<s.pts.length;j++){
            const fade=j/s.pts.length;const decay=s.life<40?s.life/40:1;
            ctx.beginPath();ctx.moveTo(s.pts[j-1].x,s.pts[j-1].y);ctx.lineTo(s.pts[j].x,s.pts[j].y);
            ctx.strokeStyle=`${s.color}${(s.alpha*fade*decay).toFixed(2)})`;
            ctx.lineWidth=s.w*(0.5+fade*0.5)*decay;ctx.lineCap='round';ctx.stroke();
          }
        }
        s.life--;if(s.life<=0)strokes.splice(i,1);
      }
      raf=requestAnimationFrame(tick);
    };
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1}}/>;
};

/* Gold circuit lines */
const GoldLines:React.FC=()=>{
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;let raf:number;
    const resize=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};resize();window.addEventListener('resize',resize);
    const lines=Array.from({length:16},()=>({x1:Math.random()*1400,y1:Math.random()*900,x2:Math.random()*1400,y2:Math.random()*900,prog:Math.random(),speed:Math.random()*0.003+0.001,alpha:Math.random()*0.25+0.08,dir:(Math.random()<0.5?1:-1) as 1|-1}));
    const tick=()=>{ctx.clearRect(0,0,c.width,c.height);lines.forEach(l=>{l.prog+=l.speed*l.dir;if(l.prog>1){l.prog=1;l.dir=-1;l.x2=Math.random()*c.width;l.y2=Math.random()*c.height;}if(l.prog<0){l.prog=0;l.dir=1;l.x1=Math.random()*c.width;l.y1=Math.random()*c.height;}const g=ctx.createLinearGradient(l.x1,l.y1,l.x2,l.y2);g.addColorStop(0,'rgba(201,160,48,0)');g.addColorStop(l.prog,`rgba(212,175,55,${l.alpha})`);g.addColorStop(Math.min(l.prog+0.05,1),`rgba(201,160,48,${l.alpha*0.5})`);g.addColorStop(1,'rgba(201,160,48,0)');ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);ctx.strokeStyle=g;ctx.lineWidth=0.8;ctx.stroke();const nx=l.x1+(l.x2-l.x1)*l.prog;const ny=l.y1+(l.y2-l.y1)*l.prog;ctx.beginPath();ctx.arc(nx,ny,1.5,0,Math.PI*2);ctx.fillStyle=`rgba(212,175,55,${l.alpha*1.5})`;ctx.fill();});raf=requestAnimationFrame(tick);};
    tick();return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2}}/>;
};

/* Crack texture SVG */
const CrackOverlay:React.FC=()=>(
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.15}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 900">
    <path d="M120 50 L180 120 L140 200 L200 280 L160 380 L220 450 L180 560 L240 640 L200 750 L260 850" stroke="rgba(201,160,48,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    <path d="M280 30 L240 100 L290 180 L250 260 L300 350 L260 440 L310 520 L270 620 L320 720 L280 820" stroke="rgba(201,160,48,0.5)" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
    <path d="M60 150 L120 180 L80 230 L150 260 L100 320" stroke="rgba(139,26,26,0.4)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    <path d="M320 200 L360 240 L310 290 L370 340 L330 400" stroke="rgba(139,26,26,0.35)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    {[[90,300],[210,400],[330,500],[150,600],[270,700]].map(([x,y],i)=>(
      <g key={i} transform={`translate(${x},${y}) rotate(45)`}>
        <rect x="-5" y="-5" width="10" height="10" fill="none" stroke="rgba(201,160,48,0.25)" strokeWidth="0.6"/>
      </g>
    ))}
  </svg>
);

/* Smoke */
const SmokeCloud:React.FC<{style?:React.CSSProperties;delay?:number;flip?:boolean}>=({style={},delay=0,flip=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',filter:'blur(20px)',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{x:[0,12,0,-8,0],y:[0,-6,0,-4,0],opacity:[0.55,0.75,0.45,0.65,0.55]}}
    transition={{duration:9+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 200 100" width="200" height="100">
      <ellipse cx="100" cy="60" rx="90" ry="40" fill="rgba(8,5,0,0.9)"/>
      <ellipse cx="70"  cy="45" rx="55" ry="35" fill="rgba(12,6,0,0.85)"/>
      <ellipse cx="130" cy="48" rx="50" ry="30" fill="rgba(10,5,0,0.8)"/>
      <ellipse cx="100" cy="35" rx="40" ry="28" fill="rgba(15,8,0,0.75)"/>
    </svg>
  </motion.div>
);

/* Samurai Mon — bold geometric crest */
const SamuraiMon:React.FC<{style?:React.CSSProperties;delay?:number;size?:number;variant?:number}>=({style={},delay=0,size=90,variant=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{opacity:[0.15,0.4,0.15],rotate:[0,variant%2===0?3:-3,0]}}
    transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={J.gold} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke={J.red} strokeWidth="0.8" opacity="0.5"/>
      {variant===0 && <>
        {/* Tomoe (tomoe pattern - 3 comma swirls) */}
        {[0,120,240].map((_,i)=>{const a=(i*120-90)*Math.PI/180;return <path key={i} d={`M50 50 Q${50+Math.cos(a)*28} ${50+Math.sin(a)*28} ${50+Math.cos(a+Math.PI/3)*20} ${50+Math.sin(a+Math.PI/3)*20} A8 8 0 1 0 ${50+Math.cos(a)*12} ${50+Math.sin(a)*12} Z`} fill={`rgba(201,160,48,0.35)`} stroke={J.gold} strokeWidth="0.8"/>;})}
        <circle cx="50" cy="50" r="6" fill={`rgba(139,26,26,0.5)`} stroke={J.red} strokeWidth="1"/>
      </>}
      {variant===1 && <>
        {/* Diamond cross */}
        {[0,45,90,135].map((_,i)=>{const a=i*45*Math.PI/180;return <line key={i} x1={50+Math.cos(a)*8} y1={50+Math.sin(a)*8} x2={50+Math.cos(a)*38} y2={50+Math.sin(a)*38} stroke={J.gold} strokeWidth="1.5" opacity="0.7"strokeLinecap="round"/>;})}
        {[0,45,90,135,180,225,270,315].map((_,i)=>{const a=i*45*Math.PI/180;return <circle key={i} cx={50+Math.cos(a)*28} cy={50+Math.sin(a)*28} r="2.5" fill={J.gold} opacity="0.6"/>;})  }
        <polygon points="50,35 57,47 50,59 43,47" fill="none" stroke={J.red} strokeWidth="1.2" opacity="0.7"/>
      </>}
      {variant===2 && <>
        {/* Six-pointed pattern */}
        {[...Array(6)].map((_,i)=>{const a=i*60*Math.PI/180;return <polygon key={i} points={`${50+Math.cos(a)*35},${50+Math.sin(a)*35} ${50+Math.cos(a+Math.PI/6)*18},${50+Math.sin(a+Math.PI/6)*18} ${50+Math.cos(a-Math.PI/6)*18},${50+Math.sin(a-Math.PI/6)*18}`} fill={`rgba(201,160,48,0.2)`} stroke={J.gold} strokeWidth="0.8" opacity="0.7"/>;})  }
        <circle cx="50" cy="50" r="8" fill={`rgba(139,26,26,0.4)`} stroke={J.red} strokeWidth="1.2"/>
      </>}
    </svg>
    <motion.div animate={{opacity:[0.1,0.3,0.1],scale:[1,1.2,1]}} transition={{duration:3+delay,repeat:Infinity}}
      style={{position:'absolute',inset:-15,borderRadius:'50%',background:`radial-gradient(circle,rgba(139,26,26,0.2) 0%,transparent 70%)`,filter:'blur(6px)'}}/>
  </motion.div>
);

/* Katana blade silhouette */
const Katana:React.FC<{style?:React.CSSProperties;delay?:number;vertical?:boolean}>=({style={},delay=0,vertical=false})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transform:vertical?'rotate(90deg)':'none',...style}}
    animate={{opacity:[0.2,0.45,0.2],x:[0,3,0]}}
    transition={{duration:6+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 280 20" width="280" height="20">
      {/* Blade */}
      <path d="M0 10 L240 10 L270 8 L280 6" stroke={`rgba(245,245,240,0.6)`} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M0 10 L240 10 L270 12 L280 14" stroke={`rgba(245,245,240,0.3)`} strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      {/* Gold edge line */}
      <path d="M10 9 L240 9" stroke={J.gold} strokeWidth="0.8" opacity="0.5"/>
      {/* Tsuba (guard) */}
      <ellipse cx="28" cy="10" rx="6" ry="9" fill={`rgba(201,160,48,0.3)`} stroke={J.gold} strokeWidth="1"/>
      {/* Handle */}
      <rect x="0" y="7" width="28" height="6" rx="2" fill={`rgba(139,26,26,0.4)`} stroke={J.red} strokeWidth="0.8"/>
      {[5,10,15,20,25].map(x=><line key={x} x1={x} y1="7" x2={x+2} y2="13" stroke={`rgba(201,160,48,0.4)`} strokeWidth="0.8"/>)}
      {/* Blood groove */}
      <line x1="35" y1="9.5" x2="200" y2="9.5" stroke={`rgba(139,26,26,0.3)`} strokeWidth="0.6"/>
      {/* Tip glow */}
      <motion.circle cx="278" cy="7" r="2" fill={J.gold} animate={{opacity:[0.3,0.8,0.3]}} transition={{duration:2,repeat:Infinity,delay}}/>
    </svg>
  </motion.div>
);

/* Bold Kanji stamp effect */
const KanjiStamp:React.FC<{kanji:string;style?:React.CSSProperties;delay?:number;size?:number}>=({kanji,style={},delay=0,size=80})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    initial={{scale:0,opacity:0}} animate={{scale:[0,1.15,1],opacity:[0,0.4,0.25]}}
    transition={{duration:1.2,delay,ease:[0.22,1,0.36,1]}}>
    <motion.div animate={{opacity:[0.25,0.45,0.25]}} transition={{duration:4+delay,repeat:Infinity}}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <rect x="2" y="2" width="96" height="96" rx="4" fill="none" stroke={J.red} strokeWidth="3" opacity="0.8"/>
        <rect x="6" y="6" width="88" height="88" rx="2" fill="none" stroke={J.red} strokeWidth="1" opacity="0.5"/>
        <text x="50" y="68" textAnchor="middle" fontSize="54" fontFamily="serif" fill={`rgba(139,26,26,0.85)`} fontWeight="bold">{kanji}</text>
      </svg>
    </motion.div>
  </motion.div>
);

/* Ink ground circle (replaces kamon floor) */
const InkCircle:React.FC<{style?:React.CSSProperties;delay?:number;size?:number;color?:'red'|'gold'}>=({style={},delay=0,size=120,color='red'})=>{
  const c=color==='red'?J.red:J.gold;
  return (
    <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
      animate={{opacity:[0.1,0.3,0.1],scale:[0.96,1.04,0.96]}}
      transition={{duration:4+delay,repeat:Infinity,ease:'easeInOut',delay}}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <motion.circle cx="60" cy="60" r="55" fill="none" stroke={c} strokeWidth="2"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:2,delay:delay+0.5}}/>
        <motion.circle cx="60" cy="60" r="44" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5"
          initial={{pathLength:0}} animate={{pathLength:0.8}} transition={{duration:2.5,delay:delay+1}}/>
        {[...Array(8)].map((_,i)=>{const a=i*45*Math.PI/180;return <motion.line key={i} x1={60+Math.cos(a)*46} y1={60+Math.sin(a)*46} x2={60+Math.cos(a)*56} y2={60+Math.sin(a)*56} stroke={c} strokeWidth="1.5" opacity="0.6" initial={{opacity:0}} animate={{opacity:0.6}} transition={{delay:delay+0.1*i}}/>;})  }
        <circle cx="60" cy="60" r="6" fill={`rgba(139,26,26,0.3)`} stroke={c} strokeWidth="1"/>
      </svg>
      <motion.div animate={{opacity:[0.15,0.4,0.15]}} transition={{duration:3+delay,repeat:Infinity}}
        style={{position:'absolute',inset:-20,borderRadius:'50%',background:`radial-gradient(circle,${c}22 0%,transparent 70%)`,filter:'blur(8px)'}}/>
    </motion.div>
  );
};

/* War banner / Nobori flag */
const Nobori:React.FC<{style?:React.CSSProperties;delay?:number;kanji?:string}>=({style={},delay=0,kanji='武'})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    animate={{rotate:[0,1.5,-1,0.8,0],opacity:[0.35,0.55,0.35]}}
    transition={{duration:5+delay,repeat:Infinity,ease:'easeInOut',delay}}>
    <svg viewBox="0 0 40 140" width="40" height="140">
      {/* Pole */}
      <line x1="20" y1="0" x2="20" y2="140" stroke="rgba(139,90,40,0.6)" strokeWidth="3" strokeLinecap="round"/>
      {/* Flag body */}
      <rect x="4" y="8" width="32" height="100" rx="2" fill={`rgba(139,26,26,0.5)`} stroke={J.red} strokeWidth="1"/>
      {/* Gold trim */}
      <rect x="4" y="8" width="32" height="6" rx="1" fill={`rgba(201,160,48,0.4)`}/>
      <rect x="4" y="102" width="32" height="6" rx="1" fill={`rgba(201,160,48,0.4)`}/>
      {/* Kanji */}
      <text x="20" y="65" textAnchor="middle" fontSize="22" fontFamily="serif" fill="rgba(245,240,220,0.8)" fontWeight="bold">{kanji}</text>
      {/* Decorative line */}
      <line x1="10" y1="80" x2="30" y2="80" stroke={`rgba(201,160,48,0.4)`} strokeWidth="0.8"/>
    </svg>
  </motion.div>
);

/* Bold horizontal brush stroke */
const BrushStroke:React.FC<{style?:React.CSSProperties;width?:number;color?:string;delay?:number}>=({style={},width=300,color=J.red,delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',...style}}
    initial={{scaleX:0,opacity:0}} whileInView={{scaleX:1,opacity:1}} viewport={{once:true}}
    transition={{duration:0.9,ease:[0.22,1,0.36,1],delay}}>
    <svg viewBox={`0 0 ${width} 12`} width={width} height="12">
      <path d={`M0 6 Q${width*0.3} 3 ${width*0.6} 6 Q${width*0.8} 8 ${width} 5`} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.9"/>
      <path d={`M0 8 Q${width*0.3} 6 ${width*0.6} 8 Q${width*0.8} 10 ${width} 7`} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>
  </motion.div>
);

/* Torii gate — black with gold/red */
const ToriiGate:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.15})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{opacity:[opacity,opacity*1.4,opacity]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
    <svg viewBox="0 0 200 260" width="200" height="260">
      <rect x="5" y="20" width="190" height="16" rx="3" fill={J.redD}/>
      <path d="M5 36 Q100 10 195 36" stroke={J.redD} strokeWidth="8" fill="none"/>
      <rect x="18" y="55" width="164" height="12" rx="2" fill={J.redV}/>
      <rect x="28" y="67" width="18" height="193" rx="4" fill={J.redL}/>
      <rect x="154" y="67" width="18" height="193" rx="4" fill={J.redL}/>
      <rect x="20" y="110" width="160" height="9" rx="2" fill={J.redD} opacity="0.7"/>
      {/* Gold accents */}
      <rect x="5" y="20" width="190" height="2" fill={J.gold} opacity="0.4"/>
      <rect x="18" y="55" width="164" height="2" fill={J.gold} opacity="0.3"/>
    </svg>
  </motion.div>
);

/* Rising sun — bold geometric */
const RisingSun:React.FC<{style?:React.CSSProperties;opacity?:number}>=({style={},opacity=0.12})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',opacity,...style}}
    animate={{scale:[1,1.05,1],opacity:[opacity,opacity*1.5,opacity]}} transition={{duration:6,repeat:Infinity}}>
    <svg viewBox="0 0 160 160" width="160" height="160">
      {[...Array(16)].map((_,i)=>{const a=i*22.5*Math.PI/180;return <line key={i} x1={80+Math.cos(a)*62} y1={80+Math.sin(a)*62} x2={80+Math.cos(a)*76} y2={80+Math.sin(a)*76} stroke={J.red} strokeWidth={i%2===0?"2":"1"} opacity="0.6" strokeLinecap="round"/>;})  }
      <circle cx="80" cy="80" r="55" fill={`rgba(139,26,26,0.12)`} stroke={J.red} strokeWidth="2.5"/>
      <circle cx="80" cy="80" r="38" fill={`rgba(139,26,26,0.18)`} stroke={J.redL} strokeWidth="1.5"/>
      <circle cx="80" cy="80" r="22" fill={`rgba(139,26,26,0.28)`}/>
      <circle cx="80" cy="80" r="55" fill="none" stroke={J.gold} strokeWidth="0.8" opacity="0.35"/>
    </svg>
  </motion.div>
);

/* Ink building/structure (strong, masculine) */
const StrucBuilding:React.FC<{style?:React.CSSProperties;flip?:boolean;delay?:number}>=({style={},flip=false,delay=0})=>(
  <motion.div style={{position:'absolute',pointerEvents:'none',transform:flip?'scaleX(-1)':'none',...style}}
    animate={{opacity:[0.3,0.5,0.3]}} transition={{duration:5+delay,repeat:Infinity,delay}}>
    <svg viewBox="0 0 110 150" width="110" height="150">
      {/* Castle-style silhouette */}
      <rect x="5" y="60" width="100" height="90" fill="rgba(8,4,0,0.9)" stroke="rgba(201,160,48,0.25)" strokeWidth="1"/>
      {/* Battlements */}
      {[10,28,46,64,82].map(x=><rect key={x} x={x} y="48" width="14" height="14" fill="rgba(8,4,0,0.9)" stroke="rgba(201,160,48,0.2)" strokeWidth="0.8"/>)}
      {/* Roof */}
      <path d="M0 62 L55 20 L110 62" fill="rgba(12,6,0,0.92)" stroke="rgba(201,160,48,0.3)" strokeWidth="1"/>
      {/* Roof curve tips */}
      <path d="M2 60 Q-2 54 2 48" stroke="rgba(201,160,48,0.4)" strokeWidth="1.5" fill="none"/>
      <path d="M108 60 Q112 54 108 48" stroke="rgba(201,160,48,0.4)" strokeWidth="1.5" fill="none"/>
      {/* Windows — glowing */}
      {[[25,90],[50,90],[75,90],[35,115],[65,115]].map(([x,y],i)=>(
        <g key={i}>
          <rect x={x-7} y={y-10} width="14" height="18" rx="1" fill="rgba(201,160,48,0.08)" stroke="rgba(201,160,48,0.3)" strokeWidth="0.8"/>
          <motion.rect x={x-7} y={y-10} width="14" height="18" rx="1" fill="rgba(201,160,48,0.06)" animate={{opacity:[0.06,0.18,0.06]}} transition={{duration:2+i*0.3,repeat:Infinity,delay:i*0.4}}/>
        </g>
      ))}
      {/* Gate */}
      <path d="M42 150 L42 125 Q55 115 68 125 L68 150" fill="rgba(5,2,0,0.95)" stroke="rgba(201,160,48,0.25)" strokeWidth="1"/>
      {/* Red banner */}
      <rect x="48" y="48" width="14" height="30" fill="rgba(139,26,26,0.5)" stroke={J.red} strokeWidth="0.8"/>
      <text x="55" y="68" textAnchor="middle" fontSize="10" fill="rgba(245,240,220,0.7)" fontFamily="serif">武</text>
    </svg>
  </motion.div>
);

/* JapanBgSection wrapper */
const JapanBgSection:React.FC<{children:React.ReactNode;overlayColor?:string;style?:React.CSSProperties}>=({children,overlayColor=J.ov78,style={}})=>(
  <section style={{position:'relative',padding:'clamp(4rem,10vw,8rem) clamp(1rem,5vw,2rem)',overflow:'hidden',backgroundImage:"url('/japan-bg.jpg')",backgroundSize:'cover',backgroundPosition:'center top',backgroundAttachment:'fixed',...style}}>
    <div style={{position:'absolute',inset:0,background:overlayColor,zIndex:0}}/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%,rgba(20,5,0,0.1) 0%,rgba(5,0,0,0.5) 100%)',zIndex:0}}/>
    <div style={{position:'absolute',top:0,left:0,right:0,height:100,background:`linear-gradient(to bottom,${J.ink},transparent)`,zIndex:3,pointerEvents:'none'}}/>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:100,background:`linear-gradient(to top,${J.ink},transparent)`,zIndex:3,pointerEvents:'none'}}/>
    <CrackOverlay/>
    <GoldLines/>
    <div style={{position:'relative',zIndex:4}}>{children}</div>
  </section>
);

/* ══════════════════════════════════════════
   MARQUEE — Red bar
══════════════════════════════════════════ */
const Marquee:React.FC<{contact:ContactData}>=({contact})=>{
  const items=[
    contact.instagram&&{icon:'▶',label:'Instagram',value:'@'+contact.instagram,href:'https://instagram.com/'+contact.instagram},
    contact.linkedin &&{icon:'▶',label:'LinkedIn', value:contact.linkedin,      href:'https://linkedin.com/in/'+contact.linkedin},
    contact.twitter  &&{icon:'▶',label:'Twitter',  value:'@'+contact.twitter,  href:'https://twitter.com/'+contact.twitter},
    contact.email    &&{icon:'▶',label:'Email',    value:contact.email,         href:'mailto:'+contact.email},
    contact.website  &&{icon:'▶',label:'Website',  value:contact.website,       href:'https://'+contact.website},
    contact.location &&{icon:'▶',label:'Location', value:contact.location,      href:null},
    {icon:'▶',label:'Portfolio',value:'書道スタイル',href:null},
    {icon:'▶',label:'Open to Work',value:'Indonesia',href:null},
  ].filter(Boolean) as {icon:string;label:string;value:string;href:string|null}[];
  const doubled=[...items,...items,...items];
  return (
    <div style={{width:'100%',overflow:'hidden',background:`linear-gradient(90deg,${J.redD},${J.red},${J.redD})`,padding:'10px 0',position:'relative',zIndex:10,borderTop:`1px solid rgba(201,160,48,0.3)`,borderBottom:`1px solid rgba(201,160,48,0.3)`}}>
      <motion.div style={{display:'flex',width:'max-content'}} animate={{x:['0%','-33.33%']}} transition={{duration:26,repeat:Infinity,ease:'linear'}}>
        {doubled.map((item,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'0 24px',flexShrink:0,whiteSpace:'nowrap'}}>
            <span style={{color:J.gold,fontSize:'0.65rem'}}>◆</span>
            <span style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',fontWeight:700,color:'rgba(245,240,220,0.55)',textTransform:'uppercase',letterSpacing:'2px'}}>{item.label}</span>
            <span style={{color:'rgba(201,160,48,0.4)',fontSize:'0.8rem'}}>·</span>
            {item.href
              ?<a href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(245,240,220,0.9)',textDecoration:'none'}}>{item.value}</a>
              :<span style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:600,color:'rgba(245,240,220,0.9)'}}>{item.value}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   CERT CARD — Red seal style
══════════════════════════════════════════ */
const CertCard:React.FC<{cert:CertItem;index:number}>=({cert,index})=>{
  const [open,setOpen]=useState(false);
  const [imgLoaded,setImgLoaded]=useState(false);
  return (
    <Reveal direction="up" delay={index*0.09}>
      <InkRipple>
        <motion.div
          whileHover={!open?{y:-4,boxShadow:`0 20px 60px rgba(139,26,26,0.2),0 0 0 1px rgba(139,26,26,0.35)`}:{}}
          style={{borderRadius:12,overflow:'hidden',border:`1px solid rgba(139,26,26,${open?0.6:0.2})`,background:'rgba(8,4,0,0.9)',backdropFilter:'blur(16px)',transition:'all 0.3s'}}>
          <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',padding:'1.2rem 1.5rem',display:'flex',alignItems:'center',gap:'1.1rem',textAlign:'left'}}>
            {/* Red wax seal */}
            <div style={{flexShrink:0,width:50,height:50,borderRadius:'50%',background:`radial-gradient(circle,${J.red} 0%,${J.redD} 100%)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 16px rgba(139,26,26,0.5)`,position:'relative',border:`1px solid rgba(201,160,48,0.3)`}}>
              <span style={{fontFamily:'serif',fontSize:'1.2rem',color:'rgba(245,240,220,0.9)'}}>証</span>
            </div>
            <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:'0.2rem'}}>
              <div style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'clamp(0.9rem,2.2vw,1.05rem)',color:J.white,lineHeight:1.3,wordBreak:'break-word'}}>{cert.name||'—'}</div>
              <div style={{fontFamily:'var(--font-body)',fontSize:'0.82rem',color:J.goldL,fontWeight:600,display:'flex',alignItems:'center',gap:'0.4rem',flexWrap:'wrap'}}>
                <span style={{display:'inline-block',width:5,height:5,borderRadius:'50%',background:J.gold,flexShrink:0}}/>
                {cert.issuer||'—'}
                {cert.subtitle&&<span style={{color:'rgba(201,160,48,0.5)',fontWeight:400}}>· {cert.subtitle}</span>}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.1rem'}}>
                <span style={{fontFamily:'var(--font-body)',fontSize:'0.73rem',fontWeight:700,color:J.gold,background:'rgba(201,160,48,0.1)',border:`1px solid rgba(201,160,48,0.35)`,borderRadius:4,padding:'2px 10px',letterSpacing:'0.5px'}}>{cert.year||'—'}</span>
              </div>
            </div>
            <motion.div animate={{rotate:open?180:0}} transition={{duration:0.3}} style={{flexShrink:0,color:J.gold}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </motion.div>
          </button>
          <AnimatePresence>
            {open&&<motion.div key="sep" initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}} style={{height:1,background:`linear-gradient(to right,transparent,${J.red},${J.gold},transparent)`,margin:'0 1.5rem'}}/>}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {open&&(
              <motion.div key="img" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.45,ease:[0.4,0,0.2,1]}} style={{overflow:'hidden'}}>
                <div style={{padding:'1rem 1.5rem 1.5rem'}}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'1rem'}}>
                    {[{t:`📋 ${cert.name}`,c:J.white,bg:'rgba(255,255,255,0.05)'},{t:cert.issuer,c:J.goldL,bg:J.goldBg},{t:cert.subtitle,c:'rgba(201,160,48,0.6)',bg:'rgba(255,255,255,0.04)'},{t:`📅 ${cert.year}`,c:J.gold,bg:J.goldBg}].filter(x=>x.t).map((x,i)=>(
                      <span key={i} style={{fontFamily:'var(--font-body)',fontSize:'0.73rem',fontWeight:600,color:x.c,background:x.bg,border:`1px solid ${x.c}22`,borderRadius:5,padding:'3px 10px'}}>{x.t}</span>
                    ))}
                  </div>
                  <div style={{borderRadius:10,overflow:'hidden',border:`1px solid rgba(139,26,26,0.3)`,background:'rgba(0,0,0,0.5)',minHeight:200,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                    {cert.imageUrl?(
                      <>{!imgLoaded&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.8rem'}}>
                        <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} style={{width:36,height:36,borderRadius:'50%',border:`2.5px solid ${J.gold}`,borderTopColor:'transparent'}}/>
                        <span style={{color:'rgba(201,160,48,0.5)',fontSize:'0.78rem',fontFamily:'var(--font-body)'}}>Memuat...</span>
                      </div>}
                      <img src={cert.imageUrl} alt={cert.name} onLoad={()=>setImgLoaded(true)} style={{width:'100%',display:'block',objectFit:'contain',maxHeight:400,opacity:imgLoaded?1:0,transition:'opacity 0.4s'}}/></>
                    ):(
                      <div style={{textAlign:'center',padding:'3rem 2rem',color:'rgba(201,160,48,0.4)'}}>
                        <motion.div animate={{y:[0,-8,0]}} transition={{duration:2.5,repeat:Infinity}} style={{fontSize:'3rem',marginBottom:'0.8rem'}}>📜</motion.div>
                        <p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',lineHeight:1.6}}>Gambar belum diupload<br/><span style={{fontSize:'0.75rem',opacity:0.6}}>Upload via Admin Panel</span></p>
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

/* ══════════════════════════════════════════
   CONTACT SECTION (dipertahankan)
══════════════════════════════════════════ */
const ContactSection:React.FC=()=>{
  const [sel,setSel]=useState<string[]>([]);const [name,setName]=useState('');const [email,setEmail]=useState('');const [msg,setMsg]=useState('');const [sending,setSending]=useState(false);const [sent,setSent]=useState(false);
  const contact:ContactData=ls(LS_CONTACT,D_CONTACT);
  const toggle=(s:string)=>setSel(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setSending(true);await new Promise(r=>setTimeout(r,1000));setSending(false);setSent(true);};
  const inp:React.CSSProperties={flex:1,minWidth:0,fontSize:'0.875rem',padding:'10px 12px',borderRadius:10,border:'1px solid #e5e7eb',background:'transparent',outline:'none',fontFamily:'var(--font-body)',color:'#111',boxSizing:'border-box'};
  const IcoTW=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  const IcoIG=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  const IcoLI=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  const SBtn:React.FC<{icon:React.ReactNode;bg:string;color:string}>=({icon,bg,color})=><button type="button" style={{width:32,height:32,borderRadius:10,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:bg,color,flexShrink:0}}>{icon}</button>;
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

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
const Home:React.FC=()=>{
  const [hero,setHero]=useState<HomeData>(()=>ls(LS_HOME,D_HOME));
  const [about,setAbout]=useState<AboutData>(()=>ls(LS_ABOUT,D_ABOUT));
  const [skills,setSkills]=useState<SkillItem[]>(()=>ls(LS_SKILLS,D_SKILLS));
  const [exps,setExps]=useState<ExpItem[]>(()=>ls(LS_EXP,D_EXP));
  const [contact,setContact]=useState<ContactData>(()=>ls(LS_CONTACT,D_CONTACT));
  const [certs,setCerts]=useState<CertItem[]>(()=>ls(LS_CERT,D_CERT));
  const containerRef=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:containerRef,offset:['start start','end end']});
  const _py=useTransform(scrollYProgress,[0,1],[0,-60]); // parallax ref (keep for future use)

  useEffect(()=>{
    const onS=(e:StorageEvent)=>{if(e.key===LS_HOME&&e.newValue)try{setHero(JSON.parse(e.newValue));}catch{}if(e.key===LS_ABOUT&&e.newValue)try{setAbout(JSON.parse(e.newValue));}catch{}if(e.key===LS_SKILLS&&e.newValue)try{setSkills(JSON.parse(e.newValue));}catch{}if(e.key===LS_EXP&&e.newValue)try{setExps(JSON.parse(e.newValue));}catch{}if(e.key===LS_CONTACT&&e.newValue)try{setContact(JSON.parse(e.newValue));}catch{}if(e.key===LS_CERT&&e.newValue)try{setCerts(JSON.parse(e.newValue));}catch{}};
    const onC=(e:Event)=>{const{key,value}=(e as CustomEvent).detail;try{if(key===LS_HOME)setHero(JSON.parse(value));if(key===LS_ABOUT)setAbout(JSON.parse(value));if(key===LS_SKILLS)setSkills(JSON.parse(value));if(key===LS_EXP)setExps(JSON.parse(value));if(key===LS_CONTACT)setContact(JSON.parse(value));if(key===LS_CERT)setCerts(JSON.parse(value));}catch{}};
    window.addEventListener('storage',onS);window.addEventListener('hk-update',onC);
    return()=>{window.removeEventListener('storage',onS);window.removeEventListener('hk-update',onC);};
  },[]);

  const photo=about.photoUrl||FALLBACK_PHOTO;

  return (
    <div ref={containerRef} style={{background:J.ink,minHeight:'100vh',overflowX:'hidden'}}>

      {/* ══ HERO ══ */}
      <section style={{position:'relative',width:'100%',aspectRatio:'1920/1080',minHeight:440,maxHeight:'100vh',overflow:'hidden',display:'flex',flexDirection:'column',background:'#000',color:'#fff'}}>
        <video autoPlay loop muted playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0}}><source src={HERO_VIDEO} type="video/mp4"/></video>
        <Stars/>
        <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',height:'100%',padding:'clamp(56px,12vw,70px) clamp(1rem,5vw,4rem) clamp(16px,4vw,32px)'}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',gap:'clamp(0.8rem,3vw,1.5rem)'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',maxWidth:760}}>
              <ShineHeading text={hero.heroTitle} style={{fontWeight:800,marginBottom:'0.3rem',letterSpacing:'-0.01em',lineHeight:1.1,color:'#fff',fontFamily:'var(--font-display)',textTransform:'uppercase'}}/>
              <div className="hk-hero-subtitle"><AnimatedHeading text={hero.heroSubtitle} style={{fontSize:'clamp(0.45rem,1.1vw,0.8rem)',fontWeight:700,marginBottom:'0.8rem',letterSpacing:'0.04em',lineHeight:1.5,color:'rgba(255,255,255,0.85)',fontFamily:'var(--font-display)',textTransform:'uppercase',wordBreak:'break-word',textAlign:'center',maxWidth:'90vw'}}/></div>
              <FadeIn delay={800}><p style={{fontSize:'clamp(0.9rem,2vw,1.125rem)',color:'#d1d5db',margin:'0 auto 1.25rem',lineHeight:1.6,maxWidth:'520px'}}>{hero.heroTagline}</p></FadeIn>
              <FadeIn delay={1200}>
                <div className="hk-hero-cta-row" style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',justifyContent:'center'}}>
                  <a href={hero.heroCtaSecondaryLink||'#contact'} style={{textDecoration:'none'}}><button style={{background:'#fff',color:'#000',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:500,fontSize:'0.9rem',cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>{hero.heroCtaSecondary||'Start a Chat'}</button></a>
                  <Link to={hero.heroCtaLink||'/portofolio'} style={{textDecoration:'none'}}><button style={{...LG,border:'1px solid rgba(255,255,255,0.2)',color:'#fff',borderRadius:8,padding:'10px 24px',fontWeight:500,fontSize:'0.9rem',cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>{hero.heroCta}</button></Link>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={1400}>
              <div style={{...LG,border:'1px solid rgba(255,255,255,0.2)',borderRadius:12,padding:'10px 20px',display:'inline-block',maxWidth:'100%'}}>
                <span style={{fontSize:'clamp(1rem,2.5vw,1.5rem)',fontWeight:300,color:'#fff',fontFamily:'var(--font-body)',wordBreak:'break-word',display:'inline-flex',alignItems:'center',gap:'6px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width:'1em',height:'1em',flexShrink:0,color:J.red}}><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.697 3.5-8.027a8.25 8.25 0 00-16.5 0c0 3.33 1.556 6.014 3.5 8.027a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                  {hero.heroTagRight}
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Marquee contact={contact}/>

      {/* ══ ABOUT — 自己紹介 (Jiko Shokai) ══ */}
      <JapanBgSection overlayColor={J.ov82}>
        <InkBrushCanvas/>
        {/* Smoke base */}
        <SmokeCloud style={{left:'-5%',bottom:'2%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-5%',bottom:'4%',opacity:0.85}} delay={1.5} flip/>
        {/* Torii gates */}
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',top:'3%'}} opacity={0.08}/>
        {/* Samurai Mon circles */}
        <SamuraiMon style={{right:'4%',top:'12%'}} delay={0} size={100} variant={0}/>
        <SamuraiMon style={{left:'3%',bottom:'18%'}} delay={1.5} size={80} variant={1}/>
        {/* Katana blades */}
        <Katana style={{right:'5%',bottom:'25%'}} delay={0} vertical/>
        <Katana style={{left:'3%',top:'35%'}} delay={1}/>
        {/* Kanji stamps */}
        <KanjiStamp kanji="人" style={{right:'2%',bottom:'5%'}} delay={0.3} size={70}/>
        <KanjiStamp kanji="誠" style={{left:'1%',top:'8%'}} delay={0.8} size={60}/>
        {/* Ink circles */}
        <InkCircle style={{left:'8%',bottom:'12%'}} delay={0} size={90} color="red"/>
        <InkCircle style={{right:'8%',top:'20%'}} delay={1} size={70} color="gold"/>
        {/* Nobori flags */}
        <Nobori style={{right:'2%',top:'5%',opacity:0.5}} delay={0} kanji="武"/>
        <Nobori style={{left:'2%',top:'5%',opacity:0.45}} delay={0.8} kanji="道"/>
        {/* Rising sun */}
        <RisingSun style={{left:'3%',top:'10%'}} opacity={0.1}/>
        {/* Buildings */}
        <StrucBuilding style={{right:'0%',bottom:'3%',opacity:0.5}} delay={0}/>
        <StrucBuilding style={{left:'0%',bottom:'2%',opacity:0.45}} flip delay={1}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <div id="about-row" style={{display:'flex',flexDirection:'column',gap:'3rem',alignItems:'center'}}>
            <Reveal direction="left" style={{width:'100%',maxWidth:340,flexShrink:0}}>
              <TiltCard style={{borderRadius:16,width:'100%'}} intensity={10}>
                <InkRipple>
                  <div style={{borderRadius:16,overflow:'hidden',position:'relative',aspectRatio:'4/5',border:`2px solid rgba(139,26,26,0.5)`,boxShadow:`0 0 0 6px rgba(139,26,26,0.06),0 30px 80px rgba(0,0,0,0.7),0 0 60px rgba(139,26,26,0.12)`}}>
                    <img src={photo} alt={about.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                    <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,rgba(8,4,0,0.9) 0%,rgba(8,4,0,0.1) 50%,transparent 100%)`}}/>
                    {/* Red corner accents */}
                    <div style={{position:'absolute',top:8,left:8,width:20,height:20,borderTop:`2px solid ${J.gold}`,borderLeft:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',top:8,right:8,width:20,height:20,borderTop:`2px solid ${J.gold}`,borderRight:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',bottom:8,left:8,width:20,height:20,borderBottom:`2px solid ${J.gold}`,borderLeft:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',bottom:8,right:8,width:20,height:20,borderBottom:`2px solid ${J.gold}`,borderRight:`2px solid ${J.gold}`}}/>
                    <div style={{position:'absolute',bottom:'1rem',left:'1rem',right:'1rem'}}>
                      <motion.div whileHover={{scale:1.04}} style={{background:'rgba(139,26,26,0.85)',backdropFilter:'blur(8px)',borderRadius:8,padding:'0.5rem 1rem',color:J.white,fontWeight:700,fontSize:'0.82rem',display:'inline-block',wordBreak:'break-word',border:`1px solid rgba(201,160,48,0.3)`}}>
                        ⛩️ {about.location}
                      </motion.div>
                    </div>
                  </div>
                </InkRipple>
              </TiltCard>
            </Reveal>
            <Reveal direction="right" delay={0.15}>
              <div style={{maxWidth:560}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'0.8rem'}}>
                  <span style={{fontFamily:'serif',fontSize:'1.8rem',color:J.red}}>自</span>
                  <div>
                    <div style={{fontFamily:'var(--font-body)',color:J.gold,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Jiko Shokai · Profile</div>
                  </div>
                </div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5rem)',lineHeight:0.9,marginBottom:'0.2rem',color:J.white}}>ABOUT ME !</h2>
                <BrushStroke style={{position:'relative',marginBottom:'0.8rem'}} width={100} color={J.red} delay={0.3}/>
                <div style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'clamp(1.5rem,5vw,2.2rem)',fontWeight:700,marginBottom:'1.5rem',textShadow:`0 0 20px rgba(201,160,48,0.35)`}}>{about.name}</div>
                <p style={{color:J.whiteDim,lineHeight:1.9,marginBottom:'1rem',fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio1}</p>
                <p style={{color:'rgba(245,245,240,0.5)',lineHeight:1.9,fontSize:'clamp(0.88rem,2vw,1rem)'}}>{about.bio2}</p>
                <div style={{marginTop:'2rem'}}>
                  <motion.div whileHover={{scale:1.04,boxShadow:`0 8px 30px rgba(139,26,26,0.35)`}} whileTap={{scale:0.97}} style={{display:'inline-block'}}>
                    <Link to="/about" style={{display:'inline-flex',alignItems:'center',gap:8,background:J.redBg,color:J.goldL,textDecoration:'none',borderRadius:8,padding:'11px 26px',fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.9rem',border:`1px solid rgba(139,26,26,0.45)`,backdropFilter:'blur(6px)'}}>
                      詳細を見る → Selengkapnya
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </JapanBgSection>

      {/* ══ SERTIFIKASI — 証明書 (Shomeisho) ══ */}
      <JapanBgSection overlayColor={J.ov85}>
        <InkBrushCanvas/>
        <SmokeCloud style={{left:'-4%',bottom:'0%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-4%',bottom:'3%',opacity:0.85}} delay={1.8} flip/>
        <ToriiGate style={{right:'5%',top:'5%'}} opacity={0.07}/>
        <ToriiGate style={{left:'-2%',bottom:'8%'}} opacity={0.06}/>
        <SamuraiMon style={{left:'3%',top:'20%'}} delay={0} size={85} variant={2}/>
        <SamuraiMon style={{right:'3%',bottom:'20%'}} delay={1} size={75} variant={0}/>
        <InkCircle style={{left:'50%',bottom:'5%',transform:'translateX(-50%)'}} delay={0} size={150} color="red"/>
        <KanjiStamp kanji="証" style={{left:'2%',bottom:'8%'}} delay={0.5} size={75}/>
        <KanjiStamp kanji="明" style={{right:'2%',top:'10%'}} delay={1} size={65}/>
        <Nobori style={{left:'2%',top:'5%',opacity:0.45}} delay={0} kanji="証"/>
        <Nobori style={{right:'2%',top:'5%',opacity:0.45}} delay={1} kanji="書"/>
        <StrucBuilding style={{left:'0%',bottom:'2%',opacity:0.45}} flip delay={0}/>
        <StrucBuilding style={{right:'0%',bottom:'2%',opacity:0.4}} delay={1}/>

        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',marginBottom:'0.8rem'}}>
                <motion.div style={{height:1,width:50,background:`linear-gradient(to right,transparent,${J.red})`}} initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:0.8}}/>
                <span style={{fontFamily:'serif',fontSize:'1.6rem',color:J.red}}>証</span>
                <motion.div style={{height:1,width:50,background:`linear-gradient(to left,transparent,${J.red})`}} initial={{scaleX:0}} whileInView={{scaleX:1}} transition={{duration:0.8}}/>
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,8vw,5rem)',lineHeight:0.9,color:J.white,wordBreak:'break-word'}}>
                SERTIFI<span style={{color:J.red,textShadow:`0 0 30px rgba(139,26,26,0.6)`}}>KASI</span>
              </h2>
              <BrushStroke style={{position:'relative',margin:'0.8rem auto 0',display:'block',width:'fit-content'}} width={120} color={J.gold} delay={0.3}/>
              <p style={{color:'rgba(245,245,240,0.45)',marginTop:'0.8rem',fontSize:'0.88rem'}}>Klik kartu untuk melihat · 証明書</p>
            </div>
          </Reveal>
          {certs.length===0?(
            <Reveal direction="up"><div style={{textAlign:'center',padding:'3rem',color:'rgba(201,160,48,0.4)',border:`1px dashed rgba(139,26,26,0.3)`,borderRadius:12}}><div style={{fontSize:'3rem',marginBottom:'0.8rem'}}>📜</div><p>Belum ada sertifikasi.</p></div></Reveal>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {certs.map((cert,i)=><CertCard key={cert.id} cert={cert} index={i}/>)}
            </div>
          )}
        </div>
      </JapanBgSection>

      {/* ══ EXPERIENCE — 経歴 (Keireki / Career Path) ══ */}
      <JapanBgSection overlayColor={J.ov82}>
        <InkBrushCanvas/>
        {/* Stars */}
        {[...Array(18)].map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',width:2,height:2,borderRadius:'50%',background:J.white,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,pointerEvents:'none'}}
            animate={{opacity:[0.1,0.6,0.1]}} transition={{duration:2+Math.random()*3,repeat:Infinity,delay:Math.random()*4}}/>
        ))}
        <SmokeCloud style={{left:'-6%',bottom:'0%',opacity:0.95}} delay={0}/>
        <SmokeCloud style={{right:'-6%',bottom:'2%',opacity:0.9}} delay={1.2} flip/>
        <SmokeCloud style={{left:'25%',bottom:'0%',opacity:0.6}} delay={0.7}/>
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',bottom:'5%'}} opacity={0.07}/>
        <SamuraiMon style={{right:'3%',top:'15%'}} delay={0} size={90} variant={1}/>
        <SamuraiMon style={{left:'3%',bottom:'20%'}} delay={1.5} size={70} variant={2}/>
        <Katana style={{top:'12%',left:'5%',opacity:0.5}} delay={0}/>
        <Katana style={{bottom:'18%',right:'5%',opacity:0.45}} delay={1.2}/>
        <KanjiStamp kanji="歴" style={{right:'1%',bottom:'5%'}} delay={0.4} size={70}/>
        <KanjiStamp kanji="仕" style={{left:'1%',top:'8%'}} delay={0.9} size={60}/>
        <Nobori style={{left:'2%',top:'4%',opacity:0.4}} delay={0} kanji="経"/>
        <Nobori style={{right:'2%',top:'4%',opacity:0.4}} delay={0.6} kanji="道"/>
        <StrucBuilding style={{left:'0%',top:'8%',opacity:0.4}} delay={0}/>
        <StrucBuilding style={{right:'0%',top:'10%',opacity:0.35}} flip delay={0.8}/>

        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.8rem',marginBottom:'0.6rem'}}>
                <span style={{fontFamily:'serif',fontSize:'1.6rem',color:J.gold}}>経</span>
                <span style={{fontFamily:'var(--font-body)',color:J.gold,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Keireki · Career Path</span>
              </div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.9,color:J.white,wordBreak:'break-word'}}>
                PENGALAMAN <span style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'55%',textShadow:`0 0 20px rgba(201,160,48,0.5)`}}>Kerja</span>
              </h2>
              <p style={{color:'rgba(245,245,240,0.4)',marginTop:'0.8rem',fontSize:'0.88rem'}}>Pengalaman Profesional &amp; Riwayat Kerja</p>
            </div>
          </Reveal>
          {/* Timeline */}
          <div style={{position:'relative'}}>
            <motion.div initial={{scaleY:0}} whileInView={{scaleY:1}} viewport={{once:true}} transition={{duration:1.8,ease:'easeOut'}}
              style={{position:'absolute',left:'clamp(16px,5vw,32px)',top:0,bottom:0,width:2,background:`linear-gradient(to bottom,transparent,${J.red},${J.gold},transparent)`,transformOrigin:'top',zIndex:1}}/>
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
              {exps.map((exp,i)=>(
                <Reveal key={exp.id} direction="right" delay={i*0.14}>
                  <div style={{display:'flex',gap:'clamp(1rem,4vw,2rem)',position:'relative'}}>
                    <div style={{flexShrink:0,width:'clamp(32px,10vw,64px)',display:'flex',flexDirection:'column',alignItems:'center'}}>
                      <motion.div
                        animate={{boxShadow:[`0 0 8px ${J.red}44`,`0 0 20px ${J.red}88`,`0 0 8px ${J.red}44`]}}
                        transition={{duration:2,repeat:Infinity,delay:i*0.5}} whileHover={{scale:1.25}}
                        style={{width:44,height:44,borderRadius:'50%',background:`radial-gradient(circle,rgba(139,26,26,0.2),rgba(139,26,26,0.05))`,border:`2px solid ${J.red}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',position:'relative',zIndex:2}}>
                        {exp.icon}
                        <motion.div animate={{scale:[1,1.4,1],opacity:[0.5,0,0.5]}} transition={{duration:2,repeat:Infinity,delay:i*0.5}} style={{position:'absolute',inset:-4,borderRadius:'50%',border:`1px solid ${J.red}`,pointerEvents:'none'}}/>
                      </motion.div>
                    </div>
                    <TiltCard style={{flex:1,borderRadius:12}} intensity={5}>
                      <InkRipple>
                        <motion.div whileHover={{borderColor:`rgba(139,26,26,0.55)`,background:'rgba(15,6,2,0.92)'}}
                          style={{background:'rgba(10,4,0,0.88)',border:`1px solid rgba(139,26,26,0.18)`,borderRadius:12,padding:'1.3rem clamp(1rem,3vw,1.8rem)',backdropFilter:'blur(12px)',transition:'all 0.3s',position:'relative',overflow:'hidden'}}>
                          <motion.div animate={{opacity:[0.04,0.1,0.04]}} transition={{duration:4+i,repeat:Infinity}} style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:`radial-gradient(circle,${J.red}33,transparent 70%)`}}/>
                          {/* Kanji watermark */}
                          <div style={{position:'absolute',right:'1rem',top:'0.5rem',fontFamily:'serif',fontSize:'2.5rem',color:`rgba(139,26,26,0.07)`,userSelect:'none',lineHeight:1}}>{['業','功','術'][i%3]}</div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'0.5rem',marginBottom:'0.3rem',flexWrap:'wrap',position:'relative',zIndex:1}}>
                            <h3 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1rem,3vw,1.4rem)',color:J.white,lineHeight:1.2}}>{exp.position}</h3>
                            {exp.period&&<span style={{background:J.redBg,color:J.goldL,borderRadius:5,padding:'3px 10px',fontSize:'0.72rem',fontWeight:700,flexShrink:0,whiteSpace:'nowrap',border:`1px solid rgba(139,26,26,0.3)`}}>{exp.period}</span>}
                          </div>
                          {exp.company&&<div style={{fontFamily:'var(--font-script)',color:J.gold,fontSize:'1.05rem',marginBottom:'0.8rem',position:'relative',zIndex:1}}>{exp.company}</div>}
                          {exp.tags&&<div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',position:'relative',zIndex:1}}>{exp.tags.split(',').map(t=>t.trim()).filter(Boolean).map((tag,ti)=>(<motion.span key={tag} initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}} transition={{delay:ti*0.04+i*0.08}} style={{background:'rgba(201,160,48,0.07)',border:`1px solid rgba(201,160,48,0.18)`,color:'rgba(201,160,48,0.8)',borderRadius:4,padding:'3px 10px',fontSize:'0.72rem',fontWeight:500}}>{tag}</motion.span>))}</div>}
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

      {/* ══ SKILLS — 技術 (Gijutsu / Technique) ══ */}
      <JapanBgSection overlayColor={J.ov82}>
        <InkBrushCanvas/>
        <SmokeCloud style={{left:'-5%',bottom:'0%',opacity:0.9}} delay={0}/>
        <SmokeCloud style={{right:'-5%',bottom:'1%',opacity:0.85}} delay={2} flip/>
        <ToriiGate style={{left:'50%',transform:'translateX(-50%)',bottom:'3%'}} opacity={0.06}/>
        <SamuraiMon style={{left:'2%',top:'15%'}} delay={0} size={90} variant={0}/>
        <SamuraiMon style={{right:'2%',bottom:'18%'}} delay={1} size={80} variant={2}/>
        <SamuraiMon style={{left:'50%',top:'5%',transform:'translateX(-50%)'}} delay={0.5} size={65} variant={1}/>
        <Katana style={{top:'8%',left:'3%'}} delay={0}/>
        <Katana style={{bottom:'12%',right:'3%'}} delay={1.5}/>
        <InkCircle style={{right:'3%',top:'12%'}} delay={0} size={80} color="red"/>
        <InkCircle style={{left:'3%',bottom:'12%'}} delay={1.2} size={70} color="gold"/>
        <RisingSun style={{right:'3%',top:'5%'}} opacity={0.08}/>
        <KanjiStamp kanji="技" style={{left:'1%',bottom:'5%'}} delay={0.5} size={70}/>
        <KanjiStamp kanji="術" style={{right:'1%',top:'5%'}} delay={1} size={65}/>
        <Nobori style={{left:'2%',top:'3%',opacity:0.4}} delay={0} kanji="技"/>
        <Nobori style={{right:'2%',top:'3%',opacity:0.4}} delay={0.8} kanji="術"/>
        <StrucBuilding style={{left:'0%',bottom:'2%',opacity:0.45}} flip delay={0}/>
        <StrucBuilding style={{right:'0%',bottom:'3%',opacity:0.4}} delay={1}/>

        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2}}>
          <Reveal direction="up">
            <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
              <motion.div animate={{y:[0,-5,0]}} transition={{duration:4,repeat:Infinity}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.8rem',marginBottom:'0.6rem'}}>
                  <span style={{fontFamily:'serif',fontSize:'1.6rem',color:J.red}}>技</span>
                  <span style={{fontFamily:'var(--font-body)',color:J.red,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700}}>Gijutsu · Technique</span>
                </div>
                <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,8vw,5.5rem)',lineHeight:0.9,color:J.white,wordBreak:'break-word'}}>
                  SKILLS &amp; <span style={{color:J.red,textShadow:`0 0 30px rgba(139,26,26,0.5)`}}>TOOLS</span>
                </h2>
                <BrushStroke style={{position:'relative',margin:'0.8rem auto 0',display:'block',width:'fit-content'}} width={100} color={J.gold} delay={0.4}/>
              </motion.div>
            </div>
          </Reveal>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,260px),1fr))',gap:'1rem'}}>
            {skills.map((sk,i)=>(
              <Reveal key={sk.id} direction="up" delay={i*0.09}>
                <TiltCard style={{borderRadius:14,height:'100%'}} intensity={10}>
                  <InkRipple>
                    <motion.div whileHover={{boxShadow:`0 24px 70px rgba(139,26,26,0.25),0 0 0 1px rgba(139,26,26,0.4)`}}
                      style={{background:'rgba(8,3,0,0.9)',border:`1px solid rgba(139,26,26,0.18)`,borderRadius:14,padding:'1.8rem',position:'relative',overflow:'hidden',height:'100%',backdropFilter:'blur(14px)',transition:'all 0.3s'}}>
                      {/* Kanji watermark */}
                      <div style={{position:'absolute',right:8,top:4,fontFamily:'serif',fontSize:'4.5rem',color:`rgba(139,26,26,0.07)`,lineHeight:1,userSelect:'none'}}>{['技','能','術','力'][i%4]}</div>
                      <motion.div animate={{scale:[1,1.4,1],opacity:[0.12,0.28,0.12]}} transition={{duration:3+i*0.4,repeat:Infinity}} style={{position:'absolute',top:-15,left:-15,width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle,rgba(139,26,26,0.2),transparent 70%)`}}/>
                      {/* Number */}
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.7rem',position:'relative',zIndex:1}}>
                        <motion.div animate={{y:[0,-3,0]}} transition={{duration:2.5+i*0.3,repeat:Infinity}}
                          style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',color:J.red,textShadow:`0 0 15px rgba(139,26,26,0.6)`,lineHeight:1}}>{sk.number}</motion.div>
                        <div style={{flex:1,height:1,background:`linear-gradient(to right,rgba(139,26,26,0.5),transparent)`}}/>
                      </div>
                      {/* Corner accents */}
                      <div style={{position:'absolute',top:8,right:8,width:12,height:12,borderTop:`1px solid ${J.gold}`,borderRight:`1px solid ${J.gold}`,opacity:0.4}}/>
                      <div style={{position:'absolute',bottom:8,left:8,width:12,height:12,borderBottom:`1px solid ${J.gold}`,borderLeft:`1px solid ${J.gold}`,opacity:0.4}}/>
                      <h3 style={{fontFamily:'var(--font-body)',fontWeight:700,fontSize:'0.88rem',color:J.white,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'0.6rem',position:'relative',zIndex:1}}>{sk.title}</h3>
                      <p style={{color:'rgba(245,245,240,0.55)',fontSize:'0.85rem',lineHeight:1.6,position:'relative',zIndex:1}}>{sk.desc}</p>
                      {/* Bottom shimmer */}
                      <motion.div animate={{scaleX:[0,1,0]}} transition={{duration:3,repeat:Infinity,delay:i*0.35}}
                        style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${J.red},${J.gold},transparent)`,transformOrigin:'left'}}/>
                    </motion.div>
                  </InkRipple>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </JapanBgSection>

      {/* ══ CTA — 覇道 (Hado / Path of Dominance) ══ */}
      <JapanBgSection overlayColor={J.ov88} style={{textAlign:'center'}}>
        <InkBrushCanvas/>
        {/* Dense smoke */}
        <SmokeCloud style={{left:'-8%',bottom:'0%',opacity:1}} delay={0}/>
        <SmokeCloud style={{right:'-8%',bottom:'2%',opacity:0.95}} delay={1} flip/>
        <SmokeCloud style={{left:'15%',bottom:'0%',opacity:0.7}} delay={0.5}/>
        <SmokeCloud style={{right:'18%',bottom:'1%',opacity:0.65}} delay={1.5} flip/>
        {/* Large rising sun center */}
        <RisingSun style={{left:'50%',top:'8%',transform:'translateX(-50%)'}} opacity={0.1}/>
        {/* Torii gates */}
        <ToriiGate style={{left:'12%',bottom:'5%'}} opacity={0.1}/>
        <ToriiGate style={{right:'12%',bottom:'5%'}} opacity={0.1}/>
        {/* Buildings flanking */}
        <StrucBuilding style={{left:'0%',bottom:'3%',opacity:0.55}} delay={0}/>
        <StrucBuilding style={{right:'0%',bottom:'4%',opacity:0.5}} flip delay={1}/>
        <StrucBuilding style={{left:'14%',bottom:'2%',opacity:0.3}} delay={0.6}/>
        <StrucBuilding style={{right:'14%',bottom:'3%',opacity:0.3}} flip delay={1.2}/>
        {/* Mon circles flanking */}
        <SamuraiMon style={{left:'3%',top:'20%'}} delay={0} size={100} variant={0}/>
        <SamuraiMon style={{right:'3%',top:'22%'}} delay={1} size={90} variant={1}/>
        {/* Large ink circles */}
        <InkCircle style={{left:'50%',bottom:'10%',transform:'translateX(-50%)'}} delay={0} size={200} color="red"/>
        {/* Katana crossed */}
        <Katana style={{top:'25%',left:'5%',transform:'rotate(-15deg)'}} delay={0}/>
        <Katana style={{top:'25%',right:'5%',transform:'rotate(15deg) scaleX(-1)'}} delay={0.8}/>
        {/* War banners */}
        <Nobori style={{left:'8%',top:'8%',opacity:0.5}} delay={0} kanji="覇"/>
        <Nobori style={{right:'8%',top:'8%',opacity:0.5}} delay={0.5} kanji="道"/>
        <Nobori style={{left:'20%',top:'12%',opacity:0.35}} delay={1} kanji="武"/>
        <Nobori style={{right:'20%',top:'12%',opacity:0.35}} delay={1.5} kanji="魂"/>
        {/* Kanji stamps */}
        <KanjiStamp kanji="覇" style={{left:'2%',bottom:'5%'}} delay={0.3} size={80}/>
        <KanjiStamp kanji="魂" style={{right:'2%',bottom:'5%'}} delay={0.8} size={75}/>

        <div style={{position:'relative',zIndex:2,maxWidth:700,margin:'0 auto'}}>
          <Reveal direction="scale">
            {/* Large kanji */}
            <motion.div animate={{opacity:[0.5,0.9,0.5]}} transition={{duration:3,repeat:Infinity}}
              style={{fontFamily:'serif',fontSize:'clamp(3rem,8vw,5rem)',color:J.red,marginBottom:'0.3rem',textShadow:`0 0 40px rgba(139,26,26,0.5),0 0 80px rgba(139,26,26,0.2)`}}>
              覇
            </motion.div>
            <div style={{fontFamily:'var(--font-body)',color:J.gold,fontSize:'0.72rem',letterSpacing:'4px',textTransform:'uppercase',fontWeight:700,marginBottom:'1rem'}}>
              Hado · Path of Dominance
            </div>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2rem,8vw,5rem)',lineHeight:0.95,color:J.white,wordBreak:'break-word',marginBottom:'0.8rem'}}>
              SIAP BERKOLABORASI?
            </h2>
            <BrushStroke style={{position:'relative',margin:'0 auto 1.2rem',display:'block',width:'fit-content'}} width={80} color={J.red} delay={0.3}/>
            <p style={{color:'rgba(245,245,240,0.55)',marginBottom:'2.5rem',fontSize:'clamp(0.9rem,2vw,1.05rem)',lineHeight:1.7,maxWidth:480,margin:'0 auto 2.5rem'}}>
              Seperti seorang samurai yang menguasai pedangnya — saya siap membawa setiap proyek ke puncaknya.
            </p>
            {/* CTA Button */}
            <div style={{position:'relative',display:'inline-block'}}>
              {[...Array(3)].map((_,i)=>(
                <motion.div key={i} style={{position:'absolute',inset:-(i+1)*10,borderRadius:8,border:`1.5px solid rgba(139,26,26,${0.4-i*0.1})`,pointerEvents:'none'}}
                  animate={{scale:[1,1.2,1],opacity:[0.5,0,0.5]}} transition={{duration:2.2,repeat:Infinity,delay:i*0.7}}/>
              ))}
              <motion.a href={`mailto:${contact.email}`}
                whileHover={{scale:1.06,boxShadow:`0 15px 50px rgba(139,26,26,0.55)`}} whileTap={{scale:0.97}}
                style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',background:`linear-gradient(135deg,${J.red},${J.redD})`,color:J.white,textDecoration:'none',borderRadius:8,padding:'16px 48px',fontFamily:'var(--font-body)',fontWeight:800,fontSize:'1rem',letterSpacing:'0.5px',position:'relative',boxShadow:`0 8px 30px rgba(139,26,26,0.45)`,border:`1px solid rgba(201,160,48,0.25)`}}>
                ⛩ Mulai Sekarang →
              </motion.a>
            </div>
          </Reveal>
        </div>
      </JapanBgSection>

      <ContactSection/>
      <Footer/>

      <style>{`
        /* ── ABOUT ROW ── */
        @media(min-width:768px){
          #about-row{flex-direction:row!important;align-items:flex-start!important;}
          #about-row>*{width:50%;}
        }

        /* ── HERO SUBTITLE ── */
        @media(max-width:767px){
          .shine-wrap{white-space:normal!important;word-break:break-word;}
          .hk-hero-subtitle h1{font-size:clamp(0.52rem,2.8vw,0.72rem)!important;line-height:1.6!important;}
        }
        @media(min-width:768px){
          .hk-hero-subtitle h1{font-size:clamp(0.45rem,1.1vw,0.82rem)!important;}
        }

        /* ── GLOBAL MOBILE OPTIMIZATIONS ── */
        @media(max-width:767px){
          /* Prevent horizontal overflow */
          body,#root{overflow-x:hidden!important;}

          /* Section padding */
          .hk-section-inner{padding-left:1rem!important;padding-right:1rem!important;}

          /* Section headings */
          .hk-section-h2{font-size:clamp(1.8rem,9vw,3rem)!important;}

          /* About section photo full width */
          #about-row>*:first-child{max-width:100%!important;width:100%!important;}

          /* Experience timeline – indent smaller */
          .hk-exp-timeline-line{left:12px!important;}
          .hk-exp-icon{width:36px!important;height:36px!important;font-size:1rem!important;}

          /* Skills grid – 1 col on tiny, 2 col on mid-mobile */
          .hk-skills-grid{grid-template-columns:1fr!important;}
        }
        @media(min-width:480px) and (max-width:767px){
          .hk-skills-grid{grid-template-columns:1fr 1fr!important;}
        }

        /* ── HIDE HEAVY SVG DECORATIONS ON MOBILE ── */
        @media(max-width:480px){
          .hk-bg-deco{display:none!important;}
        }

        /* ── CTA BUTTON STACK ON MOBILE ── */
        @media(max-width:480px){
          .hk-hero-cta-row{flex-direction:column!important;width:100%!important;}
          .hk-hero-cta-row a,.hk-hero-cta-row button{width:100%!important;justify-content:center!important;}
        }

        /* ── CERT CARDS ── */
        @media(max-width:767px){
          .hk-cert-card{flex-direction:column!important;}
          .hk-cert-img{width:100%!important;height:140px!important;}
        }

        /* ── MARQUEE ── */
        @media(max-width:480px){
          .hk-marquee-item{font-size:0.75rem!important;padding:0 0.8rem!important;}
        }
      `}</style>
    </div>
  );
};

export default Home;
