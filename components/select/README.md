## 地区选择组件（PC端）
地区选择功能是我们经常会看到的一个功能，比如我们买东西需要填写地址，就需要用到它。

### 介绍：
地区选择组件适用于PC版，采用原生js来实现，不依赖任何框架和库，地区选择的方式有很多中，基本上我们在网上看到的地区三级联动就是一个比较常见的效果。除了三级联动，我这里还添加了弹框选择地区的方式。兼容主流的浏览器，并且兼容IE8及以上浏览器。地区数据是通过[这里](https://github.com/mumuy/data_location)获取的，这里的数据结构是json格式，而key都是地区的邮编，value都是地区。我这里通过ajax获取到地区数据之后，将其进行解析，重新返回一个新的json数据，因为地区比较多，所以解析过程中会花一点时间，而且这个组件操作DOM非常多，如果不想使用该方式，也可以找出数据结构的规律来处理，不过还是可以接受的。

三级联动效果的html结构为：
```
<div id="select">
    <select name="province" id="province">
        <option>- 请选择 -</option>
    </select>
    <select name="city" id="city">
        <option>- 请选择 -</option>
    </select>
</div>
```

弹框效果的html结构为：
```
<div id="select2" style="position: relative;">
    <label for="address">所在地址：</label>
    <input type="text" class="address" id="address">
</div>
```
里面的input标签可以换成其他标签，但是class不能删，需要用到。其他标签都是可以删除的。

### 使用文档：
- 1、默认的三级联动效果：

```
html代码：
<div id="select">
    <select name="province" id="province">
        <option>- 请选择 -</option>
    </select>
    <select name="city" id="city">
        <option>- 请选择 -</option>
    </select>
</div>
```

```
js代码：
var select = document.getElementById('select');
Select(select , {
    dataUrl : './public/components/select/area.json',
    onChange : function (value) {
        console.log(value);
    }
});
```
- 2、可初始化省份，城市，地区的三级联动效果

```
var select1 = document.getElementById('select1');
Select(select1 , {
    dataUrl : './public/components/select/area.json',
    province : '广东',
    city : '广州',
    area : '天河',
    onChange : function (value) {
        console.log(value);
    }
});
```
- 3、弹框选择地区效果
```
Select(select2 , {
    dataUrl : './public/components/select/area.json',
    type : 'pop-select',
    onLastChange : function () {
        if (arguments.length > 2) {
            address.value = arguments[0] + arguments[1] + arguments[2];
        } else {
            address.value = arguments[0] + arguments[1]
        }
    },
    onChange : function () {
        console.log('切换')
    }
});
```
- 4、可自定义弹框选择地区中的弹框的位置

```
Select(select , {
    dataUrl : './public/components/select/area.json',
    type : 'pop-select',
    setPopStyle : {
        left : '40px'
    },
    onLastChange : function () {
        if (arguments.length > 2) {
            address.value = arguments[0] + arguments[1] + arguments[2];
        } else {
            address.value = arguments[0] + arguments[1]
        }
    },
    onChange : function () {
        console.log('切换')
    }
});
```
### 调用方法：

```
new Select(element , options)
```
或者

```
Select(element , options)
```
#### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---|
dataUrl | 无 | 是 | 获取地区数据的路径
type | select | 否 | 选择通过哪种效果来选择地区，select或者pop-select
setPopStyle | 无 | 否 | 设置弹框的位置
onLastChange | 无 | 否 | 最后一次地区选择时的操作
onChange | 无 | 否 | 每次地区选择时的操作