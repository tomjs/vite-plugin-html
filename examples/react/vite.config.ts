import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import html from '../../dist/index.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  plugins: [
    react(),
    html({
      minify: false,
      loading: {
        selector: '#root',
        after: `<div style="color:#888">加载中...</div>`,
      },
      cdn: {
        modules: ['react', 'react-dom', 'react-router-dom', 'antd'],
      },
    }),
  ],
});
