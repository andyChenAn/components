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
    // 函数节流
    function throttle (cb , interval) {
        var startTime = new Date();
        var timerId = null;
        return function () {
            timerId = setTimeout(function () {
                var now = new Date();
                if (now - startTime > interval) {
                    cb();
                    startTime = now;
                } else {
                    clearTimeout(timerId);
                }
            })
        }
    };
    function Lazyload (element , options) {
        if (!(this instanceof Lazyload)) {
            return new Lazyload(element , options);
        }
        var defaults = {
            throttleTime : 100
        };
        this.target = element;
        this.options = _.extend({} , defaults , options);
        this.imgs = {};
        // 因为在滚动条不是从最顶部滚动的时候，页面在加载的时候会触发一次滚动事件，尽管还没有滚动鼠标
        // 添加这个属性就是防止在没有滚动的时候触发滚动事件
        this.startScroll = false;
        this.winH = window.innerHeight || document.documentElement.clientHeight;
        this.init();
    };
    Lazyload.prototype.init = function () {
        // 初始化target下面的所有的img元素的信息
        this.initImageInfo(this.target);
        // 绑定事件
        this.initEvents();
        // 可视区域的初始化操作（页面一加载完成，在可视区域有图片，那么展示）
        this.initRenderImage();
    }
    Lazyload.prototype.initImageInfo = function (target) {
        var nodes = this.nodes = target.getElementsByTagName('img');
        for (var i = 0 , len = nodes.length ; i < len ; i++) {
            var node = nodes[i];
            var style = node.currentStyle || window.getComputedStyle(node , null);
            if ((node.nodeType == 1 && node.nodeName.toLowerCase() == 'img')) {
                node.style.opacity = 0;
                node.style.transition = node.style.webkitTransition = node.style.mozTransition = node.style.msTransition = 'opacity 0.2s ease';
                var src = node.getAttribute('_src');
                var top = node.offsetTop;
                var left = node.offsetLeft;
                var w = parseInt(style.width);
                var h = parseInt(style.height);
                this.imgs[src] = {
                    node : node,
                    src : src,
                    top : top,
                    left : left,
                    w : w,
                    h : h,
                    loaded : false
                }
            }
        };
        console.log(this.imgs)
    };
    Lazyload.prototype.load = function (img) {
        var self = this;
        var src = img.src;
        img.node.removeAttribute('_src');
        img.node.setAttribute('src' , src);
        img.node.style.opacity = 1;
        img.node.onload = function (e) {
            img.loaded = true;
            delete self.imgs[img.src];
            if (JSON.stringify(self.imgs) == '{}') {
                eventUtil.removeEvent(window , 'scroll' , self.scrollHandler);
                if (typeof self.options.complete == 'function') {
                    self.options.complete.call(self);
                }
            }
        };
    };
    Lazyload.prototype.initEvents = function () {
        // 这里可以设置函数节流，防止频繁触发滚动事件
        this.scrollHandler = throttle(this.onScrollHandler.bind(this) , this.options.throttleTime);
        eventUtil.addEvent(window , 'scroll' , this.scrollHandler);
    };
    Lazyload.prototype.onScrollHandler = function () {
        console.log(1222);
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (this.startScroll) {
            if (scrollTop - this.startTop > 0) {
                // 滚动条向下滚
                for (var src in this.imgs) {
                    if (this.imgs[src].top > this.startTop + this.winH && this.imgs[src].top <= scrollTop + this.winH) {
                        this.load(this.imgs[src]);
                    }
                }
            } else {  
                // 滚动条向上滚
                for (var src in this.imgs) {
                    if (this.imgs[src].top + this.imgs[src].h > scrollTop && this.imgs[src].top < scrollTop + this.imgs[src].h) {
                        this.load(this.imgs[src]);
                    }
                }
            }
        };
        this.startScroll = true;
    };
    Lazyload.prototype.initRenderImage = function () {
        this.startTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (this.startTop == 0) {
            for (var src in this.imgs) {
                // 图片在可视区域内显示
                if (this.imgs[src].top <= this.winH) {
                    this.load(this.imgs[src]);
                };
            }
        } else {
            for (var src in this.imgs) {
                // 图片在可视区域内显示
                // 所以不管图片是在上面被遮挡还是图片在下面被遮挡都不加载图片
                if (this.imgs[src].top < this.winH + this.startTop && (this.imgs[src].top + this.imgs[src].h) > this.startTop) {
                    this.load(this.imgs[src]);
                }
            }
        }
    };
    Lazyload.prototype.addMoreImage = function () {
        var nodes = this.nodes = this.target.getElementsByTagName('img');
        // 当有新照片添加进来的时候，再一次绑定鼠标滚轮事件
        eventUtil.addEvent(window , 'scroll' , this.scrollHandler);
        for (var i = 0 , len = nodes.length ; i < len ; i++) {
            var node = nodes[i];
            var style = node.currentStyle || window.getComputedStyle(node , null);
            if (node.complete) {
                continue;
            } else {
                if ((node.nodeType == 1 && node.nodeName.toLowerCase() == 'img')) {
                    node.style.opacity = 0;
                    node.style.transition = node.style.webkitTransition = node.style.mozTransition = node.style.msTransition = 'opacity 0.2s ease';
                    var src = node.getAttribute('_src');
                    var top = node.offsetTop;
                    var left = node.offsetLeft;
                    var w = parseInt(style.width);
                    var h = parseInt(style.height);
                    this.imgs[src] = {
                        node : node,
                        src : src,
                        top : top,
                        left : left,
                        w : w,
                        h : h,
                        loaded : false
                    }
                }
            }
        };
        this.initRenderImage();
    };
    root.Lazyload = Lazyload;
})();