import { isArray, isNumber, isString, range, random } from 'lodash';
import cache from '../lib/Cache';

export default {
    condition(template) {
        return isArray(template);
    },
    execute(template) {
        const l = template[1];
        if (l && !isNumber(l) && !isString(l)) {
            throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
        }
        return (compile) => {
            const compiled = compile(template[0]);
            return {
                check(val) {
                    if (!isArray(val)) return false;
                    let result = true;
                    val.forEach(item => {
                        result = result && compiled.check(item);
                    });
                    if (l) {
                        cache.push(l, val.length);
                    }
                    return result;
                },
                guarantee(val_in) {
                    const val = isArray(val_in) ? val_in : [];
                    val.forEach((item, idx) => {
                        val[idx] = compiled.guarantee(item);
                    });
                    if (l) {
                        cache.push(l, {
                            target: val,
                            mocker: compiled.mock,
                        });
                    }
                    return val;
                },
                mock() {
                    const output = [];
                    let length = random(0, 10);;
                    if (l && isNumber(l)) length = l;
                    if (l && isString(l)) {
                        if (cache.get(l)) {
                            length = cache.get(l);
                        } else {
                            cache.set(l, length);
                        }
                    }
                    range(0, length).forEach(idx => {
                        output[idx] = compiled.mock();
                    });
                    return output;
                }
            }
        }
    }
}