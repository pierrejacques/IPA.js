export default {
    condition: template => {
        const type = typeof template;
        return type !== 'function' && type !== 'object' && type !== 'undefined';
    },
    check(data, template, cb) {

    },
    guarantee(data, template, cb) {

    },
    mock(template, cb) {

    }
}
