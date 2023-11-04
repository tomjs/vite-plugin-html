import type { PluginOption } from 'vite';
import { type HtmlLoadingPluginOptions, useHtmlLoadingPlugin } from './loading';
import { type HtmlMinifyPluginOptions, useHtmlMinifyPlugin } from './minify';

export * from './loading';
export * from './minify';

/**
 * html 插件配置
 */
export interface HtmlPluginOptions {
  /**
   * 压缩插件配置，默认为 true
   */
  minify: HtmlMinifyPluginOptions;
  /**
   * loading 插件配置，默认为 false
   */
  loading?: HtmlLoadingPluginOptions;
}

/**
 * html 插件
 */
export function useHtmlPlugin(options?: HtmlPluginOptions): PluginOption[] {
  const opts = Object.assign({ minify: true, loading: false } as HtmlPluginOptions, options);

  const plugins: PluginOption[] = [];
  if (opts.minify !== false) {
    plugins.push(useHtmlMinifyPlugin(opts.minify ?? true));
  }

  if (opts.loading !== false) {
    plugins.push(useHtmlLoadingPlugin(opts.loading));
  }

  return plugins;
}

export default useHtmlPlugin;
