# dev 命令

首先看下 dev 的命令

```js
const { dev, build, eject } = require("@vuepress/core");

cli
  .command(`dev [targetDir]`, "start development server")
  // -p, --port <port>       使用特定端口，默认8080
  .option("-p, --port <port>", "use specified port (default: 8080)")
  // -t, --temp <temp>       设置存放临时文件目录
  .option("-t, --temp <temp>", "set the directory of the temporary file")
  // -c, --cache [cache]     设置cache目录
  .option("-c, --cache [cache]", "set the directory of cache")
  // --host <host>           设置特定ip，默认0.0.0.0
  .option("--host <host>", "use specified host (default: 0.0.0.0)")
  // --no-cache              在build前清空cache目录
  .option("--no-cache", "clean the cache before build")
  // --no-clear-screen       启动完项目不清除控制台内容
  .option("--no-clear-screen", "do not clear screen when dev server is ready")
  // --debug                 开启debug模式，会输出调试内容
  .option("--debug", "start development server in debug mode")
  // --silent                不输出任何内容
  .option("--silent", "start development server in silent mode")
  // --open                  启动完打开浏览器
  .option("--open", "open browser when ready")
  .action((sourceDir = ".", commandOptions) => {
    const { debug, silent } = commandOptions;

    logger.setOptions({ logLevel: silent ? 1 : debug ? 4 : 3 });
    logger.debug("global_options", options);
    // debug global_options { theme: '@vuepress/default' }
    logger.debug("dev_options", commandOptions);
    // debug dev_options { '--': [], cache: true, 'clear-screen': true, debug: true }
    env.setOptions({ isDebug: debug, isTest: process.env.NODE_ENV === "test" });

    wrapCommand(dev)({
      sourceDir: path.resolve(sourceDir),
      ...options,
      ...commandOptions
    });
  });
```

是否输出到 `.temp` 文件中，如果不设置就默认写在 `node_modules`, 如果你不需要支持 ie 等低浏览器，可以不加；如果在 `node_modules` 里面的文件不会被 webpack 解析，如果需要解析要单独配置 `babel-loader`，特别是拿它来做 UI 库的 api，这块真的是相当的刺激。但好处的话 chrome 下的编译会减少一些。

`wrapCommand(dev)` 最终是运行了 core 中的 dev 方法
