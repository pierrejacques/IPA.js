import { isPlainObject, isString, every, loop } from '../lib/_';
import { IPACompiler } from '../interface';
import { IPALike } from '../lib/peer-classes';

const objectCompiler: IPACompiler = {
    condition(template) {
        return isPlainObject(template) && !(template instanceof IPALike)
    },
    execute(template) {
        return ({ compile, catcher }) => {
            const compiled = {};
            const notRequiredExp = /^(.{1,})\?$/;
            const stillRequiredExp = /^.{0,}\\\?$/;
            const isAbsent = v => v === undefined || v === null;
            loop(Object.entries(template), ([key, value]) => {
                const rule = compile(value);
                if (!isString(key) || !notRequiredExp.test(key)) {
                    compiled[key] = rule; 
                    return;
                }
                if (stillRequiredExp.test(key)) {
                    compiled[key.slice(0, -2) + '?'] = rule;
                    return;
                }
                compiled[notRequiredExp.exec(key)[1]] = {
                    check: v => isAbsent(v) || rule.check.call(rule, v),
                    guarantee: (v, s) => isAbsent(v) ? v : rule.guarantee.call(rule, v, s),
                    mock: rule.mock.bind(rule),
                };
            });
            return {
                check: val => {
                    return catcher.catch('a plain object', isPlainObject(val)) &&
                    every(Object.keys(compiled), (key) => catcher.wrap(
                        key,
                        () => compiled[key].check(val[key])),
                    );
                },
                guarantee(valIn, strict) {
                    let val = valIn;
                    const process = () => {
                        loop(Object.keys(compiled), (key) => {
                            const absent = !val.hasOwnProperty(key);
                            const result = catcher.wrap(key, () => compiled[key].guarantee(val[key], strict));
                            if (absent && result === undefined) return;
                            val[key] = result;
                        })
                    }
                    if (!catcher.catch('a plain object', isPlainObject(valIn))) {
                        val = {};
                        catcher.free(process);
                    } else {
                        process();
                    }
                    return val;
                },
                mock(prod) {
                    const val = {};
                    loop(Object.keys(compiled), (key) => {
                        val[key] = compiled[key].mock(prod);
                    });
                    return val;
                },
            };
        };
    },
};

export default objectCompiler;
