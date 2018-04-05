export default (...params) => {
    if (params.length === 0) throw new Error('function "or" requires at least 1 parameter');
    return (compile) => {
        const rules = params.map(item => compile(item));
        return {
            check(val) {
                let result = false;
                rules.forEach((rule) => {
                    result = result || rule.check(val);
                });
                return result;
            },
            guarantee(val, strict) {
                return this.check(val) ? val : rules[0].guarantee(val, strict);
            },
            mock(prod) {
                return rules[0].mock(prod);
            },
        };
    };
};
