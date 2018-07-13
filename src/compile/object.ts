import { isPlainObject } from 'lodash';
import { IPACompiler } from '../interface';
import IPALike from '../lib/ipa-like';
import every from '../lib/every';

const objectCompiler: IPACompiler = {
    condition(template) {
        return isPlainObject(template) && !(template instanceof IPALike)
    },
    execute(template) {
        return ({ compile, catcher }) => {
            const compiled = {};
            Object.keys(template).forEach((key) => {
                compiled[key] = compile(template[key]);
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
                        Object.keys(compiled).forEach((key) => {
                            val[key] = catcher.wrap(key, () => compiled[key].guarantee(val[key], strict));
                        });
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
                    Object.keys(compiled).forEach((key) => {
                        val[key] = compiled[key].mock(prod);
                    });
                    return val;
                },
            };
        };
    },
};

export default objectCompiler;
