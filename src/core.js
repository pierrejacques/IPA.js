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

const check = getRecursion('check');
const guarantee = getRecursion('guarantee');
const mock = getRecursion('mock');

const core = {
    check,
    guarantee,
    mock,
    cache: {},
    init(key, cache = {}) {
        core.cache = cache;
        core[key].asset = core;
    },
};

export default core;
