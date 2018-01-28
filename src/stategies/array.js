const condition = template => Object.prototype.toString.call(template) === '[object Array]';

const checkLength = (data, para, cache) => {
    if (typeof para === 'number' && data.length !== para) {
        return false;
    }
    if (typeof para === 'string') {
        if (!cache[para]) {
            cache[para] = data.length;
        } else if (cache[para] !== data.length) {
            return false;
        }
    }
    return true;
};

const check = (data, template, cb) => {
    if (Object.prototype.toString.call(data) !== '[object Array]') {
        return false;
    }
    if (template[1] && !checkLength(data, template[1], cb.cache)) {
        return false;
    }
    if (data.length === 0) {
        return true;
    }
    let ret = true;
    data.forEach(item => {
        ret = ret && cb(item, template[0]);
    });
    return ret;
};


const guarantee = (data, template, cb) => {

};


const mock = (config, template, cb) => {

};


export default {
    condition,
    check,
    guarantee,
    mock,
};
