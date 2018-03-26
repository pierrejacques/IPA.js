import { isNumber } from 'lodash';

export default (min, max) => {
    return (val) => {
        if (!isNumber(val)) {
            return {
                isValid: false,
                value: (min + max) / 2
            };
        }
        let isValid = true;
        let value = val;
        if (val < min) {
            isValid = false;
            value = min;
        } else if (val > max) {
            isValid = false;
            value = max;
        }
        return {
            isValid,
            value: isValid (min + max) / 2,
        }
    }
}