// src/global.d.ts — tipe global proyek.
import 'react';

declare module 'react' {
  // CSS custom property (mis. style={{ '--cols': 3 }}) tanpa `as any`
  interface CSSProperties { [customProperty: `--${string}`]: string | number | undefined }
}

declare global {
  interface Window {
    /** Dipanggil aplikasi saat siap agar intro di index.html boleh ditutup. */
    __hkIntroDone?: () => void;
  }
}
