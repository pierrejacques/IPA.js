import { isString } from 'lodash';
import randStr from '../lib/randStr';
import { recurserSymbol } from '../lib/symbols';
import { IPACompiler } from '../interface';

const stringCompiler: IPACompiler = {
    condition: isString,
    execute: template => ({ catcher, cache }) => {
        const recurserScope = cache.get(recurserSymbol);
        if (recurserScope) {
            for (const item of recurserScope) {
                if (item.marker === template) {
                    return item.asset;
                }
            }
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
