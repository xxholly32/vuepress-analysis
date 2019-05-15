# AliasOption

```js
module.exports = class AliasOption extends Option {
  apply(config) {
    super.syncApply();
    const aliases = this.appliedValues;
    aliases.forEach(alias => {
      Object.keys(alias).forEach(key => {
        config.resolve.alias.set(key, alias[key]);
      });
    });
  }
};
```

`AliasOption` 主要用于处理引入的别名 具体参考[webpack alias 章节](https://webpack.docschina.org/configuration/resolve/#resolve-alias), 以下是本项目中的一些输出

```js
key:@transform
key:@AlgoliaSearchBox
key:@SearchBox
key:@current-theme
key:@theme/components/AlgoliaSearchBox.vue
key:@theme/components/DropdownLink.vue
key:@theme/components/DropdownTransition.vue
key:@theme/components/Home.vue
key:@theme/components/NavLink.vue
key:@theme/components/NavLinks.vue
key:@theme/components/Navbar.vue
key:@theme/components/Page.vue
key:@theme/components/Sidebar.vue
key:@theme/components/SidebarButton.vue
key:@theme/components/SidebarGroup.vue
key:@theme/components/SidebarLink.vue
key:@theme/components/SidebarLinks.vue
key:@theme/layouts/404.vue
key:@theme/layouts/Layout.vue
key:@theme
```
