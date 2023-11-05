import type { PluginOption } from 'vite';
import { type HtmlCdnOptions, useHtmlCdnPlugin } from './cdn';
import { type HtmlLoadingOptions, useHtmlLoadingPlugin } from './loading';
import { type HtmlMinifyOptions, useHtmlMinifyPlugin } from './minify';

export * from './cdn';
export * from './loading';
export * from './minify';

/**
 * html 插件配置
 */
export interface HtmlPluginOptions {
  /**
   * 压缩插件配置，默认为 true
   */
  minify: boolean | HtmlMinifyOptions;
  /**
   * loading 插件配置，默认为 false
   */
  loading?: boolean | HtmlLoadingOptions;
  /**
   * cdn 配置，默认为 true
   */
  cdn?: false | HtmlCdnOptions;
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

  if (typeof opts.cdn !== 'boolean') {
    plugins.push(useHtmlCdnPlugin(Object.assign({}, opts.cdn)));
  }

  return plugins;
}

export default useHtmlPlugin;
