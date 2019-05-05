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

    function animate (target , options , duration) {
        var style = target.currentStyle || window.getComputedStyle(target , null);
        var dest = {};
        var old = {};
        for (var key in options) {
            dest[key] = parseFloat(options[key]) - parseFloat(style[key]);
            old[key] = parseFloat(style[key]);
        };
        var start = new Date();
        var timer = null;
        function go () {
            var p = (new Date() - start) / duration;
            if (p >= 1) {
                for (var key in dest) {
                    if (key !== 'done') {
                        if (key == 'opacity') {
                            target.style[key] = old[key] + dest[key]
                        }
                        target.style[key] = old[key] + dest[key] + 'px';
                    }
                };
                clearTimeout(timer);
                options.done && typeof options.done == 'function' && options.done();
                return;
            } else {
                for (var key in dest) {
                    if (key !== 'done') {
                        if (key == 'opacity') {
                            target.style[key] = old[key] + dest[key] * p;
                        }
                        target.style[key] = old[key] + dest[key] * p + 'px';
                    }
                }
                timer = setTimeout(go , 16);
            }
        }
        go();
    };

    function Dialog (options) {
        if (!(this instanceof Dialog)) {
            return new Dialog(options);
        }
        var defaults = {
            title : '',            // 弹框的标题
            content : '',          // 弹框的内容
            width : 'auto',           // 弹框的宽度
            closeBtn : 'X',        // 关闭按钮，可以是图片，也可以是字体图标，默认就是一个简单的“X”
            showClose : true,       // 是否显示关闭右上角的关闭按钮
            cancelButtonText : '取消',      // 取消按钮文字
            confirmButtonText : '确定',     // 确定按钮文字
            showCancelButton : false,       // 是否显示取消按钮
            showConfirmButton : true,        // 是否显示确定按钮
            noButtons : false,               // 是否存在按钮
            buttons : [],                   // 是否需要自定义按钮
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
        // 弹框是否已经显示
        this.isShow = false;
        this.init();
    };
    Dialog.prototype.init = function () {
        this.render();
    };

    Dialog.prototype.compute = function () {
        // 是否显示右上角的关闭按钮
        if (!this.options.showClose) {
            this.closeDOM.parentNode.removeChild(this.closeDOM);
        };
        // 是否显示按钮
        if (!this.options.noButtons) {
            // 是否显示取消按钮
            if (this.options.showCancelButton) {
                var cancelButton = document.createElement('button');
                cancelButton.setAttribute('class' , 'cancel-button ' + this.options.cancelButtonClass);
                cancelButton.innerText = this.options.cancelButtonText;
                this.buttonsDOM.appendChild(cancelButton);
            };
            // 是否显示确认按钮
            if (this.options.showConfirmButton) {
                var confirmButton = document.createElement('button');
                confirmButton.setAttribute('class' , 'confirm-button ' + this.options.confirmButtonClass);
                confirmButton.innerText = this.options.confirmButtonText;
                this.buttonsDOM.appendChild(confirmButton);
            };
        } else {
            this.buttonsDOM.parentNode.removeChild(this.buttonsDOM);
        };

        // 是否需要自定义按钮，如果需要那么就会覆盖掉默认的按钮
        if (this.options.buttons.length > 0) {
            // 先清空默认按钮
            this.buttonsDOM.innerHTML = '';
            for (var i = 0 ;i < this.options.buttons.length ; i++) {
                var className = this.options.buttons[i].className;
                var buttonText = this.options.buttons[i].text;
                var button = document.createElement('button');
                button.innerText = buttonText;
                button.setAttribute('class' , className);
                this.buttonsDOM.appendChild(button);
            }
        }
    };

    Dialog.prototype.bindEvent = function () {
        // 重新赋值，主要是方便解绑事件
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleDialogAnimationend = this.handleDialogAnimationend.bind(this);
        if (this.options.showClose) {
            eventUtil.addEvent(this.closeDOM , 'click' , this.handleDialogClose);
        };
        // 给按钮绑定事件
        if (!this.options.noButtons) {
            eventUtil.addEvent(this.buttonsDOM , 'click' , this.handleButtonClick);
        }
        eventUtil.addEvent(this.dialogDOM.firstChild , 'animationend' , this.handleDialogAnimationend);
    }

    Dialog.prototype.handleButtonClick = function (e) {
        // 只有点击的是button才触发按钮点击事件，所以我们在添加自定义按钮的时候，一定要是button标签
        var target = e.target || window.event.srcElement;
        if (target.nodeName.toLowerCase() == 'button') {
            var buttonText = target.innerText;
            this.options.beforeDialogClose.call(this , this.options);
            for (var i = 0 ; i < this.options.buttons.length ; i++) {
                var newButtonText = this.options.buttons[i].text;
                var callback = this.options.buttons[i].callback;
                if (buttonText === newButtonText) {
                    callback.call(this , this.options);
                }
            };
            this.handleDialogClose();
        }
    }

    Dialog.prototype.handleDialogClose = function () {
        var self = this;
        if ('animation' in this.buttonsDOM.style) {
            this.dialogDOM.firstChild.setAttribute('class' , 'dialog-content-box hide-dialog');
            this.maskDOM.setAttribute('class' , 'dialog-mask hide-mask');
        } else {
            animate(this.dialogDOM.firstChild , {
                marginTop : 0,
                opacity : 0,
                done : function () {
                    self.handleDialogAnimationend();
                }
            } , 300);
            animate(this.maskDOM , {
                opacity : 0
            } , 300);
        }
    }

    Dialog.prototype.handleDialogAnimationend = function () {
        // 弹框是否已显示，如果没有显示，那么就显示弹框，如果已经显示，那么就关闭弹框，并执行相应的回调
        if (!this.isShow) {
            this.isShow = true;
            this.options.dialogShow && typeof this.options.dialogShow == 'function' && this.options.dialogShow.call(this , this.options);
        } else {
            this.isShow = false;
            this.unmount();
        }
    }

    Dialog.prototype.render = function () {
        var dialogContent = '<div class="dialog-box">'+
                                '<div class="dialog-content-box" style="width:'+ this.options.width +'">'+
                                    '<div id="dialog-header" class="dialog-header">'+
                                        '<div class="dialog-title">'+
                                            '<span>' + this.options.title + '</span>'+
                                        '</div>'+
                                        '<button id="dialog-close-btn" class="dialog-close-button">'+ this.options.closeBtn +'</button>'+
                                    '</div>'+
                                    '<div class="dialog-content">' + this.options.content + '</div>'+
                                    '<div id="dialog-buttons" class="dialog-buttons">'+
                                        
                                    '</div>'+
                                '</div>'+
                            '</div>';
        var dialogMask = '<div class="dialog-mask"></div>';
        var dialogWrapper = document.createElement('div');
        var maskWrapper = document.createElement('div');
        maskWrapper.innerHTML = dialogMask;
        dialogWrapper.innerHTML = dialogContent;
        this.dialogDOM = dialogWrapper.firstChild;
        this.maskDOM = maskWrapper.firstChild;

        this.dialogDOM.style.display = 'none';
        document.body.appendChild(this.dialogDOM);

        this.buttonsDOM = document.getElementById('dialog-buttons');
        this.closeDOM = document.getElementById('dialog-close-btn');
        this.headerDOM = document.getElementById('dialog-header');
        // 通过options参数来计算最终要渲染的弹框
        this.compute();

        // 绑定事件
        this.bindEvent();
        // 显示弹框
        this.show();
    };

    Dialog.prototype.show = function () {
        var self = this;
        this.options.beforeDialogShow && typeof this.options.beforeDialogShow == 'function' && this.options.beforeDialogShow.call(this , this.options);
        this.dialogDOM.style.display = 'block';
        document.body.appendChild(this.maskDOM);
        // 是否支持transition过渡动画
        if ('animation' in this.buttonsDOM.style) {
            this.dialogDOM.firstChild.setAttribute('class' , 'dialog-content-box show-dialog');
            this.maskDOM.setAttribute('class' , 'dialog-mask show-mask');
        } else {
            // 如果不支持，那么我们就使用js来实现动画效果
            // 首先将弹框和遮罩层的透明度设置为0
            this.dialogDOM.firstChild.style.opacity = 0;
            this.maskDOM.style.opacity = 0;
            // 需要注意的是，我这里设置的两个元素的动画时长都是一样的，所以只需要在一个元素里调用handleDialogAnimationend方法
            animate(this.dialogDOM.firstChild , {
                marginTop : 70,
                opacity : 1,
                done : function () {
                    self.handleDialogAnimationend();
                }
            } , 300);
            animate(this.maskDOM , {
                opacity : 0.5
            } , 300)
        }
    }

    Dialog.prototype.unmount = function () {
        this.options.dialogClose && typeof this.options.dialogClose == 'function' && this.options.dialogClose.call(this , this.options);
        eventUtil.removeEvent(this.closeDOM , 'click' , this.handleDialogClose);
        eventUtil.removeEvent(this.buttonsDOM , 'click' , this.handleButtonClick);
        eventUtil.removeEvent(this.dialogDOM.firstChild , 'animationend' , this.handleDialogAnimationend);
        document.body.removeChild(this.maskDOM);
        document.body.removeChild(this.dialogDOM);
    }
    root.Dialog = Dialog;
})();