import { isArray, isType } from '../type/index.js';

function isValidNumber(val) {
    return val === undefined || val === 'default' || isType(val, Number);
}

function isValidDict(val) {
    if (val === undefined || val === 'default') return true;
    if (!isArray(val)) return false;
    let ret = true;
    val.forEach((item) => {
        ret = ret && isType(item, String);
    });
    return ret;
}

function isValidStrategy(val) {
    return new Set([
        undefined,
        'default',
        'most',
        'shortest',
        'longest',
        'average',
    ]).has(val);
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
