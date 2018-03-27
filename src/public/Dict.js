import { isPlainObject, range, random } from 'lodash';
import randStr from '../lib/randStr';

export default (template) => {
    return compile => {
        const compiled = compile(template);
        return {
            check(val) {
                if (!isPlainObject(val)) return false;
                let result = true;
                Object.values(val).forEach(value => {
                    result = result && compiled.check(value);
                });
                return result;
            },
            guarantee(val) {
                if (!isPlainObject(val)) return {};
                Object.keys(val).forEach(key => {
                    val[key] = compiled.guarantee(val[key]);
                });
                return val;
            },
            mock() {
                const output = {};
                range(0, random(1, 10)).forEach(idx => {
                    output[randStr()] = compiled.mock();
                });
                return output;
            },
        };
    };
}