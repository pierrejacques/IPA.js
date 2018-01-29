export default {
    condition(template) {
        return Object.prototype.toString.call(template) === '[object Object]'
    },
    check(template, data, cb) {
        if (Object.prototype.toString.call(data) !== '[object Object]') {
            return false;
        }
        let ret = true;
        Object.keys(template).forEach(key => {
            ret = ret && cb(template[key], data[key]);
        });
        return ret;
    },
    guarantee(template, data, cb) {

    },
    mock(template, cb) {
        const object = {};
        Object.keys(template).forEach(key => {
            object[key] = cb(template[key]);
        });
        return object;
    },
}
