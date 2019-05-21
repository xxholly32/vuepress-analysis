module.exports = {
  title: "vuepress-analysis",
  description: "let`s play vuepress",
  base: "/vuepress-analysis/",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "plugin",
        link: "/plugin/"
      },
      {
        text: "Github",
        link: "https://github.com/xxholly32/vuepress-analysis"
      }
    ],
    sidebar: {
      "/": [
        {
          title: "开始",
          collapsable: false,
          children: ["/main/start/cli", "/main/start/require"]
        },
        {
          title: "vuepress dev",
          collapsable: false,
          children: [
            "/main/dev/start",
            "/main/dev/createApp",
            "/main/dev/process",
            "/main/dev/dev",
            "/main/dev/createMarkdown",
            "/main/dev/resolvePages",
            "/main/dev/createServer",
            "/main/dev/webpackconfig"
          ]
        }
      ],
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
      ]
    }
  }
};
