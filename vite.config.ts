/// <reference types="vitest/config" />
// vite.config.ts — pengganti react-scripts (CRA). Keluaran tetap di `build/` dengan aset di `build/static/{js,css,media}`
// supaya vercel.json (cache /static/*), public/sw.js, dan scripts/prerender-meta.js tidak perlu diubah.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: false },
  preview: { port: 5050 },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].[hash:8].js',
        chunkFileNames: 'static/js/[name].[hash:8].chunk.js',
        assetFileNames: (info) => {
          const ext = (info.names?.[0] || '').split('.').pop() || '';
          return `static/${ext === 'css' ? 'css' : 'media'}/[name].[hash:8][extname]`;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,ts,tsx}'],
  },
});
