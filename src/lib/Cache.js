import { isArray } from 'lodash';

const cacheSymbol = Symbol('cache');

class Cache {
    constructor() {
        this[cacheSymbol] = new Map();
    }

    add(name, item) {
        if (!isArray(this[cacheSymbol][name])) {
            this[cacheSymbol][name] = [];
        }
        this[cacheSymbol][name].push(item);
    }

    set(name, value) {
        this[cacheSymbol][name].set(name, value);
    }

    get(name) {
        return this[cacheSymbol][name];
    }

    forEach(cb) {
        this[cacheSymbol].forEach(cb);
    }

    reset() {
        this[cacheSymbol].clear;
    }

    digest(settings) {
        this.reset();
        Object.keys(settings).forEach(key => {
            this.set(key, settings[key]);
        });
    }
}

export default new Cache();