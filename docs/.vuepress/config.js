module.exports = {
  title: "vuepress-analysis",
  description: "let`s play vuepress",
  base: "/",
  themeConfig: {
    nav: [
      {
        text: "home",
        link: "/"
      }
    ],
    sidebar: [
      ["/", "前言"],
      {
        title: "开始",
        path: "/start/",
        collapsable: false,
        children: ["/start/env", "/start/cli"]
      },
      {
        title: "vuepress dev",
        path: "/dev/",
        collapsable: false,
        children: [
          "/dev/start",
          "/dev/createApp",
          "/dev/process",
          "/dev/dev",
          "/dev/createMarkdown",
          "/dev/resolvePages",
          "/dev/createServer",
          "/dev/webpackconfig"
        ]
      }
    ]
  }
};
