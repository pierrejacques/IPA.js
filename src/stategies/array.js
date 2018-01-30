import generator from '../lib/generator.js';

const checkLength = (para, data, cache) => {
    if (typeof para === 'number' && data.length !== para) {
        return false;
    }
    if (typeof para === 'string') {
        if (!cache[para]) {
            cache[para] = data.length;
        } else if (cache[para] !== data.length) {
            return false;
        }
    }
    return true;
};

export default {
    condition(template) {
        return Object.prototype.toString.call(template) === '[object Array]';
    },
    check(template, data, cb) {
        if (Object.prototype.toString.call(data) !== '[object Array]') {
            return false;
        }
        if (template[1] && !checkLength(template[1], data, cb.cache)) {
            return false;
        }
        if (data.length === 0) {
            return true;
        }
        if (template[0] !== undefined) {
            let ret = true;
            data.forEach(item => {
                ret = ret && cb(template[0], item);
            });
            return ret;
        }
        return true;
    },
    guarantee(template, data, cb) {


    },
    mock(template, cb) {
        const array = [];
        let len = generator.getNum() + 1;
        if (typeof template[1] === 'number') {
            len = template[1];
        }
        if (typeof template[1] === 'string') {
            if (cb.cache[template[1]]) {
                len = cb.cache[template[1]];
            } else {
                cb.cache[template[1]] = len;
            }
        }
        if (template[0] !== undefined) {
            for (let i = 0; i < len; i++) {
                array.push(cb(template[0]));
            }
        }
        return array;
    },
};
