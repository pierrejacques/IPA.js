const condition = template =>
    (typeof template === 'function' && template !== String && template !== Number && template !== Boolean);

const check = (data, template, cb) => template(data).isValid;

const guarantee = (data, template, cb) => {};

const mock = (config, template, cb) => {};

export default {
    condition,
    check,
    guarantee,
    mock,
}
