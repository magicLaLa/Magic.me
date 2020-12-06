---
title: "Performance Yes 🎉"
date: 2020-12-01
categories:
 - Front-end
tags:
 - Front-end
 - Performance
---

<div class='abstract-box'>

![performance](/Abstract/performance/one.png)

</div>

<!-- more -->

# Performance

## 介绍

Performance 是一个做前端性能监控离不开的API，最好在页面完全加载完成之后再使用，因为很多值必须在页面完全加载之后才能得到。最简单的办法是在 window.onload 事件中读取各种数据。

::: details 可以先看一下个个环节的时间顺序：
![performance](~@Images/performance/one.png)
:::

## 属性

### navigation
告诉开发者当前页面是通过什么方式导航过来的，只有两个属性：`type`，`redirectCount`。[具体看文档](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigation)
### memory
描述内存多少，是在Chrome中添加的一个非标准属性。有三个属性：
1. `usedJSHeapSize`： JS 对象（包括V8引擎内部对象）占用的内存，一定小于 totalJSHeapSize
2. `totalJSHeapSize`： 可使用的内存
3. `jsHeapSizeLimit`： 内存大小限制
### timing
1. `navigationStart`: 在同一个浏览器上下文中，前一个网页（与当前页面不一定同域）unload 的时间戳，如果无前一个网页 unload ，则与 fetchStart 值相等;
2. `unloadEventStart`: 前一个网页（与当前页面同域）unload 的时间戳，如果无前一个网页 unload 或者前一个网页与当前页面不同域，则值为 0
3. `unloadEventEnd`:  和 unloadEventStart 相对应，返回前一个网页 unload 事件绑定的回调函数执行完毕的时间戳
4. `redirectStart`: 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0
5. `redirectEnd`: 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内的重定向才算，否则值为 0
6. `fetchStart`: 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前
7. `domainLookupStart`: DNS 域名查询开始的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
8. `domainLookupEnd`: DNS 域名查询完成的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
9. `connectStart`: HTTP（TCP） 开始建立连接的时间，如果是持久连接，则与 fetchStart 值相等,如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接开始的时间
10. `connectEnd`: HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等,如果在传输层发生了错误且重新建立连接，则这里显示的是新建立的连接完成的时间

::: tip 注意：
这里握手结束，包括安全连接建立完成、SOCKS 授权通过
:::


1. `secureConnectionStart`: HTTPS 连接开始的时间，如果不是安全连接，则值为 0
2. `requestStart`: HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存,连接错误重连时，这里显示的也是新建立连接的时间
3. `responseStart`: HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
4. `responseEnd`: HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存
5. `domLoading`: 开始解析渲染 DOM 树的时间，此时 Document.readyState 变为 loading，并将抛出 readystatechange 相关事件
6. `domInteractive`: 完成解析 DOM 树的时间，Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件

:::tip 注意:
这里只是 DOM 树解析完成，这时候并没有开始加载网页内的资源
:::

1. `domContentLoadedEventStart`: DOM 解析完成后，网页内资源加载开始的时间,文档发生 DOMContentLoaded事件的时间
2. `domContentLoadedEventEnd`: DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕），文档的DOMContentLoaded 事件的结束时间
3. `domComplete`: DOM 树解析完成，且资源也准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件
4. `loadEventStart`: load 事件发送给文档，也即 load 回调函数开始执行的时间,如果没有绑定 load 事件，值为 0
5. `loadEventEnd`: load 事件的回调函数执行完毕的时间,如果没有绑定 load 事件，值为 0

## 方法

### getEntries

获取所有资源请求的时间数据,这个函数返回一个按 __startTime__ 排序的对象数组，数组成员除了会自动根据所请求资源的变化而改变以外，还可以用`mark()`、`measure()`方法自定义添加，该对象的属性中除了包含资源加载时间还有以下五个属性：

1. `name`：资源名称，是资源的绝对路径或调用mark方法自定义的名称
2. `startTime`: 开始时间
3. `duration`：加载时间
4. `entryType`：资源类型，entryType类型不同数组中的对象结构也不同！
5. `initiatorType`：谁发起的请求

#### entryType

| 值        | 该类型对象           |描述  |
| ------------- |:-------------:| :-----:|
| mark     | PerformanceMark | 通过mark()方法添加到数组中的对象  |
| measure | PerformanceMeasure | 通过measure()方法添加到数组中的对象 |
| paint      | PerformancePaintTiming |  值为`first-paint(首次绘制)`、`first-contentful-paint(首次内容绘制)`。 |
| resource | PerformanceResourceTiming | 所有资源加载时间，用处最多 |
| navigation | PerformanceNavigationTiming | 现除chrome和Opera外均不支持，导航相关信息 |
| frame | PerformanceFrameTiming | 现浏览器均未支持 |

