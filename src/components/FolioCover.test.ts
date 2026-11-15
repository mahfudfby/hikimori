import { test, expect } from 'vitest';
import { clientLogo } from './FolioCover';
import type { Experience } from '../content/types';

const exp = (company: string, logoUrl: string) => ({ company, logoUrl } as Experience);
const exps = [exp('UD Duta Pangan', 'duta.png'), exp('ARCHIMAX Architect Indonesia', 'archimax.png'), exp('Tanpa Logo', '')];

test('clientLogo: cocok persis, sebagian, abaikan huruf besar & spasi', () => {
  expect(clientLogo('UD Duta Pangan', exps)).toBe('duta.png');
  expect(clientLogo('  archimax  ', exps)).toBe('archimax.png');
  expect(clientLogo('ARCHIMAX Architect Indonesia (Nganjuk)', exps)).toBe('archimax.png');
});

test('clientLogo: kosong / tidak cocok / perusahaan tanpa logo → undefined (pakai logo Hikimori)', () => {
  expect(clientLogo('', exps)).toBeUndefined();
  expect(clientLogo('PT Lain', exps)).toBeUndefined();
  expect(clientLogo('Tanpa Logo', exps)).toBeUndefined();
});
