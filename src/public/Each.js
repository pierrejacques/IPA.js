import { isArray } from 'lodash';

export default template => {
    if (!isArray(template)) throw new Error('function "Each" only accepts array as parameter');
    return compile => {
        const compiled = template.map(item => compile(item));
        return {
            check(val) {
                if (!isArray(val)) return false;
                let result = val.length === template.length;
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
                val.splice(compiled.length);
                return val;
            },
            mock() {
                const output = [];
                compiled.forEach((item, idx) => {
                    output[idx] = item.mock();
                });
                return output;
            },
        };
    };
}