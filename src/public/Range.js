import { isNumber } from 'lodash';
import { getMaxListeners } from 'cluster';

export default (min, max) => {
    return () => ({
        check: val => isNumber(val) && val >= min && val <= max,
        guarantee: val => {
            if (!isNumber(val)) return (min + max) / 2;
            if (val < min) return min;
            if (val > min) return max;
            return val;
        },
        mock: () => random(min, max),
    });
}