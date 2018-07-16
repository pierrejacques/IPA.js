import { random, isPlainObject, isArray } from 'lodash';
import From from "./From";

function getDefaultCondition (temp) {
    if (isPlainObject(temp)) return isPlainObject;
    if (isArray(temp) && temp[1] === undefined) return isArray;
    return () => false;
}

export default (
        subTemplate: any, 
        options: { 
            marker: string;
            border: any;
            condition(input: any): boolean;
        }
    ) => ({ compile, cache }) => {
    const {
        marker = '$$',
        border = From(null),
        condition = getDefaultCondition(subTemplate),
    } = options || {};
    const borderCompiled = compile(border);
    let compiled = null;
    const asset = {
        check: v => borderCompiled.check.call(borderCompiled, v) || compiled.check.call(compiled, v),
        guarantee(v) {
            if (this.check(v)) return v;
            return condition(v) ? compiled.guarantee.call(compiled, v) : borderCompiled.guarantee.call(borderCompiled, v);
        },
        mock: () => random(1) === 0 ? borderCompiled.mock.call(borderCompiled) : compiled.mock.call(compiled),
    };
    cache.set('$$recurseScope', {
        marker,
        asset,
    });
    compiled = compile(subTemplate);
    cache.delete('$$recurseScope');
    return compiled;
}
