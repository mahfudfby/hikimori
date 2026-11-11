import { test, expect } from 'vitest';
import { isAdminClaims, isAdminEmail, ADMIN_EMAILS } from './admins';
import { decode, decodeFields } from '../content/firestoreRest';
import { mergeContent } from '../content/ContentContext';
import {
  pick,
  monthsOf,
  fmtYM,
  fmtRange,
  fmtPeriod,
  fmtDuration,
  careerMonths,
  calendarSpanMonths,
  careerGaps,
  parseBirth,
  ageOf,
  lines,
  paragraphs,
} from '../content/derive';
import type { Experience } from '../content/types';

test('isAdminClaims & isAdminEmail: wajib custom claim admin atau email whitelist admin yang terverifikasi', () => {
  expect(isAdminClaims(null)).toBe(false);
  expect(isAdminClaims({})).toBe(false);
  for (const email of ADMIN_EMAILS) {
    expect(isAdminEmail(email)).toBe(true);
    expect(isAdminEmail(email.toUpperCase())).toBe(true);
    expect(isAdminClaims({ email, emailVerified: false })).toBe(false);
    expect(isAdminClaims({ email, emailVerified: undefined })).toBe(false);
    expect(isAdminClaims({ email: email.toUpperCase(), emailVerified: true })).toBe(true);
  }
  expect(isAdminEmail('orang@lain.com')).toBe(false);
  expect(isAdminClaims({ email: 'orang@lain.com', emailVerified: true })).toBe(false);
  expect(isAdminClaims({ email: 'orang@lain.com', emailVerified: false, admin: true })).toBe(true);
  expect(isAdminClaims({ email: 'orang@lain.com', emailVerified: true, admin: 'true' })).toBe(false);
});

test('firestoreRest decode & decodeFields: mengubah tipe REST menjadi JSON biasa', () => {
  expect(decode({ stringValue: 'halo' })).toBe('halo');
  expect(decode({ integerValue: '42' })).toBe(42);
  expect(decode({ doubleValue: 3.5 })).toBe(3.5);
  expect(decode({ booleanValue: true })).toBe(true);
  expect(decode({ nullValue: null })).toBeNull();
  expect(
    decodeFields({
      tags: { arrayValue: { values: [{ stringValue: 'hr' }, { integerValue: '2' }] } },
      nested: { mapValue: { fields: { ok: { booleanValue: false } } } },
    })
  ).toEqual({ tags: ['hr', 2], nested: { ok: false } });
});

test('mergeContent: mempertahankan default untuk field baru & menimpa yang tersimpan', () => {
  const base = { a: 1, nested: { x: 'default', y: 'tetap' }, list: [1, 2] };
  const saved = { a: 9, nested: { x: 'baru' }, extra: true };
  expect(mergeContent(saved, base)).toEqual({
    a: 9,
    nested: { x: 'baru', y: 'tetap' },
    list: [1, 2],
    extra: true,
  });
  // Bila saved bukan array sedangkan base array, kembali ke base
  expect(mergeContent({ list: 'bukan-array' }, base).list).toEqual([1, 2]);
  expect(mergeContent({ list: [7] }, base).list).toEqual([7]);
});

test('derive: pick, format tanggal, durasi, dan masa kerja tanpa hitung ganda', () => {
  expect(pick({ id: 'Halo', en: 'Hello' }, 'id')).toBe('Halo');
  expect(pick({ id: 'Halo', en: '' }, 'en')).toBe('Halo');

  expect(monthsOf('2024-01', '2024-03')).toBe(3);
  expect(monthsOf('2024-05', '2024-01')).toBe(0);
  expect(fmtYM('2024-08', 'id')).toBe('Agu 2024');
  expect(fmtYM('2024-08', 'en')).toBe('Aug 2024');
  expect(fmtRange('2022 - 2025', 'id')).toBe('2022 s.d. 2025');
  expect(fmtPeriod('2023-10', '2024-01', 'en')).toBe('Oct 2023 to Jan 2024');
  expect(fmtDuration(14, 'id')).toBe('1 Tahun 2 Bulan');
  expect(fmtDuration(14, 'en', true)).toBe('1y 2m');

  const exps = [
    { start: '2022-01', end: '2022-06' }, // 6 bln
    { start: '2022-04', end: '2022-09' }, // tumpang-tindih -> total 2022-01..09 = 9 bln
    { start: '2023-01', end: '2023-02' }, // + 2 bln (jeda Okt-Des 2022 = 3 bln)
  ] as Experience[];

  expect(careerMonths(exps)).toBe(11);
  expect(calendarSpanMonths(exps)).toBe(14);
  expect(careerGaps(exps)).toEqual([{ start: '2022-10', end: '2022-12', months: 3 }]);
});

test('derive: parseBirth, ageOf, lines & paragraphs', () => {
  const d1 = parseBirth('12 Februari 2000');
  expect(d1?.getFullYear()).toBe(2000);
  expect(d1?.getMonth()).toBe(1);
  expect(d1?.getDate()).toBe(12);
  expect(parseBirth('2000-02-12')?.getMonth()).toBe(1);
  expect(ageOf(2000, '2000-01-01')).toBeGreaterThanOrEqual(24);

  expect(lines('- Satu\n• Dua\nTiga')).toEqual([
    { bullet: true, text: 'Satu' },
    { bullet: true, text: 'Dua' },
    { bullet: false, text: 'Tiga' },
  ]);
  expect(paragraphs('Paragraf 1\n\nParagraf 2')).toEqual(['Paragraf 1', 'Paragraf 2']);
});
