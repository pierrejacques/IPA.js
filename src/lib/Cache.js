import { isArray } from 'lodash';

const cacheSymbol = Symbol('cache');

class Cache {
    constructor() {
        this[cacheSymbol] = {};
    }

    add(name, item) {
        if (!isArray(this[cacheSymbol][name])) {
            this[cacheSymbol][name] = [];
        }
        this[cacheSymbol][name].push(item);
    }

    set(name, value) {
        this[cacheSymbol][name] = value;
    }

    get(name) {
        return this[cacheSymbol][name];
    }

    reset() {
        this[cacheSymbol] = {};
    }
}

export default new Cache();