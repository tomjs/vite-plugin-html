# @tomjs/vite-plugin-html

[![npm](https://img.shields.io/npm/v/@tomjs/vite-plugin-html)](https://www.npmjs.com/package/@tomjs/vite-plugin-html) ![node-current (scoped)](https://img.shields.io/node/v/@tomjs/vite-plugin-html) ![NPM](https://img.shields.io/npm/l/@tomjs/vite-plugin-html) [![Docs](https://img.shields.io/badge/API-unpkg-orange)](https://www.unpkg.com/browse/@tomjs/vite-plugin-html/dist/index.d.ts)

**English** | [中文](./README.zh_CN.md)

> A Vite plugin for handling HTML files, providing compression, loading, and CDN functionality.

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
npm add @tomjs/vite-plugin-html -D
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

#### Documentation

- [index.d.ts](https://www.unpkg.com/browse/@tomjs/vite-plugin-html/dist/index.d.ts) provided by [unpkg.com](https://www.unpkg.com).

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

#### Parameters

##### HtmlCdnOptions

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **modules** | ([NpmModule](#NpmModule) \| [PresetNpmModule](#PresetNpmModule) \| [HtmlInjectCode](#HtmlInjectCode))[] | [] | Modules to import |
| type | `'npmmirror' \| 'unpkg' \| 'jsdelivr' \| 'custom'` | 'jsdelivr' | `CDN` source type, parameters `name`/`version`/`file` are taken from the modules configuration. When the OS language is `zh_CN` , the default value is `npmmirror`, otherwise it is `jsdelivr`. |
| url | `string` | '' | Custom URL (used with `type` ) |
| local | 'boolean' \| 'string[]' \| [HtmlCdnLocal](#HtmlCdnLocal) | false | Local mode or specific modules |

CDN type:

- npmmirror: url defaults to https://registry.npmmirror.com/{name}/{version}/files/{file}
- jsdelivr: url defaults to https://cdn.jsdelivr.net/npm/{name}@{version}/{file}
- unpkg: url defaults to https://unpkg.com/{name}@{version}/{file}
- custom: custom url can be defined

##### NpmModule

Configuration for CDN modules.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| **name** | `string` | undefined | Name of the package |
| var | `string` | undefined | Global variable name (defaults to PascalCase name) |
| version | `string` | undefined | Package version (defaults to version in node_modules) |
| file | `string \| string[]` | undefined | Path to the resource JS/CSS file |
| modulePath | `string` | undefined | Set npm module path |
| deps | `string[]` | undefined | Dependent modules |
| local | `boolean` | false | Whether it is a local module |
| injectBefore | `string \| string[]` | undefined | These codes will be inserted before the script/link tag of the current module.The `{url}` keyword in the code will be replaced with relevant information about the current module. |
| injectAfter | `string \| string[]` | undefined | These codes will be inserted after the script/link tag of the current module.The `{url}` keyword in the code will be replaced with relevant information about the current module. |

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

**WARNING**

Some modules are introduced using `CDN`, and other dependencies must be introduced first. When using package management tools such as `pnpm`, if the module's dependencies are not explicitly installed, the module's dependency information may not be obtained in `node_modules`, and the following exceptions may occur:

- The URL of `CDN` has no version number
- In `local` mode, dependencies are thrown in the form of `CDN` URL

You can try to proactively install related dependencies to solve them. The following are some module dependencies:

- antd
  - dayjs
- ant-design-vue
  - dayjs
- pinia
  - vue-demi
- @vueuse/core
  - @vueuse/shared

Currently, this library uses `pnpm list` to read dependencies to solve this problem. If you encounter this problem with other `npm` tools, please contact the author to add relevant support. Thanks.

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
# build library
pnpm build
```

- To debug the `vue` project, execute the following commands:

```bash
cd examples/vue
pnpm build
pnpm preview
```

- To debug the `react` project, execute the following commands:

```bash
cd examples/react
pnpm build
pnpm preview
```

## References

- [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)
- [ant-design-pro](https://github.com/ant-design/ant-design-pro)
- [vite-plugin-cdn-import](https://www.npmjs.com/package/vite-plugin-cdn-import)
