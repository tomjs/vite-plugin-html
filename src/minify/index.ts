import type { PluginOption } from 'vite';
import { minify as minifyFn } from 'html-minifier-terser';
import { createFilter } from '@rollup/pluginutils';
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
 * html 压缩插件
 * @param minify 配置参数，默认为 true
 * @returns
 */
export function useHtmlMinifyPlugin(minify?: boolean | HtmlMinifyOptions): PluginOption {
  return {
    name: '@tomjs:html-minify',
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
