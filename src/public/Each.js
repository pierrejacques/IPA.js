import { isArray } from 'lodash';

export default (template, strictLength = true) => {
    if (!isArray(template)) throw new Error('function "Each" only accepts array as parameter');
    return compile => {
        const compiled = template.map(item => compile(item));
        return {
            check(val) {
                if (!isArray(val)) return false;
                let result = strictLength ? val.length === template.length : true;
                compiled.forEach((item, idx) => {
                    result = result && item.check(val[idx]);
                });
                return result;
            },
            guarantee(val_in) {
                const val = isArray(val_in) ? val_in : [];
                compiled.forEach((item, idx) => {
                    val[idx] = item.guarantee(val[idx]);
                });
                if (strictLength) {
                    val.splice(compiled.length);
                }
                return val;
            },
            mock: () => compiled.map(item => item.mock()),
        };
    };
}