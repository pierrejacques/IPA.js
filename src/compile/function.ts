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
import { IPAFunction, IPAErrorLogType } from '../interface';

const Strat = (
    ck: (input?: any) => boolean,
    cvt: (input?: any) => any,
    dft: any,
    mk: () => any,
    placeholder: string,
): IPAFunction => ({ catcher }) => ({
    check(v) {
        const result = ck(v);
        if (!result) catcher.log({
            type: IPAErrorLogType.Message,
            message: `should be a ${placeholder}`,
        }); 
        return result;
    },
    guarantee(v, strict) {
        return this.check(v) ? v : strict ? dft : cvt(v);
    },
    mock: prod => prod ? dft : mk(),
});

const functionCompilerMap: Map<Function, IPAFunction> = new Map()
    .set(String, Strat(isString, toString, '', randStr, 'string'))
    .set(Number, Strat(isNumber, v => +v || 0, 0, () => random(0, 100), 'number'))
    .set(Boolean, Strat(isBoolean, v => !!v, false, () => !random(0, 1), 'boolean'))
    .set(Array, Strat(isArray, toArray, [], () => [], 'array'))
    .set(Object, Strat(isPlainObject, () => ({}), {}, () => ({}), 'plain object'))
    .set(Function, Strat(isFunction, () => () => {}, () => {}, () => () => {}, 'function'));

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
