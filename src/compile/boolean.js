import { isBoolean, random } from 'lodash';

export default {
    condition: isBoolean,
    execute(template) {
        return () => ({
            check: isBoolean,
            guarantee: v => (isBoolean(v) ? v : template),
            mock: prod => prod ? template : !random(0, 1),
        });
    },
};
