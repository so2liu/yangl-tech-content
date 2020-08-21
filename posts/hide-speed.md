---
title: "React Hooks的使用: display: none和isShow = false，到底哪家强"
date: "2020-08-17"
---

# React Hooks 的使用: `display: none`和`isShow = false`，到底哪家强？

---

太长不看：
我的测试结果是两者基本上是一样的，不是`array.push(...)`和`array = array.concat(...)`那种一百倍的性能差距。
[例子在 codesandbox](https://codesandbox.io/s/cssyuluojiyunsuandexianshi-yincanglistdeduibi-4prge)

---

熟悉 React 的朋友都知道，隐藏一个组件有两种常用方法。

- CSS 的`display: none`
- JSX 的`{ isShow } && <Component />`.

那么两种方法哪一个更快呢？
万一像`array.push(...)`和`array = array.concat(...)`一样性能查一百多倍，差别就太大了。

本文就试图写一个 demo 测试一下：

> 显示和隐藏一个大`ul`，谁更快

## 思路

比较性能，自然就是比较时间差。`performance.now()`可以比`Date.now()`获得更为精确的时间戳。

## 方案

### 求出开始渲染和渲染结束的 timestamp 的差值

要实现这个需求，要了解 React Hooks 的生命周期（也就是 React 先干什么、后干什么）。

一个 react hooks 组件大体是这样的：

```js
function myComponent(props) {
  const [state, setState] = useState(initial);

  const myState = useMyHooks();

  function someCompute(){}
  const someValue = someCompute(state.someProps);

  useEffect(callback(){
    doSomething()
    return ()=>cleanup();
  }, [deps]);

  return <UI><UI/>
}
```

1. 挂载时，react 根据 state 和 props，在内存中生成虚拟 dom 树、dom 树，进而生成第一个帧页面。
   > react 在淡化虚拟 dom 树这个称呼，等我了解更多就来修改一下这个术语。
2. 当 state 或 props 有修改时，react 会找到 state 或 props 的改变，仅更新改变的部分。
   > 一般在 hooks 风格的组件里的代码，会有三种情况：
   >
   > 1. `use`开头的 hooks 不会被重新定义。例如 `const [state, setState] = useState(initial)`不会被调用，即上一个状态的 state 会保留下来。
   > 2. 对普通 function、变量的定义语句会重新运行一次。可以用`useMemo`优化，但是其实`useMemo`也有代价，而浏览器定义一个函数其实超快的，一般不必优化。
   > 3. ```js
   >    useEffect(callback(){
   >       doSomething()
   >       return ()=>cleanup();
   >    }, [deps]);
   >    ```
   >    中，如果`deps`有改变，会先运行上一帧 return 的`cleanup()`，再运行这一帧的`doSomething`。

因此，起始渲染时间可以从直接定义`const startTS = Date.now()`，而结束渲染时间可以放在`useEffect`里面。因为它会在渲染 UI 结束后调用。

### 把差值显示在页面上

当然我们也可以把时间差`console.log`在 console 里面。
但是更好的效果是把结果显示在页面上。
而如果用常用的`state`来保存和更新页面上的内容，会触发重新渲染，导致无限循环。

此处可以用`useRef`来获得对页面元素的直接索引，把得到的时间差赋值给`ref.current.innerText`。

## 结论

测试结论是二者性能差不多。
这也是显而易见的，要是性能差很多，肯定其中一个会成为最佳时机，广为人知。
主要是可以借此增加对 react 生命周期的熟悉。

[例子在 codesandbox](https://codesandbox.io/s/cssyuluojiyunsuandexianshi-yincanglistdeduibi-4prge)
