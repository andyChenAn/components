# 图片上传组件
图片上传组件，一般网站都会使用到，而且图片上传组件的预览效果也是多种多样。我这里只是写了一种，其他的大家可以参考写出自己想要的效果。
### 介绍
图片上传组件适用于PC端和移动端，采用原生js编写，不依赖任何库或框架，目前支持现代浏览器以及IE10及以上浏览器。该组件上传主要是通过原生的ajax来实现，后端是通过nodejs来实现。
### 使用文档：

```
// html代码：
<div class="container">
    <input type="file" name="upload" id="file" multiple>
    <span class="dropArea" id="dropZoom">可将图片拖到此处</span>
    <!-- 存放预览图的容器 -->
    <div id="preview-box" class="preview-box"></div>
</div>
```

```
// js代码：
var file = document.getElementById('file');
var previewBox = document.getElementById('preview-box');
var dropZoom = document.getElementById('dropZoom');
Upload([file , dropZoom] , {
    previewBox : previewBox,      // 存放预览图的容器
    autoUpload : false,           // 是否自动上传
    width : 70,       // 预览图的宽度
    height : 'auto',       // 预览图的高度
    size : 1024 * 1024 * 20,    // 允许上传图片的大小
    onDragOver : function (dropDom) {
        console.log('dragover');
    },
    onDragLeave : function (dropDom) {
        console.log('dragleave');
    },
    success : function (file , result) {
        console.log(file.name + '上传成功');
    },
    fail : function (file , err) {
        console.log(file.name + '上传失败');
    },
    complete : function () {
        console.log('所有图片都已经上传成功')
    }
});
```
### 用法：
element参数可以是一个包含input标签和拖拽区域标签的数组，也可以是单独的一个标签元素
```
new Upload(element , options)
```
或者

```
Upload(element , options)
```
#### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---|
previewBox | document.body | 否 | 存放预览图的容器
autoUpload | false | 否 | 是否自动上传
width | 70 | 否 | 预览图的宽度，也可以是字符串或者百分比
height | 70 | 否 | 预览图的高度，也可以是字符串或者百分比
size | 1024 * 1024 * 2 | 否 | 允许上传图片的最大尺寸
onDragOver | function () {} | 否 | 在图片上传区域里拖拽图片过程中执行的回调
onDragLeave | function () {} | 否 | 在图片上传区域里拖拽图片放下时执行的回调
success | function () {} | 否 | 每一张图片上传成功后的回调
fail | function () {} | 否 | 每一种图片上传失败后的回调
complete | function () {} | 否 | 所有图片上传完的回调
