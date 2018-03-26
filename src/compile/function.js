import { 
    isFunction,
    isString,
    isNumber,
    isBoolean,
    isArray,
    isPlainObject,
} from 'lodash';

const presetClasses = new Map()
.set(String, {
    default: '',
    checker: isString,
})
.set(Number, {
    default: 0,
    checker: isNumber,
})
.set(Boolean, {
    default: false,
    checker: isBoolean,
})
.set(Array, {
    default: [],
    checker: isArray,
})
.set(Object, {
    default: {},
    checker: isPlainObject,
});

function class2function(obj) {
    return (val) => {
        const isValid = obj.checker(val);
        return {
            isValid,
            value: isValid ? data : obj.default,
        };
    };
}

export default {
    condition(template) {
        return isFunction(template);
    },
    execute(template) {
        if (presetClasses.has(template)) {
            return class2function(presetClasses.get(template));
        }
        return template;
    },
};