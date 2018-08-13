import { isArray, every, and, loop, times } from '../lib/_';

export default (template: Array<any>, strictLength: boolean = true) => {
    const len = template.length;
    return ({ compile, catcher }) => {
        const compiled = times(len, (i) => {
            return compile(template[i]);
        });
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
                    loop(len, (i) => {
                        val[i] = catcher.wrap(
                            i,
                            () => compiled[i].guarantee(val[i], strict)
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
            mock: prod => times(len, (i) => compiled[i].mock(prod)),
        };
    };
};
