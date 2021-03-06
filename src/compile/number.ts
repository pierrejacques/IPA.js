import { isNumber, random } from '../lib/_';
import { IPACompiler } from '../interface';

const numberCompiler: IPACompiler = {
    condition: isNumber,
    execute(template) {
        return ({ catcher }) => ({
            check: v => catcher.catch('a number', isNumber(v)),
            guarantee(v) {
                return this.check(v) ? v : template;
            },
            mock: prod => prod ? template : random(0, 100),
        });
    },
};

export default numberCompiler;
