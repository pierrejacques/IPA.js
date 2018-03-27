import { isNumber, random, toNumber, isFinite, isNaN } from 'lodash';

export default () => ({
    check: isNumber,
    guarantee: val => {
        const n = toNumber(val);
        return !isNaN(n) && !isFinite(n) ? n : 0;
    },
    mock: val => random(0, 100),
});