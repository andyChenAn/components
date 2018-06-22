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
        this.doAnimate = false;
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
        var prev = document.createElement('span');
        var next = document.createElement('span');
        prev.className = 'prev';
        prev.id = 'prev';
        next.className = 'next';
        next.id = 'next';
        prev.innerText = '<';
        next.innerText = '>';
        if (this.options.dot) {
            var fragDoc = document.createDocumentFragment();
            var div = document.createElement('div');
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
            this.dots = document.getElementsByClassName('dot');
        }
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
        if (this.options.effect == 'slide') {
            if (this.doAnimate) {
                return;
            };
            if (typeof this.options.onChangeStart == 'function') {
                this.options.onChangeStart.call(this);
            };
            var offset = parseInt(this.images[0].style.width);
            if (this.options.loop) {
                if (this.index == 0) {
                    this.index = this.lis.length - 1 - 2;
                } else {
                    this.index -= 1;
                }
                this.animate(offset);
                if (this.options.dot) {
                    this.showDot();
                }
            } else {
                if (this.index == 0) {
                    this.index = this.lis.length - 1;
                    this.animate(-this.index * offset);
                    if (this.options.dot) {
                        this.showDot();
                    }
                } else {
                    this.index -= 1;
                    this.animate(offset);
                    if (this.options.dot) {
                        this.showDot();
                    }
                };
            };
        } else if (this.options.effect == 'fade') {
            
        }
    };
    Carousel.prototype.nextHandler = function () {
        if (this.options.effect == 'slide') {
            if (this.doAnimate) {
                return;
            };
            if (typeof this.options.onChangeStart == 'function') {
                this.options.onChangeStart.call(this);
            };
            var offset = parseInt(this.images[0].style.width);
            if (this.options.loop) {
                if (this.index == this.lis.length - 1 - 2) {
                    this.index = 0;
                } else {
                    this.index += 1;
                }
                this.animate(-offset);
                if (this.options.dot) {
                    this.showDot();
                }
            } else {
                if (this.index == this.lis.length - 1) {
                    this.index = 0;
                    this.animate(-parseInt(this.list.style.left));
                    if (this.options.dot) {
                        this.showDot();
                    }
                } else {
                    this.index += 1;
                    this.animate(-offset);
                    if (this.options.dot) {
                        this.showDot();
                    }
                };
            }
        } else if (this.options.effect == 'fade') {

        }
    };
    Carousel.prototype.animate = function (offset) {
        this.doAnimate = true;
        if (this.options.animate) {
            var time = this.options.time;
            var speed = offset / time;
            var left = parseInt(this.list.style.left) + offset;
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
                    };
                    if (typeof self.options.onChangeEnd == 'function') {
                        self.options.onChangeEnd.call(self);
                    };
                    // 图片懒加载，只有当无缝轮播且需要懒加载的时候，才选择图片懒加载方式
                    if (self.options.loop && self.options.lazy) {
                        if (self.index + 1 < len && speed < 0) {
                            var src = self.images[self.index + 2].getAttribute('_src');
                            if (src) {
                                self.images[self.index + 2].setAttribute('src' , src);
                                self.images[self.index + 2].removeAttribute('_src');
                            };
                        } else if (self.index > 1 && speed > 0) {
                            var src = self.images[self.index].getAttribute('_src');
                            if (src) {
                                self.images[self.index].setAttribute('src' , src);
                                self.images[self.index].removeAttribute('_src');
                            };
                        }
                    };
                    self.doAnimate = false;
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
    };
    Carousel.prototype.showDot = function () {
        for (var i = 0 ; i < this.dots.length ; i++) {
            if (this.dots[i].classList.contains('active')) {
                this.dots[i].classList.remove('active');
                break;
            }
        };
        this.dots[this.index].classList.add('active');
    };
    root.Carousel = Carousel;
})();