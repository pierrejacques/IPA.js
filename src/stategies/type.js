import generator from '../lib/generator.js';

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
    check(template, data)  {
        if (data === null || data === undefined) {
            return false;
        }
        return data.__proto__ === template.prototype
    },
    guarantee(template, data) {
        return this.check(template, data) ? data : this.mock(template);
    },
    mock(template) {
        const map = new Map([
            [String, generator.getStr],
            [Number, generator.getNum],
            [Boolean, generator.getBool],
            [Array, () => []],
            [Object, () => ({})],
        ]);
        return map.get(template)();
    },
};
