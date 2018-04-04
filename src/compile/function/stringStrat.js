import { isString, toString } from 'lodash';
import randStr from '../../lib/randStr';

export default () => ({
    check: isString,
    guarantee: (v, strict) => isString(v) ? v : strict ? '' : toString(v),
    mock: prod => prod ? '' : randStr(),
});
