export default {
    condition(template) {
        return template === null;
    },
    check(template, data) {
        return data !== undefined;
    },
    guarantee(template, data, asset) {
        return this.check(template, data) ? data : asset.seed;
    },
    mock(template, asset) {
        return asset.seed;
    },
};
