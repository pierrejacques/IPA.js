import stategies from './stategies/index.js'


function getRecursion(method) {
    const execute = (...params) => {
        let ret;
        for (let i = 0; i < stategies.length; i++) {
            const stategy = stategies[i];
            if (stategy.condition(params[1])) { // TODO: 参数管理
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
        this.template = template;
    }

    check(data) {
        const check = getRecursion('check');
        check.cache = {};
        return check(data, this.template)
    }

    guarantee(data) {
        return execute(data, this.template);
    }

    mock(config) {
        return getRecursion('mock')(config, this.template);
    }
}
