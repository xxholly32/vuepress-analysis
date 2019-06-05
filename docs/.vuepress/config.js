module.exports = {
  title: "vuepress-analysis",
  description: "let`s play vuepress",
  base: "/vuepress-analysis/",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "plugin",
        link: "/plugin/pluginAPI"
      },
      {
        text: "Github",
        link: "https://github.com/xxholly32/vuepress-analysis"
      }
    ],
    sidebar: {
      "/plugin/": [
        {
          title: "插件系统分析",
          path: "/plugin/",
          collapsable: false,
          children: ["/plugin/pluginAPI"]
        },
        {
          title: "插件扩展类型",
          path: "/plugin/",
          collapsable: false,
          children: [
            "/plugin/AliasOption",
            "/plugin/DefineOption",
            "/plugin/ClientDynamicModulesOption",
            "/plugin/EnhanceAppFilesOptions",
            "/plugin/GlobalUIComponentsOption"
          ]
        },
        {
          title: "内置插件",
          path: "/plugin/",
          collapsable: false,
          children: ["/plugin/internal-layout-components"]
        }
      ],

      "/": [
        {
          title: "开始",
          collapsable: false,
          children: ["/main/start/cli", "/main/start/require"]
        },
        {
          title: "cli 命令",
          collapsable: false,
          children: ["/main/cli/start", "/main/cli/dev"]
        },
        {
          title: "markdown 解析",
          collapsable: false,
          children: ["/main/markdown/createMarkdown"]
        },
        {
          title: "pages 解析",
          collapsable: false,
          children: ["/main/pages/resolvePages", "/main/pages/internal-routes"]
        },
        {
          title: "webpack 配置解析",
          collapsable: false,
          children: [
            "/main/webpack/configAnalysis",
            "/main/webpack/createServer",
            "/main/webpack/webpackconfig"
          ]
        }
      ]
    }
  }
};
