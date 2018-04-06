import { isArray, cloneDeep, random, isEqual } from 'lodash';

export default (...set) => {
    const n = set.length;
    const getRandom = () => {
        const v = set[random(0, n - 1)];
        return cloneDeep(v);
    };
    const getFirst = () => cloneDeep(set[0]);
    return () => ({
        check(val) {
            for (let i = 0; i < n; i++) { // eslint-disable-line
                if (isEqual(set[i], val)) return true;
            }
            return false;
        },
        guarantee(val, strict) {
            return this.check(val) ? val : strict ? set[0] : getRandom();
        },
        mock: prod => prod ? getFirst() : getRandom(),
    });
};
