import { isBoolean, random } from 'lodash';
import { IPACompiler } from '../interface';

const booleanCompiler: IPACompiler = {
    condition: isBoolean,
    execute(template) {
        return ({ catcher }) => ({
            check: (v) => catcher.catch('boolean', isBoolean(v)),
            guarantee(v) {
                return this.check(v) ? v : template;
            },
            mock: prod => prod ? template : !random(0, 1),
        });
    },
};

export default booleanCompiler;