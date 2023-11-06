/**
 * cdn 模块配置
 */
export interface NpmModule {
  /**
   * 包的名称
   */
  name: string;
  /**
   * 全局变量名, 未指定同包名大驼峰
   */
  var?: string;
  /**
   * 包版本, 未指定取 node_modules 下版本
   */
  version?: string;
  /**
   * 需要加载的资源js/css文件路径
   */
  file?: string | string[];
  /**
   * 依赖模块
   */
  deps?: string[];
  /**
   * 本地模块
   */
  local?: boolean;
}

/**
 * 默认支持类型
 */
export type PresetNpmModule = (
  | 'dayjs'
  | 'axios'
  | 'lodash'
  | 'vue'
  | 'vue-router'
  | 'vue-demi'
  | 'pinia'
  | 'ant-design-vue'
  | '@vueuse/core'
  | '@vueuse/shared'
  | 'element-plus'
  | 'react'
  | 'react-dom'
  | 'react-router-dom'
  | 'antd'
  | 'ahooks'
  | '@ant-design/charts'
) &
  string;

/**
 * 注入代码
 */
export interface HtmlInjectCode {
  /**
   * 注入的 html 页面代码
   */
  code: string;
  [key: string]: any;
}

/**
 * cdn 模块配置所有类型
 */
export type HtmlCdnModule = PresetNpmModule | NpmModule | HtmlInjectCode;

/**
 * cdn 插件配置
 */
export interface HtmlCdnOptions {
  /**
   * 模块配置
   */
  modules: HtmlCdnModule[];
  /**
   * cdn 源类型, 参数 name/version/file 取自 modules 配置, 默认值为 unpkg
   * * jsdelivr: url默认值为 https://cdn.jsdelivr.net/npm/{name}@{version}/{file}
   * * unpkg: url默认值为 https://unpkg.com/{name}@{version}/{file}
   * * custom: 可自定义url
   */
  type?: 'unpkg' | 'jsdelivr' | 'custom';
  /**
   * 结合 type 参数使用, 设置不同url，最终路径为 {url}/{file}
   * * jsdelivr: url默认值为 https://cdn.jsdelivr.net/npm/{name}@{version}
   * * unpkg: url默认值为 https://unpkg.com/{name}@{version}
   * * custom: 可自定义url
   */
  url?: string;
  /**
   * 本地模式或指定模块为本地模块，默认为 false
   */
  local?: boolean | string[];
  /**
   * 本地输出目录, 默认同 vite 配置 build.outDir = dist
   */
  localDir?: string;
  /**
   * 本地输出路径，对应模块url也会替换为该路径，默认为 npm/{name}@{version}
   */
  localPath?: string;
}
