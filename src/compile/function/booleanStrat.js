import { isBoolean, random } from 'lodash';

export default () => ({
    check: isBoolean,
    guarantee: val => !!val,
    mock: () => !random(0, 1),
});
