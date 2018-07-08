import { isBoolean, random } from 'lodash';
import { IPACompiler } from '../interface';

const booleanCompiler: IPACompiler = {
    condition: isBoolean,
    execute(template) {
        return () => ({
            check: isBoolean,
            guarantee: v => (isBoolean(v) ? v : template),
            mock: prod => prod ? template : !random(0, 1),
        });
    },
};

export default booleanCompiler;