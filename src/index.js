import _ from 'lodash';
import cache from './lib/Cache';
import _core_ from './lib/symbol';
import fixArray from './lib/fixArray';
import checkLength from './lib/checkLength';
import createProxy from './lib/createProxy';
import compile from './compile/index';
import publics from './public/index';

let isProductionEnv = false;
const _strat_ = Symbol('strategy');

// class
class IPA {
    constructor(template) {
        this[_core_] = compile(template);
        this[_strat_] = 'shortest';
    }

    set strategy(val) {
        if (!fixArray[val]) {
            if (!isProductionEnv) throw new Error(`in IPA strategy setter: invalid strategy "${val}"`);
            return;
        }
        this[_strat_] = val;
    }

    get strategy () {
        return this[_strat_];
    }

    check(data) {
        const output = this[_core_].check(data) && checkLength();
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
        const copy = isCopy ? _.cloneDeep(data) : data;
        const output = this[_core_].guarantee(copy, strict);
        fixArray(this.strategy);
        cache.reset();
        return output;
    }

    /**
     * 
     * @param {the mock setting for array length} settings 
     * @param {whether it's in production environment} prod 
     */
    mock(settingsIn = {}, prod = isProductionEnv) {
        let settings = settingsIn;
        if (!_.isPlainObject(settings)) {
            if (!isProductionEnv) throw new Error('mocking setting should be a plain object');
            settings = {};
        }
        cache.digest(settings);
        const output = this[_core_].mock(prod);
        cache.reset();
        return output;
    }
}


// global instance logic
const instances = new Map();
IPA.inject = (name, template) => {
    if (instances.has(name) && !isProductionEnv) {
        throw new Error('in inject: reassign to global IPA instance is not arrowed');
    }
    instances.set(name, new IPA(template));
};
IPA.getInstance = (name) => {
    let i = null;
    return createProxy(() => {
        if (i) return i;
        i = instances.get(name);
        if (i === undefined) throw new Error('in getInstance: IPA instance called before injected');
        return i;
    });
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

// global configuration items
Object.defineProperty(IPA, 'isProductionEnv', {
    set(val) {
        isProductionEnv = !!val;
    },
    get() {
        return isProductionEnv;
    },
});

export default IPA;
