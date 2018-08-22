;(function () {
    var root = (typeof self === 'object' && self.self == self && self)
            || (typeof global === 'object' && global.global == global && global)
            || this || {};
    // 判断移动端和pc端所用的点击事件
    var evt = (function () {
        var UA = window.navigator.userAgent;
        var isAndroid = /android|adr/gi.test(UA),
            isIOS = /ipad|iphone|ipod/gi.test(UA),
            isMobile = isAndroid || isIOS,
            isSupportTouch = 'ontouchend' in document ? true : false;
        return {
            tap : isMobile && isSupportTouch ? 'touchstart' : 'mousedown'
        }
    })();
    function Ripple (element , options) {
        if (!(this instanceof Ripple)) {
            return new Ripple(element , options);
        };
        var defaults = {
            className : 'ripple'
        };
        options = options || 
        this.element = element;
        this.settings = Object.assign({} , defaults , options);
        this.positionX = 0;
        this.positionY = 0;
        this.init();
    };
    Ripple.prototype.init = function () {
        this.initEvents();
    };
    Ripple.prototype.initEvents = function () {
        this.element.addEventListener(evt.tap , this.tapHandle.bind(this));
    };
    Ripple.prototype.tapHandle = function (evt) {
        var event = evt.changedTouches ? evt.changedTouches[0] : evt;
        this.target = event.target;
        this.positionX = event.pageX;
        this.positionY = event.pageY;
        this.createRipple();
    };
    // 删除水波纹
    Ripple.prototype.animationendHandle = function (node) {
        node.parentNode.removeChild(node);
    };
    // 创建水波纹
    Ripple.prototype.createRipple = function () {
        var rect = this.target.getBoundingClientRect();
        var size = Math.max(rect.width , rect.height);
        var elementLeft = this.target.offsetLeft;
        var elementTop = this.target.offsetTop;
        var span = document.createElement('span');
        // 因为创建的标签是一个圆形，而圆心所在的位置刚好与点击的位置的距离就是圆的半径，所以需要再减去size/2
        span.style.left = this.positionX - elementLeft - size/2 + 'px';
        span.style.top = this.positionY - elementTop - size/2 + 'px';
        span.style.width = size + 'px';
        span.style.height = size + 'px';
        span.classList.add(this.settings.className);
        this.target.appendChild(span);
        span.addEventListener('animationend' , this.animationendHandle.bind(this , span));
    };
    root.Ripple = Ripple;
})();