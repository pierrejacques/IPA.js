import { fixLength } from '../lib/fixers.js';
import { isArray, isLength, isString } from 'lodash';

function isValidLength(template, data, cache) {
    const para = template[1];
    if (para === undefined) {
        return true;
    }
    if (isLength(para) && data.length !== para) {
        return false;
    }
    if (typeof para === 'string') {
        if (cache[para] === undefined) {
            cache[para] = data.length;
        } else if (cache[para] !== data.length) {
            return false;
        }
    }
    return true;
}

function isTemplateDefined(template) {
    return template[0] !== undefined;
}


export default {
    condition(template) {
        return isArray(template);
    },
    check(template, data, asset) {
        if (!isArray(data)) {
            return false;
        }
        if (!isValidLength(template, data, asset.cache)) {
            return false;
        }
        if (data.length === 0) {
            return true;
        }
        if (isTemplateDefined(template)) {
            let ret = true;
            data.forEach((item) => {
                ret = ret && asset.recursions.check(template[0], item);
            });
            return ret;
        }
        return true;
    },
    guarantee(template, data, asset) {
        const retData = isArray(data) ? data : [];
        const para = template[1];
        if (para !== undefined) {
            if (isLength(para) && retData.length !== para) {
                fixLength({
                    itemTemplate: template[0],
                    targetLength: para,
                    array: retData,
                    mocker: asset.recursions.guarantee,
                });
            }
            if (isString(para)) {
                if (asset.cache[para] === undefined) {
                    asset.cache[para] = [];
                }
                asset.cache[para].push({
                    length: retData.length,
                    itemTemplate: template[0],
                    array: retData,
                });
            }
        }
        if (retData.length !== 0 && isTemplateDefined(template)) {
            retData.forEach((_, idx) => {
                retData[idx] = asset.recursions.guarantee(template[0], retData[idx]);
            });
        }
        return retData;
    },
    mock(template, asset) {
        const array = [];
        let len = asset.generators.getLength();
        if (typeof template[1] === 'number') {
            len = template[1];
        }
        if (typeof template[1] === 'string') {
            if (asset.cache[template[1]]) {
                len = asset.cache[template[1]];
            } else {
                asset.cache[template[1]] = len;
            }
        }
        if (isTemplateDefined(template)) {
            for (let i = 0; i < len; i++) {
                array.push(asset.recursions.mock(template[0]));
            }
        }
        return array;
    },
};
