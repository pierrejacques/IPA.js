import { isBoolean, random } from 'lodash';

export default {
    condition: isBoolean,
    execute(template) {
        return () => ({
            check: isBoolean,
            guarantee: v => isBoolean(v) ? v : template,
            mock: () => !random(0, 1),
        })
    }
}