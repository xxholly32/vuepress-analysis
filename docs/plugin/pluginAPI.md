# pluginAPI 解读

## 生命周期

在 `app.process()` 中的 `resolveConfigAndInitialize()` 中初始化了 new pluginAPI 并付给 `this.pluginAPI`. 然后在 `applyInternalPlugins()` 中的引入了所有内置的 `api` 和 `applyUserPlugins()` 中加载用户引入的 `plugin`. 最近初始化插件 `pluginAPI.initialize()`

初始化将所有参数注册进去 [option api](https://v1.vuepress.vuejs.org/zh/plugin/option-api.html)

## pligin-api 包的设计

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

分这么几种类型基础的 2 种 Option 和 AsyncOption, 一个是普通一个是需要异步的, 其他 5 种功能介绍一下

<!-- TODO: 写完 -->
