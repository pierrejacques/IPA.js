import { isPlainObject } from 'lodash';

export default () => ({
    check: isPlainObject,
    guarantee: val => isPlainObject(val) ? val : {},
    mock: () => ({}),
});