import { isNumber, mean, times } from 'lodash';
import { privateCache } from './cache';
import catcher from './catcher';

const fixLength = (len, item) => {
    const arr = item.target;
    const mocker = item.mocker;
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
};

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

const fixer = (strategyIn) => {
    const strategy = strategies[strategyIn] || strategies.shortest;
    privateCache.forEach((value, key) => {
        const targetLen = isNumber(key) ? key : strategy(value);
        value.forEach((item) => {
            fixLength(targetLen, item);
        });
    });
};

export default fixer;
