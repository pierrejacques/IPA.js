// IPA is the index flyweight class to be called by clients
// its instance only provides template, config and interfaces
// its major functions mostly depend on outer singleton objects

import defaultConfig from './lib/defaultConfig.js';
import configChecker from './lib/configChecker.js';
import asset from './lib/asset.js';
import { fixArray } from './lib/fixers.js';

export default class IPA {
    constructor(template) {
        this.template = template;
        this.__config__ = JSON.parse(JSON.stringify(defaultConfig));
        asset.init(this.__config__);
    }

    check(data) {
        asset.init(this.__config__);
        return asset.recursions.check(this.template, data);
    }

    guarantee(data, isDeepCopy = true) {
        let dataCopy;
        if (isDeepCopy) {
            dataCopy = data === undefined ? undefined : JSON.parse(JSON.stringify(data));
        } else {
            dataCopy = data;
        }
        asset.init(this.__config__);
        const output = asset.recursions.guarantee(this.template, dataCopy);
        fixArray(asset, this.__config__.strategy);
        return output;
    }

    mock(paraSettings = {}) {
        if (typeof paraSettings !== 'object') {
            throw new Error('Config Object syntax Error');
        }
        asset.init(this.__config__, paraSettings);
        return asset.recursions.mock(this.template);
    }

    setConfig(config = {}) {
        configChecker(config);
        if (config.min !== undefined) {
            this.__config__.min = config.min === 'default' ? defaultConfig.min : config.min;
        }
        if (config.max !== undefined) {
            this.__config__.max = config.max === 'default' ? defaultConfig.max : config.max;
        }
        if (config.dict !== undefined) {
            this.__config__.dict = config.dict === 'default' ? defaultConfig.dict : config.dict;
        }
        if (config.minLen !== undefined) {
            this.__config__.minLen = config.minLen === 'default' ? defaultConfig.minLen : config.minLen;
        }
        if (config.maxLen !== undefined) {
            this.__config__.maxLen = config.maxLen === 'default' ? defaultConfig.maxLen : config.maxLen;
        }
        this.__config__.strategy = config.strategy === 'default' ? defaultConfig.strategy : config.strategy;
        this.__config__.seed = config.seed;
    }

    resetConfig() {
        this.__config__ = defaultConfig;
    }

    getConfig(key = null) {
        if (key === null) {
            return JSON.parse(JSON.stringify(this.__config__));
        }
        if (key === 'dict') {
            return Object.assign([], this.__config__.dict);
        }
        return this.__config__[key];
    }
}
