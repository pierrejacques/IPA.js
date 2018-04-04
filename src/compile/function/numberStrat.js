import { isNumber, random, toNumber, isFinite, isNaN } from 'lodash';

export default () => ({
    check: isNumber,
    guarantee: (val, strict) => {
        if (strict && !isNumber(val)) return 0;
        const n = toNumber(val);
        return !isNaN(n) && isFinite(n) ? n : 0;
    },
    mock: prod => prod ? 0 : random(0, 100),
});
