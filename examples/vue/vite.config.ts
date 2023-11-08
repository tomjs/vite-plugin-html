import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import html from '../../dist/index.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  plugins: [
    vue(),
    html({
      minify: false,
      loading: {
        after: `<div style="color:#888">加载中...</div>`,
      },
      cdn: {
        modules: ['vue', 'ant-design-vue', 'pinia', 'vue-router'],
        local: {
          modules: ['vue'],
          copy: true,
        },
      },
    }),
  ],
});
