## 全屏滚动组件（PC端）
这个功能我自己看的比较多的是在一些公司的官网上面，一点进去就是一个通过全屏滚动来介绍公司情况。

### 介绍：
地区选择组件适用于PC版，采用原生js来实现，不依赖任何框架和库，使用css3的过渡动画属性来实现，目前支持现代浏览器以及IE10及以上浏览器。

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
easing | 'ease' | 否 | 过渡动画效果，可以是常规的过渡动画，或者贝塞尔曲线
dot | true | 否 | 是否需要小圆圈来标记当前图片
loop | true | 否 | 是否循环滚动
seamless | true | 否 | 是否开启无缝滚动
onBefore | 无 | 否 | 滚动开始前操作
onAfter | 无 | 否 | 滚动结束后操作
