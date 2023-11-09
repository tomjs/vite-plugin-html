/**
 * Detailed configuration for the loading plugin
 */
export interface HtmlLoadingOptions {
  /**
   * Selector for the node to insert the loading into, default is #app
   */
  selector?: string;
  /**
   * Custom style code
   */
  style?: string;
  /**
   * Code to add before the loading code
   */
  before?: string;
  /**
   * Code to add after the loading code
   */
  after?: string;
}
