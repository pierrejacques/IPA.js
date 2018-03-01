import { isObject } from '../type/index.js';

export default {
    condition(template) {
        return typeof template === 'function' && template !== String && template !== Number && template !== Boolean && !isObject(template);
    },
    check(template, data) {
        return template(data).isValid;
    },
    guarantee(template, data) {
        return template(data).value;
    },
    mock(template, asset) {
        const value = template(asset.seed).value;
        if (!template(value).isValid) {
            throw new Error(`Mock failed, custom function illegal:
                Custom function should always outputs valid value whatever the input is.`);
        }
        return value;
    },
};
