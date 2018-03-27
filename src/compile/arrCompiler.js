import { isArray } from 'lodash';
import cache from '../lib/Cache';

// TODO: base on cache

export default {
    condition(template) {
        return isArray(template);
    },
    execute(template) {
        return (compile) => {
            const compiled = compile(template[0]);
            return {
                check(val) {
                    if (!isArray(val)) return false;
                    let result = true;
                    val.forEach(item => {
                        result = result && compiled.check(item);
                    });
                    return result;
                },
                guarantee(val_in) {
                    if (!isArray(val)) return [];
                    const val = val_in;
                    val.forEach((item, idx) => {
                        val[idx] = compiled.guarantee(item);
                    });
                    return val;
                },
                mock() {
                    return [];
                }
            }
        }
    }
}