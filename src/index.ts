import type { PluginOption } from 'vite';
import { type HtmlMinifyPluginOptions, useHtmlMinifyPlugin } from './minify';

export * from './minify';

/**
 * html 插件配置
 */
export interface HtmlPluginOptions {
  /**
   * 压缩配置，默认为 true
   */
  minify: HtmlMinifyPluginOptions;
}

/**
 * html 插件
 */
export function useHtmlPlugin(options?: HtmlPluginOptions): PluginOption[] {
  const opts = Object.assign({ minify: true } as HtmlPluginOptions, options);

  const plugins: PluginOption[] = [];
  if (opts.minify !== false) {
    plugins.push(useHtmlMinifyPlugin(opts.minify ?? true));
  }

  return plugins;
}

export default useHtmlPlugin;
