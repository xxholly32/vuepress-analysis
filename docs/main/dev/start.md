# vuepress dev

```js
cli
  .command(`dev [targetDir]`, "start development server")
  .option("-p, --port <port>", "use specified port (default: 8080)")
  .option("-t, --temp <temp>", "set the directory of the temporary file")
  .option("-c, --cache [cache]", "set the directory of cache")
  .option("--host <host>", "use specified host (default: 0.0.0.0)")
  .option("--no-cache", "clean the cache before build")
  .option("--no-clear-screen", "do not clear screen when dev server is ready")
  .option("--debug", "start development server in debug mode")
  .option("--silent", "start development server in silent mode")
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

```
-p, --port <port>       使用特定端口，默认8080
-t, --temp <temp>       设置存放临时文件目录
-c, --cache [cache]     设置cache目录
--host <host>           设置特定ip，默认0.0.0.0
--no-cache              在build前清空cache目录
--no-clear-screen       启动完项目不清除控制台内容
--debug                 开启debug模式，会输出调试内容
--silent                不输出任何内容
--open                  启动完打开浏览器

```
