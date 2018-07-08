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
import { IPAFunction } from '../interface';

const Strat = (
    ck: (input?: any) => boolean,
    cvt: (input?: any) => any,
    dft: any,
    mk: () => any,
): IPAFunction => () => ({
    check: ck,
    guarantee: (v, strict) => ck(v) ? v : strict ? dft : cvt(v),
    mock: prod => prod ? dft : mk(),
});

const functionCompilerMap: Map<Function, IPAFunction> = new Map()
    .set(String, Strat(isString, toString, '', randStr))
    .set(Number, Strat(isNumber, v => +v || 0, 0, () => random(0, 100)))
    .set(Boolean, Strat(isBoolean, v => !!v, false, () => !random(0, 1)))
    .set(Array, Strat(isArray, toArray, [], () => []))
    .set(Object, Strat(isPlainObject, () => ({}), {}, () => ({})))
    .set(Function, Strat(isFunction, () => () => {}, () => {}, () => () => {}));

const bypass = {
    check: () => true,
    guarantee: v => v,
    mock: () => undefined,
};

export default {
    condition: isFunction,
    execute: template => {
        if (functionCompilerMap.has(template)) return functionCompilerMap.get(template);
        return (cp) => Object.assign({}, bypass, template(cp));
    },
};
