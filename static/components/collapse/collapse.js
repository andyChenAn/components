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
    function Collapse (target , options) {
        if (!(this instanceof Collapse)) {
            return new Collapse(target , options);
        }
        var defaults = {
            name : '',
            change : function () {},
            beforeChange : function () {}
        };
        this.settings = _.extend({} , defaults , options);
        this.target = target;
        this.isCollapsed = false;
        this.collapsed = [];
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
        var collapseItems = document.getElementsByClassName('collapse-content');
        for (var i = 0 ; i < collapseItems.length ; i++) {
            collapseItems[i].style.display = 'none';
            this.collapsed.push({
                name : collapseItems[i].getAttribute('name'),
                isCollapsed : false
            })
        };
    };
    Collapse.prototype.bindEvent = function () {
        var bindEventTargets = document.getElementsByClassName('collapse-title');
        for (var i = 0 ; i < bindEventTargets.length ; i++) {
            eventUtil.addEvent(bindEventTargets[i] , 'click' , this.handleClick.bind(this));
        }
    };
    Collapse.prototype.handleClick = function (e) {
        var target = e.target || window.event.srcElement;
        var name = target.parentNode.getAttribute('name');
        // 内容展开与收起
        if (!this.isCollapsed) {
            this.open(target , name);
        } else {
            this.close(target , name);
        }
    };
    Collapse.prototype.open = function (target , name) {
        //this.isCollapsed = true;
        var activeDOM = target.nextElementSibling;
        var parentDOM = activeDOM.parentNode;

        activeDOM.style.display = 'block';
        var rect = activeDOM.getBoundingClientRect();
        activeDOM.style.height = '0px';
        var originalHeight = rect.bottom - rect.top;
        activeDOM.setAttribute('class' , 'collapse-content open-collapse');
        
        // 为什么要用setTimeout，那是因为在第一次执行到这里的时候，一开始activeDOM的display为none，所以在第一次渲染的时候是不会被添加到DOM树中的
        // 所以当把activeDOM的display设置为block时，activeDOM会被添加到DOM树中，并进行渲染
        // 我们通过执行setTimeout，重新给activeDOM的height赋值，等定时器任务结束后，浏览器又会进行渲染更新
        setTimeout(function () {
            activeDOM.style.height = originalHeight + 'px';
        } , 10)
        
    }
    root.Collapse = Collapse;
})();