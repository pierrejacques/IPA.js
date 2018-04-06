import { isArray, cloneDeep, random, isEqual } from 'lodash';

export default (template, deep = false) => {
    const set = [];
    try {
        template.forEach((v) => {
            set.push(v);
        });
    } catch (e) {
        throw new Error('in IPA.From: the 1st param must be iterable');
    }
    const n = set.length;
    const getRandom = () => {
        const v = set[random(0, n - 1)];
        return deep ? cloneDeep(v) : v;
    };
    return () => ({
        check(val) {
            for (let i = 0; i < n; i++) { // eslint-disable-line
                if (!deep && set[i] === val || deep && isEqual(set[i], val)) {
                    return true;
                }
            }
            return false;
        },
        guarantee(val, strict) {
            return this.check(val) ? val : strict ? set[0] : getRandom();
        },
        mock: prod => !prod ? getRandom() : deep ? cloneDeep(set[0]) : set[0],
    });
};
