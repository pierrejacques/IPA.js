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
    check(template, data) {
        if (data === null || data === undefined) {
            return false;
        }
        return data.__proto__ === template.prototype;
    },
    guarantee(template, data, asset) {
        const map = new Map([
            [String, ''],
            [Number, 0],
            [Boolean, false],
            [Array, []],
            [Object, {}],
        ]);
        return this.check(template, data) ? data : map.get(template);
    },
    mock(template, asset) {
        const map = new Map([
            [String, asset.generators.getStr],
            [Number, asset.generators.getNum],
            [Boolean, asset.generators.getBool],
            [Array, () => []],
            [Object, () => ({})],
        ]);
        return map.get(template)();
    },
};
