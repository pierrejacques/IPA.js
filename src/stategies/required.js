export default {
    condition(template) {
        return template === null;
    },
    check(template, data) {
        return data !== undefined;
    },
    guarantee(template, data) {
        return this.check(template, data) ? data : this.mock(template);
    },
    mock(template) {
        return null;
    },
}
