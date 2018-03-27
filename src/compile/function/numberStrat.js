import { isNumber, random, toNumber, isFinite, isNaN } from 'lodash';

export default () => ({
    check: isNumber,
    guarantee: val => {
        const output = isNumber(val) ? val : toNumber(val);
        return !isNaN(output) && !isFinite(output) ? output : 0;
    },
    mock: val => random(0, 100),
});