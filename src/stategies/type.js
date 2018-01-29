export default {
    condition(template) {
        const validConstructors = new Set([
            String,
            Number,
            Boolean,
            Array,
            Object,
        ]);
        return validConstructors.has(template);
    },
    check(template, data, cb)  {
        if (!data) {
            return false;
        }
        return data.__proto__ === template.prototype
    },
    guarantee(template, data, cb) {

    },
    mock(template, cb) {

    },
};
