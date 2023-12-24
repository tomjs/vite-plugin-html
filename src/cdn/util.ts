import type { UserConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import { isEmptyArray, pascalCase, urlConcat, uuid } from '../utils';
import { PRESET_MODULES } from './data';
import { DepModuleFiles, HtmlCdnLocal, HtmlCdnOptions, HtmlInjectCode, NpmModule } from './types';

const urlTypeMap: Record<string, string> = {
  jsdelivr: 'https://cdn.jsdelivr.net/npm/{name}@{version}',
  unpkg: 'https://unpkg.com/{name}@{version}',
};

/**
 * Get package information
 */
function getPkgInfo(name: string) {
  const pwd = process.cwd();
  const modulePath = path.join(pwd, 'node_modules', name);
  const pkgFile = path.join(modulePath, 'package.json');
  if (!fs.existsSync(pkgFile)) {
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
  let file = pkg.jsdelivr || pkg.unpkg || pkg.main;
  if (!file) {
    console.log(
      `The ${name} package was not found with valid file information. Please configure it`,
    );
  }

  // Get compressed file to reduce size
  if (file && !['.min.js', '.prod.js'].find(s => file.endsWith(s))) {
    const minFileArr: string[] = file.split('.');
    if (minFileArr.length > 1) {
      const ext = minFileArr.pop() as string;
      const prodFlags = ['prod', 'min'];
      for (let i = 0; i < prodFlags.length; i++) {
        const fileName = minFileArr.concat(prodFlags[i], ext).join('.');
        const fullPath = path.join(modulePath, 'package.json');
        if (fs.existsSync(fullPath)) {
          file = fileName;
          break;
        }
      }
    }
  }

  const dependencies = Object.assign({}, pkg.dependencies);
  Object.keys(dependencies).forEach(k => {
    dependencies[k] = dependencies[k].replace(/[\^~>=]/g, '');
  });

  return {
    version: pkg.version,
    file,
    dependencies,
  };
}

/**
 * Get project package dependencies
 */
function getProjectPkgDeps() {
  const pwd = process.cwd();
  const pkgFile = path.join(pwd, 'package.json');
  if (!fs.existsSync(pkgFile)) {
    return [];
  }

  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
  return Object.keys(pkg.dependencies || {});
}

type PreHandleOptions = Omit<HtmlCdnOptions, 'local'> & { local: HtmlCdnLocal };

// Preprocess configuration options
function preHandleOptions(options?: HtmlCdnOptions): PreHandleOptions {
  const opts: PreHandleOptions = Object.assign(
    { type: 'unpkg', local: false } as HtmlCdnOptions,
    _.cloneDeep(Object.assign({}, options)),
  );

  // URL type
  let { type, url } = opts;
  if (!type || !['jsdelivr', 'unpkg', 'custom', 'local'].includes(type)) {
    type = 'unpkg';
  }

  if (['jsdelivr', 'unpkg'].includes(type)) {
    url = urlTypeMap[type];
  } else if (!url) {
    throw new Error('When the type parameter is custom, the url parameter is required.');
  }

  opts.type = type;
  opts.url = url;

  const { local } = opts;
  const localOpts: HtmlCdnLocal = {
    modules: [],
    copy: true,
  };

  if (typeof local === 'boolean' || Array.isArray(local)) {
    Object.assign(localOpts, { modules: local });
  } else {
    Object.assign(localOpts, local);
  }
  localOpts.modules = localOpts.modules ?? false;
  localOpts.path = localOpts.path || 'npm/{name}@{version}';
  opts.local = localOpts;

  return opts;
}

/**
 * Get module file array
 */
export function getModuleFiles(file) {
  const files = file || [];
  return Array.isArray(files) ? files : [files];
}

/**
 * Get module path
 * @param url URL and local path
 * @param name Package name
 * @param version Package version
 * @returns
 */
export function getModulePath(url, name: string, version?: string): string {
  const dest = (url || '').replace('{name}', name);
  if (version) {
    return dest.replace('{version}', version);
  } else {
    return dest.replace(/[/@]{version}/g, '');
  }
}

/**
 * Get processed module configuration
 * @param options Plugin configuration
 * @param userConfig Vite user configuration
 * @returns
 */
export function getModuleConfig(options: HtmlCdnOptions, userConfig: UserConfig) {
  // Generate code
  const codes: string[] = [];
  const externalLibs: string[] = [];
  const externalMap: Record<string, string> = {};
  const opts = preHandleOptions(options);
  const { modules } = opts;

  if (isEmptyArray(modules)) {
    return {
      codes,
      externalLibs,
      externalMap,
      moduleList: [],
      options: opts,
    };
  }

  const moduleList: (NpmModule | HtmlInjectCode)[] = [];

  // Merge object modules
  function mergeModuleConfig(npm: NpmModule) {
    if (moduleList.find(m => m.name === npm.name)) {
      return;
    }

    npm.var = npm.var || pascalCase(npm.name);

    const { deps } = npm as NpmModule;
    if (Array.isArray(deps) && deps.length > 0) {
      deps.forEach(dep => {
        mergeStringModuleConfig(dep);
      });
    }
    // Local CDN
    if (typeof npm.local !== 'boolean') {
      const localModules = opts.local.modules;
      if (typeof localModules === 'boolean') {
        npm.local = localModules;
      } else if (Array.isArray(localModules) && localModules.length > 0) {
        npm.local = localModules.includes(npm.name);
      } else {
        npm.local = false;
      }
    }
    moduleList.push(npm);
  }

  // Merge string modules
  function mergeStringModuleConfig(npmName: DepModuleFiles) {
    if (typeof npmName === 'object') {
      Object.keys(npmName).forEach(name => {
        let npm = moduleList.find(m => m.name === name) as NpmModule;
        if (!npm) {
          npm = PRESET_MODULES[name] as NpmModule;
        }
        const newNpm = _.cloneDeep(npm);
        newNpm.name = npm.name || name;
        newNpm.file = [...new Set(getModuleFiles(npm.file).concat(getModuleFiles(npmName[name])))];
        mergeModuleConfig(newNpm);
      });
      return;
    } else if (typeof npmName !== 'string') {
      return;
    }

    if (moduleList.find(m => m.name === npmName)) {
      return;
    }

    const npm = PRESET_MODULES[npmName];
    if (npm) {
      npm.name = npm.name || npmName;
      mergeModuleConfig(_.cloneDeep(npm));
    } else {
      mergeModuleConfig({
        name: npmName,
      });
    }
  }

  // Convert module configuration
  modules.forEach(npm => {
    if (typeof npm === 'string') {
      mergeStringModuleConfig(npm);
      return;
    }
    if (typeof npm !== 'object') {
      return;
    }

    // Inject code
    if ('code' in npm) {
      if (npm.code) {
        npm.name = uuid();
        moduleList.push(npm);
      }
      return;
    }
    // Custom module
    mergeModuleConfig(npm as NpmModule);
  });

  // Process npm versions and reference file information
  moduleList.forEach(npm => {
    if ('code' in npm) {
      return;
    }
    const { name } = npm;

    const pkg = getPkgInfo(name);
    if (pkg) {
      const { version, file } = pkg;
      npm.version = npm.version || version;
      npm.file = npm.file || file;

      // Check dependency version information
      const { deps } = npm;
      if (Array.isArray(deps)) {
        const updateVersion = (dep: string) => {
          const depNpm = moduleList.find(m => m.name === dep);
          if (depNpm && !depNpm.version) {
            depNpm.version = pkg.dependencies[dep] || '';
          }
        };

        deps.forEach(dep => {
          if (typeof dep === 'object') {
            Object.keys(dep).forEach(key => {
              updateVersion(key);
            });
          } else if (typeof dep === 'string') {
            updateVersion(dep);
          }
        });
      }
    } else {
      npm.local = false;
    }
  });

  // Generate reference file code
  const pkgDeps = getProjectPkgDeps();

  const baseUrl = opts.local?.base || userConfig?.base || '/';
  moduleList.forEach(npm => {
    if ('code' in npm) {
      codes.push(npm.code || '');
      return;
    }
    const { name } = npm;

    // Exclude npm dependencies
    if (pkgDeps.includes(name)) {
      externalLibs.push(name);
      externalMap[name] = npm.var as string;
    }

    const urlPath = getModulePath(npm.local ? opts?.local?.path : opts.url, name, npm.version);
    // Import scripts and styles
    const files = getModuleFiles(npm.file);
    files.forEach(s => {
      const fileUrl = urlConcat(npm.local ? baseUrl : '', urlPath, (s || '').replace(/\.\//g, ''));
      if (s.endsWith('.js')) {
        codes.push(`<script src="${fileUrl}"></script>`);
      } else if (s.endsWith('.css')) {
        codes.push(`<link href="${fileUrl}" type="text/css" rel="stylesheet"></link>`);
      }
    });
  });

  return {
    codes,
    externalLibs,
    externalMap,
    moduleList,
    options: opts,
  };
}
