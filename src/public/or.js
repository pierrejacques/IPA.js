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
            guarantee(val) {
                return this.check(val) ? val : rules[0].guarantee(val);
            },
            mock() {
                return rules[0].mock();
            },
        };
    };
};
