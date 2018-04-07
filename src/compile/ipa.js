import _core_ from '../lib/symbol';

export default {
    condition(template) {
        return !!(template && template[_core_]);
    },
    execute(template) {
        return () => template[_core_];
    },
};
