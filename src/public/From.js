import { isArray, cloneDeep, random, isEqual } from 'lodash';

export default (...set) => {
    const getRandom = () => {
        const v = set[random(0, set.length - 1)];
        return cloneDeep(v);
    };
    const getFirst = () => cloneDeep(set[0]);
    return () => ({
        check: val => set.findIndex(item => isEqual(item, val)) !== -1,
        guarantee(val, strict) {
            return this.check(val) ? val : strict ? set[0] : getRandom();
        },
        mock: prod => prod ? getFirst() : getRandom(),
    });
};
