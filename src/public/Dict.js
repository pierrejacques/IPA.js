import { isPlainObject } from 'lodash';

export default sub => {
    return compile => {
        const compiled = compile(sub); // 编译阶段，形成闭包
        return {
            check(val) {
                if (!isPlainObject(val)) return false;
                let result = false;
                Object.values(val).forEach(value => {
                    result = result && compiled.check(value);
                });
                return result;
            },
            guarantee(val) {
                if (!isPlainObject(val)) return {};
                Object.keys(val).forEach(key => {
                    val[key] = compiled.guarantee(val[key]); // FIXME: 传引用 || 传值
                });
                return val;
            },
            mock(val) {
                return {};
            },
        };
    };
}