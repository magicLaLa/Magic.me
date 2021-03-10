---
title: "Debounce Throttling ~"
date: 2021-3-01
categories:
 - Front-end
tags:
 - Front-end
---

:::tip
防抖和节流的简单实现
:::

<!-- more -->

## Debounce

- 防抖：延迟一段时间执行，间隔某端时间没人上车后发车

```js
function debounce(callback, timeout, immediate) {
  let timer = null;
  return function() {
    let args = arguments; // 保存参数
    const later = () => {
      timer = null;
      !immediate && callback.apply(this, args); // 尾部调用
    };
    const callNow = immediate && !timer; // 是否 首次调用，首部调用
    clearTimeout(timer);
    timer = setTimeout(later, timeout); // 重启一个定时器调用
    callNow && callback.apply(this, args); // 立即调用
  }
}
```

## Throttling

- 节流：滚动发车

```js
// 版本一：记录时间
function throttling(callback, waitTime) {
  let currentTime = 0;
  return function() {
    if (currentTime === 0 || Date.now() - currentTime > waitTime) {
      currentTime = Date.now();
      callback.apply(this, arguments);
    }
  }
}
// 版本二：使用间隔时间反转记录
fucniton throttling(callback, waitTime) {
  let disable = false;
  return function() {
    if (!disable) {
      disable = true;
      callback.apply(this, arguments);
      setTimeout(() => disable = false, waitTime); // 使用延迟时间来做更新判断
    }
  }
}
```