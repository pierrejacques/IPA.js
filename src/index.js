// IPA is the index flyweight class to be called by clients
// its instance only provides template, config and interfaces
// its major functions mostly depend on outer singleton objects

import configChecker from './lib/configChecker.js';
import asset from './lib/asset.js';
import { fixArray } from './lib/fixers.js';
import dftConf from './lib/defaultConfig.js';

export default class IPA {
    constructor(template) {
        this.template = template;
        this.__config__ = {};
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
        Object.keys(dftConf).forEach(key => {
            const value = config[key];
            if (value !== undefined) {
                if (value === 'default') {
                    delete this.__config__[key];
                } else {
                    this.__config__[key] = value;
                }
            }
        });
        if (config.hasOwnProperty('seed')) {
            this.__config__.seed = config.seed;
        }
    }

    resetConfig() {
        this.__config__ = {};
    }

    getConfig(key = null) {
        if (key) {
            return this.__config__[key] || dftConf[key];
        }
        const config = {};
        Object.keys(dftConf).forEach(key => {
            config[key] = this.__config__[key] || dftConf[key];
        });
        config.dict = Object.assign([], config.dict);
        return config;
    }
}
