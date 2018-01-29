import stategies from './stategies/index.js'


function getRecursion(method) {
    const execute = (template, ...params) => {
        let ret;
        for (let i = 0; i < stategies.length; i++) {
            const stategy = stategies[i];
            if (stategy.condition(template)) {
                ret = stategy[method](template, ...params, execute);
                break;
            }
        }
        return ret;
    }
    return execute;
}


export default class IPA {
    constructor(template) {
        this.template = template;
    }

    check(data) {
        const check = getRecursion('check');
        check.cache = {};
        return check(this.template, data);
    }

    guarantee(data) {
        return execute(this.template, data);
    }

    mock(config = {}) {
        const mock = getRecursion('mock');
        mock.cache = config;
        return mock(this.template);
    }
}
