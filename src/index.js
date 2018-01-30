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

const core = {
    check: getRecursion('check'),
    guarantee: getRecursion('guarantee'),
    mock: getRecursion('mock'),
    cache: {},
    init(key, cache = {}) {
        this.cache = cache;
        this[key].asset = this;
    },
};

export default class IPA {
    constructor(template) {
        this.template = template;
    }

    check(data) {
        core.init('check');
        return core.check(this.template, data);
    }

    guarantee(data) {
        core.init('guarantee');
        return core.guarantee(this.template, data);
    }

    mock(config = {}) {
        core.init('mock', config);
        return core.mock(this.template);
    }
}
