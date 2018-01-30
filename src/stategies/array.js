import generator from '../lib/generator.js';

function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}

function isValidLength(template, data, cache) {
    if (!template[1]) {
        return true;
    }
    const para = template[1];
    if (typeof para === 'number' && data.length !== para) {
        return false;
    }
    if (typeof para === 'string') {
        if (cache[para] === undefined) {
            cache[para] = data.length;
        } else if (cache[para] !== data.length) {
            return false;
        }
    }
    return true;
};

function isTemplateDefined(template) {
    return template[0] !== undefined;
}


export default {
    condition(template) {
        return isArray(template);
    },
    check(template, data, cb) {
        if (!isArray(data)) {
            return false;
        }
        if (!isValidLength(template, data, cb.asset.cache)) {
            return false;
        }
        if (data.length === 0) {
            return true;
        }
        if (isTemplateDefined(template)) {
            let ret = true;
            data.forEach(item => {
                ret = ret && cb(template[0], item);
            });
            return ret;
        }
        return true;
    },
    guarantee(template, data, cb) {
        const retData = data;
        if (!isArray(retData)) {
            return this.mock(template, cb.asset.mock);
        }
        if (!isValidLength(template, retData, cb.asset.cache)) {
            // 一种更好的算法是记录下所有的位点，最后在cache中遍历修正，不然会出现遗少改多的情况， 对check而言同样如此
            const target = cache[template[1]];
            if (retData.length > target) {
                retData.splice(target);
            } else {
                for (i = 0; i < target - retData.length; i++) {
                    retData.push(this.mock(template[0], cb.asset.mock));
                }
            }
        }
        if (retData.length !== 0 && isTemplateDefined(template)) {
            retData.forEach((_, idx) => {
                retData[idx] = cb(template[0]);
            });
        }
        return retData;
    },
    mock(template, cb) {
        const array = [];
        let len = generator.getNum() + 1;
        if (typeof template[1] === 'number') {
            len = template[1];
        }
        if (typeof template[1] === 'string') {
            if (cb.asset.cache[template[1]]) {
                len = cb.asset.cache[template[1]];
            } else {
                cb.asset.cache[template[1]] = len;
            }
        }
        if (isTemplateDefined(template)) {
            for (let i = 0; i < len; i++) {
                array.push(cb(template[0]));
            }
        }
        return array;
    },
};
