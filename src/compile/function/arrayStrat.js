import { isArray, toArray } from 'lodash';

export default () => ({
    check: isArray,
    guarantee:(val, strict) => isArray(val) ? val : strict ? [] : toArray(val),
    mock: () => [],
});
