import { test, expect, beforeAll } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ContentProvider } from '../content/ContentContext';

beforeAll(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  // Mock matchMedia for jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <ContentProvider>
          {children}
        </ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
);

test('CommandPalette: terbuka, menampilkan daftar, dan memfilter berdasarkan pencarian', async () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  let closed = false;
  await act(async () => {
    root.render(
      <Wrapper>
        <CommandPalette open={true} onClose={() => { closed = true; }} />
      </Wrapper>
    );
  });

  const modal = document.querySelector('.cmd-modal');
  expect(modal).not.toBeNull();

  const input = document.querySelector('.cmd-input') as HTMLInputElement;
  expect(input).not.toBeNull();

  // Memiliki daftar item awal
  const initialItems = document.querySelectorAll('.cmd-item');
  expect(initialItems.length).toBeGreaterThan(0);

  // Ketik "profil" di input pencarian
  await act(async () => {
    input.value = 'profil';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const filteredItems = document.querySelectorAll('.cmd-item');
  expect(filteredItems.length).toBeGreaterThan(0);

  // Pastikan salah satu judul item mengandung "Profil"
  const hasProfil = Array.from(filteredItems).some(el => el.textContent?.toLowerCase().includes('profil'));
  expect(hasProfil).toBe(true);

  // Tekan Escape untuk memicu onClose
  await act(async () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
  expect(closed).toBe(true);

  await act(async () => {
    root.unmount();
  });
});
