let _ = {
    query : function (attr) {
        if (attr.indexOf('#') > -1) {
            return document.querySelector(attr);
        } else {
            return document.querySelectorAll(attr);
        }
    },
    extend : function (...args) {
        if (args.length == 0) {
            throw new Error('参数不能为空');
        };
        args.map(function (item) {
            if (typeof item !== 'object' && item.toString() !== '[object Object]') {
                throw new Error('传入的参数必须是对象字面量');
            }
        });
        if (args.length == 1) {
            return args[0];
        };
        let target = args[0];
        let otherArgs = args.slice(1);
        for (let i = 0 ; i < otherArgs.length ; i++) {
            let origin = otherArgs[i];
            for (let key in origin) {
                target[key] = origin[key];
            }
        }
        return target;
    }
}

