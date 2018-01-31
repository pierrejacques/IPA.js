import generators from './lib/generators.js'
import stategies from './stategies/index.js';


const asset = {
    generators,
    recursions: {},
    cache: {},
    init(config = {}) {
        this.cache = config;
    }
};

function getRecursion(method) {
    const execute = (template, ...params) => {
        let ret;
        for (let i = 0; i < stategies.length; i++) {
            const stategy = stategies[i];
            if (stategy.condition(template)) {
                ret = stategy[method](template, ...params, asset);
                break;
            }
        }
        return ret;
    }
    return execute;
}

asset.recursions.check = getRecursion('check');
asset.recursions.guarantee = getRecursion('guarantee');
asset.recursions.mock = getRecursion('mock');

export default class IPA {
    constructor(template) {
        this.template = template;
    }

    check(data) {
        asset.init();
        return asset.recursions.check(this.template, data);
    }

    guarantee(data) {
        const dataCopy = JSON.parse(JSON.stringify(data));
        asset.init();
        return asset.recursions.guarantee(this.template, dataCopy);
    }

    mock(config = {}) {
        if (Object.prototype.toString.call(config) !== '[object Object]') {
            throw new Error(`Config Object syntax Error`);
        }
        asset.init(config);
        return asset.recursions.mock(this.template);
    }
}
