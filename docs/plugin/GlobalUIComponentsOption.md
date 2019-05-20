# GlobalUIComponentsOption

插入到全局的`ui`

```js
module.exports = class GlobalUIComponentsOption extends Option {
  async apply(ctx) {
    await ctx.writeTemp(
      `internal/global-ui.js`,
      `export default ${JSON.stringify(this.values, null, 2)}`
    );
  }
};
```

参考`backtotop`的实现可以理解的更加透彻

```js
enhanceAppFiles: [
  path.resolve(__dirname, 'enhanceAppFile.js')
],

globalUIComponents: 'BackToTop'
```

`enhanceAppFile.js`

```js
import BackToTop from "./BackToTop.vue";

export default ({ Vue }) => {
  Vue.component("BackToTop", BackToTop);
};
```
