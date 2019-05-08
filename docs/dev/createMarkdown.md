# createMarkdown

## createMarkdown(markdownconfig)

```js
(markdown = {}) => {
  const {
    externalLinks,
    anchor,
    toc,
    plugins,
    lineNumbers,
    beforeInstantiate,
    afterInstantiate
  } = markdown;

  //  默认生成以markdown-it开头的 ModuleResolver 实例
  const resolver = getMarkdownItResolver();

  // allow user config slugify
  // 默认会去掉一些特殊字符
  const slugify = markdown.slugify || _slugify;

  // using chainedAPI
  // 开始markdown-chain-it的API，这里名字可以改一下，config不太好理解
  const config = new Config();

  // 这里很多都是配置默认作者自己写的插件，用官方的有2个
  // markdown-it-emoji，markdown-it-anchor
  //  TODO: 深入研究
  config.options
    .html(true)
    .highlight(highlight)
    .end()

    .plugin(PLUGINS.COMPONENT)
    .use(componentPlugin)
    .end()

    .plugin(PLUGINS.HIGHLIGHT_LINES)
    .use(highlightLinesPlugin)
    .end()

    .plugin(PLUGINS.PRE_WRAPPER)
    .use(preWrapperPlugin)
    .end()

    .plugin(PLUGINS.SNIPPET)
    .use(snippetPlugin)
    .end()

    .plugin(PLUGINS.CONVERT_ROUTER_LINK)
    .use(convertRouterLinkPlugin, [
      Object.assign(
        {
          target: "_blank",
          rel: "noopener noreferrer"
        },
        externalLinks
      )
    ])
    .end()

    .plugin(PLUGINS.HOIST_SCRIPT_STYLE)
    .use(hoistScriptStylePlugin)
    .end()

    .plugin(PLUGINS.EMOJI)
    .use(emojiPlugin)
    .end()

    .plugin(PLUGINS.ANCHOR)
    .use(anchorPlugin, [
      Object.assign(
        {
          slugify,
          permalink: true,
          permalinkBefore: true,
          permalinkSymbol: "#"
        },
        anchor
      )
    ])
    .end()

    .plugin(PLUGINS.TOC)
    .use(tocPlugin, [toc])
    .end();

  // 是否显示代码行号
  if (lineNumbers) {
    config.plugin(PLUGINS.LINE_NUMBERS).use(lineNumbersPlugin);
  }

  // 采用markdown-it-chain，用户可以再次修改内部配置，比较解耦
  beforeInstantiate && beforeInstantiate(config);

  // 使用markdown-it-chain.toMd
  const md = config.toMd(require("markdown-it"), markdown);

  // 解析用户自定义插件集
  const pluginsConfig = normalizeConfig(plugins || []);
  pluginsConfig.forEach(([pluginRaw, pluginOptions]) => {
    const plugin = resolver.resolve(pluginRaw);
    if (plugin.entry) {
      md.use(plugin.entry, pluginOptions);
    } else {
      // TODO: error handling
    }
  });

  // 在做一次插件配置的整合，TODO:思考：是否beforeInstantiate那层可以去掉
  afterInstantiate && afterInstantiate(md);

  // override parse to allow cache
  // 采用一种缓存机制，不是很看得懂 TODO:
  const parse = md.parse;
  const cache = new LRUCache({ max: 1000 });
  md.parse = (src, env) => {
    const key = hash(src + env.relativePath);
    const cached = cache.get(key);
    if (cached) {
      return cached;
    } else {
      const tokens = parse.call(md, src, env);
      cache.set(key, tokens);
      return tokens;
    }
  };

  // 重写了md的render方法，返回对应的数据，用以不明
  module.exports.dataReturnable(md);

  // expose slugify
  md.slugify = slugify;

  return md;
};
```

作者在这里提炼了`markdown-it-chain`类似`webpack-chain`功能的插件，并提炼出来供项目使用，相关`markdown-it-xxx`的插件也可以根据相关配置串联并组合成一个`chain`，不得不说`chain`配置真的是个好东西；

最终返回的`md`是`markdown-it`实例

:::warning

- 为什么有`beforeInstantiate`和`afterInstantiate`，如果用 chain 的话 after 一次修改不就够了么？
- `md.parse` 的缓存机制是什么用
- 研究除了 chain 以外的其他插件
  :::
