// @vitest-environment jsdom
import { test, expect } from 'vitest';
import { classifyClick } from './track';

const link = (href: string, track?: string) => {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  if (track) a.dataset.track = track;
  return a;
};

test('classifyClick: CV, kontak, portofolio dihitung; link lain tidak', () => {
  expect(classifyClick(link('/cv.pdf', 'Unduh CV'))?.name).toBe('Unduh CV');
  expect(classifyClick(link('https://wa.me/628123?text=hi'))?.data?.via).toBe('WhatsApp');
  expect(classifyClick(link('mailto:a@b.c'))?.data?.via).toBe('Email');
  expect(classifyClick(link('https://linkedin.com/in/x'))?.data?.via).toBe('LinkedIn');
  expect(classifyClick(link('/portofolio/abc123'))).toMatchObject({ name: 'Buka Portofolio', data: { id: 'abc123' } });
  expect(classifyClick(link('/tentang'))).toBeNull();
  expect(classifyClick(link('/portofolio'))).toBeNull();
});
