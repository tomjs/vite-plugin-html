# @tomjs/vite-plugin-html

![npm](https://img.shields.io/npm/v/%40tomjs/vite-plugin-html) ![NPM](https://img.shields.io/npm/l/%40tomjs%2Feslint) ![npm package minimized gzipped size (scoped version select exports)](https://img.shields.io/bundlejs/size/%40tomjs/vite-plugin-html)

A Vite plugin for handling HTML files, providing compression, loading, and CDN functionality.

**English** | [中文](./README.zh_CN.md)

## Install

With `pnpm`

```bash
pnpm add @tomjs/vite-plugin-html -D
```

With `yarn`

```bash
yarn add @tomjs/vite-plugin-html -D
```

With `npm`

```bash
npm i @tomjs/vite-plugin-html --save-dev
```

## Usage

Taking Vue/React projects as examples:

### Default Plugin

#### Vue Example

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
        after: `<div style="color:#888">loading...</div>`,
      },
      cdn: {
        modules: ['vue', 'vue-router', 'pinia', 'ant-design-vue'],
      },
    }),
  ],
});
```

#### React Example

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
        after: `<div style="color:#888">loading...</div>`,
      },
      cdn: {
        modules: ['react', 'react-dom', 'react-router-dom', 'antd'],
      },
    }),
  ],
});
```

#### Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| minify | `boolean` \| [HtmlMinifyOptions](#HtmlMinifyOptions) | true | Configuration for compression plugin |
| loading | `boolean` \| [HtmlLoadingOptions](#HtmlLoadingOptions) | false | Configuration for loading plugin |
| cdn | `false` \| [HtmlCdnOptions](#HtmlCdnOptions) | false | Configuration for CDN plugin |

### Using Compression

Compresses HTML code.

#### Vue Example

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { useHtmlMinifyPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [vue(), useHtmlMinifyPlugin()],
});
```

#### React Example

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { useHtmlMinifyPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [react(), useHtmlMinifyPlugin()],
});
```

#### Parameters

`boolean` or [HtmlMinifyOptions](#HtmlMinifyOptions), default is `true` .

##### HtmlMinifyOptions

Same as the `Options` parameter of [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser#options-quick-reference). When the plugin parameter is `boolean` , the default configuration is as follows. Otherwise, it uses the default configuration of `html-minifier-terser` .

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| collapseWhitespace | `boolean` | true | Collapse white space that contributes to text nodes |
| keepClosingSlash | `boolean` | true | Keep the trailing slash on singleton elements |
| removeComments | `boolean` | true | Remove HTML comments |
| removeRedundantAttributes | `boolean` | true | Remove attributes when value matches default |
| removeScriptTypeAttributes | `boolean` | true | Remove `type="text/javascript"` from script tags |
| removeStyleLinkTypeAttributes | `boolean` | true | Remove `type="text/css"` from style and link tags |
| useShortDoctype | `boolean` | true | Replace `doctype` with short (HTML5) doctype |
| minifyCSS | `boolean` | true | Minify CSS in style elements and style attributes (using clean-css) |

### Using Loading

Adds loading code to the root node of the application to prevent white screens caused by network issues.

#### Vue Example

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { useHtmlLoadingPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    vue(),
    useHtmlLoadingPlugin({
      // selector: '#app',
      after: `<div style="color:#888">loading...</div>`,
    }),
  ],
});
```

#### React Example

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { useHtmlLoadingPlugin } from '@tomjs/vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    useHtmlLoadingPlugin({
      selector: '#root',
      after: `<div style="color:#888">loading...</div>`,
    }),
  ],
});
```

#### Parameters

`boolean` or [HtmlLoadingOptions](#HtmlLoadingOptions), default is `true` .

##### HtmlLoadingOptions

| Parameter | Type     | Default   | Description                |
| --------- | -------- | --------- | -------------------------- |
| selector  | `string` | #app      | Selector for loading node  |
| style     | `string` | undefined | Custom style code          |
| before    | `string` | undefined | Code to add before loading |
| after     | `string` | undefined | Code to add after loading  |

### Using CDN

Changes module configuration to use CDN for `vite build` , improving build speed and reducing bundle size.

#### Vue Example

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

#### React Example

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

#### Dependencies

If you are using a package manager other than `yarn` , you may need to install additional dependencies for certain npm packages. To ensure proper functionality, please add the following dependencies:

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

#### Parameters

##### HtmlCdnOptions

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **modules** | ([NpmModule](#NpmModule) \| [PresetNpmModule](#PresetNpmModule) \| [HtmlInjectCode](#HtmlInjectCode))[] | [] | Modules to import |
| type | `'unpkg' \| 'jsdelivr' \| 'custom'` | 'unpkg' | CDN source type |
| url | `string` | '' | Custom URL (used with `type` ) |
| local | 'boolean' \| 'string[]' \| [HtmlCdnLocal](#HtmlCdnLocal) | false | Local mode or specific modules |

##### NpmModule

Configuration for CDN modules.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **name** | `string` | undefined | Name of the package |
| var | `string` | undefined | Global variable name (defaults to PascalCase name) |
| version | `string` | undefined | Package version (defaults to version in node_modules) |
| file | `string \| string[]` | undefined | Path to the resource JS/CSS file |
| deps | `string[]` | undefined | Dependent modules |
| local | `boolean` | false | Whether it is a local module |

Example:

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

Default supported types, internally mapped to corresponding [NpmModule](#NpmModule) configurations:

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

Injected HTML page code.

| Parameter | Type     | Default   | Description              |
| --------- | -------- | --------- | ------------------------ |
| **code**  | `string` | undefined | HTML page code to inject |

##### HtmlCdnLocal

Local configuration for CDN.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **modules** | `'boolean' \| string[]` | false | Local mode or specific modules |
| base | 'string' | '/' | Same as Vite's `base` option |
| outDir | 'string' | 'dist' | Local output directory, defaults to Vite's `build.outDir` |
| path | 'string' | 'npm/{name}@{version}' | Local output path, module URLs will also be replaced with this path |
| copy | 'boolean' | true | Whether to copy to local directory |

## Development

- Development requirements:

  - git
  - node>=18
  - pnpm>=8

- For first-time use, install dependencies by running the following commands:

```bash
# Install dependencies
pnpm i
# Generate dist for this library and install dependencies for examples
pnpm bootstrap
```

## References

- [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)
- [ant-design-pro](https://github.com/ant-design/ant-design-pro)
- [vite-plugin-cdn-import](https://www.npmjs.com/package/vite-plugin-cdn-import)
