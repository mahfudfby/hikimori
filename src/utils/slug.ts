// src/utils/slug.ts — pengubah teks menjadi URL slug bersih, ramah SEO, dan aman.

/**
 * Mengubah string menjadi format slug: huruf kecil, tanpa spasi, strip tunggal,
 * tanpa karakter khusus atau aksen (contoh: "Sistem HR & IT 2026!" -> "sistem-hr-it-2026").
 */
export const slugify = (text?: string | null): string => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};
