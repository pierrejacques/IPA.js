import { isString, random, toString } from 'lodash';
import randStr from '../../lib/randStr';

export default () => ({
    check: isString,
    guarantee: v => toString(v),
    mock: randStr,
});