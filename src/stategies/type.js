const condition = template => {
    const validConstructors = new Set([
        String,
        Number,
        Boolean,
        Array,
        Object,
    ]);
    return validConstructors.has(template);
};


const check = (data, template, cb) =>  {
    if (!data) {
        return false;
    }
    return data.__proto__ === template.prototype
};


const guarantee = (data, template, cb) => {

};


const mock = (template, cb) => {

};


export default {
    condition,
    check,
    guarantee,
    mock,
}
