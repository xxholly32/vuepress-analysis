# vuepress-analysis

## 前言

vuepress 首次出现在人们视野中是 [Evan You](https://github.com/yyx990803) 在[VueNYC 中的演讲](https://www.youtube.com/watch?v=lIv1ItUzktc)。它的良好体验使得大家争相涌至，由于十分便于上手，有很多人拿来做 api 文档和 blog 。甚至是 [umi](https://umijs.org/)，[dva](https://dvajs.com/) 这类 react 周边，都在用它来做自己的 api 文档。

除了一句真香以外，我参考了 [vue-cli-analysis](https://kuangpf.com/vue-cli-analysis/), 学习一波并做分析了其实现原理。

我会在分析代码中加入一些官方输出的 debug，和自己的对于一些方法的见解。

> 慎重提醒：我只是粗略的看了代码和流程，并没有完全推敲里面的奥义，所以如果分析不到位，请多多谅解；同时欢迎 pr 和 issues

## 为什么要做这个分析

> "VuePress is much more than that." —— ULIVZ

`vuepress`从一开始使用就觉得它解决了程序员的很多问题，现在个人，公司的 blog，api 文档我几乎都选择了`vuepress`，甚至是公司多个 UI 库的首页都是用的 `vuepress`。都说爱一个人要需要深入了解它的全部。不仅是能够熟练使用，也希望能够理解它的原理，更多的去分析作者为什么会这么写的，这么设计的。

## 相关主题演讲

[Intro to VuePress 1.x](https://ulivz.com/2019/06/09/intro-to-vuepress-1-x/#intro-to-vuepress-1-x)

[VueNYC 中的演讲](https://www.youtube.com/watch?v=lIv1ItUzktc)

## 扩展阅读

[VuePress 1.x 的设计理念](https://v1.vuepress.vuejs.org/zh/miscellaneous/design-concepts.html#vuepress-1-x-%E7%9A%84%E8%AE%BE%E8%AE%A1%E7%90%86%E5%BF%B5)

[深入浅出 vuepress 系列](https://www.jianshu.com/p/c7b2966f9d3c)

## todo list

- app.js 详细分析
- 每次写完都要写总结
- TODO chacklist review
