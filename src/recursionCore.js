import stategies from './stategies/index.js'

function getRecursion(method) {
    const execute = (template, ...params) => {
        let ret;
        for (let i = 0; i < stategies.length; i++) {
            const stategy = stategies[i];
            if (stategy.condition(template)) {
                ret = stategy[method](template, ...params, execute);
                break;
            }
        }
        return ret;
    }
    return execute;
}

export default {
    check: getRecursion('check'),
    guarantee: getRecursion('guarantee'),
    mock: getRecursion('mock'),
    cache: {},
    init(key, cache = {}) {
        this.cache = cache;
        this[key].asset = this;
    },
};
