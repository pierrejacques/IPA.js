import { isArray } from 'lodash';
import every from '../lib/every';
import and from '../lib/and';

export default (template: Array<any>, strictLength: boolean = true) => {
    const len = template.length;
    return ({ compile, catcher }) => {
        const compiled = template.map(item => compile(item));
        return {
            check: val => catcher.catch('an array', isArray(val)) && and(
                catcher.catch(`with length of ${len}`, !strictLength || val.length === len),
                catcher.catch(
                    'a correct array',
                    every(compiled, (item, i) => catcher.wrap(
                        i,
                        () => item.check(val[i])
                    )),
                ),
            ),
            guarantee(valIn, strict) {
                const val = isArray(valIn) ? valIn : [];
                compiled.forEach((item, idx) => {
                    val[idx] = item.guarantee(val[idx], strict);
                });
                if (strictLength) {
                    val.splice(compiled.length);
                }
                return val;
            },
            mock: prod => compiled.map(item => item.mock(prod)),
        };
    };
};
