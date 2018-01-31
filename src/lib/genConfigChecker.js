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

export default config => {
    if (!isValidNumber(config.min) || !isValidNumber(config.max) || !isValidDict(config.dict)) {
        throw new Error(`Syntax Error in config`);
    }
    if (config.max < config.min) {
        throw new Error(`Max must be bigger than min in config`);
    }
}
