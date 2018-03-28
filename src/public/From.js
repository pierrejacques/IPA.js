import { isArray, eq, cloneDeep, random } from 'lodash';

export default (template, isJSONcompare = false) => {
    let set = [];
    try {
        template.forEach(v => set.push(v));
    } catch(e) {
        throw new Error('function "Enum" only accepts iterable objects');
    }
    const n = set.length;
    const getRandom = () => set[random(0, n - 1)];
    return () => {
        return {
            check(val) {
                for (let i = 0; i < n; i++) {
                    if (!isJSONcompare && set[i] === val) { // strict compare
                        return true;
                    }
                    if (isJSONcompare && JSON.stringify(set[i]) === JSON.stringify(val)) {
                        return true;
                    }
                }
                return false;
            },
            guarantee(val) {
                return this.check(val) ? val : getRandom();
            },
            mock: getRandom,
        };
    };
}