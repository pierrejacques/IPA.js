import generator from '../lib/generator.js';

export default {
    condition(template) {
        const type = typeof template;
        return type !== 'function' && type !== 'object' && type !== 'undefined' && type !== 'null';
    },
    check(template, data, cb) {
        if (typeof template !== typeof data) {
            return false;
        }
        return true;
    },
    guarantee(template, data, cb) {

    },
    mock(template, cb) {
        if (typeof template === 'number') {
            return generator.getNum();
        }
        if (typeof template === 'string') {
            return generator.getStr();
        }
        if (typeof template === 'boolean') {
            return generator.getBool();
        }
        throw new Error(`Mock failed, unsupported type:
            Default value can only have typeof number, string and boolean.`)
    },
};
