import { isFunction } from 'lodash';
import arrayStrat from './arrayStrat';
import booleanStrat from './booleanStrat';
import numberStrat from './numberStrat';
import objectStrat from './objectStrat';
import stringStrat from './stringStrat';

const presetClasses = new Map()
.set(String, stringStrat)
.set(Number, numberStrat)
.set(Boolean, booleanStrat)
.set(Array, arrayStrat)
.set(Object, objectStrat)

export default {
    condition(template) {
        return isFunction(template);
    },
    execute(template) {
        if (presetClasses.has(template)) {
            return presetClasses.get(template);
        }
        return () => ({ // 向前兼容的做法
            check: val => template(val).isValid,
            guarantee: val => template(val).value,
            mock: val => {
                const result = template(val);
                return result.hasOwnProperty('gen') ? result.gen : result.value;
            },
        });
    },
};