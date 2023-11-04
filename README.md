# @tomjs/vite-plugin-html

vite 插件，用于处理 html 文件，提供压缩、loading功能

## 安装

使用 `pnpm` 安装

```bash
pnpm add @tomjs/vite-plugin-html -D
```

使用 `yarn` 安装

```bash
yarn add @tomjs/vite-plugin-html -D
```

使用 `npm` 安装

```bash
npm i @tomjs/vite-plugin-html -D
```

## 使用说明

以 vue/react 项目为例

### 默认插件

#### vue示例

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import html from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    vue(),
    html({
      minify: true,
      loading: {
        // selector: '#app',
        after: `<div style="color:#888">加载中...</div>`,
      },
    }),
  ],
});
```

#### react示例

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import html from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    html({
      minify: true,
      loading: {
        selector: '#root',
        after: `<div style="color:#888">加载中...</div>`,
      },
    }),
  ],
});
```

#### 参数

| 参数名  | 类型                                                   | 默认值 | 说明             |
| ------- | ------------------------------------------------------ | ------ | ---------------- |
| minify  | `boolean` 或 [HtmlMinifyOptions](#HtmlMinifyOptions)   | true   | 压缩插件配置     |
| loading | `boolean` 或 [HtmlLoadingOptions](#HtmlLoadingOptions) | false  | loading 插件配置 |

### 使用压缩

压缩 html 代码

#### vue示例

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { useHtmlMinifyPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [vue(), useHtmlMinifyPlugin()],
});
```

#### react示例

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { useHtmlMinifyPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [react(), useHtmlMinifyPlugin()],
});
```

#### 参数

`boolean` 或 [HtmlMinifyOptions](#HtmlMinifyOptions)，默认为 `true`

##### HtmlMinifyOptions

同 [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser#options-quick-reference) 的`Options`参数，当插件参数为 `boolean` 时，插件默认配置如下，否则为 `html-minifier-terser` 默认

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| collapseWhitespace | `boolean` | true | 折叠文档树中构成文本节点的空白区域 |
| keepClosingSlash | `boolean` | true | 在单例元素上保留尾部斜杠 |
| removeComments | `boolean` | true | 去除 HTML 注释 |
| removeRedundantAttributes | `boolean` | true | 当值与默认值匹配时删除属性 |
| removeScriptTypeAttributes | `boolean` | true | type="text/javascript"从标签中删除script。其他type属性值保持不变 |
| removeStyleLinkTypeAttributes | `boolean` | true | type="text/css"从style和标签中删除link。其他type属性值保持不变 |
| useShortDoctype | `boolean` | true | 将 替换doctype为短 (HTML5) 文档类型 |
| minifyCSS | `boolean` | true | 缩小样式元素和样式属性中的 CSS（使用clean-css） |

### 使用loading

在应用根节点增加loading代码，避免网络问题造成的白屏

#### vue示例

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { useHtmlLoadingPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    vue(),
    useHtmlLoadingPlugin({
      // selector: '#app',
      after: `<div style="color:#888">加载中...</div>`,
    }),
  ],
});
```

#### react示例

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { useHtmlLoadingPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    useHtmlLoadingPlugin({
      selector: '#root',
      after: `<div style="color:#888">加载中...</div>`,
    }),
  ],
});
```

#### 参数

`boolean` 或 [HtmlLoadingOptions](#HtmlLoadingOptions)，默认为 `true`

##### HtmlLoadingOptions

| 参数名   | 类型     | 默认值    | 说明                          |
| -------- | -------- | --------- | ----------------------------- |
| selector | `string` | #app      | 插入 loading 节点的选择器     |
| style    | `string` | undefined | 自定义 style 代码             |
| before   | `string` | undefined | 添加在 loading 代码之前的代码 |
| after    | `string` | undefined | 添加在 loading 代码之后的代码 |

## 开发

- 开发环境

  - git
  - node>=16
  - pnpm>=8

- 首次使用，需要安装依赖，执行如下命令

```bash
# 安装依赖
pnpm i
# 生成本库的dist，安装 examples 依赖
pnpm bootstrap
```

## 参考项目

- [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)
- [ant-design-pro](https://github.com/ant-design/ant-design-pro)
