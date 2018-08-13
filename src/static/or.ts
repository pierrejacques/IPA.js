import { times } from '../lib/_';

export default (...params) => {
    const n = params.length;
    if (n < 2) throw new Error('function "or" requires at least 2 parameter');
    return ({ compile, catcher }) => {
        const rules = times(n, (i) => {
            return compile(params[i]);
        });
        return {
            check: val => catcher.catch('matched with one of the rules', catcher.free(() => rules.some(rule => rule.check(val)))),
            guarantee(val, strict) {
                return this.check(val) ? val : catcher.free(() => rules[0].guarantee(val, strict));
            },
            mock(prod) {
                return rules[0].mock(prod);
            },
        };
    };
};
