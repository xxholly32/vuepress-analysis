# cli指令

```js
CLI({
  async beforeParse (cli) {
    const pkg = require('@vuepress/core/package.json')
    // 校验nodejs环境是否符合 采用 node-semver
    checkEnv(pkg)
    // 命令注册
    // cli = CAC（）
    // vue-cli用 commander
    // const OPTIONS = { theme: '@vuepress/default' }
    registerCoreCommands(cli, OPTIONS)
    // Expose handleUnknownCommand function
    // TODO: need study
    await handleUnknownCommand(cli, OPTIONS)
    // 执行 cac 的 version 和 help 功能
    cli.version(pkg.version).help()
  },

  async afterParse (cli) {
    if (!process.argv.slice(2).length) {
      // 输出cac的help
      cli.outputHelp()
    }
  }
})

async function CLI ({
  beforeParse,
  afterParse
}) {
  const cli = CAC()
  beforeParse && await beforeParse(cli)
  cli.parse(process.argv)
  afterParse && await afterParse(cli)
}
```