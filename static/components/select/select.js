;(function () {
    var root = (typeof self == 'object' && self.self == self && self)
            || (typeof global == 'object' && global.global == global && global)
            || this || {};
    function Select (target , options) {
        if (!(this instanceof Select)) {
            return new Select(target , options);
        }
        var defaults = {

        };
        this.target = target;
        this.options = _.extend({} , defaults , options);
        this.data = null;
        this.init();
    };
    Select.prototype.init = function () {
        // 获取数据
        this.getAreaData();
    };
    // 获取数据
    Select.prototype.getAreaData = function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('get' , this.options.dataUrl);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    self.data = JSON.parse(xhr.responseText);
                } catch (err) {
                    console.log('将数据解析为json对象失败');
                }
            }
        };
        xhr.send();
    };
    root.Select = Select;
})();