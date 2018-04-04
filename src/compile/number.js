import { isNumber, random } from 'lodash';

export default {
    condition: isNumber,
    execute(template) {
        return () => ({
            check: isNumber,
            guarantee: v => (isNumber(v) ? v : template),
            mock: prod => prod ? template : random(0, 100),
        });
    },
};
