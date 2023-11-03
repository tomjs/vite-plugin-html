import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import html from '../../dist/index.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  plugins: [react(), html()],
});
