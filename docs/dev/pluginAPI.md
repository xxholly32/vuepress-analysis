# pluginAPI 解读

## 生命周期

在 `app.process()` 中的 `resolveConfigAndInitialize()` 中初始化了 new pluginAPI 并付给 `this.pluginAPI`. 然后在 `applyInternalPlugins()` 中的引入了所有内置的 `api`.
