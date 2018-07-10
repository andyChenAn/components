;(function () {
    var root = (typeof self == 'object' && self.self == self && self)
                || (typeof global == 'object' && global.global == global && global)
                || this
                || {};
    // 兼容requestAnimationFrame和cancelAnimationFrame
    var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) {
                    setTimeout(callback , 1000 / 60);
                }
    })();
    var cancelAnimationFrame = (function () {
        return  window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                function (id) {
                    clearTimeout(id);
                }
    })();
    // 兼容函数的bind方法，在IE8及以下浏览器是不支持bind方法
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var args = Array.prototype.slice.call(arguments , 1);
        var self = this;
        var noop = function () {};
        var bound = function () {
            var bindArgs = Array.prototype.slice.call(arguments);
            return self.apply(this instanceof noop ? this : context , args.concat(bindArgs));
        }
        noop.prototype = this.prototype;
        bound.prototype = new noop();
        return bound;
    };
    // 兼容事件绑定方法addEventListener
    var eventUtils = {
        addEvents : function (element , type , handler) {
            if (window.addEventListener) {
                element.addEventListener(type , handler);
            } else {
                element.attachEvent('on' + type , handler);
            }
        },
        removeEvents : function (element , type , handler) {
            if (window.removeEventListener) {
                element.removeEventListener(type , handler);
            } else {
                element.detachEvent('on' + type , handler);
            }
        }
    };
    function BackToTop (element , options) {
        if (!options) {
            options = {};
        };
        var defaults = {
            duration : 300,    // 所需时间
            before : function () {},    // 回到顶部开始运动前的回调
            after : function () {}      // 回到顶部运动结束后的回调
        };
        options = _.extend({} , defaults , options);
        this.element = element;
        this.options = options;
        this.flag = false;   // 是否已经点击过回到顶部按钮
        this.init();
    };
    var proto = BackToTop.prototype;
    proto.init = function () {
        // 自定义回到顶部按钮默认效果
        if (this.options.defaultIcon && typeof this.options.defaultIcon == 'function') {
            this.options.defaultIcon.call(this);
        } else {
            this.defaultIcon();
        }
        eventUtils.addEvents(this.element , 'click' , this.handle.bind(this));
        eventUtils.addEvents(window , 'scroll' , this.onSrcoll.bind(this));
    };
    proto.handle = function (evt) {
        this.flag = true;
        var distance = document.body.scrollTop || document.documentElement.scrollTop;
        var duration = this.options.duration;
        var startTime = Date.now();
        var self = this;
        this.options.before.call(this);
        // 自定义当滚动条的距离小于屏幕高度时，回到顶部按钮的展示效果
        if (this.options.less && typeof this.options.less == 'function') {
            this.options.less.call(this);
        } else {
            this.handleIcon(65 , 0);
        }
        var timerId = requestAnimationFrame(function step () {
            var p = Math.min(1 , (Date.now() - startTime) / duration);
            document.body.scrollTop = document.documentElement.scrollTop = distance - distance * p * (2 - p);
            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                self.flag = false;
                cancelAnimationFrame(timerId);
                self.options.after.call(self);
            }
        });
    };
    proto.onSrcoll = function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        var winH = window.innerHeight || document.documentElement.clientHeight;
        // 自定义回到顶部按钮的效果
        if (top > winH) {
            if (!this.flag) {
                if (this.options.more && typeof this.options.more == 'function') {
                    this.options.more.call(this);
                } else {
                    this.handleIcon(0 , 1);
                }
            }
        } else {
            if (this.options.less && typeof this.options.less == 'function') {
                this.options.less.call(this);
            } else {
                this.handleIcon(65 , 0);
            }
        }
    };
    proto.handleIcon = function (offset , opacity) {
        if (window.addEventListener) {
            this.element.style.opacity = opacity;
            this.element.style.transition = 'all 0.3s ease-in-out';
            this.element.style.transform = 'translate3d('+offset+'px , 0 , 0)';
        } else {
            this.element.style.filter = 'alpha(opacity='+ opacity * 100 +')';
        }
    }
    proto.defaultIcon = function () {
        if (window.addEventListener) {
            this.element.style.opacity = 0;
            this.element.style.transform = 'translate3d(65px , 0 , 0)';
        } else {
            this.element.style.filter = 'alpha(opacity=0)';
        }
    };
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = BackToTop;
        }
        exports.BackToTop = BackToTop;
    } else {
        root.BackToTop = BackToTop;
    }
})();