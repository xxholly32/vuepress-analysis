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

vuepress 一般常用的就是 dev 和 build
