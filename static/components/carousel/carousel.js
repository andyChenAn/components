;(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
                (typeof global == 'object' && global.global == global && global) ||
                this || {};
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
                if (handler) {
                    element.removeEventListener(type , handler);
                } else {
                    element.removeEventListener(type);
                }
            } else {
                if (handler) {
                    element.detachEvent('on' + type , handler);
                } else {
                    element.detachEvent('on' + type);
                }
            }
        }
    };
    function Carousel (element , options) {
        var defaults = {
            lazy : true,
            dot : true
        };
        this.options = _.extend({} , defaults , options);
        this.target = element;
        this.lis = document.getElementsByClassName('carousel-li');
        this.list = document.getElementsByClassName('carousel-list')[0];
        this.images = document.getElementsByClassName('carousel-image');
        this.index = 0;
        this.timer = null;
        this.init();
    };
    Carousel.prototype.init = function () {
        // 渲染图片轮播结构，主要是添加小圆圈和左右切换按钮
        this.render();
        // 计算样式
        this.compute();
        // 绑定事件
        this.bindEvents();
    };
    Carousel.prototype.render = function () {
        var fragDoc = document.createDocumentFragment();
        var div = document.createElement('div');
        var prev = document.createElement('span');
        var next = document.createElement('span');
        prev.className = 'prev';
        prev.id = 'prev';
        next.className = 'next';
        next.id = 'next';
        prev.innerText = '<';
        next.innerText = '>';
        div.className = 'dot-container';
        fragDoc.appendChild(div);
        for (var i = 0 ; i < this.lis.length ; i++) {
            var span = document.createElement('span');
            if (i == 0) {
                span.className = 'dot active';
            } else {
                span.className = 'dot';
            }
            div.appendChild(span);
        };
        this.target.appendChild(fragDoc);
        this.target.appendChild(prev);
        this.target.appendChild(next);
        this.prev = document.getElementById('prev');
        this.next = document.getElementById('next');
    };
    Carousel.prototype.compute = function () {
        var self = this;
        var oneImage = this.images[0];
        oneImage.onload = function () {
            var style = this.currentStyle || window.getComputedStyle(this , null);
            var imageW = parseInt(style.width);
            var imageH = parseInt(style.height);
            self.target.style.height = imageH + 'px';
            self.list.style.height = imageH + 'px';
            self.list.style.width = self.lis.length * imageW + 'px';
            self.list.style.left = 0;
            for (var i = 0 ; i < self.lis.length ; i++) {
                self.lis[i].style.height = imageH + 'px';
                self.lis[i].style.width = imageW + 'px';
                self.images[i].style.width = imageW + 'px';
                self.images[i].style.height = imageH + 'px';
            }
        };
    };
    Carousel.prototype.bindEvents = function () {
        eventUtil.addEvent(this.prev , 'click' , this.prevHandler.bind(this));
        eventUtil.addEvent(this.next , 'click' , this.nextHandler.bind(this));
    };
    Carousel.prototype.prevHandler = function () {
        if (this.index == 0) {
            this.index = this.lis.length - 1;
        } else {
            this.index -= 1;
        };
        var offset = parseInt(this.images[0].style.width);
        this.animate(offset);
    };
    Carousel.prototype.nextHandler = function () {
        if (this.index == this.lis.length - 1) {
            this.index = 0;
        } else {
            this.index += 1;
        };
        var offset = parseInt(this.images[0].style.width);
        this.animate(-offset);
    };
    Carousel.prototype.animate = function (offset) {
        var self = this;
        var time = this.options.time;
        var speed = offset / time;
        var left = parseInt(this.list.style.left) + offset;
        function move () {
            self.list.style.left = parseInt(self.list.style.left) + speed + 'px';
            if (speed < 0 && parseInt(self.list.style.left) > left || speed > 0 && parseInt(self.list.style.left) < left) {
                requestAnimationFrame(move);
            } else {
                self.list.style.left = left + 'px';
                if (self.index + 1 <= self.lis.length) {
                    var src = self.images[self.index + 1].getAttribute('_src');
                    if (src) {
                        self.images[self.index + 1].setAttribute('src' , src);
                        self.images[self.index + 1].removeAttribute('_src');
                    };
                }
            }
        };
        move();
    };
    root.Carousel = Carousel;
})();