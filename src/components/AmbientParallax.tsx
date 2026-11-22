// src/components/AmbientParallax.tsx — Floating ambient light orbs dengan parallax saat scroll
import React from 'react';

export const AmbientParallax: React.FC = () => {
  return (
    <div className="ambient-parallax no-print" aria-hidden="true">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
    </div>
  );
};

export default AmbientParallax;
