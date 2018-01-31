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
    init(cache = {}) {
        this.cache = cache;
        this.check.asset = this;
        this.guarantee.asset = this;
        this.mock.asset = this;
    },
};

export default class IPA {
    constructor(template) {
        this.template = template;
    }

    check(data) {
        core.init();
        const structureCheck = core.check(this.template, data);
        return structureCheck;
    }

    guarantee(data) {
        const dataCopy = JSON.parse(JSON.stringify(data));
        core.init();
        return core.guarantee(this.template, dataCopy);
    }

    mock(config = {}) {
        core.init(config);
        return core.mock(this.template);
    }
}
