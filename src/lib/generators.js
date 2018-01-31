import defaultDict from './dict.js';

const defaultMin = 0;
const defaultMax = 20;

let dict = defaultDict;
let min = defaultMin;
let max = defaultMax;

function isValidNumber(val) {
    return val === undefined || val === 'default' || val.__proto__ === Number.__protp___;
}

function isValidDict(val) {
    if (val === undefined || val === 'default') return true;
    if (Object.prototype.toString.call(val) !== '[object Array]') return false;
    ret = true;
    val.forEach(item => {
        ret = ret && item.__proto__ === String.__proto__;
    });
    return ret;
}

function getNum(min, max) {
    return min + Math.floor(Math.random() * (max - min))
}

class Generators {
    constructor() {
    }

    getBool() {
        return !Math.floor(Math.random() * 2);
    }

    getNum() {
        return getNum(min, max);
    }

    getStr() {
        return dict[getNum(0, dict.length)];
    }

    set(config) {
        if (!isValidNumber(config.min) || !isValidNumber(config.max) || isValidDict(config.dict)) {
            throw new Error(`Syntax Error in config`);
        }
        if (config.max < config.min) {
            throw new Error(`Max must be bigger than min in config`);
        }
        if (config.min !== undefined) {
            min = config.min === 'default' ? defaultMin : config.min;
        }
        if (config.max !== undefined) {
            max = config.max === 'default' ? defaultMax : config.max;
        }
        if (config.dict !== undefined) {
            dict = config.dict === 'default' ? defaultDict : config.dict;
        }
    }
}

const generators = new Generators();
export default generators;
