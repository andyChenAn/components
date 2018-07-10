;(function () {
    var root = (typeof self == 'object' && self.self == self && self)
            || (typeof global == 'object' && global.global == global && global)
            || this || {};
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
                element.removeEventListener(type , handler);
            } else {
                element.detachEvent('on' + type , handler);
            }
        }
    }
    function Datepicker (element , options) {
        if (!(this instanceof Datepicker)) {
            return new Datepicker(element , options);
        }
        var defaults = {
            format : 'YY:MM:DD'
        };
        this.target = element;
        this.options = _.extend({} , defaults , options);
        this.data = [];
        this.init();
    };
    Datepicker.prototype.init = function () {
        // 初始化当前日期
        this.initDate();
        // 绑定事件
        this.initEvents();
    };
    Datepicker.prototype.initDate = function () {
        var date = new Date();
        this.currentDate = {
            year : date.getFullYear(),
            month : date.getMonth() + 1,
            day : date.getDate(),
            week : date.getDay()
        };
    };
    Datepicker.prototype.initEvents = function () {
        eventUtil.addEvent(this.target , 'click' , this.onClickHandler.bind(this));
    };
    // Datepicker.prototype.getDateData = function (year , month , day) {
    //     if (arguments.length) {
    //         var date = new Date(year , month - 1 , day);
    //     } else {
    //         var date = new Date();
    //     }
    //     var data = {
    //         year : date.getFullYear(),
    //         month : date.getMonth() + 1,
    //         day : date.getDate(),
    //         week : date.getDay(),
    //     };
    //     return data;
    // };
    Datepicker.prototype.renderDatepicker = function () {
        var top , left;
        var frag = document.createDocumentFragment();
        this.datepickerBox = document.createElement('div');
        var html = '<div class="datepicker">'+
                        '<div class="datepicker-header">'+
                            '<div style="position: relative;">'+
                                '<a class="prev-year-btn" href="javaascript:;"><<</a>'+
                                '<a class="prev-month-btn" href="javaascript:;"><</a>'+
                                '<span class="year-month-select">2018年 7月</span>'+
                                '<a class="next-month-btn" href="javascript:;">></a>'+
                                '<a class="next-year-btn" href="javascript:;">>></a>'+
                            '</div>'+
                        '</div>'+
                        '<div class="datepicker-body">'+
                            '<table class="datepicker-table">'+
                                '<thead>'+
                                    '<tr>'+
                                        '<th class="datepicker-column-header">一</th>'+
                                        '<th class="datepicker-column-header">二</th>'+
                                        '<th class="datepicker-column-header">三</th>'+
                                        '<th class="datepicker-column-header">四</th>'+
                                        '<th class="datepicker-column-header">五</th>'+
                                        '<th class="datepicker-column-header">六</th>'+
                                        '<th class="datepicker-column-header">日</th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody class="datepicker-tbody">'+
                                    
                                '</tbody>'+
                            '</table>'+
                        '</div>'+
                        '<div class="datepicker-footer">'+
                            '<span class="datepicker-footer-btn">'+
                                '<a href="javascript:;" class="datepicker-today-btn">今天</a>'+
                            '</span>'+
                        '</div>'+
                    '</div>';
        this.datepickerBox.innerHTML = html;
        frag.appendChild(this.datepickerBox);
        document.body.appendChild(frag);
        this.datepickerBox.style.position = 'absolute';
        var style = this.target.currentStyle || window.getComputedStyle(this.target , null);
        if (this.options.top) {
            top = this.options.top;
        } else {
            top = parseInt(this.target.offsetTop) + parseInt(style.paddingTop) + parseInt(style.paddingBottom) + parseInt(style.height) + parseInt(style.borderTop) + parseInt(style.borderBottom);
        };
        if (this.options.left) {
            left = this.options.left;
        } else {
            left = parseInt(this.target.offsetLeft);
        };
        this.datepickerBox.style.top = top + 'px';
        this.datepickerBox.style.left = left + 'px';
        eventUtil.addEvent(this.datepickerBox , 'click' , this.onChangeHandler.bind(this));
    };
    Datepicker.prototype.removeDatepicker = function () {
        this.datepickerBox.parentNode.removeChild(this.datepickerBox);
        this.data = [];
    };
    Datepicker.prototype.onClickHandler = function () {
        this.dateData();
        // 渲染日期选择器
        this.renderDatepicker();
    };
    Datepicker.prototype.dateData = function () {
        //获取这个月,上个月，下个月的数据
        this.getWantDate();
    };
    Datepicker.prototype.getWantDate = function () {
        // 获取当月的天数
        var days = new Date(this.currentDate.year , this.currentDate.month , 0).getDate();
        // 当月第一天的日期数据
        var firstDate = new Date(this.currentDate.year , this.currentDate.month - 1 , 1);

        
        // 保存当月日期数据
        for (var i = 0 ; i < days ; i++) {
            var ret = {
                year : firstDate.getFullYear(),
                month : firstDate.getMonth() + 1,
                day : firstDate.getDate() + i,
                week : (firstDate.getDay() + i) % 7
            };
            this.data.push(ret);
        }
    };
    Datepicker.prototype.onChangeHandler = function (e) {
        if (e.target.className.indexOf('datepicker-today-btn') > -1) { // 点击的是"今天"按钮
            var date = new Date();
            var res = this.formatDate(this.options.format , date);
            this.target.value = res;
        }
        this.removeDatepicker();
    };
    // 当月天数
    Datepicker.prototype.getMonthDays = function (date) {
        var date = new Date(date.year , date.month , 0);
        return date.getDate();
    };
    // 格式化日期数据
    Datepicker.prototype.formatDate = function (format , date) {
        var self = this;
        var dateData = {
            year : date.getFullYear(),
            month : date.getMonth() + 1,
            day : date.getDate(),
            week : date.getDay(),
            hours : date.getHours(),
            minutes : date.getMinutes(),
            seconds : date.getSeconds(),
            milliseconds : date.getMilliseconds()
        };
        var reg = /Y+|y+|M+|D+|d+|H+|h+|m+|s+|S/g;
        var ret = [];
        format.replace(reg , function ($0) {
            var year , month , day , hours , minutes , seconds , milliseconds;
            switch ($0) {
                case 'y':
                case 'yy':
                case 'yyy':
                case 'yyyy':
                case 'Y':
                case 'YY':
                case 'YYY':
                case 'YYYY':
                    year = (dateData.year + '').slice(-$0.length);
                    ret.push(year);
                    break;
                case 'M':
                    month = dateData.month;
                    ret.push(month);
                    break;
                case 'MM':
                    month = ('0' + dateData.month).slice(-$0.length);
                    ret.push(month);
                    break;
                case 'd':
                case 'D':
                    day = dateData.day;
                    ret.push(day);
                    break;
                case 'dd':
                case 'DD':
                    day = ('0' + dateData.day).slice(-2);
                    ret.push(day);
                    break;
                case 'h':
                case 'H':
                    hours = dateData.hours;
                    ret.push(hours);
                    break;
                case 'hh':
                case 'HH':
                    hours = ('0' + dateData.hours).slice(-2);
                    ret.push(hours);
                    break;
                case 'm':
                    minutes = dateData.minutes;
                    ret.push(minutes);
                    break;
                case 'mm':
                    minutes = ('0' + dateData.minutes).slice(-2);
                    ret.push(minutes);
                    break;
                case 's':
                    seconds = dateData.seconds;
                    ret.push(seconds);
                    break;
                case 'ss':
                    seconds = ('0' + dateData.seconds).slice(-2);
                    ret.push(seconds);
                    break;
                case 'S':
                    milliseconds = dateData.milliseconds;
                    ret.push(milliseconds);
                    break;
            };
        });
        if (self.options.joiner) {
            return ret.join(self.options.joiner);
        } else {
            return ret.join('-')
        }
    };
    root.Datepicker = Datepicker;
})();