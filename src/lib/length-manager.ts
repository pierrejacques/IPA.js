import { isArray, isNumber, min, max, mean, times } from 'lodash';
import catcher from './catcher';
import callers from './callers';
import { IPALike } from './peer-classes';

const lengthCacheMap: Map<IPALike, Map<any, any>> = new Map();

const strategies = {
    most(val) {
        const lengths = val.map(item => item.target.length);
        const freqs = new Map();
        lengths.forEach((length) => {
            if (freqs.get(length) === undefined) {
                freqs.set(length, 0);
            }
            freqs.set(length, freqs.get(length) + 1);
        });
        let maxFreq = null;
        freqs.forEach((len, freq) => {
            if (!maxFreq || freq > maxFreq.freq) {
                maxFreq = { len, freq };
            }
        });
        return maxFreq.len;
    },
    shortest(val) {
        return Math.min(...val.map(item => item.target.length));
    },
    longest(val) {
        return Math.max(...val.map(item => item.target.length));
    },
    average(val) {
        const average = mean(val.map(item => item.target.length));
        return Math.ceil(average);
    },
};

const lengthManager = {
    get cache() {
        const caller = callers.current;
        if (!lengthCacheMap.has(caller)) {
            lengthCacheMap.set(caller, new Map());
        }
        return lengthCacheMap.get(caller);
    },

    push(name, item) {
        if (!isArray(this.cache.get(name))) {
            this.cache.set(name, []);
        }
        this.cache.get(name).push(item);
    },

    set(name, value) {
        this.cache.set(name, value);
    },

    get(name) {
        return this.cache.get(name);
    },

    forEach(cb) {
        this.cache.forEach(cb);
    },

    clear() {
        lengthCacheMap.delete(callers.current);
    },

    digest(settings) {
        Object.keys(settings).forEach((key) => {
            this.set(key, settings[key]);
        });
    },

    check() {
        let result = true;
        this.cache.forEach((value, key) => {
            if (isNumber(key)) {
                value.forEach(item => {
                    if (item.length !== key) {
                        catcher.log(item.key, `length unequals to ${key}`);
                        result = false;
                    }
                });
            } else {
                const lengths = value.map(item => item.length);
                if (min(lengths) !== max(lengths)) {
                    result = false;
                    value.forEach((item) => catcher.log(item.key, 'length unmatched'));
                }
            }
        });
        return result;
    },

    fix() {
        const strategy = strategies[callers.current.strategy] || strategies.shortest;
        this.cache.forEach((value, key) => {
            const len = isNumber(key) ? key : strategy(value);
            value.forEach((item) => {
                const { target: arr, mocker } = item;
                if (arr.length === len) return;
                if (!item.isFree) {
                    catcher.log(item.key, 'length unmatch');
                }
                catcher.free(() => {
                    if (arr.length > len) {
                        arr.splice(len);
                    } else {
                        arr.push(...times(len - arr.length, mocker));
                    }
                });
            });
        });
    }
}

export default lengthManager;