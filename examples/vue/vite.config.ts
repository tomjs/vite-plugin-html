import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import html from '../../dist/index.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  plugins: [vue(), html()],
});
