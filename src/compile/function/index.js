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
    condition: isFunction,
    execute: template => presetClasses.has(template) ? presetClasses.get(template) : template,
};