import type { PluginOption, UserConfig } from 'vite';
import path from 'node:path';
import fs from 'fs-extra';
import { parse as htmlParser } from 'node-html-parser';
import externalGlobals from 'rollup-plugin-external-globals';
import { type HtmlCdnOptions } from './types';
import { getArrayValue, getModuleConfig, getModulePath } from './util';

export * from './types';

/**
 * Vite HTML plugin with CDN and other support
 * @returns
 */
export function useHtmlCdnPlugin(options: HtmlCdnOptions): PluginOption {
  let moduleConfig = getModuleConfig({ modules: [] }, {});
  let outDir;

  return {
    name: '@tomjs:html-cdn',
    apply: 'build',
    enforce: 'post',
    config(userCfg, { command }) {
      moduleConfig = getModuleConfig(options, userCfg);
      const { externalLibs, externalMap, options: opts } = moduleConfig;

      // Output directory
      outDir = opts.local.outDir || userCfg.build?.outDir || 'dist';

      const userConfig: UserConfig = {
        build: {
          rollupOptions: {},
        },
      };

      if (command === 'build') {
        if (Array.isArray(externalLibs) && externalLibs.length) {
          userConfig!.build!.rollupOptions = {
            external: externalLibs,
            plugins: [externalGlobals(externalMap)],
          };
        }
      }

      return userConfig;
    },
    transformIndexHtml(html) {
      const { codes, options } = moduleConfig;
      if (Array.isArray(codes) && codes.length) {
        const root = htmlParser(html);
        const title = root.querySelector(options.selector || 'title');
        if (!title) {
          const head = root.querySelector('head');
          if (!head) {
            root?.insertAdjacentHTML('beforeend', '<head></head>');
          }
          head?.insertAdjacentHTML('beforeend', '<title></title>');
        }

        title?.insertAdjacentHTML('afterend', [''].concat(codes).join('\n'));

        return root.toString();
      }
      return html;
    },
    closeBundle() {
      const { moduleList, options: opts } = moduleConfig;
      if (opts.local.copy === false) {
        return;
      }

      // Output a local CDN file
      const localModules = moduleList.filter(s => s.local);
      if (localModules.length === 0) {
        return;
      }

      const outPath = path.join(process.cwd(), outDir);
      if (!fs.existsSync(outPath)) {
        fs.mkdirpSync(outPath);
      }

      const srcFolder = path.join(process.cwd(), 'node_modules');

      localModules.forEach(m => {
        const { name, version, file } = m;
        const files = getArrayValue(file);
        if (files.length === 0) {
          return;
        }
        const destFolder = getModulePath(opts.local.path, name, version);

        files.forEach(s => {
          const src = path.join(srcFolder, name, s);
          const dest = path.join(outPath, destFolder, s);
          if (!fs.existsSync(src)) {
            return;
          }
          if (fs.statSync(src).isDirectory()) {
            fs.mkdirpSync(dest);
          }

          fs.copySync(src, dest);
        });
      });
    },
  } as PluginOption;
}
