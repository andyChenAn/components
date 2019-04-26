(function () {
    var root = (typeof self == 'object' && self.self == self && self)
            || (typeof global == 'object' && global.global == global && global)
            || this || {};
    // 兼容事件绑定方法addEventListener
    var eventUtil = {
        addEvent : function (element , type , handler) {
            if (window.addEventListener) {
                element.addEventListener(type , handler);
            } else {
                element.attachEvent('on' + type , handler);
            }
        },
        removeEvent : function (element , type , handler) {
            if (window.removeEventListener) {
                element.removeEventListener(type , handler);
            } else {
                element.detachEvent('on' + type , handler);
            }
        }
    };
    // 兼容函数的bind方法
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var args = Array.prototype.slice.call(arguments , 1);
        var self = this;
        var noop = function () {};
        var bound = function () {
            var bindArgs = Array.prototype.slice.call(arguments);
            return self.apply(this instanceof bound ? this : context , args.concat(bindArgs));
        };
        noop.prototype = bound.prototype;
        this.prototype = new noop();
        return bound;
    };
    // 兼容document.getElementsByClassName()方法，IE8不支持该方法
    document.getElementsByClassName = document.getElementsByClassName || function (className) {
        var elements = document.getElementsByTagName('*');
        var result = [];
        for (var i = 0 ; i < elements.length ; i++) {
            if (elements[i].nodeType == 1 && elements[i].className.indexOf(className) > -1 ) {
                var classes = elements[i].className.split(' ');
                for (var j = 0 ; j < classes.length ; j++) {
                    if (classes[j] == className) {
                        result.push(elements[i]);
                    }
                }
                
            }
        }
        return result;
    };
    function Dialog (element , options) {
        var defaults = {
            title : '',            // 弹框的标题
            content : '',          // 弹框的内容
            width : 400,           // 弹框的宽度
            showClose : true,       // 是否显示关闭右上角的关闭按钮
            type : 'alert',         // 弹框的类型，type的值可以是"alert","comfirm","prompt","tips","loading"
            cancelButtonText : '取消',      // 取消按钮文字
            comfirmButtonText : '确定',     // 确定按钮文字
            showCancelButton : false,       // 是否显示取消按钮
            showComfirmButton : true,        // 是否显示确定按钮
            beforeDialogShow : function () {},     // 弹框显示前的回调函数
            dialogShow : function () {},           // 弹框显示后的回调函数
            beforeDialogClose : function () {},      // 弹框消失前的回调函数
            dialogClose : function () {},           // 弹框消失后的回调函数
            cancelButtonClass : '',        // 取消按钮的自定义样式类
            confirmButtonClass : '',        // 确定按钮的自定义样式类
            showMask : true,           // 是否显示遮罩层
            showButtonLoading : false     // 是否显示点击“确定按钮”后的按钮loading效果

        };
        this.options = _.extend({} , defaults , options);
        this.init();
    };
    Dialog.prototype.init = function () {
        var dialogContent = '<div class="dialog-box">'+
                                '<div class="dialog-content-box">'+
                                    '<div class="dialog-title">'+
                                        '<span>' + this.options.title + '</span>'+
                                        '<button class="dialog-close-button">X</button>'+
                                    '</div>'+
                                    '<div class="dialog-content">' + this.options.content + '</div>'+
                                    '<div class="dialog-buttons">'+
                                        
                                    '</div>'+
                                '</div>'+
                            '</div>';
        var dialogMask = '<div class="dialog-mask"></div>';
        var dialogWrapper = document.createElement('div');
        var maskWrapper = document.createElement('div');
        maskWrapper.innerHTML = dialogMask;
        dialogWrapper.innerHTML = dialogContent;
        var dialogDOM = dialogWrapper.firstChild;
        var maskDOM = maskWrapper.firstChild;
        document.body.appendChild(dialogDOM);
        document.body.appendChild(maskDOM);

        

        // var dialogBox = document.createElement('div');
        // dialogBox.className = 'dialog-box';

        // var dialogContentBox = document.createElement('div');
        // dialogContentBox.className = 'dialog-content-box';

        // var dialogTitle = document.createElement('div');
        // dialogTitle.className = 'dialog-title';

        // var dialogContent = document.createElement('div');
        // dialogContent.className = 'dialog-content';

        // var dialogButtons = document.createElement('div');
        // dialogButtons.className = 'dialog-buttons';

        // var dialogMask = document.createElement('div');
        // dialogMask.className = 'dialog-mask';

        // dialogContentBox.appendChild(dialogTitle);
        // dialogContentBox.appendChild(dialogContent);
        // dialogContentBox.appendChild(dialogButtons);

    }
    root.Dialog = Dialog;
})();