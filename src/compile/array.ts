import { isArray, isNumber, isString, times, random } from 'lodash';
import { privateCache } from '../lib/cache';
import { IPACompiler } from '../interface';
import every from '../lib/every';

const arrayCompiler: IPACompiler = {
    condition(template) {
        return isArray(template);
    },
    execute(template) {
        const l = template[1];
        if (l !== undefined && !isNumber(l) && !isString(l)) {
            throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
        }
        return ({ compile, catcher }) => {
            const compiled = compile(template[0]);
            return {
                check(val) {
                    if (!isArray(val)) {
                        return catcher.catch('array');
                    }
                    if (l !== undefined) {
                        privateCache.push(l, {
                            length: val.length,
                            key: catcher.currentKey,
                        });
                    }
                    return catcher.catch('a correct array', every(val, (item, index) => {
                        return catcher.wrap(index, () => compiled.check(item));
                    }));
                },
                guarantee(valIn, strict) {
                    const val = catcher.catch('array', isArray(valIn)) ? valIn : [];
                    val.forEach((item, idx) => {
                        val[idx] = compiled.guarantee(item, strict);
                    });
                    if (l !== undefined) {
                        privateCache.push(l, {
                            target: val,
                            key: catcher.currentKey,
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