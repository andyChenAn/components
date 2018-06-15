;(function () {
    var root = (typeof self == 'object' && self.self == self && self)
                || (typeof global == 'object' && global.global == global && global)
                || this
                || {};
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
                function () {
                    clearTimeout(id);
                }
    })();
    var cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
        clearTimeout(id);
    }
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
        this.element.addEventListener('click' , this.handle.bind(this) , false);
        window.addEventListener('scroll' , this.onSrcoll.bind(this) , false);
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
        var winH = window.innerHeight;
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
        this.element.style.transition = 'all 0.3s ease-in-out';
        this.element.style.transform = 'translate3d('+offset+'px , 0 , 0)';
        this.element.style.opacity = opacity;
    }
    proto.defaultIcon = function () {
        this.element.style.transform = 'translate3d(65px , 0 , 0)';
        this.element.style.opacity = 0;
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