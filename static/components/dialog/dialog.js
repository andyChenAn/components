;(function () {
    var root = (typeof self === 'object' && self.self == self && self)
            || (typeof global === 'object' && global.global == global && global)
            || this || {};
    function Dialog (element , options) {
        if (!(this instanceof Dialog)) {
            return new Dialog(element , options);
        }
        var defaults = {
            title : '提示',
            titleShow : true,
            style : 'default',
            type : 'alert',
            content : '',
            
            closeBtnShow : false
        };
        this.target = element;
        this.settings = _.extend({} , defaults , options);
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
        var alertHtml = '<div id="dialog" class="dialog dialog-show">'+
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
        var confirmHtml = '<div id="dialog" class="dialog dialog-show">'+
                            '<div class="dialog-mask" id="dialog-mask"></div>'+
                            '<div id="dialog-content" class="dialog-content">'+
                                '<div id="dialog-content-header" class="dialog-content-header">'+ this.settings.title +'</div>'+
                                '<div id="dialog-content-body" class="dialog-content-body">'+ this.settings.content +'</div>'+
                                '<div id="dialog-content-footer" class="dialog-content-footer">'+
                                    '<button class="dialog-btn">取消</button>'+
                                    '<button class="dialog-btn">确定</button>'+
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
        }
        this.dialogBox.innerHTML = html;
        document.body.appendChild(this.dialogBox);
        // 获取相关DOM节点
        this.getDOM();
        // 绑定相关DOM节点的事件处理函数
        this.bindEvents();
        // 根据传入的参数来确定最终展示在页面上的DOM
        this.checkDOM();
    };
    Dialog.prototype.checkDOM = function () {
        if (!this.settings.title) {
            this.dialogTitle.parentNode.removeChild(this.dialogTitle);
        }
    };
    Dialog.prototype.getDOM = function () {
        this.dialog = document.getElementById('dialog');
        this.btns = document.getElementsByClassName('dialog-btn');
        this.dialogTitle = document.getElementById('dialog-content-header');
    };
    Dialog.prototype.bindEvents = function () {
        for (var i = 0 , len = this.btns.length ; i < len ; i++) {
            this.btns[i].addEventListener('click' , this.handleBtnClick.bind(this));
        }
    };
    Dialog.prototype.handleBtnClick = function (e) {
        this.dialogBox.parentNode.removeChild(this.dialogBox);
        for (var i = 0 , len = this.btns.length ; i < len ; i++) {
            this.btns[i].removeEventListener('click');
        }
    };
    root.Dialog = Dialog;
})();