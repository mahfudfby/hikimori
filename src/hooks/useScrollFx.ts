// src/hooks/useScrollFx.ts — Animasi smooth scroll, parallax & blur saat scroll
import { useEffect } from 'react';
import { isLite } from '../components/ui';

/**
 * Mengelola efek scroll halus, parallax & defocus blur pada level halaman.
 * Berjalan di requestAnimationFrame (komposisi GPU), bebas layout thrashing,
 * dan otomatis non-aktif di mode lite / prefers-reduced-motion.
 */
export const useScrollFx = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const reduce = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    const lite = isLite();
    const root = document.documentElement;
    const body = document.body;

    const cleanupVars = () => {
      root.style.removeProperty('--scroll-y');
      root.style.removeProperty('--scroll-progress');
      root.style.removeProperty('--hero-scroll-ratio');
      root.style.removeProperty('--hero-blur');
      root.style.removeProperty('--hero-fade');
      root.style.removeProperty('--nav-elevated');
      body.classList.remove('is-scrolled');
    };

    if (reduce || lite) {
      cleanupVars();
      return;
    }

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      
      // Hero ratio: 0 di puncak, 1 ketika scroll mencapai 380px
      const heroRatio = Math.min(1, Math.max(0, scrollY / 380));
      // Defocus blur maks 5.5px (tetap di bawah batas 8px GPU composite)
      const heroBlur = heroRatio * 5.5;
      const heroFade = Math.max(0.35, 1 - heroRatio * 0.65);
      const isElevated = scrollY > 15;

      root.style.setProperty('--scroll-y', `${scrollY.toFixed(1)}px`);
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
      root.style.setProperty('--hero-scroll-ratio', heroRatio.toFixed(3));
      root.style.setProperty('--hero-blur', `${heroBlur.toFixed(2)}px`);
      root.style.setProperty('--hero-fade', heroFade.toFixed(2));
      root.style.setProperty('--nav-elevated', isElevated ? '1' : '0');

      if (isElevated) {
        if (!body.classList.contains('is-scrolled')) body.classList.add('is-scrolled');
      } else {
        if (body.classList.contains('is-scrolled')) body.classList.remove('is-scrolled');
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    // Inisialisasi awal saat komponen mount
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      cleanupVars();
    };
  }, [enabled]);
};
