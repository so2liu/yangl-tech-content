---
title: "事件循环：microtask 和 macrotask"
date: "2020-08-13"
---

# 事件循环：microtask 和 macrotask

---

> 第一部分较基础

---

## 问题

- 浏览器有众多任务，那什么时候运行 JavaScript 代码？
- 运行 JavaScript 代码的时候，先运行什么，后运行什么？

## 浏览器的 Loop（待增加内容）

总之，如果 JavaScript 卡住了，UI 就会卡住，页面会假死。

## JavaScript 的调度（schedule）

![Event Loop](https://wx2.sbimg.cn/2020/08/13/34m7h.png)

### macrotask queue

1. 新任务来的时候，如果忙，任务会进入队列
2. JavaScript 按照宏任务队列的顺序运行
3. 宏任务队列，首先是个队列，FIFO

### macrotask 的应用

- 拆分任务，防止 UI 卡死

```javascript
let i = 0;

let start = Date.now();

function count() {
  // 将调度（scheduling）移动到开头
  if (i < 1e9 - 1e6) {
    setTimeout(count); // 安排（schedule）新的调用
  }

  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + "ms");
  }
}

count();
```

- 进度显示

```javascript
let i = 0;

function count() {
  // 做繁重的任务的一部分
  do {
    i++;
    progress.innerHTML = i;
  } while (i % 1e3 != 0);

  if (i < 1e7) {
    setTimeout(count);
  }
}

count();
```

- 推迟到下一个 macrotask

### microtask queue

- 仅来源于 JS 代码，通常由 promise 创建
- `.then/catch/finally`的执行是微任务
- `queueMicrotask(func)`可以把`func`放入微任务

**每个**宏任务结束后，引擎会执行微任务里面的**所有任务**，再执行其它宏任务、UI 渲染等。

## 再回到 event loop

![Event Loop Details](https://wx2.sbimg.cn/2020/08/13/35xVY.png)

- 这种调度方式确保了 microtask queue 的环境基本相同（没有鼠标移动、新的网络数据什么的）
- 如果想异步、但是在渲染 UI 之前执行一个函数，用`queueMicrotask`

### 宏任务

script 的全部代码、setTimeout、setInterval、I/O、UI Rendering、setImmediate (nodejs 独有)

### 微任务

Promise、MutationObserver、Process.nextTick (nodejs 独有)

## 最后，年轻人，想不想来一道题目呢

```javascript
console.log(1);

async function async1() {
  await async2();
  console.log(5);
}
async function async2() {
  console.log(2);
}
async1();

setTimeout(() => {
  console.log(7);
  Promise.resolve().then(() => {
    console.log(8);
  });
}, 0);

new Promise((resolve) => {
  console.log(3);
  resolve();
}).then(() => {
  console.log(6);
  setTimeout(() => console.log(9), 0);
});

console.log(4);

// 123456789
```
