import { 
    isFunction,
    isBoolean,
    isNumber,
    toNumber,
    isArray,
    toArray,
    isPlainObject,
    isString,
    toString,
    random,
} from 'lodash';
import randStr from '../lib/randStr';

const geneStrat = (ck, cvt, dft, mk) => () => ({
    check: ck,
    guarantee: (v, strict) => ck(v) ? v : strict ? dft : cvt(v),
    mock: prod => prod ? dft : mk(),
});

const presetClasses = new Map([
    [String, geneStrat(isString, toString, '', randStr)],
    [Number, geneStrat(isNumber, v => { const n = toNumber(v);
        return !isNaN(n) && isFinite(n) ? n : 0;
    }, 0, () => random(0, 100))],
    [Boolean, geneStrat(isBoolean, v => !!v, false, () => !random(0, 1))],
    [Array, geneStrat(isArray, toArray, [], () => [])],
    [Object, geneStrat(isPlainObject, () => ({}), {}, () => ({}))],
]);

export default {
    condition: isFunction,
    execute: template => presetClasses.get(template) || template,
};
