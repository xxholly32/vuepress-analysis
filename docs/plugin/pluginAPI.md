# plugin

[插件](https://v1.vuepress.vuejs.org/zh/plugin/)，在不看源码只看功能，我的理解是做一些配置，加入一些`UI`等功能。但代码中巧妙的将所有的功能都做成了插件，有些只是内部插件，看起来是 vuepress 一体的，但内部还是通过引入插件的方式去完成的。官方也有附图去说明了一些现有的插件功能。

比较精髓的点在于在这个`webpack-dev-server`中找到了切入的点，那些可植入的点，比如`chainWebpack`, `beforeDevServer`。还有那些可以被切入的点，`vuepress` 特有的，比如 `globalUIComponents`, `additionalPages`，还有一些页面全局页面或者启动前后功能添加。

插件无法初始化 2 次，因为有些在启动的时候就会被纳入到 `webpack` 或者页面路由配置中去。插件基本分 2 部分，1 部分是配置文件到.`temp` 文件中，这部分是异步的，还有部分同步的是直接修改 `webpack` 的配置。最终在 `webpack` 启动前全部完成配置。

## 流程解读

- `initializeOptions` 初始化系统插件配置
- `use` 官方插件导入
- `useByPluginsConfig` 初始化用户插件配置引入以及 `use` 导入个人插件 (包含 `theme`)
- `_pluginQuene` 初始化插件池中的插件
- `apply` 注册插件，将 keyvalue 做整合
- `applySyncOption` 和 `applyAsyncOption` 最终完成功能

## plugin-api 包的设计

<!-- TODO:看下hook如何实现的 -->

分这么几种类型基础的 2 种 `Option` 和 `AsyncOption`, 一个是普通一个是需要异步的, 就像上面说的， `webpack` 配置一般用同步，有些文件处理用异步的，按照作用类型分，也是分 2 中一种是纯 `option` 还有一种是 `hook` ，我暂时还没研究出 `hook` 是如何实现的。

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

其实所有的都是继承与 Option 这个类，`async` 也是

```js
Option.prototype.apply = Option.prototype.syncApply;
AsyncOption.prototype.apply = AsyncOption.prototype.asyncApply;
```

这里的 `syncApply` 和 `asyncApply` 方法一模一样只是方法前面有没有 `async`

调用方式也是一模一样

```js
// async applyAsyncOption(name, ...args)
applySyncOption(name, ...args) {
    logger.debug("applySyncOption: " + name);
    this.getOption(name).apply(...args);
    return this;
  }
```

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

其他的继承与 `option` 的 5 个插件单独开了章节说明了下具体的内容，具体见后面章节。
