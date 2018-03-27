import { isArray, isPlainObject, cloneDeep } from 'lodash';
import cache from './lib/Cache';
import templateSymbol from './lib/symbol';
import { fixArray } from './lib/fixArray';
import compile from './compile/index';
import publics from './public/index';

class IPA {
    constructor(template) {
        this[templateSymbol] = compile(template);
    }

    check(data) {
        return this[templateSymbol].check(data);
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
        Object.keys(settings).forEach(key => {
            cache.set(key, settings[key]);
        });
        const output = this[templateSymbol].mock();
        cache.reset();
        return output;
    }
}

Object.assign(IPA, publics);

export default IPA;