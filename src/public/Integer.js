import { isInteger } from 'lodash';

export default (val) => {
    const isValid = isInteger(val);
    return {
        isValid,
        value: isValid ? val : 0,
        generator() {
            return 0; // TODO: 整型构造器
        },
    }
}