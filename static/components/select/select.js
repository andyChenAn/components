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
    // 兼容数组的indexOf方法，IE8不支持
    Array.prototype.indexOf = Array.prototype.indexOf || function (element , fromIndex) {
        var next = +fromIndex || 0;
        var len = this.length;
        var k;
        if (len == 0) {
            return -1;
        };
        if (next >= len) {
            return -1;
        };
        k = Math.max(next >= 0 ? next : len - Math.abs(next) , 0);
        while (k < len) {
            if (this[k] === element) {
                return k;
            };
            k++;
        };
        return -1;
    };
    function Select (target , options) {
        if (!(this instanceof Select)) {
            return new Select(target , options);
        }
        var defaults = {
            type : 'select',    //地区选择方式，select或pop-select
            parse : true
        };
        this.target = target;
        this.options = _.extend({} , defaults , options);
        this.data = null;
        this.list = {};
        this.isThree = false;  // 是否有第三级（直辖市是没有第三级的）
        this.isClick = false;  // 当地区选择是弹框选择的时候，需要用到
        this.complete = false;  // 如果完成了一次完整的地区选择，那么下次就不用初始化了，直接拿上一次选择的地区
        if (this.options.type == 'select') {
            for (var i = 0 , len = this.target.children.length; i < len ; i++) {
                if (this.target.children[i].name == 'province') {
                    this.provinceDom = this.target.children[i]
                } else if (this.target.children[i].name == 'city') {
                    this.cityDom = this.target.children[i];
                }
            }
        } else if (this.options.type == 'pop-select') {
            for (var i = 0 , len = this.target.children.length; i < len ; i++) {
                if (this.target.children[i].className == 'address') {
                    this.addressDom = this.target.children[i];
                    break;
                }
            };
        }
        this.init();
    };
    Select.prototype.init = function () {
        // 绑定事件
        if (this.options.type == 'select') {
            eventUtil.addEvent(this.provinceDom , 'change' , this.onChangeProvince.bind(this));
            eventUtil.addEvent(this.cityDom , 'change' , this.onChangeCity.bind(this));
        } else if (this.options.type == 'pop-select') {
            eventUtil.addEvent(this.addressDom , 'click' , this.onClick.bind(this));
        }
        // 获取数据，如果dataUrl没有填写的花，那么传入data属性，将data属性的值赋值给this.list
        if (this.options.dataUrl) {
            this.getData();
        } else {
            this.list = this.options.data;
            this.renderProvinceData();
            this.initSelect();
        }
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
                if (self.options.parse) {
                    self.parseData();
                } else {
                    self.list = self.data;
                    self.renderProvinceData();
                    self.initSelect();
                }
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
                        // 同一个省份下的所有城市
                        if (code2 % 100 == 0) {
                            this.list[this.data[code1]][this.data[code2]] = [];
                            for (var code3 in this.data) {
                                var q = code3 - code2;
                                // 城市下的区或县
                                if (q > 0 && q < 100) {
                                    this.list[this.data[code1]][this.data[code2]].push(this.data[code3]);
                                }
                            }
                        // 同一个省份下的所有省直属县
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
        if (this.options.type == 'select') {
            this.renderProvinceData();
            this.initSelect();
        } else if (this.options.type == 'pop-select') {
            
        }
    };
    Select.prototype.onClick = function () {
        if (!this.isClick) {
            this.isClick = true;
            if (!this.complete) {
                this.initPopSelect();
            } else {
                this.selectContainer.style.display = 'block';
            }
        }
    };
    Select.prototype.initPopSelect = function () {
        var html = '<div class="select-container" id="select-container">'+
                        '<ul class="select-overflow" id="select-nav-box">'+
                            '<li class="select-nav" id="province-select" style="display:none;">请选择</li>'+
                            '<li class="select-nav" id="city-select" style="display:none;">请选择</li>'+
                            '<li class="select-nav" id="area-select" style="display:none;">请选择</li>'+
                        '</ul>'+
                        '<div class="select-desc" id="select-desc">'+
                            '<div class="select-overflow" id="select-province-item-box" style="display:none;">'+
                            '</div>'+
                            '<div class="select-overflow" id="select-city-item-box" style="display:none;">'+
                            '</div>'+
                            '<div class="select-overflow" id="select-area-item-box" style="display:none;">'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        var div = document.createElement('div');
        div.innerHTML = html;
        this.target.appendChild(div);
        this.selectProvinceItemBox = document.getElementById('select-province-item-box');
        this.selectCityItemBox = document.getElementById('select-city-item-box');
        this.selectAreaItemBox = document.getElementById('select-area-item-box');
        this.provinceSelect = document.getElementById('province-select');
        this.citySelect = document.getElementById('city-select');
        this.areaSelect = document.getElementById('area-select');
        this.selectContainer = document.getElementById('select-container');
        this.selectNavBox = document.getElementById('select-nav-box');
        this.selectDesc = document.getElementById('select-desc');
        eventUtil.addEvent(this.selectContainer , 'click' , this.onSelect.bind(this));
        var provinceName = this.provinceSelect.innerText;
        for (var province in this.list) {
            var tpl = '<li class="select-item"><span>'+ province +'</span></li>';
            this.selectProvinceItemBox.innerHTML += tpl;
        };
        this.provinceSelect.style.display = 'block';
        this.provinceSelect.className = 'select-nav select-current';
        this.selectProvinceItemBox.style.display = 'block';
        if (this.options.setPopStyle && this.options.setPopStyle.toString() == '[object Object]') {
            for (var attr in this.options.setPopStyle) {
                this.selectContainer.style[attr] = this.options.setPopStyle[attr]
            }
        };
    };
    Select.prototype.onSelect = function (evt) {
        var element = evt.target || window.event.srcElement;
        function changeNavStyle (target) {
            for (var i = 0 ; i < this.selectNavBox.children.length ; i++) {
                if (this.selectNavBox.children[i].className.indexOf('select-current') > -1) {
                    this.selectNavBox.children[i].className = 'select-nav';
                    break;
                }
            };
            target.className = 'select-nav select-current';
        };
        // 点击的是导航区域
        if (element.id && element.id == 'province-select') {
            this.selectProvinceItemBox.style.display = 'block';
            this.selectCityItemBox.style.display = 'none';
            this.selectAreaItemBox.style.display = 'none';
            changeNavStyle.call(this , this.provinceSelect);
        } else if (element.id && element.id == 'city-select') {
            this.selectCityItemBox.style.display = 'block';
            this.selectProvinceItemBox.style.display = 'none';
            this.selectAreaItemBox.style.display = 'none';
            changeNavStyle.call(this , this.citySelect);
        } else if (element.id && element.id == 'area-select') {
            this.selectCityItemBox.style.display = 'none';
            this.selectProvinceItemBox.style.display = 'none';
            this.selectAreaItemBox.style.display = 'block';
            changeNavStyle.call(this , this.areaSelect);
        // 点击的内容区域
        } else if (element.nodeName.toLowerCase() == 'span') {
            if (this.provinceSelect.className.indexOf('select-current') > -1) {   // 点击的是省
                // 市选择导航显示
                this.citySelect.style.display = 'block';
                this.areaSelect.style.display = 'none';
                this.areaSelect.innerHTML = '请选择';
                this.citySelect.innerHTML = '请选择';
                // 更新省份
                this.popProvinceName = element.innerText;
                this.provinceSelect.innerHTML = this.popProvinceName;
                // 导航样式切换
                for (var i = 0 ; i < this.selectNavBox.children.length ; i++) {
                    if (this.selectNavBox.children[i].className.indexOf('select-current') > -1) {
                        this.selectNavBox.children[i].className = 'select-nav';
                        break;
                    }
                };
                this.citySelect.className = 'select-nav select-current';

                // 每次选择的时候都删除之前的数据，重新赋值
                this.selectCityItemBox.innerHTML = '';
                // 如果是直辖市或者香港或者澳门
                if (this.list[this.popProvinceName].length) {
                    for (var i = 0 , len = this.list[this.popProvinceName].length ; i < len ; i++) {
                        var city = this.list[this.popProvinceName][i];
                        var tpl = '<li class="select-item"><span>'+ city +'</span></li>';
                        this.selectCityItemBox.innerHTML += tpl;
                    };
                // 如果是省份
                } else {
                    for (var city in this.list[this.popProvinceName]) {
                        var tpl = '<li class="select-item"><span>'+ city +'</span></li>';
                        this.selectCityItemBox.innerHTML += tpl;
                    }
                };
                // 只显示当前数据的容器
                this.selectCityItemBox.style.display = 'block';
                this.selectProvinceItemBox.style.display = 'none';
                this.selectAreaItemBox.style.display = 'none';
                // 每次选择触发一次onChange事件
                if (this.options.onChange && typeof this.options.onChange == 'function') {
                    this.options.onChange.call(this);
                }
            } else if (this.citySelect.className.indexOf('select-current') > -1) {    // 点击的是市
                // 更新当前省份所选择的城市
                this.popCityName = element.innerText;
                this.citySelect.innerHTML = this.popCityName;
                // 县选择导航展示
                this.areaSelect.style.display = 'block';
                this.areaSelect.innerHTML = '请选择';
                // 导航样式切换
                for (var i = 0 ; i < this.selectNavBox.children.length ; i++) {
                    if (this.selectNavBox.children[i].className.indexOf('select-current') > -1) {
                        this.selectNavBox.children[i].className = 'select-nav';
                        break;
                    }
                };
                this.areaSelect.className = 'select-nav select-current';                
                // 如果是省份
                if (this.list[this.popProvinceName].toString() == '[object Object]') {
                    // 每次选择的时候都删除之前的数据，重新赋值
                    this.selectAreaItemBox.innerHTML = '';
                    for (var i = 0 , len = this.list[this.popProvinceName][this.popCityName].length ; i < len ; i++) {
                        var area = this.list[this.popProvinceName][this.popCityName][i];
                        var tpl = '<li class="select-item"><span>'+ area +'</span></li>';
                        this.selectAreaItemBox.innerHTML += tpl;
                    }
                    this.selectCityItemBox.style.display = 'none';
                    this.selectProvinceItemBox.style.display = 'none';
                    this.selectAreaItemBox.style.display = 'block';
                    if (this.options.onChange && typeof this.options.onChange == 'function') {
                        this.options.onChange.call(this);
                    }
                // 如果是直辖市或者香港或者澳门，则点击到这里就完成一次地区选择了
                } else {
                    this.selectContainer.style.display = 'none';
                    this.areaSelect.style.display = 'none';
                    this.citySelect.className = 'select-nav select-current';
                    this.isClick = false;
                    this.complete = true;
                    if (this.options.onChange && typeof this.options.onChange == 'function') {
                        this.options.onChange.call(this);
                    };
                    if (this.options.onLastChange && typeof this.options.onLastChange == 'function') {
                        this.options.onLastChange.call(this , this.popProvinceName , this.popCityName);
                    };
                }
            } else {    // 点击的是县
                // 更新当前选择市下面的县
                this.popAreaName = element.innerText;
                this.areaSelect.innerHTML = this.popAreaName;
                // 关闭弹框
                this.selectContainer.style.display = 'none';
                // 重新设置是否点击过省份，市，县
                this.isClick = false;
                // 表示完成一次地区选择
                this.complete = true;
                // 执行相应的回调函数
                if (this.options.onChange && typeof this.options.onChange == 'function') {
                    this.options.onChange.call(this);
                };
                if (this.options.onLastChange && typeof this.options.onLastChange == 'function') {
                    this.options.onLastChange.call(this , this.popProvinceName , this.popCityName , this.popAreaName);
                };
            }
        }
    };
    Select.prototype.renderProvinceData = function () {
        var fragDoc = document.createDocumentFragment();
        for (var province in this.list) {
            var option = document.createElement('option');
            option.setAttribute('name' , province);
            option.setAttribute('value' , province);
            option.innerText = province;
            fragDoc.appendChild(option);
        };
        this.provinceDom.appendChild(fragDoc);
    };
    Select.prototype.initSelect = function () {
        if (this.options.province) {
            for (var i = 0 , len = this.provinceDom.options.length ; i < len ; i++) {
                var provinceName = this.provinceDom.options[i].getAttribute('name');
                if (provinceName) {
                    if (provinceName.indexOf(this.options.province) > -1) {
                        this.provinceDom.options[i].selected = true;
                        break;
                    }
                }
            };
            if (this.options.city) {
                var cityName = '';
                var fragDoc1 = document.createDocumentFragment();
                if (this.list[provinceName]) {
                    // 区别省份和直辖市或香港，澳门
                    if (this.list[provinceName].length) {
                        for (var j = 0 , len1 = this.list[provinceName].length ; j < len1 ; j++) {
                            var option = document.createElement('option');
                            var city1 = this.list[provinceName][j];
                            option.setAttribute('name' , city1);
                            option.setAttribute('value' , city1);
                            option.innerText = city1;
                            fragDoc1.appendChild(option);
                        }
                        this.cityDom.appendChild(fragDoc1);
                        for (var i = 0 , len2 = this.cityDom.options.length ; i < len2 ; i++) {
                            cityName = this.cityDom.options[i].getAttribute('name');
                            if (cityName) {
                                if (cityName.indexOf(this.options.city) > -1) {
                                    this.cityDom.options[i].selected = true;
                                    break;
                                }
                            }
                        };
                    } else {
                        for (var city in this.list[provinceName]) {
                            var option = document.createElement('option');
                            option.setAttribute('name' , city);
                            option.setAttribute('value' , city);
                            option.innerText = city;
                            fragDoc1.appendChild(option);
                        };
                        this.cityDom.appendChild(fragDoc1);
                        for (var i = 0 , len2 = this.cityDom.options.length ; i < len2 ; i++) {
                            cityName = this.cityDom.options[i].getAttribute('name');
                            if (cityName) {
                                if (cityName.indexOf(this.options.city) > -1) {
                                    this.cityDom.options[i].selected = true;
                                    break;
                                }
                            }
                        };
                    }
                };
                if (this.options.area) {
                    this.isThree = true;
                    var areaName = '';
                    var fragDoc2 = document.createDocumentFragment();
                    var selectDom = document.createElement('select');
                    selectDom.name = 'area';
                    selectDom.innerHTML = '<option>- 请选择 -</option>';
                    this.target.appendChild(selectDom);
                    for (var j = 0 , len = this.target.children.length ; j < len ; j++) {
                        if (this.target.children[j].name == 'area') {
                            this.areaDom = this.target.children[j];
                        }
                    };
                    for (var i = 0 , len = this.list[provinceName][cityName].length ; i < len ; i++) {
                        var area = this.list[provinceName][cityName][i];
                        var option = document.createElement('option');
                        option.setAttribute('name' , area);
                        option.setAttribute('value' , area);
                        option.innerText = area;
                        fragDoc2.appendChild(option);
                    };
                    this.areaDom.appendChild(fragDoc2);
                    for (var i = 0 , len2 = this.areaDom.options.length ; i < len2 ; i++) {
                        areaName = this.areaDom.options[i].getAttribute('name');
                        if (areaName) {
                            if (areaName.indexOf(this.options.area) > -1) {
                                this.areaDom.options[i].selected = true;
                                break;
                            }
                        }
                    };
                }
            }
        };
    };
    Select.prototype.onChangeProvince = function (evt) {
        var target = evt.target || window.event.srcElement;
        var currentIndex = target.selectedIndex;
        var currentOption = this.provinceDom.children[currentIndex];
        var currentValue = currentOption.innerText;
        this.cityDom.innerHTML = '<option>- 请选择 -</option>';
        if (this.isThree) {
            this.areaDom.innerHTML = '<option>- 请选择 -</option>';
        }
        var fragDoc = document.createDocumentFragment();
        if (!this.list[currentValue].length) {     // 省份
            for (var city in this.list[currentValue]) {
                var option = document.createElement('option');
                option.setAttribute('name' , city);
                option.setAttribute('value' , city);
                option.innerText = city;
                fragDoc.appendChild(option);
            };
            if (!this.isThree) {
                var selectDom = document.createElement('select');
                selectDom.name = 'area';
                selectDom.innerHTML = '<option>- 请选择 -</option>';
                this.target.appendChild(selectDom);
                for (var i = 0 , len = this.target.children.length ; i < len ; i++) {
                    if (this.target.children[i].name == 'area') {
                        this.areaDom = this.target.children[i];
                    }
                }
                eventUtil.addEvent(this.areaDom , 'change' , this.onChangeArea.bind(this));
                this.isThree = true;
            };
        } else {    // 非省份
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
        if (this.options.onChange && typeof this.options.onChange == 'function') {
            this.options.onChange.call(this ,  currentValue);
        }
    };
    Select.prototype.onChangeCity = function (evt) {
        var target = evt.target || window.event.srcElement;
        var currentIndex = target.selectedIndex;
        var currentOption = this.cityDom.children[currentIndex];
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
        };
        if (this.options.onChange && typeof this.options.onChange == 'function') {
            this.options.onChange.call(this , currentValue);
        }
    };
    Select.prototype.onChangeArea = function (evt) {
        var target = evt.target || window.event.srcElement;
        var currentIndex = target.selectedIndex;
        var currentOption = this.areaDom.children[currentIndex];
        var currentValue = currentOption.innerText;
        if (this.options.onChange && typeof this.options.onChange == 'function') {
            this.options.onChange.call(this , currentValue);
        }
    };
    root.Select = Select;
})();