import { isInteger, random, toInteger } from 'lodash';

export default () => ({
    check: v => isInteger(v),
    guarantee: (v, strict) => isInteger(v) ? v : strict ? 0 : toInteger(v),
    mock: prod => prod ? 0 : random(0, 1000),
});
