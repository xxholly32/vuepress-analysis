# new App(options)

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
