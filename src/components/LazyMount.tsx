// src/components/LazyMount.tsx
// Defer render children (section berat/dekoratif) sampai hampir masuk
// viewport — mengurangi kerja render & RAM saat load awal, terutama di
// HP/jaringan lemot. rootMargin cukup besar supaya section sudah ke-mount
// SEBELUM benar-benar kelihatan (hindari "pop-in" kosong saat scroll).
import React, { useEffect, useRef, useState } from 'react';

interface LazyMountProps {
  children: React.ReactNode;
  /** Perkiraan tinggi placeholder sebelum konten asli dirender, supaya
   *  layout tidak "lompat" saat section akhirnya di-mount. */
  minHeight?: number;
  /** Jarak dari viewport sebelum mulai dirender (px). Makin kecil =
   *  makin "malas" (baru render pas nyaris kelihatan), makin besar =
   *  lebih dulu disiapkan (lebih mulus tapi kurang hemat). */
  rootMargin?: string;
}

const LazyMount: React.FC<LazyMountProps> = ({ children, minHeight = 500, rootMargin = '600px 0px' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setShouldRender(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { setShouldRender(true); io.disconnect(); }
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldRender, rootMargin]);

  return (
    <div ref={ref} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
};

export default LazyMount;
