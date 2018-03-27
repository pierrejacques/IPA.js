import { isString, random } from 'lodash';
import randStr from '../../lib/randStr';

export default () => ({
    check: isString,
    guarantee: (val) => isString(val) ? val : '',
    mock: randStr,
});