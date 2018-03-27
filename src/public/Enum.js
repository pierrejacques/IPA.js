import { isArray, eq, cloneDeep, random } from 'lodash';

// FIXME: eq not right for objects

export default template => {
    if (!isArray(template)) throw new Error('function "Enum" only accepts array as parameter');
    const n = template.length;
    const getRandom = () => template[random(0, n - 1)];
    return () => {
        return {
            check(val) {
                for (let i = 0; i < n; i++) {
                    if (eq(template[i], val)) {
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