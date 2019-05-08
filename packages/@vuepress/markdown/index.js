'use strict'

/**
 * Module dependencies.
 */

const Config = require('markdown-it-chain')
const LRUCache = require('lru-cache')
const highlight = require('./lib/highlight')
const { PLUGINS, REQUIRED_PLUGINS } = require('./lib/constant')
const highlightLinesPlugin = require('./lib/highlightLines')
const preWrapperPlugin = require('./lib/preWrapper')
const lineNumbersPlugin = require('./lib/lineNumbers')
const componentPlugin = require('./lib/component')
const hoistScriptStylePlugin = require('./lib/hoist')
const convertRouterLinkPlugin = require('./lib/link')
const snippetPlugin = require('./lib/snippet')
const tocPlugin = require('./lib/tableOfContents')
const emojiPlugin = require('markdown-it-emoji')
const anchorPlugin = require('markdown-it-anchor')
const {
  slugify: _slugify,
  logger,
  chalk,
  hash,
  normalizeConfig,
  moduleResolver: { getMarkdownItResolver }
} = require('@vuepress/shared-utils')

/**
 * Create markdown by config.
 */

module.exports = (markdown = {}) => {
  const {
    externalLinks,
    anchor,
    toc,
    plugins,
    lineNumbers,
    beforeInstantiate,
    afterInstantiate
  } = markdown

  //  默认生成以markdown-it开头的 ModuleResolver 实例
  const resolver = getMarkdownItResolver()

  // allow user config slugify
  // 默认会去掉一些特殊字符
  const slugify = markdown.slugify || _slugify

  // using chainedAPI
  // 开始markdown-chain-it的API，这里名字可以改一下，config不太好理解
  const config = new Config()

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
          target: '_blank',
          rel: 'noopener noreferrer'
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
          permalinkSymbol: '#'
        },
        anchor
      )
    ])
    .end()

    .plugin(PLUGINS.TOC)
    .use(tocPlugin, [toc])
    .end()

  // 是否显示代码行号
  if (lineNumbers) {
    config.plugin(PLUGINS.LINE_NUMBERS).use(lineNumbersPlugin)
  }

  // 采用markdown-it-chain，用户可以再次修改内部配置，比较解耦
  beforeInstantiate && beforeInstantiate(config)

  // 使用markdown-it-chain.toMd
  const md = config.toMd(require('markdown-it'), markdown)

  // 解析用户自定义插件集
  const pluginsConfig = normalizeConfig(plugins || [])
  pluginsConfig.forEach(([pluginRaw, pluginOptions]) => {
    const plugin = resolver.resolve(pluginRaw)
    if (plugin.entry) {
      md.use(plugin.entry, pluginOptions)
    } else {
      // TODO: error handling
    }
  })

  // 在做一次插件配置的整合，TODO:思考：是否beforeInstantiate那层可以去掉
  afterInstantiate && afterInstantiate(md)

  // override parse to allow cache
  // 采用一种缓存机制，不是很看得懂 TODO:
  const parse = md.parse
  const cache = new LRUCache({ max: 1000 })
  md.parse = (src, env) => {
    const key = hash(src + env.relativePath)
    const cached = cache.get(key)
    if (cached) {
      return cached
    } else {
      const tokens = parse.call(md, src, env)
      cache.set(key, tokens)
      return tokens
    }
  }

  // 重写了md的render方法，返回对应的数据，用以不明
  module.exports.dataReturnable(md)

  // expose slugify
  md.slugify = slugify

  return md
}

module.exports.dataReturnable = function dataReturnable (md) {
  // override render to allow custom plugins return data
  const render = md.render
  md.render = (...args) => {
    md.$data = {}
    md.$data.__data_block = {}
    md.$dataBlock = md.$data.__data_block
    const html = render.call(md, ...args)
    return {
      html,
      data: md.$data,
      dataBlockString: toDataBlockString(md.$dataBlock)
    }
  }
}

function toDataBlockString (ob) {
  if (Object.keys(ob).length === 0) {
    return ''
  }
  return `<data>${JSON.stringify(ob)}</data>`
}

function isRequiredPlugin (plugin) {
  return REQUIRED_PLUGINS.includes(plugin)
}

function removePlugin (config, plugin) {
  logger.debug(
    `Built-in markdown-it plugin ${chalk.green(plugin)} was removed.`
  )
  config.plugins.delete(plugin)
}

function removeAllBuiltInPlugins (config) {
  Object.keys(PLUGINS).forEach(key => {
    if (!isRequiredPlugin(PLUGINS[key])) {
      removePlugin(config, PLUGINS[key])
    }
  })
}

module.exports.isRequiredPlugin = isRequiredPlugin
module.exports.removePlugin = removePlugin
module.exports.removeAllBuiltInPlugins = removeAllBuiltInPlugins
module.exports.PLUGINS = PLUGINS
