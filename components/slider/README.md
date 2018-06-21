## 图片轮播组件
当我们使用手机在电商网站上购买东西的时候，首页一般都会存在一个图片滚动区域，定时滚动图片，同时可以滑动屏幕来切换图片，这样的效果，我们称为"轮播图"。

### 实现逻辑
- 1、touch事件处理，使用touch事件来处理图片的左右切换。
- 2、轮播图的边界处理
- 3、图片懒加载
- 4、图片自动播放

### 介绍：
图片轮播组件适用于移动端，采用原生js开发，使用过程中，只需要将html，js，css引入即可实现效果。

### 案例演示：
- 1、图片懒加载效果，html代码中的img标签的src属性只有第一个有，其他都是_src属性，当切换到第几个的时候，在替换成真正的src属性，同时将传入的options对象的lazy属性设置为true即可，默认效果也是支持图片懒加载

```
html代码：
<div class="slide-container" id="slider">
    <ul class="slider-list">
        <li class="slider-li">
            <img src="image/slider1.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider2.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider3.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider4.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider5.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider6.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider7.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img _src="image/slider8.jpg" class="slider-image" alt="">
        </li>
    </ul>
</div>
```

```
js代码：
var slider = document.getElementById('slider');
Slider(slider , {
    lazy : true
});
```
- 2、轮播图自动播放，只要将options对象的autoPlay属性设置为true即可。
```
new Slider(element , {
    lazy : true,
    autoPlay : true
});
```
- 3、不使用图片懒加载，则将lazy属性设置为false。

```
html代码：
<div class="slide-container" id="slider">
    <ul class="slider-list">
        <li class="slider-li">
            <img src="image/slider1.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider2.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider3.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider4.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider5.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider6.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider7.jpg" class="slider-image" alt="">
        </li>
        <li class="slider-li">
            <img src="image/slider8.jpg" class="slider-image" alt="">
        </li>
    </ul>
</div>
```

```
js代码：
new Slider(element , {
    lazy : false
});
```
### 调用方法：

```
// element表示图片轮播组件最外层的容器元素
// options表示传入的对象，属性包括：platform,lazy,autoPlay,dot。
new Slider(element , options)
```
或者

```
// element表示图片轮播组件最外层的容器元素
// options表示传入的对象，属性包括：platform,lazy,autoPlay,dot。
Slider(element , options)
```

#### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---
lazy | true | 否 | 是否开启图片懒加载
dot | true | 否 | 是否需要小圆圈来标记当前图片
autoPlay | false | 否 | 是否开启自动轮播

### 总结：
移动端轮播图组件开发，确实也花了一点时间，也遇到了一些问题。

1、 自动播放功能。毕竟移动端的轮播图和PC还是有一些不一样的，自动播放的时候，我们没办法模拟触发touch事件，因为模拟出来的touch事件是不包含任何触摸点的。我这里是将左右切换的相关滑动效果分别封装在两个方法里(slideRight和slideLeft)，当需要自动播放时，就直接调用slideRight方法即可。

2、图片自动播放的时候，会出现闪动。这个问题主要是因为所有当前图片的上一张图片是需要移动到下一张的位置，所以这里我将对应的图片的z-index的值设置比其他小一点，这样图层就会在其他图片的下一层。