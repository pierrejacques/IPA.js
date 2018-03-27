import { isNumber, random } from 'lodash';

export default {
    condition: isNumber,
    execute(template) {
        return () => ({
            check: isNumber,
            guarantee: v => isNumber(v) ? v : template,
            mock: () => random(0, 100),
        });
    },
};