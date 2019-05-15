# app.process()

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
