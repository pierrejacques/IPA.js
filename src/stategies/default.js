const condition = template => {
    const type = typeof template;
    return type !== 'function' && type !== 'object' && type !== 'undefined' && type !== 'null';
};

const check = (data, template, cb) => {
    if (typeof template !== typeof data) {
        return false;
    }
    return true;
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
