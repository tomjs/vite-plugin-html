/**
 * loading 插件详细配置
 */
export interface HtmlLoadingOptions {
  /**
   * 插入 loading 的节点选择器，默认 #app
   */
  selector?: string;
  /**
   * 自定义 style 代码
   */
  style?: string;
  /**
   * 添加在 loading 代码之前的代码
   */
  before?: string;
  /**
   * 添加在 loading 代码之后的代码
   */
  after?: string;
}

/**
 * loading 插件配置，默认为true
 */
export type HtmlLoadingPluginOptions = boolean | HtmlLoadingOptions;
