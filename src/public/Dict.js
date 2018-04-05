import { isPlainObject, range, random } from 'lodash';
import randStr from '../lib/randStr';

export default template => (compile) => {
    const compiled = compile(template);
    return {
        check(val) {
            if (!isPlainObject(val)) return false;
            let result = true;
            Object.values(val).forEach((value) => {
                result = result && compiled.check(value);
            });
            return result;
        },
        guarantee(valIn, strict) {
            const val = valIn;
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
