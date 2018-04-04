import { isBoolean, random } from 'lodash';

export default () => ({
    check: isBoolean,
    guarantee: val => !!val,
    mock: prod => prod ? false : !random(0, 1),
});
