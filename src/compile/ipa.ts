import _core_ from '../lib/symbol';
import { IPACompiler } from '../interface';

const ipaInstanceCompiler: IPACompiler = {
    condition(template) {
        return !!(template && template[_core_]);
    },
    execute(template) {
        return () => template[_core_];
    },
};

export default ipaInstanceCompiler;
