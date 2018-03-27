import { isBoolean, random } from 'lodash';

export default () => ({
    check: isBoolean,
    guarantee: val => isBoolean(val) ? val : false,
    mock: () => !random(0, 1),
});