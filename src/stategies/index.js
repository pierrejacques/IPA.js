import requiredStrategy from './required.js';
import arrayStrategy from './array.js';
import customStrategy from './custom.js';
import defaultStrategy from './default.js';
import objectStrategy from './object.js';
import typeStrategy from './type.js';

export default [
    requiredStrategy,
    typeStrategy,
    defaultStrategy,
    objectStrategy,
    arrayStrategy,
    customStrategy,
];
