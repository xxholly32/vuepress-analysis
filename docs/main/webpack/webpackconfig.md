# webpackconfig

前面还有部分乱码，截不全，这里是 webpack 配置的一些输出

```js
/* config.module.rule('pug') */
      {
        test: /\.pug$/,
        use: [
          /* config.module.rule('pug').use('pug-plain-loader') */
          {
            loader: 'pug-plain-loader'
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.js$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('js').use('cache-loader') */
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/node_modules/.cache/vuepress',
              cacheIdentifier: '{"vuepress":"1.0.0-alpha.47","cache-loader":"1.2.5","vue-loader":"1.2.5","isProd":false,"config":""}isServer:undefined'
            }
          },
          /* config.module.rule('js').use('babel-loader') */
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              presets: [
                '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vue/babel-preset-app/index.js'
              ]
            }
          }
        ]
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        use: [
          /* config.module.rule('images').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          /* config.module.rule('svg').use('file-loader') */
          {
            loader: 'file-loader',
            options: {
              name: 'assets/img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          /* config.module.rule('media').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/media/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          /* config.module.rule('fonts').use('url-loader') */
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/fonts/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').oneOf('modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('css').oneOf('modules').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('css').oneOf('modules').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('css').oneOf('modules').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal') */
          {
            use: [
              /* config.module.rule('css').oneOf('normal').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('css').oneOf('normal').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').oneOf('modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('postcss').oneOf('modules').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('postcss').oneOf('modules').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('postcss').oneOf('modules').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('postcss').oneOf('normal').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('postcss').oneOf('normal').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').oneOf('modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('scss').oneOf('modules').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('scss').oneOf('modules').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('scss').oneOf('modules').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('scss').oneOf('modules').use('sass-loader') */
              {
                loader: 'sass-loader'
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('scss').oneOf('normal').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('scss').oneOf('normal').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('sass-loader') */
              {
                loader: 'sass-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').oneOf('modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('sass').oneOf('modules').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('sass').oneOf('modules').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('sass').oneOf('modules').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('sass').oneOf('modules').use('sass-loader') */
              {
                loader: 'sass-loader',
                options: {
                  indentedSyntax: true
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal') */
          {
            use: [
              /* config.module.rule('sass').oneOf('normal').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('sass').oneOf('normal').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('sass-loader') */
              {
                loader: 'sass-loader',
                options: {
                  indentedSyntax: true
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').oneOf('modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('less').oneOf('modules').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('less').oneOf('modules').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('less').oneOf('modules').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('less').oneOf('modules').use('less-loader') */
              {
                loader: 'less-loader'
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal') */
          {
            use: [
              /* config.module.rule('less').oneOf('normal').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('less').oneOf('normal').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('less').oneOf('normal').use('less-loader') */
              {
                loader: 'less-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').oneOf('modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('stylus').oneOf('modules').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('stylus').oneOf('modules').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('stylus').oneOf('modules').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('stylus').oneOf('modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  preferPathResolver: 'webpack',
                  'import': [
                    '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/lib/client/style/config.styl'
                  ]
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal') */
          {
            use: [
              /* config.module.rule('stylus').oneOf('normal').use('vue-style-loader') */
              {
                loader: 'vue-style-loader'
              },
              /* config.module.rule('stylus').oneOf('normal').use('css-loader') */
              {
                loader: 'css-loader',
                options: {
                  modules: false,
                  localIdentName: '[local]_[hash:base64:8]',
                  importLoaders: 1,
                  sourceMap: true
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('postcss-loader') */
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    function () { /* omitted long function */ }
                  ],
                  sourceMap: true
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  preferPathResolver: 'webpack',
                  'import': [
                    '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/lib/client/style/config.styl'
                  ]
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('data-block') */
      {
        resourceQuery: /blockType=data/,
        use: [
          /* config.module.rule('data-block').use('date-block-loader') */
          {
            loader: '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/lib/node/internal-plugins/dataBlock/loader.js'
          }
        ]
      },
      /* config.module.rule('frontmatter-block') */
      {
        resourceQuery: /blockType=frontmatter/,
        use: [
          /* config.module.rule('frontmatter-block').use('frontmatter-block-loader') */
          {
            loader: '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/lib/node/internal-plugins/frontmatterBlock/loader.js'
          }
        ]
      }
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('injections') */
    new DefinePlugin(
      {
        VUEPRESS_VERSION: '"1.0.0-alpha.47"',
        VUEPRESS_TEMP_PATH: '"/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/.temp"',
        LAST_COMMIT_HASH: '"61ea9f1"',
        AHL_SIDEBAR_LINK_SELECTOR: '".sidebar-link"',
        AHL_HEADER_ANCHOR_SELECTOR: '".header-anchor"',
        SEARCH_MAX_SUGGESTIONS: '5',
        SEARCH_PATHS: 'null'
      }
    ),
    /* config.plugin('hmr') */
    new HotModuleReplacementPlugin(),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        template: '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/lib/client/index.dev.html'
      }
    ),
    /* config.plugin('site-data') */
    new HeadPlugin(
      {
        tags: []
      }
    ),
    /* config.plugin('vuepress-log') */
    new DevLogPlugin(
      {
        port: 8080,
        displayHost: 'localhost',
        publicPath: '/',
        clearScreen: false
      }
    )
  ],
  entry: {
    app: [
      '/Users/xiangxiao/Documents/work/workspace/vuepress-analysis/node_modules/@vuepress/core/lib/client/clientEntry.js'
    ]
  }
}
```
