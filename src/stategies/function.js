import { isFunction } from 'lodash';

export default {
    condition(template) {
        return isFunction(template) && 
            template !== String && 
            template !== Number && 
            template !== Boolean
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
