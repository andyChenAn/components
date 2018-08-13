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
            autoUpload : false,
            previewBox : document.body,
            width : 70,
            height : 70,
            size : 1024 * 1024 * 2,
            onDragOver : function () {},
            onDragLeave : function () {}
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
        // 如果传入的是一个数组
        if (Object.prototype.toString.call(this.target) == '[object Array]') {
            for (var i = 0 ; i < this.target.length ; i++) {
                if (this.target[i].nodeName.toLowerCase() == 'input') {
                    eventUtil.addEvent(this.target[i] , 'change' , this.getFiles.bind(this));
                } else if (this.target[i].nodeName.toLowerCase() != 'input') {
                    eventUtil.addEvent(this.target[i], 'dragover' , this.handleDropHover.bind(this));
                    eventUtil.addEvent(this.target[i] , 'dragleave' , this.handleDropHover.bind(this));
                    eventUtil.addEvent(this.target[i] , 'drop' , this.getFiles.bind(this));
                }
            }
        } else {
            // 点击input标签上传图片
            if (this.target.nodeName.toLowerCase() == 'input') {
                eventUtil.addEvent(this.target , 'change' , this.getFiles.bind(this));
            }
            // 拖拽上传图片
            if (this.target.nodeName.toLowerCase() != 'input') {
                eventUtil.addEvent(this.target, 'dragover' , this.handleDropHover.bind(this));
                eventUtil.addEvent(this.target , 'dragleave' , this.handleDropHover.bind(this));
                eventUtil.addEvent(this.target , 'drop' , this.getFiles.bind(this));
            }
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
            if (files[i]) {
                files[i].index = i;
            }
        };
    };
    Upload.prototype.onChange = function (files) {
        // 因为删除图片的时候，使用了null来占位，所以当要展示预览图时，将所有为null的元素过滤掉
        var newFiles = files.filter(function (file) {
            if (file) {
                return file;
            }
        });
        if (window.FileReader && typeof FileReader == 'function') {
            var html = '' ,  i = 0 , self = this , file;
            // 这里可以添加预览图渲染出来之前的loading效果
            //this.options.previewBox.classList.add('render-loading');
            var renderImage = function () {
                file = newFiles[i];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        html += '<div class="upload-append-box" id="upload-list-'+ file.index +'">'+
                                    '<span class="upload-img-box">'+
                                        '<img class="upload-img" src="'+ e.target.result +'" style="width : '+ self.options.width +';height : '+ self.options.height +'" />'+
                                    '</span>'+
                                    '<span class="upload-desc">'+
                                        '<span class="upload-filename">'+ file.name +'</span>'+
                                        '<span class="upload-progress" id="upload-progress-box-'+ file.index +'">'+
                                            '<span class="upload-progress-default-bar" id="upload-progress-default-bar-'+ file.index +'"></span>'+
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
                    // 删除loading效果
                    //self.options.previewBox.classList.remove('render-loading');
                    self.options.previewBox.innerHTML = html;
                    self.uploadBtn = document.createElement('button');
                    self.uploadBtn.className = 'upload-btn'
                    self.uploadBtn.innerText = '上传照片';
                    self.options.previewBox.appendChild(self.uploadBtn);
                    var deleteBtns = document.getElementsByClassName('upload-delete');
                    for (var j = 0 ; j < deleteBtns.length ; j++) {
                        eventUtil.addEvent(deleteBtns[j] , 'click' , self.removeFile.bind(self))
                    }
                    if (!self.options.autoUpload) {
                        eventUtil.addEvent(self.uploadBtn , 'click' , self.uploadFile.bind(self));
                    } else {
                        self.uploadFile();
                    }
                }
            }
            renderImage();
        }
    };
    Upload.prototype.uploadFile = function () {
        var self = this;
        var fd = new FormData();
        for (var i = 0 ; i < this.fileFilter.length ; i++) {
            var file = this.fileFilter[i];
            // 因为在上传图片到服务器之前，可以删除，这里的删除方式也是使用数组的splice方法。
            // this.fileFilter.splice(index , 1 , null)，将需要删除的file对象设置为null，作为占位符，防止数组索引发生变化
            // 当file为null时，跳过本次循环，进入下一个循环
            if (!file) {
                continue;
            }
            (function (file) {
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    eventUtil.addEvent(xhr.upload , 'progress' , function (e) {
                        self.uploadProgress(file , e);
                    });
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            typeof self.options.success == 'function' && self.options.success.call(this , file , xhr.responseText);
                            self.deleteFile(file);
                            var noFile = self.fileFilter.every(function (item) {
                                return item === null;
                            });
                            if (noFile) {
                                // 清空保存图片文件的数组
                                self.clearFiles();
                                // 所有图片都上传成功之后的回调
                                self.options.complete.call(this);
                            }
                        } else {
                            self.deleteFile(file);
                            self.options.fail.call(this , file , xhr.responseText);
                        }
                    }
                };
                fd.append('upload' , file);
                xhr.open('post' , '/upload');
                xhr.send(fd);
            })(file);
        }
    };
    Upload.prototype.deleteFile = function (file) {
        var uploadBox = document.getElementById('upload-list-' + file.index);
        // 因为删除数组中的一个元素，会导致数组中的索引发生变化，所以这里为了保证索引一致，当删除一个元素时，添加一个null补位，防止索引发生变化
        // 当数组中的所有图片都上传之后，如果每一个元素都是null，那么表示图片都已经上传完，然后再重新将this.fileFilter设置为空数组
        this.fileFilter.splice(file.index , 1 , null)
        uploadBox.parentNode.removeChild(uploadBox);
    };
    Upload.prototype.uploadProgress = function (file , e) {
        var percent = parseInt(e.loaded / e.total * 100) + '%';
        var progressBar = document.getElementById('upload-progress-' + file.index);
        var progressBox = document.getElementById('upload-progress-box-' + file.index);
        var progressActive = document.getElementById('upload-progress-default-bar-' + file.index);
        progressBox.style.display = 'block';
        progressBar.innerText = percent;
        progressActive.style.width = percent;
    };
    Upload.prototype.clearFiles = function () {
        this.uploadBtn.parentNode.removeChild(this.uploadBtn);
        this.fileFilter = [];
    };
    Upload.prototype.removeFile = function (e) {
        var target = e.target;
        var arr = target.parentNode.getAttribute('id').split('-');
        var index = parseInt(arr[arr.length - 1]);
        this.fileFilter.splice(index , 1 , null);
        target.parentNode.parentNode.removeChild(target.parentNode);
    }
    root.Upload = Upload;
})();