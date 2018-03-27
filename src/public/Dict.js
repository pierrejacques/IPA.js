import { isPlainObject } from 'lodash';

export default template => {
    return compile => {
        const compiled = compile(template); // 编译阶段，形成闭包
        return {
            check(val) {
                if (!isPlainObject(val)) return false;
                let result = true;
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
            mock() {
                return {};
            },
        };
    };
}