// original source: https://github.com/vbenjs/vite-plugin-html/blob/ac54a6e6c5334ce24454a3b68542114514f632e6/packages/core/src/minifyHtml.ts

import type { PluginOption } from 'vite';
import { minify as minifyFn } from 'html-minifier-terser';
import { createFilter } from '@rollup/pluginutils';
import { MINIFY_PLUGIN_NAME } from '../constants';
import { type HtmlMinifyOptions } from './types';

export * from './types';

const htmlFilter = createFilter(['**/*.html']);

function getOptions(minify: boolean): HtmlMinifyOptions {
  return {
    collapseWhitespace: minify,
    keepClosingSlash: minify,
    removeComments: minify,
    removeRedundantAttributes: minify,
    removeScriptTypeAttributes: minify,
    removeStyleLinkTypeAttributes: minify,
    useShortDoctype: minify,
    minifyCSS: minify,
  };
}

async function minifyHtml(html: string, minify: boolean | HtmlMinifyOptions) {
  if (typeof minify === 'boolean') {
    if (minify) {
      return await minifyFn(html, getOptions(minify));
    }
    return html;
  }

  return await minifyFn(html, minify);
}

/**
 * HTML compression plugin
 * @param minify Configuration parameter, default is true
 */
export function useHtmlMinifyPlugin(minify?: boolean | HtmlMinifyOptions): PluginOption {
  return {
    name: MINIFY_PLUGIN_NAME,
    apply: 'build',
    enforce: 'post',
    async generateBundle(_, outBundle) {
      if (minify) {
        for (const bundle of Object.values(outBundle)) {
          if (
            bundle.type === 'asset' &&
            htmlFilter(bundle.fileName) &&
            typeof bundle.source === 'string'
          ) {
            bundle.source = await minifyHtml(bundle.source, minify);
          }
        }
      }
    },
  };
}
