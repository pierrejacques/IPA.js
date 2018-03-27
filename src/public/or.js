export default (...params) => {
    if (params.length === 0) throw new Error('function "or" requires at least 1 parameter');
    return compile => {
        const rules = [];
        params.forEach(item => {
            rules.push(compile(item));
        });
        return {
            check(val) {
                let result = false;
                rules.forEach(rule => {
                    result = result || rule.check(val);
                })
                return result;
            },
            guarantee(val) {
                return rule[0].guarantee(val);
            },
            mock() {
                return rule[0].mock();
            },
        };
    };
}