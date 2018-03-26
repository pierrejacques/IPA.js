import { isPlainObject } from 'lodash';

// TODO: 在这里尝试设计IPA的递归结构

export default subtemp => {
    return broadcast => ({
        check(val) {
            if (!isPlainObject(val)) return false;
            let result = false;
            Object.values(val).forEach(value => {
                result = result && broadcast(subtemp).check(value);
            });
            return result;
        },
        guarantee(val) {
            if (!isPlainObject(val)) return {};
            Object.keys(val).forEach(key => {
                val[key] = broadcast(subtemp).guarantee(val[key]); // FIXME: 传引用 || 传值
            });
        },
        mock(val) {
            return {};
        },
    });
}