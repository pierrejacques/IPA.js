function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}

function isValidLength(template, data, cache) {
    const para = template[1];
    if (para === undefined) {
        return true;
    }
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
}

function isTemplateDefined(template) {
    return template[0] !== undefined;
}


export default {
    condition(template) {
        return isArray(template);
    },
    check(template, data, asset) {
        if (!isArray(data)) {
            return false;
        }
        if (!isValidLength(template, data, asset.cache)) {
            return false;
        }
        if (data.length === 0) {
            return true;
        }
        if (isTemplateDefined(template)) {
            let ret = true;
            data.forEach((item) => {
                ret = ret && asset.recursions.check(template[0], item);
            });
            return ret;
        }
        return true;
    },
    guarantee(template, data, asset) {
        const retData = data;
        if (!isArray(retData)) {
            return this.mock(template, asset);
        }
        if (!isValidLength(template, retData, asset.cache)) {
            // 一种更好的算法是记录下所有的位点，最后在cache中遍历修正，不然会出现遗少改多的情况， 对check而言同样如此
            const target = asset.cache[template[1]];
            if (retData.length > target) {
                retData.splice(target);
            } else {
                for (let i = 0; i < target - retData.length; i++) {
                    retData.push(asset.recursions.mock(template[0]));
                }
            }
        }
        if (retData.length !== 0 && isTemplateDefined(template)) {
            retData.forEach((_, idx) => {
                retData[idx] = asset.recursions.guarantee(template[0], retData[idx]);
            });
        }
        return retData;
    },
    mock(template, asset) {
        const array = [];
        let len = asset.generators.getNum() + 1;
        if (typeof template[1] === 'number') {
            len = template[1];
        }
        if (typeof template[1] === 'string') {
            if (asset.cache[template[1]]) {
                len = asset.cache[template[1]];
            } else {
                asset.cache[template[1]] = len;
            }
        }
        if (isTemplateDefined(template)) {
            for (let i = 0; i < len; i++) {
                array.push(asset.recursions.mock(template[0]));
            }
        }
        return array;
    },
};
