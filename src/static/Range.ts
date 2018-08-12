import { isNumber, toNumber, random } from '../lib/_';
import { and } from '../lib/logics';

export default (min: number, max: number, isFloat: boolean = false) => {
    if (min > max) {
        throw new Error('in function "Range", min(1st param) must be no larger than max(2st param)');
    }
    return ({ compile, catcher }) => {
        return {
            check: val => and(
                catcher.catch('a number', isNumber(val)),
                catcher.catch(`in range [${min}, ${max}]`, val >= min && val <= max),
            ),
            guarantee(val, strict) {
                if (this.check(val)) return val;
                return catcher.free(() => {
                    const v = compile(Number).guarantee(val, strict);
                    if (v < min) return min;
                    if (v > max) return max;
                    return v;
                });
            },
            mock: (prod) => prod ? min : random(min, max, isFloat),
        }
    };
};
