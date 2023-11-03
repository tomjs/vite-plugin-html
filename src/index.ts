import type { PluginOption } from 'vite';

/**
 * html 插件
 */
export function useHtmlPlugin(): PluginOption {
  return {
    name: '@tomjs:html',
    closeBundle() {
      console.log('closeBundle');
    },
  };
}

export default useHtmlPlugin;
