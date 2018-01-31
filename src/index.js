import defaultConfig from './lib/defaultConfig.js';
import generators from './lib/generators.js'
import genConfigChecker from './lib/genConfigChecker.js'
import stategies from './stategies/index.js';

const asset = {
    generators,
    recursions: {},
    cache: {},
    init(genConfig, mockConfig = {}) { // flyWeight拼接
        this.generators.set(genConfig);
        this.cache = mockConfig;
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
        this.genConfig = JSON.parse(JSON.stringify(defaultConfig));
        asset.init(this.genConfig);
    }

    check(data) {
        asset.init(this.genConfig);
        return asset.recursions.check(this.template, data);
    }

    guarantee(data) {
        const dataCopy = JSON.parse(JSON.stringify(data));
        asset.init(this.genConfig);
        return asset.recursions.guarantee(this.template, dataCopy);
    }

    mock(mockConfig = {}) {
        if (typeof mockConfig !== 'object') {
            throw new Error(`Config Object syntax Error`);
        }
        asset.init(this.genConfig, mockConfig);
        return asset.recursions.mock(this.template);
    }

    config(config = {}) {
        genConfigChecker(config);
        if (config.min !== undefined) {
            this.genConfig.min = config.min === 'default' ? defaultConfig.min : config.min;
        }
        if (config.max !== undefined) {
            this.genConfig.max = config.max === 'default' ? defaultConfig.max : config.max;
        }
        if (config.dict !== undefined) {
            this.genConfig.dict = config.dict === 'default' ? defaultConfig.dict : config.dict;
        }
    }

    getConfig() {
        return this.genConfig;
    }
}
