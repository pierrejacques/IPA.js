import { isArray, random, times, isNumber, loop } from './_';
import catcher from './catcher';
import callers from './callers';
import cache from './cache';
import { lengthManagerSymbol } from './symbols';

const strategies = {
    most(val) {
        const freqs = {};
        let maxFreq = 0;
        let maxLen = null;
        loop(val.length, (i) => {
            const length = val[i].target.length;
            if (freqs[length] === undefined) {
                freqs[length] = 0;
            }
            const freq = ++freqs[length];
            if (freq > maxFreq) {
                maxFreq = freq;
                maxLen = length;
            }
        })
        return maxLen;
    },
    shortest(val) {
        let min = Infinity;
        loop(val.length, (i) => {
            const l = val[i].target.length;
            if (l < min) min = l;
        });
        return min;
    },
    longest(val) {
        let max = -Infinity;
        loop(val.length, (i) => {
            const l = val[i].target.length;
            if (l > max) max = l;
        });
        return max;
    },
    average(val) {
        let s = 0;
        const n = val.length;
        loop(n, (i) => {
            s += val[i].target.length;
        });
        return Math.ceil(s / n);
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
        const loopee = Object.keys(settings);
        loop(loopee.length, (i) => {
            const key = loopee[i];
            this.scope.set(key, settings[key]);
        });
    },

    check() {
        let result = true;
        for (const [key, value] of this.scope) {
            for (const { match, check, msg } of staticRules) {
                if (match.test(key)) {
                    const len = extract(match, key);
                    loop(value.length, (i) => {
                        const item = value[i];
                        if (item.method === 'check' && !check(item, len)) {
                            catcher.log(item.key, `length should be ${msg} ${len}`);
                            result = false;
                        }
                    });
                }
            }
            let allEqual = true;
            let l = value[0].length;
            for (let i = 1; i < value.length; i ++) {
                if (value[i].length !== l) {
                    allEqual = false;
                    break;
                }
            }
            if (!allEqual) {
                result = false;
                loop(value.length, (i) => {
                    const item = value[i];
                    catcher.log(item.key, 'length unmatched');
                });
            }
        };
        return result;
    },

    fix() {
        const strategy = strategies[callers.current.strategy] || strategies.shortest;
        for (const [key, value] of this.scope) {
            for (const { match, target, check } of staticRules) {
                if (match.test(key)) {
                    const l = extract(match, key);
                    fix(
                        value.filter(i => i.method === 'fix' && !check(i.target, l)),
                        target(l),
                    );
                    return;
                }
            }
            fix(value, strategy(value));
        };
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
    loop(toBeFixed.length, (i) => {
        const item = toBeFixed[i];
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
