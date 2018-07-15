import { isString } from 'lodash';
import randStr from '../lib/randStr';
import { IPACompiler } from '../interface';

const stringCompiler: IPACompiler = {
    condition: isString,
    execute: template => ({ catcher, cache }) => {
        const recurserScope = cache.get('$$recurseScope');
        if (recurserScope && recurserScope.marker === template) {
            return recurserScope.asset;
        }
        return {
            check: (v) => catcher.catch('string', isString(v)),
            guarantee(v) {
                return this.check(v) ? v : template;
            },
            mock: prod => prod ? template : randStr(),
        }
    },
};

export default stringCompiler;
