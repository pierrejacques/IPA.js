import { isNumber, random, isBoolean } from 'lodash';

export default (min, max, isFloat = false) => {
    if (!isNumber(min) || !isNumber(max) || !isBoolean(isFloat)) {
        throw new Error('function "Range" only accept Number as 1st & 2nd parameters and Boolean as 3rd parameter');
    }
    if (min > max) {
        throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
    }
    return () => ({
        check: val => isNumber(val) && val >= min && val <= max,
        guarantee: val => {
            if (!isNumber(val)) return (min + max) / 2;
            if (val < min) return min;
            if (val > min) return max;
            return val;
        },
        mock: () => random(min, max, isFloat),
    });
}