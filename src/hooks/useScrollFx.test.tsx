// @vitest-environment jsdom
import { test, expect, beforeEach, afterEach, vi, beforeAll, describe } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { useScrollFx } from './useScrollFx';

beforeAll(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

const HookHarness: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  useScrollFx(enabled);
  return <div data-testid="harness" />;
};

describe('useScrollFx', () => {
  let host: HTMLDivElement;

  beforeEach(() => {
    vi.restoreAllMocks();
    document.documentElement.style.cssText = '';
    document.body.className = '';
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    document.documentElement.style.cssText = '';
    document.body.className = '';
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
  });

  test('tidak menetapkan variabel jika disabled (enabled = false)', async () => {
    const root = createRoot(host);
    await act(async () => {
      root.render(<HookHarness enabled={false} />);
    });

    expect(document.documentElement.style.getPropertyValue('--scroll-y')).toBe('');
    expect(document.body.classList.contains('is-scrolled')).toBe(false);

    await act(async () => {
      root.unmount();
    });
  });

  test('menetapkan variabel CSS saat enabled dan membersihkannya saat unmount', async () => {
    const root = createRoot(host);
    await act(async () => {
      root.render(<HookHarness enabled={true} />);
    });

    expect(document.documentElement.style.getPropertyValue('--scroll-y')).toBeDefined();
    expect(document.documentElement.style.getPropertyValue('--scroll-progress')).toBeDefined();
    expect(document.documentElement.style.getPropertyValue('--hero-blur')).toBeDefined();

    await act(async () => {
      root.unmount();
    });

    expect(document.documentElement.style.getPropertyValue('--scroll-y')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--scroll-progress')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--hero-blur')).toBe('');
    expect(document.body.classList.contains('is-scrolled')).toBe(false);
  });

  test('menambahkan class is-scrolled saat scroll melebihi 15px', async () => {
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(performance.now());
      return 1;
    });

    const root = createRoot(host);
    await act(async () => {
      root.render(<HookHarness enabled={true} />);
    });

    expect(document.documentElement.style.getPropertyValue('--nav-elevated')).toBe('1');
    expect(document.body.classList.contains('is-scrolled')).toBe(true);

    await act(async () => {
      root.unmount();
    });
    expect(document.body.classList.contains('is-scrolled')).toBe(false);
  });
});
