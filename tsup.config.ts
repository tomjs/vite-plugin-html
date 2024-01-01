import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: ['es2021', 'node16'],
  external: ['vite'],
  loader: {
    '.html': 'text',
  },
  clean: true,
  dts: true,
  splitting: true,
});
