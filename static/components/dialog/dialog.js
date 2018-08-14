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
        var html = '<div id="dialog" class="dialog dialog-show">'+
                        '<div class="dialog-mask" id="dialog-mask"></div>'+
                        '<div id="dialog-content" class="dialog-content">'+
                            '<div id="dialog-content-header" class="dialog-content-header">'+ this.settings.title +'</div>'+
                            '<div id="dialog-content-body" class="dialog-content-body">'+ this.settings.content +'</div>'+
                            '<div id="dialog-content-footer" class="dialog-content-footer">'+
                                '<button class="dialog-btn">确定</button>'+
                            '</div>'+
                            '<div id="dialog-close-btn" class="dialog-close-btn"></div>'+
                        '</div>'+
                    '</div>';
        this.dialogBox.innerHTML = html;
        document.body.appendChild(this.dialogBox);
        // 获取相关DOM节点
        this.getDOM();
        // 绑定相关DOM节点的事件处理函数
        this.bindEvents();
    };
    Dialog.prototype.getDOM = function () {
        this.dialog = document.getElementById('dialog');
        this.btns = document.getElementsByClassName('dialog-btn');
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