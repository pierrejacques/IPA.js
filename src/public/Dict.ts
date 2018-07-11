import { isPlainObject, range, random } from 'lodash';
import randStr from '../lib/randStr';

export default template => ({ compile, catcher }) => {
    const compiled = compile(template);
    return {
        check: val => {
            return catcher.catch('a plain object', isPlainObject(val)) &&
            catcher.catch(
                'a dictionary object',
                Object.keys(val).every(k => catcher.wrap(
                    k,
                    () => compiled.check(val[k]))
                )
            );
        },
        guarantee(val, strict) {
            if (!isPlainObject(val)) return {};
            Object.keys(val).forEach((key) => {
                val[key] = compiled.guarantee(val[key], strict);
            });
            return val;
        },
        mock(prod) {
            const output = {};
            range(0, prod ? 0 : random(1, 10)).forEach(() => {
                output[randStr()] = compiled.mock(prod);
            });
            return output;
        },
    };
};
