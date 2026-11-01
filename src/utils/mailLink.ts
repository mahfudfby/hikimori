// src/utils/mailLink.ts — tautan email ke aplikasi sesuai perangkat.
// Android → aplikasi Gmail (belum terpasang = Chrome membuka halaman Gmail di Play Store);
// iPhone/iPad & desktop → mailto: (iOS membuka Mail; bila Mail dihapus, iOS menawarkan unduh ulang dari App Store).
const IS_ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/** `query` berisi "?subject=...&body=..." yang sudah di-encode (opsional). */
export const mailLink = (to: string, query = '') =>
  IS_ANDROID ? `intent:${to}${query}#Intent;scheme=mailto;package=com.google.android.gm;end` : `mailto:${to}${query}`;
