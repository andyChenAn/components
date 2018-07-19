;(function () {
    var root = (typeof self == 'object' && self.self == self && self)
            || (typeof global == 'object' && global.global == global && global)
            || this || {};
    function Upload (element , options) {
        if (!(this instanceof Upload)) {
            return new Upload(element , options);
        }
        var defaults = {

        };
        this.target = element;
        this.options = _.extend({} , defaults , options);
        this.init();
    };
    Upload.prototype.init = function () {
        
    };
    root.Upload = Upload;
})();