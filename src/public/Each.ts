import { isArray } from 'lodash';

export default (template, strictLength = true) => {
    if (!isArray(template)) throw new Error('function "Each" only accepts array as parameter');
    return ({ compile }) => {
        const compiled = template.map(item => compile(item));
        return {
            check: val => isArray(val) && (!strictLength || val.length === template.length) && compiled.every((item, i) => item.check(val[i])),
            guarantee(valIn, strict) {
                const val = isArray(valIn) ? valIn : [];
                compiled.forEach((item, idx) => {
                    val[idx] = item.guarantee(val[idx], strict);
                });
                if (strictLength) {
                    val.splice(compiled.length);
                }
                return val;
            },
            mock: prod => compiled.map(item => item.mock(prod)),
        };
    };
};
