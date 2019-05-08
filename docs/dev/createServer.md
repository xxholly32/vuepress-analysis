# createServer

```js
createServer () {
  const contentBase = path.resolve(this.context.sourceDir, '.vuepress/public')

  const serverConfig = Object.assign(
    {
      disableHostCheck: true,
      compress: true,
      clientLogLevel: 'error',
      hot: true,
      quiet: true,
      headers: {
        'access-control-allow-origin': '*'
      },
      open: this.context.options.open,
      publicPath: this.context.base,
      watchOptions: {
        ignored: [/node_modules/, `!${this.context.tempPath}/**`]
      },
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [
          { from: /./, to: path.posix.join(this.context.base, 'index.html') }
        ]
      },
      overlay: false,
      host: this.host,
      contentBase,
      before: (app, server) => {
        if (fs.existsSync(contentBase)) {
          app.use(this.context.base, require('express').static(contentBase))
        }

        this.context.pluginAPI.applySyncOption('beforeDevServer', app, server)
      },
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
