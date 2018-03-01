import { isArray } from '../type/index.js';

function isValidNumber(val) {
    return val === undefined || val === 'default' || val.__proto__ === Number.prototype;
}

function isValidDict(val) {
    if (val === undefined || val === 'default') return true;
    if (!isArray(val)) return false;
    let ret = true;
    val.forEach((item) => {
        ret = ret && item.__proto__ === String.prototype;
    });
    return ret;
}

function isValidStrategy(val) {
    const set = new Set([
        undefined,
        'default',
        'most',
        'shortest',
        'longest',
        'average',
    ]);
    return set.has(val);
}

export default (config) => {
    if (!isValidNumber(config.min)
    || !isValidNumber(config.max)
    || !isValidNumber(config.minLen)
    || !isValidNumber(config.maxLen)
    || !isValidDict(config.dict)
    || !isValidStrategy(config.strategy)) {
        throw new Error('Syntax Error in config');
    }
    if (config.max < config.min) {
        throw new Error('Max must be bigger than min in config');
    }
};
