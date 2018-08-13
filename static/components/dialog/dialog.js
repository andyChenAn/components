;(function () {
    var root = (typeof self === 'object' && self.self == self && self)
            || (typeof global === 'object' && global.global == global && global)
            || this || {};
    function Dialog (element , options) {
        if (!(this instanceof Dialog)) {
            return new Dialog(element , options);
        }
        var defaults = {
            title : '提示'
        };
        this.target = element;
        this.settings = _.extend({} , defaults , options);
        // 初始化
        this.init();
    };
    Dialog.prototype.init = function () {
        // 初始化弹框DOM
        this.renderDOM();
        // 绑定事件
        this.target.addEventListener('click' , this.handleClick.bind(this));
    };
    Dialog.prototype.handleClick = function (e) {
        
    };
    Dialog.prototype.renderDOM = function () {
        
    };
    root.Dialog = Dialog;
})();