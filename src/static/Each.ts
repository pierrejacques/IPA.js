import { isArray } from '../lib/_';
import { every, and } from '../lib/logics';

export default (template: Array<any>, strictLength: boolean = true) => {
    const len = template.length;
    return ({ compile, catcher }) => {
        const compiled = template.map(item => compile(item));
        return {
            check: val => catcher.catch('an array', isArray(val)) && and(
                catcher.catch(`with length of ${len}`, !strictLength || val.length === len),
                every(compiled, (item, i) => catcher.wrap(
                    i,
                    () => item.check(val[i])
                )),
            ),
            guarantee(valIn, strict) {
                let val = valIn;
                const process = () => {
                    compiled.forEach((item, idx) => {
                        val[idx] = catcher.wrap(
                            idx,
                            () => item.guarantee(val[idx], strict)
                        );
                    });
                }
                if (!catcher.catch('an array', isArray(valIn))) {
                    val = [];
                    catcher.free(process);
                    return val;
                }
                process();
                if (strictLength && val.length !== len) {
                    val.splice(len);
                    catcher.catch(`with length of ${len}`);
                }
                return val;
            },
            mock: prod => compiled.map(item => item.mock(prod)),
        };
    };
};
