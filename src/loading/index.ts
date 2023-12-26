import type { PluginOption } from 'vite';
import { parse as htmlParser } from 'node-html-parser';
import { LOADING_PLUGIN_NAME } from '../constants';
import loadingHtml from './template';
import { type HtmlLoadingOptions } from './types';

export * from './types';

// Default selector for Vue app
const DEFAULT_SELECTOR = '#app';

/**
 * HTML loading plugin
 * @param options Configuration options, default is true
 * @returns
 */
export function useHtmlLoadingPlugin(options?: boolean | HtmlLoadingOptions): PluginOption {
  return {
    name: LOADING_PLUGIN_NAME,
    enforce: 'post',
    transformIndexHtml(html) {
      let opts: HtmlLoadingOptions = {};

      if (typeof options === 'boolean') {
        if (options === false) {
          return html;
        }
      } else {
        opts = Object.assign({}, options);
      }

      opts.selector = opts.selector || DEFAULT_SELECTOR;

      const root = htmlParser(html);
      const app = root.querySelector(opts.selector);
      if (!app) {
        return html;
      }

      app.appendChild(
        htmlParser(
          loadingHtml
            .replaceAll('--selector--', opts.selector)
            .replaceAll('<!-- style -->', opts.style ? `<style>${opts.style}</style>` : '')
            .replaceAll('<!-- before -->', opts.before || '')
            .replaceAll('<!-- after -->', opts.after || ''),
        ),
      );

      return root.toString();
    },
  };
}
