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
} from '../lib/_';
import bypasser from './util.bypasser';
import randStr from '../lib/randStr';
import { IPAFunction  } from '../interface';

const Strat = (
    ck: (input?: any) => boolean,
    cvt: (input?: any) => any,
    dft: any,
    mk: () => any,
    describe: string,
): IPAFunction => ({ catcher }) => ({
    check: v => catcher.catch(describe, ck(v)),
    guarantee(v, strict) {
        return this.check(v) ? v : strict ? dft : cvt(v);
    },
    mock: prod => prod ? dft : mk(),
});

const functionCompilerMap: Map<Function, IPAFunction> = new Map()
    .set(String, Strat(isString, toString, '', randStr, 'a string'))
    .set(Number, Strat(isNumber, v => +v || 0, 0, () => random(0, 100), 'a number'))
    .set(Boolean, Strat(isBoolean, v => !!v, false, () => !random(0, 1), 'a boolean'))
    .set(Array, Strat(isArray, toArray, [], () => [], 'an array'))
    .set(Object, Strat(isPlainObject, () => ({}), {}, () => ({}), 'a plain object'))
    .set(Function, Strat(isFunction, () => () => {}, () => {}, () => () => {}, 'a function'));

export default {
    condition: isFunction,
    execute: template => {
        if (functionCompilerMap.has(template)) return functionCompilerMap.get(template);
        return (cp) => Object.assign({}, bypasser, template(cp));
    },
};
