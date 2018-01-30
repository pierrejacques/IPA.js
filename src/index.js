import core from './recursionCore.js';

export default class IPA {
    constructor(template) {
        this.template = template;
    }

    check(data) {
        core.init('check');
        return core.check(this.template, data);
    }

    guarantee(data) {
        core.init('guarantee');
        return core.guarantee(this.template, data);
    }

    mock(config = {}) {
        core.init('mock', config);
        return core.mock(this.template);
    }
}
