let dict = ['uninited'];
let min = 0;
let max = 0;
let minLen = 0;
let maxLen = 0;

function getNum(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export default {

    getBool() {
        return !Math.floor(Math.random() * 2);
    },

    getNum() {
        return getNum(min, max);
    },

    getLength() {
        return getNum(minLen, maxLen);
    },

    getStr() {
        return dict[getNum(0, dict.length)];
    },

    set(config) {
        min = config.min;
        max = config.max;
        minLen = config.minLen;
        maxLen = config.maxLen;
        dict = config.dict;
    },
};
