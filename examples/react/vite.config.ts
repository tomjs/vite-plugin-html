import { defineConfig } from 'vite';
import html from '@tomjs/vite-plugin-html';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  plugins: [
    react(),
    html({
      minify: false,
      loading: {
        selector: '#root',
        after: `<div style="color:#888">loading...</div>`,
      },
      cdn: {
        modules: ['react', 'react-dom', 'react-router-dom', 'antd'],
      },
    }),
  ],
});
