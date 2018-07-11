import { isString } from 'lodash';
import randStr from '../lib/randStr';
import { IPACompiler } from '../interface';

const stringCompiler: IPACompiler = {
    condition: isString,
    execute: template => ({ catcher }) => ({
        check: (v) => catcher.catch('string', isString(v)),
        guarantee(v) {
            return this.check(v) ? v : template;
        },
        mock: prod => prod ? template : randStr(),
    }),
};

export default stringCompiler;
