import type { Options } from 'html-minifier-terser';

/**
 * Detailed configuration for html minification plugin
 */
export type HtmlMinifyOptions = Options;

/**
 * Configuration for html minification plugin
 */
export type HtmlMinifyPluginOptions = boolean | HtmlMinifyOptions;
