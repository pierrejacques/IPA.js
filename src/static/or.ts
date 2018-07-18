export default (...params) => {
    if (params.length < 2) throw new Error('function "or" requires at least 2 parameter');
    return ({ compile, catcher }) => {
        const rules = params.map(item => compile(item));
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
