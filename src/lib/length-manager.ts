import { isArray, random, min, max, mean, times, isNumber } from 'lodash';
import catcher from './catcher';
import callers from './callers';
import cache from './cache';
import { lengthManagerSymbol } from './symbols';

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

const staticRules = [{
    match: /^(==)?(\d{1,})$/,
    check: (arr, len) => arr.length === len,
    target: len => len,
    generate: len => len,
    msg: 'equal to',
}, {
    match: /^>(\d{1,})$/,
    check: (arr, len) => arr.length > len,
    target: len => len + 1,
    generate: len => random(len + 1, len + 6),
    msg: 'strictly longer than',
}, {
    match: /^>=(\d{1,})$/,
    check: (arr, len) => arr.length >= len,
    target: len => len,
    generate: len => random(len, len + 5),
    msg: 'longer than',
}, {
    match: /^<(\d{1,})$/,
    check: (arr, len) => arr.length < len,
    target: len => len - 1,
    generate: len => random(0, len - 1),
    msg: 'strictly shorter than'
}, {
    match: /^<=(\d{1,})$/,
    check: (arr, len) => arr.length <= len,
    target: len => len,
    generate: len => random(0, len),
    msg: 'shorter than',
}];

const lengthManager = {
    get scope() {
        if (!cache.has(lengthManagerSymbol)) {
            cache.set(lengthManagerSymbol, new Map());
        }
        return cache.get(lengthManagerSymbol);
    },

    push(name, item) {
        if (!isArray(this.scope.get(name))) {
            this.scope.set(name, []);
        }
        this.scope.get(name).push(item);
    },

    digest(settings) {
        Object.keys(settings).forEach((key) => {
            this.scope.set(key, settings[key]);
        });
    },

    check() {
        let result = true;
        this.scope.forEach((value, key) => {
            for (const { match, check, msg } of staticRules) {
                if (match.test(key)) {
                    const len = extract(match, key);
                    value
                    .filter(i => i.method === 'check')
                    .forEach(item => {
                        if (!check(item, len)) {
                            catcher.log(item.key, `length should be ${msg} ${len}`);
                            result = false;
                        }
                    });
                    return;
                }
            }
            const lengths = value.map(item => item.length);
            if (min(lengths) !== max(lengths)) {
                result = false;
                value.forEach((item) => catcher.log(item.key, 'length unmatched'));
            }
        });
        return result;
    },

    fix() {
        const strategy = strategies[callers.current.strategy] || strategies.shortest;
        this.scope.forEach((value, key) => {
            for (const { match, target, check } of staticRules) {
                if (match.test(key)) {
                    const l = extract(match, key);
                    fix(
                        value
                        .filter(i => i.method === 'fix')
                        .filter(i => !check(i.target, l)), target(l)
                    );
                    return;
                }
            }
            fix(value, strategy(value));
        });
    },

    generate(key: string, isProd: boolean) {
        for (const { match, target, generate } of staticRules) {
            if (match.test(key)) {
                const l = extract(match, key);
                return isProd ? target(l) : generate(l);
            }
        }
        if (!isNumber(this.scope.get(key))) this.scope.set(key, isProd ? 0 : random(0, 10));
        return this.scope.get(key);
    }
}

function fix (toBeFixed: Array<any>, len: number) {
    toBeFixed.forEach((item) => {
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
}

function extract(regExp, string) {
    const matched = regExp.exec(string);
    return matched && parseInt(matched[matched.length - 1], 10);
}

export default lengthManager;
