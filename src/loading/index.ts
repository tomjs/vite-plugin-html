import type { PluginOption } from 'vite';
import { parse as htmlParser } from 'node-html-parser';
import { type HtmlLoadingOptions } from './types';

export * from './types';

// vue 默认节点选择器
const DEFAULT_SELECTOR = '#app';

/**
 * html loading 插件
 * @param options 配置参数，默认为 true
 * @returns
 */
export function useHtmlLoadingPlugin(options?: boolean | HtmlLoadingOptions): PluginOption {
  return {
    name: '@tomjs:html-loading',
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
        htmlParser(`
        <style>
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        ${opts.selector} {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          margin: 0;
          padding: 0;
        }

        .page-loading-warp {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .ant-spin {
          position: absolute;
          display: none;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, 0.65);
          color: #1890ff;
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          text-align: center;
          list-style: none;
          opacity: 0;
          -webkit-transition: -webkit-transform 0.3s
            cubic-bezier(0.78, 0.14, 0.15, 0.86);
          transition: -webkit-transform 0.3s
            cubic-bezier(0.78, 0.14, 0.15, 0.86);
          transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
            -webkit-transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          -webkit-font-feature-settings: "tnum";
          font-feature-settings: "tnum";
        }

        .ant-spin-spinning {
          position: static;
          display: inline-block;
          opacity: 1;
        }

        .ant-spin-dot {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          font-size: 20px;
        }

        .ant-spin-dot-item {
          position: absolute;
          display: block;
          width: 9px;
          height: 9px;
          background-color: #1890ff;
          border-radius: 100%;
          -webkit-transform: scale(0.75);
          -ms-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-transform-origin: 50% 50%;
          -ms-transform-origin: 50% 50%;
          transform-origin: 50% 50%;
          opacity: 0.3;
          -webkit-animation: antspinmove 1s infinite linear alternate;
          animation: antSpinMove 1s infinite linear alternate;
        }

        .ant-spin-dot-item:nth-child(1) {
          top: 0;
          left: 0;
        }

        .ant-spin-dot-item:nth-child(2) {
          top: 0;
          right: 0;
          -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s;
        }

        .ant-spin-dot-item:nth-child(3) {
          right: 0;
          bottom: 0;
          -webkit-animation-delay: 0.8s;
          animation-delay: 0.8s;
        }

        .ant-spin-dot-item:nth-child(4) {
          bottom: 0;
          left: 0;
          -webkit-animation-delay: 1.2s;
          animation-delay: 1.2s;
        }

        .ant-spin-dot-spin {
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
          -webkit-animation: antrotate 1.2s infinite linear;
          animation: antRotate 1.2s infinite linear;
        }

        .ant-spin-lg .ant-spin-dot {
          width: 32px;
          height: 32px;
          font-size: 32px;
        }

        .ant-spin-lg .ant-spin-dot i {
          width: 14px;
          height: 14px;
        }

        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          .ant-spin-blur {
            background: #fff;
            opacity: 0.5;
          }
        }

        @-webkit-keyframes antSpinMove {
          to {
            opacity: 1;
          }
        }

        @keyframes antSpinMove {
          to {
            opacity: 1;
          }
        }

        @-webkit-keyframes antRotate {
          to {
            -webkit-transform: rotate(405deg);
            transform: rotate(405deg);
          }
        }

        @keyframes antRotate {
          to {
            -webkit-transform: rotate(405deg);
            transform: rotate(405deg);
          }
        }
      </style>

      <style>${opts.style || ''}</style>

      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 362px;
      ">
        ${opts.before || ''}
        <div class="page-loading-warp">
          <div class="ant-spin ant-spin-lg ant-spin-spinning">
            <span class="ant-spin-dot ant-spin-dot-spin">
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
            </span>
          </div>
        </div>
        ${opts.after || ''}
      </div>
      `),
      );

      return root.toString();
    },
  };
}
