# cli 指令

## vuepress -h

vuepress 的指令只有 3 个

```js
Usage:
  $ vuepress <command> [options]

Commands:
  dev [targetDir]    start development server
  build [targetDir]  build dir as static site
  eject [targetDir]  copy the default theme into .vuepress/theme for customization.

For more info, run any command with the `--help` flag:
  $ vuepress dev --help
  $ vuepress build --help
  $ vuepress eject --help

Options:
  -v, --version  Display version number
  -h, --help     Display this message
```

`cli` 指令采用的是 `cac` 的语法, `vue-cli` 采用的是 `commander`, 不知道为什么，咱也不敢问...

还有一点不同的是 `lerna` 包，`vuepress` 是单独搞了个入口 vue-cli 直接用 @vue/cli，如果不开这个 vuepres 的话 安装可能要 `@vuepress/core`。放到一起是否会好一些？

```js
CLI({
  async beforeParse(cli) {
    const pkg = require("@vuepress/core/package.json");
    // 校验nodejs环境是否符合 采用 node-semver
    checkEnv(pkg);
    // 命令注册
    // cli = CAC（）
    // vue-cli用 commander
    // const OPTIONS = { theme: '@vuepress/default' }
    registerCoreCommands(cli, OPTIONS);
    // Expose handleUnknownCommand function
    // TODO: need study
    await handleUnknownCommand(cli, OPTIONS);
    // 执行 cac 的 version 和 help 功能
    cli.version(pkg.version).help();
  },

  async afterParse(cli) {
    if (!process.argv.slice(2).length) {
      // 输出cac的help
      cli.outputHelp();
    }
  }
});

async function CLI({ beforeParse, afterParse }) {
  const cli = CAC();
  beforeParse && (await beforeParse(cli));
  cli.parse(process.argv);
  afterParse && (await afterParse(cli));
}
```

单独的 vuepress 文件中将命令在做了一次预处理
