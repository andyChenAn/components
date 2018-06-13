/**
 * 获取元素对象
 * @param {String} id 元素属性
 */
const $ = (id) => {
    if (id.indexOf('#') > -1) {
        return document.querySelector(id);
    } else {
        return document.querySelectorAll(id);
    }
};

// 兼容requestAnimationFrame和cancelAnimationFrame
let requestAnimationFrame = (function () {
    return window.requestAnimationFrame 
        || window.webkitRequestAnimationFrame
        || function (callback) {
            setTimeout(callback , 1000 / 60);
        }
})();
let cancelAnimationFrame = (function () {
    if (!window.cancelAnimationFrame) {
        return function (id) {
            clearTimeout(id);
        }
    }
    return window.cancelAnimationFrame;
})();

/**
 * 合并对象属性
 * @param {Array} args 参数数组
 */
const extend = function (...args) {
    args.map((obj) => {
        if (!(typeof obj == 'object' && obj.toString() == '[object Object]')) {
            throw new Error('所传入的参数必须是对象');
        }
    });
    if (args.length < 1) {
        throw new Error('必须包含两个参数以上');
    }
    let target = args[0];
    args = args.slice(1);
    for (let i = 0 ; i < args.length ; i++) {
        let origin = args[i];
        for (let key in origin) {
            target[key] = origin[key];
        }
    }
    return target;
};