export default {
    condition(template) {
        const type = typeof template;
        return type !== 'function' && type !== 'object' && type !== 'undefined' && type !== 'null';
    },
    check(template, data) {
        return typeof template === typeof data;
    },
    guarantee(template, data) {
        return this.check(template, data) ? data : template;
    },
    mock(template, asset) {
        if (typeof template === 'number') {
            return asset.generators.getNum();
        }
        if (typeof template === 'string') {
            return asset.generators.getStr();
        }
        if (typeof template === 'boolean') {
            return asset.generators.getBool();
        }
        throw new Error(`Mock failed, unsupported type:
            Default value can only have typeof number, string and boolean.`)
    },
};
