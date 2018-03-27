import { isArray, isPlainObject } from 'lodash';
import cache from './lib/Cache';
import templateSymbol from './lib/symbol';
import compile from './compile/index';

// 改版前
import configChecker from './lib/configChecker';
import asset from './lib/asset';
import { fixArray } from './lib/fixers';
import dftConf from './lib/defaultConfig';



export default class IPA {
    constructor(template) {
        this[templateSymbol] = compile(template);
        this.__config__ = {};
        asset.init(this.__config__);
    }


    check(data) {
        asset.init(this.__config__);
        return asset.recursions.check(this[templateSymbol], data);
    }

    guarantee(data, copy = true) {
        let dataCopy = data;
        if (copy && isArray(data)) {
            dataCopy = data.slice();
        }
        if (copy && isPlainObject(data)) {
            dataCopy = Object.assign({}, data);
        }
        asset.init(this.__config__);
        const output = asset.recursions.guarantee(this[templateSymbol], dataCopy);
        fixArray(asset, this.__config__.strategy);
        return output;
    }

    mock(paraSettings = {}) {
        if (typeof paraSettings !== 'object') {
            throw new Error('Config Object syntax Error');
        }
        asset.init(this.__config__, paraSettings);
        return asset.recursions.mock(this[templateSymbol]);
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
            const ret = this.__config__[key] || dftConf[key];
            if (ret.join) { // duck
                ret = Object.assign([], ret);
            }
            return ret;
        }
        const config = {};
        Object.keys(dftConf).forEach(key => {
            config[key] = this.__config__[key] || dftConf[key];
        });
        config.dict = Object.assign([], config.dict);
        return config;
    }
}
