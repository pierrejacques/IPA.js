import { isType } from '../type/index.js';

const map = new Map([
    [String, ''],
    [Number, 0],
    [Boolean, false],
    [Array, []],
    [Object, {}],
]);

export default {
    condition: template => map.has(template),
    check: (template, data) => isType(data, template),
    guarantee(template, data) {
        return this.check(template, data) ? data : map.get(template)
    },
    mock: (template, asset) => new Map([
        [String, asset.generators.getStr],
        [Number, asset.generators.getNum],
        [Boolean, asset.generators.getBool],
        [Array, () => []],
        [Object, () => ({})],
    ]).get(template)(),
};
