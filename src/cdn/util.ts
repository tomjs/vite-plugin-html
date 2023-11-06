import type { UserConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import { isEmptyArray, pascalCase, urlContact, uuid } from '../utils';
import { PRESET_MODULES } from './data';
import { HtmlCdnOptions, HtmlInjectCode, NpmModule } from './types';

const urlTypeMap: Record<string, string> = {
  jsdelivr: 'https://cdn.jsdelivr.net/npm/{name}@{version}',
  unpkg: 'https://unpkg.com/{name}@{version}',
};

/**
 * 获取包信息
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
    throw new Error(
      `The ${name} package was not found with valid file information. Please configure it`,
    );
  }

  // 取压缩文件, 减小体积
  if (!['.min.js', '.prod.js'].find(s => file.endsWith(s))) {
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
 * 获取当前项目包依赖
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

// 预处理配置参数
function preHandleOptions(options?: HtmlCdnOptions) {
  const opts: HtmlCdnOptions = Object.assign(
    { type: 'unpkg', local: false } as HtmlCdnOptions,
    _.cloneDeep(Object.assign({}, options)),
  );

  // url 类型
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
  opts.localPath = opts.localPath || 'npm/{name}@{version}';

  return opts;
}

/**
 * 获取模块文件数组
 */
export function getModuleFiles(file) {
  const files = file || [];
  return Array.isArray(files) ? files : [files];
}

/**
 * 获取模块路径
 * @param url url和local路径
 * @param name 包名
 * @param version 包版本
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
 * 获取处理后的模块配置
 * @param options 插件配置
 * @param userConfig vite用户配置
 * @returns
 */
export function getModuleConfig(options: HtmlCdnOptions, userConfig: UserConfig) {
  // 生成代码
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

  // 合并对象模块
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

    // 本地cdn
    if (typeof npm.local !== 'boolean') {
      if (typeof opts.local === 'boolean') {
        npm.local = opts.local;
      } else if (Array.isArray(opts.local) && opts.local.length > 0) {
        npm.local = opts.local.includes(npm.name);
      } else {
        npm.local = false;
      }
    }

    moduleList.push(npm);
  }

  // 合并字符串模块
  function mergeStringModuleConfig(npmName: string) {
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

  // 转换模块配置
  modules.forEach(npm => {
    if (typeof npm === 'string') {
      mergeStringModuleConfig(npm);
      return;
    }

    if (typeof npm !== 'object') {
      return;
    }

    // 注入代码
    if ('code' in npm) {
      if (npm.code) {
        npm.name = uuid();
        moduleList.push(npm);
      }
      return;
    }

    // 自定义模块
    mergeModuleConfig(npm as NpmModule);
  });

  // 处理npm版本及引用文件信息
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

      // 查看依赖版本信息
      const { deps } = npm;
      if (Array.isArray(deps)) {
        deps.forEach(dep => {
          const depNpm = moduleList.find(m => m.name === dep);
          if (depNpm && !depNpm.version) {
            depNpm.version = pkg.dependencies[dep] || '';
          }
        });
      }
    } else {
      npm.local = false;
    }

    // 处理特殊引用 https://antdv.com/docs/vue/introduce-cn#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E5%85%A5
    if (name === 'ant-design-vue') {
      const dayjs = moduleList.find(m => m.name === 'dayjs');

      if (dayjs) {
        const files = getModuleFiles(dayjs.file);
        [
          'customParseFormat.js',
          'weekday.js',
          'localeData.js',
          'weekOfYear.js',
          'weekYear.js',
          'advancedFormat.js',
          'quarterOfYear.js',
        ].forEach(s => {
          files.push(`plugin/${s}`);
        });

        dayjs.file = _.uniq(files);
      }
    }
  });

  // 生成引用文件代码
  const pkgDeps = getProjectPkgDeps();

  const baseUrl = userConfig?.base || '/';
  moduleList.forEach(npm => {
    if ('code' in npm) {
      codes.push(npm.code || '');
      return;
    }
    const { name } = npm;

    // 排除 npm 依赖
    if (pkgDeps.includes(name)) {
      externalLibs.push(name);
      externalMap[name] = npm.var as string;
    }

    const urlPath = getModulePath(npm.local ? opts.localPath : opts.url, name, npm.version);
    // 引入脚本样式
    const files = getModuleFiles(npm.file);
    files.forEach(s => {
      const fileUrl = urlContact(npm.local ? baseUrl : '', urlPath, (s || '').replace(/\.\//g, ''));
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
