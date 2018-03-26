import requiredStrategy from './required.js';
import arrayStrategy from './array.js';
import functionStrategy from './function.js';
import defaultStrategy from './default.js';
import objectStrategy from './object.js';
import typeStrategy from './type.js';

export default [
    requiredStrategy,
    typeStrategy,
    defaultStrategy,
    objectStrategy,
    arrayStrategy,
    functionStrategy,
];
