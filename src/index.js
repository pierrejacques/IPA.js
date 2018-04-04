import { isPlainObject, cloneDeep } from 'lodash';
import cache from './lib/Cache';
import templateSymbol from './lib/symbol';
import fixArray from './lib/fixArray';
import checkLength from './lib/checkLength';
import compile from './compile/index';
import publics from './public/index';

let isProductionEnv = false;
const instances = new Map();

// class
class IPA {
    constructor(template) {
        this[templateSymbol] = compile(template);
        this.strategy = 'shortest';
    }

    check(data) {
        const output = this[templateSymbol].check(data) && checkLength();
        cache.reset();
        return output;
    }

    /**
     * 
     * @param {the inputting data to be guaranteed} data
     * @param {whether to make a deep copy first} isCopy
     * @param {whether to use the strict mode} strict
     */
    guarantee(data, isCopy = true, strict = false) {
        const copy = isCopy ? cloneDeep(data) : data;
        const output = this[templateSymbol].guarantee(copy, strict);
        fixArray(this.strategy);
        cache.reset();
        return output;
    }

    /**
     * 
     * @param {the mock setting for array length} settings 
     * @param {whether it's in production environment} prod 
     */
    mock(settings = {}, prod = isProductionEnv) {
        if (!isPlainObject(settings)) {
            throw new Error('mocking setting should be a plain object');
        }
        cache.digest(settings);
        const output = this[templateSymbol].mock(prod);
        cache.reset();
        return output;
    }
}

// global instance logic
IPA.inject = (name, template) => instances.set(name, new IPA(template));
IPA.getInstance = (name) => {
    let i = null;
    const obj = {};
    ['check', 'guarantee', 'mock'].forEach(key => {
        obj[key] = (...params) => {
            if (i === null) {
                i = instances.get(name);
                if (i === undefined) {
                    throw new Error('in getInstance: IPA instance called before injected');
                }
            }
            return i[key](...params);
        }
    });
    return obj;
};

// install && compile expose
IPA.$compile = compile;
IPA.install = (v) => {
    const w = v;
    w.prototype.$ipa = IPA.getInstance;
    w.prototype.$brew = IPA.$compile;
};

// public methods
Object.assign(IPA, publics);

// env settings
Object.defineProperty(IPA, 'isProductionEnv', {
    set(val) {
        isProductionEnv = !!val;
    },
    get(val) {
        return isProductionEnv;
    },
});

export default IPA;
