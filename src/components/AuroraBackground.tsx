// src/components/AuroraBackground.tsx
// Latar aurora lembut — CSS-only (transform+opacity, GPU-friendly), tanpa
// blur berat berulang. Dipakai di section hero halaman-halaman sekunder
// biar terasa cinematic & senada dengan hero Home, tapi tetap ringan.
// Palet: sky-blue, vivid-blue, & sedikit periwinkle — semua tipis (opacity
// rendah + blur besar), bukan warna solid, biar nggak berlebihan.
import React from 'react';

interface Props {
  /** Intensitas blob: 'soft' untuk section kecil, 'full' untuk hero besar */
  variant?: 'soft' | 'full';
  className?: string;
}

const AuroraBackground: React.FC<Props> = ({ variant = 'soft', className }) => {
  const big = variant === 'full';
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        className="aurora-blob-a"
        style={{
          position: 'absolute', top: big ? '-25%' : '-15%', left: '10%',
          width: big ? '50%' : '38%', height: big ? '60%' : '46%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(1,169,242,0.15) 0%, transparent 72%)',
          filter: 'blur(46px)',
        }}
      />
      <div
        className="aurora-blob-b"
        style={{
          position: 'absolute', bottom: big ? '-20%' : '-12%', right: '8%',
          width: big ? '44%' : '32%', height: big ? '54%' : '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,245,0.13) 0%, transparent 72%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Aksen periwinkle — sengaja sangat tipis (opacity 8%), cuma nambah
          kedalaman warna, bukan elemen yang harus "kelihatan" sendiri. */}
      <div
        className="aurora-blob-c"
        style={{
          position: 'absolute', top: '35%', left: '55%',
          width: big ? '38%' : '28%', height: big ? '46%' : '34%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,153,255,0.08) 0%, transparent 72%)',
          filter: 'blur(55px)',
        }}
      />
    </div>
  );
};

export default AuroraBackground;
