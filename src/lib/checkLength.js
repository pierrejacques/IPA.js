import { isNumber, min, max } from 'lodash';
import cache from './Cache';

export default () => {
    let result = true;
    cache.forEach((value, key) => {
        if (isNumber(key)) {
            result = result && value.filter(item => item !== key).length === 0;
        } else {
            result = result && min(value) === max(value);
        }
    });
    return result;
};
