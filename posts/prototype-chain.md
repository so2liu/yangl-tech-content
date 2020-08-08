---
title: "如何理解JavaScript的原型链"
date: "2020-08-08"
---

# 如何理解 JavaScript 的原型链？

JavaScript 的原型链是一种总是自认为学会了，没几天就发现自己没学会的知识。

本文旨在**以（我脑补的）JavaScript 作者的角度**理解原型链。

## 关于 object

1. 什么是面向对象（object-oriented, 指向对象的）编程？

面向对象的思想是把数据和行为（函数）打包在一起，防止数据被预期之外的行为修改。

> 以下对象称为 object，类称为 class。因为我觉得这样写会比全是中文更显眼一些。

2. 为什么叫面向 object，而不是面向 class？

因为 object 才是我们的目标，而不是 class。
class 只是为了辅助生成 object。

3. JavaScript 中如何把数据和行为绑定在一起？

JavaScript 的作者不想要 class，想直接写出 object。

```js
const myCat = {
  name: "Tom",
  age: 2,
  eat: function () {
    console.log("I am eating");
  },
  grow: function () {
    this.age++;
  },
};
```

4. 为什么要继承？

为了实现代码可复用。

更确切的说，是 object 的方法可复用。

也就是说，新的 object 用**自己的数据**和**别的 object 的方法**。

5. JavaScript 如何在 object 之间实现继承？

```js
const oldObj = {
  name: "Old",
  print: function () {
    console.log(this.name);
  },
};
const newObj = { name: "New" };

newObj.__proto__ = oldObj; // *
newObj.print(); //output: New
```

> 见附件代码 `objectInherit()`

Bingo! 我们实现了 object 之间的继承。

## 关于构造函数

### 1. 如何 copy 一个 object？

**背景：**我们手头有了一个 object，有时候会需要另外一个差不多的 object。

**直观想法（naive approach）：**
直接`newObj = oldObj`搞起呗

错！因为`newObj`和`oldObj`指向的是同一个 object，他们其实是同一个东西。

**新想法：** 复制 object，这简直是一个必考面试题呀

```js
var newObj = Object.assign({}, oldObj); // ES5
const newObj = { ...oldObj }; // ES6
```

问题：

- 我们往往只是需要一个初始化后的 object。如果`oldObject`已经被我们一顿操作玩弄了，就不能获得最初的数据了。

**新 · 新想法：** 用一个函数，每次运行都返回一个对象（这个方法是我独立自主想出来的，开心）

```js
const getInitObj = () => ({
  name: "",
  print: function () {
    console.log(this.name);
  },
});
const oldObj = getInitObj();
oldObj.name = "Old";
const newObj = getInitObj();
newObj.name = "New";

newObj.print(); // New
```

**结论：**得到一个全新的 object 可以分三步走

1. 建立一个空的 object
2. 设置好初始化后的数据和行为
3. 建一个函数，把这个 object 返回

### 2. 什么是`new`

如果把上面的三步走进行**变化-不变**的封装，可以发现，1 和 3 是不变的，2 是变化的。

于是 JavaScript 创立了`new`的运算符，来做以下事情：

1. 创建一个空 object
2. （这里还有一步，之后讲）
3. 把步骤 1 创建的 object 作为函数的`this`
4. 如果函数没有返回 object，就把步骤 1 创建的 object 返回

相当于上一节的`getInitObj()`写成这样：

```js
function getInitObj() {
  const output = {}; // Step 1
  // this = output; //Step 3, 然而不能对this赋值，这里只是示意

  // 以下假装this是output
  this.name = "Init";
  this.print = function () {
    console.log(this.name);
  };

  return output; // Step 3
}
```

用`new`封装好后，我们只需要写**变化**的部分

```js
function InitObj() {
  this.name = "Init";
  this.print = function () {
    console.log(this.name);
  };
}

const oldObj = new InitObj();
oldObj.name = "Old";
const newObj = new InitObj();
newObj.print(); // output: Init
```

### 3. 回到问题 1，如何 copy 一个 object？

问：回到我们最初的需求，现在手头有一个 object，如何得到一个新的、相同的、处于初始化状态的，object？

答：new 一下 constructor，也就是上一节的`InitObj()`

问：但是我手头只有 object，怎么找到它的 constructor？

答：可以……把 constructor 作为 object 的一个属性，反正都是指针，也不会多占内存

于是，就有了上一节`new`的四步走的第二步：

```js
output.constructor = InitObj;
```

证明：

```js
newObj.constructor === InitObj; // true
```

> 以下部分有点虎头蛇尾，还是需要理解更深入以后再修改呀

## 关于继承

之前讲了 object 之间的继承，现在我们有了构造函数。下一步是在构造函数中实现继承。

> 为什么要在构造函数中实现继承？
> 新的 object 可能动态添加/修改了方法，而我们想找最原始、最白玉无瑕的方法

那如何用构造函数中实现继承？

思路很简单，让 child 的构造函数的某一个属性**指向**parent object 即可。
在 JavaScript 中，这个属性叫做 prototype。

```js
function Animal() {
  this.type = "animal";
}
Animal.prototype.getType = function () {
  return this.type;
};

function Dog() {
  this.name = "dog";
}

Dog.prototype = new Animal();

Dog.prototype.getName = function () {
  return this.name;
};

const xiaohuang = new Dog();

console.log(xiaohuang.getName(), xiaohuang.getType()); // dog animal
```

引用一张[超棒的图](https://zhuanlan.zhihu.com/p/22787302)

![原型链基本思路](https://pic2.zhimg.com/v2-901202a60d3f6e9fcc90a69d06fe0282_b.png)

```js
//原型链关系
xiaohuang.__proto__ === Dog.prototype;
Dog.prototype.__proto__ === Animal.prototype;
Animal.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;
```
