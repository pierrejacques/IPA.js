import { isNumber, random } from 'lodash';

export default (min: number, max: number, isFloat: boolean = false) => {
    if (min > max) {
        throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
    }
    return ({ compile, catcher }) => {
        const nb = compile(Number);
        return {
            check: val => catcher.catch('an integer', isNumber(val) && val >= min && val <= max),
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
