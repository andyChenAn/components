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
    function Select (target , options) {
        if (!(this instanceof Select)) {
            return new Select(target , options);
        }
        var defaults = {

        };
        this.target = target;
        this.options = _.extend({} , defaults , options);
        this.data = null;
        this.provinceDom = document.getElementById('province');
        this.cityDom = document.getElementById('city');
        this.areaDom = document.getElementById('area');
        this.init();
    };
    Select.prototype.init = function () {
        // 绑定事件
        eventUtil.addEvent(this.provinceDom , 'change' , this.onChangeProvince.bind(this));
        eventUtil.addEvent(this.cityDom , 'change' , this.onChangeCity.bind(this));
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
                };
                self.parseData();
            }
        };
        xhr.send();
    };
    Select.prototype.parseData = function () {
        var province = {};
        for (var code in this.data) {
            if (code % 10000 == 0) {
                province[code] = this.data[code];
            }
        };
        this.renderProvinceData(province);
    };
    Select.prototype.renderProvinceData = function (province) {
        var provinceDom = document.getElementById('province');
        var fragDoc = document.createDocumentFragment();
        for (var code in province) {
            var option = document.createElement('option');
            option.setAttribute('name' , code);
            option.setAttribute('value' , code);
            option.innerText = province[code];
            fragDoc.appendChild(option);
        };
        provinceDom.appendChild(fragDoc);
    };
    Select.prototype.onChangeProvince = function (evt) {
        var currentIndex = evt.target.selectedIndex;
        var currentOption = this.provinceDom.children[currentIndex];
        var currentOptionValue = parseInt(currentOption.value);
        var currentValue = currentOption.innerText;
        var municipalities = ['北京市' , '天津市' , '重庆市' , '上海市'];
        this.cityDom.innerHTML = '<option>- 请选择 -</option>';
        //this.areaDom.innerHTML = '<option>- 请选择 -</option>';
        var city = {};
        // if (municipalities.indexOf(currentValue) == -1) {
        //     var areaDom = document.createElement('select');
        //     areaDom.id = 'area';
        //     areaDom.name = 'area';
        //     areaDom.innerHTML = '<option>- 请选择 -</option>';
        //     //areaDom.setAttribute('disabled' , true);
        //     this.target.appendChild(areaDom);
        // };
        for (var code in this.data) {
            var p = code - currentOptionValue;
            if (municipalities.indexOf(currentValue) > -1) {
                if (p > 0 && p < 10000) {
                    city[code] = this.data[code];
                }
            } else {
                if (p > 0 && p < 10000) {
                    if (code % 100 == 0) {
                        city[code] = this.data[code];
                    };
                }
            }
        };
        this.renderCityData(city);
    };
    Select.prototype.renderCityData = function (city) {
        var cityDom = document.getElementById('city');
        cityDom.innerHTML = '<option>- 请选择 -</option>';
        var fragDoc = document.createDocumentFragment();
        for (var code in city) {
            var option = document.createElement('option');
            option.setAttribute('name' , code);
            option.setAttribute('value' , code);
            option.innerText = city[code];
            fragDoc.appendChild(option);
        };
        cityDom.appendChild(fragDoc);
    };
    Select.prototype.onChangeCity = function (evt) {
        var currentIndex = evt.target.selectedIndex;
        var currentOption = this.cityDom.children[currentIndex];
        var currentOptionValue = parseInt(currentOption.value);
        var area = {};
        for (var code in this.data) {
            var p = code - currentOptionValue;
            if (p > 0 && p < 100) {
                area[code] = this.data[code];
            }
        };
        this.renderAreaData(area);
    };
    Select.prototype.renderAreaData = function (area) {
        var areaDom = document.getElementById('area');
        areaDom.innerHTML = '<option>- 请选择 -</option>';
        var fragDoc = document.createDocumentFragment();
        for (var code in area) {
            var option = document.createElement('option');
            option.setAttribute('name' , code);
            option.setAttribute('value' , code);
            option.innerText = area[code];
            fragDoc.appendChild(option);
        };
        areaDom.appendChild(fragDoc);
    }
    root.Select = Select;
})();