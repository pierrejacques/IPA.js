// IPA is the index flyweight class to be called by clients
// its instance only provides template, config and interfaces
// its major functions mostly depend on outer singleton objects

import defaultConfig from './lib/defaultConfig.js';
import genConfigChecker from './lib/genConfigChecker.js';
import asset from './lib/asset.js';

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
            throw new Error('Config Object syntax Error');
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

    showConfig() {
        return JSON.stringify(this.genConfig);
    }
}
