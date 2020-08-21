---
title: "Delegate: 事件委托与jQuery的实现"
date: "2020-08-17"
---

# Delegate: 事件委托与 jQuery 的实现

---

**问题描述：** 已有一个函数`callback`，希望让它在下了`li`元素的任何一个被点击的时候触发。

```html
<body>
  <ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
    <li>
      <div>
        <span>
          D
        </span>
      </div>
    </li>
  </ul>
</body>
```

---

## 思路

1. 最 naive 的思路是给每个元素都绑定一个函数，这显然非常麻烦且不好维护。
2. 可以利用 event 的冒泡原理（capturing phase -> target phase -> bubbling phase）在最外面的`ul`元素上（甚至 document 上）捕捉 event。所以问题变成了如何定位是哪一个元素生成了 event。即

```ts
const ul = document.querySelector("ul");
delegate(ul, "click", "li", (e:Node) => alert(e.innerHTML));

function delegate (element: Node, eventName: string, seletor: string, callback: Node => void ){}
```

3. `event.target`指向的是生成 event 的元素。进一步的想法是由用户提供一个 CSS selector，通过`querySelectorAll`的 API 来把所有目标子元素找到，再判断具体是哪一个。即

```js
function delegate(parent, eventName, selector, callback) {
  parent.addEventListener(eventName, (e) => {
    const selectedChildren = parent.querySelectorAll(selector);
    if (Array.from(selectedChildren).includes(e.target)) callback(e.target);
  });
}
```

4. 这带来一个问题，就是如果点击`li`，`callback`可以被触发。但是如果点击里面的元素，如`li`中的`span`，就不会触发`callback`。解决方案是看看`selectedChildren`里面有没有`e.target`。这里用到了`contains`这个 NodeElement 的 API。即

```js
function delegate(parent, eventName, selector, callback) {
  parent.addEventListener(eventName, (e) => {
    const selectedChildren = parent.querySelectorAll(selector);

    if (Array.from(selectedChildren).some((c) => c.contains(e.target)))
      callback(e.target);
  });
}
```

[jQuery](https://github.com/jquery/jquery/blob/82b87f6f0e45ca4e717b4e3a4a20a592709a099f/src/event.js#L37)的源码在这里，等我看懂了再更新。
