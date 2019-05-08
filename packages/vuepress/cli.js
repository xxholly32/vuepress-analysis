#!/usr/bin/env node

const checkEnv = require('./lib/checkEnv')
const { CLI } = require('./lib/util')
const registerCoreCommands = require('./lib/registerCoreCommands')
const handleUnknownCommand = require('./lib/handleUnknownCommand')

const OPTIONS = {
  theme: '@vuepress/default'
}

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

