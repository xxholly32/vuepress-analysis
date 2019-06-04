# createServer

```js
createServer () {
  const contentBase = path.resolve(this.context.sourceDir, '.vuepress/public')

  const serverConfig = Object.assign(
    {
      // 去除dns劫持
      disableHostCheck: true,
      // 采用gzip进行压缩
      compress: true,
      // 日志等级默认是none这里是error，有错误则抛出提示
      clientLogLevel: 'error',
      // 热加载
      hot: true,
      // 错误的信息都会在console中
      quiet: true,
      // 统一设置头部信息
      headers: {
        'access-control-allow-origin': '*'
      },
      // 是否打开浏览器
      open: this.context.options.open,
      // 静态资源路径
      publicPath: this.context.base,
      // ignore部分文件的改变情况，包含node_modules和temppath
      watchOptions: {
        ignored: [/node_modules/, `!${this.context.tempPath}/**`]
      },
      // 任何404的请求都会返回index.html https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /./, to: path.posix.join(this.context.base, 'index.html') }
        ]
      },
      // 编译错误的提示方案
      overlay: false,
      // 域名
      host: this.host,
      // 配置静态文件放置位置
      contentBase,
      // 服务启动前
      before: (app, server) => {
        if (fs.existsSync(contentBase)) {
          app.use(this.context.base, require('express').static(contentBase))
        }

        this.context.pluginAPI.applySyncOption('beforeDevServer', app, server)
      },
      // 服务启动后
      after: (app, server) => {
        this.context.pluginAPI.applySyncOption('afterDevServer', app, server)
      }
    },
    this.context.siteConfig.devServer || {}
  )

  WebpackDevServer.addDevServerEntrypoints(this.webpackConfig, serverConfig)

  const compiler = webpack(this.webpackConfig)
  this.server = new WebpackDevServer(compiler, serverConfig)
  return this
}

```

## before after server
