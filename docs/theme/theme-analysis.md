# 总体分析

主题是 vuepress1.x 中更新最多的部分，因为这块的需求量最大，ulivz 在[第三届 vueconf 中的演讲](https://ulivz.com/2019/06/09/intro-to-vuepress-1-x/#%E4%B8%BB%E9%A2%98)中介绍了主题的一个总体思路，当时听还没有特别大的感觉；在使用过程中是觉得真的方便，不管是创建一个新的主题，还是继承主题上做一些修改，都是那么的轻而易举。特别是[主题继承的理念](https://ulivz.com/2019/06/09/intro-to-vuepress-1-x/#%E4%B8%BB%E9%A2%98%E7%BB%A7%E6%89%BF)，是其中的精华，当然其实只是用到了 webpack 的 alias 原理。

## 主题的大致思路

首先用了 [vuepress-layout-components 插件](/plugin/internal-layout-components.html)，固定了页面只有 404 和 layout，不管如何都是从这 2 个页面中获取

在之前的配置中，通过 ClientComputedMixin 注入到页面中去，使 vue 页面可以获取到 $site 和 $page 的值。最终 theme 通过这些值可以完成不同页面的构建。

## global-layout 和 layout

```js
<template>
  <component :is="layout"/>
</template>

<script>
export default {
  computed: {
    layout () {
      if (this.$page.path) {
        const layout = this.$page.frontmatter.layout
        if (layout && (this.$vuepress.getLayoutAsyncComponent(layout)
          || this.$vuepress.getVueComponent(layout))) {
          return layout
        }
        return 'Layout'
      }
      return 'NotFound'
    }
  }
}
</script>
```

这里是 vuepress/core 中的 GlobalLayout 文件就把页面指向了 Layout 和 NotFound，其他的 vue 的 component 都是基于这 2 个文件扩展的。实际上 GloablLayout、layout、404 都是可以根据 alias 重写的，默认的 layout、404 是在 theme-default 里有。

## 总结

可以从这里看出，真正也是引入了插件的思路，最终在源码中的代码真的不多。而可扩展性让插件有更多的可操作空间。
