---
title: "使用 Vue + TypeScript 开发 Chrome Extensions 🐱‍👤"
date: 2020-12-08
categories:
 - Front-end
tags:
 - Front-end
 - Chrome
---

# Chrome Extensions

## 谷歌插件是什么？

严格来说，我们目前所说的插件其实是 _Chrome 扩展程序(`Chrome Extensions`)_，根据官方文档上所说：_扩展程序是可以定制浏览体验的小型软件程序。它们使用户可以根据个人需要或偏好来定制Chrome功能和行为。它们基于Web技术（例如HTML，JavaScript和CSS）构建_，它是以 .crx 做结尾的压缩文件。

### 对我们有什么用呢？

我们可以很轻松的实现自己的定制版的浏览器，实现自己想要在浏览器上的自定义功能，因为它对网页有完全的方法问权限（_前提是自己使用，发布到商店的话会进行审查，移除不必要的权限，保证安全_）。

### 核心功能点

#### manifest.json

_最新的版本为 [v3 版本](https://developer.chrome.com/docs/extensions/mv3/intro/) 从Chrome 88版支持并且 Chrome Web Store 自 2021年1月 开始支持，并且Chrome Web Store从2021年1月开始支持。目前插件大部分都是使用的 [v2 版本](https://developer.chrome.com/docs/extensions/mv2/)_

manifest 格式可以到 [manifest 查看](https://developer.chrome.com/docs/extensions/mv3/manifest/)，例如下结构，其中高亮为必填项。

``` json{2-3,5}
{
	"manifest_version": 2, // 清单文件版本号
	"name": "scheme-chrome-extension",
	"description": "scheme 生成、分析、转换，暂时仅支持支付宝小程序",
	"version": "0.0.2",
	"browser_action": { // 浏览器右上角图标设置，browser_action、page_action、app 必须三选一
		"default_title": "vue-chrome-extension",
		"default_icon": "assets/scheme-128.png",
		"default_popup": "popup.html"
	},
  // 省略...
	"permissions": [],
	"icons": {
		"16": "assets/scheme-16.png",
		"48": "assets/scheme-48.png",
		"128": "assets/scheme-128.png"
	},
	"content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
	"web_accessible_resources": ["fonts/*"]
}
```

##### Popup

Popup 是点击`browser_action` 或者 `page_action` 图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互，(__v3 情况下改为同一个为` action`__)如下图：

![scheme-chrome-extension](~@Images/chromeExtensions/ex-tmp.png)

Popup 弹窗可以自适应大小，由于弹窗是点击打开的，所以生命周期很短暂，弹窗消失掉就回销毁，所以需要长时间运行的代码不要放到这个页面中，可以放到 `background` 中。

``` json
// v2
"browser_action": { // 浏览器右上角图标设置，browser_action、page_action、app 必须三选一
  "default_title": "scheme-chrome-extension",
  "default_icon": "assets/scheme-128.png",
  "default_popup": "popup.html"
},
// v3
"action": {...}
```

##### Background

它是一个常驻的后台页面，生命周期在插件中所有类型的页面是最长的，所以需要长时间运行的代码或者启动就运行的代码可以放到这个里面执行。可以通过 `page` 指定 网页 或者 `script` 指定一个 js

``` json{4-8}
{
  "name": "My extension",
  ...
  "background": {
    "scripts": ["background.js"],
    // "page": "background.html",
    "persistent": false
  },
  ...
}
```

可以看到 有一个 [`persistent` 事件驱动](https://developer.chrome.com/docs/extensions/mv3/background_migration/) 参数：
- true: 随着浏览器打开/关闭才会开始/关闭
- false: 在被需要时加载，在空闲时被关闭，通过 事件触发，不会常驻

_v3版本有一个提议是 [Migrating from background pages to service workers](https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/)_

##### Content_scripts

其实就是插件向被访问的页面注入脚本，支持 js 和 css。

```json
{
	"content_scripts":
	[
		{
			//"matches": ["http://*/*", "https://*/*"],
			// "<all_urls>" 表示匹配所有地址
			"matches": ["<all_urls>"],
			// 多个JS按顺序注入
			"js": ["js/jquery-1.8.3.js", "js/content-script.js"],
			// JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
			"css": ["css/custom.css"],
			// 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
			"run_at": "document_start"
		}
	],
}
```

`content-scripts` 和 原始页面共享DOM，但是不共享JS，如要访问页面JS（例如某个JS变量），只能通过注入js文件来实现。`content-scripts`不能访问绝大部分`chrome.xxx.api`，除了下面这4种：
- chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
- chrome.i18n
- chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
- chrome.storage
其实看到这里不要悲观，这些API绝大部分时候都够用了，非要调用其它API的话，可以通过事件通信来实现让background来帮你调用。

注入 js：就是通过在`content-scripts` 往 dom 中插入 `script` 文件来实现：
``` js{7}
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	const temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.head.appendChild(temp);
}
```
高亮部分同时需要在 manifest.json 中配置声明文件，否则找不到文件：
``` json
{
  ...
  "web_accessible_resources": ["js/inject.js"],
}
```

## 搭建开发环境

推荐使用 [Vue-cli](https://cli.vuejs.org/zh/guide/) 搭建开发环境，按照多页面开发，因为插件本身就是多页面的，不支持页面之间的跳转（通过hash或者history）。

### 目录结构

``` tree
.
├── dist
├── node_modules
├── public
├── src
│   ├─ assets
│   ├─ popup
│   ├─ types
│   ├─ utils
│   └── manifest.json
├── .eslintignore
├── .eslintrce
├── .gitignore
├── babel.config.js
├── tsconfig.json
├── vue.config.js
├── yarn.lock
└── package.json
```


### 安装 zip-webpack-plugin
如果需要上传到 谷歌开发商店需要 zip 压缩文件，不需要上传则跳过这一步，后面的步骤也可以跳过 zip 相关逻辑。

``` bash
yarn add zip-webpack-plugin -D
```

### 配置 vue.config.js 文件

- 配置需要复制的文件

  ```js
  // 只需要复制的文件
  const copyFiles = [
    {
      from: path.resolve('src/manifest.json'),
      to: `${path.resolve('dist')}/manifest.json`
    },
    {
      from: path.resolve('src/assets'),
      to: path.resolve('dist/assets')
    },
  ];
  ```

  - 配置 [hot-reload.js](https://github.com/xpl/crx-hotreload)

  注：这个文件是用来更新插件的，因为在使用 vue 热更新之后，如果不使用这个插件，你必须在插件页面手动刷新重新加载才可以获取到最新的包，关键代码如下：

  ```js
  const reload = () => {
    window.chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5
        if (tabs[0]) {
            window.chrome.tabs.reload(tabs[0].id)
        }
        window.chrome.runtime.reload()
    })
  };
  ```

  在开发环境下加载 `hot-reload.js` 文件：

  ```js
  if (process.env.NODE_ENV !== 'production') { // 正式不需要这个文件
    copyFiles.push({
      from: path.resolve('src/utils/hot-reload.js'),
      to: path.resolve('dist')
    });
  }
  ```

  增加拷贝的方法：

  ``` js
  module.exports = {
    ...
    chainWebpack: config => {
      // ^copy-webpack-plugin@5.6.0
      config.plugin('cpoy').use(require('copy-webpack-plugin'), [copyFiles]);
      // ^copy-webpack-plugin@6.0.0
      // config.plugin('copy').use(require('copy-webpack-plugin'), [
      //   {
      //     patterns: [copyFiles],
      //   },
      // ]);
      ...
    }
    ...
  }
  ```

- 正式环境增加压缩配置

```js
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new ZipWebpackPlugin({
      path: path.resolve('dist'),
      filename: 'dist.zip'
    })
  );
}
```

- 处理字体文件

``` js
module.exports = {
  ...
  chainWebpack: config => {
    ...
    // 处理字体文件名，去除hash值
    const fontsRule = config.module.rule("fonts");
      // 清除已有的所有 loader。
      // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
      fontsRule.uses.clear();
      fontsRule.test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .use('url')
        .loader('url-loader')
        .options({
          limit: 1000,
          name: 'fonts/[name].[ext]'
        });
    }
    ...
  }
  ...
}
```

- 插件页面

``` js{1-12,14}
const chromeNames = [
  'popup',
];
const pages = {};
chromeNames.map(name => {
  pages[name] = {
    entry: `./src/${name}/main.ts`,
    template: 'index.html',
    filename: `${name}.html`,
    title: `${name}`
  };
});
module.exports = {
  pages,
  ...
}
```
__注：完整的配置可以到 [vue.config.js](https://github.com/magicLaLa/scheme-chrome-extension/blob/main/vue.config.js) 参考__

### 配置 scripts 命令

``` json{7}
{
  ...
  "scripts": {
    "serve": "npm run build-watch",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "build-watch": "vue-cli-service build --watch"
  },
  ...
}
```

### 示例

#### 弹窗页面

- popup.vue
``` vue
<template>
  <el-container id="app">
    <el-header height="25px">
      <div class="header">小程序 scheme <i class="el-icon-set-up"></i></div>
    </el-header>
    <el-main>
      <CollapseTemp />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CollapseTemp from '@/popup/components/CollapseTemp.vue';

@Component({
  name: 'Popup',
  components: {
    CollapseTemp,
  },
})
export default class Popup extends Vue {}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
</style>
<style lang="scss">
...
</style>
```
- main.ts
```ts
import Vue from 'vue';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import {
  Container,
  Header,
  Main,
  Collapse,
  CollapseItem,
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Alert,
  Card,
  Tooltip,
} from 'element-ui';

Vue.use(Container)
  .use(Header)
  .use(Main)
  .use(Collapse)
  .use(CollapseItem)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Alert)
  .use(Card)
  .use(Tooltip);

Vue.prototype.$message = Message;

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

__注： 完整代码可看 [scheme-chrome-extension](https://github.com/magicLaLa/scheme-chrome-extension)__

之后开发插件的新页面可以先到 `vue.config.js` 中配置，然后在 `src/xxx` 下增加对应页面模板就可以愉快的进行开发了🤪

🤩后续可以使用 [vite](https://github.com/vitejs/vite) 进行开发，因为更快~，并且也支持使用 react 进行开发，后续我们一起期待吧 😘