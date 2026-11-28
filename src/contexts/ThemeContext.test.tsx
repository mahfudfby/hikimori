// @vitest-environment jsdom
import { test, expect, beforeAll } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { ThemeProvider, useTheme } from './ThemeContext';

beforeAll(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

const ThemeHarness = () => {
  const { mode, toggle } = useTheme();
  return (
    <button onClick={toggle} data-testid="theme-btn">
      Current: {mode}
    </button>
  );
};

test('ThemeContext: toggle beralih light <-> dark dan setAttribute data-theme di html', async () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  await act(async () => {
    root.render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );
  });

  const btn = host.querySelector('[data-testid="theme-btn"]') as HTMLButtonElement;
  expect(btn.textContent).toContain('Current: light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');

  await act(async () => {
    btn.click();
  });

  expect(btn.textContent).toContain('Current: dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

  await act(async () => {
    btn.click();
  });

  expect(btn.textContent).toContain('Current: light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');

  await act(async () => {
    root.unmount();
  });
  document.body.removeChild(host);
});
