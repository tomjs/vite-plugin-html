/**
 * cdn module configuration
 */
export interface NpmModule {
  /**
   * Package name
   */
  name: string;
  /**
   * Global variable name, defaults to camel case of the package name if not specified
   */
  var?: string;
  /**
   * Package version, defaults to the version in node_modules if not specified
   */
  version?: string;
  /**
   * Path to the resource js/css files to be loaded
   */
  file?: string | string[];
  /**
   * Dependency modules
   */
  deps?: string[];
  /**
   * Local module
   */
  local?: boolean;
}

export type Union<T> = T | (string & {});

/**
 * Default supported types
 */
export type PresetNpmModule = Union<
  | 'dayjs'
  | 'axios'
  | 'lodash'
  | 'vue'
  | 'vue-router'
  | 'vue-demi'
  | 'pinia'
  | 'ant-design-vue'
  | 'ant-design-vue3'
  | '@vueuse/core'
  | '@vueuse/shared'
  | 'element-plus'
  | 'react'
  | 'react-dom'
  | 'react-router-dom'
  | 'antd'
  | 'ahooks'
  | '@ant-design/charts'
>;

/**
 * Injected code
 */
export interface HtmlInjectCode {
  /**
   * Injected HTML code
   */
  code: string;
  [key: string]: any;
}

/**
 * All types of cdn module configurations
 */
export type HtmlCdnModule = PresetNpmModule | NpmModule | HtmlInjectCode;

/**
 * Local cdn configuration
 */
export interface HtmlCdnLocal {
  /**
   * Local mode or specify modules as local modules. Default is false.
   * @default false
   */
  modules: boolean | string[];
  /**
   * Same as vite configuration base option. Default is "/".
   * @default "/"
   */
  base?: string;
  /**
   * Local output directory, same as vite configuration build.outDir option. Default is "dist".
   * @default 'dist'
   */
  outDir?: string;
  /**
   * Local output path, the module URL will also be replaced with this path. Default is "npm/{name}@{version}".
   * @default "npm/{name}@{version}"
   */
  path?: string;
  /**
   * Whether to copy to local. Default is true.
   * @default true
   */
  copy?: boolean;
}

/**
 * cdn plugin configuration
 */
export interface HtmlCdnOptions {
  /**
   * Module configuration
   */
  modules: HtmlCdnModule[];
  /**
   * Tag selector where the cdn will be added. Default is "title".
   * @default "title"
   */
  selector?: string;
  /**
   * cdn source type, parameters name/version/file are taken from the modules configuration. Default is "unpkg".
   * * jsdelivr: url defaults to https://cdn.jsdelivr.net/npm/{name}@{version}/{file}
   * * unpkg: url defaults to https://unpkg.com/{name}@{version}/{file}
   * * custom: custom url can be defined
   *
   * @default "unpkg"
   */
  type?: 'unpkg' | 'jsdelivr' | 'custom';
  /**
   * Used in conjunction with the type parameter, sets different urls, the final path will be {url}/{file}
   * * jsdelivr: url defaults to https://cdn.jsdelivr.net/npm/{name}@{version}
   * * unpkg: url defaults to https://unpkg.com/{name}@{version}
   * * custom: custom url can be defined
   */
  url?: string;
  /**
   * Local mode or specify modules as local modules. Default is false.
   * @default false
   */
  local?: boolean | string[] | HtmlCdnLocal;
}
