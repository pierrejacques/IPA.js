const guarantee = (data, template, cb) => {

};

const mock = (template, cb) => {

};

export default {
    condition(template) {
        return template === null;
    },
    check(template, data, cb) {
        return data !== undefined;
    },
    guarantee(template, data, cb) {

    },
    mock(template, cb) {
        return null;
    },
}
