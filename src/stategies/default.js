export default {
    condition(template) {
        const type = typeof template;
        return type !== 'function' && type !== 'object' && type !== 'undefined' && type !== 'null';
    },
    check(template, data, cb) {
        if (typeof template !== typeof data) {
            return false;
        }
        return true;
    },
    guarantee(template, data, cb) {

    },
    mock(template, cb) {

    },
};
