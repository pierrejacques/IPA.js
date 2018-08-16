import { isArray, isNumber, isString, times, every, loop } from '../lib/_';
import lengthManager from '../lib/length-manager';
import { IPACompiler } from '../interface';

const arrayCompiler: IPACompiler = {
    condition(template) {
        return isArray(template);
    },
    execute(template) {
        let l = template[1];
        if (l !== undefined && !isNumber(l) && !isString(l)) {
            throw new Error('compile failed: the 2nd parameter for array can only be String or Number');
        }
        l = l && l.toString();
        return ({ compile, catcher }) => {
            const compiled = compile(template[0]);
            return {
                check(val) {
                    if (!isArray(val)) {
                        return catcher.catch('array');
                    }
                    if (l !== undefined) {
                        lengthManager.push(l, {
                            length: val.length,
                            key: catcher.currentKey,
                            method: 'check',
                        });
                    }
                    return every(val, (item, index) => catcher.wrap(index, () => compiled.check(item)));
                },
                guarantee(valIn, strict) {
                    let val = valIn;
                    let isFree = false;
                    if (!catcher.catch('an array', isArray(valIn))) {
                        val = [];
                        isFree = true;
                    } else {
                        loop(val, (item, i) => {
                            val[i] = catcher.wrap(
                                i,
                                () => compiled.guarantee(item, strict),
                            );
                        });
                    }
                    if (l !== undefined) {
                        lengthManager.push(l, {
                            target: val,
                            key: catcher.currentKey,
                            isFree,
                            mocker: () => compiled.guarantee.call(compiled, undefined, strict),
                            method: 'fix',
                        });
                    }
                    return val;
                },
                mock(prod) {
                    return times(
                        lengthManager.generate(l, prod),
                        () => compiled.mock.call(compiled, prod)
                    );
                },
            };
        };
    },
};

export default arrayCompiler;
