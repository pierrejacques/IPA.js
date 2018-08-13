import { isPlainObject, loop, random } from '../lib/_';
import randStr from '../lib/randStr';
import { every } from '../lib/logics';

export default template => ({ compile, catcher }) => {
    const compiled = compile(template);
    return {
        check: val => {
            return catcher.catch('a plain object', isPlainObject(val)) &&
            every(Object.keys(val), k => catcher.wrap(
                k,
                () => compiled.check(val[k]))
            );
        },
        guarantee(val, strict) {
            if (!catcher.catch('a plain object', isPlainObject(val))) return {};
            Object.keys(val).forEach((key) => {
                val[key] = catcher.wrap(key, () => compiled.guarantee(val[key], strict));
            });
            return val;
        },
        mock(prod) {
            const output = {};
            loop(prod ? 0 : random(1, 10), () => {
                output[randStr()] = compiled.mock(prod);
            });
            return output;
        },
    };
};
