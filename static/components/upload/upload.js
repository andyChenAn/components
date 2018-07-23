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
    function Upload (element , options) {
        if (!(this instanceof Upload)) {
            return new Upload(element , options);
        }
        var defaults = {
            uploadMore : false
        };
        this.options = _.extend({} , defaults , options);
        this.target = element;
        this.fileFilter = [];
        this.init();
    };
    Upload.prototype.init = function () {
        // 重置参数
        this.resetOptions();
        // 绑定事件
        this.initEvent();
    };
    Upload.prototype.resetOptions = function () {
        this.options.width = typeof this.options.width == 'string' ? this.options.width : this.options.width + 'px';
        this.options.height = typeof this.options.height == 'string' ? this.options.height : this.options.height + 'px';
    };
    Upload.prototype.initEvent = function () {
        // 点击input标签上传图片
        if (this.target.nodeName.toLowerCase() == 'input') {
            eventUtil.addEvent(this.target , 'change' , this.getFiles.bind(this));
        }
        // 拖拽上传图片
        if (this.target.nodeName.toLowerCase() !== 'input') {
            eventUtil.addEvent(this.target, 'dragover' , this.handleDropHover.bind(this));
            eventUtil.addEvent(this.target , 'dragleave' , this.handleDropHover.bind(this));
            eventUtil.addEvent(this.target , 'drop' , this.getFiles.bind(this));
        }
    }
    Upload.prototype.getFiles = function (e) {
        // 阻止拖拽图片时的默认行为
        this.handleDropHover(e);
        var files = e.target.files || e.dataTransfer.files;
        // 过滤图片
        this.fileFilter = this.fileFilter.concat(this.filterFile(files));
        // 给每张图片添加唯一索引
        this.addFileIndex(this.fileFilter);
        this.onChange(this.fileFilter);
    };
    Upload.prototype.handleDropHover = function (e) {
        e.preventDefault();
        e.stopPropagation();
        // 防止当一个页面中即有点击按钮上传图片，又有拖拽上传图片，通过点击按钮上传图片时，触发OnDragLeave事件
        if (e.type !== 'change') {
            this.options[e.type == 'dragover' ? 'onDragOver' : 'onDragLeave'].call(this , e.target);
        }
    };
    Upload.prototype.filterFile = function (files) {
        var res = [];
        for (var i = 0 ;  i < files.length ; i++) {
            var file = files[i];
            if (file.type.indexOf('image') > -1) {
                if (file.size > this.options.size) {
                    alert('你上传的' + file.name + '尺寸大于' + this.options.size + '请重新上传！');
                } else {
                    res.push(file);
                }
            } else {
                alert('你上传的' + file.name + '不是图片，请重新上传！');
            }
        };
        return res;
    };
    Upload.prototype.addFileIndex = function (files) {
        for (var i = 0 ; i < files.length ; i++) {
            files[i].index = i;
        };
    };
    Upload.prototype.onChange = function (files) {
        if (this.options.onChange && typeof this.options.onChange == 'function') {
            this.options.onChange.call(this , files);
        } else {
            if (window.FileReader && typeof FileReader == 'function') {
                var html = '' ,  i = 0 , self = this , file;
                var renderImage = function () {
                    file = files[i];
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            html += '<div class="upload-append-box">'+
                                        '<span class="upload-img-box">'+
                                            '<img class="upload-img" src="'+ e.target.result +'" style="width : '+ self.options.width +';height : '+ self.options.height +'" />'+
                                        '</span>'+
                                        '<span class="upload-desc">'+
                                            '<span class="upload-filename">'+ file.name +'</span>'+
                                            '<span class="upload-progress">'+
                                                '<span class="upload-progress-default-bar"></span>'+
                                                '<span class="upload-progress-bar" id="upload-progress-'+ file.index +'"></span>'+
                                            '</span>'+
                                        '</span>'+
                                        '<span class="upload-delete" id="upload-delete">x</span>'+
                                    '</div>';
                            i++;
                            renderImage();
                        };
                        reader.readAsDataURL(file);
                    } else {
                        self.options.previewBox.innerHTML = html;
                        var uploadBtn = document.createElement('button');
                        uploadBtn.className = 'upload-btn'
                        uploadBtn.innerText = '上传照片';
                        self.options.previewBox.appendChild(uploadBtn);
                        eventUtil.addEvent(uploadBtn , 'click' , self.uploadFile.bind(self));
                    }
                }
                renderImage();
            }
        }
    };
    Upload.prototype.uploadFile = function () {
        var self = this;
        var fd = new FormData();
        for (var i = 0 ; i < this.fileFilter.length ; i++) {
            var file = this.fileFilter[i];
            (function (file) {
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    eventUtil.addEvent(xhr.upload , 'progress' , function (e) {
                        self.uploadProgress(file , e);
                    });
                }
                xhr.onreadystatechange = function () {
                    if (xhr.status == 200 && xhr.readyState == 4) {
                        typeof self.options.success == 'function' && self.options.success.call(this , file , xhr.responseText);
                        self.deleteFile(file);
                        if (self.fileFilter.length == 0) {
                            self.options.complete.call(this);
                        }
                    } else {
                        self.options.fail.call(this , file , xhr.responseText);
                    }
                };
                fd.append('upload' , file);
                xhr.open('post' , '/upload');
                xhr.send(fd);
            })(file);
        }
    };
    Upload.prototype.deleteFile = function (file) {
        
    };
    Upload.prototype.uploadProgress = function (file , e) {
        var percent = parseInt(e.loaded / e.total * 100) + '%';
        var progressBar = document.getElementById('upload-progress-' + file.index);
        var progressBox = document.getElementsByClassName('upload-progress');
        var progressActive = document.getElementsByClassName('upload-progress-default-bar');
        progressBox[file.index].style.display = 'block';
        progressBar.innerText = percent;
        progressActive[file.index].style.width = percent;
    };
    root.Upload = Upload;
})();