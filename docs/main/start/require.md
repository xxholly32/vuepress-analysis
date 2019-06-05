# 相关工具

记录用到的一些库和主要作用

- [cac](https://github.com/cacjs/cac)
  和 commander 类似的命令行工具
- [globby](https://github.com/sindresorhus/globby)
  深入遍历文件夹，并返回文件名
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
  Parse front-matter from a string or file. Fast, reliable and easy to use. Parses YAML front matter by default, but also has support for YAML, JSON, TOML or Coffee Front-Matter, with options to set custom delimiters. Used by metalsmith, assemble, verb and many other projects.
- [Toml](https://github.com/toml-lang/toml)
  最小的标准化语言，这里主要配合`gray-matter`实现解析功能
- [chokidar](https://github.com/paulmillr/chokidar)
  文件监听，如果有改变，抛出事件
- [PrismJS](https://github.com/PrismJS/prism)
  代码高亮，支持多文件多皮肤
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
  一个 webpack 的插件，将多个 js 中的 css 文件合并成一个 css 文件，本项目用于 build 时候的 css 文件抽离
