class BackToTop {
    constructor (element , options) {
        if (new.target !== BackToTop) {
            throw new Error('该类只能通过new来调用');
        };
        let defaults = {
            duration : 300,    // 所需时间
            before : function () {},    // 回到顶部开始运动前的回调
            after : function () {}      // 回到顶部运动结束后的回调
        };
        options = extend({} , defaults , options);
        this.element = element;
        this.options = options;
        this.flag = false;   // 是否已经点击过回到顶部按钮
    }
    init () {
        // 自定义回到顶部按钮默认效果
        if (this.options.defaultIcon && typeof this.options.defaultIcon == 'function') {
            this.options.defaultIcon.call(this);
        } else {
            this.defaultIcon();
        }
        this.element.addEventListener('click' , this.handle.bind(this));
        document.addEventListener('scroll' , this.onSrcoll.bind(this));
    }
    handle (evt) {
        this.flag = true;
        let distance = document.documentElement.scrollTop;
        let duration = this.options.duration;
        let startTime = Date.now();
        let self = this;
        this.options.before.call(this);
        // 自定义当滚动条的距离小于屏幕高度时，回到顶部按钮的展示效果
        if (this.options.less && typeof this.options.less == 'function') {
            this.options.less.call(this);
        } else {
            this.handleIcon(65 , 0);
        }
        let timerId = requestAnimationFrame(function step () {
            let p = Math.min(1 , (Date.now() - startTime) / duration);
            document.documentElement.scrollTop = distance - distance * p * (2 - p);
            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                self.flag = false;
                cancelAnimationFrame(timerId);
                self.options.after.call(self);
            }
        });
    }
    onSrcoll () {
        let top = document.documentElement.scrollTop;
        let winH = window.innerHeight;
        // 自定义回到顶部按钮的效果
        if (top > winH) {
            if (!this.flag) {
                if (this.options.more && typeof this.options.more == 'function') {
                    this.options.more.call(this);
                } else {
                    this.handleIcon(0 , 1);
                }
            }
        } else {
            if (this.options.less && typeof this.options.less == 'function') {
                this.options.less.call(this);
            } else {
                this.handleIcon(65 , 0);
            }
        }
    }
    handleIcon (offset , opacity) {
        this.element.style.transition = 'all 0.3s ease-in-out';
        this.element.style.transform = `translate3d(${offset}px , 0 , 0)`;
        this.element.style.opacity = opacity;
    }
    defaultIcon () {
        this.element.style.transform = `translate3d(65px , 0 , 0)`;
        this.element.style.opacity = 0;
    }
};