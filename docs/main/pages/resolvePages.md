# resolvePages 解析

## pages 文件获取

```js
async resolvePages () {
  // resolve pageFiles
  // 把所有的md和vue文件提取出来
  const patterns = ['**/*.md', '**/*.vue', '!.vuepress', '!node_modules']
  if (this.siteConfig.dest) {
    // #654 exclude dest folder when dest dir was set in
    // sourceDir but not in '.vuepress'
    const outDirRelative = path.relative(this.sourceDir, this.outDir)
    if (!outDirRelative.includes('..')) {
      patterns.push('!' + outDirRelative)
    }
  }

  const pageFiles = sort(await globby(patterns, { cwd: this.sourceDir }))

  await Promise.all(
    pageFiles.map(async relative => {
      const filePath = path.resolve(this.sourceDir, relative)
      await this.addPage({ filePath, relative })
    })
  )
}
```

先是采用`globby`这个工具包获取在`['**/*.md', '**/*.vue', '!.vuepress', '!node_modules']`下的文件路径，加入到数组 pageFiles 中

## pages 处理解析

```js
async addPage (options) {
  options.permalinkPattern = this.siteConfig.permalink
  const page = new Page(options, this)
  await page.process({
    // 之前createmarkdown返回的markdown-it pares
    markdown: this.markdown,
    // siteconfig 生成的 全局属性类并在此时创建实例，后面存在page的_computed中
    computed: new this.ClientComputedMixinConstructor(),
    // 扩展page对象的实例 https://v1.vuepress.vuejs.org/zh/plugin/option-api.html#extendpagedata
    enhancers: this.pluginAPI.getOption('extendPageData').items
  })
  this.pages.push(page)
}
```

markdown: 是 markdown-chain-it 的配置

computed: page 的整体解析器, 整合全局的 siteData 变量

enhancers: 返回还不是很确定，但 extendPageData 是[\$page 对象的扩展](https://v1.vuepress.vuejs.org/zh/plugin/option-api.html#extendpagedata)，如果不配置就是默认页面的内容。

最终将所有解析完的页面放在 this.pages 下

```js
// 采用gray-matter解析文本
// 对应章节 https://v1.vuepress.vuejs.org/zh/guide/frontmatter.html
const { excerpt, data, content } = parseFrontmatter(this._content);
this._strippedContent = content;
Object.assign(this.frontmatter, data);

// infer title
// 如果有配置就采用配置的,没有就默认用第一个#开头的作为title
const title = inferTitle(this.frontmatter, this._strippedContent);
if (title) {
  this.title = title;
}

// headers
// 将h2和h3的段落提取
const headers = extractHeaders(this._strippedContent, ["h2", "h3"], markdown);
if (headers.length) {
  this.headers = headers;
}
```

process 里面分了每章的段落，将 h2 和 h3 的段落做了提取。
