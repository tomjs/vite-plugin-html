import type { PluginOption } from 'vite';
import { type HtmlCdnOptions, useHtmlCdnPlugin } from './cdn';
import { type HtmlLoadingOptions, useHtmlLoadingPlugin } from './loading';
import { type HtmlMinifyOptions, useHtmlMinifyPlugin } from './minify';

export * from './cdn';
export * from './loading';
export * from './minify';

/**
 * Html Plugin Configuration
 */
export interface HtmlPluginOptions {
  /**
   * Minification plugin configuration, default is true
   */
  minify?: boolean | HtmlMinifyOptions;
  /**
   * Loading plugin configuration, default is false
   */
  loading?: boolean | HtmlLoadingOptions;
  /**
   * CDN configuration, default is true
   */
  cdn?: false | HtmlCdnOptions;
}

/**
 * Html Plugin
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
