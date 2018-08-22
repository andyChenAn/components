# ripple组件（水波纹组件）
第一次看到水波纹效果是在别人的博客上面，感觉很神奇，一般水波纹效果出现在按钮被点击的时候。
### 介绍
ripple组件适用于PC和移动端，目前兼容现代浏览器，对于IE浏览器没有测试过，不过如果想用这种效果的话，一般都是在现代浏览器或手机上。
### 用法：
```
new Ripple(element , options)
```
或者
```
Ripple(element , options)
```
需要注意的是，目前还没有支持传入options参数，options参数是一个可选项。element表示的是，需要触发水波纹效果的点击目标，同时该element必须要有："overflow:hidden;position:relative;"样式。
### 实现原理：
当点击目标元素时，创建一个标签，并通过css3的animation来设置标签的水波纹效果，监听animation动画结束的事件，当结束时就删除该标签。难点在于，获取该标签的中心点位置。