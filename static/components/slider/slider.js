;(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
                (typeof global == 'object' && global.global == global && global) ||
                this || {};
    function Slider (element , options) {
        if (!(this instanceof Slider)) {
            return new Slider(element , options);
        };
        var defaults = {
    
        };
        this.element = element;
        this.options = _.extend({} , defaults , options);
        this.init();
    };
    var proto = Slider.prototype;
    proto.init = function () {
        // 计算样式
        this.computeStyle();
    };
    proto.computeStyle = function () {
        var winW = window.innerWidth;
        var oneImage = document.getElementsByClassName('slider-image')[0];
        oneImage.onload = function () {
            console.log(this.height);
        }
    }
    root.Slider = Slider;
})();