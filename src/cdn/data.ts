import type { NpmModule, PresetNpmModule } from './types';

/**
 * Preset configurations
 */
export const PRESET_MODULES: Record<PresetNpmModule, Omit<NpmModule, 'name'> & { name?: string }> =
  {
    dayjs: {
      var: 'dayjs',
      file: 'dayjs.min.js',
    },
    axios: {
      var: 'axios',
    },
    lodash: {
      var: '_',
      file: 'lodash.min.js',
    },
    vue: {
      var: 'Vue',
    },
    'vue-router': {
      deps: ['vue'],
    },
    'vue-demi': {
      deps: ['vue'],
      file: ['lib/index.iife.js'],
    },
    pinia: {
      deps: ['vue', 'vue-demi'],
    },
    'ant-design-vue': {
      var: 'antd',
      deps: ['vue', 'dayjs'],
      file: ['dist/reset.css', 'dist/antd.min.js'],
    },
    'ant-design-vue3': {
      name: 'ant-design-vue',
      var: 'antd',
      deps: ['vue', 'dayjs'],
      file: ['dist/antd.min.css', 'dist/antd.min.js'],
    },
    '@vueuse/core': {
      var: 'VueUse',
      deps: ['vue', '@vueuse/shared'],
    },
    '@vueuse/shared': {
      var: 'VueUse',
      deps: ['vue'],
    },
    'element-plus': {
      var: 'ElementPlus',
      deps: ['vue'],
      file: ['dist/index.css', 'index.full.min.js'],
    },
    react: {
      var: 'React',
      file: ['umd/react.production.min.js'],
    },
    'react-dom': {
      var: 'ReactDOM',
      deps: ['react'],
      file: ['umd/react-dom.production.min.js'],
    },
    'react-router-dom': {
      var: 'ReactRouterDOM',
      deps: ['react', 'react-dom'],
      file: ['dist/umd/react-router-dom.production.min.js'],
    },
    antd: {
      var: 'antd',
      deps: ['react', 'react-dom', 'dayjs'],
    },
    '@ant-design/charts': {
      var: 'charts',
      deps: ['react', 'react-dom'],
    },
    ahooks: {
      var: 'ahooks',
      deps: ['react', 'react-dom'],
    },
  };
