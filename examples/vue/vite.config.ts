import { defineConfig } from 'vite';
import html from '@tomjs/vite-plugin-html';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  plugins: [
    vue(),
    html({
      minify: false,
      loading: {
        after: `<div style="color:#888">loading...</div>`,
      },
      cdn: {
        modules: ['vue', 'ant-design-vue', 'pinia', 'vue-router'],
        local: {
          modules: true,
          copy: true,
        },
      },
    }),
  ],
});
