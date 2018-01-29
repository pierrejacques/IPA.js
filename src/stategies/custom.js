export default {
    condition(template) {
        return typeof template === 'function' && template !== String && template !== Number && template !== Boolean;
    },
    check(template, data, cb) {
        return template(data).isValid;
    },
    guarantee(template, data, cb) {

    },
    mock(template, cb) {
        const value = cb(null);
        if (!cb(value).isValid) {
            throw new Error(`Mock failed, custom function illegal:
                Custom function should always outputs valid value whatever the input is.`);
        }
        return value;
    },
};
