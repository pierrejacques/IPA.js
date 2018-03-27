import { isArray } from 'lodash';

export default () => ({
    check: isArray,
    guarantee: val => isArray(val) ? val : [],
    mock: () => [],
});