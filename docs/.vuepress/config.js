const path = require('path');

module.exports = {
  base: '/Magic.me/',
  title: '人间熙攘，好久不见',
  description: '人间熙攘，好久不见~ Magic 的博客',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  dest: 'dist',
  port: 8989,
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@GitPic': path.join(__dirname, '..', 'Images/git'),
      }
    }
  },
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    logo: '/logo/nav.png',
    authorAvatar: '/logo/avatar2.gif',
    valineConfig: {
      appId: '00gpzYqWJUlWq8ncDRIDwBV0-gzGzoHsz',
      appKey: 'E6qzasI6E0Izj0jBLUBWBAhc',
    },
    nav: [
      { text: "Home", link: "/", icon: "reco-home" },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
    ],
    // 博客配置
    blogConfig: {
      category: {
        location: 2,
        text: 'Category',
        icon: 'reco-category',
      },
      tag: {
        location: 3,
        text: 'Tags',
        icon: 'reco-tag',
      },
    },
    subSidebar: 'auto',
    sidebar: require('../utils/sidebarConf'),
    startYear: '2017',
    author: 'Magic'
  },
  plugins: [
    [
      '@vuepress-reco/vuepress-plugin-kan-ban-niang',
      {
        theme: ['haru2'],
        clean: true,
      }
    ],
    [
      "cursor-effects",
      {
        size: 2,
        shape: ['star'],
        zIndex: 999999999
      }
    ]
  ],
}