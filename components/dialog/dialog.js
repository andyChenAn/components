;(function () {
    var root = (typeof self === 'object' && self.self == self && self)
            || (typeof global === 'object' && global.global == global && global)
            || this || {};
    var mobileUtil = (function () {
        var ua = window.navigator.userAgent;
        var isAndroid = /android|adr/gi.test(ua);
        var isIOS = /iphone|ipad|ipod/gi.test(ua);
        var platform = isIOS ? 'ios' : isAndroid ? 'android' : 'default';
        var isSupportTouch = 'ontouchstart' in document ? true : false;
        return {
            isAndroid : isAndroid,
            isIOS : isIOS,
            platform : platform,
            isSupportTouch : isSupportTouch
        };
    })();
    /**
     * 弹框类
     * @param {object} element 
     * @param {object} options 
     */
    function Dialog (element , options) {
        if (!(this instanceof Dialog)) {
            return new Dialog(element , options);
        }
        var defaults = {
            title : '提示',      // 弹框标题
            titleShow : true,      // 是否显示弹框标题
            style : 'default',    // 弹框风格，根据ios或android来展示不同的弹框效果
            type : 'alert',      // 弹框类型
            content : '',        // 弹框内容
            closeBtnShow : false,      // 是否显示关闭按钮
            autoClose : 0,                // 是否允许多少毫秒之后自动关闭，默认为0
            maskClose : false,        // 是否允许点击遮罩层关闭弹框
            buttonClassConfirm : '',
            buttonClassCancel : ''
        };
        this.target = element;
        this.closed = false;
        this.settings = Object.assign({} , defaults , options);
        // 初始化
        this.init();
    };
    Dialog.prototype.init = function () {
        // 绑定事件
        this.target.addEventListener('click' , this.handleClick.bind(this));
    };
    Dialog.prototype.handleClick = function (e) {
        this.renderDOM();
    };
    Dialog.prototype.renderDOM = function () {
        this.dialogBox = document.createElement('div');
        var html = '';
        var buttonTextConfirm = '确定' , buttonTextCancel = '取消' , platform = '';
        if (this.settings.buttonTextConfirm) {
            buttonTextConfirm = this.settings.buttonTextConfirm;
        };
        if (this.settings.buttonTextCancel) {
            buttonTextCancel = this.settings.buttonTextCancel;
        };
        if (this.settings.style == 'android') {
            platform = 'android';
        } else if (this.settings.style == 'ios') {
            platform = 'ios';
        } else if (this.settings.style == 'default') {
            platform = mobileUtil.platform;
        } else {
            platform = 'ios';
        };
        var alertHtml = '<div id="dialog" class="dialog dialog-show" data-style='+ platform +'>'+
                        '<div class="dialog-mask" id="dialog-mask"></div>'+
                        '<div id="dialog-content" class="dialog-content">'+
                            '<div id="dialog-content-header" class="dialog-content-header">'+ this.settings.title +'</div>'+
                            '<div id="dialog-content-body" class="dialog-content-body">'+ this.settings.content +'</div>'+
                            '<div id="dialog-content-footer" class="dialog-content-footer">'+
                                '<button class="dialog-btn">确定</button>'+
                            '</div>'+
                            '<div id="dialog-close-btn" class="dialog-close-btn">+</div>'+
                        '</div>'+
                    '</div>';
        var confirmHtml = '<div id="dialog" class="dialog dialog-show" data-style='+ platform +'>'+
                            '<div class="dialog-mask" id="dialog-mask"></div>'+
                            '<div id="dialog-content" class="dialog-content">'+
                                '<div id="dialog-content-header" class="dialog-content-header">'+ this.settings.title +'</div>'+
                                '<div id="dialog-content-body" class="dialog-content-body">'+ this.settings.content +'</div>'+
                                '<div id="dialog-content-footer" class="dialog-content-footer">'+
                                    '<button class="dialog-btn dialog-btn-cancel'+ this.settings.buttonClassConfirm +'" data-index="0">'+ buttonTextCancel +'</button>'+
                                    '<button class="dialog-btn dialog-btn-confirm'+ this.settings.buttonClassCancel +'" data-index="1">'+ buttonTextConfirm +'</button>'+
                                '</div>'+
                                '<div id="dialog-close-btn" class="dialog-close-btn">+</div>'+
                            '</div>'+
                        '</div>';
        switch (this.settings.type) {
            case 'alert':
                html = alertHtml;
            break;
            case 'confirm':
                html = confirmHtml;
            break;
        };
        // 显示弹框
        this.showDialog(html);
        // 获取相关DOM节点
        this.getDOM();
        // 绑定相关DOM节点的事件处理函数
        this.bindEvents();
        // 根据传入的参数来确定最终展示在页面上的DOM和弹框效果
        this.check();
    };
    Dialog.prototype.showDialog = function (html) {
        this.closed = false;
        typeof this.settings.beforeShow == 'function' && this.settings.beforeShow.call(this);
        this.dialogBox.innerHTML = html;
        document.body.appendChild(this.dialogBox);
        // 如果设置了多个按钮，那么插入多个按钮
        if (this.settings.buttons) {
            var btnParent = document.getElementById('dialog-content-footer');
            var btnHtml = '';
            for (var i = 0 ; i < this.settings.buttons.length ; i++) {
                if (i == this.settings.buttons.length - 1) {
                    var btn = '<button class="dialog-btn dialog-btn-confirm">'+ this.settings.buttons[i].name +'</button>';
                } else {
                    var btn = '<button class="dialog-btn dialog-btn-cancel">'+ this.settings.buttons[i].name +'</button>';
                }
                btnHtml += btn;
            };
            btnParent.innerHTML = btnHtml;
        }
        typeof this.settings.show == 'function' && this.settings.show.call(this);
    };
    Dialog.prototype.check = function () {
        if (!this.settings.titleShow) {
            this.dialogTitle.parentNode.removeChild(this.dialogTitle);
        };
        if (!this.settings.closeBtnShow) {
            this.closeBtn.parentNode.removeChild(this.closeBtn);
        };
        if (this.settings.autoClose) {
            setTimeout(this.closeDialog.bind(this) , this.settings.autoClose)
        };
    };
    Dialog.prototype.getDOM = function () {
        this.dialog = document.getElementById('dialog');
        this.btns = document.getElementsByClassName('dialog-btn');
        this.dialogTitle = document.getElementById('dialog-content-header');
        this.closeBtn = document.getElementById('dialog-close-btn');
        this.mask = document.getElementById('dialog-mask');
    };
    Dialog.prototype.bindEvents = function () {
        var self = this;
        for (var i = 0 , len = this.btns.length ; i < len ; i++) {
            if (this.settings.buttons) {
                this.btns[i].addEventListener('click' , this.customButtonClick.bind(this , i));
            } else {
                this.btns[i].addEventListener('click' , this.handleBtnClick.bind(this));
            }
        };
        // 如果允许点击遮罩层关闭弹框
        if (this.settings.maskClose) {
            this.mask.addEventListener('click' , this.closeDialog.bind(this));
        };
        // 如果允许显示关闭按钮，那么给关闭按钮绑定事件
        if (this.settings.closeBtnShow) {
            this.closeBtn.addEventListener('click' , this.handleClickClose.bind(this));
        };
        ['animationend' , 'webkitAnimationend'].forEach(function (name) {
            self.mask.addEventListener(name , self.onAnimationEnd.bind(self));
        });
    };
    Dialog.prototype.handleClickClose = function (e) {
        typeof this.settings.onClickCloseBtn == 'function' && this.settings.onClickCloseBtn.call(this);
        this.closeDialog();
    };
    Dialog.prototype.customButtonClick = function (index , e) {
        this.settings.buttons[index].callback.call(this , e);
        this.closeDialog();
    };
    Dialog.prototype.handleBtnClick = function (e) {
        var index = e.target.getAttribute('data-index');
        var value = e.target.innerText;
        // 触发点击button按钮的回调函数
        this.clickButtonCallback(index , value);
        // 关闭弹框
        this.closeDialog();
    };
    Dialog.prototype.clickButtonCallback = function (index , value) {
        switch (value) {
            case '取消':
                typeof this.settings.onClickConfirmBtn == 'function' && this.settings.onClickCancelBtn.call(this , index , value);
            break;
            case '确定':
                typeof this.settings.onClickCancelBtn == 'function' && this.settings.onClickConfirmBtn.call(this , index , value);
            break;
            default:
                typeof this.settings.onClickBtn == 'function' && this.settings.onClickBtn.call(this , index , value);
        };
    };
    Dialog.prototype.closeDialog = function () {
        if (!this.closed) {
            this.closed = true;
            this.dialog.classList.remove('dialog-show');
            this.dialog.classList.add('dialog-hide');
            typeof this.settings.beforeClose == 'function' && this.settings.beforeClose.call(this);
        };
    };
    Dialog.prototype.onAnimationEnd = function () {
        if (this.closed) {
            this.dialogBox.parentNode.removeChild(this.dialogBox);
            for (var i = 0 , len = this.btns.length ; i < len ; i++) {
                this.btns[i].removeEventListener('click');
            };
            typeof this.settings.close == 'function' && this.settings.close.call(this);
        }
    }
    root.Dialog = Dialog;
})();