> 可参照：[PerformanceEntry/entryType](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry/entryType)

#### initiatorType

| 发起对象        | 值         |描述  |
| ------------- |:-------------:| :-----:|
| a Element     | `link/script/img/iframe`等 | 通过标签形式加载的资源，值是该节点名的小写形式  |
| a CSS resourc | `css` | 通过css样式加载的资源，比如`background: url`方式加载资源 |
| a XMLHttpRequest object | `xmlhttprequest/fetch` |  通过xhr加载的资源 |
| a PerformanceNavigationTiming object | `navigation` | 当对象是`PerformanceNavigationTiming`时返回 |

### getEntriesByName、getEntriesByType

> getEntriesByName(name,type[optional])，getEntriesByType(type)

- `name`: 想要筛选出的资源名
- `type`: entryType的值中一个

返回值仍是一个数组，这个数组相当于`getEntries()`方法经过所填参数筛选后的一个子集

### clearResourceTimings

该方法无参数无返回值，可以清除目前所有`entryType`为 `resource` 的数据

### mark、measure、clearMarks、clearMeasures

> mark(name)、measure(name, startMark, endMark)、clearMarks()、clearMeasures()

用于做标记和清除标记，供用户自定义统计一些数据，比如某函数运行耗时等

1. `name`: 自定义的名称，不要和`getEntries()`返回的数组中其他`name`重复
2. `startMark`: 作为开始时间的标记名称或`PerformanceTiming`的一个属性
3. `endMark`: 作为结束时间的标记名称或`PerformanceTiming`的一个属性

- 创建标记：`mark(name)`；
- 记录两个标记的时间间隔：`measure(name, startMark, endMark)`;
- 清除指定标记：`window.performance.clearMarks(name)`;
- 清除所有标记：`window.performance.clearMarks()`;
- 清除指定记录间隔数据：`window.performance.clearMeasures(name)`;
- 清除所有记录间隔数据：`window.performance.clearMeasures()`;

### now

`performance.now()`是当前时间与`performance.timing.navigationStart`的时间差，以 __微秒（百万分之一秒）__ 为单位的时间，与 `Date.now()-performance.timing.navigationStart`的区别是 __不受系统程序执行阻塞的影响__，因此更加精准。

## 使用方式

### 简单计算出网页性能数据

> 单页应用：第一次进入页面时的数据或者是刷新当前页面的数据可以通过 onload 拿到

```js
window.onload = function performance() {
  const performance = window.performance;
  if (!performance) {
    console.log('浏览器不支持 performance 接口');
    return;
  }
  const timing = performance.timing;
  console.log('统计模块性能时间：index'); // 写出具体模块名称
  console.log('准备新页面时间耗时: ' + (timing.fetchStart - timing.navigationStart) + 'ms');
  console.log('Appcache 耗时: ' + (timing.domainLookupStart - timing.fetchStart) + 'ms');
  console.log('重定向的时间: ' + (timing.redirectEnd - timing.redirectStart) + 'ms');
  console.log('DNS 查询耗时: ' + (timing.domainLookupEnd - timing.domainLookupStart) + 'ms');
  console.log('TCP连接耗时: ' + (timing.connectEnd - timing.connectStart) + 'ms');
  console.log('request请求耗时: ' + (timing.responseEnd - timing.requestStart) + 'ms');
  console.log('请求完毕至DOM加载: ' + (timing.domInteractive - timing.responseEnd) + 'ms');
  console.log('解释dom树耗时: ' + (timing.domInteractive - timing.domLoading) + 'ms');
  console.log('页面加载完成的时间: ' + (timing.loadEventEnd - timing.navigationStart) + 'ms');
  console.log('白屏时间: ' + (timing.domContentLoadedEventStart - timing.navigationStart) + 'ms');
};
```

### 使用 performance.mark 精确计算程序执行时间

我们可以使用 `performance.mark()`  标记各种时间戳，保存为各种测量值，便可以批量地分析这些数据了。

