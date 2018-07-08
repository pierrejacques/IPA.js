import { isNumber, random } from 'lodash';
import { IPACompiler } from '../interface';

const numberCompiler: IPACompiler = {
    condition: isNumber,
    execute(template) {
        return () => ({
            check: isNumber,
            guarantee: v => (isNumber(v) ? v : template),
            mock: prod => prod ? template : random(0, 100),
        });
    },
};

export default numberCompiler;