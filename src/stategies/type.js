const condition = template => (template === String || template === Number || template === Boolean);


const check = (data, template, cb) => data.__proto__.constructor === template;


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
