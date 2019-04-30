# 弹框组件（PC版）
在PC中，我们经常会见到各种各样的弹框，有的是确认框，有的是提示框，有的是提交框等，虽然说它们的种类很多，但是弹框的基本逻辑类似，不同的主要就是弹框的内容以及弹框的展示效果。

### 介绍
这个弹框组件适用于PC端，在PC端中，一般弹框的内容主要分为三个部分，第一个部分是弹框标题，第二个部分是弹框内容，第三个部分是弹框的按钮，所以这个弹框组件也是有这三部分组成，弹框标题，弹框内容，弹框按钮都是用户自己可以自定义配置。该弹框组件兼容IE9及以上浏览器，在IE8浏览器上也可以使用，不过不支持透明度变化效果。

### 用法

```javascript
new Dialog(options);
```
或者

```javascript
Dialog(options)
```
### 使用文档
- 1、消息提示框

```
var btn1 = document.getElementById('btn1');
btn1.onclick = function () {
    new Dialog({
        title : '消息提示框',
        content : '这是一个消息提示框',
        type : 'alert',
        showClose : true,
        width : '600px',
        confirmButtonClass : 'confirm-button-custom',
        closeBtn : '<span class="iconfont icon-guanbi"></span>'
    });
}
```
- 2、消息确认框

```
var btn2 = document.getElementById('btn2');
btn2.onclick = function () {
    new Dialog({
        title : '消息确认框',
        content : '是否需要删除该数据？',
        showClose : true,
        showConfirmButton : true,
        showCancelButton : true,
        width : '400px',
        closeBtn : '<span class="iconfont icon-guanbi"></span>'
    });
};
```
- 3、自定义弹框

```
var btn3 = document.getElementById('btn3');
btn3.onclick = function () {
    Dialog({
        title : '内容提交框',
        content : '<input id="dialog-input" class="dialog-input" placeholder="请输入要提交的内容" />',
        width : '500px',
        showClose : true,
        dialogShow : function () {
            var input = document.getElementById('dialog-input');
            input.focus();
        }
    });
}
```
- 4、自定义按钮弹框

```
var btn4 = document.getElementById('btn4');
btn4.onclick = function () {
    Dialog({
        title : '自定义按钮弹框',
        content : '这是一个自定义按钮弹框',
        width : '500px',
        buttons : [
            {
                text : '取消发送请求',
                className : 'cancel-send-button',
                callback : function () {
                    alert('取消发送请求');
                }
            },
            {
                text : '发送请求',
                className : 'send-button',
                callback : function () {
                    alert('发送请求');
                }
            },
            {
                text : '添加',
                className : 'send-button',
                callback : function () {
                    alert('添加')
                }
            },
            {
                text : '删除',
                className : 'send-button',
                callback : function () {
                    alert('删除')
                }
            }
        ]
    });
}
```
- 5、自定义弹框

```
var btn5 = document.getElementById('btn5');
btn5.onclick = function () {
    Dialog({
        title : '这是一个自定义弹框',
        content : '<div>'+
                    '<h2>可点评该公司的优秀、不足、建议等</h2>'+
                    '<textarea class="textarea"></textarea>'+
                    '<button class="submit">提交</button>'+
                '</div>',
        width : '500px',
        noButtons : true,
        closeBtn : '<span class="iconfont icon-guanbi"></span>'
    })
};
```
### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---
title | 空字符串 | 是 | 弹框的标题
content | 空字符串 | 是 | 弹框的内容
width | auto | 否 | 弹框的宽度，值必须是字符串，类似"100px"这种
closeBtn | 'X' | 否  | 弹框的关闭按钮，可以是图片，也可以是字体图标，默认就是一个"X"
showClose | true | 否 | 是否显示弹框关闭按钮
cancelButtonText | 取消 | 否 | 弹框取消按钮的文字描述，默认是"取消"
confirmButtonText | 确定 | 否 | 弹框确认按钮的文字描述，默认是"确定"
showCancelButton | false | 否 | 是否显示取消按钮，默认"不显示"
showConfirmButton | true | 否 | 是否显示确认按钮，默认"显示"
noButtons | false | 否 | 弹框是否需要按钮，默认为false
buttons | [ ] | 否 | 弹框是否需要自定义按钮，默认是一个空数组
beforeDialogShow | function () {} | 否 | 弹框显示前的回调函数，默认是一个空函数
dialogShow | function () {} | 否 | 弹框显示后的回调函数，默认是一个空函数
beforeDialogClose | function () {} | 否 | 弹框关闭前的回调函数，默认是一个空函数
dialogClose | function () {} | 否 | 弹框关闭后的回调函数，默认是一个空函数
cancelButtonClass | 空字符串 | 否 | 取消按钮的自定义样式类，默认是一个空字符串
confirmButtonClass | 空字符串 | 否 | 确认按钮的自定义样式类，默认是一个空字符串
showMask | true | 否 | 是否显示遮罩层，默认为true，显示遮罩层，这里设置为false没有效果，因为没有做过这个处理

#### 注意点：
自义定按钮的buttons字段的数据结构是这样的：
```
[
    {
        text : '取消发送请求',
        className : 'cancel-send-button',
        callback : function () {
            alert('取消发送请求');
        }
    },
    {
        text : '发送请求',
        className : 'send-button',
        callback : function () {
            alert('发送请求');
        }
    },
    {
        text : '添加',
        className : 'send-button',
        callback : function () {
            alert('添加')
        }
    },
    {
        text : '删除',
        className : 'send-button',
        callback : function () {
            alert('删除')
        }
    }
]
```
其中text表示的是按钮的文字描述，className表示的是按钮的样式类，callback表示的是点击按钮之后的回调函数。
