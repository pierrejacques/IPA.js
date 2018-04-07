import { isPlainObject } from 'lodash';
import _core_ from '../lib/symbol';

export default {
    condition(template) {
        return isPlainObject(template) && !template[_core_];
    },
    execute(template) {
        return (compile) => {
            const compiled = {};
            Object.keys(template).forEach((key) => {
                compiled[key] = compile(template[key]);
            });
            return {
                check(val) {
                    if (!isPlainObject(val)) return false;
                    let result = true;
                    Object.keys(compiled).forEach((key) => {
                        result = result && compiled[key].check(val[key]);
                    });
                    return result;
                },
                guarantee(valIn, strict) {
                    const val = isPlainObject(valIn) ? valIn : {};
                    Object.keys(compiled).forEach((key) => {
                        val[key] = compiled[key].guarantee(val[key], strict);
                    });
                    return val;
                },
                mock(prod) {
                    const val = {};
                    Object.keys(compiled).forEach((key) => {
                        val[key] = compiled[key].mock(prod);
                    });
                    return val;
                },
            };
        };
    },
};
