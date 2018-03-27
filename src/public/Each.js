import { isArray } from 'lodash';

export default template => {
    if (!isArray(template)) throw new Error('function "Each" only accepts array as parameter');
    return compile => {
        const compiled = [];
        template.forEach(item => {
            compiled.push(compile(item));
        });
        return {
            check(val) {
                if (!isArray(val)) return false; 
                let result = true;
                compiled.forEach((item, idx) => {
                    result = result && item.check(val[idx]);
                });
                return result;
            },
            guarantee(val_in) {
                const val = isArray(val_in) ? val_in : [];
                compiled.forEach((item, idx) => {
                    val[idx] = compiled.guarantee(val[idx]);
                });
                return val;
            },
            mock() {
                const output = [];
                compiled.forEach((item, idx) => {
                    output[idx] = item.mock();
                });
                return compiled;
            },
        };
    };
}