import { isInteger, random } from 'lodash';

export default () => ({
    check: isInteger,
    guarantee: val => isInteger ? val : 0,
    mock: () => random(0, 1000),
});