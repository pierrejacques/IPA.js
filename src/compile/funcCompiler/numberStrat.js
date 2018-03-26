import { isNumber, random } from 'lodash';

export default () => ({
    check: isNumber,
    guarantee: val => isNumber(val) ? val : 0,
    mock: val => random(0, 100),
});