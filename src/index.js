import stategies from './stategies/index.js'


function getRecursion(method) {
    const execute = (...params) => {
        let ret;
        for (let i = 0; i < stategies.length; i++) {
            const stategy = stategies[i];
            if (stategy.condition(template)) {
                ret = stategy[method](...params, execute);
                break;
            }
        }
        return ret;
    }
    return execute;
}


export default class IPA {
    constructor(template) {
        checkTemplate(template);
        this.template = template;
    }

    check(data) {
        return getRecursion('check')(data, this.template);
    }

    guarantee(data) {
        return getRecursion('guarantee')(data, this.template);
    }

    mock(config) {
        return getRecursion('mock')(config, this.template);
    }
}
