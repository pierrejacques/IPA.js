import { isNumber, mean, times } from 'lodash';
import cache from './Cache';

const fixLength = (len, item) => {
    const arr = item.target;
    const mocker = item.mocker;
    if (arr.length > len) {
        arr.splice(len);
    } else {
        arr.push(...times(len - arr.length, mocker));
    }
};

const strategies = {
    most(val) {
        const lengths = val.map(item => item.target.length);
        const freq = new Map();
        lengths.forEach(length => {
            if (freq.get(length) === undefined) {
                freq.set(length, 0);
            }
            freq.set(length, freq.get(length) + 1);
        });
        const sorted = [...freq].sort((a, b) => a[1] < b[1]).map(item => item[0]);
        return sorted[0];
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

export default (strategyIn) => {
    const strategy = strategies[strategyIn] || strategies['shortest'];
    cache.forEach((value, key) => {
        const targetLen = isNumber(key) ? key : strategy(value);
        value.forEach(item => {
            fixLength(targetLen, item);
        });
    });
};