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

这里有 3 个文件 createBaseConfig , createClientConfig , createServerConfig 后面 2 个都继承与 base, 在 dev 调用了 createClientConfig， 在 build 的时候调用 createServerConfig 。

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

::: tip
后续的 client 源码中经常会出现@的引用
:::

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

cacheDirectory 和 cacheIdentifier 是 cacheloader 定义的配置，为了加快加载速度。这里只把 vue 文件和 md 文件作为 cache-loader 和 vue-loader 的目标文件，[vue-loader](https://vue-loader.vuejs.org/zh/options.html#cachedirectory-cacheidentifier)、[cache-loader](https://www.webpackjs.com/loaders/cache-loader/)这边统一做了对 vue 和 md 文件的解析。

::: tip
cacheDirectory:/Users/~/vuepress-analysis/node_modules/@vuepress/core/node_modules/.cache/vuepress
:::

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

dev 模式用 vue-style-loader，build 模式用 extract-css-loader，将多个 js 中的 css 文件合并成一个 css 文件

具体查看官网的[构建流程](https://v1.vuepress.vuejs.org/zh/config/#%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B)

## 其他 wepback plugin

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

常亮定义，`VUEPRESS_TEMP_PATH`这 2 个文件还有点用，是取 temp 文件路径，其他 2 个基本没什么用挂在在 windows 下面

### hmr

```js
config.plugin("hmr").use(require("webpack/lib/HotModuleReplacementPlugin"));
```

dev 的开发环境特有，用于热替换

### html-webpack-plugin

```js
config
  .plugin("html")
  // using a fork of html-webpack-plugin to avoid it requiring webpack
  // internals from an incompatible version.
  .use(require("vuepress-html-webpack-plugin"), [
    {
      template: this.context.devTemplate
    }
  ]);
```

dev 开发环境特有，默认生成 html 模板文件

### HeadPlugin

dev 开发环境特有，用于修改 tag 标签数据

## dev 配置

```js
config.entry("app").add(ctx.getLibFilePath("client/clientEntry.js"));
```

配置所有文件的入口，实例化 vue 的地方，和 vue-cli 的 main.js 比较像

## 总结

webpack 做的主要的几件事情

- 配置@alias，配合后续的 aliasoption 共同使用
- vue、md、css 等解析 loader 引入
- 其他一些 webpack 插件以及 chainwebpack

其实和 vue-cli 的内容差不多，只是分布的比较散，配置比较灵活；其实 vuepress 的 plugin 和 webpack 的 plugin 非常类似。这里的配置流程就是我们用 vuepress 的配置流程
