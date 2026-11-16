import { test, expect, beforeAll } from 'vitest';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { ListEditor } from './fields';

beforeAll(() => { (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true; });

type Item = { id: string; name: string };
const Harness = () => {
  const [items, setItems] = useState<Item[]>([{ id: 'a', name: 'Satu' }, { id: 'b', name: 'Dua' }]);
  return (
    <ListEditor<Item> items={items} onChange={setItems} create={() => ({ id: 'c', name: '' })} page="Pengalaman"
      title={x => x.name}
      render={(x, up) => <input aria-label="nama" value={x.name} onChange={e => up({ name: e.target.value })} />} />
  );
};
const wait = (ms = 30) => new Promise(r => setTimeout(r, ms));

test('ListEditor page: klik item membuka halaman edit terpisah, navigasi & Back menutupnya', async () => {
  const host = document.createElement('div'); document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => root.render(<Harness />));
  // daftar tidak menampilkan form di dalamnya
  expect(host.querySelector('input')).toBeNull();
  await act(async () => { (host.querySelector('.cms-item-head') as HTMLButtonElement).click(); });
  const page = document.querySelector('.cms-page');
  expect(page).not.toBeNull();
  expect(window.history.state?.cmsEdit).toBe(true);
  expect((document.querySelector('.cms-page input') as HTMLInputElement).value).toBe('Satu');
  // pindah ke item berikutnya
  await act(async () => { (document.querySelector('[aria-label="Item berikutnya"]') as HTMLButtonElement).click(); });
  expect((document.querySelector('.cms-page input') as HTMLInputElement).value).toBe('Dua');
  // Selesai → history.back → popstate → halaman tertutup
  await act(async () => { (Array.from(document.querySelectorAll('.cms-page button')).find(b => b.textContent?.includes('Selesai')) as HTMLButtonElement).click(); await wait(); });
  expect(document.querySelector('.cms-page')).toBeNull();
  expect(window.history.state?.cmsEdit).toBeFalsy();
  // tambah item baru langsung membuka halaman edit
  await act(async () => { (Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes('Tambah')) as HTMLButtonElement).click(); });
  expect(document.querySelector('.cms-page')).not.toBeNull();
  await act(async () => root.unmount());
});
