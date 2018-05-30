import { 
    isFunction,
    isBoolean,
    isNumber,
    isArray,
    toArray,
    isPlainObject,
    isString,
    toString,
    random,
} from 'lodash';
import randStr from '../lib/randStr';

const Strat = (ck, cvt, dft, mk) => () => ({
    check: ck,
    guarantee: (v, strict) => ck(v) ? v : strict ? dft : cvt(v),
    mock: prod => prod ? dft : mk(),
});

const presets = new Map([
    [String, Strat(isString, toString, '', randStr)],
    [Number, Strat(isNumber, v => +v || 0, 0, () => random(0, 100))],
    [Boolean, Strat(isBoolean, v => !!v, false, () => !random(0, 1))],
    [Array, Strat(isArray, toArray, [], () => [])],
    [Object, Strat(isPlainObject, () => ({}), {}, () => ({}))],
    [Function, Strat(isFunction, v => Function(toString(v)), Function(), () => Function())],
]);

const bypass = {
    check: () => true,
    guarantee: v => v,
    mock: () => undefined,
};

export default {
    condition: isFunction,
    execute: template => {
        if (presets.has(template)) return presets.get(template);
        return (cp) => Object.assign({}, bypass, template(cp));
    },
};
