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
    // 判断是否支持transition属性
    function isSurportTransition() { 
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
        var name = navigator.appName;
        var isIE=window.ActiveXObject || "ActiveXObject" in window;
        var version = '';
        if (isIE) { 
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);"); 
            reIE.test(userAgent); 
            var fIEVersion = parseFloat(RegExp["$1"]); 
            if(userAgent.indexOf('MSIE 6.0')!=-1){
                version = 6;
            }else if(fIEVersion == 7) { 
                version = 7
            } else if(fIEVersion == 8) { 
                version = 8;
            } else if(fIEVersion == 9) { 
                version = 9
            } else if(fIEVersion == 10) { 
                version = 10;
            }
        };
        if (name != 'Microsoft Internet Explorer') {
            return true;
        } else if (name == 'Microsoft Internet Explorer' && version > 9) {
            return true;
        } else {
            return false;
        };
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
    function Fullpage (element , options) {
        if (!(this instanceof Fullpage)) {
            return new Fullpage(element , options);
        };
        this.target = element;
        var defaults = {
            easing : 'ease',
            dot : true,
            loop : true,
            seamless : true,
            duration : 500
        };
        this.options = _.extend({} , defaults , options);
        this.winH = window.innerHeight || document.body.clientHeight;
        this.index = 0;
        this.isMove = false;
        this.sections = document.getElementsByClassName('section');
        this.len = this.sections.length;
        this.isSurportTransition = isSurportTransition();
        this.direction = '';
        this.init();
    };
    Fullpage.prototype.init = function () {
        if (this.options.seamless && this.options.loop) {
            this.cloneLastSection = this.sections[this.len - 1].cloneNode(true);
            this.cloneFirstSection = this.sections[0].cloneNode(true);
            this.target.appendChild(this.cloneFirstSection);
            this.target.insertBefore(this.cloneLastSection , this.sections[0]);
            if (this.isSurportTransition) {
                this.setNoTransition(-this.winH);
            } else {
                this.setStyle(-this.winH);
            }
        } else {
            if (this.isSurportTransition) {
                this.setNoTransition(0);
            } else {
                this.setStyle(0);
            }
        };
        // 初始化小圆圈
        if (this.options.dot) {
            this.initDot();
        }
        // 事件绑定
        this.initEvents();
    };
    Fullpage.prototype.setStyle = function (offset) {
        console.log(offset)
        if (this.options.seamless) {
            this.target.style.top = offset + 'px';
        } else {
            this.target.style.top = 0;
        }
        this.target.style.position = 'relative';
        this.target.style.height = '100%';
    };
    Fullpage.prototype.initEvents = function () {
        eventUtil.addEvent(document.body , 'mousewheel' , this.onMouseWheelHandle.bind(this));
        eventUtil.addEvent(document.body , 'DOMMouseScroll' , this.onMouseWheelHandle.bind(this));
        eventUtil.addEvent(document.body , 'transitionend' , this.onTransitionEndHandle.bind(this));
        eventUtil.addEvent(window , 'resize' , this.onResizeHandle.bind(this));
    };
    Fullpage.prototype.onMouseWheelHandle = function (evt) {
        // 滚动向上
        if (evt.wheelDelta < 0 || evt.detail > 0) {
            if (!this.isMove) {
                // 是否进行循环滚动
                if (this.options.loop) {
                    if (this.index < this.len - 1) {
                        this.index += 1;
                    } else {
                        if (this.options.seamless) {
                            this.index = this.len;
                        } else {
                            this.index = 0;
                        }
                    }
                } else {
                    if (this.index < this.len - 1) {
                        this.index += 1;
                    } else {
                        return;
                    }
                };
                this.isMove = true;
                this.direction = 'up';
                this.move(-this.winH);
            }
        // 滚动向下
        } else {
            if (!this.isMove) {
                if (this.options.loop) {
                    if (this.index > 0) {
                        this.index -= 1;
                    } else {
                        if (this.options.seamless) {
                            this.index = -1;
                        } else {
                            this.index = this.len - 1;
                        }
                    }
                } else {
                    if (this.index > 0) {
                        this.index -= 1;
                    } else {
                        return;
                    }
                };
                this.isMove = true;
                this.direction = 'down';
                this.move(-this.winH);
            }
        }
        this.changeDot(this.index);
    };
    Fullpage.prototype.move = function (width) {
        if (this.options.onBefore && typeof this.options.onBefore == 'function') {
            this.options.onBefore.call(this);
        };
        if (this.isSurportTransition) {
            this.setTransition(width);
        } else {
            this.goTop();
        }
    };
    Fullpage.prototype.goTop = function () {
        var self = this;
        var dist = this.direction == 'up' ? -this.winH : this.winH;
        if (!this.options.seamless && this.options.loop) {
            if (this.index == 0 && this.direction == 'up') {
                dist = (this.len - 1) * this.winH;
            } else if (this.index == this.len - 1 && this.direction == 'down') {
                dist = -(this.len - 1) * this.winH;
            }
        };
        var speed = dist / (this.options.duration / 17);
        var top = parseInt(this.target.style.top) + dist;
        var go = function () {
            self.target.style.top = parseInt(self.target.style.top) + speed + 'px';
            if (speed < 0 && parseInt(self.target.style.top) > top || speed > 0 && parseInt(self.target.style.top) < top) {
                setTimeout(go , 17);
            } else {
                self.target.style.top = top + "px";
                self.isMove = false;
                console.log(self.index)
                // 当需要无缝滚动的时候，在最后一屏滚动结束后，重新更新容器及index
                if (self.index == self.len && self.options.seamless) {
                    self.index = 0;
                    self.setStyle(-self.winH);
                } else if (self.index == -1 && self.options.seamless) {
                    self.index = self.len - 1;
                    self.setStyle(-self.winH * self.len);
                };
                if (self.options.onAfter && typeof self.options.onAfter == 'function') {
                    self.options.onAfter.call(this);
                }
            }
        };
        go();
    };
    Fullpage.prototype.setTransition = function (offset) {
        if (this.direction == 'up') {
            // 因为使用无缝循环轮播的时候，多添加了第一屏和最后一屏，所以初始化的时候会从第二屏开始
            // 所以这里计算的时候都加了1，而不使用无缝轮播时，则不需要加1
            if (this.options.seamless && this.options.loop) {
                this.target.style.transform = 'translate3d(0 , '+ offset * (this.index + 1) +'px , 0)';
            } else {
                this.target.style.transform = 'translate3d(0 , '+ offset * this.index +'px , 0)';
            }
        } else if (this.direction == 'down') {
            if (this.options.seamless && this.options.loop) {
                this.target.style.transform = 'translate3d(0 , '+ offset * (this.index + 1) +'px , 0)';
            } else {
                this.target.style.transform = 'translate3d(0 , '+ offset * this.index +'px , 0)';
            }
        }
        this.target.style.transition = 'transform '+ this.options.duration + 'ms '+ this.options.easing +'';
    };
    Fullpage.prototype.setNoTransition = function (offset) {
        this.target.style.transition = 'transform 0s '+ this.options.easing +'';
        this.target.style.transform = 'translate3d(0,'+ offset +'px,0)';
    };
    Fullpage.prototype.onTransitionEndHandle = function () {
        this.isMove = false;
        // 当需要无缝滚动的时候，在最后一屏滚动结束后，重新更新容器及index
        if (this.index == this.len && this.options.seamless) {
            this.index = 0;
            this.setNoTransition(-this.winH);
        } else if (this.index == -1 && this.options.seamless) {
            this.index = this.len - 1;
            this.setNoTransition(-this.winH * this.len);
        };
        if (this.options.onAfter && typeof this.options.onAfter == 'function') {
            this.options.onAfter.call(this);
        }
        console.log(this.index)
    };
    Fullpage.prototype.onResizeHandle = function () {
        this.winH = window.innerHeight;
        this.target.style.height = '100%';
        if (this.options.seamless && this.options.loop) {
            this.target.style.transform = 'translate3d(0 , '+ -this.winH * (this.index + 1) +'px , 0)';
        } else {
            this.target.style.transform = 'translate3d(0 , '+ -this.winH * this.index +'px , 0)';
        }
        this.target.style.transition = 'transform 0s ease';
    };
    Fullpage.prototype.initDot = function () {
        // 这里需要注意的是，如果是将小圆圈的容器添加到fullpage的元素的子元素，那么positiion:fixed会失效
        // 所以这里的解决方式就是讲小圆圈添加到body中。
        // 产生的原因是当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先
        // 可以参考：https://github.com/chokcoco/iCSS/issues/24
        var fragDoc = document.createDocumentFragment();
        var dotBox = document.createElement('div');
        var ul = document.createElement('ul');
        ul.className = 'dot-list';
        fragDoc.appendChild(dotBox);
        dotBox.appendChild(ul);
        dotBox.className = 'dot-box';
        for (var i = 0 ; i < this.len ; i++) {
            var li = document.createElement('li');
            var span = document.createElement('span');
            li.appendChild(span);
            if (i == 0) {
                span.className = 'dot';
                li.className = 'dot-active';
            } else {
                span.className = 'dot';
            }
            ul.appendChild(li);
        };
        document.body.appendChild(fragDoc);
        this.dotList = document.getElementsByClassName('dot-list')[0].children;
    };
    Fullpage.prototype.changeDot = function (currentIndex) {
        for (var i = 0 , len = this.dotList.length ; i < len ; i++) {
            if (this.dotList[i].className.indexOf('dot-active') > -1) {
                this.dotList[i].className = '';
                break;
            }
        };
        if (currentIndex == this.len) {
            this.dotList[0].className = 'dot-active';
        } else if (currentIndex == -1) {
            this.dotList[this.len - 1].className = 'dot-active';
        } else {
            this.dotList[currentIndex].className = 'dot-active';
        }
        
    };
    root.Fullpage = Fullpage;
})();
