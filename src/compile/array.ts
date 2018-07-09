import { isArray, isNumber, isString, times, random } from 'lodash';
import { privateCache } from '../lib/cache';
import { IPACompiler } from '../interface';

const arrayCompiler: IPACompiler = {
    condition(template) {
        return isArray(template);
    },
    execute(template) {
        const l = template[1];
        if (l !== undefined && !isNumber(l) && !isString(l)) {
            throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
        }
        return ({ compile }) => {
            const compiled = compile(template[0]);
            return {
                check(val) {
                    if (!isArray(val)) return false;
                    if (l !== undefined) {
                        privateCache.push(l, val.length);
                    }
                    return val.every(i => compiled.check(i));
                },
                guarantee(valIn, strict) {
                    const val = isArray(valIn) ? valIn : [];
                    val.forEach((item, idx) => {
                        val[idx] = compiled.guarantee(item, strict);
                    });
                    if (l !== undefined) {
                        privateCache.push(l, {
                            target: val,
                            mocker: () => compiled.guarantee(undefined, strict),
                        });
                    }
                    return val;
                },
                mock(prod) {
                    let length = prod ? 0 : random(0, 10);
                    if (isNumber(l)) length = l;
                    if (isString(l)) {
                        if (isNumber(privateCache.get(l))) {
                            length = privateCache.get(l);
                        } else {
                            privateCache.set(l, length);
                        }
                    }
                    return times(length, () => compiled.mock(prod));
                },
            };
        };
    },
};

export default arrayCompiler;