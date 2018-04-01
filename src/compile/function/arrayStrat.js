import { isArray, toArray } from 'lodash';

export default () => ({
    check: isArray,
    guarantee: val => isArray(val) ? val : toArray(val),
    mock: () => [],
});
