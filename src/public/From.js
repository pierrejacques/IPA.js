import { isArray, cloneDeep, random, isObject } from 'lodash';

export default (template, isJSONcompare = false) => {
    let set = [];
    try {
        template.forEach(v => {
            if (isObject(v)) {
                try {
                    JSON.stringify(v);
                } catch(e) {
                    throw new Error('params of function "From" containes un-stringifiable object, most probably circular object');
                }
            }
            set.push(v);
        });
    } catch(e) {
        throw new Error('function "From" only accepts iterable objects');
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
                    if (isJSONcompare) {
                        let result;
                        try {
                            result = JSON.stringify(set[i]) === JSON.stringify(val);
                        } catch(e) {
                            continue;
                        }
                        if (result) return true;
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