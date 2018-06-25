## 图片轮播组件（PC端）
当我们使用手机在电商网站上购买东西的时候，首页一般都会存在一个图片滚动区域，定时滚动图片，同时可以滑动屏幕来切换图片，这样的效果，我们称为"轮播图"。


### 介绍：
图片轮播适用于PC版，采用原生js来实现，不依赖任何框架或库。使用的时候需要使用指定的html结构，再引入相应的css和js文件，当然你自己也可以根据这个组件来进行修改，成为符合自己需求的组件。兼容主流的浏览器，并且兼容IE8及以上浏览器（IE8只能使用滑动的效果，不兼容渐隐渐现的效果）。

html结构为：
```
<div class="container" id="carousel">
    <ul class="carousel-list">
        <li class="carousel-li">
            <img src="public/image/slider1.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img src="public/image/slider2.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img src="public/image/slider3.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img src="public/image/slider4.jpg" class="carousel-image" alt="">
        </li>
    </ul>
</div>
```
里面的clas也不能修改，因为css和js都会用到。该图片轮播图片，必须至少三张图片以上。

### 使用文档：
- 1、使用图片懒加载，那么就必须将lazy属性设置为true，并且在html中给img标签添加"_src"属性值为图片路径（第一个，第二个，和最后一个img标签除外）

```
html代码：
<div class="container" id="carousel">
    <ul class="carousel-list">
        <li class="carousel-li">
            <img src="public/image/slider1.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img src="public/image/slider2.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img _src="public/image/slider3.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img _src="public/image/slider4.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img _src="public/image/slider5.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img _src="public/image/slider6.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img _src="public/image/slider7.jpg" class="carousel-image" alt="">
        </li>
        <li class="carousel-li">
            <img src="public/image/slider8.jpg" class="carousel-image" alt="">
        </li>
    </ul>
</div>
```

```
js代码：
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    lazy : true,
    dot : true,
    time : 20,
    animate : true,
    loop : true,
    effect : 'slide',   // 轮播图的效果 slide or fade
    autoPlay : true,
    interval : 2000,
    onChangeStart : function () {
        console.log('移动前执行');
    },
    onChangeEnd : function () {
        console.log('移动后执行');
    }
});
```
- 2、是否显示图片轮播底部的小圆圈。只需要设置dot属性值为true即可。

```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    dot : true
});
```
- 3、如果需要控制滑动效果的速率，我们可以设置time属性，该值是一个整数，值越小，滑动效果越快，反之越慢。
```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    time : 20
});
```
- 4、图片切换的过程中是否需要动画效果，通过设置animate来实现，如果设置为true，则表示需要动画效果，否则，不需要。

```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    time : 20,
    animate : true
});
```
- 5、通过设置loop属性值来表示是否需要无缝循环轮播。仅仅当effect值为slide时，需要设置。当effect值为fade时，切换本身就是无缝的。

```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    time : 20,
    animate : true,
    loop : true
});
```
- 6、当设置effect属性时，我们可以指定图片切换过程中的动画效果，目前支持"slide"(左右滑动)和"fade"(渐隐渐现)两种。

```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    time : 20,
    animate : true,
    loop : true,
    effect : 'slide'
});
```
- 7、可以通过设置autoPlay属性来设置组件是否需要自动播放。当为true时，该组件自动播放，否则，只能手动播放。同时我们也可以设置自动播放的间隔时间，只需要设置interval属性值即可。
```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    time : 20,
    animate : true,
    loop : true,
    effect : 'slide',
    autoPlay : true,
    interval : 3000
});
```
- 8、我们也可以设置onChangeStart和onChangeEnd属性的值来设置图片切换前和切换后的操作逻辑。

```
var carousel = document.getElementById('carousel');
new Carousel(carousel , {
    lazy : true,
    dot : true,
    time : 20,
    animate : true,
    loop : true,
    effect : 'slide',   // 轮播图的效果 slide or fade
    autoPlay : true,
    interval : 2000,
    onChangeStart : function () {
        console.log('移动前执行');
    },
    onChangeEnd : function () {
        console.log('移动后执行');
    }
});
```
### 调用方法：

```
new Carousel(element , options)
```
或者

```
Carousel(element , options)
```
#### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---|
lazy | true | 否 | 是否使用图片懒加载
dot | true | 否 | 是否展示小圆圈
time | 20 | 否 | 滑动时间
animate | true | 否 | 是否使用动画效果
loop | true | 否 | 是否循环播放
effect | slide | 否 | 图片切换的动画效果
autoPlay | true | 否 | 是否自动播放
interval | 2000 | 否 | 自动播放切换图片的时间间隔
onChangeStart | function () {} | 否 | 图片切换前的操作
onChangeEnd | function () {} | 否 | 图片切换后的操作
