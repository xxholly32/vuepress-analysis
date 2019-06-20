# plugin

## 官方理念解读

[插件](https://v1.vuepress.vuejs.org/zh/plugin/)，在不看源码只看功能，我的理解是做一些配置，加入一些`UI`等功能。但代码中巧妙的将所有的功能都做成了插件，有些只是内部插件，看起来是 vuepress 一体的，但内部还是通过引入插件的方式去完成的。官方也有附图去说明了一些现有的插件功能。

首先我们看官方的说明图

![an image](/architecture.png)

插件这边主要拆成 2 部分

- browser
  - user interface 用户特殊页面功能
  - client addons 客户端插件
- nodejs
  - build process 构建配置插件
  - User project 用户配合以及 markdown 文件
  - theme 主题系统

## 所有插件对外接口

插件应该是 vuepress 中最最最最核心的部分，部分核心代码也是插件的形式去做的，来看下 core 中的代码

```
// 所有在plugin的属性名和类型
const PLUGIN_OPTION_META_MAP = {
  // hooks
  READY: { name: 'ready', types: [Function], async: true },
  COMPILED: { name: 'compiled', types: [Function] },
  UPDATED: { name: 'updated', types: [Function] },
  GENERATED: { name: 'generated', types: [Function], async: true },
  // options
  # client Addons
  ENHANCE_APP_FILES: { name: 'enhanceAppFiles', types: [String, Object, Array, Function] },
  CLIENT_ROOT_MIXIN: { name: 'clientRootMixin', types: [String] },
  # build process
  CHAIN_WEBPACK: { name: 'chainWebpack', types: [Function] },
  EXTEND_PAGE_DATA: { name: 'extendPageData', types: [Function] },
  EXTEND_MARKDOWN: { name: 'extendMarkdown', types: [Function] },
  CHAIN_MARKDOWN: { name: 'chainMarkdown', types: [Function] },
  CLIENT_DYNAMIC_MODULES: { name: 'clientDynamicModules', types: [Object, Function] },
  BEFORE_DEV_SERVER: { name: 'beforeDevServer', types: [Function] },
  AFTER_DEV_SERVER: { name: 'afterDevServer', types: [Function] },
  DEFINE: { name: 'define', types: [Function, Object] },
  ALIAS: { name: 'alias', types: [Function, Object] },
  # User project
  ADDITIONAL_PAGES: { name: 'additionalPages', types: [Function, Array], async: true },
  # User interface
  GLOBAL_UI_COMPONENTS: { name: 'globalUIComponents', types: [String, Array] },

  // other
  OUT_FILES: { name: 'outFiles', types: [Object] },
  EXTEND_CLI: { name: 'extendCli', types: [Function] }
}
```

### hook

这边其实还存在一些钩子，在整个系统的关键过程中处理一些特殊用户行为，比如加入 pwa 等了；所以 `type` 都是 function

### theme

皮肤这块构架会相对复杂，没有单独的 theme internal 模块，但单个插件包含各个插件中，可以看下官方的 [theme-default](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/theme-default/index.js)。

## plugin 底层设计

### 对外接口类设计

分这么几种类型基础的 2 种 `Option` 和 `AsyncOption`, 一个是普通一个是需要异步的, 就像上面说的， `webpack` 配置一般用同步，有些文件处理用异步的。

以下是初始化 plugin option 的方法，主要用用 7 中类型

```js
module.exports = function instantiateOption({ name, async }) {
  switch (name) {
    case PLUGIN_OPTION_MAP.ENHANCE_APP_FILES.name:
      return new EnhanceAppFilesOption(name);

    case PLUGIN_OPTION_MAP.CLIENT_DYNAMIC_MODULES.name:
      return new ClientDynamicModulesOption(name);

    case PLUGIN_OPTION_MAP.GLOBAL_UI_COMPONENTS.name:
      return new GlobalUIComponentsOption(name);

    case PLUGIN_OPTION_MAP.DEFINE.name:
      return new DefineOption(name);

    case PLUGIN_OPTION_MAP.ALIAS.name:
      return new AliasOption(name);

    default:
      return async ? new AsyncOption(name) : new Option(name);
  }
};
```

其实所有的都是继承与 Option 这个类，`async` 也是；那么 option 类主要暴露的是什么接口

> option 类暴露接口的一个设计点，部分暴露的是异步，一些是同步的，这边统一暴露成 apply，只是在继承以后再将赋值的暴露给 apply
> `Option.prototype.apply = Option.prototype.syncApply;` and `AsyncOption.prototype.apply = AsyncOption.prototype.asyncApply`

apply 将所有插件和内置插件的参数，方法都整合到一起

```js
syncApply (...args) {
  const rawItems = this.items
  this.items = []
  this.appliedItems = this.items

  for (const { name, value } of rawItems) {
    try {
      this.add(
        name,
        isFunction(value)
          ? value(...args) // async: awati value(...args)
          : value
      )
    } catch (error) {
      logger.error(`${chalk.cyan(name)} apply ${chalk.cyan(this.key)} failed.`)
      throw error
    }
  }

  this.items = rawItems
}

add (name, value) {
  if (Array.isArray(value)) {
    return this.items.push(...value.map(i => ({ value: i, name })))
  }
  this.items.push({ value, name })
}
```

这里设计就有个拆分，用户输入是单个插件，调用多个接口，在用户层面上非常好理解，但项目中是对应多个接口所以实现上做了一层转化；转变为项目中单个接口对应多个插件，储存的是 [{name:"plugin-a",value:any},{name:"plugin-a",value:any} ...]。一点是理解上顺畅，还有一点是解耦，如果 vuepress 在单独出一个接口，并不会影响之前的插件系统。

还有一点设计巧妙的是 ayncApply 只需要改一处地方就生效，而且对外暴露接口都是 plugin.apply。

其他的继承与 `option` 的 5 个插件单独开了章节说明了下具体的内容，具体见后面章节。

<!-- TODO:在看下 add 的方法是怎么实现的 -->

## 总结

插件化是 vuepress 的主要设计理念，在关键模块的关键过程中引入了对应的对外接口，并加入了扩展的设计，并结合内部的 internal-plugin 配置去实现；1.0 也是讲插件系统做深入，把主题和布局抽离出来；还有一个理念是合理的优先级管理，用户的配置会高于默认的配置，
