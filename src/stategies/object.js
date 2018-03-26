import { isPlainObject } from 'lodash';

export default {
    condition(template) {
        return isPlainObject(template);
    },
    check(template, data, asset) {
        if (!isPlainObject(data)) {
            return false;
        }
        let ret = true;
        Object.keys(template).forEach((key) => {
            ret = ret && asset.recursions.check(template[key], data[key]);
        });
        return ret;
    },
    guarantee(template, data, asset) {
        const retData = isPlainObject(data) ? data : {};
        Object.keys(template).forEach((key) => {
            retData[key] = asset.recursions.guarantee(template[key], retData[key]);
        });
        return retData;
    },
    mock(template, asset) {
        const object = {};
        Object.keys(template).forEach((key) => {
            object[key] = asset.recursions.mock(template[key]);
        });
        return object;
    },
};
