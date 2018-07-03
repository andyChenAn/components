## 全屏滚动组件（PC端）
这个功能我自己看的比较多的是在一些公司的官网上面，一点进去就是一个通过全屏滚动来介绍公司情况。

### 介绍：
地区选择组件适用于PC版，采用原生js来实现，不依赖任何框架和库，使用css3的过渡动画属性来实现，目前支持现代浏览器以及IE8及以上浏览器，在IE9和IE8浏览器中是不支持transition属性的，所以当浏览器是IE8和IE9时，通过改变容器的top属性来进行全屏滚动，并且滚动效果只支持匀速，其实可以加上tweenjs来做缓冲动画，我这里就不加了。

1、当loop和seamless同时为true时，进行循环无缝全屏滚动。

2、当loop和seamless同时为fasle时，进行循环全屏滚动（滚动到最后一屏或第一屏时，又会滚动到最后一屏或第一屏）

3、当loop和seamless其中一个为false时，进行全屏滚动（滚动到最后一屏或第一屏时，就不会再滚动了）

### 使用文档：
```
html结构代码：
<div id="fullpage">
    <div class="section section1">1</div>
    <div class="section section2">2</div>
    <div class="section section3">3</div>
    <div class="section section4">4</div>
</div>
```
```
var fullpage = document.getElementById('fullpage');
Fullpage(fullpage , {
    easing : 'ease',        // 过渡动画效果
    loop : true,
    seamless : true,
    dot : true,
    onBefore : function () {
        console.log('滚动开始前')
    },
    onAfter : function () {
        console.log('滚动结束后')
    }
});
```

### 用法：
```
new Fullpage(element , options)
```
或者
```
Fullpage(element , options)
```
#### options参数：
参数 | 默认值 | 是否必须 | 说明
---|---|---|---
easing | 'ease' | 否 | 过渡动画效果，可以是常规的过渡动画，或者贝塞尔曲线，IE8或者IE9不支持
dot | true | 否 | 是否需要小圆圈来标记当前图片
loop | true | 否 | 是否循环滚动
seamless | true | 否 | 是否开启无缝滚动
onBefore | 无 | 否 | 滚动开始前操作
onAfter | 无 | 否 | 滚动结束后操作
duration | 500 | 否 | 滚动一屏所需的时间
