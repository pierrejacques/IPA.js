import { isNumber, random } from 'lodash';

export default (min, max, isFloat = false) => {
    if (!isNumber(min) || !isNumber(max)) {
        throw new Error('function "Range" only accept Number as 1st & 2nd parameters');
    }
    if (min > max) {
        throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
    }
    return ({ compile }) => {
        const nb = compile(Number);
        return {
            check: val => isNumber(val) && val >= min && val <= max,
            guarantee: (val, strict) => {
                const v = nb.guarantee(val, strict);
                if (v < min) return min;
                if (v > max) return max;
                return v;
            },
            mock: (prod) => prod ? min : random(min, max, isFloat),
        }
    };
};
