import { cloneDeep, random, isEqual } from 'lodash';

export default (...set) => {
    const getRandom = () => {
        const v = set[random(0, set.length - 1)];
        return cloneDeep(v);
    };
    const getFirst = () => cloneDeep(set[0]);
    const msg = set.length > 1 ? `from ${set}` : set[0].toString();
    return ({ catcher }) => ({
        check: val => catcher.catch(msg, set.findIndex(item => isEqual(item, val)) !== -1),
        guarantee(val, strict) {
            return this.check(val) ? val : strict ? set[0] : getRandom();
        },
        mock: prod => prod ? getFirst() : getRandom(),
    });
};
