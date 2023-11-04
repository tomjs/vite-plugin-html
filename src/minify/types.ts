import type { Options } from 'html-minifier-terser';

/**
 * html 压缩插件详细配置
 */
export type HtmlMinifyOptions = Options;

/**
 * html 压缩插件配置
 */
export type HtmlMinifyPluginOptions = boolean | HtmlMinifyOptions;
