import { 
    isString,
    isNumber,
    isBoolean,
    isArray,
    isPlainObject,
} from 'lodash';

const map = new Map();

map.set(String, {
    default: '',
    checker: isString,
});

map.set(Number, {
    default: 0,
    checker: isNumber,
});

map.set(Boolean, {
    default: false,
    checker: isBoolean,
});

map.set(Array, {
    default: [],
    checker: isArray,
});

map.set(Object, {
    default: {},
    checker: isPlainObject,
});

export default {
    condition: template => map.has(template),
    check: (template, data) => map.get(template).checker(data),
    guarantee(template, data) {
        return this.check(template, data) ? data : map.get(template).default;
    },
    mock: (template, asset) => new Map([ // FIXME: 可配置的生成器不应该随计算携带
        [String, asset.generators.getStr],
        [Number, asset.generators.getNum],
        [Boolean, asset.generators.getBool],
        [Array, () => []],
        [Object, () => ({})],
    ]).get(template)(),
};
