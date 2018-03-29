import { isInteger, random, toInteger } from 'lodash';

export default () => ({
    check: isInteger,
    guarantee: toInteger,
    mock: () => random(0, 1000),
});
