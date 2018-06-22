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
        if (this.options.loop) {
            var firstChild = this.list.firstElementChild;
            var lastChild = this.list.lastElementChild;
            var cloneFirstChild = firstChild.cloneNode(true);
            var cloneLastChild = lastChild.cloneNode(true);
            this.list.insertBefore(cloneLastChild , firstChild);
            this.list.insertBefore(cloneFirstChild , lastChild.nextSibling);
        }
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
            if (self.options.loop) {
                self.list.style.left = -imageW + 'px';
            } else {
                self.list.style.left = 0;
            }
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
        var offset = parseInt(this.images[0].style.width);
        if (this.options.loop) {
            if (this.index == 0) {
                this.index = this.lis.length - 1 - 2;
            } else {
                this.index -= 1;
            }
            this.animate(offset);
        } else {
            if (this.index == 0) {
                this.index = this.lis.length - 1;
                this.animate(-this.index * offset);
            } else {
                this.index -= 1;
                this.animate(offset);
            };
        };
    };
    Carousel.prototype.nextHandler = function () {
        var offset = parseInt(this.images[0].style.width);
        if (this.options.loop) {
            if (this.index == this.lis.length - 1 - 2) {
                this.index = 0;
            } else {
                this.index += 1;
            }
            this.animate(-offset);
        } else {
            if (this.index == this.lis.length - 1) {
                this.index = 0;
                this.animate(-parseInt(this.list.style.left));
            } else {
                this.index += 1;
                this.animate(-offset);
            };
        }
    };
    Carousel.prototype.animate = function (offset) {
        if (this.options.animate) {
            var time = this.options.time;
            var speed = offset / time;
            var left = parseInt(this.list.style.left) + offset;
            console.log(left);
            var self = this;
            var len = this.lis.length;
            var move = function () {
                self.list.style.left = parseInt(self.list.style.left) + speed + 'px';
                if (speed < 0 && parseInt(self.list.style.left) > left || speed > 0 && parseInt(self.list.style.left) < left) {
                    requestAnimationFrame(move);
                } else {
                    self.list.style.left = left + 'px';
                    if (self.options.loop) {
                        if (speed < 0 && left < (len - 2) * offset) {
                            self.list.style.left = offset + 'px';
                        };
                        if (speed > 0 && left > -offset) {
                            self.list.style.left = -offset * (len - 2) + 'px';
                        }
                    }
                }
            }
            move();
        } else {
            if (offset < 0) {
                this.list.style.left = offset * this.index + 'px';
            } else {
                this.list.style.left = -offset * this.index + 'px';
            }
        }
        // 图片懒加载
        // if (this.index > 0) {
        //     var src = this.images[this.index + 1].getAttribute('_src');
        //     if (src) {
        //         this.images[this.index + 1].setAttribute('src' , src);
        //         this.images[this.index + 1].removeAttribute('_src');
        //     };
        // }
    };
    Carousel.prototype.back = function (offset) {
        console.log(offset);
    }
    root.Carousel = Carousel;
})();