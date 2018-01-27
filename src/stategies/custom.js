export default {
    condition: template =>
        (typeof template === 'function' && template !== String && template !== Number && template !== Boolean),
    check(data, template, cb) {

    },
    guarantee(data, template, cb) {

    },
    mock(template, cb) {

    }
}
