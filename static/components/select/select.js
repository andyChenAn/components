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
        this.list = {};
        this.isThree = false;
        this.provinceDom = document.getElementById('province');
        this.cityDom = document.getElementById('city');
        this.init();
    };
    Select.prototype.init = function () {
        // 绑定事件
        eventUtil.addEvent(this.provinceDom , 'change' , this.onChangeProvince.bind(this));
        eventUtil.addEvent(this.cityDom , 'change' , this.onChangeCity.bind(this));
        // 获取数据
        this.getData();
    };
    // 获取数据
    Select.prototype.getData = function () {
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
        for (var code1 in this.data) {
            if (code1 % 10000 == 0) {
                if (['北京市' , '上海市' , '天津市' , '重庆市' , '香港特别行政区' , '澳门特别行政区'].indexOf(this.data[code1]) > -1) {
                    this.list[this.data[code1]] = [];
                    for (var code4 in this.data) {
                        var j = code4 - code1;
                        if (j > 100 && j < 250) {
                            this.list[this.data[code1]].push(this.data[code4]);
                        }
                    }
                } else {
                    this.list[this.data[code1]] = {};
                }
                for (var code2 in this.data) {
                    var p = code2 - code1;
                    if (p > 0 && p < 10000) {
                        if (code2 % 100 == 0) {
                            this.list[this.data[code1]][this.data[code2]] = [];
                            for (var code3 in this.data) {
                                var q = code3 - code2;
                                if (q > 0 && q < 100) {
                                    this.list[this.data[code1]][this.data[code2]].push(this.data[code3]);
                                }
                            }
                        } else if (p > 8000) {
                            this.list[this.data[code1]][this.data[code2]] = [];
                            for (var code4 in this.data) {
                                var q = code4 - code2;
                                if (q > 0 && q < 100) {
                                    this.list[this.data[code1]][this.data[code2]].push(this.data[code4]);
                                }
                            }
                        }
                    };
                }
            }
        };
        this.renderProvinceData();
    };
    Select.prototype.renderProvinceData = function () {
        var provinceDom = document.getElementById('province');
        var fragDoc = document.createDocumentFragment();
        for (var province in this.list) {
            var option = document.createElement('option');
            option.setAttribute('name' , province);
            option.setAttribute('value' , province);
            option.innerText = province;
            fragDoc.appendChild(option);
        };
        provinceDom.appendChild(fragDoc);
    };
    Select.prototype.onChangeProvince = function (evt) {
        var currentIndex = evt.target.selectedIndex;
        var currentOption = this.provinceDom.children[currentIndex];
        var currentOptionValue = parseInt(currentOption.value);
        var currentValue = currentOption.innerText;
        this.cityDom.innerHTML = '<option>- 请选择 -</option>';
        //this.areaDom.innerHTML = '<option>- 请选择 -</option>';
        var fragDoc = document.createDocumentFragment();
        if (!this.list[currentValue].length) {
            for (var city in this.list[currentValue]) {
                var option = document.createElement('option');
                option.setAttribute('name' , city);
                option.setAttribute('value' , city);
                option.innerText = city;
                fragDoc.appendChild(option);
            };
            if (!this.isThree) {
                var selectDom = document.createElement('select');
                selectDom.id = 'area';
                selectDom.name = 'area';
                selectDom.innerHTML = '<option>- 请选择 -</option>';
                this.target.appendChild(selectDom);
                this.areaDom = document.getElementById('area');
                this.isThree = true;
            };
        } else {
            this.isThree = false;
            for (var i = 0 , len = this.list[currentValue].length ; i < len ; i++) {
                var city = this.list[currentValue][i];
                var option = document.createElement('option');
                option.setAttribute('name' , city);
                option.setAttribute('value' , city);
                option.innerText = city;
                fragDoc.appendChild(option);
            };
            if (this.areaDom) {
                this.target.removeChild(this.areaDom);
            };
        }
        this.cityDom.appendChild(fragDoc);
    };
    Select.prototype.onChangeCity = function (evt) {
        var currentIndex = evt.target.selectedIndex;
        var currentOption = this.cityDom.children[currentIndex];
        var currentOptionValue = parseInt(currentOption.value);
        var currentValue = currentOption.innerText;
        this.areaDom.innerHTML = '<option>- 请选择 -</option>';
        for (var province in this.list) {
            for (var city in this.list[province]) {
                if (city == currentValue) {
                    var fragDoc = document.createDocumentFragment();
                    for (var i = 0 , len = this.list[province][city].length ; i < len ; i++) {
                        var area = this.list[province][city][i];
                        var option = document.createElement('option');
                        option.setAttribute('name' , area);
                        option.setAttribute('value' , area);
                        option.innerText = area;
                        fragDoc.appendChild(option);
                    };
                    this.areaDom.appendChild(fragDoc);
                }
            }
        }
    };
    Select.prototype.renderAreaData = function (area) {
        var areaDom = document.getElementById('area');
        
    }
    root.Select = Select;
})();