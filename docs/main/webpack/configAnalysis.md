# webpack 配置

## webpack 主流程

这里回顾下主流程，无论是 dev 还是 build，webpack 的流程都是类似

```js
# webpack做配置
await app.process();
# 执行webpack-dev-server
return app.dev();
```

我分 2 章分析，最后在把这个项目的 webpack 配置输出一下

## dev 和 build 的区分

这里有 3 个文件 createBaseConfig , createClientConfig , createServerConfig 后面 2 个都继承与 base, 在 dev 调用了 createClientConfig， 在 build 的时候调用 createServerConfig 。来看看为什么，再解释下为什么这么调用。

## base config

### 区分生产环境

```js
config
  // 分模式 ，build是production模式，dev是development
  // https://webpack.docschina.org/concepts/mode/#%E7%94%A8%E6%B3%95
  .mode(isProd && !env.isDebug ? "production" : "development")
  .output.path(outDir)
  // build保证最小化 entry chunk
  // https://webpack.docschina.org/guides/build-performance/#%E6%9C%80%E5%B0%8F%E5%8C%96-entry-chunk
  .filename(
    isProd ? "assets/js/[name].[chunkhash:8].js" : "assets/js/[name].js"
  )
  .publicPath(publicPath);
```

### devtool

对于 webpack 的 devtool 没有深入研究，最早学习 webpack 是用的 source-map；有[一篇文献](https://blog.teamtreehouse.com/introduction-source-maps)可以参考（后续待翻译）

```js
// https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
if (env.isDebug) {
  config.devtool("source-map");
} else if (!isProd) {
  config.devtool("cheap-module-eval-source-map");
}
```

### 引用配置

```js
config.resolve
  // 真实路径 https://webpack.docschina.org/configuration/resolve/#resolve-symlinks
  .set("symlinks", true)
  .alias.set("@source", sourceDir)
  .set("@client", clientDir)
  .set("@app", clientDir)
  .set("@temp", tempPath)
  .set("@dynamic", path.resolve(tempPath, "dynamic"))
  .set("@internal", path.resolve(tempPath, "internal"))
  .end()
  // 文件扩展
  .extensions.merge([".js", ".jsx", ".vue", ".json", ".styl"])
  .end()
  .modules.merge(modulePaths);

config.resolveLoader.set("symlinks", true).modules.merge(modulePaths);

// 排除相关引用
config.module.noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/);
```

### 引入 loader

```js
function applyVuePipeline(rule) {
  rule
    .use("cache-loader")
    .loader("cache-loader")
    .options({
      cacheDirectory,
      cacheIdentifier: finalCacheIdentifier
    });

  rule
    .use("vue-loader")
    .loader("vue-loader")
    .options({
      // https://vue-loader.vuejs.org/zh/options.html#compileroptions
      compilerOptions: {
        preserveWhitespace: true
      },
      cacheDirectory,
      cacheIdentifier: finalCacheIdentifier
    });
}

const vueRule = config.module.rule("vue").test(/\.vue$/);

applyVuePipeline(vueRule);

const mdRule = config.module.rule("markdown").test(/\.md$/);

applyVuePipeline(mdRule);
```

cacheDirectory 和 cacheIdentifier 是 cacheloader 定义的配置，为了加快加载速度。这里只把 vue 文件和 md 文件作为 cache-loader 和 vue-loader 的目标文件，[vue-loader](https://vue-loader.vuejs.org/zh/options.html#cachedirectory-cacheidentifier)这里自带 cache 属性大概就是为了和 cache-loader 一起使用的。[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)也做了配置。而其他的 loader 是无法做到和 cache 一起用的，所以能 cache 的只有 vue 相关的代码。有 vue 的代码就是 md 文件和 vue 后缀的文件。

cacheDirectory:/Users/~/vuepress-analysis/node_modules/@vuepress/core/node_modules/.cache/vuepress

### markdown-loader

```js
mdRule
  .use("markdown-loader")
  .loader(require.resolve("@vuepress/markdown-loader"))
  .options({ sourceDir, markdown });
```

后面还引入了 markdown-loader，结合最早之前的 createMarkdown 生成的 markdown 配置

:::tip
还有些 loader 配置，就不写了，比如 svg，image，url 等
:::

### style 相关的 loader

```js
# 这个isServer一直都是false估计是bug
if (!isServer) {
  if (isProd) {
    rule.use("extract-css-loader").loader(CSSExtractPlugin.loader);
  } else {
    rule.use("vue-style-loader").loader("vue-style-loader");
  }
}
```

dev 模式用 vue-style-loader，build 模式用 extract-css-loader。将多个 js 中的 css 文件合并成一个 css 文件

具体查看官网的[构建流程](https://v1.vuepress.vuejs.org/zh/config/#%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B)

## plugin

### DefinePlugin

```js
// inject constants
config.plugin("injections").use(require("webpack/lib/DefinePlugin"), [
  {
    VUEPRESS_VERSION: JSON.stringify(require("../../../package.json").version),
    VUEPRESS_TEMP_PATH: JSON.stringify(tempPath),
    LAST_COMMIT_HASH: JSON.stringify(getLastCommitHash())
  }
]);
```
