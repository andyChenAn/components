# 图片懒加载组件
图片懒加载功能，经常出现在PC和移动的网站上，作为一个比较常用的前端页面优化技术，应用还是非常广的，大部分页面都会使用这个功能。
### 介绍
图片懒加载组件适用于PC和移动，采用原生js编写，不依赖任何库或框架，使用css3的过渡属性来实现图片加载过程中的过渡效果，目前支持移动端和现代浏览器以及IE10及以上浏览器。

对于该组件，主要是通过监听滚动条事件来计算图片距离窗口顶部的高度，来实现图片在可视区域内的加载功能，而不再可视区域内，则不会加载图片，如果滚动条的初始位置不在最顶部，在页面的中间位置，也是一样只加载可视区域的图片。

因为图片懒加载组件是监听滚动条事件，所以当滚动条滚动的时候回频繁的触发该事件，所以这里使用函数节流的方式来控制滚动条事件触发的频率。

当当前的容器中的图片加载完之后，如果存在更多按钮，点击加载更多的话，也可以调用对应的addMoreImage方法来实现。

当图片全部加载完成后，会触发complete回调，可以在图片加载完成后，执行一些自定义的功能

该图片懒加载组件，只能加载img标签的图片，不能加载背景图。而且在img标签中的src属性改为"_src"，并给该属性添加图片路径。而且img标签都会有一个父元素，父元素会设置宽高，而img标签的宽高均为"100%"，继承父元素的宽高即可。
### 使用文档：
1、默认图片懒加载效果
```
// html代码
<div id="container">
    <div style="width: 400px;height: 400px;"><img _src="public/image/1.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/2.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/3.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/4.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/5.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/6.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/7.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/8.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/9.jpg" style="width:100%;height:100%;" alt=""></div>
    <div style="width: 400px;height: 400px;"><img _src="public/image/10.jpg" style="width:100%;height:100%;" alt=""></div>
</div>
```
```
// js代码
var container = document.getElementById('container');
var lazy = Lazyload(container , {
    throttleTime : 100,
    complete : function () {
        console.log('图片加载完成');
    }
});
```
2、点击更多，加载图片功能
```
lazy.addMoreImage();
```
### 用法：
```
new Lazyload(element , options)
```
或者
```
Lazyload(element , options)
```
#### options参数：
---|---|---|---|
throttleTime | 100 | 否 | 设置触发滚动条事件的频率，单位是毫秒
complete | 无 | 否 | 图片加载完成之后的回调

### 注意点：
该组件的img标签有一个"_src"属性，该属性指向需要加载的图片路径。所以我们在使用这个组件的时候img标签，一定是这样的：
```
<img _src="xxx.jpg" />
```