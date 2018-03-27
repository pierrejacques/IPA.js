import templateSymbol from '../lib/symbol';

export default {
    condition(template) {
        return !!(template && template[templateSymbol]);
    },
    execute(template) {
        return () => template[templateSymbol];
    },
};