# dev 命令解析

## 主流程

```js
function createApp(options) {
  logger.wait("Extracting site metadata...");
  return new App(options);
}

async function dev(options) {
  const app = createApp(options);
  await app.process();
  return app.dev();
}
```

简单来说就是根据配置创建 app 实例，完成 app 的解析，最后 dev 执行 webpack

## new App

```js
constructor (options = {}) {
    this.options = options
    this.sourceDir = this.options.sourceDir || path.join(__dirname, 'docs.fallback')
    // debug sourceDir /Users/**/Documents/work/workspace/vuepress-analysis/docs
    logger.debug('sourceDir', this.sourceDir)

    // debug Temp directory: repp.../node_modules/@vuepress/core/.temp
    // writeTemp 是个写文件fn, 中间做了缓存判断
    const { tempPath, writeTemp } = createTemp(options.temp)
    this.tempPath = tempPath
    this.writeTemp = writeTemp

    this.vuepressDir = path.resolve(this.sourceDir, '.vuepress')
    this.libDir = path.join(__dirname, '../')
}

```

这里主要做了基础文件路径的配置, 并定义了`.temp` 的位置

## app.process()

```js
async process () {
    // 相关属性初始化
    // this.siteConfig = {
    //   "title": "...",
    //   "description": "...",
    //   "base": "...",
    //   "themeConfig": {
    //     ...
    //   }
    // }
    this.resolveConfigAndInitialize()
    // 注入head的url标签配置
    this.normalizeHeadTagUrls()

    // 读取theme 默认读取 repo/node_modules/@vuepress/theme-default
    this.themeAPI = loadTheme(this)

    // 验证一遍模板文件是否存在
    // debug SSR Template File: repo/node_modules/@vuepress/core/lib/client/index.ssr.html
    // debug DEV Template File: repo/vuepress-analysis/node_modules/@vuepress/core/lib/client/index.dev.html
    this.resolveTemplates()
    // 验证一遍全局的layout文件是否存在
    // debug globalLayout: repo/node_modules/@vuepress/core/lib/client/components/GlobalLayout.vue
    this.resolveGlobalLayout()

    // 配置内容插件
    this.applyInternalPlugins()
    // 配置用户插件
    this.applyUserPlugins()
    // 插件初始化 整理好加入到pluginApi的options中
    this.pluginAPI.initialize()

    // 采用了markdown-it和markdown-it-chain 返回markdown实例，单独有createMarkdown章节
    this.markdown = createMarkdown(this)

    // 详见pages章节
    await this.resolvePages()

    // 运行所有的默认plugin
    await this.pluginAPI.applyAsyncOption('additionalPages', this)
    await Promise.all(
      this.pluginAPI
        .getOption('additionalPages')
        .appliedValues.map(async options => {
          await this.addPage(options)
        })
    )
    await this.pluginAPI.applyAsyncOption('ready')
    await Promise.all([
      this.pluginAPI.applyAsyncOption('clientDynamicModules', this),
      this.pluginAPI.applyAsyncOption('enhanceAppFiles', this),
      this.pluginAPI.applyAsyncOption('globalUIComponents', this)
    ])
  }
```

插件的管理，pages 页面生成，创建 markdown 预设，最后逐渐开始执行插件

插件

## app.dev()

```js
async dev () {
    this.isProd = false
    // TODO: 详细分析DevProess
    this.devProcess = new DevProcess(this)
    // 执行dev过程
    await this.devProcess.process()
    // 如果存在文件改动，则运行createServer
    // TODO: 这里的filechange机制有点搞不懂
    const error = await new Promise(resolve => {
      try {
        this.devProcess
          .on('fileChanged', ({ type, target }) => {
            console.log(
              `Reload due to ${chalk.red(type)} ${chalk.cyan(
                path.relative(this.sourceDir, target)
              )}`
            )
            this.process()
          })
          // 配置完成之后 createServer，启动项目
          .createServer()
          .listen(resolve)
      } catch (err) {
        resolve(err)
      }
    })
    if (error) {
      throw error
    }
    return this
  }
```

这块逻辑主要是 webpack 的所有配置的生成，并执行 webpack-dev-server
