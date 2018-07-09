;(function () {
    var root = (typeof self == 'object' && self.self == self && self)
            || (typeof global == 'object' && global.global == global && global)
            || this || {};
    function Datepicker (element , options) {
        if (!(this instanceof Datepicker)) {
            return new Datepicker(element , options);
        }
        var defaults = {

        };
        this.target = element;
        this.options = _.extend({} , defaults , options);
        this.init();
    };
    Datepicker.prototype.init = function () {
        // 获取当前日期数据
        this.getCurrentDate();
        // 渲染日期html
        this.renderDatepicker();
    };
    Datepicker.prototype.getCurrentDate = function () {
        var date = new Date();
        var dateData = {
            year : date.getFullYear(),
            month : date.getMonth() + 1,
            day : date.getDate(),
            week : date.getDay()
        };
        return dateData;
    };
    Datepicker.prototype.renderDatepicker = function () {
        var frag = document.createDocumentFragment();
        var dateBox = document.createElement('div');
        document.body.appendChild(frag);
    };
    root.Datepicker = Datepicker;
})();