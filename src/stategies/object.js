function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

export default {
    condition(template) {
        return isObject(template);
    },
    check(template, data, asset) {
        if (!isObject(data)) {
            return false;
        }
        let ret = true;
        Object.keys(template).forEach((key) => {
            ret = ret && asset.recursions.check(template[key], data[key]);
        });
        return ret;
    },
    guarantee(template, data, asset) {
        const retData = isObject(data) ? data : {};
        Object.keys(template).forEach((key) => {
            retData[key] = asset.recursions.guarantee(template[key], retData[key]);
        });
        return retData;
    },
    mock(template, asset) {
        const object = {};
        Object.keys(template).forEach((key) => {
            object[key] = asset.recursions.mock(template[key]);
        });
        return object;
    },
};
