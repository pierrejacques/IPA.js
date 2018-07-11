import { isNumber, min, max } from 'lodash';
import { privateCache } from './cache';
import every from './every';
import catcher from './catcher';

export default () => {
    let result = true;
    privateCache.forEach((value, key) => {
        if (isNumber(key)) {
            value.forEach(item => {
                if (item.length !== key) {
                    catcher.log(item.key, `length unequals to ${key}`);
                    result = false;
                }
            });
        } else {
            const lengths = value.map(item => item.length);
            if (min(lengths) !== max(lengths)) {
                result = false;
                value.forEach((item) => catcher.log(item.key, 'length unmatched'));
            }
        }
    });
    return result;
};
