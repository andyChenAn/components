## 回到顶部组件
我们经常用手机浏览器网页时，会发现当页面向下滑动到一定距离的时候就会出现一个回到顶部的按钮，点击按钮，就能迅速的回到顶部。
### 实现逻辑
- 1、监听滚动事件来获取滚动条距离顶部的高度，当满足一定条件，显示"回到顶部"按钮
- 2、点击事件的逻辑处理
- 3、回到顶部过程中的缓冲动画的实现，当然也可以不添加动画，这里可以自定义
### 介绍：
通过原生JavaScript实现回到顶部组件，适应PC和移动，兼容到IE8+。
### 案例演示：
- 1、默认效果：实例化一个回到顶部对象。
```
var backtop = new BackToTop(element);
```
- 2、自定义回到顶部的时长

```
var backtop = new BackToTop(element , {
    duration : 300
});
```
- 3、自定义回到顶部过程中，按钮效果的展示

```
var backtop = new BackToTop(element , {
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
var backtop = new BackToTop(element , {
    duration : 1
});
```
5、自定义点击回到顶部之前和之后的回调操作

```
var backtop = new BackToTop(element , {
    after : function () {
        console.log('回到顶部'); 
    },
    before : function () {
        console.log('开始回到顶部');
    }
});
```
### 调用方法：

```
new BackToTop(element , options);
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

### 总结：
1、当我在手机上测试时，会发现ios系统有些浏览器在触发滚动事件的时候，只会在滚动结束后触发一次（安卓系统没有问题），并不会连续触发(比如：UC)，而有些浏览器则可以连续触发，一开始以为是自己写的代码哪里出了问题，结果在用手机打开京东页面，也发现了这样的问题。通过网上查找发现，当页面滚动时，会停止所有的事件响应及DOM操作引起的页面渲染，所以onscroll事件不能实时响应，只会在滚动结束后触发一次。解决的方式，可以使用touchmove事件，当手指滑动的时候触发该事件，去计算滚动条的高度，但是当手指离开屏幕时，也不会触发touchmove事件，所以还是不能实现实时响应。所以这里就不做任何处理，毕竟还是会触发滚动事件的。[问题参考](https://segmentfault.com/q/1010000004453730)

2、获取页面滚动条的高度存在兼容问题，在桌面的移动模式下，则使用"document.documentElement.scrollTop"，而在手机上则需要使用"document.body.scrollTop"，所以要想做到兼容的话，只需要这样写就可以了：
```
document.documentElement.scrollTop = document.body.scrollTop = 高度
```
3、兼容问题
- 1、requestAnimationFrame和cancelAnimationFrame，这两个方法只能在IE10以上兼容，IE9及以下是不兼容的，那么就得写兼容代码
- 2、函数的bind方法在IE8下的兼容问题
- 3、IE8浏览器下的css属性opacity是不支持的，需要使用"filter:alpha(opacity=60)"来兼容
- 4、IE8浏览器下不支持addEventListener方法来绑定事件，需要使用attachEvent来给元素绑定事件
- 5、IE8浏览器是不支持window.innerHeight来获取页面高度，需要使用document.documentElement.clientHeight来回去可视区域的高度