(function () {
    var root = (typeof self == 'object' && self.self == self && self)
            || (typeof global == 'object' && global.global == global && global)
            || this || {};
    var _ = {
        query : function (attr) {
            if (attr.indexOf('#') > -1) {
                return document.querySelector(attr);
            } else {
                return document.querySelectorAll(attr);
            }
        },
        extend : function () {
            var args = [].slice.call(arguments);
            if (args.length == 0) {
                throw new Error('参数不能为空');
            };
            for (var i = 0 ; i < args.length ; i++) {
                var item = args[i];
                if (typeof item !== 'object' && item.toString() !== '[object Object]') {
                    throw new Error('传入的参数必须是对象字面量');
                }
            };
            if (args.length == 1) {
                return args[0];
            };
            var target = args[0];
            var otherArgs = args.slice(1);
            for (var i = 0 ; i < otherArgs.length ; i++) {
                var origin = otherArgs[i];
                for (var key in origin) {
                    target[key] = origin[key];
                }
            }
            return target;
        }
    };
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
})();