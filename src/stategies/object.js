const condition = template => Object.prototype.toString.call(template) === '[object Object]';

const check = (data, template, cb) => {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
        return false;
    }
    let ret = true;
    Object.keys(template).forEach(key => {
        ret = ret && cb(data[key], template[key]);
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
    mock
}
