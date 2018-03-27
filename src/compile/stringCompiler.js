import { isString } from 'lodash';
import randStr from '../lib/randStr';

export default {
    condition: isString,
    execute: template => {
        return () => ({
            check: isString,
            guarantee: v => isString(v) ? v : template,
            mock: randStr,
        });
    },
}