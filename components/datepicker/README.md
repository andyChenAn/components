# 日期选择组件
日期选择组件比较常用，一般电商网站或者一些表单中都需要用到选择日期功能。
### 介绍
日期选择组件适用于PC端，采用原生js编写，不依赖任何库或框架，目前支持现代浏览器以及IE8及以上浏览器（IE8浏览器中，top和left属性需要设置，不然通过默认的方式获取会报错，由于时间关系，这里就没有去修复）

该组件的难点应该在于如何将日期数据转为自己可以方便方便操作的数据结构，其实日期选择组件，主要都是通过日期对象的方法来实现。
### 使用文档：

```
// html代码：
<input type="text" placeholder="请选择日期" id="datepicker" style="padding: 5px;outline: none;">
```

```
// js代码：
var datepicker = document.getElementById('datepicker');
Datepicker(datepicker , {
    format : 'YYYY:MM:DD',
    joiner : '-',
    onChange : function () {
        console.log(this.currentDate)
    }
});
```
1、可以通过options的top和left属性来设置日期选择框距离窗口的顶部和左边的距离。


```
Datepicker(datepicker , {
    top : 100,
    left : 40,
    format : 'YYYY:MM:DD',
    joiner : '-',
    onChange : function () {
        console.log(this.currentDate)
    }
});
```
2、可以通过joiner属性来设置选择日期后的年月日之间的连接符。默认为"-"。

```
Datepicker(datepicker , {
    format : 'YYYY:MM:DD',
    joiner : '-',
    onChange : function () {
        console.log(this.currentDate)
    }
});
```
3、可以通过format属性来设置日期的格式。默认：年是四个数，月是两个数，日是两个数。

```
Datepicker(datepicker , {
    format : 'YY:MM:DD',
    joiner : '-',
    onChange : function () {
        console.log(this.currentDate)
    }
});
```
### 用法：

```
new Datepicker(element , options)
```
或者

```
Datepicker(element , options)
```
#### options参数

参数 | 默认值 | 是否必须 | 说明
---|---|---|---
top | 无 | 否 | 离窗口顶部的距离
left | 无 | 否 | 离窗口左边的距离
format | 'YYYY:MM:DD' | 否 | 日期格式
joiner | '-' | 否 | 日期之间的连接符
onChange | 无 | 否 | 选择一个日期后的回调
