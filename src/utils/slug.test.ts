import { test, expect } from 'vitest';
import { slugify } from './slug';

test('slugify: mengubah judul menjadi URL slug bersih & ramah SEO', () => {
  expect(slugify('Sistem HR & IT Support 2026!')).toBe('sistem-hr-it-support-2026');
  expect(slugify('  Aplikasi Portofolio Web   ')).toBe('aplikasi-portofolio-web');
  expect(slugify('Desain & Redesain: "Modern & Canggih"')).toBe('desain-redesain-modern-canggih');
  expect(slugify('Café & Résumé (2025)')).toBe('cafe-resume-2025');
  expect(slugify('---Multiple---Dashes---')).toBe('multiple-dashes');
  expect(slugify('')).toBe('');
  expect(slugify(null)).toBe('');
  expect(slugify(undefined)).toBe('');
});
