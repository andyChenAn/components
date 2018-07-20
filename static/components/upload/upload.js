;(function () {
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
    function Upload (element , options) {
        if (!(this instanceof Upload)) {
            return new Upload(element , options);
        }
        var defaults = {
            uploadMore : false
        };
        this.target = element;
        this.options = _.extend({} , defaults , options);
        this.init();
    };
    Upload.prototype.init = function () {
        // 检查options的合法性
        this.checkOptions();
        // 绑定事件
        this.initEvent();
    };
    Upload.prototype.checkOptions = function () {
        if (this.options.uploadMore) {
            this.target.setAttribute('multiple' , true);
        }
        if (!this.options.template || typeof this.options.template !== 'string') {
            throw new Error('you must have a template attribute or template attribute should be string');
        }
    }
    Upload.prototype.initEvent = function () {
        eventUtil.addEvent(this.target , 'change' , this.onChangeHandler.bind(this));
    }
    Upload.prototype.onChangeHandler = function (e) {
        if (window.FileReader && typeof FileReader == 'function') {
            this.files = e.target.files;
            var reader = new FileReader();
            var img = document.createElement('img');
            document.body.appendChild(img);
            reader.onload = function (e) {
                img.src = e.target.result;
            }
            reader.readAsDataURL(this.files[0]);
        }
    };
    root.Upload = Upload;
})();