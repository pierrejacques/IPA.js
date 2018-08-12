import { random, isPlainObject, isArray } from '../lib/_';
import { recurserSymbol } from '../lib/symbols';
import From from "./From";

function getDefaultCondition (temp) {
    if (isPlainObject(temp)) return isPlainObject;
    if (!isArray(temp)) return () => false;
    const convergeList = [/^0{1,}$/, /^>=0{1,}$/, /^<=?\d{1,}$/]; // 收敛名单
    if (!temp[1] && convergeList.some(i => i.test(temp[1]))) return isArray;
    return v => isArray(v) && v.length > 0;
}

export default (
        subTemplate: any,
        options?: { 
            marker?: string;
            border?: any;
            condition?(input: any): boolean;
        },
    ) => ({ compile, cache, catcher }) => {
    const {
        marker = '$$',
        border = From(null),
        condition = getDefaultCondition(subTemplate),
    } = options || {};
    const borderCompiled = compile(border);
    let compiled = null;
    const counterKey = Symbol('recurserCounter');
    const asset = {
        check: v => {
            return catcher.catch(
                'matched with one of the rules',
                catcher.free(
                    () => borderCompiled.check.call(borderCompiled, v) || compiled.check.call(compiled, v)
                )
            );
        },
        guarantee(v) {
            if (catcher.free(() => this.check(v))) return v;
            return condition(v) ? compiled.guarantee.call(compiled, v) : borderCompiled.guarantee.call(borderCompiled, v);
        },
        mock: (prod) => {
            if (!cache[counterKey]) {
                cache[counterKey] = 1;
            }
            const count = cache[counterKey];
            const result = !prod && count < 10 && random(count) === 0 ? 
                compiled.mock.call(compiled) : borderCompiled.mock.call(borderCompiled);
            cache[counterKey] += 1;
            return result;
        },
    };
    if (!cache.get(recurserSymbol)) cache.set(recurserSymbol, []);
    const stack = cache.get(recurserSymbol);
    stack.unshift({ marker, asset });
    compiled = compile(subTemplate);
    stack.shift();
    if (!stack.length) cache.delete(recurserSymbol);
    return compiled;
}
