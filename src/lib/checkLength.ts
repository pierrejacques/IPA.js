import { isNumber, min, max } from 'lodash';
import { privateCache } from './cache';
import fullCheck from './fullCheck';

export default () => {
    let result = true;
    privateCache.forEach((value, key) => {
        if (isNumber(key)) {
            result = result && fullCheck(value, item => item === key);
        } else {
            result = result && min(value) === max(value);
        }
    });
    return result;
};
