# @tomjs/vite-plugin-html

vite 插件，用于处理 html 文件，提供压缩功能

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

### 使用压缩

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

#### HtmlMinifyOptions

`boolean` 或 [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser#options-quick-reference) 的`Options`参数，默认为`true`

### 默认配置

#### vue示例

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import html from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [vue(), html({ minify: true })],
});
```

#### react示例

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import html from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [react(), html({ minify: true })],
});
```

#### 参数

| 参数名 | 类型                                    | 默认值 | 说明     |
| ------ | --------------------------------------- | ------ | -------- |
| minify | [HtmlMinifyOptions](#HtmlMinifyOptions) | true   | 压缩配置 |

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
