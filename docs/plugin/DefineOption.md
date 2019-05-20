# DefineOption

`DefineOption` 主要用于定义构建时的全局变量 具体参考 [webpack DefinePlugin 章节](https://webpack.docschina.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx)

```js
module.exports = class DefineOption extends Option {
  apply(config) {
    super.syncApply();
    const defines = this.appliedValues;
    defines.forEach(define => {
      Object.keys(define).forEach(key => {
        define[key] = JSON.stringify(define[key]);
      });
      config
        .plugin("injections")
        .tap(([options]) => [Object.assign(options, define)]);
    });
  }
};
```
