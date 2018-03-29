import { isNumber, random } from 'lodash';

export default (min, max, isFloat = false) => {
    if (!isNumber(min) || !isNumber(max)) {
        throw new Error('function "Range" only accept Number as 1st & 2nd parameters');
    }
    if (min > max) {
        throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
    }
    return () => ({
        check: val => isNumber(val) && val >= min && val <= max,
        guarantee: (val) => {
            if (!isNumber(val)) return (min + max) / 2;
            if (val < min) return min;
            if (val > min) return max;
            return val;
        },
        mock: () => random(min, max, isFloat),
    });
};
