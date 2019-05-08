# app.dev()

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
