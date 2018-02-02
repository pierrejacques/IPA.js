export default {
    condition(template) {
        return typeof template === 'function' && template !== String && template !== Number && template !== Boolean;
    },
    check(template, data) {
        return template(data).isValid;
    },
    guarantee(template, data, asset) { // 无论如何都走mock
        return this.mock(template, asset);
    },
    mock(template, asset) {
        const value = template(asset.seed).value;
        if (!template(value).isValid) {
            throw new Error(`Mock failed, custom function illegal:
                Custom function should always outputs valid value whatever the input is.`);
        }
        return value;
    },
};
