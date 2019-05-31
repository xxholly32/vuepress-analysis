# createMarkdown 解析

## markdown-it

markdown-it 辅助 markdown 的库，和 es 类似，将 md 文件的语言转化成 html 的语言，比如

```
# hello-world or

md.render('# markdown-it rulezz!');

# result
# <h1>hello world</h1>
```

这个逻辑和 es/tslint 一样，都有各自的规则，只不过 es/tslint 是将 es/ts 语言转化成 js，根据规则可以生产对应的 html 文件

markdown-it 的文档理解起来会比较费劲，虽然已经有大神做了[整体翻译](https://markdown-it.docschina.org)，但还是无法理解的很全。一开始看 markdown 的同学可以看下相关的源码[解读文件](https://www.jianshu.com/p/a2c7cd1cabc7)

### 测试代码反推实现

下面我列举一下 vuepress 的一些实现，但实现代码我粗略看了下，过于复杂，就不细分析了，只是说下做了哪些功能和一些实现精髓，具体功能可以用测试代码来反推实现。

用测试反推实现是另一种理解 api 的方法，而且非常好用，你不用去了解代码，你会直接知道是怎么实现的，具体我们可以参考[sorrycc 的分享 通过写测试用例学习前端知识](https://www.bilibili.com/video/av44802599)

我们这里可以直接参考[相关用例](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/markdown/__tests__/__snapshots__/highlight.spec.js.snap)结合测试一起看实现

## 代码高亮

```js
new Vue()

# 输出

exports[`highlight should highlight code 1`] = `

<pre v-pre class="language-js">
<code>
<span class="token keyword">new</span>
<span class="token class-name">Vue</span>
<span class="token punctuation">(</span>
<span class="token punctuation">)</span>
</code>
</pre>

```

代码高亮 这里用的是 `prismjs`， markdown-it 官方推荐的是 `highlight.js`

## 识别 vue 标签插件

重写官方 html_block 方法

这个插件是重写了官方的 [html_block](https://github.com/markdown-it/markdown-it/blob/1ad3aec2041cd2defa7e299543cc1e42184b680d/lib/rules_block/html_block.js) 插件，不同的是以下 2 行代码

```js
const HTML_SEQUENCES = [
  [/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true],
  [/^<!--/, /-->/, true],
  [/^<\?/, /\?>/, true],
  [/^<![A-Z]/, />/, true],
  [/^<!\[CDATA\[/, /\]\]>/, true],
  // PascalCase Components
  [/^<[A-Z]/, />/, true],
  // custom elements with hyphens
  [/^<\w+\-/, />/, true],
  [
    new RegExp("^</?(" + blockNames.join("|") + ")(?=(\\s|/?>|$))", "i"),
    /^$/,
    true
  ],
  [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
];
```

[PascalCase Components 帕斯卡](https://baike.baidu.com/item/%E5%B8%95%E6%96%AF%E5%8D%A1%E5%91%BD%E5%90%8D%E6%B3%95/9464494?fr=aladdin)写法，和标准带连接符的控件；

## 代码行高亮

对以后的 highlight 中对指定行进行高亮，[官方章节](https://v1.vuepress.vuejs.org/zh/guide/markdown.html#%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%AD%E7%9A%84%E8%A1%8C%E9%AB%98%E4%BA%AE)

```js
js {1-2,4-5}
const app = new Vue({
  render,
  router
})

app.$mount('#app')

# 输出

exports[`highlightLines highlight multiple lines 1`] = `
<div class="highlight-lines">
  <div class="highlighted">&nbsp;</div>
  <div class="highlighted">&nbsp;</div><br>
  <div class="highlighted">&nbsp;</div>
  <div class="highlighted">&nbsp;</div><br><br>
</div>const app = new Vue({
render,
router
})

app.$mount('#app')
`;
```

这边有 3 个 br，4 个 div，div 就是高亮的代码 br 就是空出来的代码；其实会多套一层 html 元素

## 预加载容器

这块官方并没有文档，对于不同语言的文件外层会包一层 `<div class="language-${type} extra-class"></div>`可以用来区分样式的不同

## 导入代码片段功能

从文件中读取代码片段，支持本地文件上传，[官方使用说明](https://v1.vuepress.vuejs.org/zh/guide/markdown.html#%E5%AF%BC%E5%85%A5%E4%BB%A3%E7%A0%81%E6%AE%B5)

具体实现其实就是导入文件中的内容在进行操作，因为 markdown-it 不是支持异步的，但 fs.readFileSync 居然读文件是有同步的方法。

## 链接解析

链接解析官方[文档](https://v1.vuepress.vuejs.org/zh/guide/markdown.html#%E5%86%85%E9%83%A8%E9%93%BE%E6%8E%A5)

外联的链接都带上 `<OutboundLink />`

内联的文件关联单元测试表

```js
const internalLinkAsserts = {
  // START abosolute path usage
  "/": "/",

  "/foo/": "/foo/",
  "/foo/#hash": "/foo/#hash",

  "/foo/two.md": "/foo/two.html",
  "/foo/two.html": "/foo/two.html",
  // END abosolute path usage

  // START relative path usage
  "README.md": "./",
  "./README.md": "./",

  "index.md": "./",
  "./index.md": "./",

  "one.md": "./one.html",
  "./one.md": "./one.html",

  "foo/README.md": "./foo/",
  "./foo/README.md": "./foo/",

  "foo/README.md#hash": "./foo/#hash",
  "./foo/README.md#hash": "./foo/#hash",

  "../README.md": "./../",
  "../README.md#hash": "./../#hash",

  "../foo.md": "./../foo.html",
  "../foo.md#hash": "./../foo.html#hash",

  "../foo/one.md": "./../foo/one.html",
  "../foo/one.md#hash": "./../foo/one.html#hash"
  // END relative path usage
};
```

对于以前的用法内联 md 的 hash 特殊处理一开始还是不知道的

## hoist 解析文档中的语言标签

这个内部变量是解析 script 和 style 并从文档中分离的。看下测试代码

```js
test("Should miss script and style when using hoist", () => {
  const input = getFragment(__dirname, "hoist.md");
  const { html, data } = mdH.render(input);
  expect(html).toMatchSnapshot();
  expect(data).toMatchSnapshot();
});

# 输出
exports[`hoist Should miss script and style when using hoist 1`] = `
<h1>H1</h1>
<h2>H2</h2>
`;

exports[`hoist Should miss script and style when using hoist 2`] = `
Object {
  "__data_block": Object {},
  "hoistedTags": Array [
    <script src="vue.js"></script>,
    <style>
  .vue {
    font-size: 16px;
  }
</style>,
  ],
}
`;
```

md 的 html_block 功能只能返回最终展示的 html，但 md.\$data 支持将 script 和 style 代码数据储存到实例中，供后续使用。

## markdown-it-emoji

emoji 图标生成[markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)，emoji 配置相关 [json 文件](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)

## markdown-it-anchor

标签生成 header-anchor 链接，用的是 markdown 的插件 [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor/blob/master/index.js)

## markdown-it-table-of-contents

[toc 目录](https://v1.vuepress.vuejs.org/zh/guide/markdown.html#%E7%9B%AE%E5%BD%95) 功能参考的是一个 markdown-it 插件，[markdown-it-table-of-contents](https://github.com/Oktavilla/markdown-it-table-of-contents/blob/master/index.js)

这个对于单 markdown 的长文件来说以前比如用马克飞象的时候是挺好用的，但在 vuepress 可以用多 markdown 文件个人感觉还是比较累赘的。因为原生的路由已经实现的减少又长又臭的 markdown 文件。

## 总结

作者在这里提炼了`markdown-it-chain`类似`webpack-chain`功能的插件，并提炼出来供项目使用，相关`markdown-it-xxx`的插件也可以根据相关配置串联并组合成一个`chain`，不得不说`chain`配置真的是个好东西；

> 说明，createMarkdown 最终返回的是`markdown-it`实例

- TODO：
  - 实现一个 markdown-it 插件