```js
function randomFunc (n) {
    if (!n) {
        // 生成一个随机数
        n = ~~(Math.random() * 10000);
    }
    var nameStart = 'markStart' + n;
    var nameEnd   = 'markEnd' + n;
    // 函数执行前做个标记
    window.performance.mark(nameStart);

    for (var i = 0; i < n; i++) {
        // do nothing
    }

    // 函数执行后再做个标记
    window.performance.mark(nameEnd);

    // 然后测量这个两个标记间的时间距离，并保存起来
    var name = 'measureRandomFunc' + n;
    window.performance.measure(name, nameStart, nameEnd);
}

// 执行三次看看
randomFunc();
randomFunc();
// 指定一个名字
randomFunc(888);

// 看下保存起来的标记 mark
var marks = window.performance.getEntriesByType('mark');
console.log(marks);

// 看下保存起来的测量 measure
var measure = window.performance.getEntriesByType('measure');
console.log(measure);

// 看下我们自定义的测量
var entries = window.performance.getEntriesByName('measureRandomFunc888');
console.log(entries);

// 清除指定标记
window.performance.clearMarks('markStart888');
// 清除所有标记
window.performance.clearMarks();

// 清除指定测量
window.performance.clearMeasures('measureRandomFunc');
// 清除所有测量
window.performance.clearMeasures();
```

可以把之前我们测量页面加载完成的时间 从 `timing.loadEventEnd-timing.navigationStart` 改为以下代码：

```js
window.performance.measure('pageCompletion','navigationStart' , 'loadEventEnd');
var pageCompletion = window.performance.getEntriesByName('pageCompletion');
console.log(pageCompletion);
```

### 分析每个请求具体的耗时情况

我们可以使用 `window.performance.getEntries` 来获取到单个静态资源从开始发出请求到获取响应之间各个阶段的`Timing`

> 在非web页面本身的域名下，这些属性在默认都会返回 __0__ 值: redirectStart、 redirectEnd、 domainLookupStart、domainLookupEnd、 connectStart、 connectEnd、secureConnectionStart、 requestStart、 responseStart...更多详情访问 <https://developer.mozilla.org/zh-CN/docs/Web/API/Resource_Timing_API>

```js
export function PerformanceGetEntries() {
  const  entryTimesList: any[] = [];
  const entryList = window.performance.getEntries();
  console.log(entryList.length);
  entryList.forEach((item: any, index) => {
     const templeObj: any = {};
    //  'navigation', 'script', 'css', 'fetch', 'xmlhttprequest', 'link', 'img'
     const usefulType = ['xmlhttprequest', 'link'];
     if (usefulType.indexOf(item.initiatorType) > -1) {
      //  console.log('item', item);
      templeObj.name = item.name;
      templeObj.nextHopProtocol = item.nextHopProtocol;
      // 解析dom树耗时
      //  templeObj.domTime = item.domComplete - item.domInteractive;
      // 白屏时间
      // templeObj.baipingTime = item.domInteractive - item.fetchStart;
      // dns查询耗时
       templeObj.dnsTime = item.domainLookupEnd - item.domainLookupStart;
        // tcp链接耗时
       templeObj.tcpTime = item.connectEnd - item.connectStart;
        // 请求时间
       templeObj.reqTime = item.responseEnd - item.responseStart;
        // 重定向时间
       templeObj.redirectTime = item.redirectEnd - item.redirectStart;
       entryTimesList.push(templeObj);
     }
  });
  console.table(entryTimesList);
}
```

## 扩展

### Chrome下的 Network之Timing

![network-timing](~@Images/performance/network-timing.png)

以下是可能会在“timing”选项卡中看到的每个阶段的更多信息：

- `Queueing` 浏览器在以下情况下对请求进行排队:
  - 有更高优先级的请求
  - 已为该来源打开了六个TCP连接，这是限制。仅适用于HTTP / 1.0和HTTP / 1.1。
  - 浏览器正在磁盘缓存中短暂分配空间
- `Stalled` 请求可能因为队列中描述的任何原因而停止
- `DNS Lookup` 浏览器正在解析请求的IP地址
- `Proxy negotiation` 浏览器正在与[代理服务器](https://en.wikipedia.org/wiki/Proxy_server)协商请求
- `Request sent`  正在发送请求
- `ServiceWorker Preparation` 浏览器正在启动服务程序
- `Request to ServiceWorker`  正在将请求发送给 service worker
- `Waiting (TTFB)`  浏览器正在等待响应的第一个字节。TTFB代表到第一个字节的时间。此时间包括一次往返延迟和服务器准备响应所花费的时间
- `Content Download`  浏览器正在接收响应
- `Receiving Push` 浏览器正在通过HTTP / 2服务器推送接收此响应的数据
- `Reading Push` 浏览器正在读取先前接收的本地数据

> 更多相关信息可以到 [chrome-devtools](https://developers.google.com/web/tools/chrome-devtools) 查看