# webpack 配置

## dev 和 build 的区分

这里有 3 个文件 createBaseConfig , createClientConfig , createServerConfig 后面 2 个都继承与 base, 在 dev 调用了 createClientConfig， 在 build 的时候调用 createServerConfig 。来看看为什么在解释下为什么这么调用

## base config

### 生产环境

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

cacheDirectory 和 cacheIdentifier 是 cacheloader 定义的配置，为了加快加载速度
