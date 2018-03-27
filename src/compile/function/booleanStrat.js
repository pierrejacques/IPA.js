import { isBoolean, random } from 'lodash';

export default () => ({
    check: isBoolean,
    guarantee: val => {
        return isBoolean(val) ? val : false;
    },
    mock: () => !random(0, 1),
});