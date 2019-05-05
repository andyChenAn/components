(function () {
    var root = (typeof self === 'object' && self.self == self && self)
            || (typeof global === 'object' && global.global == global && global)
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
    // 兼容document.getElementsByClassName()方法，IE8不支持该方法
    document.getElementsByClassName = document.getElementsByClassName || function (className) {
        var elements = document.getElementsByTagName('*');
        var result = [];
        for (var i = 0 ; i < elements.length ; i++) {
            if (elements[i].nodeType == 1 && elements[i].className.indexOf(className) > -1 ) {
                var classes = elements[i].className.split(' ');
                for (var j = 0 ; j < classes.length ; j++) {
                    if (classes[j] == className) {
                        result.push(elements[i]);
                    }
                }
            }
        }
        return result;
    };
    if (!Element.prototype.getElementsByClassName) {
        Element.prototype.getElementsByClassName = function (className) {
            var elements = this.getElementsByTagName('*');
            var result = [];
            for (var i = 0 ; i < elements.length ; i++) {
                if (elements[i].nodeType == 1 && elements[i].className.indexOf(className) > -1 ) {
                    var classes = elements[i].className.split(' ');
                    for (var j = 0 ; j < classes.length ; j++) {
                        if (classes[j] == className) {
                            result.push(elements[i]);
                        }
                    }
                }
            }
            return result;
        }
    };
    
    // 兼容IE8
    if(!("nextElementSibling" in document.documentElement)){
        Object.defineProperty(Element.prototype, "nextElementSibling", {
            get: function(){
                var e = this.nextSibling;
                while(e && 1 !== e.nodeType)
                    e = e.nextSibling;
                return e;
            }
        });
    };

    // 兼容不支持transition过渡动画
    function animate (target , options , duration) {
        var style = target.currentStyle || window.getComputedStyle(target , null);
        var dest = {};
        var old = {};
        for (var key in options) {
            dest[key] = parseFloat(options[key]) - parseFloat(style[key]);
            old[key] = parseFloat(style[key]);
        };
        var start = new Date();
        var timer = null;
        function go () {
            var p = (new Date() - start) / duration;
            if (p >= 1) {
                for (var key in dest) {
                    if (key !== 'done') {
                        if (key == 'opacity') {
                            target.style[key] = old[key] + dest[key]
                        }
                        target.style[key] = old[key] + dest[key] + 'px';
                    }
                };
                clearTimeout(timer);
                options.done && typeof options.done == 'function' && options.done();
                return;
            } else {
                for (var key in dest) {
                    if (key !== 'done') {
                        if (key == 'opacity') {
                            target.style[key] = old[key] + dest[key] * p;
                        }
                        target.style[key] = old[key] + dest[key] * p + 'px';
                    }
                }
                timer = setTimeout(go , 16);
            }
        }
        go();
    };

    function Collapse (target , options) {
        if (!(this instanceof Collapse)) {
            return new Collapse(target , options);
        }
        var defaults = {
            name : '',
            change : function () {}
        };
        this.options = _.extend({} , defaults , options);
        this.target = target;
        this.data = {};
        this.init();
        return this;
    }
    Collapse.prototype.init = function () {
        // 计算最终的展示效果
        this.compute();
        // 绑定事件
        this.bindEvent();
    };
    Collapse.prototype.compute = function () {
        // 隐藏每个item的内容
        var collapseItems = this.target.getElementsByClassName('collapse-content');
        var collapseTitles = this.target.getElementsByClassName('collapse-title');
        for (var i = 0 ; i < collapseItems.length ; i++) {
            collapseItems[i].style.display = 'none';
            var name = collapseItems[i].parentNode.getAttribute('name');
            this.data[name] = {
                isCollapsed : false,
                height : 0,
                element : collapseTitles[i]
            }
        };
    };
    Collapse.prototype.bindEvent = function () {
        var bindEventTargets = this.target.getElementsByClassName('collapse-title');
        var collapseTarget = this.target.getElementsByClassName('collapse-content');
        for (var i = 0 ; i < bindEventTargets.length ; i++) {
            eventUtil.addEvent(bindEventTargets[i] , 'click' , this.handleClick.bind(this));
        };
        for (var i = 0 ; i < collapseTarget.length ; i++) {
            eventUtil.addEvent(collapseTarget[i] , 'transitionend' , this.handleTransitionend.bind(this));
        }
    };
    Collapse.prototype.handleClick = function (e) {
        var target = e.target || window.event.srcElement;
        var name = target.parentNode.getAttribute('name');
        // 内容展开与收起
        if (!this.data[name].isCollapsed) {
            this.open(target , name);
        } else {
            this.close(target);
        }
    };
    Collapse.prototype.handleTransitionend = function (e) {
        var target = null;
        if (e.target) {
            target = e.target;
        } else {
            target = e;
        };
        var name = target.parentNode.getAttribute('name');
        if (!this.data[name].isCollapsed) {
            this.data[name].isCollapsed = true;
            this.options.change && typeof this.options.change == 'function' && this.options.change.call(this , this.options);
        } else {
            this.data[name].isCollapsed = false;
            target.style.display = 'none';
        }
    };
    Collapse.prototype.open = function (target , name) {
        var originalHeight = '';  // 每个面板的原始高度
        var self = this;
        var activeDOM = target.nextElementSibling;
        activeDOM.style.display = 'block';
        if (this.options.accordion) {
            for (var key in this.data) {
                if (this.data[key].isCollapsed) {
                    this.close(this.data[key].element);
                }
            }
        };
        if (!this.data[name].height) {
            var rect = activeDOM.getBoundingClientRect();
            originalHeight = rect.bottom - rect.top;
            this.data[name].height = originalHeight;
        } else {
            originalHeight = this.data[name].height;
        };
        activeDOM.style.height = '0px';
        if ('transition' in activeDOM.style) {
            activeDOM.setAttribute('class' , 'collapse-content open-collapse');
            // 为什么要用setTimeout，那是因为在第一次执行到这里的时候，一开始activeDOM的display为none，所以在第一次渲染的时候是不会被添加到DOM树中的
            // 所以当把activeDOM的display设置为block时，activeDOM会被添加到DOM树中，并进行渲染
            // 我们通过执行setTimeout，重新给activeDOM的height赋值，等定时器任务结束后，浏览器又会进行渲染更新
            setTimeout(function () {
                activeDOM.style.height = originalHeight + 'px';
            } , 16);
        } else {
            animate(activeDOM , {
                height : originalHeight,
                done : function () {
                    self.handleTransitionend(activeDOM);
                }
            } , 300)
        }
    };
    Collapse.prototype.close = function (target) {
        var self = this;
        var activeDOM = target.nextElementSibling;
        if ('transition' in activeDOM.style) {
            activeDOM.style.height = '0px';
            activeDOM.setAttribute('class' , 'collapse-content close-collapse');
        } else {
            animate(activeDOM , {
                height : 0,
                done : function () {
                    self.handleTransitionend(activeDOM);
                }
            } , 300)
        }
    }
    root.Collapse = Collapse;
})();