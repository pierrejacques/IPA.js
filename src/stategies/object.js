function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

export default {
    condition(template) {
        return isObject(template);
    },
    check(template, data, cb) {
        if (!isObject(data)) {
            return false;
        }
        let ret = true;
        Object.keys(template).forEach(key => {
            ret = ret && cb(template[key], data[key]);
        });
        return ret;
    },
    guarantee(template, data, cb) {
        if (!isObject(data)) {
            return this.mock(template, cb.asset.mock);
        }
        const retData = data;
        Object.keys(template).forEach(key => {
            retData[key] = cb(template[key], data[key]);
        });
        return retData;
    },
    mock(template, cb) {
        const object = {};
        Object.keys(template).forEach(key => {
            object[key] = cb(template[key]);
        });
        return object;
    },
}
