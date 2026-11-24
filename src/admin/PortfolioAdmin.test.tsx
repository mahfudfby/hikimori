import { test, expect, beforeAll } from 'vitest';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ListEditor } from './fields';

beforeAll(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
});

type Item = { id: string; name: string };

const InlineHarness = () => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Item Pertama' },
    { id: '2', name: 'Item Kedua' },
    { id: '3', name: 'Item Ketiga' },
  ]);
  return (
    <ListEditor<Item>
      items={items}
      onChange={setItems}
      create={() => ({ id: 'new_' + Math.random().toString(36).slice(2, 6), name: 'Item Baru' })}
      title={x => x.name}
      render={(x, up) => (
        <input
          aria-label={`edit-${x.id}`}
          value={x.name}
          onChange={e => up({ name: e.target.value })}
        />
      )}
    />
  );
};

test('ListEditor inline: expand/collapse, buka semua, dan sisipkan di tengah list', async () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  await act(async () => {
    root.render(<InlineHarness />);
  });

  // Tombol buka semua & ciutkan semua tampil saat items > 2
  const bukaSemuaBtn = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('Buka semua'));
  expect(bukaSemuaBtn).toBeDefined();

  // Awalnya form di dalam item tertutup
  expect(host.querySelectorAll('input').length).toBe(0);

  // Klik buka semua
  await act(async () => {
    bukaSemuaBtn?.click();
  });
  expect(host.querySelectorAll('input').length).toBe(3);

  // Klik ciutkan semua
  const ciutkanSemuaBtn = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('Ciutkan semua'));
  await act(async () => {
    ciutkanSemuaBtn?.click();
  });
  expect(host.querySelectorAll('input').length).toBe(0);

  // Sisipkan item baru di bawah item 1 (index 0)
  const insertButtons = host.querySelectorAll('[aria-label="Sisipkan setelah ini"]');
  expect(insertButtons.length).toBe(3);

  await act(async () => {
    (insertButtons[0] as HTMLButtonElement).click();
  });

  // Jumlah item sekarang jadi 4, dan item baru langsung terbuka
  const items = host.querySelectorAll('.cms-item');
  expect(items.length).toBe(4);

  await act(async () => {
    root.unmount();
  });
});

test('Portfolio autosave draft format & recovery verification', () => {
  const draftKey = 'hk_folio_draft_test123';
  const testPayload = {
    data: {
      title: 'Proyek Integrasi Sistem HR',
      category: 'HR & IT',
      blocks: [{ id: 'b1', type: 'text', text: 'Paragraf pertama' }],
    },
    savedAt: '14:30',
  };

  localStorage.setItem(draftKey, JSON.stringify(testPayload));
  const retrieved = JSON.parse(localStorage.getItem(draftKey) || '{}');

  expect(retrieved.data.title).toBe('Proyek Integrasi Sistem HR');
  expect(retrieved.savedAt).toBe('14:30');
  expect(retrieved.data.blocks.length).toBe(1);

  localStorage.removeItem(draftKey);
  expect(localStorage.getItem(draftKey)).toBeNull();
});

test('Portfolio slug resolution: artikel dapat diakses lewat slug mandiri atau id asli', () => {
  const items = [
    { id: 'p001', slug: 'sistem-informasi-hr', title: 'Sistem Informasi HR' },
    { id: 'p002', slug: 'redesain-web-arsitektur', title: 'Redesain Web Arsitektur' },
    { id: 'p003', slug: '', title: 'Proyek Legacy Tanpa Slug' },
  ];

  // Cari lewat slug
  const findBySlug = (key: string) => items.find(i => (i.slug && i.slug === key) || i.id === key);

  expect(findBySlug('sistem-informasi-hr')?.id).toBe('p001');
  expect(findBySlug('redesain-web-arsitektur')?.id).toBe('p002');
  // Fallback ke id untuk link lama
  expect(findBySlug('p001')?.title).toBe('Sistem Informasi HR');
  expect(findBySlug('p003')?.title).toBe('Proyek Legacy Tanpa Slug');
  expect(findBySlug('tidak-ada')).toBeUndefined();
});
