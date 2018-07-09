import { isString } from 'lodash';
import randStr from '../lib/randStr';
import { IPACompiler } from '../interface';

const stringCompiler: IPACompiler = {
    condition: isString,
    execute: template => () => ({
        check: isString,
        guarantee: v => (isString(v) ? v : template),
        mock: prod => prod ? template : randStr(),
    }),
};

export default stringCompiler;