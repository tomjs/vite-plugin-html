# @tomjs/vite-plugin-html

![npm](https://img.shields.io/npm/v/%40tomjs/vite-plugin-html) ![NPM](https://img.shields.io/npm/l/%40tomjs%2Feslint) ![npm package minimized gzipped size (scoped version select exports)](https://img.shields.io/bundlejs/size/%40tomjs/vite-plugin-html)

vite 插件，用于处理 html 文件，提供压缩、loading、cdn功能

[English](./README.md) | **中文**

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
      cdn: {
        modules: ['vue', 'vue-router', 'pinia', 'ant-design-vue'],
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
      cdn: {
        modules: ['react', 'react-dom', 'react-router-dom', 'antd'],
      },
    }),
  ],
});
```

#### 参数

| 参数名  | 类型                                                   | 默认值 | 说明             |
| ------- | ------------------------------------------------------ | ------ | ---------------- |
| minify  | `boolean` \| [HtmlMinifyOptions](#HtmlMinifyOptions)   | true   | 压缩插件配置     |
| loading | `boolean` \| [HtmlLoadingOptions](#HtmlLoadingOptions) | false  | loading 插件配置 |
| cdn     | `false` \| [HtmlCdnOptions](#HtmlCdnOptions)           | false  | cdn 插件配置     |

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

### 使用 cdn

`vite build` 将配置模块改为 `cdn` 的方式引用，提高打包速度和减小包体积

#### vue示例

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { useHtmlCdnPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    vue(),
    useHtmlCdnPlugin({
      modules: ['vue', 'vue-router', 'pinia', 'ant-design-vue'],
    }),
  ],
});
```

#### react示例

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { useHtmlCdnPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    useHtmlCdnPlugin({
      modules: ['react', 'react-dom', 'react-router-dom', 'antd'],
    }),
  ],
});
```

#### 依赖

如果使用非 `yarn` 作为包管理工具，部分 npm 包需要额外引入特殊依赖包，为保障正常使用，需要添加依赖

- pinia

```bash
pnpm add vue-demi pinia
```

- ant-design-vue

```bash
pnpm add dayjs ant-design-vue
```

- @vueuse/core

```bash
pnpm add @vueuse/core @vueuse/shared
```

- antd

```bash
pnpm add dayjs antd
```

#### 参数

##### HtmlCdnOptions

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| **modules** | ([NpmModule](#NpmModule) \| [PresetNpmModule](#PresetNpmModule) \| [HtmlInjectCode](#HtmlInjectCode))[] | [] | 引入的模块 |
| type | `'unpkg' \| 'jsdelivr' \| 'custom'` | 'unpkg' | cdn 源类型。jsdelivr: url默认值为 https://cdn.jsdelivr.net/npm/{name}@{version}/{file}; unpkg: url默认值为 https://unpkg.com/{name}@{version}/{file}; custom: 可自定义url |
| url | `string` | '' | 结合 type 参数使用, 设置不同url，最终路径为 {url}/{file} |
| local | 'boolean' \| 'string[]' \| [HtmlCdnLocal](#HtmlCdnLocal) | false | 本地模式或指定模块为本地模块，默认为 false |

##### NpmModule

cdn 模块配置

| 参数名   | 类型                 | 默认值    | 说明                                   |
| -------- | -------------------- | --------- | -------------------------------------- |
| **name** | `string`             | undefined | 包的名称                               |
| var      | `string`             | undefined | 全局变量名，未指定则为包名的大驼峰形式 |
| version  | `string`             | undefined | 包版本，未指定则取node_modules下的版本 |
| file     | `string \| string[]` | undefined | 需要加载的资源js/css文件路径           |
| deps     | `string[]`           | undefined | 依赖模块                               |
| local    | `boolean`            | false     | 是否为本地模块                         |

示例如下:

```ts
const modules = [
  {
    name: 'lodash',
    var: '_',
    file: 'lodash.min.js',
  },
  {
    name: 'vue',
    var: 'Vue',
  },
  {
    name: 'vue-router',
    deps: ['vue'],
  },
  {
    name: 'ant-design-vue',
    deps: ['vue', 'vue-router'],
    file: ['dist/antd.min.js'],
  },
];
```

##### PresetNpmModule

默认支持类型，内置对应 `NpmModule` 配置

- dayjs
- axios
- lodash
- vue
- vue-router
- vue-demi
- pinia
- ant-design-vue
- ant-design-vue3
- @vueuse/core
- @vueuse/shared
- element-plus
- react
- react-dom
- react-router-dom
- antd
- ahooks
- @ant-design/charts

##### HtmlInjectCode

注入的 html 页面代码等

| 参数名   | 类型     | 默认值    | 说明                 |
| -------- | -------- | --------- | -------------------- |
| **code** | `string` | undefined | 注入的 html 页面代码 |

##### HtmlCdnLocal

cdn 本地配置

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| **modules** | `'boolean' \| string[] ` | false | 本地模式或指定模块为本地模块 |
| base | 'string' | '/' | 同 vite 配置 base 选项 |
| outDir | 'string' | 'dist' | 本地输出目录, 默认同 vite 配置 build.outDir 选项 |
| path | 'string' | 'npm/{name}@{version}' | 本地输出路径，对应模块url也会替换为该路径 |
| copy | 'boolean' | true | 是否复制到本地 |

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
- [vite-plugin-cdn-import](https://www.npmjs.com/package/vite-plugin-cdn-import)