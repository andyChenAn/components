;(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
                (typeof global == 'object' && global.global == global && global) ||
                this || {};
    function Slider (element , options) {
        if (!(this instanceof Slider)) {
            return new Slider(element , options);
        };
        var defaults = {
            lazy : true,
            dot : true,
            platform : 'mobile',
            autoPlay : false
        };
        this.element = element;
        this.options = _.extend({} , defaults , options);
        this.opt = {};
        this.index = 0;
        this.init();
    };
    var proto = Slider.prototype;
    proto.init = function () {
        // 计算样式
        this.computeStyle();
        // 显示小圆圈
        if (this.options.dot) {
            this.initDot();
        };
        // 事件绑定
        this.bindEvents();
        // 自动播放
        if (this.options.autoPlay) {
            this.play();
        };
    };
    proto.play = function () {
        const self = this;
        clearInterval(this.opt.timerId);
        this.opt.timerId = setInterval(function () {
            self.autoPlay();
        } , 2000)
    };
    proto.stop = function () {
        clearInterval(this.opt.timerId);
    };
    proto.computeStyle = function () {
        var self = this;
        var oStyle = window.getComputedStyle(this.element) || this.currentStyle();
        var w = parseInt(oStyle.maxWidth);
        this.opt.winW = window.innerWidth > w ? w : window.innerWidth;
        this.opt.images = document.getElementsByClassName('slider-image');
        this.opt.sliderBox = document.getElementsByClassName('slider-list')[0];
        this.opt.sliderList = document.getElementsByClassName('slider-li');
        var oneImage = this.opt.images[0];
        oneImage.onload = function (e) {
            var style = window.getComputedStyle(this) || this.currentStyle();
            var imageW = parseInt(style.width);
            var imageH = parseInt(style.height);
            self.opt.sliderBox.style.width = (self.opt.images.length * imageW) + 'px';
            self.opt.sliderBox.style.height = imageH + 'px';
            self.element.style.height = imageH + 'px';
            for (var i = 0 ; i < self.opt.sliderList.length ; i++) {
                self.opt.sliderList[i].style.width = imageW + 'px';
                self.opt.sliderList[i].style.height = imageH + 'px';
                self.opt.sliderList[i].style.zIndex = 2;
                if (i > 1) {
                    self.opt.sliderList[i].style.transform = 'translate3d('+ imageW +'px , 0 , 0)';
                    // 图片滑动时的懒加载
                    if (self.options.lazy) {
                        self.opt.sliderList[i].style.opacity = 0;
                    }
                } else {
                    self.opt.sliderList[i].style.transform = 'translate3d('+ (imageW * i) +'px , 0 , 0)';
                }
            }
        };
    };
    // 初始化小圆点
    proto.initDot = function () {
        var fragDoc = document.createDocumentFragment();
        var dotBox = document.createElement('div');
        fragDoc.appendChild(dotBox);
        dotBox.className = 'dot-container';
        for (var i = 0 ; i < this.opt.images.length ; i++) {
            var span = document.createElement('span');
            if (i == 0) {
                span.className = 'dot active';
            } else {
                span.className = 'dot';
            }
            dotBox.appendChild(span);
        };
        this.element.appendChild(fragDoc);
        this.opt.dots = document.getElementsByClassName('dot');
    };
    // 初始化事件绑定
    proto.bindEvents = function () {
        this.element.addEventListener('touchstart' , this.onTouchstart.bind(this));
        this.element.addEventListener('touchmove' , this.onTouchmove.bind(this));
        this.element.addEventListener('touchend' , this.onTouchend.bind(this));
    };
    // touchstart事件处理
    proto.onTouchstart = function (evt) {
        evt.preventDefault();
        var touch = evt.changedTouches[0];
        this.opt.startX = touch.pageX;
        this.opt.startY = touch.pageY;
        this.stop();
    };
    // touchmove事件处理
    proto.onTouchmove = function (evt) {
        evt.preventDefault();
        var touch = evt.changedTouches[0];
        this.opt.moveX = touch.pageX;
        this.opt.moveY = touch.pageY;
        this.opt.offset = this.opt.moveX - this.opt.startX;
        this.setTransform(this.opt.offset);
        if (this.opt.offset < 0) {
            // 图片懒加载
            if (this.options.lazy) {
                if ((this.index + 1) < this.opt.images.length) {
                    var src = this.opt.images[this.index + 1].getAttribute('_src');
                    if (src) {
                        this.opt.images[this.index + 1].removeAttribute('_src');
                        this.opt.images[this.index + 1].setAttribute('src' , src);
                        this.opt.sliderList[this.index + 1].style.opacity = 1;
                    }
                }
            }
        } else {
            // 图片懒加载
            if (this.options.lazy) {
                if (this.index == 0) {
                    var src = this.opt.images[this.opt.images.length - 1].getAttribute('_src');
                    if (src) {
                        this.opt.images[this.opt.images.length - 1].removeAttribute('_src');
                        this.opt.images[this.opt.images.length - 1].setAttribute('src' , src);
                        this.opt.sliderList[this.opt.images.length - 1].style.opacity = 1;
                    }
                } else if (this.index > 0) {
                    var src = this.opt.images[this.index - 1].getAttribute('_src');
                    if (src) {
                        this.opt.images[this.index - 1].removeAttribute('_src');
                        this.opt.images[this.index - 1].setAttribute('src' , src);
                        this.opt.sliderList[this.index - 1].style.opacity = 1;
                    }
                }
            }
        }
    };
    // touchend事件处理
    proto.onTouchend = function (evt) {
        evt.preventDefault();
        var touch = evt.changedTouches[0];
        this.opt.endX = touch.pageX;
        this.opt.endY = touch.pageY;
        if (Math.abs(this.opt.offset) > this.opt.winW / 5) {
            this.setTransition();
            this.setDotActive();
        } else {
            this.setTransitionBack();
        };
        if (this.options.autoPlay) {
            this.play();
        }
    };
    // 标记当前图片对应的小红点
    proto.setDotActive = function () {
        for (var i = 0 ; i < this.opt.dots.length ; i++) {
            var dot = this.opt.dots[i];
            if (dot.classList.contains('active')) {
                dot.classList.remove('active');
                break;
            };
        };
        this.opt.dots[this.index].classList.add('active');
    };
    // 当滑动图片距离没有超过屏幕的1/5时，图片回到原来位置
    proto.setTransitionBack = function () {
        var winW = this.opt.winW;
        var currentSlider = this.opt.sliderList[this.index];
        var prevSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.opt.sliderList.length - 1];
        var nextSlider = currentSlider.nextElementSibling || this.opt.sliderList[this.index];
        currentSlider.style.transition = nextSlider.style.transition = prevSlider.style.transition = 'transform 0.3s ease';
        currentSlider.style.transform = 'translate3d(0 , 0 , 0)';
        nextSlider.style.transform = 'translate3d('+ winW +'px , 0 , 0)';
        prevSlider.style.transform = 'translate3d('+ (-winW) +'px , 0 , 0)';
    };
    // 当触发touchmove事件时，图片跟随手指滑动
    proto.setTransform = function (offset) {
        var winW = this.opt.winW;
        if (this.index == this.opt.images.length - 1) {
            var currentSlider = this.opt.sliderList[this.index];
            var prevSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.index - 1];
            var nextSlider = currentSlider.nextElementSibling || this.opt.sliderList[0];
        } else {
            var currentSlider = this.opt.sliderList[this.index];
            var prevSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.opt.sliderList.length - 1];
            var nextSlider = currentSlider.nextElementSibling || this.opt.sliderList[this.index];
        }
        currentSlider.style.transition = nextSlider.style.transition = prevSlider.style.transition = 'transform 0s ease';
        currentSlider.style.transform = 'translate3d('+offset+'px , 0 , 0)';
        nextSlider.style.transform = 'translate3d('+ (winW + offset) +'px , 0 , 0)';
        prevSlider.style.transform = 'translate3d('+ (offset - winW) +'px , 0 , 0)';
    };
    // 设置图片的切换效果
    proto.setTransition = function () {
        var winW = this.opt.winW;
        if (this.opt.offset < 0) {
            this.slideRight();
        } else {
            this.slideLeft();
        }
    };
    // 手指右滑时，图片的切换效果
    proto.slideRight = function () {
        var winW = this.opt.winW;
        if (this.index == this.opt.images.length - 1) {
            var currentSlider = this.opt.sliderList[this.index];
            var prevSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.index - 1];
            var nextSlider = currentSlider.nextElementSibling || this.opt.sliderList[0];
            // 设置zIndex的值，主要是为了防止再自动播放的时候，轮播图会出现滑动效果混乱
            prevSlider.style.zIndex = 1;
            nextSlider.style.zIndex = 2;
            currentSlider.style.zIndex = 1;
            this.index = 0;
        } else {
            var currentSlider = this.opt.sliderList[this.index];
            var prevSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.opt.sliderList.length - 1];
            var nextSlider = currentSlider.nextElementSibling || this.opt.sliderList[this.index];
            // 设置zIndex的值，主要是为了防止再自动播放的时候，轮播图会出现滑动效果混乱
            prevSlider.style.zIndex = 1;
            nextSlider.style.zIndex = 2;
            currentSlider.style.zIndex = 2;
            this.index += 1;
        }
        currentSlider.style.transition = nextSlider.style.transition = prevSlider.style.transition = 'transform 0.3s ease';
        currentSlider.style.transform = 'translate3d('+(-winW)+'px , 0 , 0)';
        nextSlider.style.transform = 'translate3d(0 , 0 , 0)';
        prevSlider.style.transform = 'translate3d('+ (winW) +'px , 0 , 0)';
    };
    // 手指左滑时，图片的切换效果
    proto.slideLeft = function () {
        var winW = this.opt.winW;
        if (this.index == 0) {
            var currentSlider = this.opt.sliderList[this.index];
            var prevSlider = currentSlider.nextElementSibling || this.opt.sliderList[0];
            var nextSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.opt.sliderList.length - 1];
            this.index = this.opt.images.length - 1;
        } else {
            var currentSlider = this.opt.sliderList[this.index];
            var prevSlider = currentSlider.nextElementSibling || this.opt.sliderList[this.index];
            var nextSlider = currentSlider.previousElementSibling || this.opt.sliderList[this.length - 1];
            this.index -= 1;
        }
        currentSlider.style.transition = nextSlider.style.transition = prevSlider.style.transition = 'transform 0.3s ease';
        currentSlider.style.transform = 'translate3d('+winW+'px , 0 , 0)';
        nextSlider.style.transform = 'translate3d('+0+'px , 0 , 0)';
        prevSlider.style.transform = 'translate3d('+ winW +'px , 0 , 0)';
    };
    // 自动播放效果
    proto.autoPlay = function () {
        if (this.options.lazy) {
            if ((this.index + 1) < this.opt.images.length) {
                var src = this.opt.images[this.index + 1].getAttribute('_src');
                if (src) {
                    this.opt.images[this.index + 1].removeAttribute('_src');
                    this.opt.images[this.index + 1].setAttribute('src' , src);
                    this.opt.sliderList[this.index + 1].style.opacity = 1;
                }
            }
        };
        this.slideRight();
        this.setDotActive();
    }
    root.Slider = Slider;
})();