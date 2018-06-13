## 回到顶部组件
我们经常用手机浏览器网页时，会发现当页面向下滑动到一定距离的时候就会出现一个回到顶部的按钮，点击按钮，就能迅速的回到顶部。
### 实现逻辑
- 1、监听滚动事件来获取滚动条距离顶部的高度，当满足一定条件，显示"回到顶部"按钮
- 2、点击事件的逻辑处理
- 3、回到顶部过程中的缓冲动画的实现，当然也可以不添加动画，这里可以自定义
### 案例演示：
- 1、默认效果：实例化一个回到顶部对象，然后调用对象的init()方法即可。
```
let backtop = new BackToTop($('#backTop'));
backtop.init();
```
- 2、自定义回到顶部的时长

```
let backtop = new BackToTop($('#backTop') , {
    duration : 300
});
backtop.init();
```
- 3、自定义回到顶部过程中，按钮效果的展示

```
let backtop = new BackToTop($('#backTop') , {
    defaultIcon : function () {
        this.element.style.display = 'none';
    },
    more : function () {
        this.element.style.display = 'block';
    },
    less : function () {
        this.element.style.display = 'none';
    }
});
```
- 4、取消缓冲动画，直接回到顶部，其实就是将duration的值设置小点就行了

```
let backtop = new BackToTop($('#backTop') , {
    duration : 1
});
backtop.init();
```
5、自定义点击回到顶部之前和之后的回调操作

```
let backtop = new BackToTop($('#backTop') , {
    after : function () {
        console.log('回到顶部'); 
    },
    before : function () {
        console.log('开始回到顶部');
    }
});
backtop.init();
```
### 调用方法：

```
let backtop = new BackToTop(element , options);
backtop.init();
```
#### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---
duration | 300 | 否 | 回到顶部的动画时长
before | function () {} | 否 | 回到顶部前的操作
after | function () {} | 否 | 回到顶部后的操作
defaultIcon | 无 | 否 | 自定义初始回到顶部按钮的状态，是一个函数
more | 无 | 否 | 自定义滚动条的高度大于屏幕时的回到顶部按钮的状态
less | 无 | 否 | 自定义滚动条的高度小于屏幕时的回到顶部按钮的状态

### 问题：
当我在手机上测试时，会发现有些浏览器在触发滚动事件的时候，只会在滚动结束后触发一次，并不会连续触发(比如：UC)，而有些浏览器则可以连续触发，一开始以为是自己写的代码哪里出了问题，结果在用手机打开京东页面，也发现了这样的问题。通过网上查找发现，当页面滚动时，会停止所有的事件响应及DOM操作引起的页面渲染，所以onscroll事件不能实时响应，只会在滚动结束后触发一次。解决的方式，可以使用touchmove事件，当手指滑动的时候触发该事件，去计算滚动条的高度，但是当手指离开屏幕时，也不会触发touchmove事件，所以还是不能实现实时响应。所以这里就不做任何处理，毕竟还是会触发滚动事件的。[问题参考](https://segmentfault.com/q/1010000004453730)