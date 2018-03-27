import { isArray, isPlainObject, cloneDeep } from 'lodash';
import cache from './lib/Cache';
import templateSymbol from './lib/symbol';
import fixArray from './lib/fixArray';
import checkLength from './lib/checkLength';
import compile from './compile/index';
import publics from './public/index';

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

    guarantee(data, isCopy = true) {
        const copy = isCopy ? cloneDeep(data) : data; 
        const output = this[templateSymbol].guarantee(copy);
        fixArray(this.strategy);
        cache.reset();
        return output;
    }

    mock(settings = {}) {
        if (!isPlainObject(settings)) {
            throw new Error('mocking setting should be a plain object');
        }
        cache.digest(settings);
        const output = this[templateSymbol].mock();
        cache.reset();
        return output;
    }
}

const instances = new Map();

IPA.inject = (name, template) => {
    instances.set(name, new IPA(template));
};

IPA.getInstance = instances.get;

IPA.install = v => {
    v.prototype.$ipa = IPA.getInstance;
};

Object.assign(IPA, publics);

export default IPA;