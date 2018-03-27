import { isArray, toArray } from 'lodash';

export default () => ({
    check: isArray,
    guarantee: val => toArray(val),
    mock: () => [],
});