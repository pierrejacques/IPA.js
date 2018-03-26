import { isArray, isNumber, isString } from 'lodash';

function isValidNumber(val) {
    return val === undefined || val === 'default' || isNumber(val);
}

function isValidDict(val) {
    if (val === undefined || val === 'default') return true;
    if (!isArray(val)) return false;
    let ret = true;
    val.forEach((item) => {
        ret = ret && isString(item);
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
