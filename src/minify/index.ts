import type { PluginOption } from 'vite';
import { minify as minifyFn } from 'html-minifier-terser';
import { createFilter } from '@rollup/pluginutils';
import { HtmlMinifyOptions, HtmlMinifyPluginOptions } from './types';

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

async function minifyHtml(html: string, minify: HtmlMinifyPluginOptions) {
  if (typeof minify === 'boolean' && !minify) {
    return html;
  }

  let minifyOptions: HtmlMinifyPluginOptions = minify;

  if (typeof minify === 'boolean' && minify) {
    minifyOptions = getOptions(minify);
  }

  return await minifyFn(html, minifyOptions as HtmlMinifyOptions);
}

/**
 * html 压缩插件
 * @param minify 配置参数，默认为 true
 * @returns
 */
export function useHtmlMinifyPlugin(minify: HtmlMinifyPluginOptions): PluginOption {
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
