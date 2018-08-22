# 弹框组件
弹框组件是一个比较常见的组件，不管是在PC还是在移动端。
### 介绍
弹框组件适用于移动端，目前提供了两种类型的弹框，一种是alert类型，一种是confirm类型，同时也提供了检查手机类型的功能，根据手机的系统类型选择不同的弹框方式，目前支持ios和android两种。除此之外，我们可以自定义弹框的标题，弹框的内容，弹框的按钮。
### 使用文档
- 1、alert弹框类型

默认类型：
```
var btn1 = document.getElementById('btn1');
Dialog(btn1 , {
    content : '我是一个弹框，我来自andy'
});
```
自定义弹框标题
```
var btn2 = document.getElementById('btn2');
Dialog(btn2 , {
    title : '这是一个标题',
    content : '我是一个弹框，我来自andy'
});
```
无标题弹框
```
var btn3 = document.getElementById('btn3');
Dialog(btn3 , {
    titleShow : false,
    content : '我是一个弹框，我来自andy'
});
```
自动关闭弹框
```
var btn4 = document.getElementById('btn4');
Dialog(btn4 , {
    title : '我是一个标题',
    content : '我是一个弹框，我来自andy',
    autoClose : 1000
});
```
点击遮罩层关闭弹框
```
var btn5 = document.getElementById('btn5');
Dialog(btn5 , {
    title : '我是一个标题',
    content : '我是一个弹框，我来自andy',
    maskClose : true
});
```
- 2、confirm弹框类型

默认
```
var btn6 = document.getElementById('btn6');
Dialog(btn6 , {
    content : '我是一个弹框，我来自andy',
    type : 'confirm'
});
```
自定义按钮文字
```
var btn7 = document.getElementById('btn7');
Dialog(btn7 , {
    title : '发现新版本',
    content : 'Android系统已经更新至9.0版本，是否更新！',
    type : 'confirm',
    buttonTextConfirm : '现在升级',
    buttonTextCancel : '下次再说'
});
```
自定义按钮样式
```
var btn8 = document.getElementById('btn8');
Dialog(btn8 , {
    title : '发现新版本',
    content : 'Android系统已经更新至9.0版本，是否更新！',
    type : 'confirm',
    buttonClassConfirm : 'dialog-confirm',
    buttonClassCancel : 'dialog-cancel'
});
```
点击按钮后的回调
```
var btn9 = document.getElementById('btn9');
Dialog(btn9 , {
    title : '发现新版本',
    content : 'Android系统已经更新至9.0版本，是否更新！',
    type : 'confirm',
    closeBtnShow : true,
    onClickConfirmBtn : function (index , value) {
        console.log(index , value);
    },
    onClickCancelBtn : function (index , value) {
        console.log(index , value);
    },
    onClickCloseBtn : function () {
        console.log('点击了关闭按钮');
    }
});
```
弹框生命周期钩子
```
var btn10 = document.getElementById('btn10');
Dialog(btn10 , {
    title : '发现新版本',
    content : 'Android系统已经更新至9.0版本，是否更新！',
    type : 'confirm',
    closeBtnShow : true,
    onClickConfirmBtn : function (index , value) {
        console.log(index , value);
    },
    onClickCancelBtn : function (index , value) {
        console.log(index , value);
    },
    onClickCloseBtn : function () {
        console.log('点击了关闭按钮');
    },
    beforeShow : function () {
        alert('弹框显示前');
    },
    show : function () {
        alert('弹框显示后');
    },
    beforeClose : function () {
        alert('弹框关闭前');
    },
    close : function () {
        alert('弹框关闭后');
    }
});
```
按弹框风格弹框
```
var btn11 = document.getElementById('btn11');
Dialog(btn11 , {
    title : '我是一个弹框',
    content : '我是一个弹框，我来自andy',
    style : 'default',
    type : 'confirm'
})
```
自定义button按钮
```
var btn12 = document.getElementById('btn12');
Dialog(btn12 , {
    title : '我是一个弹框',
    content : '我是一个弹框，我来自andy,我是一个弹框，我来自andy,我是一个弹框，我来自andy',
    style : 'default',
    buttons : [
        {
            name : '不再提醒',
            callback : function (e) {
                console.log('不再提醒');
            }
        },
        {
            name : '下次再说',
            callback : function (e) {
                console.log('下次再说');
            }
        },
        {
            name : '现在升级',
            callback : function (e) {
                console.log('现在升级');
            }
        }
    ]
})
```
### 用法
```
new Dialog(element , options)
```
或者

```
Dialog(element , options)
```
#### options参数：
参数 | 默认值 | 是否必须 | 说明
---|---|---|---|
title | '提示' | 否 | 弹框标题
titleShow | true | 否 | 是否显示弹框标题
style | 'default' | 否 | 弹框风格，默认为default，按照手机系统来弹框，其他值：'ios'，'android'
type | 'alert' | 否 | 弹框类型
content | 无 | 否 | 弹框内容
closeBtnShow | false | 否 | 布尔值，是否显示关闭按钮
autoClose | 0 | 否 | 是否允许多少毫秒之后自动关闭，默认为0
maskClose | false | 否 | 是否允许点击遮罩层关闭弹框，默认不允许
buttonClassConfirm | '' | 否 | 自定义"确定按钮"样式类
buttonClassCancel | '' | 否 | 自定义"取消按钮"样式类
onClickConfirmBtn | 无 | 否 | 点击确定按钮的回调函数
onClickCancelBtn | 无 | 否 | 点击取消按钮的回调函数
onClickCloseBtn | 无 | 否 | 点击关闭按钮的回调函数
beforeShow | 无 | 否 | 弹框显示前的事件钩子
show | 无 | 否 | 弹框显示后的事件钩子
beforeClose | 无 | 否 | 弹框关闭前的事件钩子
close | 无 | 否 | 弹框关闭后的事件钩子
buttons | 无 | 否 | 自定义button按钮，是一个数组，内部结构：[{name : '确定' , callback : function () {}} , ...]，按钮不要太多。