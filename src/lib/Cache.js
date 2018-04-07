import { isArray } from 'lodash';

const _cache_ = Symbol('cache');

class Cache {
    constructor() {
        this[_cache_] = new Map();
    }

    push(name, item) {
        if (!isArray(this[_cache_].get(name))) {
            this[_cache_].set(name, []);
        }
        this[_cache_].get(name).push(item);
    }

    set(name, value) {
        this[_cache_].set(name, value);
    }

    get(name) {
        return this[_cache_].get(name);
    }

    forEach(cb) {
        this[_cache_].forEach(cb);
    }

    reset() {
        this[_cache_].clear();
    }

    digest(settings) {
        this.reset();
        Object.keys(settings).forEach((key) => {
            this.set(key, settings[key]);
        });
    }
}

export default new Cache();
