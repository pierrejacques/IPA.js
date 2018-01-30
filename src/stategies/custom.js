export default {
    condition(template) {
        return typeof template === 'function' && template !== String && template !== Number && template !== Boolean;
    },
    check(template, data) {
        return template(data).isValid;
    },
    guarantee(template, data) {
        return this.check(template, data) ? data : this.mock(template);
    },
    mock(template) {
        const value = template(null).value;
        if (!template(value).isValid) {
            throw new Error(`Mock failed, custom function illegal:
                Custom function should always outputs valid value whatever the input is.`);
        }
        return value;
    },
};
